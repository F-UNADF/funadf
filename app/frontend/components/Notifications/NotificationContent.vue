<template>
    <v-list-item>
        <template v-slot:prepend>
          <v-avatar color="grey-lighten-1">
            <img
                v-if="notification.sender_id"
                :src="getLogoUrl(notification.sender_id)"
                width="40"
                height="40"
                contain
            />
          </v-avatar>
        </template>
        <v-list-item-content>
            <v-list-item-title v-text="notification.notifiable?.title" />
            <v-list-item-subtitle v-text="notification.sender?.name" />
        </v-list-item-content>
        
        <template v-slot:append>
          <v-btn
            color="grey-lighten-1"
            icon="mdi-close"
            variant="text"
          ></v-btn>
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
        formattedDate() {
            return new Date(this.notification.created_at).toLocaleString();
        },
    },
    methods: {
        getLogoUrl(senderId) {
            return `/logos/${senderId}.png`;
        }
    }
};
</script>