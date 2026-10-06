import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import campaignsStore from '@/store/modules/campaignsStore'
import usersStore from '@/store/modules/usersStore'
import eventsStore from '@/store/modules/eventsStore'
import feedStore from '@/store/modules/feedStore'
import feedEventStore from '@/store/modules/feedEventStore'
import rolesStore from '@/store/modules/rolesStore'
import profileStore from '@/store/modules/profileStore'
import documentsStore from '@/store/modules/documentsStore'
import pushNotificationsStore from '@/store/modules/pushNotificationsStore'
import { moduleStore } from '../support.js'

vi.mock('axios')

const err = { response: { status: 500, data: { errors: ['Boum'] } } }
const deferred = () => { let resolve; const promise = new Promise(r => { resolve = r }); return { promise, resolve } }

beforeEach(() => {
  // reset (et pas seulement clear) : vide aussi les réponses « Once » non consommées
  vi.resetAllMocks()
  vi.spyOn(console, 'log').mockImplementation(() => {})
})

describe('campaignsStore', () => {
  const s = () => moduleStore(campaignsStore)

  it('items : liste filtrée par espace, avec indicateur de chargement', async () => {
    const store = s()
    const d = deferred()
    axios.get.mockReturnValue(d.promise)
    const p = store.dispatch('m/items', { domain: 'region' })
    expect(store.getters['m/getLoading']).toBe(true)
    d.resolve({ data: { campaigns: [{ id: 1 }] } })
    await p
    expect(axios.get).toHaveBeenCalledWith('/api/campaigns', { params: { domain: 'region' } })
    expect(store.getters['m/getItems']).toEqual([{ id: 1 }])
    expect(store.getters['m/getLoading']).toBe(false)
  })

  it('item : regroupe la campagne, ses résolutions, tables, résultats et votants', async () => {
    const store = s()
    axios.get.mockResolvedValue({ data: {
      campaign: { id: 5, name: 'AG' }, motions: [{ id: 1 }], voting_tables: [{ position: 'Pasteur APE' }],
      results: { 1: { yes: 2 } }, free_results: [], choices_results: [], voters: [{ id: 3 }],
    } })
    await store.dispatch('m/item', 5)
    expect(axios.get).toHaveBeenCalledWith('/api/campaigns/5', {})
    expect(store.getters['m/getItem']).toEqual({
      id: 5, name: 'AG', motions: [{ id: 1 }], voting_tables: [{ position: 'Pasteur APE' }],
      results: { 1: { yes: 2 } }, free_results: [], choices_results: [], voters: [{ id: 3 }],
    })
  })

  it('changeState : PATCH change_state avec l’événement de la machine à états', async () => {
    axios.patch.mockResolvedValue({ data: { status: 200 } })
    await s().dispatch('m/changeState', { id: 5, state: 'open' })
    expect(axios.patch).toHaveBeenCalledWith('/api/campaigns/5/change_state', { state_event: 'open' })
  })

  it('save : POST à la création, PATCH à la modification', async () => {
    const store = s()
    axios.post.mockResolvedValue({ data: { status: 200, campaign: { id: 8, name: 'AG' } } })
    await expect(store.dispatch('m/save', { name: 'AG' })).resolves.toEqual({ id: 8, name: 'AG' })
    expect(axios.post).toHaveBeenCalledWith('/api/campaigns', { campaign: { name: 'AG' } }, {})
    expect(store.getters['m/getItem']).toEqual({ id: 8, name: 'AG' })

    axios.patch.mockResolvedValue({ data: { campaign: { id: 8, name: 'AG 2' } } })
    await store.dispatch('m/save', { id: 8, name: 'AG 2' })
    expect(axios.patch).toHaveBeenCalledWith('/api/campaigns/8', { campaign: { id: 8, name: 'AG 2' } }, {})
  })

  it('save : les erreurs de validation (HTTP 200, status 422) et HTTP sont rejetées', async () => {
    const store = s()
    axios.post.mockResolvedValueOnce({ data: { status: 422, errors: ['Nom requis'] } })
    await expect(store.dispatch('m/save', {})).rejects.toEqual({ response: { data: { status: 422, errors: ['Nom requis'] } } })
    expect(store.getters['m/getItem']).toEqual({})
    axios.post.mockRejectedValueOnce(err)
    await expect(store.dispatch('m/save', {})).rejects.toBe(err)
  })

  it('delete : retire la campagne de la liste sans recharger la campagne supprimée', async () => {
    const store = s()
    store.commit('m/setItems', [{ id: 1 }, { id: 2 }])
    axios.delete.mockResolvedValue({ data: { status: 200 } })
    await store.dispatch('m/delete', 1)
    expect(axios.delete).toHaveBeenCalledWith('/api/campaigns/1', {})
    expect(store.getters['m/getItems']).toEqual([{ id: 2 }])
    // Un GET /api/campaigns/1 répondrait 404 et laisserait une promesse rejetée sans traitement
    expect(axios.get).not.toHaveBeenCalled()
  })

  it('referentiels, electorate, resultsPdf, votersCount', async () => {
    const store = s()
    axios.get.mockResolvedValueOnce({ data: { structures: [{ id: 2 }], positions: ['Pasteur APE'] } })
    await store.dispatch('m/referentiels', { domain: 'admin' })
    expect(axios.get).toHaveBeenLastCalledWith('/api/referentiels/campaigns', { params: { domain: 'admin' } })
    expect(store.getters['m/getReferentiels']).toEqual({ structures: [{ id: 2 }], positions: ['Pasteur APE'] })

    axios.post.mockResolvedValueOnce({ data: { estimate: { count: 3 } } })
    await expect(store.dispatch('m/electorate', {
      structure_id: 2, voting_tables: [{ id: 9, position: 'Eglises', as_member: true, voting: 'count', extra: 1 }],
    })).resolves.toEqual({ estimate: { count: 3 } })
    expect(axios.post).toHaveBeenLastCalledWith('/api/campaigns/electorate', {
      structure_id: 2, voting_tables: [{ position: 'Eglises', as_member: true, voting: 'count' }],
    })
    axios.post.mockResolvedValueOnce({ data: {} })
    await store.dispatch('m/electorate', { structure_id: 2 })
    expect(axios.post).toHaveBeenLastCalledWith('/api/campaigns/electorate', { structure_id: 2, voting_tables: [] })

    const blob = new Blob(['%PDF'])
    axios.get.mockResolvedValueOnce({ data: blob })
    await expect(store.dispatch('m/resultsPdf', 5)).resolves.toBe(blob)
    expect(axios.get).toHaveBeenLastCalledWith('/api/campaigns/5/results', { responseType: 'blob' })

    axios.get.mockResolvedValueOnce({ data: { voters_count: 42 } })
    await store.dispatch('m/votersCount', 5)
    expect(axios.get).toHaveBeenLastCalledWith('/api/campaigns/5/voters_count', {})
    expect(store.getters['m/getVotersCount']).toBe(42)
  })

  it('toutes les actions rejettent l’erreur de l’API', async () => {
    const store = s()
    axios.get.mockRejectedValue(err)
    axios.patch.mockRejectedValue(err)
    axios.delete.mockRejectedValue(err)
    for (const [action, payload] of [['items'], ['item', 1], ['changeState', { id: 1, state: 'close' }], ['delete', 1], ['referentiels'], ['votersCount', 1]]) {
      await expect(store.dispatch('m/' + action, payload)).rejects.toBe(err)
    }
  })

  it('mutations : dialogue, chargement du formulaire, mise à jour ou ajout dans la liste', () => {
    const store = s()
    store.commit('m/setDialogForm', true)
    store.commit('m/setFormLoading', true)
    expect(store.getters['m/getDialogForm']).toBe(true)
    expect(store.getters['m/getFormLoading']).toBe(true)
    store.commit('m/setItems', [{ id: 1, name: 'A' }])
    store.commit('m/setItemInItemsById', { id: 1, name: 'B' })
    store.commit('m/setItemInItemsById', JSON.stringify({ id: 2, name: 'C' }))
    expect(store.getters['m/getItems']).toEqual([{ id: 1, name: 'B' }, { id: 2, name: 'C' }])
    store.commit('m/removeItemInItemsById', 99)
    expect(store.getters['m/getItems']).toHaveLength(2)
  })
})

