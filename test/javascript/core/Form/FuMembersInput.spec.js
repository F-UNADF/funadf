import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axios from 'axios'
import FuMembersInput from '@/components/Form/FuMembersInput.vue'
import { store, flush } from '../../helpers.js'
import { globalOptions, squash, bodyText } from '../support.js'

vi.mock('axios')

// Membres tels que les renvoie Structure#members_with_details
const members = () => [
  { membership_id: 11, member_id: 1, member_type: 'User', name: 'DUPONT Jean', town: 'Lyon', zipcode: '69000', role_name: 'president', role_friendly_name: 'Président', can_vote: true },
  { membership_id: 12, member_id: 7, member_type: 'Structure', name: 'Église de Lyon', town: null, zipcode: null, role_name: 'member', can_vote: false },
]

const referentiels = () => ({
  roles: [{ name: 'president', friendly_name: 'Président' }, { name: 'treasurer' }],
  members: [
    { member_id: 1, member_type: 'User', name: 'DUPONT Jean' },
    { member_id: 2, member_type: 'User', name: 'DURAND Marie' },
    { member_id: 8, member_type: 'Structure', name: 'Église de Lille' },
  ],
})

function mountMembers({ list = members(), refs = referentiels() } = {}) {
  const s = store()
  s.commit('regions/setItem', { id: 5 })
  s.commit('regions/setMembers', list)
  s.commit('regions/setReferentiels', refs)
  const wrapper = mount(FuMembersInput, {
    attachTo: document.body,
    props: { model: 'regions' },
    global: globalOptions(s),
  })
  wrapper.vm.$root.showSnackbar = vi.fn()
  return { wrapper, s }
}

const rows = (wrapper) => wrapper.findAll('tbody tr').map(r => r.findAll('td').map(td => squash(td.text())))

