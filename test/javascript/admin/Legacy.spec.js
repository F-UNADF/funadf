// Anciens écrans de gestion (components/Churches, Associations, Fees) : remplacés dans le routeur par
// les pages génériques (pages/*/Index.vue + FuDatabase), mais toujours présents dans le code.
import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import ChurchesIndex from '@/components/Churches/Index.vue'
import ChurchForm from '@/components/Churches/Form.vue'
import AssociationsIndex from '@/components/Associations/Index.vue'
import AssociationForm from '@/components/Associations/Form.vue'
import FeesIndex from '@/components/Fees/Index.vue'
import FeeForm from '@/components/Fees/Form.vue'
import { mountAdmin, adminStore, flush, click, fill, apiError, text, dialog, routeGet } from './support.js'

vi.mock('axios')

const clone = (value) => JSON.parse(JSON.stringify(value))

const currentYear = String(new Date().getFullYear())

const members = [
  { membership_id: 500, member_id: 5, member_type: 'User', name: 'Dupont Jean', town: 'Lyon', zipcode: '69001', role_name: 'president', can_vote: true },
  { membership_id: 501, member_id: 40, member_type: 'Structure', name: 'Œuvre sociale', town: null, zipcode: null, role_name: 'member', can_vote: false },
]
const referentiels = {
  roles: { president: 'Président', member: 'Membre' },
  members: [
    { member_id: 7, member_type: 'User', name: 'Durand Marie' },
    { member_id: 41, member_type: 'Structure', name: 'Église de Durance' },
  ],
}

