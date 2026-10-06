// Utilitaires partagés par les tests des écrans d'administration
import { vi, afterEach } from 'vitest'
import { mount, enableAutoUnmount } from '@vue/test-utils'
import i18n from '@/i18n/index.js'
import { vuetify, store, flush } from '../helpers.js'

export { flush }

// jsdom ne fournit pas matchMedia, utilisé par VSwitch
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false, media: query, onchange: null,
    addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent() { return false },
  })
}

// Démonte les composants (et leurs dialogues téléportés) après chaque test
enableAutoUnmount(afterEach)
afterEach(() => {
  document.body.innerHTML = ''
})

// Store réel de l'application
export function adminStore() {
  return store()
}

// Monte un écran avec Vuetify, le store, i18n et des mocks de $route / $router.
// $root.showSnackbar est remplacé par un espion (renvoyé dans `snackbar`).
export function mountAdmin(component, { props = {}, store: s = adminStore(), route = { params: {} }, router, stubs = {} } = {}) {
  const $router = router || { push: vi.fn(() => Promise.resolve()) }
  const snackbar = vi.fn()
  const wrapper = mount(component, {
    props,
    attachTo: document.body,
    global: {
      plugins: [vuetify(), s, i18n],
      mocks: { $route: route, $router },
      stubs,
    },
  })
  wrapper.vm.$root.showSnackbar = snackbar
  return { wrapper, store: s, snackbar, router: $router }
}

// Texte normalisé (espaces compactés)
export const text = (node) => (node.text ? node.text() : node.textContent).replace(/\s+/g, ' ').trim()

// Texte de la page entière (dialogues compris, montés dans document.body)
export const pageText = () => document.body.textContent.replace(/\s+/g, ' ')

// Bouton du DOM (dialogues compris) dont le texte ou l'aria-label correspond
export function button(label, root = document.body) {
  const buttons = [...root.querySelectorAll('button, .v-list-item, a.v-btn')]
  const found = buttons.find(b => b.textContent.replace(/\s+/g, ' ').trim() === label || b.getAttribute('aria-label') === label)
    || buttons.find(b => b.textContent.replace(/\s+/g, ' ').includes(label))
  if (!found) {
    throw new Error(`Bouton « ${label} » introuvable`)
  }
  return found
}

// Clique un bouton (par libellé) puis laisse le rendu et les promesses se terminer
export async function click(label, root = document.body) {
  button(label, root).click()
  await flush()
  await flush()
}

// Saisie dans un champ Vuetify repéré par son libellé
export async function fill(label, value, root = document.body) {
  const labels = [...root.querySelectorAll('label')]
  const lab = labels.find(l => l.textContent.replace(/\s+/g, ' ').trim().startsWith(label))
  if (!lab) {
    throw new Error(`Champ « ${label} » introuvable`)
  }
  const field = lab.closest('.v-field, .v-input')
  const input = field.querySelector('input, textarea')
  input.value = value
  input.dispatchEvent(new Event('input'))
  await flush()
}

// Réponse d'erreur axios comme celles des contrôleurs Rails
export const apiError = (errors = ['Nom doit être rempli(e)'], status = 422) => {
  const error = new Error('Request failed')
  error.response = { status, data: { errors } }
  return error
}

// Simule axios.get en fonction de l'URL : { '/api/x': data, ... } ; les URL inconnues renvoient {}
export function routeGet(axios, routes) {
  axios.get.mockImplementation((url) => {
    const key = Object.keys(routes).find(k => url === k) ?? Object.keys(routes).find(k => url.startsWith(k))
    const value = key !== undefined ? routes[key] : {}
    if (value instanceof Error) {
      return Promise.reject(value)
    }
    // copie : les mutations du store ne doivent pas modifier les jeux de données des tests
    return Promise.resolve({ data: JSON.parse(JSON.stringify(typeof value === 'function' ? value(url) : value)) })
  })
}

// Contenu du dialogue Vuetify ouvert au premier plan
export function dialog() {
  const all = [...document.querySelectorAll('.v-dialog.v-overlay--active .v-overlay__content')]
  if (!all.length) {
    throw new Error('Aucun dialogue ouvert')
  }
  return all[all.length - 1]
}
