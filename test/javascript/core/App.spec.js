import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import axios from 'axios'
import { getToken, onMessage, isSupported, getMessaging } from 'firebase/messaging'
import App from '@/components/App.vue'
import { store, flush } from '../helpers.js'
import { globalOptions, squash, bodyText, stubLocation } from './support.js'

vi.mock('axios')
vi.mock('firebase/app', () => ({ initializeApp: vi.fn(() => ({ name: 'funadf' })) }))
vi.mock('firebase/messaging', () => ({
  getMessaging: vi.fn(() => ({ messaging: true })),
  getToken: vi.fn(),
  onMessage: vi.fn(),
  isSupported: vi.fn(),
}))

const originalLocation = window.location
const originalMatchMedia = window.matchMedia
const bell = { template: '<div class="bell-stub" />' }
const stubs = { NotificationBell: bell, NotificationsBell: bell, UserForm: { template: '<div class="user-form-stub">Fiche utilisateur</div>' } }

const user = { id: 42, firstname: 'Paul', lastname: 'MARTIN', email: 'paul@add.fr' }
const menu = [{ header: 'Administration' }, { title: 'Régions', icon: 'mdi-map', to: '/admin/regions' }]

function api() {
  axios.get.mockImplementation((url) => {
    if (url === '/api/current_user') return Promise.resolve({ data: { user, region: null, roles: ['admin'], original_user: null } })
    if (url.startsWith('/api/menus/')) return Promise.resolve({ data: menu })
    return Promise.resolve({ data: {} })
  })
  axios.post.mockResolvedValue({ data: { status: 200 } })
}

let mediaListeners
function stubMatchMedia(matches) {
  mediaListeners = { add: vi.fn(), remove: vi.fn() }
  window.matchMedia = vi.fn(() => ({ matches, addEventListener: mediaListeners.add, removeEventListener: mediaListeners.remove }))
}

async function mountApp(path = '/admin/regions') {
  stubLocation(path)
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/admin/regions', component: { template: '<div class="page">Page des régions</div>' }, meta: { title: 'Régions' } },
      { path: '/feed', component: { template: '<div class="page">Fil</div>' } },
      { path: '/connexion', component: { template: '<div class="page">Formulaire de connexion</div>' }, meta: { title: 'Connexion', auth: true } },
      { path: '/privacy', component: { template: '<div />' } },
    ],
  })
  router.push(path)
  await router.isReady()
  const s = store()
  const wrapper = mount(App, {
    attachTo: document.body,
    global: { ...globalOptions(s, { stubs }), plugins: [...globalOptions(s).plugins, router] },
  })
  await flush()
  await flush()
  return { wrapper, s, router }
}

