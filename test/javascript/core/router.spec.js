import { describe, it, expect, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { initializeApp } from 'firebase/app'
import { getMessaging } from 'firebase/messaging'

vi.mock('axios')
vi.mock('vue3-editor', () => ({ VueEditor: { name: 'VueEditor', template: '<div />' } }))
vi.mock('firebase/app', () => ({ initializeApp: vi.fn(() => ({ name: 'funadf' })) }))
vi.mock('firebase/messaging', () => ({
  getMessaging: vi.fn(() => ({ messaging: true })), getToken: vi.fn(), onMessage: vi.fn(), isSupported: vi.fn(),
}))

const { default: router } = await import('@/router/router.js')
const routes = router.getRoutes()

// Chemins servis par Rails pour la SPA (config/routes.rb), pour qu'un rechargement de page ne renvoie pas 404
function railsSpaPaths() {
  const source = readFileSync(resolve(process.cwd(), 'config/routes.rb'), 'utf8')
  const paths = new Set()
  const namespace = /namespace :(\w+)(?:, path: '([^']*)')? do([\s\S]*?)\n  end/g
  let m
  while ((m = namespace.exec(source))) {
    const prefix = m[2] !== undefined ? m[2] : '/' + m[1]
    for (const r of m[3].matchAll(/resources :(\w+), only: :index/g)) paths.add(`${prefix}/${r[1]}`)
    for (const g of m[3].matchAll(/get '([^']+)'/g)) paths.add(prefix + g[1])
  }
  for (const g of source.matchAll(/^  get '(\/[^']+)'/gm)) paths.add(g[1])
  return paths
}

// Normalise les paramètres (:id, :post…) pour comparer les deux routeurs
const normalize = (path) => path.replace(/:\w+/g, ':param')

describe('router.js : routes de la SPA', () => {
  it('« / » renvoie vers le fil d’actualité', () => {
    expect(router.resolve('/').fullPath).toBe('/')
    expect(routes.find(r => r.path === '/').redirect).toBe('/feed')
  })

  it('chaque page a un nom unique et un titre (onglet du navigateur, en-tête)', () => {
    const pages = routes.filter(r => !r.redirect)
    const names = pages.map(r => r.name)
    expect(new Set(names).size).toBe(names.length)
    for (const route of pages) {
      expect(route.meta.title, route.path).toBeTruthy()
    }
  })

  it('les écrans d’administration reçoivent l’espace correspondant à leur préfixe', () => {
    for (const route of routes) {
      const space = route.path.split('/')[1]
      if (['admin', 'association', 'region'].includes(space)) {
        expect(route.props.default, route.path).toEqual({ domain: space })
      }
    }
  })

  it('résout les URL vers le bon écran, paramètres compris', () => {
    expect(router.resolve('/admin/regions').name).toBe('admin.regions')
    expect(router.resolve('/region/posts').name).toBe('region.posts')
    expect(router.resolve('/campaigns/12')).toMatchObject({ name: 'votes.show', params: { id: '12' } })
    expect(router.resolve('/actus/5')).toMatchObject({ name: 'post.show', params: { id: '5' } })
    expect(router.resolve('/evenements/8')).toMatchObject({ name: 'event.show', params: { id: '8' } })
    expect(router.resolve({ name: 'admin.push_notifications' }).path).toBe('/admin/push_notifications')
    expect(router.resolve('/inconnue').matched).toHaveLength(0)
  })

  it('chaque route existe aussi côté Rails (rechargement de page)', () => {
    const rails = new Set([...railsSpaPaths()].map(normalize))
    const missing = routes.map(r => r.path).filter(p => p !== '/' && !rails.has(normalize(p)))
    expect(missing).toEqual([])
  })
})

describe('utils/firebase.js', () => {
  it('initialise Firebase (projet funadf) et Cloud Messaging', async () => {
    const { messaging } = await import('@/utils/firebase.js')
    expect(initializeApp).toHaveBeenCalledWith(expect.objectContaining({ projectId: 'funadf-49dfb', messagingSenderId: '609947767440' }))
    expect(getMessaging).toHaveBeenCalledWith({ name: 'funadf' })
    expect(messaging).toEqual({ messaging: true })
  })
})