describe('usersStore', () => {
  const s = () => moduleStore(usersStore)

  it('fetchItems : liste paginée/filtrée', async () => {
    const store = s()
    axios.get.mockResolvedValue({ data: { users: [{ id: 1 }] } })
    await store.dispatch('m/fetchItems', { search: 'dup' })
    expect(axios.get).toHaveBeenCalledWith('/api/users', { params: { search: 'dup' } })
    expect(store.getters['m/getItems']).toEqual([{ id: 1 }])
    expect(store.getters['m/getLoading']).toBe(false)
  })

  it('save : PATCH si l’utilisateur existe (mise à jour dans la liste), POST sinon', async () => {
    const store = s()
    store.commit('m/setItems', [{ id: 1, firstname: 'Jean' }])
    axios.patch.mockResolvedValue({ data: { user: { id: 1, firstname: 'Jeanne' } } })
    await store.dispatch('m/save', { user: { id: 1, firstname: 'Jeanne' } })
    expect(axios.patch).toHaveBeenCalledWith('/api/users/1', { user: { user: { id: 1, firstname: 'Jeanne' } } },
      { headers: { 'Content-Type': 'multipart/form-data' } })
    expect(store.getters['m/getItems']).toEqual([{ id: 1, firstname: 'Jeanne' }])

    axios.post.mockResolvedValue({ data: { user: { id: 2 } } })
    await store.dispatch('m/save', { user: { firstname: 'Paul' } })
    expect(axios.post).toHaveBeenCalledWith('/api/users', { user: { user: { firstname: 'Paul' } } },
      { headers: { 'Content-Type': 'multipart/form-data' } })
    // usersStore n'ajoute pas un nouvel utilisateur à la liste : la page recharge la liste
    expect(store.getters['m/getItems']).toHaveLength(1)
  })

  it('rôles, invitation, activation et désactivation', async () => {
    const store = s()
    store.commit('m/setItems', [{ id: 1, enabled: true }])
    axios.patch.mockResolvedValue({ data: { user: { id: 1, enabled: false } } })
    axios.post.mockResolvedValue({ data: { status: 200 } })

    await store.dispatch('m/addRole', { id: 1, role: 'admin' })
    expect(axios.patch).toHaveBeenLastCalledWith('/api/users/1/add_role', { id: 1, role: 'admin' })
    await store.dispatch('m/removeRole', { id: 1, role: 'admin' })
    expect(axios.patch).toHaveBeenLastCalledWith('/api/users/1/remove_role', { id: 1, role: 'admin' })
    await store.dispatch('m/sendInvitation', { id: 1 })
    expect(axios.post).toHaveBeenLastCalledWith('/api/users/1/send_invitation', { id: 1 })
    await store.dispatch('m/disable', 1)
    expect(axios.patch).toHaveBeenLastCalledWith('/api/users/1/disable', {})
    expect(store.getters['m/getItems'][0].enabled).toBe(false)
    axios.patch.mockResolvedValue({ data: { user: { id: 1, enabled: true } } })
    await store.dispatch('m/enable', 1)
    expect(axios.patch).toHaveBeenLastCalledWith('/api/users/1/enable', {})
    expect(store.getters['m/getItems'][0].enabled).toBe(true)
  })

  it('delete : retire l’utilisateur, ferme et vide le formulaire', async () => {
    const store = s()
    store.commit('m/setItems', [{ id: 1 }, { id: 2 }])
    store.commit('m/setItem', { user: { id: 1 } })
    store.commit('m/setDialogForm', true)
    axios.delete.mockResolvedValue({ data: {} })
    await store.dispatch('m/delete', 1)
    expect(axios.delete).toHaveBeenCalledWith('/api/users/1', {})
    expect(store.getters['m/getItems']).toEqual([{ id: 2 }])
    expect(store.getters['m/getDialogForm']).toBe(false)
    expect(store.getters['m/getItem']).toEqual({})
    store.commit('m/removeItemInItemsById', 99)
    store.commit('m/setItemInItemsById', JSON.stringify({ id: 99 }))
    expect(store.getters['m/getItems']).toEqual([{ id: 2 }])
  })

  it('getItem : charge la fiche et ouvre le formulaire ; referentiels', async () => {
    const store = s()
    axios.get.mockResolvedValueOnce({ data: { user: { id: 3 }, roles: [] } })
    await store.dispatch('m/getItem', 3)
    expect(axios.get).toHaveBeenLastCalledWith('/api/users/3', {})
    expect(store.getters['m/getItem']).toEqual({ user: { id: 3 }, roles: [] })
    expect(store.getters['m/getDialogForm']).toBe(true)
    expect(store.getters['m/getFormLoading']).toBe(false)

    axios.get.mockResolvedValueOnce({ data: { levels: ['Pasteur'] } })
    await store.dispatch('m/referentiels')
    expect(axios.get).toHaveBeenLastCalledWith('/api/referentiels/users', {})
    expect(store.getters['m/getReferentiels']).toEqual({ levels: ['Pasteur'] })
  })

  it('toutes les actions rejettent l’erreur de l’API', async () => {
    const store = s()
    for (const m of ['get', 'post', 'patch', 'delete']) axios[m].mockRejectedValue(err)
    const calls = [['fetchItems'], ['save', { user: { id: 1 } }], ['save', { user: {} }], ['addRole', { id: 1 }],
      ['removeRole', { id: 1 }], ['sendInvitation', { id: 1 }], ['delete', 1], ['enable', 1], ['disable', 1],
      ['referentiels'], ['getItem', 1]]
    for (const [action, payload] of calls) {
      await expect(store.dispatch('m/' + action, payload)).rejects.toBe(err)
    }
  })
})

