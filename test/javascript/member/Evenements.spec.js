import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import axios from 'axios'
import EventsIndex from '@/components/Events/Index.vue'
import EventForm from '@/components/Events/Form.vue'
import { mountMember, memberStore, flush, pageText, buttonByText } from './support.js'

vi.mock('axios')

// Référentiels de GET /api/referentiels/events
const referentiels = {
  categories: [{ id: 1, name: 'Pastorale' }, { id: 2, name: 'Congrès' }],
  levels: ['Pasteur APE', 'Pasteur stagiaire', 'Membre'],
  structures: [{ id: 5, name: 'UNADF' }, { id: 7, name: 'ADD Jeunesse' }],
}
// Événement de GET /api/events (include category et structure)
const listed = (id, overrides = {}) => ({
  id, title: `Pastorale ${id}`, start_at: '2026-11-02T09:30:00', end_at: '2026-11-03T17:00:00',
  structure: { id: 5, name: 'UNADF' }, category: { id: 1, name: 'Pastorale' }, ...overrides,
})
// GET /api/events/:id (Api::EventsController#show)
const showResponse = {
  event: {
    id: 3, title: 'Congrès national', structure_id: 5, start_at: '2026-11-02T09:30:00', end_at: '2026-11-04T18:00:00',
    description: 'Trois jours', category: { id: 2, name: 'Congrès' }, structure: { id: 5, name: 'UNADF' },
    images: [], attachments: [],
  },
  files: [{ id: 31, name: 'programme.pdf', url: '/rails/blobs/programme.pdf' }],
  accesses: ['Pasteur APE'],
}

function mockApi({ events = [listed(1), listed(2, { title: 'Congrès jeunesse', category: { id: 2, name: 'Congrès' } })] } = {}) {
  axios.get.mockImplementation((url) => {
    if (url === '/api/events') return Promise.resolve({ data: { events } })
    if (url === '/api/referentiels/events') return Promise.resolve({ data: referentiels })
    if (url === '/api/events/3') return Promise.resolve({ data: JSON.parse(JSON.stringify(showResponse)) })
    return Promise.reject(new Error('URL inattendue : ' + url))
  })
}

const rows = (wrapper) => wrapper.findAll('tbody tr').map(r => r.findAll('td').map(td => td.text().replace(/\s+/g, ' ').trim()).filter(Boolean).join(' | '))

