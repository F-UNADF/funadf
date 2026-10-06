import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axios from 'axios'
import FuDatabase from '@/components/Database/FuDatabase.vue'
import { store, flush } from '../../helpers.js'
import { globalOptions, squash, bodyText } from '../support.js'

vi.mock('axios')
vi.mock('vue3-editor', () => ({ VueEditor: { name: 'VueEditor', template: '<div />' } }))

const stubs = { FuMembersInput: { template: '<div class="members-stub" />' } }

// Réponse de GET /api/regions (as_json(include: ['president']))
const regions = () => [
  { id: 1, name: 'Sud-Est', town: 'Lyon', zipcode: '69000', president: { id: 7, firstname: 'Jean', lastname: 'DUPONT', email: 'jean@add.fr' } },
  { id: 2, name: 'Nord', town: null, zipcode: '59000', president: null },
]

// Réponse de GET /api/regions/config (UiConfig::StructuresConfig, réduite)
const config = () => ({
  toolbarActions: [{ name: 'add', title: 'regions.add', icon: 'mdi-plus', action: 'add' }],
  itemActions: [
    { name: 'edit', title: 'regions.edit', icon: 'mdi-pencil', action: 'edit' },
    { name: 'delete', title: 'regions.delete', icon: 'mdi-delete', action: 'delete' },
  ],
  form: {
    fullscreen: true,
    defaultItem: { id: null, name: null },
    tabs: [{ title: 'Information générale', name: 'infos', fields: [{ name: 'name', type: 'text', label: 'Nom', rules: ['required'] }] }],
  },
})

const headers = [
  { title: 'ID', value: 'id' },
  { title: 'Nom', value: 'name' },
  { title: 'Président', value: 'president', type: 'user' },
  { title: 'Ville', value: 'zipcode', type: 'localisation' },
  { title: 'Actions', value: 'actions', sortable: false },
]

function api({ items = regions(), cfg = config() } = {}) {
  axios.get.mockImplementation((url) => {
    if (url === '/api/regions/config') return Promise.resolve({ data: { config: cfg } })
    if (url === '/api/referentiels/regions') return Promise.resolve({ data: { roles: [], members: [] } })
    if (/^\/api\/regions\/\d+$/.test(url)) return Promise.resolve({ data: { region: items.find(i => '/api/regions/' + i.id === url), members: [] } })
    return Promise.resolve({ data: { regions: items } })
  })
}

async function mountDatabase(props = {}) {
  const s = store()
  const wrapper = mount(FuDatabase, {
    attachTo: document.body,
    props: { model: 'regions', headers, ...props },
    global: globalOptions(s, { stubs }),
  })
  wrapper.vm.$root.showSnackbar = vi.fn()
  await flush()
  await flush()
  return { wrapper, s }
}

const rows = (wrapper) => wrapper.findAll('tbody tr').map(r => r.findAll('td').map(td => squash(td.text())))
const listCalls = () => axios.get.mock.calls.map(c => c[0]).filter(u => u.startsWith('/api/regions') && !u.includes('config') && !/\/\d+$/.test(u))

async function rowAction(wrapper, rowIndex, label) {
  await wrapper.findAll('tbody tr')[rowIndex].find('button').trigger('click')
  await flush()
  const item = Array.from(document.querySelectorAll('.v-overlay--active .v-list-item')).find(i => squash(i.textContent) === label)
  item.click()
  await flush()
  await flush()
}

