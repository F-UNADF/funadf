import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import ChurchesPage from '@/pages/Churches/Index.vue'
import AssociationsPage from '@/pages/Associations/Index.vue'
import RegionsPage from '@/pages/Regions/Index.vue'
import { mountAdmin, flush, click, fill, apiError, text, dialog, routeGet } from './support.js'

vi.mock('axios')

// Paramètres des appels à la liste GET /api/:model (sans les paramètres vides)
const listQueries = (model) => axios.get.mock.calls
  .map(([url]) => url)
  .filter(url => url === `/api/${model}` || url.startsWith(`/api/${model}?`))
  .map(url => Object.fromEntries([...new URLSearchParams(url.split('?')[1] || '')].filter(([, v]) => v !== '' && v !== 'null')))

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Configuration servie par /api/:model/config (UiConfig::StructuresConfig)
const structuresConfig = (type) => ({
  toolbarActions: [{ name: 'add', title: `${type}.add`, icon: 'mdi-plus', action: 'add' }],
  itemActions: [
    { name: 'edit', title: `${type}.edit`, icon: 'mdi-pencil', action: 'edit' },
    { name: 'delete', title: `${type}.delete`, icon: 'mdi-delete', action: 'delete' },
  ],
  form: {
    fullscreen: true,
    defaultItem: { id: null, name: null, address_1: null, address_2: null, zipcode: null, town: null, phone_1: null, email: null, website: null },
    tabs: [
      {
        title: 'Information générale', name: 'infos', fields: [
          { name: 'name', type: 'text', label: 'Nom', rules: ['required'] },
          { name: 'zipcode', type: 'text', label: 'Code postal', rules: ['required'], grid: 6 },
          { name: 'town', type: 'text', label: 'Ville', rules: ['required'], grid: 6 },
          { name: 'email', type: 'text', label: 'Email' },
        ],
      },
      { title: 'Membres', name: 'members', if: ['id', '!=', 'null'], fields: [{ name: 'members', type: 'members', label: 'Membres' }] },
    ],
  },
})

const structures = [
  { id: 30, name: 'Église de Lyon', zipcode: '69001', town: 'Lyon', president: { id: 5, lastname: 'Dupont', firstname: 'Jean', email: 'jean@add.fr' } },
  { id: 31, name: 'Église de Brest', zipcode: '29200', town: null, president: { id: 6, lastname: 'Martin', firstname: 'Paul', email: 'paul@add.fr' } },
]

// Membres renvoyés par GET /api/churches/:id (members_with_details)
const members = [
  { membership_id: 500, member_id: 5, member_type: 'User', name: 'Dupont Jean', town: 'Lyon', zipcode: '69001', role_name: 'president', role_friendly_name: 'Président', can_vote: true },
  { membership_id: 501, member_id: 40, member_type: 'Structure', name: 'Œuvre sociale', town: null, zipcode: null, role_name: 'member', role_friendly_name: null, can_vote: false },
]

const referentiels = {
  roles: [{ name: 'president', friendly_name: 'Président' }, { name: 'secretary', friendly_name: 'Secrétaire' }, { name: 'member', friendly_name: null }],
  members: [
    { member_id: 7, member_type: 'User', name: 'Durand Marie' },
    { member_id: 41, member_type: 'Structure', name: 'Église de Durance (Manosque)' },
    { member_id: 8, member_type: 'User', name: 'Bernard Luc' },
  ],
}

const singular = { churches: 'church', associations: 'association', regions: 'region' }

async function mountPage(page, model, { list = structures, domain } = {}) {
  routeGet(axios, {
    [`/api/${model}/config`]: { config: structuresConfig(model) },
    [`/api/referentiels/${model}`]: referentiels,
    [`/api/${model}/30`]: { [singular[model]]: { ...structures[0], id: 30, address_1: null }, members },
    [`/api/${model}`]: { [model]: list },
  })
  const mounted = mountAdmin(page, { props: domain ? { domain } : {} })
  await flush()
  await flush()
  return mounted
}

async function openRowMenu(wrapper, name) {
  await click(`Actions pour ${name}`, wrapper.element)
}

async function openEdit(wrapper) {
  await openRowMenu(wrapper, 'Église de Lyon')
  await click('Modifier l\'église')
  await flush()
}

describe('Églises (admin) : liste', () => {
  beforeEach(() => vi.resetAllMocks())

  it('charge la liste, la configuration du formulaire et les référentiels', async () => {
    const { wrapper } = await mountPage(ChurchesPage, 'churches')
    expect(listQueries('churches')).toEqual([{}])
    expect(axios.get).toHaveBeenCalledWith('/api/churches/config')
    expect(axios.get).toHaveBeenCalledWith('/api/referentiels/churches', {})

    const rows = wrapper.findAll('tbody tr')
    expect(rows).toHaveLength(2)
    expect(text(rows[0])).toContain('Église de Lyon')
    expect(text(rows[0])).toContain('Dupont Jean')
    expect(text(rows[0])).toContain('Lyon (69001)')
    expect(text(rows[1])).not.toContain('(29200)') // ville inconnue : pas de localisation
    expect(text(wrapper)).toContain('Ajouter une église')
  })

  it('la recherche interroge l’API après une courte pause', async () => {
    const { wrapper } = await mountPage(ChurchesPage, 'churches')
    axios.get.mockClear()
    await wrapper.find('.fu-database__search input').setValue('lyo')
    await wait(550)
    expect(listQueries('churches')).toEqual([{ search: 'lyo' }])
  })

  it('sans église : message dédié et bouton d’ajout', async () => {
    const { wrapper } = await mountPage(ChurchesPage, 'churches', { list: [] })
    expect(text(wrapper)).toContain('Aucune église trouvée')
    await click('Ajouter une église', wrapper.find('.fu-database__empty').element)
    expect(text(dialog())).toContain('Ajouter une église')
  })
})

