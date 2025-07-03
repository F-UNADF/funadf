<template>
    <v-card>
        <v-card-title>
            <v-avatar size="50" class="me-3">
                <img :src="'/logos/' + event.structure.id + '.png'" width="50" alt="avatar" />
            </v-avatar>
            {{ event.title }}
        </v-card-title>
        <v-card-subtitle>
            {{ event.category?.name }}
            <v-icon size="x-small" :color="event.category?.color">mdi-circle</v-icon>
            {{ event.structure.name }}
        </v-card-subtitle>
        <v-card-text>
            <div class="mb-5" v-html="event.description"></div>

            <v-row v-if="event?.images">
                <v-col v-for="(photo, index) in event?.images" :key="index" class="d-flex child-flex" cols="4">
                    <v-img :src="photo" :lazy-src="photo" class="bg-grey-lighten-2"
                        @click="window.open(photo, '_blank', 'noreferrer');">
                        <template v-slot:placeholder>
                            <v-row class="fill-height ma-0" align="center" justify="center">
                                <v-progress-circular indeterminate color="grey-lighten-5"></v-progress-circular>
                            </v-row>
                        </template>
                    </v-img>
                </v-col>
            </v-row>

            <v-row v-if="event?.attachments" class="pb-3">
                <v-col v-for="(attachment, index) in event?.attachments" :key="index" class="d-flex child-flex"
                    cols="4">
                    <v-btn :href="attachment" target="_blank" color="primary" variant="tonal" elevation="1" block>
                        <v-icon>mdi-download</v-icon>
                        <span style="white-space: normal;">
                            {{ attachment.split('/').pop().substring(0, 15) + "..." }}
                        </span>
                    </v-btn>

                </v-col>
            </v-row>
        </v-card-text>
        <v-card-actions v-if="isDialog">
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="this.$emit('close')">Fermer</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>

import moment from "moment";
export default {
    name: "EventDetail",
    props: {
        event: {
            type: Object,
            required: true,
        },
        isDialog: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            detail: false,
        };
    },
    methods: {
        dateFormat(value) {
            return moment(value).format('DD/MM/YYYY HH:mm');
        },
    },
};

</script>
