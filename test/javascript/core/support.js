// Utilitaires des tests du socle front (formulaires génériques, tableaux, stores, coquille)
import { createStore } from 'vuex'
import i18n from '@/i18n/index.js'
import { vuetify, store } from '../helpers.js'

// Les libellés de la config serveur (« Nom », « Logo »…) ne sont pas des clés i18n : pas d'avertissement
i18n.global.missingWarn = false
i18n.global.fallbackWarn = false

// jsdom ne fournit pas matchMedia (tableaux Vuetify, App.vue) : version « écran large » par défaut
if (typeof window.matchMedia !== 'function') {
  window.matchMedia = (query) => ({
    matches: false, media: query, onchange: null,
    addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent() { return false },
  })
}

export { i18n }

// Texte normalisé (espaces multiples réduits)
export const squash = (s) => (s || '').replace(/\s+/g, ' ').trim()

// Texte de tout le document : les dialogues et menus Vuetify sont téléportés dans document.body
export const bodyText = () => squash(document.body.textContent)

// Store Vuex réduit à un seul module, pour tester un module isolément
export const moduleStore = (module, name = 'm') => createStore({ modules: { [name]: module } })

// Options de montage communes : Vuetify, i18n, store réel (état neuf)
export const globalOptions = (s = store(), extra = {}) => ({
  plugins: [vuetify(), i18n, s],
  ...extra,
})

// Remplace window.location (jsdom ne sait pas naviguer) ; renvoie l'objet pour lire href
export function stubLocation(pathname = '/') {
  const location = { href: 'http://localhost' + pathname, pathname, origin: 'http://localhost' }
  Object.defineProperty(window, 'location', { value: location, configurable: true, writable: true })
  return location
}

// Réponse d'erreur axios typique
export const axiosError = (data = {}, status = 422) => ({ response: { status, data } })

// Contenu d'un FormData sous forme de liste [clé, valeur]
export const formDataEntries = (fd) => Array.from(fd.entries()).map(([k, v]) => [k, v instanceof File ? `File(${v.name})` : v])
