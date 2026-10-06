import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import axios from 'axios'
import FeedIndex from '@/components/Feed/Index.vue'
import PostList from '@/components/Posts/me/List.vue'
import EventList from '@/components/Events/me/List.vue'
import { mountMember, flush, pageText, wait, buttonByText } from './support.js'

vi.mock('axios')

// Actu telle que la renvoie GET /api/feed (Api::FeedController#index)
const post = (id, overrides = {}) => ({
  id, title: `Actu ${id}`, content: `<p>Contenu ${id}</p>`, pinned: false,
  created_at: '2026-09-01T10:30:00', images: [], attachments: [],
  structure: { id: 40 + id, name: `Église ${id}` }, ...overrides,
})
// Événement tel que le renvoie GET /api/me/events
const event = (id, overrides = {}) => ({
  id, title: `Événement ${id}`, start_at: '2026-10-10T09:00:00', end_at: '2026-10-11T17:00:00',
  description: `<p>Programme ${id}</p>`, structure: { id: 7, name: 'ADD Jeunesse' },
  category: { id: 1, name: 'Pastorale' }, ...overrides,
})
const range = (from, count, factory) => Array.from({ length: count }, (_, i) => factory(from + i))

// Répond aux GET selon l'URL ; une valeur Error fait échouer la requête
function routeGets(table) {
  axios.get.mockImplementation((url) => {
    const key = Object.keys(table).find(k => url === k || url.startsWith(k))
    if (!key) return Promise.reject(new Error('URL inattendue : ' + url))
    const value = typeof table[key] === 'function' ? table[key](url) : table[key]
    return value instanceof Error ? Promise.reject(value) : Promise.resolve({ data: value })
  })
}

describe('Fil d’actualité', () => {
  beforeEach(() => vi.clearAllMocks())
  afterEach(() => { document.body.innerHTML = '' })

  it('charge la première page des actus et des événements à l’ouverture', async () => {
    routeGets({ '/api/feed': { posts: [post(1), post(2, { pinned: true })] }, '/api/me/events': { events: [event(1)] } })
    mountMember(FeedIndex)
    await flush()

    expect(axios.get).toHaveBeenCalledWith('/api/feed?offset=0', {})
    expect(axios.get).toHaveBeenCalledWith('/api/me/events?offset=0', {})
    expect(pageText()).toContain('Actu 1')
    expect(pageText()).toContain('Église 2')
    expect(pageText()).toContain('Actualité épinglée')
    expect(pageText()).toContain('Événement 1')
    expect(pageText()).toContain('Du 10/10/2026 09:00 au 11/10/2026 17:00')
    // Moins de 10 actus et 5 événements : rien de plus à charger
    expect(buttonByText('Voir plus d’actualités')).toBeUndefined()
    expect(buttonByText('Voir plus d’événements')).toBeUndefined()
  })

  it('affiche un squelette pendant le chargement', async () => {
    axios.get.mockReturnValue(new Promise(() => {}))
    const { wrapper } = mountMember(FeedIndex)
    await flush()
    expect(wrapper.findAll('.v-skeleton-loader').length).toBe(4)
  })

  it('fil vide : messages dédiés pour les actus et les événements', async () => {
    routeGets({ '/api/feed': { posts: [] }, '/api/me/events': {} })
    mountMember(FeedIndex)
    await flush()
    expect(pageText()).toContain('Aucune actualité pour le moment')
    expect(pageText()).toContain('Les actualités de vos églises et associations apparaîtront ici.')
    expect(pageText()).toContain('Aucun événement à venir pour le moment.')
  })

  it('erreur de chargement : alerte et bouton Réessayer qui relance la première page', async () => {
    routeGets({ '/api/feed': new Error('500'), '/api/me/events': new Error('500') })
    mountMember(FeedIndex)
    await flush()
    expect(pageText()).toContain('Les actualités n’ont pas pu être chargées.')
    expect(pageText()).toContain('Les événements n’ont pas pu être chargés.')

    routeGets({ '/api/feed': { posts: [post(1)] }, '/api/me/events': { events: [] } })
    buttonByText('Réessayer').click()
    await flush()
    expect(axios.get).toHaveBeenLastCalledWith('/api/feed?offset=0', {})
    expect(pageText()).toContain('Actu 1')
  })

  it('pagination : « Voir plus » demande la page suivante avec l’offset courant', async () => {
    routeGets({
      '/api/feed?offset=0': { posts: range(1, 10, post) },
      '/api/feed?offset=10': { posts: range(11, 3, post) },
      '/api/me/events?offset=0': { events: range(1, 5, event) },
      '/api/me/events?offset=5': { events: range(6, 1, event) },
    })
    const { store } = mountMember(FeedIndex)
    await flush()

    buttonByText('Voir plus d’actualités').click()
    await flush()
    expect(axios.get).toHaveBeenCalledWith('/api/feed?offset=10', {})
    expect(store.getters['feedStore/getItems']).toHaveLength(13)
    expect(store.getters['feedStore/getOffset']).toBe(13)
    expect(pageText()).toContain('Actu 13')
    expect(buttonByText('Voir plus d’actualités')).toBeUndefined()

    buttonByText('Voir plus d’événements').click()
    await flush()
    expect(axios.get).toHaveBeenCalledWith('/api/me/events?offset=5', {})
    expect(pageText()).toContain('Événement 6')
    expect(buttonByText('Voir plus d’événements')).toBeUndefined()
  })

  it('cliquer sur une actu ouvre sa page', async () => {
    routeGets({ '/api/feed': { posts: [post(4)] }, '/api/me/events': { events: [] } })
    const { wrapper, router } = mountMember(FeedIndex)
    await flush()
    await wrapper.findComponent({ name: 'PostItem' }).trigger('click')
    expect(router.push).toHaveBeenCalledWith({ name: 'post.show', params: { id: 4 } })
  })
})

