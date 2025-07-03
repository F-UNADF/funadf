<template>
  <div>
    <v-menu
      offset-y
      :close-on-content-click="false"
      v-model="menu"
    >
      <template #activator="{ props }">
        <v-btn icon v-bind="props" color="primary">
          <v-badge
            v-if="unreadCount > 0"
            :content="unreadCount"
            color="red"
            overlap
          >
            <v-icon>mdi-bell</v-icon>
          </v-badge>
          <v-icon v-else>mdi-bell-outline</v-icon>
        </v-btn>
      </template>

      <v-list style="min-width: 400px; max-height: 500px; overflow-y: auto;">
        <v-list-item @click="markAllAsRead()" v-if="notifications.filter(n => !n.read).length > 0">
          <v-list-item-title class="text--small text-caption text-grey">Marquer les {{ notifications.length }} notification(s) comment lue(s)</v-list-item-title>
        </v-list-item>

        <NotificationContent 
          v-for="notif in notifications.slice(0, 5)" 
          :key="notif.id" 
          @click="goTo(notif)" 
          :notification="notif" />

        <v-list-item v-if="notifications.length === 0">
          <v-list-item-title>Aucune notification</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import axios from 'axios';
import NotificationContent from './NotificationContent.vue';

export default {
  name: 'NotificationsBell',
  components: {
    NotificationContent,
},
  data() {
    return {
      menu: false,
      notifications: [],
      unreadCount: 0,
    }
  },
  methods: {
    async fetchNotifications() {
      try {
        const response = await axios.get('/api/notifications', {
          params: { unread: true },
        })
        this.notifications = response.data.notifications || []
        this.unreadCount = response.data.notifications.filter(n => !n.read).length
      } catch (error) {
        console.error('Erreur lors du chargement des notifications', error)
      }
    },
    async markAsRead(notif) {
      try {
        await axios.patch(`/api/notifications/${notif.id}/mark_as_read`)
        notif.read = true
        this.unreadCount = this.notifications.filter(n => !n.read).length
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la notification', error)
      }
    },
    async markAllAsRead() {
      try {
        await axios.patch('/api/notifications/mark_all_as_read')
        this.notifications = []
        this.unreadCount = 0
      } catch (error) {
        console.error('Erreur lors de la mise à jour de toutes les notifications', error)
      }
    },
    goTo(notif) {
      this.markAsRead(notif);
      if (notif.notifiable) {
        this.$router.push({ name: notif.notifiable_type.toLowerCase() + '.show', params: { id: notif.notifiable_id } })
      } else {
        console.warn('Notification notifiable is missing', notif)
      }
    },
    formatDate(isoDate) {
      return new Date(isoDate).toLocaleString()
    },
    renderNotification(notif) {
      switch (notif.action) {
        case 'created':
          return `Nouveau ${notif.notifiable_type.toLowerCase()} créé`
        default:
          return 'Nouvelle notification'
      }
    },
  },
  mounted() {
    this.fetchNotifications();
    setInterval(() => {
      this.fetchNotifications()
    }, 60000) // Refresh every minute
  },
}
</script>
