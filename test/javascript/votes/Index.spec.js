import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axios from 'axios'
import VotesIndex from '@/components/Votes/Index.vue'
import { vuetify, store, flush } from '../helpers.js'

vi.mock('axios')

async function mountIndex(campaigns) {
  axios.get.mockResolvedValue({ data: { campaigns } })
  const wrapper = mount(VotesIndex, {
    global: { plugins: [vuetify(), store()] },
  })
  await flush()
  return wrapper
}

describe('Liste des votes', () => {
  beforeEach(() => vi.clearAllMocks())

  it('liste les campagnes renvoyées par l’API, avec leur structure', async () => {
    const wrapper = await mountIndex([
      { id: 5, name: 'AG 2026', state: 'opened', structure: { name: 'ADD Organisatrice' } },
      { id: 6, name: 'Synode', state: 'coming', structure: { name: 'Région Sud' } },
    ])
    expect(axios.get).toHaveBeenCalledWith('/api/votes', {})
    expect(wrapper.text()).toContain('AG 2026')
    expect(wrapper.text()).toContain('ADD Organisatrice')
    expect(wrapper.text()).toContain('Synode')
  })

  it('seule une campagne ouverte donne accès au vote', async () => {
    const wrapper = await mountIndex([
      { id: 5, name: 'AG 2026', state: 'opened', structure: { name: 'ADD' } },
      { id: 6, name: 'Synode', state: 'coming', structure: { name: 'Région Sud' } },
    ])
    const buttons = wrapper.findAllComponents({ name: 'VBtn' }).filter(b => b.text().includes('Accéder au vote'))
    expect(buttons).toHaveLength(1)
    expect(buttons[0].props('to')).toEqual({ name: 'votes.show', params: { id: 5 } })
  })

  it('sans campagne : message « Aucun vote en cours »', async () => {
    const wrapper = await mountIndex([])
    expect(wrapper.text()).toContain('Aucun vote en cours')
  })
})
