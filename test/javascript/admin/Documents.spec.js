import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import axios from 'axios'
import DocumentsIndex from '@/components/Documents/Index.vue'
import DocumentForm from '@/components/Documents/Form.vue'
import NestedDraggable from '@/components/Documents/nested-draggable.vue'
import { mountAdmin, flush, click, fill, text, dialog } from './support.js'

vi.mock('axios')

// Arbre renvoyé par GET /api/documents (Api::DocumentsController#index)
const tree = () => [
  {
    id: 1, name: 'Statuts', type: 'folder', order: 1,
    categories: [
      {
        id: 3, name: 'Archives', type: 'folder', order: 1, categories: [],
        documents: [{ id: 30, name: 'statuts_2010', description: null, type: 'document', href: '/rails/blob/30' }],
      },
    ],
    documents: [
      { id: 10, name: 'statuts_2024', description: 'Version adoptée en assemblée générale extraordinaire du 12 mars 2024 à Lyon', type: 'document', href: '/rails/blob/10' },
      { id: 11, name: 'Site de la FNADF', description: null, type: 'url', url: 'https://add.fr', href: 'https://add.fr' },
    ],
  },
  { id: 2, name: 'Comptes', type: 'folder', order: 2, categories: [], documents: [] },
  {
    id: -1, name: 'Non répertoriés', type: 'folder', order: 3, categories: [],
    documents: [{ id: 20, name: 'divers', description: 'Note', type: 'document', href: '/rails/blob/20' }],
  },
]

async function mountIndex(items = tree()) {
  axios.get.mockResolvedValue({ data: items })
  const mounted = mountAdmin(DocumentsIndex)
  await flush()
  return mounted
}

// Dossiers de premier niveau de l'arbre
const folders = (wrapper) => wrapper.findAll('.v-list-group').filter(g => !g.element.parentElement.closest('.v-list-group'))
// Ligne (dossier ou document) dont le titre commence par `name`
function row(wrapper, name) {
  const title = [...wrapper.element.querySelectorAll('.v-list-item-title')].find(t => t.textContent.trim().startsWith(name))
  return title.closest('.v-list-item')
}
// Bouton d'action (icône) d'une ligne
const action = (rowElement, icon) => rowElement.querySelector(`.${icon}`).closest('button')

