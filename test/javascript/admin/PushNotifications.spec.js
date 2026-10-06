import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import PushNotificationsIndex from '@/components/PushNotifications/Index.vue'
import PushNotificationForm from '@/components/PushNotifications/Form.vue'
import { mountAdmin, flush, click, fill, pageText, apiError, text, dialog } from './support.js'

vi.mock('axios')

const notifications = [
  { id: 1, title: 'Convention nationale', body: 'Les inscriptions sont ouvertes', url: '/evenements/4' },
  { id: 2, title: 'Prière', body: 'Réunion de prière jeudi', url: null },
]

async function mountIndex(items = notifications) {
  axios.get.mockResolvedValue({ data: items })
  const mounted = mountAdmin(PushNotificationsIndex)
  await flush()
  return mounted
}

describe('Notifications push : liste', () => {
  beforeEach(() => vi.resetAllMocks())

  it('charge les notifications rédigées et les affiche', async () => {
    const { wrapper } = await mountIndex()
    expect(axios.get).toHaveBeenCalledWith('/api/push_notifications', {})
    expect(text(wrapper)).toContain('Convention nationale')
    expect(text(wrapper)).toContain('Les inscriptions sont ouvertes')
    expect(text(wrapper)).toContain('Prière')
  })

  it('sans notification : invite à en rédiger une', async () => {
    const { wrapper } = await mountIndex([])
    expect(text(wrapper)).toContain('Aucune notification rédigée pour le moment')
    await click('Rédiger une notification', wrapper.find('.list-empty').element)
    expect(text(dialog())).toContain('Ajouter une notification')
  })

  it('une recherche sans résultat propose de l’effacer', async () => {
    const { wrapper } = await mountIndex()
    await wrapper.find('input').setValue('zzz')
    await flush()
    expect(text(wrapper)).toContain('Aucune notification ne correspond à « zzz »')
    await click('Effacer la recherche')
    expect(wrapper.vm.search).toBe('')
    expect(text(wrapper)).toContain('Convention nationale')
  })

  it('le bouton Actualiser recharge la liste', async () => {
    const { wrapper } = await mountIndex()
    axios.get.mockClear()
    await click('Actualiser la liste')
    expect(axios.get).toHaveBeenCalledWith('/api/push_notifications', {})
  })
})

describe('Notifications push : rédaction et modification', () => {
  beforeEach(() => vi.resetAllMocks())

  it('rédige une nouvelle notification : POST /api/push_notifications avec push_notification', async () => {
    const { wrapper, snackbar } = await mountIndex()
    await click('Rédiger une notification')
    expect(text(dialog())).toContain('Ajouter une notification')

    const form = dialog()
    await fill('Titre', 'Assemblée générale', form)
    await fill('Message', 'Rendez-vous samedi', form)
    await fill('Url', '/campaigns/3', form)

    axios.post.mockResolvedValue({ data: { id: 3, title: 'Assemblée générale' } })
    await click('Enregistrer', form)

    expect(axios.post).toHaveBeenCalledWith('/api/push_notifications', {
      push_notification: { title: 'Assemblée générale', body: 'Rendez-vous samedi', url: '/campaigns/3' },
    })
    expect(snackbar).toHaveBeenCalledWith('Notification enregistrée avec succès', 'success')
    expect(wrapper.vm.$store.state.pushNotificationsStore.dialogForm).toBe(false)
    // la liste est rechargée à la fermeture
    expect(axios.get).toHaveBeenLastCalledWith('/api/push_notifications', {})
  })

  it('modifie une notification existante : formulaire prérempli puis PATCH, sans créer de doublon', async () => {
    const { snackbar } = await mountIndex()
    await click('Modifier la notification')
    await flush()

    const form = dialog()
    expect(text(form)).toContain('Modifier une notification')
    expect(form.querySelector('input').value).toBe('Convention nationale')

    await fill('Titre', 'Convention 2027', form)
    axios.patch.mockResolvedValue({ data: { id: 1, title: 'Convention 2027' } })
    await click('Enregistrer', form)

    expect(axios.post).not.toHaveBeenCalled()
    expect(axios.patch).toHaveBeenCalledWith('/api/push_notifications/1', expect.objectContaining({
      push_notification: expect.objectContaining({ id: 1, title: 'Convention 2027', body: 'Les inscriptions sont ouvertes' }),
    }))
    expect(snackbar).toHaveBeenCalledWith('Notification enregistrée avec succès', 'success')
  })

  it('affiche les erreurs de validation renvoyées par Rails', async () => {
    const { snackbar } = await mountIndex()
    await click('Rédiger une notification')
    axios.post.mockRejectedValue(apiError(['Title doit être rempli(e)']))
    await click('Enregistrer', dialog())

    expect(snackbar).toHaveBeenCalledWith('Un probleme est survenu lors de l\'enregistrement de la notification', 'error')
    expect(snackbar).toHaveBeenCalledWith('Title doit être rempli(e)', 'error')
  })

  it('Annuler ferme le formulaire', async () => {
    const { wrapper } = await mountIndex()
    await click('Rédiger une notification')
    await click('Annuler', dialog())
    expect(wrapper.vm.$store.state.pushNotificationsStore.dialogForm).toBe(false)
  })

  it('le formulaire seul affiche un titre selon le cas (ajout / modification)', async () => {
    const { wrapper, store } = mountAdmin(PushNotificationForm)
    store.commit('pushNotificationsStore/setItem', { id: null })
    await flush()
    expect(text(wrapper)).toContain('Ajouter une notification')
    expect(wrapper.vm.getIsoDate('2026-10-06T10:00:00')).toBe('2026-10-06')
  })
})

