import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axios from 'axios'
import VotesShow from '@/components/Votes/Show.vue'
import { vuetify, store, flush } from '../helpers.js'

vi.mock('axios')

// Réponse de GET /api/votes/:id telle que la renvoie l'API (Campaign#ballots_for) :
// can_vote et is_consultative valent 0 / 1, has_voted vaut null tant que le bulletin est libre.
const ballot = (overrides) => ({
  name: 'Jean DUPONT', town: 'Lyon', resource_id: 1, resource_type: 'User',
  can_vote: 1, is_consultative: 0, has_voted: null, id: null, ...overrides,
})

const campaignResponse = (voters, motions = [{ id: 10, name: 'Rapport moral', kind: 'binary', choices: null, max_choice: null }]) => ({
  data: {
    campaign: { id: 5, name: 'AG 2026', state: 'opened' },
    structure: { id: 2, name: 'ADD Organisatrice' },
    motions,
    voters,
    present: true,
  },
})

async function mountVote(voters, motions) {
  axios.get.mockResolvedValue(campaignResponse(voters, motions))
  axios.post.mockResolvedValue({ data: { status: 'ok' } })
  const router = { push: vi.fn() }
  const wrapper = mount(VotesShow, {
    attachTo: document.body,
    global: {
      plugins: [vuetify(), store()],
      mocks: { $route: { params: { id: '5' } }, $router: router },
    },
  })
  wrapper.vm.$root.showSnackbar = vi.fn()
  await flush()
  return { wrapper, router }
}

const text = () => document.body.textContent.replace(/\s+/g, ' ')
const voteButton = (wrapper) => wrapper.findAll('button').find(b => b.text() === 'Voter')