describe('Églises (admin) : création, modification, suppression', () => {
  beforeEach(() => vi.resetAllMocks())

  it('crée une église : champs obligatoires puis POST /api/churches (multipart)', async () => {
    const { wrapper, snackbar } = await mountPage(ChurchesPage, 'churches')
    await click('Ajouter une église', wrapper.find('.fu-database__toolbar').element)
    const form = dialog()
    expect(text(form)).not.toContain('Membres') // onglet réservé aux églises enregistrées

    await click('Enregistrer', form)
    expect(snackbar).toHaveBeenCalledWith(expect.any(String), 'error')
    expect(axios.post).not.toHaveBeenCalled()

    await fill('Nom', 'Église de Nantes', form)
    await fill('Code postal', '44000', form)
    await fill('Ville', 'Nantes', form)
    axios.post.mockResolvedValue({ data: { status: 200, church: { id: 32, name: 'Église de Nantes' } } })
    await click('Enregistrer', form)
    await flush()

    const [url, body, options] = axios.post.mock.calls[0]
    expect(url).toBe('/api/churches')
    expect(body.get('church[name]')).toBe('Église de Nantes')
    expect(body.get('church[zipcode]')).toBe('44000')
    expect(body.get('church[town]')).toBe('Nantes')
    expect(options).toEqual({ headers: { 'Content-Type': 'multipart/form-data' } })
    expect(snackbar).toHaveBeenCalledWith('Eglise enregistrée', 'success')
  })

  it('modifie une église : fiche chargée puis PATCH /api/churches/:id', async () => {
    const { wrapper, snackbar } = await mountPage(ChurchesPage, 'churches')
    await openEdit(wrapper)
    expect(axios.get).toHaveBeenCalledWith('/api/churches/30')
    const form = dialog()
    expect(text(form)).toContain('Modifier l\'église')
    expect(form.querySelector('input').value).toBe('Église de Lyon')

    await fill('Nom', 'Église évangélique de Lyon', form)
    axios.patch.mockResolvedValue({ data: { status: 200, church: { id: 30 } } })
    await click('Enregistrer', form)
    await flush()
    expect(axios.patch.mock.calls[0][0]).toBe('/api/churches/30')
    expect(axios.patch.mock.calls[0][1].get('church[name]')).toBe('Église évangélique de Lyon')
    expect(snackbar).toHaveBeenCalledWith('Eglise enregistrée', 'success')
  })

  it('affiche les erreurs de validation renvoyées par l’API', async () => {
    const { wrapper, snackbar } = await mountPage(ChurchesPage, 'churches')
    await openEdit(wrapper)
    axios.patch.mockRejectedValue(apiError(['Nom a déjà été pris']))
    await click('Enregistrer', dialog())
    await flush()
    expect(snackbar).toHaveBeenCalledWith('Nom a déjà été pris', 'error')
  })

  it('supprime une église après confirmation', async () => {
    const { wrapper, snackbar } = await mountPage(ChurchesPage, 'churches')
    await openRowMenu(wrapper, 'Église de Brest')
    await click('Supprimer l\'église')
    expect(text(dialog())).toContain('Église de Brest')
    expect(text(dialog())).toContain('Êtes-vous sûr de vouloir supprimer cette église ?')

    axios.delete.mockResolvedValue({ data: { status: 200 } })
    await click('Supprimer', dialog())
    await flush()
    expect(axios.delete).toHaveBeenCalledWith('/api/churches/31', {})
    expect(snackbar).toHaveBeenCalledWith('Église supprimée', 'success')
  })

  it('un échec de suppression est signalé', async () => {
    const { wrapper, snackbar } = await mountPage(ChurchesPage, 'churches')
    await openRowMenu(wrapper, 'Église de Brest')
    await click('Supprimer l\'église')
    axios.delete.mockRejectedValue(apiError([], 500))
    await click('Supprimer', dialog())
    await flush()
    expect(snackbar).toHaveBeenCalledWith(expect.any(String), 'error')
  })
})

