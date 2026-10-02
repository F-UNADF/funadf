<template>
    <v-card>
        <v-skeleton-loader v-if="isLoading" type="list-item-avatar@4"></v-skeleton-loader>

        <div v-else-if="!region || !region.id" class="list-empty">
            <v-icon size="40" color="grayLight">mdi-map-marker-off-outline</v-icon>
            <p class="text-subtitle-1 font-weight-medium mt-2 mb-1">Aucune région n’est rattachée à votre compte</p>
            <p class="text-body-2 text-medium-emphasis">
                Pour gérer les membres d’une région, vous devez en être responsable. Contactez l’administration nationale si c’est une erreur.
            </p>
        </div>

        <fu-membership-input v-else model="regions" />
    </v-card>
</template>

<script>
import FuMembershipInput from "../../components/Form/FuMembersInput.vue";

export default {
    name: "MembersIndex",
    components: {
        FuMembershipInput,
    },
    data() {
        return {
            isLoading: true,
        };
    },
    computed: {
        region() {
            return this.$store.getters['sessionStore/region'] || null;
        },
    },
    methods: {
        loadRegion() {
            this.isLoading = true;
            this.$store.dispatch("sessionStore/fetchUser").catch(() => {}).finally(() => {
                this.isLoading = false;
            });
        },
    },
    watch: {
        region: {
            handler(newVal) {
                if (newVal && newVal.id) {
                    this.$store.dispatch("regions/fetchItem", newVal.id);
                    this.$store.dispatch("regions/referentiels");
                }
            },
            immediate: true,
        },
    },
    mounted() {
        this.loadRegion();
    },
};
</script>
