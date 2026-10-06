import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import axios from 'axios'
import PostsIndex from '@/components/Posts/Index.vue'
import PostForm from '@/components/Posts/Form.vue'
import { mountMember, memberStore, flush, pageText, buttonByText } from './support.js'

vi.mock('axios')

// L'éditeur riche (Quill) ne fonctionne pas dans jsdom : remplacé par une zone de texte liée au v-model
const VueEditor = {
  name: 'VueEditor',
  props: ['modelValue'],
  emits: ['update:modelValue'],
  template: '<textarea class="editor" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)"></textarea>',
}
const stubs = { VueEditor }

// Référentiels de GET /api/referentiels/posts
const referentiels = { structures: [{ id: 5, name: 'UNADF' }, { id: 7, name: 'ADD Jeunesse' }], levels: ['Pasteur APE', 'Membre'] }
const listed = (id, overrides = {}) => ({
  id, title: `Actu ${id}`, pinned: false, created_at: '2026-09-01T10:30:00', structure: { id: 5, name: 'UNADF' }, ...overrides,
})
// GET /api/posts/:id : le store recompose post.files et post.accesses à partir de la réponse
const showResponse = () => ({
  post: { id: 4, title: 'Retraite', content: '<p>Texte</p>', structure_id: 5, pinned: false },
  files: [{ id: 21, name: 'affiche.pdf', url: '/rails/blobs/affiche.pdf' }],
  accesses: ['Membre'],
})

function mockApi({ posts = [listed(1, { pinned: true }), listed(2, { structure: null })] } = {}) {
  axios.get.mockImplementation((url) => {
    if (url === '/api/posts') return Promise.resolve({ data: { posts } })
    if (url === '/api/referentiels/posts') return Promise.resolve({ data: referentiels })
    if (url === '/api/posts/4') return Promise.resolve({ data: showResponse() })
    return Promise.reject(new Error('URL inattendue : ' + url))
  })
}

const postsStoreMounted = () => memberStore({ withPosts: true })

