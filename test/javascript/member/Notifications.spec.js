import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import axios from 'axios'
import NotificationBell from '@/components/Notifications/NotificationBell.vue'
import NotificationContent from '@/components/Notifications/NotificationContent.vue'
import { mountMember, flush, pageText } from './support.js'

vi.mock('axios')

const minutesAgo = (n) => new Date(Date.now() - n * 60 * 1000).toISOString()

// Notification telle que la renvoie GET /api/notifications (include notifiable et sender)
const notification = (id, overrides = {}) => ({
  id, read: false, action: 'created', notifiable_type: 'Post', notifiable_id: 100 + id,
  notifiable: { id: 100 + id, title: `Actu ${id}` }, sender_id: 7, sender: { id: 7, name: 'ADD Lyon' },
  created_at: minutesAgo(5), ...overrides,
})

async function openBell(notifications) {
  axios.get.mockResolvedValue({ data: { notifications } })
  axios.patch.mockResolvedValue({ data: { success: true } })
  const mounted = mountMember(NotificationBell)
  await flush()
  await mounted.wrapper.find('button').trigger('click')
  await flush()
  return mounted
}

const items = () => [...document.querySelectorAll('.v-overlay .v-list-item')]
const itemByText = (label) => items().find(i => i.textContent.includes(label))

describe('Cloche des notifications', () => {
  beforeEach(() => { vi.clearAllMocks(); vi.spyOn(console, 'error').mockImplementation(() => {}) })
  afterEach(() => { document.body.innerHTML = ''; vi.useRealTimers() })

  it('charge les notifications et affiche le nombre de non lues sur la cloche', async () => {
    const { wrapper } = await openBell([notification(1), notification(2), notification(3, { read: true })])

    expect(axios.get).toHaveBeenCalledWith('/api/notifications', { params: { unread: true } })
    const bell = wrapper.find('button')
    expect(bell.attributes('aria-label')).toBe('Notifications, 2 non lue(s)')
    expect(wrapper.find('.v-badge').text()).toContain('2')
    expect(pageText()).toContain('Tout marquer comme lu (2)')
    expect(pageText()).toContain('Actu 1')
    expect(pageText()).toContain('Nouvelle actu')
    expect(pageText()).toContain('ADD Lyon')
    // Les non lues sont mises en évidence
    expect(document.querySelectorAll('.notification-unread')).toHaveLength(2)
  })

  it('n’affiche que les 5 premières notifications', async () => {
    await openBell([1, 2, 3, 4, 5, 6, 7].map(id => notification(id)))
    expect(pageText()).toContain('Actu 5')
    expect(pageText()).not.toContain('Actu 6')
  })

  it('aucune notification : message et cloche sans badge', async () => {
    const { wrapper } = await openBell([])
    expect(pageText()).toContain('Aucune notification')
    expect(pageText()).not.toContain('Tout marquer comme lu')
    expect(wrapper.find('.v-badge').exists()).toBe(false)
    expect(wrapper.find('button').attributes('aria-label')).toBe('Notifications')
  })

  it('cliquer sur une notification la marque comme lue et ouvre le contenu', async () => {
    const { wrapper, router } = await openBell([
      notification(1, { notifiable_type: 'Event', notifiable: { id: 101, title: 'Congrès' } }),
      notification(2),
    ])
    itemByText('Congrès').click()
    await flush()

    expect(axios.patch).toHaveBeenCalledWith('/api/notifications/1/mark_as_read')
    expect(router.push).toHaveBeenCalledWith({ name: 'event.show', params: { id: 101 } })
    expect(wrapper.vm.unreadCount).toBe(1)
    expect(wrapper.find('button').attributes('aria-label')).toBe('Notifications, 1 non lue(s)')
  })

  it('notification dont le contenu a disparu : marquée lue, sans navigation', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { router } = await openBell([notification(1, { notifiable: null, message: 'Message libre' })])
    itemByText('Nouvelle actu').click()
    await flush()
    expect(axios.patch).toHaveBeenCalledWith('/api/notifications/1/mark_as_read')
    expect(router.push).not.toHaveBeenCalled()
    expect(warn).toHaveBeenCalled()
  })

  it('« Tout marquer comme lu » vide la liste et le compteur', async () => {
    const { wrapper } = await openBell([notification(1), notification(2)])
    itemByText('Tout marquer comme lu').click()
    await flush()
    expect(axios.patch).toHaveBeenCalledWith('/api/notifications/mark_all_as_read')
    expect(wrapper.vm.unreadCount).toBe(0)
    expect(pageText()).toContain('Aucune notification')
  })

  it('les erreurs réseau laissent la liste en l’état', async () => {
    const { wrapper } = await openBell([notification(1)])
    axios.patch.mockRejectedValue(new Error('réseau'))
    await wrapper.vm.markAsRead(wrapper.vm.notifications[0])
    await wrapper.vm.markAllAsRead()
    expect(wrapper.vm.unreadCount).toBe(1)
    expect(wrapper.vm.notifications).toHaveLength(1)

    axios.get.mockRejectedValue(new Error('réseau'))
    await wrapper.vm.fetchNotifications()
    expect(wrapper.vm.notifications).toHaveLength(1)
    expect(console.error).toHaveBeenCalledTimes(3)
  })

  it('se rafraîchit chaque minute, et s’arrête une fois la cloche démontée', async () => {
    vi.useFakeTimers()
    axios.get.mockResolvedValue({ data: { notifications: [] } })
    const { wrapper } = mountMember(NotificationBell)
    expect(axios.get).toHaveBeenCalledTimes(1)
    await vi.advanceTimersByTimeAsync(60000)
    expect(axios.get).toHaveBeenCalledTimes(2)

    wrapper.unmount()
    await vi.advanceTimersByTimeAsync(120000)
    expect(axios.get).toHaveBeenCalledTimes(2)
  })

  it('libellés utilitaires : date et texte de repli', async () => {
    const { wrapper } = await openBell([])
    expect(wrapper.vm.renderNotification({ action: 'created', notifiable_type: 'Event' })).toBe('Nouveau event créé')
    expect(wrapper.vm.renderNotification({ action: 'updated' })).toBe('Nouvelle notification')
    expect(wrapper.vm.formatDate('2026-10-06T10:00:00')).toBe(new Date('2026-10-06T10:00:00').toLocaleString())
  })
})