describe('Gestion des événements (responsable)', () => {
  beforeEach(() => { vi.clearAllMocks(); mockApi() })
  afterEach(() => { document.body.innerHTML = '' })

  it('charge les événements et les référentiels de l’espace courant', async () => {
    const { wrapper } = mountMember(EventsIndex, { props: { domain: 'association' } })
    await flush()
    expect(axios.get).toHaveBeenCalledWith('/api/events', { params: { domain: 'association' } })
    expect(axios.get).toHaveBeenCalledWith('/api/referentiels/events', { params: { domain: 'association' } })
    expect(rows(wrapper)).toEqual([
      'Pastorale 1 | Du 02/11/2026 09:30 au 03/11/2026 17:00 | UNADF | Pastorale',
      'Congrès jeunesse | Du 02/11/2026 09:30 au 03/11/2026 17:00 | UNADF | Congrès',
    ])
  })

  it('liste vide : message et bouton d’ajout ; recherche sans résultat : bouton pour l’effacer', async () => {
    mockApi({ events: [] })
    const { wrapper } = mountMember(EventsIndex)
    await flush()
    expect(pageText()).toContain('Aucun événement pour le moment')

    mockApi()
    await wrapper.find('[aria-label="Actualiser la liste"]').trigger('click')
    await flush()
    expect(rows(wrapper)).toHaveLength(2)

    await wrapper.find('input').setValue('zzz')
    await flush()
    expect(pageText()).toContain('Aucun événement ne correspond à « zzz »')
    buttonByText('Effacer la recherche').click()
    await flush()
    expect(rows(wrapper)).toHaveLength(2)
  })

  it('« Ajouter un événement » ouvre un formulaire vide', async () => {
    const { store } = mountMember(EventsIndex)
    await flush()
    buttonByText('Ajouter un événement').click()
    await flush()
    expect(store.state.eventsStore.dialogForm).toBe(true)
    expect(store.state.eventsStore.item).toEqual({ id: null, title: '', start_at: '', end_at: '', description: '', accesses: [] })
    expect(pageText()).toContain('Ajouter un événement')
    expect(pageText()).toContain('Date et heure de début')
  })

  it('modifier : charge l’événement (catégorie, fichiers, accès) dans le formulaire', async () => {
    const { wrapper, store } = mountMember(EventsIndex)
    await flush()
    mockApi({ events: [listed(3)] })
    await wrapper.find('[aria-label="Actualiser la liste"]').trigger('click')
    await flush()
    await wrapper.find('[aria-label="Modifier l\'événement"]').trigger('click')
    await flush()

    expect(axios.get).toHaveBeenCalledWith('/api/events/3', {})
    const item = store.state.eventsStore.item
    expect(item.category).toBe('Congrès')
    expect(item.accesses).toEqual(['Pasteur APE'])
    expect(item.files).toEqual(showResponse.files)
    expect(pageText()).toContain('Modifier un événement')
    expect(pageText()).toContain('programme.pdf')
  })

  it('supprimer : confirmation, DELETE /api/events/:id, liste rechargée', async () => {
    axios.delete.mockResolvedValue({ data: { status: 200 } })
    const { wrapper, snackbar } = mountMember(EventsIndex)
    await flush()
    await wrapper.findAll('[aria-label="Supprimer l\'événement"]')[1].trigger('click')
    await flush()
    expect(pageText()).toContain('Supprimer l’événement ?')
    expect(document.querySelector('.v-dialog strong').textContent).toBe('Congrès jeunesse')

    const getsBefore = axios.get.mock.calls.length
    buttonByText('Supprimer').click()
    await flush()
    expect(axios.delete).toHaveBeenCalledWith('/api/events/2', {})
    expect(axios.get.mock.calls.length).toBe(getsBefore + 1)
    expect(snackbar).toHaveBeenCalledWith('Événement supprimé avec succès', 'success')
    expect(wrapper.vm.dialogConfirmDelete).toBe(false)
  })

  it('annuler la suppression ferme la confirmation sans appel', async () => {
    const { wrapper } = mountMember(EventsIndex)
    await flush()
    await wrapper.find('[aria-label="Supprimer l\'événement"]').trigger('click')
    await flush()
    buttonByText('Annuler').click()
    await flush()
    expect(wrapper.vm.dialogConfirmDelete).toBe(false)
    expect(axios.delete).not.toHaveBeenCalled()
  })

  it('la fermeture du formulaire via l’Index remet le dialogue à faux', async () => {
    const { wrapper, store } = mountMember(EventsIndex)
    await flush()
    wrapper.vm.dialogForm = true
    expect(store.state.eventsStore.dialogForm).toBe(true)
    wrapper.vm.dialogForm = false
    expect(store.state.eventsStore.dialogForm).toBe(false)
  })
})