describe('Documents (admin) : arborescence', () => {
  beforeEach(() => vi.resetAllMocks())

  it('charge l’arborescence et affiche les catégories avec leur nombre d’éléments', async () => {
    const { wrapper } = await mountIndex()
    expect(axios.get).toHaveBeenCalledWith('/api/documents', {})
    const titles = folders(wrapper).map(g => text(g.find('.v-list-item-title')))
    expect(titles).toEqual(['Statuts (3)', 'Comptes (0)', 'Non répertoriés (1)'])
  })

  it('sans catégorie : invite à en créer', async () => {
    const { wrapper } = await mountIndex([])
    expect(text(wrapper)).toContain('Glissez ici une catégorie...')
  })

  it('« Non répertoriés » ne peut être ni déplacé, ni renommé, ni supprimé', async () => {
    const { wrapper } = await mountIndex()
    const header = row(wrapper, 'Non répertoriés')
    expect(header.querySelector('.handle')).toBeNull()
    expect(header.querySelector('.mdi-pen')).toBeNull()
    expect(header.querySelector('.mdi-delete')).toBeNull()
    expect(row(wrapper, 'Statuts (3)').querySelector('.handle')).not.toBeNull()
  })

  it('un dossier liste ses sous-catégories et documents, avec extrait de description', async () => {
    const { wrapper } = await mountIndex()
    const [statuts, comptes] = folders(wrapper)
    expect(text(statuts)).toContain('Archives (1)')
    expect(text(statuts)).toContain('statuts_2024 (Version adoptée en assemblée générale extraordinai...)')
    expect(text(row(wrapper, 'Site de la FNADF'))).toBe('Site de la FNADF')
    expect(row(wrapper, 'Site de la FNADF').querySelector('.mdi-link')).not.toBeNull()
    expect(text(comptes)).toContain('Glissez ici une sous-catégorie...')
    expect(text(comptes)).toContain('Glissez ici un document...')
  })

  it('le chevron ouvre et referme un dossier', async () => {
    const { wrapper } = await mountIndex()
    const header = row(wrapper, 'Statuts (3)')
    action(header, 'mdi-chevron-down').click()
    await flush()
    expect(header.querySelector('.mdi-folder-open')).not.toBeNull()
    action(header, 'mdi-chevron-up').click()
    await flush()
    expect(header.querySelector('.mdi-folder-open')).toBeNull()
  })

  it('le téléchargement ouvre le fichier ou le lien dans un nouvel onglet', async () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null)
    const { wrapper } = await mountIndex()
    action(row(wrapper, 'statuts_2024'), 'mdi-download').click()
    expect(open).toHaveBeenCalledWith('/rails/blob/10', '_blank')
    action(row(wrapper, 'Site de la FNADF'), 'mdi-link').click()
    expect(open).toHaveBeenCalledWith('https://add.fr', '_blank')
    wrapper.vm.downloadDocument({})
    expect(open).toHaveBeenCalledTimes(2)
    open.mockRestore()
  })

  it('les documents d’une sous-catégorie peuvent aussi être téléchargés, modifiés et supprimés', async () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null)
    const { wrapper } = await mountIndex()
    const archived = row(wrapper, 'statuts_2010')

    action(archived, 'mdi-download').click()
    expect(open).toHaveBeenCalledWith('/rails/blob/30', '_blank')

    action(archived, 'mdi-pen').click()
    await flush()
    expect(text(dialog())).toContain('Modifier un document')
    expect(dialog().querySelector('input').value).toBe('statuts_2010')
    await click('Annuler', dialog())

    axios.delete.mockResolvedValue({ data: { success: true } })
    action(archived, 'mdi-delete').click()
    await flush()
    expect(axios.delete).toHaveBeenCalledWith('/api/documents/30')

    // et la sous-catégorie elle-même peut être renommée
    action(row(wrapper, 'Archives'), 'mdi-pen').click()
    await flush()
    expect(wrapper.vm.localCategory.id).toBe(3)
    open.mockRestore()
  })

  it('réordonner envoie l’arbre complet puis recharge', async () => {
    const { wrapper } = await mountIndex()
    axios.post.mockResolvedValue({ data: { success: true } })
    axios.get.mockClear()
    wrapper.findAllComponents(NestedDraggable)[0].vm.$emit('change')
    await flush()
    expect(axios.post).toHaveBeenCalledWith('/api/update_order_documents', { items: tree() })
    expect(axios.get).toHaveBeenCalledWith('/api/documents', {})
  })

  it('un changement dans une sous-catégorie remonte jusqu’à l’écran', async () => {
    const { wrapper } = await mountIndex()
    axios.post.mockResolvedValue({ data: { success: true } })
    const nested = wrapper.findAllComponents(NestedDraggable).find(c => c.props('item').id === 3)
    nested.vm.$emit('change')
    await flush()
    expect(axios.post).toHaveBeenCalledWith('/api/update_order_documents', { items: tree() })
  })

  it('un échec de rangement ou de chargement est journalisé sans planter', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { wrapper } = await mountIndex()
    axios.post.mockRejectedValue(new Error('500'))
    wrapper.vm.updateItems()
    axios.get.mockRejectedValue(new Error('500'))
    wrapper.vm.refreshItems()
    await flush()
    expect(error).toHaveBeenCalledTimes(2)
    error.mockRestore()
  })
})