function structureFlow({ Index, Form, model, resource, singular, labels }) {
  const list = [{ id: 30, name: `${labels.one} de Lyon`, zipcode: '69001', town: 'Lyon', lastname: 'Dupont', firstname: 'Jean' }]

  async function mountIndex(s = adminStore()) {
    routeGet(axios, {
      [`/api/referentiels/${resource}`]: referentiels,
      [`/api/${resource}/30`]: { [singular]: list[0], members },
      [`/api/${resource}`]: { [resource]: list },
    })
    const mounted = mountAdmin(Index, { store: s })
    await flush()
    return mounted
  }

  describe(`${labels.title} (ancien écran) : liste et suppression`, () => {
    beforeEach(() => vi.resetAllMocks())

    it('charge la liste et les référentiels', async () => {
      const { wrapper } = await mountIndex()
      expect(axios.get).toHaveBeenCalledWith(`/api/${resource}`, {})
      expect(axios.get).toHaveBeenCalledWith(`/api/referentiels/${resource}`, {})
      expect(text(wrapper)).toContain(`${labels.one} de Lyon`)
      expect(text(wrapper)).toContain('Lyon')
    })

    it('Actualiser recharge la liste ; liste vide : message', async () => {
      const { wrapper, store } = await mountIndex()
      axios.get.mockClear()
      wrapper.find('.mdi-reload').element.closest('button').click()
      await flush()
      expect(axios.get).toHaveBeenCalledWith(`/api/${resource}`, {})
      store.commit(`${model}/setItems`, [])
      await flush()
      expect(text(wrapper)).toContain(labels.empty)
    })

    it('supprime après confirmation', async () => {
      const { wrapper, snackbar } = await mountIndex()
      wrapper.find('[title="Delete"]').trigger('click')
      await flush()
      expect(text(dialog())).toContain(labels.confirm)
      await click('Annuler', dialog())
      expect(wrapper.vm.dialogConfirmDelete).toBe(false)

      wrapper.find('[title="Delete"]').trigger('click')
      await flush()
      axios.delete.mockResolvedValue({ data: { status: 200 } })
      await click('Supprimer', dialog())
      expect(axios.delete).toHaveBeenCalledWith(`/api/${resource}/30`, {})
      expect(snackbar).toHaveBeenCalledWith(labels.deleted, 'success')
    })
  })

  describe(`${labels.title} (ancien écran) : fiche`, () => {
    beforeEach(() => vi.resetAllMocks())

    async function openEdit() {
      const mounted = await mountIndex()
      mounted.wrapper.find('[title="Edit"]').trigger('click')
      await flush()
      return mounted
    }

    it('ouvre la fiche, modifie et enregistre (PATCH multipart)', async () => {
      const { snackbar, store } = await openEdit()
      expect(axios.get).toHaveBeenCalledWith(`/api/${resource}/30`, {})
      const form = dialog()
      expect(text(form)).toContain(labels.edit)
      await fill('Nom', `${labels.one} évangélique de Lyon`, form)
      axios.patch.mockResolvedValue({ data: { status: 200, [singular]: { ...list[0], name: 'X' } } })
      await click('Enregistrer', form)
      expect(axios.patch).toHaveBeenCalledWith(`/api/${resource}/30`, {
        [singular]: expect.objectContaining({ id: 30, name: `${labels.one} évangélique de Lyon` }),
      }, { headers: { 'Content-Type': 'multipart/form-data' } })
      expect(snackbar).toHaveBeenCalledWith(labels.saved, 'success')
      expect(store.state[model].dialogForm).toBe(false)
    })

    it('erreurs d’enregistrement et choix du logo', async () => {
      const { wrapper, snackbar } = await openEdit()
      axios.patch.mockRejectedValue(apiError(['Nom doit être rempli(e)']))
      await click('Enregistrer', dialog())
      expect(snackbar).toHaveBeenCalledWith('Nom doit être rempli(e)', 'error')

      const form = wrapper.findComponent(Form)
      form.vm.prepareLogo([])
      form.vm.prepareLogo([new File(['a'], 'a.png'), new File(['b'], 'b.png')])
      const logo = new File(['a'], 'logo.png')
      form.vm.prepareLogo([logo])
      expect(snackbar).toHaveBeenCalledWith('Aucun fichier sélectionné', 'warning')
      expect(snackbar).toHaveBeenCalledWith('Vous devez sélectionner un seul fichier', 'warning')
      expect(form.vm.editedItem.logo).toBe(logo)
    })

    it('gère les membres : liste, rôle, ajout, retrait', async () => {
      const { wrapper, snackbar } = await openEdit()
      await click('Membres', dialog())
      const form = wrapper.findComponent(Form)
      expect(text(dialog())).toContain('Dupont Jean')
      expect(text(dialog())).toContain('Président') // libellé du rôle
      expect(form.vm.getRoleName('inconnu')).toBe('inconnu')

      // recherche de membres à ajouter (3 caractères minimum)
      form.vm.search = 'du'
      await flush()
      expect(form.vm.matchMembers).toEqual([])
      form.vm.search = 'dur'
      await flush()
      expect(form.vm.matchMembers.map(m => m.name)).toEqual(['Durand Marie', 'Église de Durance'])
      expect(form.vm.matchMembers[1].icon).toBe('mdi-account-group')

      axios.post.mockResolvedValue({ data: { members: clone(members), membership: clone(members[0]) } })
      form.vm.addingMembers = ['7#User#Durand Marie']
      form.vm.addMember()
      await flush()
      expect(axios.post).toHaveBeenCalledWith(`/api/${resource}/30/members`, { members: ['7#User#Durand Marie'] })
      expect(snackbar).toHaveBeenCalledWith('Membres ajoutés avec succés', 'success')

      form.vm.setRole(members[1], 'president')
      await flush()
      expect(axios.post).toHaveBeenCalledWith(`/api/${resource}/30/roles/edit`, { member: members[1], role: 'president' })
      expect(snackbar).toHaveBeenCalledWith('Role modifié avec succés', 'success')

      axios.delete.mockResolvedValue({ data: { status: 200 } })
      form.vm.removeMember(501)
      await flush()
      expect(axios.delete).toHaveBeenCalledWith(labels.removeUrl(501), {})
      expect(snackbar).toHaveBeenCalledWith('Membre supprimé avec succés', 'success')
    })

    it('signale les erreurs sur les membres', async () => {
      const { wrapper, snackbar } = await openEdit()
      const form = wrapper.findComponent(Form)
      axios.post.mockRejectedValue(apiError(['Refusé']))
      axios.delete.mockRejectedValue(apiError(['Refusé']))
      form.vm.addMember()
      form.vm.setRole(members[0], 'member')
      form.vm.removeMember(500)
      await flush()
      expect(snackbar).toHaveBeenCalledWith('Un probleme est survenu lors de l\'enregistrement des membres', 'error')
      expect(snackbar).toHaveBeenCalledWith('Un probleme est survenu lors de la modification du role', 'error')
      expect(snackbar).toHaveBeenCalledWith('Un probleme est survenu lors de la suppression du membre', 'error')
      expect(snackbar).toHaveBeenCalledWith('Refusé', 'error')
    })

    it('fermer la fiche', async () => {
      const { store } = await openEdit()
      dialog().querySelector('.mdi-close').closest('button').click()
      await flush()
      expect(store.state[model].dialogForm).toBe(false)
    })
  })

  return { mountIndex }
}

