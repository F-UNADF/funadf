import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import UsersIndex from '@/components/Users/Index.vue'
import UserForm from '@/components/Users/Form.vue'
import UserDisplay from '@/components/Users/Display.vue'
import { mountAdmin, adminStore, flush, click, fill, apiError, text, dialog, routeGet } from './support.js'

vi.mock('axios')

const referentiels = {
  levels: ['Pasteur APE', 'Pasteur titulaire'],
  roles: ['admin', 'moderator'],
  churches: [{ id: 30, name: 'Église de Lyon(Lyon)' }],
  associations: [{ id: 40, name: 'ADD Jeunesse' }],
  functions: ['Pasteur principal'],
  responsabilities: ['Président'],
  whatFees: ['2025', '2026'],
}

const users = [
  { id: 5, lastname: 'Dupont', firstname: 'Jean', email: 'jean@add.fr', zipcode: '69001', town: 'Lyon', current_level: 'Pasteur APE', disabled: false, roles: 'admin', invitation_accepted_at: '2024-01-01' },
  { id: 6, lastname: 'Martin', firstname: 'Paul', email: 'paul@add.fr', zipcode: '75011', town: 'Paris', current_level: null, disabled: false, roles: null, invitation_accepted_at: null },
  { id: 7, lastname: 'Durand', firstname: 'Marie', email: 'marie@add.fr', zipcode: '13001', town: 'Marseille', current_level: 'Pasteur titulaire', disabled: true, roles: 'moderator', invitation_accepted_at: '2024-01-01' },
]

// GET /api/users/:id (Api::UsersController#show)
const userShow = (overrides = {}) => ({
  user: { id: 5, lastname: 'Dupont', firstname: 'Jean', email: 'jean@add.fr', zipcode: '69001', town: 'Lyon', disabled: false, invitation_accepted_at: '2024-01-01', ...overrides },
  gratitudes: [{ id: 50, level: 'Pasteur APE', start_at: '2020-09-01' }],
  fees: [{ id: 60, what: '2025', paid_at: '2025-02-01', amount: 120 }],
  interns: [],
  phases: [{ id: 70, church_id: 30, function: 'Pasteur principal', start_at: '2019-01-01', end_at: null }],
  responsabilities: [{ id: 80, association_id: 40, function: 'Président', start_at: '2021-01-01', end_at: null }],
  roles: ['admin'],
})

function adminSession(s, currentUser = { id: 1, lastname: 'Admin' }) {
  s.commit('sessionStore/setCurrentUser', currentUser)
  s.commit('sessionStore/setRoles', ['admin'])
  return s
}

async function mountIndex(list = users, show = userShow()) {
  routeGet(axios, { '/api/users/': show, '/api/users': { users: list }, '/api/referentiels/users': referentiels })
  const mounted = mountAdmin(UsersIndex, { props: { domain: 'admin' }, store: adminSession(adminStore()) })
  await flush()
  return mounted
}

const rows = (wrapper) => wrapper.findAll('tbody tr').map(r => text(r))