describe('Documents (admin) : catégories', () => {
  beforeEach(() => vi.resetAllMocks())

  it('crée une catégorie (POST /api/categories en multipart)', async () => {
    const { wrapper } = await mountIndex()
    await fill('Nom de la catégorie', 'Procès-verbaux')
    axios.post.mockResolvedValue({ data: {} })
    await click('Ajouter')
    const [url, body] = axios.post.mock.calls[0]
    expect(url).toBe('/api/categories')
    expect(body).toBeInstanceOf(FormData)
    expect(body.get('category[name]')).toBe('Procès-verbaux')
    expect(wrapper.vm.localCategory).toEqual({})
    expect(axios.get).toHaveBeenLastCalledWith('/api/documents', {})
  })

  it('refuse une catégorie sans nom', async () => {
    const { snackbar } = await mountIndex()
    await click('Ajouter')
    expect(snackbar).toHaveBeenCalledWith('Vous devez saisir un nom de catégorie !', 'warning')
    expect(axios.post).not.toHaveBeenCalled()
  })

  it('renomme une catégorie (PUT /api/categories/:id) ou annule', async () => {
    const { wrapper } = await mountIndex()
    action(row(wrapper, 'Statuts (3)'), 'mdi-pen').click()
    await flush()
    expect(text(wrapper)).toContain('Modifier une catégorie')
    expect(wrapper.find('input').element.value).toBe('Statuts')

    await click('Annuler')
    expect(text(wrapper)).toContain('Ajouter une catégorie')

    action(row(wrapper, 'Statuts (3)'), 'mdi-pen').click()
    await flush()
    await fill('Nom de la catégorie', 'Statuts et règlements')
    axios.put.mockResolvedValue({ data: {} })
    await click('Modifier')
    expect(axios.put.mock.calls[0][0]).toBe('/api/categories/1')
    expect(axios.put.mock.calls[0][1].get('category[name]')).toBe('Statuts et règlements')
  })

  it('l’enregistrement d’une catégorie peut échouer sans planter', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { wrapper } = await mountIndex()
    await fill('Nom de la catégorie', 'X')
    axios.post.mockRejectedValue(new Error('422'))
    await click('Ajouter')
    expect(error).toHaveBeenCalled()
    expect(wrapper.vm.localCategory.name).toBe('X')
    error.mockRestore()
  })

  it('supprime une catégorie après confirmation du navigateur', async () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValueOnce(false).mockReturnValueOnce(true)
    const { wrapper } = await mountIndex()
    const header = row(wrapper, 'Statuts (3)')

    action(header, 'mdi-delete').click()
    await flush()
    expect(axios.delete).not.toHaveBeenCalled()

    axios.delete.mockResolvedValue({ data: { success: true } })
    action(header, 'mdi-delete').click()
    await flush()
    expect(confirm).toHaveBeenCalledWith('Voulez-vous vraiment supprimer cette catégorie ?')
    expect(axios.delete).toHaveBeenCalledWith('/api/categories/1')
    confirm.mockRestore()
  })

  it('les échecs de suppression sont journalisés', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { wrapper } = await mountIndex()
    axios.delete.mockRejectedValue(new Error('500'))
    wrapper.vm.deleteCategory({ id: 1 })
    wrapper.vm.deleteDocument({ id: 10 })
    await flush()
    expect(error).toHaveBeenCalledTimes(2)
    error.mockRestore()
    window.confirm.mockRestore()
  })
})

