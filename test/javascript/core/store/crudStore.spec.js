import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import createCrudStore from '@/store/modules/crudStore'
import { moduleStore, formDataEntries } from '../support.js'

vi.mock('axios')

const regions = () => moduleStore(createCrudStore({ resource: 'regions' }), 'regions')

describe('crudStore : store générique des écrans d’admin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  it('part d’un état vide', () => {
    const s = regions()
    expect(s.getters['regions/getItems']).toEqual([])
    expect(s.getters['regions/getItem']).toEqual({})
    expect(s.getters['regions/getLoading']).toBe(false)
    expect(s.getters['regions/getDialog']).toBe(false)
    expect(s.getters['regions/getConfig']).toEqual({})
    expect(s.getters['regions/getReferentiels']).toEqual([])
    expect(s.getters['regions/getMembers']).toEqual([])
  })

  it('fetchItems : charge la liste avec les filtres en query string et gère l’indicateur de chargement', async () => {
    const s = regions()
    let resolve
    axios.get.mockReturnValue(new Promise(r => { resolve = r }))
    const p = s.dispatch('regions/fetchItems', { search: 'Sud', domain: 'admin' })
    expect(s.getters['regions/getLoading']).toBe(true)
    expect(axios.get).toHaveBeenCalledWith('/api/regions?search=Sud&domain=admin')
    resolve({ data: { regions: [{ id: 1, name: 'Sud-Est' }] } })
    await p
    expect(s.getters['regions/getItems']).toEqual([{ id: 1, name: 'Sud-Est' }])
    expect(s.getters['regions/getLoading']).toBe(false)
  })

  it('fetchItems ignore les filtres vides (recherche effacée, espace absent)', async () => {
    const s = regions()
    axios.get.mockResolvedValue({ data: { regions: [] } })
    await s.dispatch('regions/fetchItems', { search: null, domain: null })
    expect(axios.get).toHaveBeenLastCalledWith('/api/regions')
    await s.dispatch('regions/fetchItems', { search: '', domain: 'admin', page: undefined })
    expect(axios.get).toHaveBeenLastCalledWith('/api/regions?domain=admin')
  })

  it('fetchItems sans filtre appelle l’URL nue ; en erreur le chargement s’arrête quand même', async () => {
    const s = regions()
    axios.get.mockRejectedValue(new Error('500'))
    await expect(s.dispatch('regions/fetchItems')).rejects.toThrow('500')
    expect(axios.get).toHaveBeenCalledWith('/api/regions')
    expect(s.getters['regions/getLoading']).toBe(false)
  })

  it('fetchItem : charge la fiche au singulier et ses membres, et renvoie une promesse', async () => {
    const s = moduleStore(createCrudStore({ resource: 'churches' }), 'churches')
    axios.get.mockResolvedValue({ data: { church: { id: 4, name: 'Lyon' }, members: [{ membership_id: 9 }] } })
    await s.dispatch('churches/fetchItem', 4)
    expect(axios.get).toHaveBeenCalledWith('/api/churches/4')
    expect(s.getters['churches/getItem']).toEqual({ id: 4, name: 'Lyon' })
    expect(s.getters['churches/getMembers']).toEqual([{ membership_id: 9 }])
  })

  it('fetchItem sans membres ne touche pas à la liste des membres', async () => {
    const s = moduleStore(createCrudStore({ resource: 'fees' }), 'fees')
    s.commit('fees/setMembers', [{ membership_id: 1 }])
    axios.get.mockResolvedValue({ data: { fee: { id: 2 } } })
    await s.dispatch('fees/fetchItem', 2)
    expect(s.getters['fees/getItem']).toEqual({ id: 2 })
    expect(s.getters['fees/getMembers']).toEqual([{ membership_id: 1 }])
  })

  it('singularise les ressources : associations, posts, boxes, class', async () => {
    for (const [resource, key] of [['associations', 'association'], ['posts', 'post'], ['boxes', 'box'], ['class', 'class'], ['parties', 'party']]) {
      const s = moduleStore(createCrudStore({ resource }), 'x')
      axios.get.mockResolvedValue({ data: { [key]: { id: 1, resource } } })
      await s.dispatch('x/fetchItem', 1)
      expect(s.getters['x/getItem']).toEqual({ id: 1, resource })
    }
  })

  it('fetchConfig : lit /api/:model/config et garde la clé config', async () => {
    const s = regions()
    const config = { toolbarActions: [{ name: 'add', action: 'add' }], itemActions: [], form: { tabs: [] } }
    axios.get.mockResolvedValue({ data: { config } })
    await s.dispatch('regions/fetchConfig')
    expect(axios.get).toHaveBeenCalledWith('/api/regions/config')
    expect(s.getters['regions/getConfig']).toEqual(config)
  })

  it('saveItem crée en POST multipart, ferme le dialogue et recharge la liste', async () => {
    const s = regions()
    s.commit('regions/setDialog', true)
    axios.post.mockResolvedValue({ data: { status: 200, region: { id: 3, name: 'Nord' } } })
    axios.get.mockResolvedValue({ data: { regions: [{ id: 3, name: 'Nord' }] } })
    const logo = new File(['x'], 'logo.png', { type: 'image/png' })
    await s.dispatch('regions/saveItem', {
      name: 'Nord', logo, accesses: ['pasteur', 'membre'],
      existing_attachments: [{ id: 1, name: 'a.pdf' }], address: { town: 'Lille' }, count: 2,
    })

    const [url, fd, options] = axios.post.mock.calls[0]
    expect(url).toBe('/api/regions')
    expect(options).toEqual({ headers: { 'Content-Type': 'multipart/form-data' } })
    expect(formDataEntries(fd)).toEqual([
      ['region[name]', 'Nord'],
      ['region[logo]', 'File(logo.png)'],
      ['region[accesses][]', 'pasteur'],
      ['region[accesses][]', 'membre'],
      ['region[existing_attachments][0][id]', '1'],
      ['region[existing_attachments][0][name]', 'a.pdf'],
      ['region[address][town]', 'Lille'],
      ['region[count]', '2'],
    ])
    expect(s.getters['regions/getItem']).toEqual({ id: 3, name: 'Nord' })
    expect(s.getters['regions/getDialog']).toBe(false)
    expect(axios.get).toHaveBeenCalledWith('/api/regions')
    expect(s.getters['regions/getItems']).toEqual([{ id: 3, name: 'Nord' }])
  })

  it('saveItem modifie en PATCH sur /api/:model/:id', async () => {
    const s = regions()
    axios.patch.mockResolvedValue({ data: { status: 200, region: { id: 3, name: 'Nord-Est' } } })
    axios.get.mockResolvedValue({ data: { regions: [] } })
    await s.dispatch('regions/saveItem', { id: 3, name: 'Nord-Est' })
    expect(axios.patch.mock.calls[0][0]).toBe('/api/regions/3')
    expect(formDataEntries(axios.patch.mock.calls[0][1])).toEqual([['region[id]', '3'], ['region[name]', 'Nord-Est']])
  })

  it('saveItem envoie un champ vide, et non la chaîne « null », pour une valeur absente', async () => {
    // Structure.new (defaultItem du formulaire) contient des champs à null : Rails les enregistrerait tels quels
    const s = regions()
    axios.post.mockResolvedValue({ data: { status: 200, region: { id: 1 } } })
    axios.get.mockResolvedValue({ data: { regions: [] } })
    await s.dispatch('regions/saveItem', { id: null, name: 'Sud', address_2: null, website: undefined })
    expect(formDataEntries(axios.post.mock.calls[0][1])).toEqual([
      ['region[id]', ''], ['region[name]', 'Sud'], ['region[address_2]', ''], ['region[website]', ''],
    ])
  })

  it('saveItem rejette les erreurs de validation renvoyées en HTTP 200 avec status 422', async () => {
    const s = regions()
    s.commit('regions/setDialog', true)
    const data = { status: 422, errors: { name: ['doit être rempli(e)'] } }
    axios.post.mockResolvedValue({ data })
    await expect(s.dispatch('regions/saveItem', { name: '' })).rejects.toEqual({ response: { data } })
    expect(s.getters['regions/getDialog']).toBe(true) // le formulaire reste ouvert
    expect(axios.get).not.toHaveBeenCalled()
  })

  it('saveItem propage une erreur HTTP', async () => {
    const s = regions()
    axios.post.mockRejectedValue({ response: { status: 403 } })
    await expect(s.dispatch('regions/saveItem', { name: 'X' })).rejects.toEqual({ response: { status: 403 } })
  })

  it('deleteItem supprime puis recharge la liste ; en erreur, rejette', async () => {
    const s = regions()
    axios.delete.mockResolvedValueOnce({ data: { status: 200 } })
    axios.get.mockResolvedValue({ data: { regions: [] } })
    await s.dispatch('regions/deleteItem', 7)
    expect(axios.delete).toHaveBeenCalledWith('/api/regions/7', {})
    expect(axios.get).toHaveBeenCalledWith('/api/regions')

    axios.delete.mockRejectedValueOnce(new Error('403'))
    await expect(s.dispatch('regions/deleteItem', 7)).rejects.toThrow('403')
  })

  it('referentiels : charge /api/referentiels/:model', async () => {
    const s = regions()
    axios.get.mockResolvedValueOnce({ data: { roles: [{ name: 'president' }], members: [] } })
    await s.dispatch('regions/referentiels')
    expect(axios.get).toHaveBeenCalledWith('/api/referentiels/regions', {})
    expect(s.getters['regions/getReferentiels']).toEqual({ roles: [{ name: 'president' }], members: [] })
    axios.get.mockRejectedValueOnce(new Error('x'))
    await expect(s.dispatch('regions/referentiels')).rejects.toThrow('x')
  })

  it('gestion des membres : ajout, rôle, retrait, droit de vote', async () => {
    const s = regions()
    s.commit('regions/setItem', { id: 5 })
    const members = [{ membership_id: 11, name: 'Jean', can_vote: true }, { membership_id: 12, name: 'Église', can_vote: true }]

    axios.post.mockResolvedValueOnce({ data: { members } })
    await s.dispatch('regions/addMembers', [{ id: 1, type: 'User' }])
    expect(axios.post).toHaveBeenLastCalledWith('/api/regions/5/members', { members: [{ id: 1, type: 'User' }] })
    expect(s.getters['regions/getMembers']).toEqual(members)

    axios.post.mockResolvedValueOnce({ data: { members: [members[0]] } })
    await s.dispatch('regions/setRole', { member: members[1], role: 'president' })
    expect(axios.post).toHaveBeenLastCalledWith('/api/regions/5/roles/edit', { member: members[1], role: 'president' })
    expect(s.getters['regions/getMembers']).toEqual([members[0]])

    s.commit('regions/setMembers', members)
    axios.post.mockResolvedValueOnce({ data: { membership: { id: 12, can_vote: false, role_id: 3 } } })
    await s.dispatch('regions/toggleCanVote', 12)
    expect(axios.post).toHaveBeenLastCalledWith('/api/memberships/12/toggleCanVote')
    expect(s.getters['regions/getMembers'][1]).toMatchObject({ membership_id: 12, name: 'Église', can_vote: false, role_id: 3 })

    axios.delete.mockResolvedValueOnce({ data: { members: [members[0]] } })
    await s.dispatch('regions/removeMember', 12)
    expect(axios.delete).toHaveBeenLastCalledWith('/api/memberships/12', {})
    expect(s.getters['regions/getMembers']).toEqual([members[0]])
  })

  it('gestion des membres : chaque action rejette l’erreur de l’API', async () => {
    const s = regions()
    s.commit('regions/setItem', { id: 5 })
    const err = { response: { data: { errors: ['Interdit'] } } }
    axios.post.mockRejectedValue(err)
    axios.delete.mockRejectedValue(err)
    await expect(s.dispatch('regions/addMembers', [])).rejects.toBe(err)
    await expect(s.dispatch('regions/setRole', {})).rejects.toBe(err)
    await expect(s.dispatch('regions/toggleCanVote', 1)).rejects.toBe(err)
    await expect(s.dispatch('regions/removeMember', 1)).rejects.toBe(err)
  })

  it('setMemberInMembersById ignore un identifiant inconnu', () => {
    const s = regions()
    s.commit('regions/setMembers', [{ id: 1, membership_id: 1 }, { id: 2, membership_id: 2 }])
    s.commit('regions/setMemberInMembersById', { id: 99, can_vote: false })
    expect(s.getters['regions/getMembers']).toHaveLength(2)
  })
})
