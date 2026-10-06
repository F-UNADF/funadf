import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, defineComponent } from 'vue'
import { createRouter, createMemoryHistory } from 'vue-router'
import { VLayout } from 'vuetify/components'
import axios from 'axios'
import Header from '@/components/Layout/Header.vue'
import Sidebar from '@/components/Layout/Sidebar.vue'
import { store, flush } from '../../helpers.js'
import { globalOptions, squash, bodyText, stubLocation } from '../support.js'

vi.mock('axios')

const originalLocation = window.location
const bell = { template: '<div class="bell-stub" />' }
const stubs = { NotificationBell: bell, NotificationsBell: bell }

// v-app-bar et v-navigation-drawer doivent être dans une mise en page Vuetify
function inLayout(component, props, listeners = {}) {
  return defineComponent({
    render() { return h(VLayout, null, () => h(component, { ...props, ...listeners, ref: 'inner' })) },
  })
}

const makeRouter = () => createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/:pathMatch(.*)*', component: { render: () => null } }],
})

describe('Header : barre du haut', () => {
  let s
  const user = { id: 42, firstname: 'Paul', lastname: 'MARTIN', email: 'paul@add.fr', fullname: 'Paul MARTIN' }

  function mountHeader(props, listeners) {
    s = store()
    const wrapper = mount(inLayout(Header, props, listeners), { attachTo: document.body, global: globalOptions(s, { stubs }) })
    return wrapper
  }

  beforeEach(() => {
    vi.resetAllMocks()
    stubLocation('/feed')
  })
  afterEach(() => {
    document.body.innerHTML = ''
    Object.defineProperty(window, 'location', { value: originalLocation, configurable: true, writable: true })
  })

  it('affiche le titre de la page et la cloche des notifications', () => {
    const wrapper = mountHeader({ user, title: 'Régions' })
    expect(wrapper.find('h1').text()).toBe('Régions')
    expect(wrapper.find('.bell-stub').exists()).toBe(true)
  })

  it('sans titre : pas de h1', () => {
    const wrapper = mountHeader({ user: null })
    expect(wrapper.find('h1').exists()).toBe(false)
    expect(wrapper.find('button[aria-label="Mon compte"] .mdi-account').exists()).toBe(true)
  })

  it('le bouton menu demande l’ouverture ou la fermeture de la barre latérale', async () => {
    const onToggle = vi.fn()
    const wrapper = mountHeader({ user }, { onToggleSidebar: onToggle })
    await wrapper.find('button[aria-label="Afficher ou masquer le menu"]').trigger('click')
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('« Revenir à » n’apparaît qu’en cas de prise d’identité, et rend l’identité', async () => {
    let wrapper = mountHeader({ user })
    const back = () => wrapper.findAll('button').find(b => squash(b.text()).startsWith('Revenir à'))
    expect(back().isVisible()).toBe(false)

    document.body.innerHTML = ''
    wrapper = mountHeader({ user, ouser: { id: 1, firstname: 'Admin' } })
    expect(squash(back().text())).toBe('Revenir à Admin')
    expect(back().isVisible()).toBe(true)
    axios.get.mockResolvedValue({ data: { current_user: { id: 1 }, redirect_to: '/admin/users' } })
    await back().trigger('click')
    await flush()
    expect(axios.get).toHaveBeenCalledWith('/api/switch_back')
    expect(window.location.href).toBe('/admin/users')
  })

  it('menu du compte : identité, numéro d’adhérent, avatar, modification du profil et déconnexion', async () => {
    const wrapper = mountHeader({ user })
    const account = wrapper.find('button[aria-label="Mon compte"]')
    expect(account.find('img').exists() || account.find('.v-img').exists()).toBe(true)
    await account.trigger('click')
    await flush()
    expect(bodyText()).toContain('Paul MARTIN')
    expect(bodyText()).toContain('paul@add.fr')
    expect(bodyText()).toContain('N° 00042')

    axios.get.mockResolvedValue({ data: { user } })
    Array.from(document.querySelectorAll('.v-overlay--active button')).find(b => squash(b.textContent) === 'Modifier mon profil').click()
    await flush()
    expect(axios.get).toHaveBeenCalledWith('/api/users/42', {})
    expect(s.state.usersStore.dialogForm).toBe(true)

    axios.delete.mockResolvedValue({})
    await account.trigger('click')
    await flush()
    Array.from(document.querySelectorAll('.v-overlay button')).find(b => squash(b.textContent) === 'Se déconnecter').click()
    await flush()
    expect(axios.delete).toHaveBeenCalledWith('/users/sign_out')
    expect(window.location.href).toBe('/connexion')
  })

  it('numéro d’adhérent : complété à 5 chiffres', () => {
    const wrapper = mountHeader({ user })
    const header = wrapper.findComponent(Header)
    expect(header.vm.zeroPad(7)).toBe('00007')
    expect(header.vm.zeroPad(123456)).toBe('123456')
  })
})

describe('Sidebar : menu de l’espace courant', () => {
  // Menu tel que le renvoie GET /api/menus/:subdomain
  const menu = [
    { header: 'Administration' },
    { title: 'Régions', icon: 'mdi-map', to: '/admin/regions' },
    { title: 'Votes', icon: 'mdi-vote', to: '/campaigns', new_tab: true },
    { title: 'Archivate', icon: 'mdi-archive', href: 'https://archivate.example.org' },
    { title: 'Site ADD', icon: 'mdi-web', href: 'https://add.example.org', new_tab: true },
    { title: 'Structures', icon: 'mdi-domain', children: [
      { title: 'Églises', to: '/admin/churches' },
      { title: 'Associations', to: '/admin/associations' },
    ] },
  ]

  async function mountSidebar(props, listeners) {
    const router = makeRouter()
    router.push('/admin/regions')
    await router.isReady()
    const wrapper = mount(inLayout(Sidebar, props, listeners), {
      attachTo: document.body,
      global: globalOptions(store(), { plugins: [...globalOptions().plugins, router] }),
    })
    await flush()
    return { wrapper, router }
  }

  afterEach(() => { document.body.innerHTML = '' })

  it('affiche logo, en-têtes, liens internes et externes', async () => {
    const { wrapper } = await mountSidebar({ menu, showSidebar: true })
    expect(wrapper.find('img[alt="Logo ADD+"]').exists()).toBe(true)
    expect(wrapper.find('.sidebar-header').text()).toBe('Administration')
    const links = wrapper.findAll('a.v-list-item').map(a => [squash(a.text()), a.attributes('href')])
    expect(links).toEqual(expect.arrayContaining([
      ['Régions', '/admin/regions'],
      ['Votes', '/campaigns'],
      ['Archivate', 'https://archivate.example.org'],
      ['Site ADD', 'https://add.example.org'],
    ]))
    // pastille « nouveau » sur les entrées new_tab
    expect(wrapper.findAll('.v-badge')).toHaveLength(2)
    // l'entrée de la page courante est active
    expect(wrapper.findAll('a.v-list-item--active').map(a => squash(a.text()))).toContain('Régions')
  })

  it('un groupe déplie ses sous-entrées', async () => {
    const { wrapper } = await mountSidebar({ menu, showSidebar: true })
    const group = wrapper.findAll('.v-list-group .v-list-item').find(i => squash(i.text()) === 'Structures')
    await group.trigger('click')
    await flush()
    const sub = wrapper.findAll('.first-level-item').map(i => [squash(i.text()), i.attributes('href')])
    expect(sub).toEqual([['Églises', '/admin/churches'], ['Associations', '/admin/associations']])
  })

  it('menu vide : pas d’entrée', async () => {
    const { wrapper } = await mountSidebar({ showSidebar: true })
    expect(wrapper.findAll('.v-list-item')).toHaveLength(0)
  })

  it('mobile : tiroir temporaire ; sa fermeture est remontée au parent', async () => {
    const onUpdate = vi.fn()
    const { wrapper } = await mountSidebar({ menu, showSidebar: true, isMobile: true }, { 'onUpdate:showSidebar': onUpdate })
    expect(wrapper.find('.v-navigation-drawer--temporary').exists()).toBe(true)
    wrapper.findComponent(Sidebar).vm.sidebarValue = false
    expect(onUpdate).toHaveBeenCalledWith(false)
  })
})