describe('Documents (admin) : dépôt de fichiers et liens', () => {
  beforeEach(() => vi.resetAllMocks())

  const fileA = new File(['a'], 'Rapport moral.pdf', { type: 'application/pdf' })
  const fileB = new File(['b'], 'Budget.xlsx')

  it('envoie les fichiers déposés (POST /api/documents, files[]) puis recharge', async () => {
    const { wrapper } = await mountIndex()
    // VFileUpload émet la liste complète à chaque ajout
    wrapper.findComponent({ name: 'VFileUpload' }).vm.$emit('update:modelValue', [fileA])
    wrapper.findComponent({ name: 'VFileUpload' }).vm.$emit('update:modelValue', [fileA, fileB])

    axios.post.mockResolvedValue({ data: { success: true } })
    await click('Envoyer')

    const [url, body, options] = axios.post.mock.calls[0]
    expect(url).toBe('/api/documents')
    expect(body.getAll('files[]').map(f => f.name)).toEqual(['Rapport moral.pdf', 'Budget.xlsx'])
    expect(options).toEqual({ headers: { 'Content-Type': 'multipart/form-data' } })
    expect(axios.get).toHaveBeenLastCalledWith('/api/documents', {})
  })

  it('un second dépôt dans la même session fonctionne', async () => {
    const { wrapper } = await mountIndex()
    const upload = wrapper.findComponent({ name: 'VFileUpload' })
    axios.post.mockResolvedValue({ data: { success: true } })
    upload.vm.$emit('update:modelValue', [fileA])
    await click('Envoyer')
    upload.vm.$emit('update:modelValue', [fileB])
    await click('Envoyer')
    expect(axios.post).toHaveBeenCalledTimes(2)
    expect(axios.post.mock.calls[1][1].getAll('files[]').map(f => f.name)).toEqual(['Budget.xlsx'])
  })

  it('sans fichier choisi : avertit sans appeler l’API', async () => {
    const { snackbar } = await mountIndex()
    await click('Envoyer')
    expect(snackbar).toHaveBeenCalledWith('Vous devez sélectionner au moins un fichier !', 'warning')
    expect(axios.post).not.toHaveBeenCalled()
  })

  it('ajoute un lien (POST /api/documents avec name, url, description)', async () => {
    const { wrapper } = await mountIndex()
    await click('Ajouter un lien')
    const form = dialog()
    expect(text(form)).toContain('Modifier un document')
    await fill('Nom', 'Annuaire', form)
    await fill('Lien', 'https://annuaire.add.fr', form)
    await fill('description', 'Annuaire public', form)

    axios.post.mockResolvedValue({ data: { success: true } })
    axios.get.mockClear()
    await click('Enregistrer', form)
    expect(axios.post).toHaveBeenCalledWith('/api/documents', { name: 'Annuaire', url: 'https://annuaire.add.fr', description: 'Annuaire public' })
    expect(wrapper.vm.dialog.update).toBe(false)
    expect(axios.get).toHaveBeenCalledWith('/api/documents', {})
  })

  it('modifie un document existant (PUT /api/documents/:id)', async () => {
    const { wrapper } = await mountIndex()
    action(row(wrapper, 'statuts_2024'), 'mdi-pen').click()
    await flush()
    const form = dialog()
    expect(form.querySelector('input').value).toBe('statuts_2024')
    await fill('Nom', 'Statuts 2024', form)

    axios.put.mockResolvedValue({ data: { success: true } })
    await click('Enregistrer', form)
    expect(axios.put).toHaveBeenCalledWith('/api/documents/10', {
      name: 'Statuts 2024', url: undefined,
      description: 'Version adoptée en assemblée générale extraordinaire du 12 mars 2024 à Lyon',
    })
    expect(wrapper.vm.dialog.update).toBe(false)
  })

  it('supprime un document puis recharge', async () => {
    const { wrapper } = await mountIndex()
    axios.delete.mockResolvedValue({ data: { success: true } })
    axios.get.mockClear()
    action(row(wrapper, 'statuts_2024'), 'mdi-delete').click()
    await flush()
    expect(axios.delete).toHaveBeenCalledWith('/api/documents/10')
    expect(axios.get).toHaveBeenCalledWith('/api/documents', {})
  })
})

describe('Formulaire de document', () => {
  beforeEach(() => vi.resetAllMocks())
  afterEach(() => vi.restoreAllMocks())

  it('les erreurs d’enregistrement sont journalisées et le formulaire reste ouvert', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    axios.put.mockRejectedValue(new Error('422'))
    axios.post.mockRejectedValue(new Error('422'))
    const { wrapper } = mountAdmin(DocumentForm, { props: { document: { id: 4, name: 'x' } } })
    wrapper.vm.save()
    await flush()
    await wrapper.setProps({ document: { name: 'y' } })
    wrapper.vm.save()
    await flush()
    expect(log).toHaveBeenCalledTimes(2)
    expect(wrapper.emitted('close')).toBeUndefined()
  })

  it('le bouton de fermeture émet close', async () => {
    const { wrapper } = mountAdmin(DocumentForm, { props: { document: {} } })
    await click('Annuler')
    wrapper.find('.mdi-close').element.closest('button').click()
    expect(wrapper.emitted('close')).toHaveLength(2)
  })
})
