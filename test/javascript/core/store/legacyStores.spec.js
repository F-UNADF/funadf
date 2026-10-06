// Anciens stores par ressource (associations, églises, actus, cotisations).
// Ils ne sont plus enregistrés dans store/index.js (remplacés par crudStore) mais restent dans le code :
// on vérifie qu'ils parlent toujours correctement à l'API.
import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import associationsStore from '@/store/modules/associationsStore'
import churchesStore from '@/store/modules/churchesStore'
import postsStore from '@/store/modules/postsStore'
import feesStore from '@/store/modules/feesStore'
import appStore from '@/store/index.js'
import profileStore from '@/store/modules/profileStore'
import { moduleStore } from '../support.js'

vi.mock('axios')

const err = { response: { status: 500 } }
const multipart = { headers: { 'Content-Type': 'multipart/form-data' } }

beforeEach(() => {
  vi.resetAllMocks()
  vi.spyOn(console, 'log').mockImplementation(() => {})
})

describe('store/index.js : composition du store de l’application', () => {
  it('enregistre les modules métier et un crudStore par ressource d’admin', () => {
    for (const name of ['sessionStore', 'usersStore', 'campaignsStore', 'menuStore', 'eventsStore', 'votesStore',
      'feedStore', 'feedEventStore', 'rolesStore', 'profileStore', 'documentsStore', 'pushNotificationsStore',
      'regions', 'churches', 'associations', 'posts', 'fees']) {
      expect(appStore.hasModule(name)).toBe(true)
    }
    expect(appStore.getters['regions/getItems']).toEqual([])
    expect(appStore.getters['menuStore/getMenu']).toEqual([])
  })

  it('profileStore : deux stores n’ont pas le même état', () => {
    const a = moduleStore(profileStore)
    const b = moduleStore(profileStore)
    a.commit('m/setProfile', { id: 1 })
    expect(b.getters['m/getProfile']).toEqual({})
  })
})

describe.each([
  ['associations', 'association', associationsStore],
  ['churches', 'church', churchesStore],
])('%sStore (ancien)', (resource, key, module) => {
  const s = () => moduleStore(module)

  it('items, item (avec membres) et referentiels', async () => {
    const store = s()
    axios.get.mockResolvedValueOnce({ data: { [resource]: [{ id: 1 }] } })
    await store.dispatch('m/items')
    expect(axios.get).toHaveBeenLastCalledWith(`/api/${resource}`, {})
    expect(store.getters['m/getItems']).toEqual([{ id: 1 }])
    expect(store.getters['m/getLoading']).toBe(false)

    axios.get.mockResolvedValueOnce({ data: { [key]: { id: 1 }, members: [{ membership_id: 3 }] } })
    await store.dispatch('m/item', 1)
    expect(axios.get).toHaveBeenLastCalledWith(`/api/${resource}/1`, {})
    expect(store.getters['m/getItem']).toEqual({ id: 1 })
    expect(store.getters['m/getMembers']).toEqual([{ membership_id: 3 }])

    axios.get.mockResolvedValueOnce({ data: { roles: [] } })
    await store.dispatch('m/referentiels')
    expect(axios.get).toHaveBeenLastCalledWith(`/api/referentiels/${resource}`, {})
    expect(store.getters['m/getReferentiels']).toEqual({ roles: [] })
  })

  it('save : POST ou PATCH multipart, liste mise à jour', async () => {
    const store = s()
    axios.post.mockResolvedValue({ data: { [key]: { id: 2, name: 'A' } } })
    await expect(store.dispatch('m/save', { name: 'A' })).resolves.toEqual({ id: 2, name: 'A' })
    expect(axios.post).toHaveBeenCalledWith(`/api/${resource}`, { [key]: { name: 'A' } }, multipart)
    axios.patch.mockResolvedValue({ data: { [key]: { id: 2, name: 'B' } } })
    await store.dispatch('m/save', { id: 2, name: 'B' })
    expect(axios.patch).toHaveBeenCalledWith(`/api/${resource}/2`, { [key]: { id: 2, name: 'B' } }, multipart)
    expect(store.getters['m/getItems']).toEqual([{ id: 2, name: 'B' }])
  })

  it('delete retire l’élément de la liste', async () => {
    const store = s()
    store.commit('m/setItems', [{ id: 1 }, { id: 2 }])
    axios.delete.mockResolvedValue({})
    axios.get.mockResolvedValue({ data: { [resource]: [{ id: 2 }], [key]: {} } })
    await store.dispatch('m/delete', 1)
    expect(axios.delete).toHaveBeenCalledWith(`/api/${resource}/1`, {})
    expect(store.getters['m/getItems']).toEqual([{ id: 2 }])
  })

  it('membres : ajout, rôle, retrait', async () => {
    const store = s()
    store.commit('m/setItem', { id: 4 })
    store.commit('m/setMembers', [{ membership_id: 7, role_name: 'member' }])
    axios.post.mockResolvedValueOnce({ data: { members: [{ membership_id: 7 }, { membership_id: 8 }] } })
    await store.dispatch('m/addMembers', [{ id: 1, type: 'User' }])
    expect(axios.post).toHaveBeenLastCalledWith(`/api/${resource}/4/members`, { members: [{ id: 1, type: 'User' }] })
    expect(store.getters['m/getMembers']).toHaveLength(2)

    axios.post.mockResolvedValueOnce({ data: { membership: { membership_id: 7, role_name: 'president' } } })
    await store.dispatch('m/setRole', { member: { membership_id: 7 }, role: 'president' })
    expect(axios.post).toHaveBeenLastCalledWith(`/api/${resource}/4/roles/edit`, { member: { membership_id: 7 }, role: 'president' })
    expect(store.getters['m/getMembers'][0].role_name).toBe('president')
    axios.post.mockResolvedValueOnce({ data: { membership: JSON.stringify({ membership_id: 9 }) } })
    await store.dispatch('m/setRole', {})
    expect(store.getters['m/getMembers']).toHaveLength(3)

    axios.delete.mockResolvedValueOnce({})
    await store.dispatch('m/removeMember', 8)
    expect(store.getters['m/getMembers'].map(m => m.membership_id)).toEqual([7, 9])
    store.commit('m/removeMemberIdMembersById', 99)
    store.commit('m/removeItemInItemsById', 99)
    store.commit('m/setItemInItemsById', JSON.stringify({ id: 5 }))
    store.commit('m/setDialogForm', true)
    store.commit('m/setFormLoading', true)
    expect(store.getters['m/getMembers']).toHaveLength(2)
    expect(store.getters['m/getItems']).toEqual([{ id: 5 }])
    expect(store.getters['m/getDialogForm']).toBe(true)
    expect(store.getters['m/getFormLoading']).toBe(true)
  })

  it('toutes les actions rejettent l’erreur de l’API', async () => {
    const store = s()
    for (const m of ['get', 'post', 'patch', 'delete']) axios[m].mockRejectedValue(err)
    for (const [action, payload] of [['items'], ['item', 1], ['save', { id: 1 }], ['save', {}], ['delete', 1],
      ['referentiels'], ['addMembers', []], ['setRole', {}], ['removeMember', 1]]) {
      await expect(store.dispatch('m/' + action, payload)).rejects.toBe(err)
    }
  })
})

