import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { mountAdmin, flush, text } from './support.js'

vi.mock('axios')

const tree = () => [
  {
    id: 1, name: 'Statuts', categories: [
      { id: 3, name: 'Archives', categories: [], documents: [{ id: 30, name: 'statuts_2010', description: null, type: 'document', href: '/rails/blob/30' }] },
    ],
    documents: [
      { id: 10, name: 'statuts_2024', description: 'Version adoptée en assemblée générale extraordinaire du 12 mars 2024', type: 'document', href: '/rails/blob/10' },
      { id: 11, name: 'Site de la FNADF', description: 'Court', type: 'url', href: 'https://add.fr' },
      { id: 12, name: 'Sans lien', description: null, type: 'document' },
    ],
  },
  { id: 2, name: 'Comptes', categories: [], documents: [] },
]

async function mountMe(items = tree()) {
  const { default: MeDocumentsIndex } = await import('@/components/Documents/Me/Index.vue')
  axios.get.mockResolvedValue({ data: items })
  const mounted = mountAdmin(MeDocumentsIndex)
  await flush()
  return mounted
}

const row = (wrapper, name) => [...wrapper.element.querySelectorAll('.v-list-item')]
  .find(i => i.querySelector('.v-list-item-title')?.textContent.trim().startsWith(name))

describe('Documents (espace membre)', () => {
  beforeEach(() => vi.resetAllMocks())

  it('charge les documents partagés et affiche les dossiers avec leur nombre d’éléments', async () => {
    const { wrapper } = await mountMe()
    expect(axios.get).toHaveBeenCalledWith('/api/documents', {})
    expect(text(row(wrapper, 'Statuts'))).toBe('Statuts (4)')
    expect(text(row(wrapper, 'Comptes'))).toBe('Comptes (0)')
  })

  it('ouvre un dossier puis ses sous-dossiers', async () => {
    const { wrapper } = await mountMe()
    row(wrapper, 'Statuts').click()
    await flush()
    expect(row(wrapper, 'Statuts').querySelector('.mdi-folder-open')).not.toBeNull()
    expect(text(wrapper)).toContain('statuts_2024 (Version adoptée en assemblée générale extraordinai...)')
    expect(text(wrapper)).toContain('Site de la FNADF (Court)')
    expect(row(wrapper, 'Site de la FNADF').querySelector('.mdi-link')).not.toBeNull()

    row(wrapper, 'Archives').click()
    await flush()
    expect(text(wrapper)).toContain('statuts_2010')
  })

  it('un clic sur un document l’ouvre dans un nouvel onglet', async () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null)
    const { wrapper } = await mountMe()
    row(wrapper, 'Statuts').click()
    await flush()
    row(wrapper, 'statuts_2024').click()
    expect(open).toHaveBeenCalledWith('/rails/blob/10', '_blank')
    row(wrapper, 'Sans lien').click()
    expect(open).toHaveBeenCalledTimes(1)
    open.mockRestore()
  })

  it('un échec de chargement est journalisé, la liste reste vide', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { default: MeDocumentsIndex } = await import('@/components/Documents/Me/Index.vue')
    axios.get.mockRejectedValue(new Error('500'))
    const { wrapper } = mountAdmin(MeDocumentsIndex)
    await flush()
    expect(error).toHaveBeenCalled()
    expect(wrapper.findAll('.v-list-group')).toHaveLength(0)
    error.mockRestore()
  })
})