describe('eventsStore', () => {
  const s = () => moduleStore(eventsStore)

  it('items et item : la catégorie est aplatie, fichiers et accès rattachés', async () => {
    const store = s()
    axios.get.mockResolvedValueOnce({ data: { events: [{ id: 1 }] } })
    await store.dispatch('m/items', { domain: 'admin' })
    expect(axios.get).toHaveBeenLastCalledWith('/api/events', { params: { domain: 'admin' } })
    expect(store.getters['m/getItems']).toEqual([{ id: 1 }])
    expect(store.getters['m/getLoading']).toBe(false)

    axios.get.mockResolvedValueOnce({ data: { event: { id: 1, category: { name: 'Culte' } }, files: [{ id: 4 }], accesses: ['pasteur'] } })
    await store.dispatch('m/item', 1)
    expect(axios.get).toHaveBeenLastCalledWith('/api/events/1', {})
    expect(store.getters['m/getItem']).toEqual({ id: 1, category: 'Culte', files: [{ id: 4 }], accesses: ['pasteur'] })
  })

  it('save : PATCH ou POST multipart, et met la liste à jour', async () => {
    const store = s()
    const headers = { headers: { 'Content-Type': 'multipart/form-data' } }
    axios.post.mockResolvedValue({ data: { event: { id: 2, title: 'Pastorale' } } })
    await expect(store.dispatch('m/save', { event: { title: 'Pastorale' } })).resolves.toEqual({ id: 2, title: 'Pastorale' })
    expect(axios.post).toHaveBeenCalledWith('/api/events', { event: { title: 'Pastorale' } }, headers)
    expect(store.getters['m/getItems']).toEqual([{ id: 2, title: 'Pastorale' }])

    axios.patch.mockResolvedValue({ data: { event: { id: 2, title: 'Pastorale 2026' } } })
    await store.dispatch('m/save', { event: { id: 2, title: 'Pastorale 2026' } })
    expect(axios.patch).toHaveBeenCalledWith('/api/events/2', { event: { id: 2, title: 'Pastorale 2026' } }, headers)
    expect(store.getters['m/getItems']).toEqual([{ id: 2, title: 'Pastorale 2026' }])
  })

  it('delete, deleteFile et referentiels', async () => {
    const store = s()
    store.commit('m/setItems', [{ id: 1 }, { id: 2 }])
    axios.delete.mockResolvedValue({ data: {} })
    await store.dispatch('m/delete', 1)
    expect(axios.delete).toHaveBeenLastCalledWith('/api/events/1', {})
    expect(store.getters['m/getItems']).toEqual([{ id: 2 }])
    await store.dispatch('m/deleteFile', 7)
    expect(axios.delete).toHaveBeenLastCalledWith('/api/files/7', {})
    axios.get.mockResolvedValue({ data: { categories: [] } })
    await store.dispatch('m/referentiels', { domain: 'region' })
    expect(axios.get).toHaveBeenLastCalledWith('/api/referentiels/events', { params: { domain: 'region' } })
    expect(store.getters['m/getReferentiels']).toEqual({ categories: [] })
    store.commit('m/setDialogForm', true)
    store.commit('m/setFormLoading', true)
    store.commit('m/removeItemInItemsById', 99)
    expect(store.getters['m/getDialogForm']).toBe(true)
    expect(store.getters['m/getFormLoading']).toBe(true)
    store.commit('m/setItemInItemsById', JSON.stringify({ id: 3 }))
    expect(store.getters['m/getItems']).toEqual([{ id: 2 }, { id: 3 }])
  })

  it('toutes les actions rejettent l’erreur de l’API', async () => {
    const store = s()
    for (const m of ['get', 'post', 'patch', 'delete']) axios[m].mockRejectedValue(err)
    for (const [action, payload] of [['items'], ['item', 1], ['save', { event: { id: 1 } }], ['save', { event: {} }],
      ['delete', 1], ['deleteFile', 1], ['referentiels']]) {
      await expect(store.dispatch('m/' + action, payload)).rejects.toBe(err)
    }
  })
})