describe('FuMembersInput : membres d’une structure', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })
  afterEach(() => { document.body.innerHTML = '' })

  it('liste les membres : nom, ville, rôle, droit de vote', async () => {
    const { wrapper } = mountMembers()
    await flush()
    const r = rows(wrapper)
    expect(r[0].slice(0, 3)).toEqual(['DUPONT Jean', 'Lyon (69000)', 'Président'])
    expect(r[1].slice(0, 3)).toEqual(['Église de Lyon', '', 'member'])
    const switches = wrapper.findAll('.v-switch input')
    expect(switches[0].element.checked).toBe(true)
    expect(switches[1].element.checked).toBe(false)
    // icône différente pour une structure
    expect(wrapper.findAll('tbody tr')[1].find('.mdi-office-building').exists()).toBe(true)
  })

  it('sans membre : message explicatif', async () => {
    const { wrapper } = mountMembers({ list: [] })
    await flush()
    expect(squash(wrapper.text())).toContain('Aucun membre trouvé')
    expect(squash(wrapper.text())).toContain('Aucun membre disponible')
  })

  it('recherche : propose les membres du référentiel à partir de 3 caractères', async () => {
    const { wrapper } = mountMembers()
    wrapper.vm.search = 'du'
    await flush()
    expect(wrapper.vm.matchMembers).toEqual([])
    wrapper.vm.search = 'DUR'
    await flush()
    expect(wrapper.vm.matchMembers).toEqual([
      { id: 2, type: 'User', name: 'DURAND Marie', title: 'DURAND Marie', icon: 'mdi-account' },
    ])
    wrapper.vm.search = 'église'
    await flush()
    expect(wrapper.vm.matchMembers).toEqual([
      { id: 8, type: 'Structure', name: 'Église de Lille', title: 'Église de Lille', icon: 'mdi-account-group' },
    ])
  })

  it('ajoute les membres choisis puis vide la sélection', async () => {
    const { wrapper, s } = mountMembers()
    wrapper.vm.addingMembers = [{ id: 2, type: 'User', name: 'DURAND Marie' }]
    wrapper.vm.search = 'DURAND'
    axios.post.mockResolvedValue({ data: { status: 200, members: [...members(), { membership_id: 13, name: 'DURAND Marie', town: null }] } })
    await wrapper.findAll('button').find(b => squash(b.text()) === 'Ajouter les membres').trigger('click')
    await flush()
    expect(axios.post).toHaveBeenCalledWith('/api/regions/5/members', { members: [{ id: 2, type: 'User', name: 'DURAND Marie' }] })
    expect(wrapper.vm.$root.showSnackbar).toHaveBeenCalledWith('Membres ajoutés avec succés', 'success')
    expect(wrapper.vm.addingMembers).toEqual([])
    expect(wrapper.vm.search).toBe('')
    expect(s.getters['regions/getMembers']).toHaveLength(3)
    expect(rows(wrapper)).toHaveLength(3)
  })

  it('change le rôle d’un membre depuis le menu des rôles', async () => {
    const { wrapper } = mountMembers()
    await flush()
    axios.post.mockResolvedValue({ data: { status: 200, members: members() } })
    await wrapper.findAll('tbody tr')[1].find('button').trigger('click')
    await flush()
    const items = document.querySelectorAll('.v-overlay--active .v-list-item')
    expect(Array.from(items).map(i => squash(i.textContent))).toEqual(['Président', 'treasurer'])
    items[1].click()
    await flush()
    expect(axios.post).toHaveBeenCalledWith('/api/regions/5/roles/edit', { member: expect.objectContaining({ membership_id: 12 }), role: 'treasurer' })
    expect(wrapper.vm.$root.showSnackbar).toHaveBeenCalledWith('Role modifié avec succés', 'success')
  })

  it('bascule le droit de vote', async () => {
    const { wrapper, s } = mountMembers()
    await flush()
    axios.post.mockResolvedValue({ data: { status: 200, membership: { id: 12, can_vote: true } } })
    await wrapper.findAll('.v-switch input')[1].setValue(true)
    await flush()
    expect(axios.post).toHaveBeenCalledWith('/api/memberships/12/toggleCanVote')
    expect(s.getters['regions/getMembers'][1].can_vote).toBe(true)
    expect(wrapper.vm.$root.showSnackbar).toHaveBeenCalledWith('Membre mis à jour avec succés', 'success')
  })

  it('retire un membre', async () => {
    const { wrapper } = mountMembers()
    await flush()
    axios.delete.mockResolvedValue({ data: { status: 200, members: [members()[0]] } })
    await wrapper.findAll('tbody tr')[1].find('.mdi-delete').trigger('click')
    await flush()
    expect(axios.delete).toHaveBeenCalledWith('/api/memberships/12', {})
    expect(wrapper.vm.$root.showSnackbar).toHaveBeenCalledWith('Membre supprimé avec succés', 'success')
    expect(rows(wrapper)).toHaveLength(1)
  })

  it('erreurs : message générique puis détail renvoyé par l’API, pour chaque action', async () => {
    const { wrapper } = mountMembers()
    const error = { response: { data: { errors: ['Accès refusé', 'Réessayez'] } } }
    axios.post.mockRejectedValue(error)
    axios.delete.mockRejectedValue(error)
    const cases = [
      [() => wrapper.vm.addMember(), 'Un probleme est survenu lors de l\'enregistrement des membres'],
      [() => wrapper.vm.setRole(members()[0], 'treasurer'), 'Un probleme est survenu lors de la modification du role'],
      [() => wrapper.vm.removeMember(11), 'Un probleme est survenu lors de la suppression du membre'],
      [() => wrapper.vm.setCanVote(11), 'Un probleme est survenu lors de la mise à jour du membre'],
    ]
    for (const [run, message] of cases) {
      wrapper.vm.$root.showSnackbar.mockClear()
      run()
      await flush()
      expect(wrapper.vm.$root.showSnackbar.mock.calls).toEqual([[message, 'error'], ['Accès refusé<br/>Réessayez', 'error']])
    }
  })

  it('getRoleName : libellé du rôle s’il est connu, sinon le nom brut', () => {
    const { wrapper } = mountMembers({ refs: { roles: { president: 'Président' }, members: [] } })
    expect(wrapper.vm.getRoleName('president')).toBe('Président')
    expect(wrapper.vm.getRoleName('member')).toBe('member')
  })

  it('le champ d’ajout affiche les membres trouvés', async () => {
    const { wrapper } = mountMembers()
    await flush()
    const input = wrapper.find('.v-autocomplete input')
    await input.trigger('focus')
    await input.setValue('DUR')
    await flush()
    expect(bodyText()).toContain('DURAND Marie')
  })
})