describe('FuDatabase : tableau générique des écrans d’admin', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.spyOn(console, 'log').mockImplementation(() => {})
    api()
  })
  afterEach(() => { document.body.innerHTML = '' })

  it('au montage : charge la liste, la config et les référentiels', async () => {
    await mountDatabase({ domain: 'admin' })
    const urls = axios.get.mock.calls.map(c => c[0])
    expect(urls).toEqual(expect.arrayContaining(['/api/regions?domain=admin', '/api/regions/config', '/api/referentiels/regions']))
  })

  it('affiche une ligne par élément selon le type de colonne', async () => {
    const { wrapper } = await mountDatabase()
    const r = rows(wrapper)
    expect(r[0]).toEqual(['1', 'Sud-Est', expect.stringContaining('DUPONT Jean'), 'Lyon (69000)', ''])
    expect(r[0][2]).toContain('jean@add.fr')
    // sans ville : valeur brute de la colonne
    expect(r[1]).toEqual(['2', 'Nord', '', '59000', ''])
    expect(wrapper.findAll('tbody tr')[0].find('button').attributes('aria-label')).toBe('Actions pour Sud-Est')
    expect(wrapper.findAll('thead th').map(th => squash(th.text()))).toEqual(['ID', 'Nom', 'Président', 'Ville', 'Actions'])
  })

  it('types date, date-heure, montant et structure', async () => {
    api({ items: [{ id: 3, created_at: '2026-03-05T14:30:00', paid_at: '2026-03-05', amount: 1234.5, structure: { id: 4, name: 'ADD Jeunesse' } },
      { id: 4, created_at: null, paid_at: null, amount: 0, structure: { id: 5, name: 'ADD Sud' } }] })
    const { wrapper } = await mountDatabase({ headers: [
      { title: 'Créé', value: 'created_at', type: 'datetime' },
      { title: 'Payée', value: 'paid_at', type: 'date' },
      { title: 'Montant', value: 'amount', type: 'currency' },
      { title: 'Structure', value: 'structure', type: 'structure' },
    ] })
    const r = rows(wrapper)
    expect(r[0][0]).toBe('05/03/2026 14:30')
    expect(r[0][1]).toBe('05/03/2026')
    expect(r[0][2]).toMatch(/^1\s?234,50\s?€$/)
    expect(r[0][3]).toBe('ADD Jeunesse')
    expect(wrapper.find('tbody img').attributes('src')).toBe('/logos/4.png')
    expect(r[1].slice(0, 2)).toEqual(['', ''])
  })

  it('liste vide : explique l’absence de données et propose l’ajout', async () => {
    api({ items: [] })
    const { wrapper, s } = await mountDatabase()
    const text = squash(wrapper.text())
    expect(text).toContain('Aucune région trouvée')
    expect(text).toContain('Aucune région disponible')
    const add = wrapper.findAll('.fu-database__empty button').find(b => squash(b.text()) === 'Ajouter une région')
    await add.trigger('click')
    await flush()
    expect(s.getters['regions/getDialog']).toBe(true)
    expect(s.getters['regions/getItem']).toEqual({ id: null, name: null })
  })

  it('le bouton Ajouter de la barre d’outils ouvre le formulaire de création', async () => {
    const { wrapper, s } = await mountDatabase()
    await wrapper.findAll('.fu-database__toolbar button').find(b => squash(b.text()) === 'Ajouter une région').trigger('click')
    await flush()
    expect(s.getters['regions/getDialog']).toBe(true)
    expect(bodyText()).toContain('Ajouter une région')
    expect(document.querySelector('.v-dialog .fu-form')).not.toBeNull()
    // fermeture depuis le formulaire
    document.querySelector('.v-dialog button[aria-label="Fermer"]').click()
    await flush()
    expect(s.getters['regions/getDialog']).toBe(false)
  })

  it('sans config de formulaire : la création part d’un élément vide', async () => {
    api({ cfg: { toolbarActions: [{ title: 'regions.add', action: 'add' }] } })
    const { wrapper, s } = await mountDatabase()
    wrapper.vm.manageAction({ action: 'add' })
    expect(s.getters['regions/getItem']).toEqual({})
    wrapper.vm.manageAction({ action: 'inconnue' }) // ignorée
    wrapper.vm.edit(null) // rien à modifier
    expect(axios.get).not.toHaveBeenCalledWith('/api/regions/null')
  })

  it('le bouton Actualiser recharge la liste', async () => {
    const { wrapper } = await mountDatabase()
    const before = listCalls().length
    await wrapper.find('button[aria-label="Actualiser la liste"]').trigger('click')
    await flush()
    expect(listCalls().length).toBe(before + 1)
  })

  it('recherche : relance la liste après une pause de saisie, puis « Effacer la recherche »', async () => {
    const { wrapper } = await mountDatabase({ domain: 'admin' })
    api({ items: [] })
    await wrapper.find('.fu-database__search input').setValue('Ouest')
    await new Promise(r => setTimeout(r, 550))
    await flush()
    expect(axios.get).toHaveBeenLastCalledWith('/api/regions?search=Ouest&domain=admin')
    expect(squash(wrapper.text())).toContain('Aucun résultat pour « Ouest »')

    api()
    await wrapper.findAll('button').find(b => squash(b.text()) === 'Effacer la recherche').trigger('click')
    await new Promise(r => setTimeout(r, 550))
    await flush()
    expect(axios.get).toHaveBeenLastCalledWith('/api/regions?domain=admin')
    expect(rows(wrapper)).toHaveLength(2)
  })

  it('éléments fournis par le parent : affichés tels quels, la recherche n’interroge pas l’API', async () => {
    const { wrapper } = await mountDatabase({ localItems: [{ id: 9, name: 'Local', town: 'Pau', zipcode: '64000' }], enabledSearch: true })
    expect(rows(wrapper)[0].slice(0, 2)).toEqual(['9', 'Local'])
    const before = listCalls().length
    wrapper.vm.search = 'x'
    await new Promise(r => setTimeout(r, 550))
    expect(listCalls().length).toBe(before)
  })

  it('sans recherche activée : pas de champ de recherche', async () => {
    const { wrapper } = await mountDatabase({ enabledSearch: false })
    expect(wrapper.find('.fu-database__search').exists()).toBe(false)
  })

  it('Modifier : charge la fiche puis ouvre le formulaire d’édition', async () => {
    const { wrapper, s } = await mountDatabase()
    await rowAction(wrapper, 0, 'Modifier la région')
    expect(axios.get).toHaveBeenCalledWith('/api/regions/1')
    expect(s.getters['regions/getItem']).toMatchObject({ id: 1, name: 'Sud-Est' })
    expect(s.getters['regions/getDialog']).toBe(true)
    expect(bodyText()).toContain('Modifier la région')
  })

  it('Supprimer : demande confirmation, supprime, recharge et confirme', async () => {
    const { wrapper } = await mountDatabase()
    await rowAction(wrapper, 0, 'Supprimer la région')
    expect(bodyText()).toContain('Supprimer la région')
    expect(bodyText()).toContain('Sud-Est')
    expect(bodyText()).toContain('Êtes-vous sûr de vouloir supprimer cette région ?')
    axios.delete.mockResolvedValue({ data: { status: 200 } })
    api({ items: [regions()[1]] })
    const confirm = Array.from(document.querySelectorAll('.v-overlay--active button')).find(b => squash(b.textContent) === 'Supprimer')
    confirm.click()
    await flush()
    await flush()
    expect(axios.delete).toHaveBeenCalledWith('/api/regions/1', {})
    expect(wrapper.vm.$root.showSnackbar).toHaveBeenCalledWith('Région supprimée', 'success')
    expect(wrapper.vm.dialogConfirmDelete).toBe(false)
    expect(wrapper.vm.deleting).toBe(false)
    expect(rows(wrapper)).toHaveLength(1)
  })

  it('Supprimer puis Annuler : rien n’est supprimé', async () => {
    const { wrapper } = await mountDatabase()
    await rowAction(wrapper, 1, 'Supprimer la région')
    Array.from(document.querySelectorAll('.v-overlay--active button')).find(b => squash(b.textContent) === 'Annuler').click()
    await flush()
    expect(wrapper.vm.dialogConfirmDelete).toBe(false)
    expect(axios.delete).not.toHaveBeenCalled()
  })

  it('suppression refusée par l’API : message d’erreur, la fenêtre reste ouverte', async () => {
    const { wrapper } = await mountDatabase()
    wrapper.vm.manageAction({ action: 'delete' }, regions()[0])
    axios.delete.mockRejectedValue({ response: { status: 403 } })
    wrapper.vm.confirmDelete()
    await flush()
    expect(wrapper.vm.$root.showSnackbar).toHaveBeenCalledWith('Une erreur inconnue est survenue. Veuillez réessayer plus tard.', 'error')
    expect(wrapper.vm.dialogConfirmDelete).toBe(true)
    expect(wrapper.vm.deleting).toBe(false)
  })
})
