import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import FeesPage from '@/pages/Fees/Index.vue'
import PostsPage from '@/pages/Posts/Index.vue'
import MembersPage from '@/pages/Members/Index.vue'
import EventsShow from '@/pages/Events/Show.vue'
import PostsShow from '@/pages/Posts/Show.vue'
import IntranetUsers from '@/pages/Intranet/Users/Index.vue'
import { mountAdmin, flush, click, apiError, text, dialog, routeGet } from './support.js'

vi.mock('axios')

const listQueries = (model) => axios.get.mock.calls
  .map(([url]) => url)
  .filter(url => url === `/api/${model}` || url.startsWith(`/api/${model}?`))
  .map(url => Object.fromEntries([...new URLSearchParams(url.split('?')[1] || '')].filter(([, v]) => v !== '' && v !== 'null')))

const crudConfig = (model, fields) => ({
  toolbarActions: [{ name: 'add', title: `${model}.add`, icon: 'mdi-plus', action: 'add' }],
  itemActions: [
    { name: 'edit', title: `${model}.edit`, icon: 'mdi-pencil', action: 'edit' },
    { name: 'delete', title: `${model}.delete`, icon: 'mdi-delete', action: 'delete' },
  ],
  form: { fullscreen: false, defaultItem: { id: null }, tabs: [{ title: 'Information générale', name: 'infos', fields }] },
})

describe('Cotisations (admin)', () => {
  beforeEach(() => vi.resetAllMocks())

  const fees = [
    { id: 60, what: '2026', amount: 120.5, paid_at: '2026-02-01', member_type: 'User', member: { id: 5, lastname: 'Dupont', firstname: 'Jean', email: 'jean@add.fr' } },
    { id: 61, what: '2025', amount: 80, paid_at: null, member_type: 'User', member: { id: 6, lastname: 'Martin', firstname: 'Paul', email: 'paul@add.fr' } },
  ]

  async function mountFees() {
    routeGet(axios, {
      '/api/fees/config': { config: crudConfig('fees', [{ name: 'amount', type: 'float', label: 'Montant' }]) },
      '/api/fees/60': { fee: { id: 60, what: '2026', amount: 120.5, paid_at: '2026-02-01', member: 'User-5' } },
      '/api/referentiels/fees': { users: [], structures: [] },
      '/api/fees': { fees },
    })
    const mounted = mountAdmin(FeesPage)
    await flush()
    await flush()
    return mounted
  }

  it('liste les cotisations : année, membre, montant en euros, date de paiement', async () => {
    const { wrapper } = await mountFees()
    expect(listQueries('fees')).toEqual([{}])
    expect(axios.get).toHaveBeenCalledWith('/api/fees/config')
    const [first, second] = wrapper.findAll('tbody tr').map(r => text(r))
    expect(first).toContain('2026')
    expect(first).toContain('Dupont Jean')
    expect(first).toMatch(/120,50\s?€/)
    expect(first).toContain('01/02/2026')
    expect(second).toContain('Martin Paul')
    expect(text(wrapper)).toContain('Ajouter une cotisation')
  })

  it('ouvre une cotisation pour la modifier', async () => {
    const { wrapper } = await mountFees()
    await click('Actions pour 60', wrapper.element)
    await click('Modifier la cotisation')
    await flush()
    expect(axios.get).toHaveBeenCalledWith('/api/fees/60')
    expect(text(dialog())).toContain('Modifier la cotisation')
  })

  it('supprime une cotisation après confirmation', async () => {
    const { wrapper, snackbar } = await mountFees()
    await click('Actions pour 61', wrapper.element)
    await click('Supprimer la cotisation')
    expect(text(dialog())).toContain('Êtes-vous sûr de vouloir supprimer cette cotisation ?')
    axios.delete.mockResolvedValue({ data: { status: 200 } })
    await click('Supprimer', dialog())
    await flush()
    expect(axios.delete).toHaveBeenCalledWith('/api/fees/61', {})
    expect(snackbar).toHaveBeenCalledWith('Cotisation supprimée', 'success')
  })
})

describe('Actualités (gestion)', () => {
  beforeEach(() => vi.resetAllMocks())

  const posts = [
    { id: 3, title: 'Convention 2026', structure: { id: 2, name: 'ADD Organisatrice' }, published_at: '2026-09-01T10:00:00', expired_at: null },
  ]

  async function mountPosts(domain) {
    routeGet(axios, {
      '/api/posts/config': { config: crudConfig('posts', [{ name: 'title', type: 'text', label: 'Titre' }]) },
      '/api/referentiels/posts': { structures: [], levels: [] },
      '/api/posts': { posts },
    })
    const mounted = mountAdmin(PostsPage, { props: domain ? { domain } : {} })
    await flush()
    await flush()
    return mounted
  }

  it('liste les actus de l’espace région avec leur structure et leurs dates', async () => {
    const { wrapper } = await mountPosts('region')
    expect(listQueries('posts')).toEqual([{ domain: 'region' }])
    const row = text(wrapper.find('tbody tr'))
    expect(row).toContain('Convention 2026')
    expect(row).toContain('ADD Organisatrice')
    expect(row).toContain('01/09/2026')
    expect(wrapper.find('tbody img').attributes('src')).toBe('/logos/2.png')
  })

  it('espace « me » par défaut ; suppression confirmée', async () => {
    const { wrapper, snackbar } = await mountPosts()
    expect(listQueries('posts')).toEqual([{ domain: 'me' }])
    await click('Actions pour Convention 2026', wrapper.element)
    await click('Supprimer l\'actu')
    expect(text(dialog())).toContain('Convention 2026')
    axios.delete.mockResolvedValue({ data: {} })
    await click('Supprimer', dialog())
    await flush()
    expect(axios.delete).toHaveBeenCalledWith('/api/posts/3', {})
    expect(snackbar).toHaveBeenCalledWith('Actu supprimée', 'success')
  })
})

