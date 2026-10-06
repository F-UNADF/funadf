// Composition du store de l'application (store/index.js)
import { describe, it, expect } from 'vitest'
import appStore from '@/store/index.js'
import profileStore from '@/store/modules/profileStore'
import { moduleStore } from '../support.js'

describe('store/index.js : composition du store de l’application', () => {
  it('enregistre les modules métier et un crudStore par ressource d’admin', () => {
    for (const name of ['sessionStore', 'usersStore', 'campaignsStore', 'menuStore', 'eventsStore', 'votesStore',
      'feedStore', 'feedEventStore', 'rolesStore', 'profileStore', 'documentsStore', 'pushNotificationsStore',
      'regions', 'churches', 'associations', 'posts', 'fees']) {
      expect(appStore.hasModule(name)).toBe(true)
    }
    expect(appStore.getters['regions/getItems']).toEqual([])
    expect(appStore.getters['menuStore/getMenu']).toEqual([])
  })

  it('profileStore : deux stores n’ont pas le même état', () => {
    const a = moduleStore(profileStore)
    const b = moduleStore(profileStore)
    a.commit('m/setProfile', { id: 1 })
    expect(b.getters['m/getProfile']).toEqual({})
  })
})
