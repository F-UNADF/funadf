import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createStore } from 'vuex'
import votesStore from '@/store/modules/votesStore.js'

export const vuetify = () => createVuetify({ components, directives })

export const store = () => createStore({ modules: { votesStore } })

// Laisse les promesses (axios simulé, dispatch) et le rendu se terminer
export const flush = () => new Promise(resolve => setTimeout(resolve, 0))