describe('associationsStore : mise à jour d’une adhésion', () => {
  it('PATCH /api/memberships/:id', async () => {
    const store = moduleStore(associationsStore)
    axios.patch.mockResolvedValueOnce({ data: { status: 200 } })
    await store.dispatch('m/updateMembership', { membership_id: 3, can_vote: false })
    expect(axios.patch).toHaveBeenCalledWith('/api/memberships/3', { membership_id: 3, can_vote: false })
    axios.patch.mockRejectedValueOnce(err)
    await expect(store.dispatch('m/updateMembership', { membership_id: 3 })).rejects.toBe(err)
  })
})

describe('postsStore (ancien)', () => {
  const s = () => moduleStore(postsStore)

  it('items, item (fichiers et accès), referentiels', async () => {
    const store = s()
    axios.get.mockResolvedValueOnce({ data: { posts: [{ id: 1 }] } })
    await store.dispatch('m/items', { domain: 'admin' })
    expect(axios.get).toHaveBeenLastCalledWith('/api/posts', { params: { domain: 'admin' } })
    expect(store.getters['m/getItems']).toEqual([{ id: 1 }])
    axios.get.mockResolvedValueOnce({ data: { post: { id: 1 }, files: [{ id: 2 }], accesses: ['pasteur'] } })
    await store.dispatch('m/item', 1)
    expect(store.getters['m/getItem']).toEqual({ id: 1, files: [{ id: 2 }], accesses: ['pasteur'] })
    axios.get.mockResolvedValueOnce({ data: { structures: [] } })
    await store.dispatch('m/referentiels', { domain: 'region' })
    expect(axios.get).toHaveBeenLastCalledWith('/api/referentiels/posts', { params: { domain: 'region' } })
    expect(store.getters['m/getReferentiels']).toEqual({ structures: [] })
  })

  it('save, delete, deleteFile', async () => {
    const store = s()
    axios.post.mockResolvedValue({ data: { post: { id: 3 } } })
    await expect(store.dispatch('m/save', { post: { title: 'X' } })).resolves.toEqual({ id: 3 })
    expect(axios.post).toHaveBeenCalledWith('/api/posts', { post: { title: 'X' } }, multipart)
    axios.patch.mockResolvedValue({ data: { post: { id: 3, title: 'Y' } } })
    await store.dispatch('m/save', { post: { id: 3, title: 'Y' } })
    expect(axios.patch).toHaveBeenCalledWith('/api/posts/3', { post: { id: 3, title: 'Y' } }, multipart)
    expect(store.getters['m/getItems']).toEqual([{ id: 3, title: 'Y' }])
    axios.delete.mockResolvedValue({})
    await store.dispatch('m/delete', 3)
    expect(store.getters['m/getItems']).toEqual([])
    await store.dispatch('m/deleteFile', 8)
    expect(axios.delete).toHaveBeenLastCalledWith('/api/files/8', {})
    store.commit('m/setDialogForm', true)
    store.commit('m/setFormLoading', true)
    store.commit('m/removeItemInItemsById', 99)
    store.commit('m/setItemInItemsById', JSON.stringify({ id: 4 }))
    expect(store.getters['m/getDialogForm'] && store.getters['m/getFormLoading']).toBe(true)
    expect(store.getters['m/getItems']).toEqual([{ id: 4 }])
  })

  it('erreurs propagées', async () => {
    const store = s()
    for (const m of ['get', 'post', 'patch', 'delete']) axios[m].mockRejectedValue(err)
    for (const [action, payload] of [['items'], ['item', 1], ['save', { post: { id: 1 } }], ['save', { post: {} }],
      ['delete', 1], ['deleteFile', 1], ['referentiels']]) {
      await expect(store.dispatch('m/' + action, payload)).rejects.toBe(err)
    }
  })
})