describe('Églises (admin) : membres et rôles', () => {
  beforeEach(() => vi.resetAllMocks())

  async function openMembers() {
    const mounted = await mountPage(ChurchesPage, 'churches')
    await openEdit(mounted.wrapper)
    await click('Membres', dialog())
    return mounted
  }

  it('liste les membres avec leur rôle et leur droit de vote', async () => {
    await openMembers()
    const rows = [...dialog().querySelectorAll('.v-window-item--active tbody tr')].map(r => text(r))
    expect(rows[0]).toContain('Dupont Jean')
    expect(rows[0]).toContain('Lyon (69001)')
    expect(rows[0]).toContain('Président')
    expect(rows[1]).toContain('Œuvre sociale')
    expect(rows[1]).toContain('member')
  })

  it('change le rôle d’un membre (POST /api/churches/:id/roles/edit)', async () => {
    const { snackbar } = await openMembers()
    await click('Président', dialog())
    axios.post.mockResolvedValue({ data: { status: 200, members } })
    await click('Secrétaire')
    expect(axios.post).toHaveBeenCalledWith('/api/churches/30/roles/edit', { member: members[0], role: 'secretary' })
    expect(snackbar).toHaveBeenCalledWith('Role modifié avec succés', 'success')
  })

  it('ajoute des membres trouvés par leur nom (POST /api/churches/:id/members)', async () => {
    const { wrapper, snackbar } = await openMembers()
    const auto = wrapper.findComponent({ name: 'VAutocomplete' })
    auto.vm.$emit('update:search', 'dur')
    await flush()
    const input = wrapper.findComponent({ name: 'FuMembersInput' })
    expect(input.vm.matchMembers.map(m => m.name)).toEqual(['Durand Marie', 'Église de Durance (Manosque)'])
    auto.vm.$emit('update:modelValue', input.vm.matchMembers)
    await flush()

    axios.post.mockResolvedValue({ data: { status: 200, members } })
    await click('Ajouter les membres', dialog())
    expect(axios.post).toHaveBeenCalledWith('/api/churches/30/members', {
      members: [
        expect.objectContaining({ id: 7, type: 'User', name: 'Durand Marie' }),
        expect.objectContaining({ id: 41, type: 'Structure' }),
      ],
    })
    expect(snackbar).toHaveBeenCalledWith('Membres ajoutés avec succés', 'success')
  })

  it('retire un membre (DELETE /api/memberships/:id)', async () => {
    const { snackbar } = await openMembers()
    axios.delete.mockResolvedValue({ data: { status: 200, members: [members[1]] } })
    dialog().querySelector('.v-window-item--active tbody tr .mdi-delete').click()
    await flush()
    expect(axios.delete).toHaveBeenCalledWith('/api/memberships/500', {})
    expect(snackbar).toHaveBeenCalledWith('Membre supprimé avec succés', 'success')
  })

  it('accorde ou retire le droit de vote', async () => {
    const { snackbar } = await openMembers()
    axios.post.mockResolvedValue({ data: { membership: { id: 501, can_vote: true } } })
    dialog().querySelectorAll('.v-window-item--active input[type="checkbox"]')[1].click()
    await flush()
    expect(axios.post).toHaveBeenCalledWith('/api/memberships/501/toggleCanVote')
    expect(snackbar).toHaveBeenCalledWith('Membre mis à jour avec succés', 'success')
  })
})

describe('Associations et régions (admin)', () => {
  beforeEach(() => vi.resetAllMocks())

  it('associations : la liste est bornée à l’espace (domain) et propose l’ajout', async () => {
    const { wrapper } = await mountPage(AssociationsPage, 'associations', {
      domain: 'association', list: [{ id: 40, name: 'ADD Jeunesse', zipcode: '75011', town: 'Paris', president: { id: 6, lastname: 'Martin', firstname: 'Paul' } }],
    })
    expect(listQueries('associations')).toEqual([{ domain: 'association' }])
    expect(text(wrapper)).toContain('ADD Jeunesse')
    expect(text(wrapper)).toContain('Martin Paul')
    expect(text(wrapper)).toContain('Paris (75011)')
    expect(text(wrapper)).toContain('Ajouter une association')
  })

  it('associations : espace « me » par défaut et suppression confirmée', async () => {
    const { wrapper, snackbar } = await mountPage(AssociationsPage, 'associations', {
      list: [{ id: 40, name: 'ADD Jeunesse', zipcode: '75011', town: 'Paris', president: { id: 6, lastname: 'Martin', firstname: 'Paul' } }],
    })
    expect(listQueries('associations')).toEqual([{ domain: 'me' }])
    await openRowMenu(wrapper, 'ADD Jeunesse')
    await click('Supprimer l\'association')
    axios.delete.mockResolvedValue({ data: { status: 200 } })
    await click('Supprimer', dialog())
    await flush()
    expect(axios.delete).toHaveBeenCalledWith('/api/associations/40', {})
    expect(snackbar).toHaveBeenCalledWith('Association supprimée', 'success')
  })

  it('régions : liste et état vide', async () => {
    const { wrapper } = await mountPage(RegionsPage, 'regions', { list: [] })
    expect(listQueries('regions')).toEqual([{}])
    expect(axios.get).toHaveBeenCalledWith('/api/regions/config')
    expect(text(wrapper)).toContain('Aucune région trouvée')
    expect(text(wrapper)).toContain('Ajouter une région')
  })
})
