<template>
    <v-list-item :class="{ 'notification-unread': !notification.read }">
        <template v-slot:prepend>
            <v-avatar color="grey-lighten-1">
                <img v-if="notification.sender_id" :src="getLogoUrl(notification.sender_id)" width="40" height="40"
                    contain />
            </v-avatar>
        </template>
        <v-list-item-content>
            <v-list-item-subtitle class="text-caption mb-0">
                {{ getNotificationTitle }}
                <v-icon size="small">mdi-circle-small</v-icon>
                {{ notification.sender?.name }}
            </v-list-item-subtitle>
            <v-list-item-title>
                {{ this.notification.notifiable?.title }}
            </v-list-item-title>
        </v-list-item-content>

        <template v-slot:append>
            <v-list-item-action class="flex-column align-end">
                <small class="text-high-emphasis opacity-60">{{ getTimeAgo }}</small>
            </v-list-item-action>
        </template>
    </v-list-item>
</template>

<script>

export default {
    name: 'NotificationContent',
    props: {
        notification: {
            type: Object,
            required: true,
            default: () => ({})
        }
    },
    computed: {
        getTimeAgo() {
            const now = new Date();
            const createdAt = new Date(this.notification.created_at);
            const diffInSeconds = Math.floor((now - createdAt) / 1000);

            if (diffInSeconds < 60) {
                return `${diffInSeconds} sec`;
            } else if (diffInSeconds < 3600) {
                const minutes = Math.floor(diffInSeconds / 60);
                return `${minutes} min`;
            } else if (diffInSeconds < 86400) {
                const hours = Math.floor(diffInSeconds / 3600);
                return `${hours} hr`;
            } else {
                const days = Math.floor(diffInSeconds / 86400);
                return `${days} j`;
            }
        },
        formattedDate() {
            return new Date(this.notification.created_at).toLocaleString();
        },
        getNotificationTitle() {
            if (this.notification.notifiable_type === 'Event') {
                return `Nouvel événement`;
            } else if (this.notification.notifiable_type === 'Post') {
                return `Nouvelle actu`;
            } else {
                return this.notification.message || 'Notification';
            }
        }
    },
    methods: {
        getLogoUrl(senderId) {
            return `/logos/${senderId}.png`;
        }
    }
};
</script>

<style scoped>
.notification-unread {
    background-color: #f1f1f1;
}
</style>