// Fil d'actualité (10 par page) et fil des événements (5 par page) : même mécanique
describe.each([
  ['feedStore', feedStore, '/api/feed', 'posts', 10],
  ['feedEventStore', feedEventStore, '/api/me/events', 'events', 5],
])('%s : fil paginé', (_name, module, url, key, pageSize) => {
  const page = (n, start = 0) => Array.from({ length: n }, (_, i) => ({ id: start + i }))

  it('items repart de zéro et indique s’il reste des éléments', async () => {
    const store = moduleStore(module)
    store.commit('m/setOffset', 30)
    axios.get.mockResolvedValue({ data: { [key]: page(pageSize) } })
    await store.dispatch('m/items')
    expect(axios.get).toHaveBeenCalledWith(url + '?offset=0', {})
    expect(store.getters['m/getItems']).toHaveLength(pageSize)
    expect(store.getters['m/getOffset']).toBe(pageSize)
    expect(store.getters['m/getHasMore']).toBe(true)
    await new Promise(r => setTimeout(r, 0)) // loaded/loading sont remis à jour dans le finally
    expect(store.getters['m/getLoaded']).toBe(true)
    expect(store.getters['m/getLoading']).toBe(false)
    expect(store.getters['m/getError']).toBe(false)
  })

  it('loadMore ajoute la page suivante ; une page incomplète clôt le fil', async () => {
    const store = moduleStore(module)
    axios.get.mockResolvedValueOnce({ data: { [key]: page(pageSize) } })
    await store.dispatch('m/items')
    axios.get.mockResolvedValueOnce({ data: { [key]: page(2, pageSize) } })
    await store.dispatch('m/loadMore')
    expect(axios.get).toHaveBeenLastCalledWith(`${url}?offset=${pageSize}`, {})
    expect(store.getters['m/getItems']).toHaveLength(pageSize + 2)
    expect(store.getters['m/getOffset']).toBe(pageSize + 2)
    expect(store.getters['m/getHasMore']).toBe(false)

    axios.get.mockResolvedValueOnce({ data: {} })
    await store.dispatch('m/loadMore')
    expect(store.getters['m/getItems']).toHaveLength(pageSize + 2)
  })

  it('search encode la recherche et désactive « Voir plus »', async () => {
    const store = moduleStore(module)
    axios.get.mockResolvedValueOnce({ data: { [key]: page(pageSize) } })
    await store.dispatch('m/search', 'AG & prière')
    expect(axios.get).toHaveBeenCalledWith(url + '?search=AG%20%26%20pri%C3%A8re', {})
    expect(store.getters['m/getHasMore']).toBe(false)
    expect(store.getters['m/getOffset']).toBe(0)
    axios.get.mockResolvedValueOnce({ data: {} })
    await store.dispatch('m/search', 'rien')
    expect(store.getters['m/getItems']).toEqual([])
  })

  it('en erreur, chaque action signale l’erreur et arrête le chargement', async () => {
    for (const action of ['items', 'loadMore', 'search']) {
      const store = moduleStore(module)
      axios.get.mockRejectedValueOnce(err)
      await expect(store.dispatch('m/' + action, 'x')).rejects.toBe(err)
      await new Promise(r => setTimeout(r, 0))
      expect(store.getters['m/getError']).toBe(true)
      expect(store.getters['m/getLoading']).toBe(false)
    }
    // items sans réponse « posts » : liste vide
    const store = moduleStore(module)
    axios.get.mockResolvedValueOnce({ data: {} })
    await store.dispatch('m/items')
    expect(store.getters['m/getItems']).toEqual([])
    expect(store.getters['m/getHasMore']).toBe(false)
  })
})

