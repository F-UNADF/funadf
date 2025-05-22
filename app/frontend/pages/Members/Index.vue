<template>
    <v-card>
        <v-card-title>
            {{ $t('members.title') }}
        </v-card-title>

        <v-overlay :model-value="isLoading" class="d-flex align-center justify-center">
            <v-progress-circular indeterminate color="primary" size="64" />
        </v-overlay>

        <fu-membership-input v-if="!isLoading" model="regions" />
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
            fetchUserIntervalId: null,
        };
    },
    computed: {
        region() {
            return this.$store.getters['sessionStore/region'] || null;
        },
    },
    methods: {
        tryFetchUserUntilRegionExists() {
            this.$store.dispatch("sessionStore/fetchUser");

            this.fetchUserIntervalId = setInterval(() => {
                if (!this.region || !this.region.id) {
                    this.$store.dispatch("sessionStore/fetchUser");
                }
            }, 1000);
        },
    },
    watch: {
        region: {
            handler(newVal) {
                if (newVal && newVal.id) {
                    clearInterval(this.fetchUserIntervalId);
                    this.isLoading = false;
                    this.$store.dispatch("regions/fetchItem", newVal.id);
                    this.$store.dispatch("regions/referentiels");
                }
            },
            immediate: true,
        },
    },
    mounted() {
        this.tryFetchUserUntilRegionExists();
    },
    beforeUnmount() {
        clearInterval(this.fetchUserIntervalId);
    },
};
</script>