describe('Utilisateurs : liste', () => {
  beforeEach(() => vi.resetAllMocks())

  it('charge les utilisateurs de l’espace admin et les référentiels', async () => {
    const { wrapper } = await mountIndex()
    expect(axios.get).toHaveBeenCalledWith('/api/users', { params: { domain: 'admin' } })
    expect(axios.get).toHaveBeenCalledWith('/api/referentiels/users', {})
    // par défaut, seuls les comptes actifs
    expect(rows(wrapper)).toHaveLength(2)
    expect(text(wrapper)).toContain('Dupont Jean')
    expect(text(wrapper)).toContain('jean@add.fr')
    expect(text(wrapper)).toContain('69001 Lyon')
    expect(text(wrapper)).not.toContain('Durand')
  })

  it('signale les invitations en attente et les niveaux non renseignés', async () => {
    const { wrapper } = await mountIndex()
    const [dupont, martin] = wrapper.findAll('tbody tr')
    expect(text(dupont)).toContain('Pasteur APE')
    expect(text(dupont)).not.toContain('Invitation en attente')
    expect(text(martin)).toContain('Invitation en attente')
    expect(text(martin)).toContain('Non renseigné')
  })

  it('filtre les comptes inactifs', async () => {
    const { wrapper } = await mountIndex()
    await click('Inactif')
    expect(wrapper.vm.filter.disabled).toBe(true)
    expect(rows(wrapper)).toHaveLength(1)
    expect(text(wrapper)).toContain('Durand Marie')
  })

  it('filtre par reconnaissance et par rôle global', async () => {
    const { wrapper } = await mountIndex()
    wrapper.vm.filter.levels = ['Pasteur APE']
    await flush()
    expect(rows(wrapper).map(r => r.includes('Dupont'))).toEqual([true])

    wrapper.vm.filter.levels = []
    wrapper.vm.filter.roles = ['moderator']
    await flush()
    expect(text(wrapper)).toContain('Aucun utilisateur ne correspond à ces critères')

    wrapper.vm.filter.roles = ['admin']
    await flush()
    expect(rows(wrapper)).toHaveLength(1)
    expect(text(wrapper)).toContain('Dupont')
  })

  it('cherche par nom, prénom, ville ou code postal', async () => {
    const { wrapper } = await mountIndex()
    const search = wrapper.find('input')
    await search.setValue('paris')
    expect(rows(wrapper)).toHaveLength(1)
    expect(text(wrapper)).toContain('Martin')
    await search.setValue('6900')
    expect(text(wrapper)).toContain('Dupont')
    await search.setValue('JEAN')
    expect(text(wrapper)).toContain('Dupont')
    await search.setValue('inconnu')
    expect(text(wrapper)).toContain('Aucun utilisateur ne correspond à ces critères')
  })

  it('pendant le chargement, le tableau est marqué en chargement', async () => {
    const { wrapper, store } = await mountIndex([])
    store.commit('usersStore/setLoading', true)
    await flush()
    expect(wrapper.findComponent({ name: 'VDataTable' }).props('loading')).toBe(true)
  })

  it('Actualiser recharge la liste', async () => {
    await mountIndex()
    axios.get.mockClear()
    await click('Actualiser la liste')
    expect(axios.get).toHaveBeenCalledWith('/api/users', { params: { domain: 'admin' } })
  })

  it('se connecte en tant qu’un utilisateur', async () => {
    const { snackbar } = await mountIndex()
    axios.get.mockResolvedValueOnce({ data: { current_user: { id: 6 }, original_user: { id: 1 }, redirect_to: '/feed' } })
    await click('Se connecter en tant que Paul Martin')
    expect(axios.get).toHaveBeenCalledWith('/api/switch/6')
    expect(snackbar).toHaveBeenCalledWith('Vous êtes maintenant connecté en tant que Martin', 'success')
  })
})