describe('feesStore (ancien)', () => {
  const s = () => moduleStore(feesStore)

  it('items, item, save, delete, referentiels', async () => {
    const store = s()
    axios.get.mockResolvedValueOnce({ data: { fees: [{ id: 1 }, { id: 2 }] } })
    await store.dispatch('m/items')
    expect(axios.get).toHaveBeenLastCalledWith('/api/fees', {})
    expect(store.getters['m/getItems']).toHaveLength(2)
    axios.get.mockResolvedValueOnce({ data: { fee: { id: 1, amount: 50 } } })
    await store.dispatch('m/item', 1)
    expect(store.getters['m/getItem']).toEqual({ id: 1, amount: 50 })

    axios.post.mockResolvedValue({ data: { fee: { id: 3 } } })
    await expect(store.dispatch('m/save', { fee: { amount: 20 } })).resolves.toEqual({ id: 3 })
    expect(axios.post).toHaveBeenCalledWith('/api/fees', { fee: { amount: 20 } })
    axios.patch.mockResolvedValue({ data: { fee: { id: 3, amount: 30 } } })
    await store.dispatch('m/save', { fee: { id: 3, amount: 30 } })
    expect(axios.patch).toHaveBeenCalledWith('/api/fees/3', { fee: { id: 3, amount: 30 } })
    expect(store.getters['m/getItem']).toEqual({ id: 3, amount: 30 })

    axios.delete.mockResolvedValue({})
    await store.dispatch('m/delete', 1)
    expect(store.getters['m/getItems']).toEqual([{ id: 2 }])

    axios.get.mockResolvedValueOnce({ data: { years: [2026] } })
    await store.dispatch('m/referentiels')
    expect(axios.get).toHaveBeenLastCalledWith('/api/referentiels/fees', {})
    store.commit('m/setDialogForm', true)
    store.commit('m/setFormLoading', true)
    store.commit('m/removeItemInItemsById', 99)
    store.commit('m/setItemInItemsById', { id: 2, amount: 10 })
    store.commit('m/setItemInItemsById', JSON.stringify({ id: 5 }))
    expect(store.getters['m/getItems']).toEqual([{ id: 2, amount: 10 }, { id: 5 }])
    expect(store.getters['m/getDialogForm'] && store.getters['m/getFormLoading']).toBe(true)
    expect(store.getters['m/getReferentiel']).toEqual([])
  })

  it('erreurs propagées', async () => {
    const store = s()
    for (const m of ['get', 'post', 'patch', 'delete']) axios[m].mockRejectedValue(err)
    for (const [action, payload] of [['items'], ['item', 1], ['save', { fee: { id: 1 } }], ['save', { fee: {} }],
      ['delete', 1], ['referentiels']]) {
      await expect(store.dispatch('m/' + action, payload)).rejects.toBe(err)
    }
  })
})