describe('Gestion des actus (responsable)', () => {
  beforeEach(() => { vi.clearAllMocks(); mockApi() })
  afterEach(() => { document.body.innerHTML = '' })

  it('charge les actus et les référentiels de l’espace courant ; les épinglées sont signalées', async () => {
    const { wrapper } = mountMember(PostsIndex, { s: postsStoreMounted(), props: { domain: 'region' }, stubs })
    await flush()
    expect(axios.get).toHaveBeenCalledWith('/api/posts', { params: { domain: 'region' } })
    expect(axios.get).toHaveBeenCalledWith('/api/referentiels/posts', { params: { domain: 'region' } })
    const cells = wrapper.findAll('tbody tr').map(r => r.findAll('td').map(td => td.text().trim()))
    expect(cells[0].slice(0, 3)).toEqual(['Actu 1', 'UNADF', '01/09/2026 10:30'])
    expect(wrapper.findAll('tbody tr')[0].find('.mdi-pin').exists()).toBe(true)
    expect(cells[1][1]).toBe('')
  })

  it('aucune actu : message dédié', async () => {
    mockApi({ posts: [] })
    mountMember(PostsIndex, { s: postsStoreMounted(), stubs })
    await flush()
    expect(pageText()).toContain('Aucune actu trouvée')
  })

  it('« Ajouter une actu » ouvre le formulaire vide', async () => {
    const { store } = mountMember(PostsIndex, { s: postsStoreMounted(), stubs })
    await flush()
    buttonByText('Ajouter une actu').click()
    await flush()
    expect(store.state.postsStore.item).toEqual({ id: null, title: '', content: '', accesses: [] })
    expect(pageText()).toContain('Ajouter une actu')
  })

  it('modifier : GET /api/posts/:id, pièces jointes et accès chargés dans le formulaire', async () => {
    mockApi({ posts: [listed(4)] })
    const { wrapper, store } = mountMember(PostsIndex, { s: postsStoreMounted(), stubs })
    await flush()
    await wrapper.find('[title="Edit"]').trigger('click')
    await flush()
    expect(axios.get).toHaveBeenCalledWith('/api/posts/4', {})
    expect(store.state.postsStore.item).toMatchObject({ id: 4, files: showResponse().files, accesses: ['Membre'] })
    expect(pageText()).toContain('Modifier une actu')
    expect(pageText()).toContain('affiche.pdf')
  })

  it('supprimer : confirmation puis DELETE /api/posts/:id, la ligne disparaît', async () => {
    axios.delete.mockResolvedValue({ data: { status: 200 } })
    const { wrapper, store, snackbar } = mountMember(PostsIndex, { s: postsStoreMounted(), stubs })
    await flush()
    await wrapper.findAll('[title="Delete"]')[1].trigger('click')
    await flush()
    expect(pageText()).toContain('Etes-vous sûr de vouloir supprimer cette actu ?')
    buttonByText('Supprimer').click()
    await flush()
    expect(axios.delete).toHaveBeenCalledWith('/api/posts/2', {})
    expect(store.state.postsStore.items.map(p => p.id)).toEqual([1])
    expect(snackbar).toHaveBeenCalledWith('Actualité supprimée avec succès', 'success')
    expect(wrapper.vm.dialogConfirmDelete).toBe(false)
  })

  it('annuler la suppression, actualiser la liste, refermer le formulaire', async () => {
    const { wrapper, store } = mountMember(PostsIndex, { s: postsStoreMounted(), stubs })
    await flush()
    await wrapper.find('[title="Delete"]').trigger('click')
    await flush()
    buttonByText('Annuler').click()
    await flush()
    expect(axios.delete).not.toHaveBeenCalled()

    const before = axios.get.mock.calls.filter(c => c[0] === '/api/posts').length
    await wrapper.find('.mdi-reload').trigger('click')
    expect(axios.get.mock.calls.filter(c => c[0] === '/api/posts').length).toBe(before + 1)

    wrapper.vm.dialogForm = true
    expect(store.state.postsStore.dialogForm).toBe(true)
    wrapper.vm.dialogForm = false
    expect(store.state.postsStore.dialogForm).toBe(false)
  })
})