describe('Utilisateurs : création', () => {
  beforeEach(() => vi.resetAllMocks())

  it('ajoute un utilisateur : formulaire vide puis POST /api/users (multipart)', async () => {
    const { wrapper, snackbar, store } = await mountIndex()
    await click('Ajouter un utilisateur')
    const form = dialog()
    expect(text(form)).toContain('Ajouter un utilisateur')

    await fill('Prénom', 'Luc', form)
    await fill('Nom', 'Bernard', form)
    await fill('Email', 'luc@add.fr', form)
    await fill('Ville', 'Nantes', form)

    axios.post.mockResolvedValue({ data: { user: { id: 8, lastname: 'Bernard' } } })
    await click('Enregistrer', form)

    expect(axios.post).toHaveBeenCalledWith('/api/users', {
      user: expect.objectContaining({
        user: expect.objectContaining({ id: null, firstname: 'Luc', lastname: 'Bernard', email: 'luc@add.fr', town: 'Nantes', disabled: false }),
        gratitudes: [], fees: [], phases: [],
      }),
    }, { headers: { 'Content-Type': 'multipart/form-data' } })
    expect(snackbar).toHaveBeenCalledWith('Utilisateur enregistré avec succès', 'success')
    expect(store.state.usersStore.dialogForm).toBe(false)
    expect(store.state.usersStore.item).toBeNull()
    expect(wrapper.emitted()).toBeDefined()
  })

  it('un nouvel utilisateur peut recevoir rôles et responsabilités sans erreur', async () => {
    const { store } = await mountIndex()
    await click('Ajouter un utilisateur')
    await click('Responsabilités nationales', dialog())
    const form = dialog()
    const plus = [...form.querySelectorAll('.v-window-item--active button')].find(b => b.textContent === '' && b.querySelector('.mdi-plus'))
    plus.click()
    await flush()
    expect(form.querySelectorAll('.v-window-item--active .v-autocomplete')).toHaveLength(1)

    await click('Rôles globaux', form)
    expect(text(form)).toContain('Promouvoir administrateur')
    expect(store.state.usersStore.item.user.id).toBeNull()
  })

  it('affiche les erreurs renvoyées par Rails', async () => {
    const { snackbar } = await mountIndex()
    await click('Ajouter un utilisateur')
    axios.post.mockRejectedValue(apiError(['Email a déjà été pris']))
    await click('Enregistrer', dialog())
    expect(snackbar).toHaveBeenCalledWith('Un probleme est survenu lors de l\'enregistrement de l\'utilisateur', 'error')
    expect(snackbar).toHaveBeenCalledWith('Email a déjà été pris', 'error')
  })
})