describe('Formulaire d’événement', () => {
  beforeEach(() => vi.clearAllMocks())
  afterEach(() => { document.body.innerHTML = '' })

  function mountForm(item) {
    const s = memberStore()
    s.commit('eventsStore/setReferentiels', referentiels)
    s.commit('eventsStore/setItem', item)
    s.commit('eventsStore/setDialogForm', true)
    return mountMember(EventForm, { s })
  }

  const newEvent = () => ({ id: null, title: '', start_at: '', end_at: '', description: '', accesses: [] })

  it('création : POST /api/events en multipart avec l’événement, la catégorie saisie, les accès et les pièces jointes', async () => {
    const created = { id: 50, title: 'Pastorale Ressource', category: { name: 'Pastorale' }, structure: { id: 7, name: 'ADD Jeunesse' } }
    axios.post.mockResolvedValue({ data: { status: 200, event: created } })
    const { wrapper, store, snackbar } = mountForm(newEvent())
    expect(pageText()).toContain('Ajouter un événement')

    const file = new File(['%PDF'], 'programme.pdf', { type: 'application/pdf' })
    Object.assign(wrapper.vm.editedItem, {
      title: 'Pastorale Ressource', structure_id: 7, category: 'Nouvelle catégorie',
      start_at: '2026-09-18T09:00', end_at: '2026-09-18T17:00', description: 'Journée', accesses: ['Pasteur APE', 'Membre'],
    })
    wrapper.vm.files = [file]
    buttonByText('Enregistrer').click()
    await flush()

    expect(axios.post).toHaveBeenCalledWith('/api/events', {
      event: {
        id: null, title: 'Pastorale Ressource', structure_id: 7, category: 'Nouvelle catégorie',
        start_at: '2026-09-18T09:00', end_at: '2026-09-18T17:00', description: 'Journée', accesses: ['Pasteur APE', 'Membre'],
      },
      files: [file],
    }, { headers: { 'Content-Type': 'multipart/form-data' } })
    expect(snackbar).toHaveBeenCalledWith('Événement enregistré avec succès', 'success')
    expect(store.state.eventsStore.dialogForm).toBe(false)
    expect(store.state.eventsStore.item).toEqual({})
    expect(store.state.eventsStore.items).toEqual([created])
  })

  it('modification : PATCH /api/events/:id et mise à jour de la ligne', async () => {
    axios.patch.mockResolvedValue({ data: { status: 200, event: { id: 3, title: 'Congrès 2027' } } })
    const s = memberStore()
    s.commit('eventsStore/setItems', [{ id: 3, title: 'Congrès national' }])
    s.commit('eventsStore/setReferentiels', referentiels)
    s.commit('eventsStore/setItem', { ...showResponse.event, category: 'Congrès', files: [], accesses: ['Pasteur APE'] })
    const { wrapper } = mountMember(EventForm, { s })
    expect(pageText()).toContain('Modifier un événement')

    wrapper.vm.editedItem.title = 'Congrès 2027'
    wrapper.vm.save()
    await flush()
    const [url, payload] = axios.patch.mock.calls[0]
    expect(url).toBe('/api/events/3')
    expect(payload.event).toMatchObject({ id: 3, title: 'Congrès 2027', category: 'Congrès', accesses: ['Pasteur APE'] })
    expect(payload.files).toEqual([])
    expect(s.state.eventsStore.items).toEqual([{ id: 3, title: 'Congrès 2027' }])
  })

  it('échec de l’enregistrement : message d’erreur, le formulaire reste ouvert', async () => {
    axios.post.mockRejectedValue({ response: { status: 403, data: {} } })
    const { wrapper, store, snackbar } = mountForm(newEvent())
    wrapper.vm.save()
    await flush()
    expect(snackbar).toHaveBeenCalledWith('Un probleme est survenu lors de l\'enregistrement de l\'événement', 'error')
    expect(store.state.eventsStore.dialogForm).toBe(true)
  })

  it('pièces jointes existantes : téléchargement, suppression DELETE /api/files/:id', async () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null)
    axios.delete.mockResolvedValue({ data: {} })
    const { wrapper, snackbar } = mountForm({ ...showResponse.event, category: 'Congrès', files: [...showResponse.files, { id: 32, name: 'plan.png', url: '/p.png' }], accesses: [] })

    const fileRow = () => [...document.querySelectorAll('.v-list-item')].find(i => i.textContent.includes('programme.pdf'))
    fileRow().querySelector('.v-list-item__prepend button').click()
    expect(open).toHaveBeenCalledWith('/rails/blobs/programme.pdf', '_blank')

    fileRow().querySelector('.v-list-item__append button').click()
    await flush()
    expect(axios.delete).toHaveBeenCalledWith('/api/files/31', {})
    expect(wrapper.vm.editedItem.files.map(f => f.id)).toEqual([32])
    expect(snackbar).toHaveBeenCalledWith('Pièce jointe supprimée avec succès', 'success')
    open.mockRestore()
  })

  it('échec de la suppression d’une pièce jointe : erreurs de l’API affichées', async () => {
    axios.delete.mockRejectedValue({ response: { data: { errors: ['Fichier introuvable', 'Réessayez'] } } })
    const { wrapper, snackbar } = mountForm({ ...showResponse.event, category: 'Congrès', files: showResponse.files, accesses: [] })
    wrapper.vm.deleteFile(31)
    await flush()
    expect(snackbar).toHaveBeenCalledWith('Un probleme est survenu lors de la suppression de la pièce jointe', 'error')
    expect(snackbar).toHaveBeenCalledWith('Fichier introuvable<br/>Réessayez', 'error')
    expect(wrapper.vm.editedItem.files).toHaveLength(1)
  })

  it('« Annuler » ferme le formulaire ; dates converties pour le champ date-heure', async () => {
    const { wrapper, store } = mountForm(newEvent())
    expect(wrapper.vm.getIsoDate('2026-09-18T09:05:00')).toBe('2026-09-18T09:05')
    buttonByText('Annuler').click()
    await flush()
    expect(store.state.eventsStore.dialogForm).toBe(false)
  })

  it('pendant le chargement de l’événement : indicateur de progression', () => {
    const s = memberStore()
    s.commit('eventsStore/setFormLoading', true)
    const { wrapper } = mountMember(EventForm, { s })
    expect(wrapper.find('.v-progress-circular').exists()).toBe(true)
  })
})
