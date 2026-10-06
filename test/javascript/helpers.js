import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createStore } from 'vuex'
import sessionStore from '@/store/modules/sessionStore'
import usersStore from '@/store/modules/usersStore'
import campaignsStore from '@/store/modules/campaignsStore'
import menuStore from '@/store/modules/menuStore'
import eventsStore from '@/store/modules/eventsStore'
import votesStore from '@/store/modules/votesStore'
import feedStore from '@/store/modules/feedStore'
import feedEventStore from '@/store/modules/feedEventStore'
import rolesStore from '@/store/modules/rolesStore'
import profileStore from '@/store/modules/profileStore'
import documentsStore from '@/store/modules/documentsStore'
import pushNotificationsStore from '@/store/modules/pushNotificationsStore'
import createCrudStore from '@/store/modules/crudStore'

export const vuetify = () => createVuetify({ components, directives })

// Même composition que app/frontend/store/index.js, avec un état neuf à chaque appel
export const store = () => createStore({
  modules: {
    sessionStore, usersStore, campaignsStore, menuStore, eventsStore, votesStore, feedStore,
    feedEventStore, rolesStore, profileStore, documentsStore, pushNotificationsStore,
    regions: createCrudStore({ resource: 'regions' }),
    churches: createCrudStore({ resource: 'churches' }),
    associations: createCrudStore({ resource: 'associations' }),
    posts: createCrudStore({ resource: 'posts' }),
    fees: createCrudStore({ resource: 'fees' }),
  },
})

// Laisse les promesses (axios simulé, dispatch) et le rendu se terminer
export const flush = () => new Promise(resolve => setTimeout(resolve, 0))