describe('Page de vote', () => {
  beforeEach(() => vi.clearAllMocks())
  afterEach(() => { document.body.innerHTML = '' })

  it('charge la campagne de la route', async () => {
    await mountVote([ballot()])
    expect(axios.get).toHaveBeenCalledWith('/api/votes/5', {})
    expect(text()).toContain('AG 2026')
    expect(text()).toContain('ADD Organisatrice')
    expect(text()).toContain('1. Rapport moral')
  })

  it('affiche chaque bulletin selon son état : comptabilisé, consultatif, bloqué, déjà voté', async () => {
    const { wrapper } = await mountVote([
      ballot({ name: 'Église de Lyon', resource_id: 7, resource_type: 'Structure', is_consultative: 1 }),
      ballot({ name: 'Œuvre Jeunesse', resource_id: 8, resource_type: 'Structure', can_vote: 0 }),
      ballot({ name: 'Église de Paris', resource_id: 9, resource_type: 'Structure', has_voted: 1 }),
      ballot(),
    ])

    const labels = wrapper.findAll('.v-checkbox').map(c => c.text())
    expect(labels).toEqual(['Église de Lyon (vote consultatif)', 'Jean DUPONT (vote comptabilisé)'])
    expect(text()).toContain('Œuvre Jeunesse ne peut pas voter')
    expect(text()).toContain('bloqué par les administrateurs de ADD Organisatrice')
    expect(text()).toContain('Église de Paris a déjà voté')
  })

  it('le bouton Voter reste désactivé tant qu’aucun bulletin n’est coché', async () => {
    const { wrapper } = await mountVote([ballot()])
    expect(voteButton(wrapper).attributes('disabled')).toBeDefined()
    expect(text()).toContain('Cochez au moins un bulletin pour voter.')

    await wrapper.find('.v-checkbox input').setValue(true)
    expect(voteButton(wrapper).attributes('disabled')).toBeUndefined()
  })

  it('tous les bulletins utilisés : message dédié', async () => {
    await mountVote([ballot({ has_voted: 1 })])
    expect(text()).toContain('Aucun bulletin disponible : tous vos bulletins ont déjà été utilisés.')
  })

  it('pasteur et président d’église : vote avec les deux bulletins après confirmation', async () => {
    const { wrapper, router } = await mountVote([
      ballot({ name: 'Église de Lyon', resource_id: 7, resource_type: 'Structure' }),
      ballot(),
    ])

    for (const checkbox of wrapper.findAll('.v-checkbox input')) await checkbox.setValue(true)
    await wrapper.findAll('.btn-toggle-vote button').find(b => b.text() === 'Oui').trigger('click')
    await voteButton(wrapper).trigger('click')
    await flush()

    expect(text()).toContain('Vous allez voter avec 2 bulletins.')
    expect(text()).not.toContain('sans réponse')

    const confirm = [...document.querySelectorAll('button')].find(b => b.textContent.includes('Confirmer mon vote'))
    confirm.click()
    await flush()

    expect(axios.post).toHaveBeenCalledTimes(1)
    const payload = axios.post.mock.calls[0][1]
    expect(payload.campaign_id).toBe('5')
    expect(payload.voters.map(v => [v.resource_type, v.resource_id, v.selected])).toEqual([
      ['Structure', 7, true],
      ['User', 1, true],
    ])
    expect(payload.results).toEqual([
      { motion_id: 10, name: 'Rapport moral', kind: 'binary', choices: null, max_choice: null, vote: 'oui' },
    ])
    expect(wrapper.vm.$root.showSnackbar).toHaveBeenCalledWith('Votre vote est enregistré.', 'success')
    expect(router.push).toHaveBeenCalledWith({ name: 'votes.index' })
  })

  it('un bulletin bloqué n’est jamais envoyé comme sélectionné', async () => {
    const { wrapper } = await mountVote([
      ballot({ name: 'Œuvre Jeunesse', resource_id: 8, resource_type: 'Structure', can_vote: 0 }),
      ballot(),
    ])
    await wrapper.find('.v-checkbox input').setValue(true)
    await voteButton(wrapper).trigger('click')
    await flush()
    ;[...document.querySelectorAll('button')].find(b => b.textContent.includes('Confirmer mon vote')).click()
    await flush()

    const voters = axios.post.mock.calls[0][1].voters
    expect(voters.filter(v => v.selected).map(v => v.resource_id)).toEqual([1])
  })

  it('signale les questions sans réponse avant de confirmer', async () => {
    const { wrapper } = await mountVote([ballot()], [
      { id: 10, name: 'Rapport moral', kind: 'binary', choices: null, max_choice: null },
      { id: 11, name: 'Élection du bureau', kind: 'choices', choices: 'Alice,Bruno,Chloé', max_choice: 2 },
      { id: 12, name: 'Suggestions', kind: 'free', choices: null, max_choice: null },
    ])
    expect(text()).toContain('Jusqu’à 2 choix')
    expect(wrapper.findAll('.btn-toggle-vote').at(1).findAll('button').map(b => b.text())).toEqual(['Alice', 'Bruno', 'Chloé'])

    await wrapper.find('.v-checkbox input').setValue(true)
    await voteButton(wrapper).trigger('click')
    await flush()
    expect(text()).toContain('3 questions sont restées sans réponse.')
  })

  it('une erreur d’enregistrement est signalée et le vote peut être relancé', async () => {
    const { wrapper, router } = await mountVote([ballot()])
    axios.post.mockRejectedValueOnce(new Error('réseau'))

    await wrapper.find('.v-checkbox input').setValue(true)
    await voteButton(wrapper).trigger('click')
    await flush()
    ;[...document.querySelectorAll('button')].find(b => b.textContent.includes('Confirmer mon vote')).click()
    await flush()

    expect(wrapper.vm.$root.showSnackbar).toHaveBeenCalledWith('Votre vote n’a pas pu être enregistré. Réessayez dans un instant.', 'error')
    expect(router.push).not.toHaveBeenCalled()
    expect(wrapper.vm.submitting).toBe(false)
  })
})