const churches = structureFlow({
  Index: ChurchesIndex, Form: ChurchForm, model: 'churchesStore', resource: 'churches', singular: 'church',
  labels: {
    title: 'Églises', one: 'Église', empty: 'Aucune église trouvée', confirm: 'Etes-vous sûr de vouloir supprimer cette église ?',
    deleted: 'Eglise supprimée avec succès', saved: 'Eglise enregistrée avec succès', edit: 'Modifier une église',
    removeUrl: (id) => `/api/churches/30/members/${id}`,
  },
})

const associations = structureFlow({
  Index: AssociationsIndex, Form: AssociationForm, model: 'associationsStore', resource: 'associations', singular: 'association',
  labels: {
    title: 'Associations', one: 'Association', empty: 'Aucune association trouvée', confirm: 'Etes-vous sûr de vouloir supprimer cette association ?',
    deleted: 'Association supprimée avec succès', saved: 'Association enregistrée avec succès', edit: 'Modifier une association',
    removeUrl: (id) => `/api/memberships/${id}`,
  },
})

describe('Ancien écran : création d’une structure', () => {
  beforeEach(() => vi.resetAllMocks())

  it('église : formulaire vide puis POST /api/churches', async () => {
    const { wrapper, snackbar } = await churches.mountIndex()
    await click('Ajouter une eglise')
    const form = dialog()
    await fill('Nom', 'Église de Nantes', form)
    axios.post.mockResolvedValue({ data: { status: 200, church: { id: 33, name: 'Église de Nantes' } } })
    await click('Enregistrer', form)
    expect(axios.post).toHaveBeenCalledWith('/api/churches', { church: { name: 'Église de Nantes' } }, { headers: { 'Content-Type': 'multipart/form-data' } })
    expect(snackbar).toHaveBeenCalledWith('Eglise enregistrée avec succès', 'success')
    expect(wrapper.vm.items.map(i => i.id)).toEqual([30, 33])
  })

  it('association : l’ajout est réservé à l’espace admin', async () => {
    const s = adminStore()
    const { wrapper } = await associations.mountIndex(s)
    expect(text(wrapper)).not.toContain('Ajouter une association')
    s.commit('sessionStore/setSubdomain', 'admin')
    await flush()
    await click('Ajouter une association')
    axios.post.mockResolvedValue({ data: { status: 200, association: { id: 44 } } })
    await fill('Nom', 'ADD Jeunesse', dialog())
    await click('Enregistrer', dialog())
    expect(axios.post).toHaveBeenCalledWith('/api/associations', { association: { name: 'ADD Jeunesse' } }, { headers: { 'Content-Type': 'multipart/form-data' } })
  })

  it('association : droit de vote d’un membre (PATCH /api/memberships/:id)', async () => {
    const { wrapper, snackbar } = await associations.mountIndex()
    wrapper.find('[title="Edit"]').trigger('click')
    await flush()
    const form = wrapper.findComponent(AssociationForm)
    axios.patch.mockResolvedValueOnce({ data: {} }).mockRejectedValueOnce(apiError(['Refusé']))
    form.vm.setCanVote({ ...members[1], can_vote: true })
    await flush()
    expect(axios.patch).toHaveBeenCalledWith('/api/memberships/501', { ...members[1], can_vote: true })
    expect(snackbar).toHaveBeenCalledWith('Membre modifié avec succés', 'success')
    form.vm.setCanVote(members[1])
    await flush()
    expect(snackbar).toHaveBeenCalledWith('Refusé', 'error')
  })
})