describe('rolesStore', () => {
  const s = () => moduleStore(rolesStore)

  it('items, item, delete', async () => {
    const store = s()
    axios.get.mockResolvedValueOnce({ data: { roles: [{ id: 1 }, { id: 2 }] } })
    await store.dispatch('m/items')
    expect(axios.get).toHaveBeenLastCalledWith('/api/roles', {})
    expect(store.getters['m/getItems']).toHaveLength(2)
    expect(store.getters['m/getLoading']).toBe(false)
    axios.get.mockResolvedValueOnce({ data: { role: { id: 2, name: 'president' } } })
    await store.dispatch('m/item', 2)
    expect(store.getters['m/getItem']).toEqual({ id: 2, name: 'president' })
    axios.delete.mockResolvedValue({})
    await store.dispatch('m/delete', 1)
    expect(axios.delete).toHaveBeenCalledWith('/api/roles/1', {})
    expect(store.getters['m/getItems']).toEqual([{ id: 2 }])
  })

  it('save : PATCH envoie le rôle seul, POST l’enveloppe ; les deux renvoient le rôle enregistré', async () => {
    const store = s()
    store.commit('m/setItems', [{ id: 2, name: 'old' }])
    axios.patch.mockResolvedValue({ data: { role: { id: 2, name: 'president' } } })
    await expect(store.dispatch('m/save', { role: { id: 2, name: 'president' } })).resolves.toEqual({ id: 2, name: 'president' })
    expect(axios.patch).toHaveBeenCalledWith('/api/roles/2', { id: 2, name: 'president' })
    expect(store.getters['m/getItems']).toEqual([{ id: 2, name: 'president' }])

    axios.post.mockResolvedValue({ data: { role: { id: 3, name: 'treasurer' } } })
    await expect(store.dispatch('m/save', { role: { name: 'treasurer' } })).resolves.toEqual({ id: 3, name: 'treasurer' })
    expect(axios.post).toHaveBeenCalledWith('/api/roles', { role: { name: 'treasurer' } })
    expect(store.getters['m/getItems']).toHaveLength(2)
  })

  it('erreurs propagées et mutations annexes', async () => {
    const store = s()
    for (const m of ['get', 'post', 'patch', 'delete']) axios[m].mockRejectedValue(err)
    for (const [action, payload] of [['items'], ['item', 1], ['save', { role: { id: 1 } }], ['save', { role: {} }], ['delete', 1]]) {
      await expect(store.dispatch('m/' + action, payload)).rejects.toBe(err)
    }
    store.commit('m/setDialogForm', true)
    store.commit('m/setFormLoading', true)
    store.commit('m/setReferentiels', [])
    store.commit('m/setItemInItemsById', JSON.stringify({ id: 4 }))
    store.commit('m/removeItemInItemsById', 99)
    expect(store.getters['m/getDialogForm']).toBe(true)
    expect(store.getters['m/getFormLoading']).toBe(true)
    expect(store.getters['m/getItems']).toEqual([{ id: 4 }])
  })
})

