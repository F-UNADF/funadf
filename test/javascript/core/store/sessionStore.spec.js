import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import axios from 'axios'
import sessionStore from '@/store/modules/sessionStore'
import menuStore from '@/store/modules/menuStore'
import { moduleStore, stubLocation } from '../support.js'

vi.mock('axios')

const session = () => moduleStore(sessionStore, 'sessionStore')
const originalLocation = window.location

describe('sessionStore : session et changement d’utilisateur', () => {
  let location
  beforeEach(() => {
    vi.clearAllMocks()
    axios.defaults.headers.common = {}
    localStorage.clear()
    sessionStorage.clear()
    location = stubLocation('/feed')
  })
  afterEach(() => {
    Object.defineProperty(window, 'location', { value: originalLocation, configurable: true, writable: true })
  })

  it('au chargement du module, réutilise le jeton déjà stocké pour les appels axios', async () => {
    vi.resetModules()
    sessionStorage.setItem('token', 'jeton-session')
    const fresh = await import('axios')
    fresh.default.defaults.headers.common = {}
    await import('@/store/modules/sessionStore')
    expect(fresh.default.defaults.headers.common.Authorization).toBe('Bearer jeton-session')
  })

  it('fetchUser : charge l’utilisateur courant, sa région, ses rôles et l’utilisateur d’origine', async () => {
    const s = session()
    axios.get.mockResolvedValue({ data: {
      user: { id: 1, firstname: 'Paul' }, region: { id: 3 }, roles: ['admin'], original_user: { id: 9 },
    } })
    await s.dispatch('sessionStore/fetchUser')
    expect(axios.get).toHaveBeenCalledWith('/api/current_user')
    expect(s.getters['sessionStore/currentUser']).toEqual({ id: 1, firstname: 'Paul' })
    expect(s.getters['sessionStore/region']).toEqual({ id: 3 })
    expect(s.getters['sessionStore/roles']).toEqual(['admin'])
    expect(s.getters['sessionStore/getOriginalUser']).toEqual({ id: 9 })
  })

  it('login : stocke le jeton (local et session), l’ajoute aux en-têtes et mémorise l’utilisateur', async () => {
    const s = session()
    axios.post.mockResolvedValue({ data: { token: 'abc', user: { id: 2 } } })
    await s.dispatch('sessionStore/login', { email: 'a@b.fr', password: 'x' })
    expect(axios.post).toHaveBeenCalledWith('/api/login', { email: 'a@b.fr', password: 'x' })
    expect(localStorage.getItem('token')).toBe('abc')
    expect(sessionStorage.getItem('token')).toBe('abc')
    expect(axios.defaults.headers.common.Authorization).toBe('Bearer abc')
    expect(s.getters['sessionStore/currentUser']).toEqual({ id: 2 })
  })

  it('login refusé : rejette sans rien stocker', async () => {
    const s = session()
    axios.post.mockRejectedValue({ response: { status: 401 } })
    await expect(s.dispatch('sessionStore/login', {})).rejects.toEqual({ response: { status: 401 } })
    expect(localStorage.getItem('token')).toBeNull()
    expect(s.getters['sessionStore/currentUser']).toBeNull()
  })

  it('logout : efface le jeton partout et renvoie vers /connexion, même si l’API échoue', async () => {
    const s = session()
    localStorage.setItem('token', 'abc')
    sessionStorage.setItem('token', 'abc')
    axios.defaults.headers.common.Authorization = 'Bearer abc'
    s.commit('sessionStore/setCurrentUser', { id: 1 })
    s.commit('sessionStore/setOriginalUser', { id: 9 })
    axios.delete.mockRejectedValue(new Error('réseau'))

    await s.dispatch('sessionStore/logout')
    expect(axios.delete).toHaveBeenCalledWith('/users/sign_out')
    expect(localStorage.getItem('token')).toBeNull()
    expect(sessionStorage.getItem('token')).toBeNull()
    expect(axios.defaults.headers.common.Authorization).toBeUndefined()
    expect(s.getters['sessionStore/currentUser']).toBeNull()
    expect(s.getters['sessionStore/getOriginalUser']).toBeNull()
    expect(location.href).toBe('/connexion')
  })

  it('switch_to et switch_back : prennent l’identité puis la rendent, et suivent la redirection de l’API', async () => {
    const s = session()
    axios.get.mockResolvedValueOnce({ data: { current_user: { id: 5 }, original_user: { id: 1 }, redirect_to: '/feed' } })
    s.dispatch('sessionStore/switch_to', 5)
    await new Promise(r => setTimeout(r, 0))
    expect(axios.get).toHaveBeenCalledWith('/api/switch/5')
    expect(s.getters['sessionStore/currentUser']).toEqual({ id: 5 })
    expect(s.getters['sessionStore/getOriginalUser']).toEqual({ id: 1 })
    expect(location.href).toBe('/feed')

    axios.get.mockResolvedValueOnce({ data: { current_user: { id: 1 }, redirect_to: '/admin/users' } })
    s.dispatch('sessionStore/switch_back')
    await new Promise(r => setTimeout(r, 0))
    expect(axios.get).toHaveBeenCalledWith('/api/switch_back')
    expect(s.getters['sessionStore/currentUser']).toEqual({ id: 1 })
    expect(s.getters['sessionStore/getOriginalUser']).toBeNull()
    expect(location.href).toBe('/admin/users')
  })

  it('storeDeviceToken, password_recovery, password_reset : bons appels, erreurs propagées', async () => {
    const s = session()
    axios.post.mockResolvedValue({ data: { status: 200 } })
    axios.put.mockResolvedValue({ data: { status: 200 } })
    await s.dispatch('sessionStore/storeDeviceToken', { token: 't', platform: 'web' })
    expect(axios.post).toHaveBeenLastCalledWith('/api/device_tokens', { token: 't', platform: 'web' })
    await s.dispatch('sessionStore/password_recovery', { user: { email: 'a@b.fr' } })
    expect(axios.post).toHaveBeenLastCalledWith('/users/password', { user: { email: 'a@b.fr' } })
    await s.dispatch('sessionStore/password_reset', { user: { password: 'x' } })
    expect(axios.put).toHaveBeenLastCalledWith('/users/password', { user: { password: 'x' } })

    const err = { response: { status: 422 } }
    axios.post.mockRejectedValue(err)
    axios.put.mockRejectedValue(err)
    await expect(s.dispatch('sessionStore/storeDeviceToken', {})).rejects.toBe(err)
    await expect(s.dispatch('sessionStore/password_recovery', {})).rejects.toBe(err)
    await expect(s.dispatch('sessionStore/password_reset', {})).rejects.toBe(err)
  })

  it('setSubdomain : mémorise l’espace courant', () => {
    const s = session()
    s.commit('sessionStore/setSubdomain', 'admin')
    expect(s.getters['sessionStore/subdomain']).toBe('admin')
  })
})

describe('menuStore : menu de l’espace courant', () => {
  beforeEach(() => vi.clearAllMocks())

  it('charge le menu de l’espace et le rejette en cas d’erreur', async () => {
    const s = moduleStore(menuStore, 'menuStore')
    const menu = [{ header: 'Administration' }, { title: 'Régions', to: '/admin/regions', icon: 'mdi-map' }]
    axios.get.mockResolvedValueOnce({ data: menu })
    await s.dispatch('menuStore/getMenu', 'admin')
    expect(axios.get).toHaveBeenCalledWith('/api/menus/admin', {})
    expect(s.getters['menuStore/getMenu']).toEqual(menu)

    axios.get.mockRejectedValueOnce(new Error('401'))
    await expect(s.dispatch('menuStore/getMenu', 'me')).rejects.toThrow('401')
    expect(s.getters['menuStore/getMenu']).toEqual(menu)
  })
})
