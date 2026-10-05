import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axios from 'axios'
import CampaignForm from '@/components/Campaigns/Form.vue'
import { vuetify, store, flush } from '../helpers.js'

vi.mock('axios')

// PDF des résultats : téléchargé par l'API (avec le jeton), jamais par une URL publique.
describe('PDF des résultats', () => {
  let tab

  beforeEach(() => {
    vi.clearAllMocks()
    tab = { location: { href: '' }, close: vi.fn() }
    vi.spyOn(window, 'open').mockReturnValue(tab)
    URL.createObjectURL = vi.fn(() => 'blob:resultats')
    URL.revokeObjectURL = vi.fn()
  })

  async function mountForm() {
    axios.get.mockResolvedValue({ data: new Blob(['%PDF']) })
    const s = store()
    s.commit('campaignsStore/setItem', { id: 7, name: 'AG', structure_id: 2, state: 'closed', motions: [], voting_tables: [] })
    s.commit('campaignsStore/setReferentiels', { structures: [], positions: [] })
    const wrapper = mount(CampaignForm, { global: { plugins: [vuetify(), s] } })
    wrapper.vm.$root.showSnackbar = vi.fn()
    await flush()
    axios.get.mockClear()
    return wrapper
  }

  it('télécharge le PDF par l’API puis l’ouvre dans un nouvel onglet', async () => {
    const wrapper = await mountForm()
    axios.get.mockResolvedValue({ data: new Blob(['%PDF']) })

    await wrapper.vm.downloadResults()

    expect(axios.get).toHaveBeenCalledWith('/api/campaigns/7/results', { responseType: 'blob' })
    expect(window.open).toHaveBeenCalledWith('', '_blank')
    expect(tab.location.href).toBe('blob:resultats')
    expect(window.open).not.toHaveBeenCalledWith(expect.stringContaining('.pdf'), expect.anything())
  })

  it('en cas d’erreur, ferme l’onglet et prévient l’utilisateur', async () => {
    const wrapper = await mountForm()
    axios.get.mockRejectedValue(new Error('403'))

    await wrapper.vm.downloadResults()

    expect(tab.close).toHaveBeenCalled()
    expect(wrapper.vm.$root.showSnackbar).toHaveBeenCalledWith('Le PDF des résultats n’a pas pu être généré.', 'error')
  })
})