describe('Membres de la région', () => {
  beforeEach(() => vi.resetAllMocks())

  it('charge la région de l’utilisateur puis ses membres', async () => {
    routeGet(axios, {
      '/api/current_user': { user: { id: 1 }, region: { id: 12, name: 'Région Sud' }, roles: [], original_user: null },
      '/api/regions/12': { region: { id: 12, name: 'Région Sud' }, members: [{ membership_id: 900, name: 'Église de Nice', member_type: 'Structure', town: 'Nice', zipcode: '06000', role_name: 'member', can_vote: true }] },
      '/api/referentiels/regions': { roles: [], members: [] },
    })
    const { wrapper } = mountAdmin(MembersPage)
    expect(wrapper.find('.v-skeleton-loader').exists()).toBe(true)
    await flush()
    await flush()
    expect(axios.get).toHaveBeenCalledWith('/api/current_user')
    expect(axios.get).toHaveBeenCalledWith('/api/regions/12')
    expect(axios.get).toHaveBeenCalledWith('/api/referentiels/regions', {})
    expect(text(wrapper)).toContain('Église de Nice')
    expect(text(wrapper)).toContain('Ajouter des membres')
  })

  it('sans région rattachée : explique pourquoi', async () => {
    routeGet(axios, { '/api/current_user': { user: { id: 1 }, region: null, roles: [] } })
    const { wrapper } = mountAdmin(MembersPage)
    await flush()
    expect(text(wrapper)).toContain('Aucune région n’est rattachée à votre compte')
    expect(axios.get).not.toHaveBeenCalledWith('/api/regions/12')
  })

  it('si la session ne peut pas être chargée, affiche aussi le message', async () => {
    routeGet(axios, { '/api/current_user': apiError([], 500) })
    const { wrapper } = mountAdmin(MembersPage)
    await flush()
    expect(text(wrapper)).toContain('Aucune région n’est rattachée à votre compte')
  })
})

describe('Pages de détail : événement et actualité', () => {
  beforeEach(() => vi.resetAllMocks())

  const event = { id: 4, title: 'Convention nationale', description: '<p>Programme</p>', start_at: '2026-10-10T09:00:00', end_at: '2026-10-11T18:00:00', structure: { id: 2, name: 'ADD Organisatrice' }, category: { name: 'Convention' }, attachments: [] }

  it('affiche l’événement de l’URL', async () => {
    axios.get.mockResolvedValue({ data: { event } })
    const { wrapper } = mountAdmin(EventsShow, { props: { id: '4' }, route: { params: { id: '4' } } })
    expect(wrapper.find('.v-skeleton-loader').exists()).toBe(true)
    await flush()
    expect(axios.get).toHaveBeenCalledWith('/api/events/4')
    expect(text(wrapper)).toContain('Convention nationale')
    expect(text(wrapper)).toContain('ADD Organisatrice')
  })

  it('événement introuvable : message, et retour au fil d’actualité', async () => {
    axios.get.mockRejectedValue(apiError([], 404))
    const { wrapper, router } = mountAdmin(EventsShow, { props: { id: '99' }, route: { params: { id: '99' } } })
    await flush()
    expect(text(wrapper)).toContain('Cet événement n’a pas pu être affiché')
    await click('Retour au fil d’actualité')
    expect(router.push).toHaveBeenCalledWith({ name: 'feed.index' })
  })

  it('affiche l’actualité de l’URL', async () => {
    axios.get.mockResolvedValue({ data: { post: { id: 3, title: 'Convention 2026', content: '<p>Inscriptions ouvertes</p>', structure: { id: 2, name: 'ADD Organisatrice' }, created_at: '2026-09-01T10:00:00', images: [], attachments: [] } } })
    const { wrapper } = mountAdmin(PostsShow, { props: { id: '3' }, route: { params: { id: '3' } } })
    await flush()
    expect(axios.get).toHaveBeenCalledWith('/api/posts/3')
    expect(text(wrapper)).toContain('Convention 2026')
    expect(text(wrapper)).toContain('Inscriptions ouvertes')
  })

  it('actualité introuvable : message, et retour au fil d’actualité', async () => {
    axios.get.mockRejectedValue(apiError([], 403))
    const { wrapper, router } = mountAdmin(PostsShow, { props: { id: '3' }, route: { params: { id: '3' } } })
    await flush()
    expect(text(wrapper)).toContain('Cette actualité n’a pas pu être affichée')
    await click('Retour au fil d’actualité')
    expect(router.push).toHaveBeenCalledWith({ name: 'feed.index' })
  })
})

describe('Intranet : utilisateurs (page provisoire)', () => {
  it('affiche son titre', () => {
    const { wrapper } = mountAdmin(IntranetUsers)
    expect(text(wrapper)).toBe('Users')
  })
})