describe('profileStore', () => {
  it('getProfile : répartit la réponse de /api/profile', async () => {
    const store = moduleStore(profileStore)
    axios.get.mockResolvedValueOnce({ data: {
      profile: { id: 1 }, gratitudes: [1], fees: [2], presidences: [3], phases: [4], responsabilities: [5], roles: ['admin'],
    } })
    await store.dispatch('m/getProfile')
    expect(axios.get).toHaveBeenCalledWith('/api/profile', {})
    expect(store.getters['m/getProfile']).toEqual({ id: 1 })
    expect(store.getters['m/getGratitudes']).toEqual([1])
    expect(store.getters['m/getFees']).toEqual([2])
    expect(store.getters['m/getPresidences']).toEqual([3])
    expect(store.getters['m/getPhases']).toEqual([4])
    expect(store.getters['m/getResponsabilities']).toEqual([5])
    expect(store.getters['m/getRoles']).toEqual(['admin'])
    axios.get.mockRejectedValueOnce(err)
    await expect(store.dispatch('m/getProfile')).rejects.toBe(err)
  })
})

describe('documentsStore', () => {
  it('items, upload multipart et ajout de catégorie', async () => {
    const store = moduleStore(documentsStore)
    axios.get.mockResolvedValueOnce({ data: [{ id: 1, name: 'Statuts' }] })
    await store.dispatch('m/items')
    expect(axios.get).toHaveBeenCalledWith('/api/documents', {})
    expect(store.getters['m/getItems']).toEqual([{ id: 1, name: 'Statuts' }])

    const fd = new FormData()
    axios.post.mockResolvedValue({ data: {} })
    await store.dispatch('m/upload', fd)
    expect(axios.post).toHaveBeenLastCalledWith('/api/documents', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    await store.dispatch('m/addCategory', { name: 'Juridique' })
    expect(axios.post).toHaveBeenLastCalledWith('/api/categories', { name: 'Juridique' })

    axios.get.mockRejectedValue(err)
    axios.post.mockRejectedValue(err)
    await expect(store.dispatch('m/items')).rejects.toBe(err)
    await expect(store.dispatch('m/upload', fd)).rejects.toBe(err)
    await expect(store.dispatch('m/addCategory', {})).rejects.toBe(err)
  })
})

describe('pushNotificationsStore', () => {
  const s = () => moduleStore(pushNotificationsStore)

  it('items, save (POST / PATCH) et envoi', async () => {
    const store = s()
    axios.get.mockResolvedValue({ data: [{ id: 1, title: 'AG' }] })
    await store.dispatch('m/items')
    expect(axios.get).toHaveBeenCalledWith('/api/push_notifications', {})
    expect(store.getters['m/getItems']).toEqual([{ id: 1, title: 'AG' }])
    expect(store.getters['m/getLoading']).toBe(false)

    axios.post.mockResolvedValue({ data: { id: 2, title: 'Rappel' } })
    await expect(store.dispatch('m/save', { title: 'Rappel' })).resolves.toEqual({ id: 2, title: 'Rappel' })
    expect(axios.post).toHaveBeenLastCalledWith('/api/push_notifications', { title: 'Rappel' })
    expect(store.getters['m/getItem']).toEqual({ id: 2, title: 'Rappel' })

    axios.patch.mockResolvedValue({ data: { id: 2, title: 'Rappel AG' } })
    await store.dispatch('m/save', { id: 2, title: 'Rappel AG' })
    expect(axios.patch).toHaveBeenLastCalledWith('/api/push_notifications/2', { id: 2, title: 'Rappel AG' })

    axios.post.mockResolvedValue({ data: { sent: 12 } })
    await expect(store.dispatch('m/send', 2)).resolves.toEqual({ sent: 12 })
    expect(axios.post).toHaveBeenLastCalledWith('/api/push_notifications/send', { id: 2 })
  })

  it('delete : retire la notification de la liste affichée', async () => {
    const store = s()
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    store.commit('m/setItems', [{ id: 1 }, { id: 2 }])
    axios.delete.mockResolvedValue({ data: {} })
    await store.dispatch('m/delete', 1)
    expect(axios.delete).toHaveBeenCalledWith('/api/push_notifications/1', {})
    expect(store.getters['m/getItems']).toEqual([{ id: 2 }])
    expect(errorSpy).not.toHaveBeenCalledWith(expect.stringContaining('unknown mutation type'))
    store.commit('m/removeItemInItemsById', 99)
    expect(store.getters['m/getItems']).toEqual([{ id: 2 }])
    errorSpy.mockRestore()
  })

  it('mutations et erreurs', async () => {
    const store = s()
    store.commit('m/setDialogForm', true)
    expect(store.getters['m/getDialogForm']).toBe(true)
    store.commit('m/setItemInItemsById', { id: 1, title: 'A' })
    store.commit('m/setItemInItemsById', JSON.stringify({ id: 1, title: 'B' }))
    expect(store.getters['m/getItems']).toEqual([{ id: 1, title: 'B' }])

    for (const m of ['get', 'post', 'patch', 'delete']) axios[m].mockRejectedValue(err)
    for (const [action, payload] of [['items'], ['save', { id: 1 }], ['save', {}], ['send', 1], ['delete', 1]]) {
      await expect(store.dispatch('m/' + action, payload)).rejects.toBe(err)
    }
  })
})