describe('Formulaire d’actu', () => {
  beforeEach(() => vi.clearAllMocks())
  afterEach(() => { document.body.innerHTML = '' })

  function mountForm(item, roles = []) {
    const s = postsStoreMounted()
    s.commit('postsStore/setReferentiels', referentiels)
    s.commit('postsStore/setItem', item)
    s.commit('postsStore/setDialogForm', true)
    s.commit('sessionStore/setRoles', roles)
    return mountMember(PostForm, { s, stubs })
  }

  it('création : POST /api/posts en multipart avec l’actu, ses accès et les pièces jointes ; liste rafraîchie', async () => {
    axios.post.mockResolvedValue({ data: { status: 200, post: { id: 60, title: 'Rentrée' } } })
    const { wrapper, store, snackbar } = mountForm({ id: null, title: '', content: '', accesses: [] })
    expect(pageText()).not.toContain('Épinglé l\'actualité') // réservé aux administrateurs

    await wrapper.find('input').setValue('Rentrée')
    await wrapper.find('textarea.editor').setValue('<p>Bonne rentrée</p>')
    const file = new File(['img'], 'photo.jpg', { type: 'image/jpeg' })
    wrapper.vm.files = [file]
    wrapper.vm.editedItem.structure_id = 7
    wrapper.vm.editedItem.accesses = ['Pasteur APE']
    buttonByText('Enregistrer').click()
    await flush()

    expect(axios.post).toHaveBeenCalledWith('/api/posts', {
      post: { id: null, title: 'Rentrée', content: '<p>Bonne rentrée</p>', structure_id: 7, accesses: ['Pasteur APE'] },
      files: [file],
    }, { headers: { 'Content-Type': 'multipart/form-data' } })
    expect(snackbar).toHaveBeenCalledWith('Actu enregistrée avec succès', 'success')
    expect(wrapper.emitted('refresh')).toHaveLength(1)
    expect(store.state.postsStore.dialogForm).toBe(false)
    expect(store.state.postsStore.items).toEqual([{ id: 60, title: 'Rentrée' }])
  })

  it('administrateur : peut épingler ; modification en PATCH /api/posts/:id', async () => {
    axios.patch.mockResolvedValue({ data: { status: 200, post: { id: 4, title: 'Retraite', pinned: true } } })
    const { wrapper } = mountForm({ ...showResponse().post, files: [], accesses: ['Membre'] }, ['admin'])
    expect(pageText()).toContain('Modifier une actu')
    expect(pageText()).toContain('Épinglé l\'actualité')

    await wrapper.find('input[type="checkbox"]').setValue(true)
    wrapper.vm.save()
    await flush()
    const [url, payload] = axios.patch.mock.calls[0]
    expect(url).toBe('/api/posts/4')
    expect(payload.post).toMatchObject({ id: 4, pinned: true, accesses: ['Membre'] })
  })

  it('échec de l’enregistrement : message générique puis erreurs de l’API', async () => {
    axios.post.mockRejectedValue({ response: { data: { errors: ['Titre obligatoire'] } } })
    const { wrapper, snackbar } = mountForm({ id: null, title: '', content: '', accesses: [] })
    wrapper.vm.save()
    await flush()
    expect(snackbar).toHaveBeenCalledWith('Un probleme est survenu lors de l\'enregistrement de l\'actu', 'error')
    expect(snackbar).toHaveBeenCalledWith('Titre obligatoire', 'error')
  })

  it('pièces jointes existantes : téléchargement et suppression (succès puis échec)', async () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null)
    axios.delete.mockResolvedValueOnce({ data: {} })
    const files = [{ id: 21, name: 'affiche.pdf', url: '/a.pdf' }, { id: 22, name: 'plan.pdf', url: '/p.pdf' }]
    const { wrapper, snackbar } = mountForm({ ...showResponse().post, files, accesses: [] })

    const row = (name) => [...document.querySelectorAll('.v-list-item')].find(i => i.textContent.includes(name))
    row('affiche.pdf').querySelector('.v-list-item__prepend button').click()
    expect(open).toHaveBeenCalledWith('/a.pdf', '_blank')

    row('affiche.pdf').querySelector('.v-list-item__append button').click()
    await flush()
    expect(axios.delete).toHaveBeenCalledWith('/api/files/21', {})
    expect(wrapper.vm.editedItem.files.map(f => f.id)).toEqual([22])
    expect(snackbar).toHaveBeenCalledWith('Pièce jointe supprimée avec succès', 'success')

    axios.delete.mockRejectedValueOnce({ response: { data: { errors: ['Interdit'] } } })
    wrapper.vm.deleteFile(22)
    await flush()
    expect(snackbar).toHaveBeenCalledWith('Un probleme est survenu lors de la suppression de la pièce jointe', 'error')
    expect(snackbar).toHaveBeenCalledWith('Interdit', 'error')
    expect(wrapper.vm.editedItem.files).toHaveLength(1)
    open.mockRestore()
  })

  it('« Annuler » ferme et vide le formulaire ; indicateur pendant le chargement', async () => {
    const { store } = mountForm({ id: null, title: '', content: '', accesses: [] })
    buttonByText('Annuler').click()
    await flush()
    expect(store.state.postsStore.dialogForm).toBe(false)
    expect(store.state.postsStore.item).toEqual({})

    document.body.innerHTML = ''
    const s = postsStoreMounted()
    s.commit('postsStore/setFormLoading', true)
    const { wrapper } = mountMember(PostForm, { s, stubs })
    expect(wrapper.find('.v-progress-circular').exists()).toBe(true)
  })
})