describe('App : coquille de l’application', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    api()
    stubMatchMedia(false)
    isSupported.mockResolvedValue(true)
    getMessaging.mockReturnValue({ messaging: true })
    global.Notification = { permission: 'default', requestPermission: vi.fn() }
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })
  afterEach(() => {
    document.body.innerHTML = ''
    Object.defineProperty(window, 'location', { value: originalLocation, configurable: true, writable: true })
    window.matchMedia = originalMatchMedia
    delete global.Notification
  })

  it('au démarrage : charge l’utilisateur et le menu de l’espace déduit de l’URL', async () => {
    const { s } = await mountApp('/admin/regions')
    expect(axios.get).toHaveBeenCalledWith('/api/current_user')
    expect(axios.get).toHaveBeenCalledWith('/api/menus/admin', {})
    expect(s.getters['sessionStore/currentUser']).toEqual(user)
    expect(s.getters['menuStore/getMenu']).toEqual(menu)
    // le menu est rechargé quand l'utilisateur courant change (connexion, prise d'identité)
    expect(axios.get.mock.calls.filter(c => c[0] === '/api/menus/admin')).toHaveLength(2)
  })

  it.each([
    ['/association/members', 'association'],
    ['/region/events', 'region'],
    ['/feed', 'me'],
  ])('espace déduit de %s : %s', async (path, subdomain) => {
    await mountApp(path)
    expect(axios.get).toHaveBeenCalledWith('/api/menus/' + subdomain, {})
  })

  it('page normale : barre latérale, en-tête avec le titre de la page, contenu et pied de page', async () => {
    const { wrapper } = await mountApp('/admin/regions')
    expect(wrapper.find('h1').text()).toBe('Régions')
    expect(wrapper.find('.page').text()).toBe('Page des régions')
    expect(wrapper.find('.v-navigation-drawer').exists()).toBe(true)
    expect(squash(wrapper.find('.app-footer').text())).toContain('Assemblées de Dieu de France – Tous droits réservés')
    expect(wrapper.find('.app-footer a').attributes('href')).toBe('/privacy')
    expect(squash(wrapper.text())).toContain('Régions')
  })

  it('page d’authentification : ni menu ni en-tête, juste la marque et le formulaire', async () => {
    const { wrapper } = await mountApp('/connexion')
    expect(wrapper.find('.auth-main').exists()).toBe(true)
    expect(wrapper.find('img.auth-logo').attributes('alt')).toBe('ADD+')
    expect(wrapper.find('.page').text()).toBe('Formulaire de connexion')
    expect(wrapper.find('.v-navigation-drawer').exists()).toBe(false)
    expect(wrapper.find('header').exists()).toBe(false)
    expect(squash(wrapper.find('.app-footer--auth').text())).toContain('Mentions légales')
  })

  it('page sans titre : en-tête sans h1', async () => {
    const { wrapper } = await mountApp('/feed')
    expect(wrapper.find('h1').exists()).toBe(false)
  })

  it('showSnackbar : affiche titre, message (HTML) et couleur, puis se ferme', async () => {
    const { wrapper } = await mountApp()
    wrapper.vm.showSnackbar('Nom déjà pris<br/>Ville inconnue', 'error', 'Enregistrement impossible')
    await flush()
    const snackbar = document.querySelector('.v-snackbar')
    expect(squash(snackbar.textContent)).toContain('Enregistrement impossible')
    expect(snackbar.innerHTML).toContain('Nom déjà pris<br>Ville inconnue')
    expect(snackbar.querySelector('.bg-error')).not.toBeNull()
    snackbar.querySelector('button[aria-label="Fermer le message"]').click()
    await flush()
    expect(wrapper.vm.snackbar.show).toBe(false)
  })

  it('le bouton menu de l’en-tête ouvre et ferme la barre latérale', async () => {
    const { wrapper } = await mountApp()
    expect(wrapper.vm.showSidebar).toBe(true) // écran large
    await wrapper.find('button[aria-label="Afficher ou masquer le menu"]').trigger('click')
    expect(wrapper.vm.showSidebar).toBe(false)
  })

  it('petit écran : barre latérale fermée, et elle suit les changements de taille', async () => {
    stubMatchMedia(true)
    const { wrapper } = await mountApp()
    expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 767px)')
    expect(wrapper.vm.isMobile).toBe(true)
    expect(wrapper.vm.showSidebar).toBe(false)
    const handler = mediaListeners.add.mock.calls[0][1]
    expect(mediaListeners.add.mock.calls[0][0]).toBe('change')
    handler({ matches: false })
    expect(wrapper.vm.showSidebar).toBe(true)
    handler({ matches: true })
    expect(wrapper.vm.showSidebar).toBe(false)
    wrapper.unmount()
    expect(mediaListeners.remove).toHaveBeenCalledWith('change', handler)
  })

  it('la fiche utilisateur s’ouvre en plein écran quand usersStore le demande', async () => {
    const { s } = await mountApp()
    s.commit('usersStore/setDialogForm', true)
    await flush()
    expect(bodyText()).toContain('Fiche utilisateur')
    expect(document.querySelector('.v-dialog--fullscreen')).not.toBeNull()
  })

  it('notifications reçues au premier plan : affichées dans le message flottant', async () => {
    await mountApp()
    expect(onMessage).toHaveBeenCalledWith({ messaging: true }, expect.any(Function))
    const callback = onMessage.mock.calls[0][1]
    callback({ notification: { title: 'Nouvelle actu', body: 'AG le 12 mars', image: '/img.png' } })
    await flush()
    expect(bodyText()).toContain('Nouvelle actu')
    expect(bodyText()).toContain('AG le 12 mars')
  })

  it('navigateur sans notifications : pas de cloche', async () => {
    isSupported.mockResolvedValue(false)
    const { wrapper } = await mountApp()
    expect(console.warn).toHaveBeenCalledWith('Notifications not supported in this browser.')
    expect(wrapper.vm.showBell).toBe(false)
    expect(wrapper.find('.notification-button').exists()).toBe(false)
  })

  it('permission déjà accordée ou refusée : pas de cloche', async () => {
    global.Notification.permission = 'granted'
    const { wrapper } = await mountApp()
    expect(wrapper.find('.notification-button').exists()).toBe(false)
  })

  it('activer les notifications : enregistre le jeton de l’appareil (web) et confirme', async () => {
    Notification.requestPermission.mockResolvedValue('granted')
    getToken.mockResolvedValue('jeton-fcm')
    const { wrapper } = await mountApp()
    const button = wrapper.find('.notification-button')
    expect(button.attributes('aria-label')).toBe('Activer les notifications sur ce navigateur')
    await button.trigger('click')
    await flush()
    await flush()
    expect(getToken).toHaveBeenCalledWith({ messaging: true }, { vapidKey: expect.any(String) })
    expect(axios.post).toHaveBeenCalledWith('/api/device_tokens', { token: 'jeton-fcm', user_id: 42, platform: 'web' })
    expect(bodyText()).toContain('Notifications activées avec succès')
    expect(wrapper.find('.notification-button').exists()).toBe(false)
  })

  it('activer les notifications : permission refusée', async () => {
    Notification.requestPermission.mockResolvedValue('denied')
    const { wrapper } = await mountApp()
    await wrapper.vm.askNotification()
    await flush()
    expect(getToken).not.toHaveBeenCalled()
    expect(wrapper.vm.snackbar).toMatchObject({ message: 'Permission refusée pour les notifications', color: 'error' })
    expect(wrapper.vm.showBell).toBe(false)
  })

  it('activer les notifications : aucun jeton, ou erreur Firebase', async () => {
    Notification.requestPermission.mockResolvedValue('granted')
    getToken.mockResolvedValueOnce(null)
    const { wrapper } = await mountApp()
    await wrapper.vm.askNotification()
    expect(wrapper.vm.snackbar).toMatchObject({ message: 'Aucun token généré', color: 'error' })
    expect(axios.post).not.toHaveBeenCalled()

    getToken.mockRejectedValueOnce(new Error('messaging/permission-blocked'))
    await wrapper.vm.askNotification()
    expect(wrapper.vm.snackbar).toMatchObject({ message: 'Erreur lors de l\'enregistrement du token', color: 'error' })
    expect(wrapper.vm.showBell).toBe(false)
  })
})