describe('Contenu d’une notification', () => {
  afterEach(() => { document.body.innerHTML = '' })

  const render = (overrides) => mountMember(NotificationContent, { props: { notification: notification(1, overrides) } }).wrapper

  it('titre selon le type de contenu, logo de l’expéditeur', () => {
    expect(render({ notifiable_type: 'Event' }).text()).toContain('Nouvel événement')
    expect(render({ notifiable_type: 'Post' }).text()).toContain('Nouvelle actu')
    expect(render({ notifiable_type: 'Vote', message: 'Vote ouvert' }).text()).toContain('Vote ouvert')
    expect(render({ notifiable_type: 'Vote' }).text()).toContain('Notification')
    expect(render({}).find('img').attributes('src')).toBe('/logos/7.png')
    expect(render({ sender_id: null }).find('img').exists()).toBe(false)
  })

  it('ancienneté en secondes, minutes, heures puis jours', () => {
    expect(render({ created_at: new Date(Date.now() - 20 * 1000).toISOString() }).text()).toMatch(/\d+ sec/)
    expect(render({ created_at: minutesAgo(12) }).text()).toContain('12 min')
    expect(render({ created_at: minutesAgo(180) }).text()).toContain('3 hr')
    const wrapper = render({ created_at: minutesAgo(3 * 24 * 60) })
    expect(wrapper.text()).toContain('3 j')
    expect(wrapper.vm.formattedDate).toBe(new Date(wrapper.vm.notification.created_at).toLocaleString())
  })
})