describe('Notifications push : envoi avec confirmation', () => {
  beforeEach(() => vi.resetAllMocks())

  it('demande confirmation puis envoie la notification', async () => {
    const { wrapper, snackbar } = await mountIndex()
    await click('Envoyer la notification')

    expect(pageText()).toContain('Envoyer la notification ?')
    expect(pageText()).toContain('L’envoi ne peut pas être annulé')
    expect(axios.post).not.toHaveBeenCalled()

    axios.post.mockResolvedValue({ data: { status: 'sent', count: 12 } })
    await click('Envoyer', dialog())

    expect(axios.post).toHaveBeenCalledWith('/api/push_notifications/send', { id: 1 })
    expect(snackbar).toHaveBeenCalledWith('Notification envoyée', 'success')
    expect(wrapper.vm.dialogConfirmSend).toBe(false)
    expect(wrapper.vm.sending).toBe(false)
  })

  it('Annuler n’envoie rien', async () => {
    const { wrapper } = await mountIndex()
    await click('Envoyer la notification')
    await click('Annuler', dialog())
    expect(wrapper.vm.dialogConfirmSend).toBe(false)
    expect(axios.post).not.toHaveBeenCalled()
  })

  it('un double clic n’envoie qu’une fois', async () => {
    const { wrapper } = await mountIndex()
    await click('Envoyer la notification')
    let resolve
    axios.post.mockReturnValue(new Promise(r => { resolve = r }))
    wrapper.vm.confirmSend()
    wrapper.vm.confirmSend()
    expect(axios.post).toHaveBeenCalledTimes(1)
    resolve({ data: {} })
    await flush()
  })

  it('en cas d’échec : message d’erreur de l’API, ou message générique', async () => {
    const { wrapper, snackbar } = await mountIndex()
    await click('Envoyer la notification')

    axios.post.mockRejectedValueOnce(apiError(['FCM indisponible']))
    await click('Envoyer', dialog())
    expect(snackbar).toHaveBeenCalledWith('FCM indisponible', 'error')
    expect(wrapper.vm.dialogConfirmSend).toBe(true)

    axios.post.mockRejectedValueOnce(new Error('Network Error'))
    await click('Envoyer', dialog())
    expect(snackbar).toHaveBeenCalledWith('La notification n’a pas pu être envoyée', 'error')
  })
})

describe('Notifications push : suppression', () => {
  beforeEach(() => vi.resetAllMocks())

  it('demande confirmation, supprime puis retire la notification de la liste', async () => {
    const { wrapper, snackbar } = await mountIndex()
    await wrapper.findAll('button').filter(b => b.attributes('aria-label') === 'Supprimer la notification')[1].trigger('click')
    await flush()
    expect(pageText()).toContain('Supprimer la notification ?')
    expect(text(dialog())).toContain('Prière')

    axios.delete.mockResolvedValue({ data: null })
    await click('Supprimer', dialog())

    expect(axios.delete).toHaveBeenCalledWith('/api/push_notifications/2', {})
    expect(snackbar).toHaveBeenCalledWith('Notification supprimée', 'success')
    expect(wrapper.vm.dialogConfirmDelete).toBe(false)
    expect(wrapper.vm.items.map(i => i.id)).toEqual([1])
  })

  it('Annuler ne supprime rien', async () => {
    const { wrapper } = await mountIndex()
    await click('Supprimer la notification')
    await click('Annuler', dialog())
    expect(wrapper.vm.dialogConfirmDelete).toBe(false)
    expect(axios.delete).not.toHaveBeenCalled()
  })
})
