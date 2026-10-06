import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import axios from 'axios'
import AnnuaireIndex from '@/components/Annuaire/Index.vue'
import { mountMember, flush, pageText, wait } from './support.js'

vi.mock('axios')

// Résultats de GET /api/search (Api::SearchController#index)
const pastor = {
  id: 3, mdi: 'mdi-account', name: 'DUPONT Jean', phone: '06 12 34 56 78', email: 'jean@add.fr',
  zipcode: '69001', town: 'Lyon', level: 'Pasteur APE', photo_url: 'http://app/avatars/3.png', model_type: 'users',
}
const church = {
  id: 8, mdi: 'mdi-church', name: 'Église de Lyon', phone: null, email: null,
  zipcode: '69002', town: null, photo_url: null, model_type: 'churches',
}

async function search(wrapper, value) {
  await wrapper.find('input').setValue(value)
  await wait(350)
  await flush()
}

describe('Annuaire', () => {
  beforeEach(() => vi.clearAllMocks())
  afterEach(() => { document.body.innerHTML = '' })

  it('invite à saisir au moins 3 caractères, sans appel à l’API en dessous', async () => {
    const { wrapper } = mountMember(AnnuaireIndex)
    expect(pageText()).toContain('Saisissez au moins 3 caractères pour lancer la recherche.')
    await search(wrapper, 'Du')
    expect(pageText()).toContain('Saisissez au moins 3 caractères.')
    expect(axios.get).not.toHaveBeenCalled()
  })

  it('GET /api/search?query= et affiche une fiche par résultat', async () => {
    axios.get.mockResolvedValue({ data: [pastor, church] })
    const { wrapper } = mountMember(AnnuaireIndex)
    await search(wrapper, '  Lyon ')

    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(axios.get).toHaveBeenCalledWith('/api/search', { params: { query: 'Lyon' } })
    const cards = wrapper.findAll('.v-card')
    expect(cards).toHaveLength(2)

    const first = cards[0]
    expect(first.text()).toContain('DUPONT Jean')
    expect(first.text()).toContain('69001 Lyon')
    expect(first.text()).toContain('Pasteur APE')
    expect(first.find('a[href="mailto:jean@add.fr"]').attributes('aria-label')).toBe('Écrire à DUPONT Jean : jean@add.fr')
    expect(first.find('a[href="tel:0612345678"]').exists()).toBe(true)
    expect(first.find('.v-img').exists()).toBe(true)

    // Église sans photo, ni ville, ni coordonnées : icône et fiche réduite
    const second = cards[1]
    expect(second.text()).toContain('Église de Lyon')
    expect(second.find('.v-card-subtitle').exists()).toBe(false)
    expect(second.find('a').exists()).toBe(false)
    expect(second.find('.mdi-church').exists()).toBe(true)
    expect(wrapper.vm.hint).toBe('')
  })

  it('n’envoie qu’une requête pour une saisie rapide', async () => {
    axios.get.mockResolvedValue({ data: [] })
    const { wrapper } = mountMember(AnnuaireIndex)
    await wrapper.find('input').setValue('Dup')
    await wrapper.find('input').setValue('Dupo')
    await wait(350)
    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(axios.get).toHaveBeenCalledWith('/api/search', { params: { query: 'Dupo' } })
  })

  it('aucun résultat : message qui reprend la recherche', async () => {
    axios.get.mockResolvedValue({ data: [] })
    const { wrapper } = mountMember(AnnuaireIndex)
    await search(wrapper, 'Zorglub')
    expect(pageText()).toContain('Aucun résultat pour « Zorglub »')
  })

  it('erreur réseau : alerte, puis effacer la recherche remet l’écran à zéro', async () => {
    axios.get.mockRejectedValue(new Error('réseau'))
    const { wrapper } = mountMember(AnnuaireIndex)
    await search(wrapper, 'Lyon')
    expect(pageText()).toContain('La recherche n’a pas abouti.')
    expect(wrapper.vm.loading).toBe(false)

    await search(wrapper, '')
    expect(pageText()).not.toContain('La recherche n’a pas abouti.')
    expect(wrapper.vm.annuaires).toEqual([])
  })
})