describe('Cotisations (ancien écran)', () => {
  beforeEach(() => vi.resetAllMocks())

  const fees = [
    { id: 60, what: currentYear, amount: 1200.5, paid_at: `${currentYear}-02-01`, member_type: 'User', member: { lastname: 'Dupont', firstname: 'Jean' } },
    { id: 61, what: currentYear, amount: 300, paid_at: `${currentYear}-03-01`, member_type: 'Structure', member: { name: 'Église de Lyon', zipcode: '69001', town: 'Lyon' } },
    { id: 62, what: '2019', amount: 50, paid_at: '2019-03-01', member_type: 'User', member: { lastname: 'Ancien', firstname: 'Membre' } },
  ]
  const feesReferentiel = {
    users: [{ id: 5, lastname: 'Dupont', firstname: 'Jean' }, { id: 6, lastname: 'Martin', firstname: 'Paul' }],
    structures: [{ id: 30, name: 'Église de Lyon', zipcode: '69001', town: 'Lyon' }, { id: 31, name: 'Œuvre', zipcode: null, town: null }],
  }

  async function mountFees() {
    routeGet(axios, {
      '/api/referentiels/fees': feesReferentiel,
      '/api/fees/60': { fee: fees[0] },
      '/api/fees': { fees },
    })
    const mounted = mountAdmin(FeesIndex)
    await flush()
    return mounted
  }

  it('liste les cotisations de l’année en cours, filtre par année et par nom', async () => {
    const { wrapper } = await mountFees()
    expect(axios.get).toHaveBeenCalledWith('/api/fees', {})
    expect(axios.get).toHaveBeenCalledWith('/api/referentiels/fees', {})
    let rows = wrapper.findAll('tbody tr').map(r => text(r))
    expect(rows).toHaveLength(2)
    expect(rows[0]).toContain('Dupont Jean')
    expect(rows[0]).toMatch(/1\s200,5 €/)
    expect(rows[0]).toContain(`01/02/${currentYear}`)
    expect(rows[1]).toContain('Église de Lyon (69001 Lyon)')

    wrapper.vm.filter.name = 'lyon'
    await flush()
    rows = wrapper.findAll('tbody tr').map(r => text(r))
    expect(rows).toHaveLength(1)
    wrapper.vm.filter.name = '6900'
    await flush()
    expect(wrapper.findAll('tbody tr')).toHaveLength(1)

    wrapper.vm.filter.name = null
    wrapper.vm.filter.what = '2019'
    await flush()
    expect(text(wrapper.find('tbody tr'))).toContain('Ancien Membre')
    expect(wrapper.vm.years[0]).toBeNull()
    expect(wrapper.vm.years).toContain('2017')

    wrapper.vm.filter.what = '2018'
    await flush()
    expect(text(wrapper)).toContain('Aucune cotisation ne correspond à votre recherche')
  })

  it('ajoute une cotisation (POST /api/fees avec fee)', async () => {
    const { wrapper, snackbar, store } = await mountFees()
    await click('Ajouter une cotisation')
    const form = dialog()
    expect(text(form)).toContain('cotisation')
    await fill('Montant', '150', form)
    axios.post.mockResolvedValue({ data: { status: 200, fee: { id: 63 } } })
    await click('Enregistrer', form)
    expect(axios.post).toHaveBeenCalledWith('/api/fees', {
      fee: { what: currentYear, member_id: null, member_type: null, amount: '150', paid_at: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/) },
    })
    expect(snackbar).toHaveBeenCalledWith('Cotisation enregistrée avec succès', 'success')
    expect(store.state.feesStore.dialogForm).toBe(false)
    expect(wrapper.exists()).toBe(true)
  })

  it('erreurs d’enregistrement ; modification (PATCH /api/fees/:id)', async () => {
    const { store, snackbar } = await mountFees()
    store.commit('feesStore/setItem', { ...fees[0] })
    store.commit('feesStore/setDialogForm', true)
    await flush()
    axios.patch.mockRejectedValueOnce(apiError(['Montant invalide'])).mockResolvedValueOnce({ data: { fee: fees[0] } })
    await click('Enregistrer', dialog())
    expect(snackbar).toHaveBeenCalledWith('Montant invalide', 'error')
    await click('Enregistrer', dialog())
    expect(axios.patch).toHaveBeenLastCalledWith('/api/fees/60', { fee: expect.objectContaining({ id: 60 }) })
    expect(snackbar).toHaveBeenCalledWith('Cotisation enregistrée avec succès', 'success')
  })

  it('le crayon ouvre le formulaire de modification', async () => {
    const { wrapper, store } = await mountFees()
    wrapper.find('[title="Edit"]').trigger('click')
    await flush()
    expect(store.state.feesStore.dialogForm).toBe(true)
  })

  it('supprime une cotisation après confirmation', async () => {
    const { wrapper, snackbar } = await mountFees()
    wrapper.find('[title="Delete"]').trigger('click')
    await flush()
    expect(text(dialog())).toContain('Etes-vous sûr de vouloir supprimer cette cotisation ?')
    axios.delete.mockResolvedValue({ data: { status: 200 } })
    await click('Supprimer', dialog())
    expect(axios.delete).toHaveBeenCalledWith('/api/fees/60', {})
    expect(wrapper.vm.items.map(f => f.id)).toEqual([61, 62])
    expect(snackbar).toHaveBeenCalledWith(expect.stringContaining('supprimée'), 'success')
  })

  it('formulaire : recherche du membre parmi les utilisateurs ou les structures', async () => {
    const s = adminStore()
    s.state.feesStore.referentiel = feesReferentiel
    s.commit('feesStore/setItem', { id: 60, what: currentYear, member_type: 'User', member_id: 5, amount: 10, paid_at: '2026-01-01' })
    const { wrapper } = mountAdmin(FeeForm, { store: s })
    await flush()
    expect(wrapper.vm.getIsoDate('2026-01-01T10:00:00')).toBe('2026-01-01')

    wrapper.vm.search = 'ma'
    await flush()
    expect(wrapper.vm.matchingUsers).toEqual([{ value: 5, type: 'User', title: 'Dupont Jean' }])
    wrapper.vm.search = 'mart'
    await flush()
    expect(wrapper.vm.matchingUsers).toEqual([{ value: 6, title: 'Martin Paul' }])

    wrapper.vm.editedItem.member_type = 'Structure'
    wrapper.vm.editedItem.member_id = 30
    wrapper.vm.search = 'ly'
    await flush()
    expect(wrapper.vm.matchingUsers).toEqual([{ value: 30, type: 'Structure', title: 'Église de Lyon (69001 - Lyon)' }])
    wrapper.vm.search = '690'
    await flush()
    expect(wrapper.vm.matchingUsers.map(m => m.value)).toEqual([30])
    wrapper.vm.search = 'œuv'
    await flush()
    expect(wrapper.vm.matchingUsers.map(m => m.value)).toEqual([31])

    wrapper.vm.onUserSelected({ type: 'User' })
    wrapper.vm.onUserSelected(null)
    expect(wrapper.vm.editedItem.member_type).toBe('User')

    s.commit('feesStore/setFormLoading', true)
    await flush()
    expect(wrapper.find('.v-progress-circular').exists()).toBe(true)
  })
})