describe('Recherche dans le fil', () => {
  beforeEach(() => vi.clearAllMocks())
  afterEach(() => { document.body.innerHTML = '' })

  it('recherche après une pause de saisie, sans « Voir plus », puis revient au fil en vidant le champ', async () => {
    routeGets({
      '/api/feed?offset=0': { posts: range(1, 10, post) },
      '/api/feed?search=': { posts: [post(42, { title: 'Congrès national' })] },
    })
    const { wrapper } = mountMember(PostList)
    await flush()

    await wrapper.find('input').setValue('congrès & jeunes')
    expect(wrapper.findAll('.v-skeleton-loader').length).toBe(2) // pendant la pause de saisie
    await wait(450)
    await flush()

    expect(axios.get).toHaveBeenCalledWith('/api/feed?search=congr%C3%A8s%20%26%20jeunes', {})
    expect(pageText()).toContain('Congrès national')
    expect(pageText()).not.toContain('Actu 1 ')
    expect(buttonByText('Voir plus d’actualités')).toBeUndefined()

    await wrapper.find('input').setValue('   ')
    await wait(450)
    await flush()
    expect(axios.get).toHaveBeenLastCalledWith('/api/feed?offset=0', {})
    expect(pageText()).toContain('Actu 10')
  })

  it('aucun résultat : le message reprend la recherche', async () => {
    routeGets({ '/api/feed?offset=0': { posts: [post(1)] }, '/api/feed?search=': { posts: [] } })
    const { wrapper } = mountMember(PostList)
    await flush()
    await wrapper.find('input').setValue('zzz')
    await wait(450)
    await flush()
    expect(pageText()).toContain('Aucune actualité ne correspond à « zzz »')
    expect(pageText()).toContain('Essayez un autre mot.')
  })

  it('une recherche qui échoue n’affiche plus le squelette', async () => {
    routeGets({ '/api/feed?offset=0': { posts: [post(1)] }, '/api/feed?search=': new Error('500') })
    const { wrapper } = mountMember(PostList)
    await flush()
    await wrapper.find('input').setValue('abc')
    await wait(450)
    await flush()
    expect(wrapper.vm.search_in_progress).toBe(false)
    expect(wrapper.findAll('.v-skeleton-loader').length).toBe(0)
  })

  it('événements : la recherche interroge /api/me/events, et la liste complète revient si le terme est vide', async () => {
    routeGets({ '/api/me/events': { events: [event(1)] } })
    const { wrapper } = mountMember(EventList)
    await flush()

    wrapper.vm.search = 'pasto rale'
    wrapper.vm.searching()
    await flush()
    expect(axios.get).toHaveBeenLastCalledWith('/api/me/events?search=pasto%20rale', {})

    wrapper.vm.search = ''
    wrapper.vm.searching()
    await flush()
    expect(axios.get).toHaveBeenLastCalledWith('/api/me/events?offset=0', {})
  })
})