describe('Utilisateurs : modification', () => {
  beforeEach(() => vi.resetAllMocks())

  async function openEdit(show) {
    const mounted = await mountIndex(users, show)
    await click('Modifier Jean Dupont')
    await flush()
    return mounted
  }

  it('ouvre la fiche (GET /api/users/:id) et enregistre par PATCH', async () => {
    const { snackbar } = await openEdit()
    expect(axios.get).toHaveBeenCalledWith('/api/users/5', {})
    const form = dialog()
    expect(text(form)).toContain('Modifier Jean Dupont')
    expect(text(form)).not.toContain('Renvoyer l\'invitation')

    await fill('Téléphone', '0601020304', form)
    axios.patch.mockResolvedValue({ data: { status: 'success', user: { id: 5, lastname: 'Dupont', phone_1: '0601020304' } } })
    await click('Enregistrer', form)

    expect(axios.patch).toHaveBeenCalledWith('/api/users/5', {
      user: expect.objectContaining({
        user: expect.objectContaining({ id: 5, phone_1: '0601020304', password: null, password_confirmation: null }),
        gratitudes: [{ id: 50, level: 'Pasteur APE', start_at: '2020-09-01' }],
        phases: [expect.objectContaining({ id: 70, church_id: 30 })],
        responsabilities: [expect.objectContaining({ id: 80, association_id: 40 })],
      }),
    }, { headers: { 'Content-Type': 'multipart/form-data' } })
    expect(snackbar).toHaveBeenCalledWith('Utilisateur enregistré avec succès', 'success')
  })

  it('gère reconnaissances, parcours, responsabilités et cotisations', async () => {
    const { wrapper } = await openEdit()
    const form = wrapper.findComponent(UserForm)

    form.vm.addGratitude()
    form.vm.removeGratitude(null)
    form.vm.removeGratitude(50)
    expect(form.vm.editedItem.gratitudes).toEqual([])

    form.vm.addPhase()
    expect(form.vm.editedItem.phases).toHaveLength(2)
    form.vm.removePhase(null)
    form.vm.removePhase(70)
    expect(form.vm.editedItem.phases).toEqual([])

    form.vm.addResponsabilite()
    form.vm.removeResponsabilite(null)
    form.vm.removeResponsabilite(80)
    expect(form.vm.editedItem.responsabilities).toEqual([])

    form.vm.addFee()
    expect(form.vm.editedItem.fees).toEqual([{ id: 60, what: '2025', paid_at: '2025-02-01', amount: 120 }, { what: null, paid_at: null, amount: null }])

    // chaque onglet s'affiche
    for (const tab of ['Reconnaissances', 'Parcours', 'Responsabilités nationales', 'Cotisations', 'Sécurité']) {
      await click(tab, dialog())
    }
    expect(text(dialog())).toContain('Pour modifier le mot de passe')
    await click('Reconnaissances', dialog())
    const removeButtons = dialog().querySelectorAll('.v-window-item--active .mdi-delete')
    expect(removeButtons).toHaveLength(0)
    await click('Parcours', dialog())
  })

  it('renvoie l’invitation d’un utilisateur qui ne l’a pas acceptée', async () => {
    const { snackbar } = await openEdit(userShow({ invitation_accepted_at: null }))
    axios.post.mockResolvedValue({ data: { status: 'success' } })
    await click('Renvoyer l\'invitation par e-mail', dialog())
    expect(axios.post).toHaveBeenCalledWith('/api/users/5/send_invitation', expect.objectContaining({ id: 5, email: 'jean@add.fr' }))
    expect(snackbar).toHaveBeenCalledWith('Invitation envoyée', 'success')
  })

  it('promeut puis destitue un administrateur ou un modérateur', async () => {
    const { snackbar } = await openEdit()
    await click('Rôles globaux', dialog())
    expect(text(dialog())).toContain('Destituer administrateur')

    axios.patch.mockResolvedValue({ data: { status: 'success', user: { id: 5 } } })
    await click('Promouvoir modérateur', dialog())
    expect(axios.patch).toHaveBeenCalledWith('/api/users/5/add_role', { id: 5, role: 'moderator' })
    expect(snackbar).toHaveBeenCalledWith('Utilisateur promu', 'success')
    expect(text(dialog())).toContain('Destituer modérateur')

    await click('Destituer administrateur', dialog())
    expect(axios.patch).toHaveBeenCalledWith('/api/users/5/remove_role', { id: 5, role: 'admin' })
    expect(snackbar).toHaveBeenCalledWith('Utilisateur destitué', 'success')
    expect(text(dialog())).toContain('Promouvoir administrateur')
  })

  it('affiche les erreurs de promotion / destitution', async () => {
    const { snackbar } = await openEdit()
    await click('Rôles globaux', dialog())
    axios.patch.mockRejectedValue(apiError(['Accès refusé']))
    await click('Promouvoir modérateur', dialog())
    await click('Destituer administrateur', dialog())
    expect(snackbar).toHaveBeenCalledWith('Un probleme est survenu', 'error')
    expect(snackbar).toHaveBeenCalledWith('Accès refusé', 'error')
    expect(snackbar).toHaveBeenCalledTimes(4)
  })

  it('désactive puis réactive le compte', async () => {
    const { snackbar } = await openEdit()
    await click('Actions sensibles', dialog())
    axios.patch.mockResolvedValue({ data: { status: 'success', user: { id: 5, disabled: true } } })
    await click('Désactiver l\'utilisateur', dialog())
    expect(axios.patch).toHaveBeenCalledWith('/api/users/5/disable', {})
    expect(snackbar).toHaveBeenCalledWith('Utilisateur désactivé avec succès', 'success')

    await click('Réactiver l\'utilisateur', dialog())
    expect(axios.patch).toHaveBeenCalledWith('/api/users/5/enable', {})
    expect(snackbar).toHaveBeenCalledWith('Utilisateur activé avec succès', 'success')
  })

  it('supprime le compte après confirmation', async () => {
    const { snackbar, store } = await openEdit()
    await click('Actions sensibles', dialog())
    await click('Supprimer l\'utilisateur', dialog())
    expect(text(dialog())).toContain('Supprimer l’utilisateur ?')
    expect(text(dialog())).toContain('Jean Dupont')

    await click('Annuler', dialog())
    expect(axios.delete).not.toHaveBeenCalled()

    await click('Supprimer l\'utilisateur', dialog())
    axios.delete.mockResolvedValue({ data: { status: 'success' } })
    await click('Supprimer', dialog())
    expect(axios.delete).toHaveBeenCalledWith('/api/users/5', {})
    expect(snackbar).toHaveBeenCalledWith('Utilisateur supprimé avec succès', 'success')
    expect(store.state.usersStore.items.map(u => u.id)).toEqual([6, 7])
    expect(store.state.usersStore.dialogForm).toBe(false)
  })

  it('Fermer ferme la fiche et recharge la liste', async () => {
    const { store } = await openEdit()
    axios.get.mockClear()
    await click('Fermer', dialog())
    expect(store.state.usersStore.dialogForm).toBe(false)
    expect(axios.get).toHaveBeenCalledWith('/api/users', { params: { domain: 'admin' } })
  })
})

