// Utilitaires des tests des écrans membres (fil d'actus, profil, annuaire, connexion…)
import { vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import sessionStore from '@/store/modules/sessionStore'
import usersStore from '@/store/modules/usersStore'
import eventsStore from '@/store/modules/eventsStore'
import feedStore from '@/store/modules/feedStore'
import feedEventStore from '@/store/modules/feedEventStore'
import profileStore from '@/store/modules/profileStore'
import postsStore from '@/store/modules/postsStore'
import { vuetify, store, flush } from '../helpers.js'

export { flush }

// Le store réel ; postsStore n'y est pas enregistré (seuls components/Posts/{Index,Form}.vue l'utilisent) :
// on l'ajoute pour pouvoir tester ces écrans.
export function memberStore({ withPosts = false } = {}) {
  const s = store()
  if (withPosts) s.registerModule('postsStore', postsStore)
  // profileStore déclare son état comme un objet (pas une fonction) : il est partagé entre stores, on le remet à zéro
  s.commit('profileStore/setProfile', {})
  ;['setGratitudes', 'setFees', 'setPresidences', 'setPhases', 'setResponsabilities', 'setRoles']
    .forEach(m => s.commit('profileStore/' + m, []))
  return s
}

// Monte un composant avec Vuetify, le store, $route / $router simulés, et $root.showSnackbar espionné
export function mountMember(Component, { props, s = memberStore(), route = { params: {}, query: {} }, stubs = {}, attach = true } = {}) {
  const router = { push: vi.fn() }
  const wrapper = mount(Component, {
    props,
    attachTo: attach ? document.body : undefined,
    global: {
      plugins: [vuetify(), s],
      mocks: { $route: route, $router: router },
      stubs: { RouterLink: true, ...stubs },
    },
  })
  wrapper.vm.$root.showSnackbar = vi.fn()
  return { wrapper, router, store: s, snackbar: wrapper.vm.$root.showSnackbar }
}

// Texte visible dans la page (dialogues Vuetify compris, montés dans document.body)
export const pageText = () => document.body.textContent.replace(/\s+/g, ' ')

export const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const buttonByText = (label) =>
  [...document.querySelectorAll('button, a.v-btn')].find(b => b.textContent.replace(/\s+/g, ' ').trim() === label)
