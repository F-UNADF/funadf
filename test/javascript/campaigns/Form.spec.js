import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { reactive } from 'vue'
import axios from 'axios'
import CampaignForm from '@/components/Campaigns/Form.vue'
import VotingTablesPanel from '@/components/Campaigns/VotingTablesPanel.vue'
import { vuetify, store, flush } from '../helpers.js'

vi.mock('axios')

const text = (wrapper) => wrapper.text().replace(/\s+/g, ' ')

// Réponse de POST /api/campaigns/electorate (CampaignElectorate#as_json)
const electorate = (estimate = {}) => ({
  structure: { id: 2, name: 'ADD Organisatrice', type: 'Association' },
  members: {
    total: 9, blocked: 2,
    pastors: { total: 3, disabled: 1, by_level: [{ level: 'Pasteur APE', count: 2 }, { level: 'Non renseigné', count: 1 }] },
    churches: { total: 4, without_president: 2 },
    oeuvres: { total: 1, without_president: 0 },
    others: 0,
  },
  estimate: { count: 3, consultative: 2, blocked: 2, lines: [{ voters: 3, blocked: 1, duplicate: false }], ...estimate },
})

function mountPanel(props) {
  const s = store()
  const wrapper = mount(VotingTablesPanel, {
    props: { positions: ['Pasteur APE', 'Eglises', 'Oeuvres'], delay: 0, ...props },
    global: { plugins: [vuetify(), s] },
  })
  return wrapper
}

describe('Formulaire de campagne', () => {
  beforeEach(() => vi.clearAllMocks())

  it('à la création, une première résolution est prête à remplir', async () => {
    const s = store()
    s.commit('campaignsStore/setItem', { name: '', structure_id: null, motions: [], state: 'coming' })
    s.commit('campaignsStore/setReferentiels', { structures: [], positions: [] })
    const wrapper = mount(CampaignForm, { global: { plugins: [vuetify(), s] } })
    await flush()

    expect(wrapper.findAll('[data-test="motion"]')).toHaveLength(1)
    expect(text(wrapper)).toContain('Intitulé de la résolution 1')
    expect(text(wrapper)).toContain('Résolutions (1)')
    expect(axios.get).not.toHaveBeenCalled() // pas de comptage des votants sans campagne enregistrée
  })

  it('refuse d’enregistrer une résolution sans intitulé ou une ligne en double', async () => {
    const s = store()
    s.commit('campaignsStore/setItem', {
      name: 'AG', structure_id: 2, state: 'coming', motions: [],
      voting_tables: [
        { position: 'Pasteur APE', as_member: true, voting: 'count' },
        { position: 'Pasteur APE', as_member: true, voting: 'consultative' },
      ],
    })
    s.commit('campaignsStore/setReferentiels', { structures: [{ id: 2, name: 'ADD Organisatrice' }], positions: ['Pasteur APE'] })
    axios.post.mockResolvedValue({ data: electorate() })
    const wrapper = mount(CampaignForm, { global: { plugins: [vuetify(), s] } })
    wrapper.vm.$root.showSnackbar = vi.fn()
    await flush()

    wrapper.vm.save()
    await flush()
    expect(text(wrapper)).toContain('Chaque résolution doit avoir un intitulé.')
    expect(text(wrapper)).toContain('deux lignes « Pasteur APE » pour les membres')
    expect(axios.post).not.toHaveBeenCalledWith('/api/campaigns', expect.anything(), expect.anything())
  })
})

describe('Table des votes : membres et estimation', () => {
  beforeEach(() => vi.clearAllMocks())

  it('sans structure choisie : invite à la choisir, sans appel à l’API', async () => {
    const wrapper = mountPanel({ votingTables: [], structureId: null })
    await flush()
    expect(text(wrapper)).toContain('Choisissez la structure organisatrice pour estimer')
    expect(text(wrapper)).toContain('Aucune structure choisie')
    expect(axios.post).not.toHaveBeenCalled()
  })

  it('affiche les membres de la structure organisatrice et l’estimation', async () => {
    axios.post.mockResolvedValue({ data: electorate() })
    const tables = [{ position: 'Pasteur APE', as_member: true, voting: 'count' }]
    const wrapper = mountPanel({ votingTables: tables, structureId: 2 })
    await flush()

    expect(axios.post).toHaveBeenCalledWith('/api/campaigns/electorate', {
      structure_id: 2, voting_tables: [{ position: 'Pasteur APE', as_member: true, voting: 'count' }],
    })
    const members = text(wrapper.find('[data-test="members"]'))
    expect(members).toContain('Membres de ADD Organisatrice')
    expect(members).toContain('9 membres directs')
    const rows = wrapper.findAll('.members__row').map(r => r.findAll('dt, dd').map(c => c.text()))
    expect(rows).toEqual([
      ['Pasteurs', '3'], ['Pasteur APE', '2'], ['Sans reconnaissance', '1'],
      ['Églises', '4'], ['dont sans président', '2'], ['Œuvres', '1'],
    ])
    expect(members).toContain('2 églises ou œuvres membres n’ont pas de président')
    expect(members).toContain('2 adhésions bloquées')

    expect(text(wrapper.find('[data-test="estimate"]')))
      .toBe('En l’état, vous aurez au plus 3 votants comptabilisés et 2 votants consultatifs.')
    expect(text(wrapper)).toContain('C’est un maximum')
    expect(text(wrapper.find('[data-test="line-count"]'))).toContain('3 votants')
  })

  it('met l’estimation à jour quand la table change', async () => {
    axios.post.mockResolvedValueOnce({ data: electorate() })
    // Comme editedItem dans le formulaire : un tableau réactif modifié en place
    const tables = reactive([{ position: 'Pasteur APE', as_member: true, voting: 'count' }])
    const wrapper = mountPanel({ votingTables: tables, structureId: 2 })
    await flush()

    axios.post.mockResolvedValueOnce({ data: electorate({
      count: 3, consultative: 40, blocked: 0,
      lines: [{ voters: 3, blocked: 0, duplicate: false }, { voters: 40, blocked: 0, duplicate: false }],
    }) })
    await wrapper.findAll('button').find(b => b.text() === 'Ajouter une ligne').trigger('click')
    tables[1].position = 'Eglises'
    tables[1].as_member = false
    tables[1].voting = 'consultative'
    await flush()
    await flush()

    expect(axios.post).toHaveBeenLastCalledWith('/api/campaigns/electorate', {
      structure_id: 2,
      voting_tables: [
        { position: 'Pasteur APE', as_member: true, voting: 'count' },
        { position: 'Eglises', as_member: false, voting: 'consultative' },
      ],
    })
    expect(text(wrapper.find('[data-test="estimate"]')))
      .toBe('En l’état, vous aurez au plus 3 votants comptabilisés et 40 votants consultatifs.')
    expect(wrapper.findAll('[data-test="voting-line"]')).toHaveLength(2)
  })

  it('signale une ligne en double', async () => {
    axios.post.mockResolvedValue({ data: electorate() })
    const wrapper = mountPanel({
      structureId: 2,
      votingTables: [
        { position: 'Eglises', as_member: true, voting: 'count' },
        { position: 'Eglises', as_member: true, voting: 'consultative' },
      ],
    })
    await flush()
    expect(text(wrapper)).toContain('cette ligne ne sera pas appliquée')
  })
})