describe('Utilisateurs : formulaire (profil personnel et avatar)', () => {
  beforeEach(() => vi.resetAllMocks())

  function mountForm({ item = userShow(), currentUser = { id: 1 }, roles = ['admin'] } = {}) {
    routeGet(axios, { '/api/referentiels/users': referentiels, '/api/current_user': { user: currentUser, roles } })
    const s = adminStore()
    s.commit('sessionStore/setCurrentUser', currentUser)
    s.commit('sessionStore/setRoles', roles)
    s.commit('usersStore/setItem', item)
    return mountAdmin(UserForm, { store: s })
  }

  it('affiche un squelette pendant le chargement', async () => {
    const { wrapper, store } = mountForm()
    store.commit('usersStore/setFormLoading', true)
    await flush()
    expect(wrapper.find('.v-skeleton-loader').exists()).toBe(true)
  })

  it('un membre qui modifie son profil ne voit pas les onglets réservés et recharge sa session', async () => {
    const { wrapper, snackbar } = mountForm({ currentUser: { id: 5 }, roles: [] })
    await flush()
    expect(text(wrapper)).toContain('Modifier mon profil')
    expect(text(wrapper)).not.toContain('Reconnaissances')
    expect(text(wrapper)).not.toContain('Actions sensibles')

    axios.patch.mockResolvedValue({ data: { status: 'success', user: { id: 5 } } })
    await click('Enregistrer')
    expect(snackbar).toHaveBeenCalledWith('Profil enregistré avec succès', 'success')
    expect(axios.get).toHaveBeenCalledWith('/api/current_user')
  })

  it('choix de l’avatar : un seul fichier image', async () => {
    const { wrapper, snackbar } = mountForm()
    await flush()
    const input = wrapper.find('input[type="file"]')
    const choose = async (files) => {
      Object.defineProperty(input.element, 'files', { value: files, configurable: true })
      await input.trigger('change')
    }
    await choose([])
    expect(snackbar).toHaveBeenCalledWith('Aucun fichier sélectionné', 'warning')
    await choose([new File(['a'], 'a.png'), new File(['b'], 'b.png')])
    expect(snackbar).toHaveBeenCalledWith('Vous devez sélectionner un seul fichier', 'warning')
    const avatar = new File(['a'], 'moi.png', { type: 'image/png' })
    await choose([avatar])
    expect(wrapper.vm.editedItem.user.avatar).toBe(avatar)
  })

  it('titre sans nom ni prénom', async () => {
    const { wrapper } = mountForm({ item: { ...userShow(), user: { id: 9 } } })
    await flush()
    expect(wrapper.vm.getTitle).toBe('Modifier')
  })
})

describe('Affichage d’un utilisateur', () => {
  it('affiche avatar, nom, prénom et email', () => {
    const { wrapper } = mountAdmin(UserDisplay, { props: { user: { id: 5, lastname: 'Dupont', firstname: 'Jean', email: 'jean@add.fr' } } })
    expect(text(wrapper)).toContain('Dupont Jean')
    expect(text(wrapper)).toContain('jean@add.fr')
    expect(wrapper.find('img, .v-img').exists()).toBe(true)
  })
})
