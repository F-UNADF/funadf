<template>
    <div>
        <v-data-table
            :headers="headers"
            :items="displayedItems"
            :search="search"
            class="elevation-1"
            :loading="loading"
            items-per-page="50"
            :items-per-page-options="itemsPerPage"
            :items-per-page-text="$t('itemsPerPage')"
        >
            <template v-slot:top>
                <v-toolbar>
                    <v-toolbar-title class="text-h6">
                        {{ $t(this.model + '.title') }}
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-text-field
                        v-if="enabledSearch"
                        v-model="search"
                        :label="$t('search')"
                        class="mx-4"
                        append-inner-icon="mdi-magnify"
                        density="compact"
                        single-line
                        hide-details
                        variant="outlined"
                    ></v-text-field>

                    <template v-for="action in config?.actions">
                        <v-btn
                            class="me-2"
                            :color="action.color || 'primary'"
                            :prepend-icon="action.icon || 'mdi-plus'"
                            :text="$t(action.title)"
                            @click="manageAction(action)"
                        ></v-btn>

                    </template>

                </v-toolbar>
            </template>
            <template v-slot:no-data>
                <v-progress-linear
                    indeterminate
                    color="cyan"
                    v-if="loading"
                ></v-progress-linear>
                <v-alert
                    v-else
                    class="my-3"
                    color="info"
                    icon="$info"
                    :title="$t(this.model + '.noData')"
                    :text="$t(this.model + '.noDataExplain')"
                ></v-alert>
            </template>
        </v-data-table>

        <v-dialog
            v-model="dialog"
            :fullscreen="config?.form?.fullscreen === true"
            :max-width="config?.form?.maxWidth || '600px'"
            @keydown.esc="dialog = false"
            @click:outside="dialog = false"
            >
            <fuForm :model="model" :config="config" v-if="dialog"
            @close="dialog = false"></fuForm>
        </v-dialog>
    </div>
</template>

<script>
import fuForm from "@/components/Form/FuForm.vue";

export default {
    name: "FuDatabase",
    components: {
        fuForm,
    },
    props: {
        model: {
            type: String,
            default: () => "default",
        },
        headers: {
            type: Array,
            default: () => [],
        },
        localItems: {
            type: Array,
            default: () => [],
        },
        enabledSearch: {
            type: Boolean,
            default: () => true,
        },
    },
    computed: {
        items() {
            return this.$store.getters[`${this.model}/getItems`] || [];
        },
        loading() {
            return this.$store.getters[`${this.model}/getLoading`] || false;
        },
        config() {
            return this.$store.getters[`${this.model}/getConfig`] || {};
        },
        dialog: {
            get() {
                return this.$store.getters[`${this.model}/getDialog`] || false;
            },
            set(value) {
                this.$store.commit(`${this.model}/setDialog`, value);
            },
        },
        displayedItems() {
            if(this.localItems.length > 0) {
                console.log('localItems', this.localItems);
                return this.localItems;
            }
            return this.items;
        },
    },
    methods: {
        fetchItems() {
            this.$store.dispatch(`${this.model}/fetchItems`, {
                search: this.search,
            });
        },
        manageAction(action) {
            if (action.action === 'add') {
                this.add();
            } else if (action.action === 'edit') {
                this.edit();
            } else if (action.action === 'delete') {
                this.delete();
            } else if (action.action === 'custom') {
                this.custom(action);
            }
        },
        add() {
            let newItem = this.config?.form?.defaultItem || {};
            this.$store.commit(`${this.model}/setItem`, newItem);
            this.$store.commit(`${this.model}/setDialog`, true);
        },
    },
    data() {
        return {
            itemsPerPage: [
                {value: 10, title: '10'},
                {value: 25, title: '25'},
                {value: 50, title: '50'},
                {value: 100, title: '100'},
                {value: -1, title: 'Tous'}
            ],
            search: '',
        };
    },
    watch: {
        search: function () {
            if (this.localItems.length === 0) {
                this.$store.dispatch(`${this.model}/fetchItems`, {
                    search: this.search,
                });
            }
        },
    },
    mounted() {
        if (this.localItems.length === 0) {
            this.$store.dispatch(`${this.model}/fetchItems`);
            this.$store.dispatch(`${this.model}/fetchConfig`);
        }
    },

}

</script>

<style>
.v-data-table-rows-no-data {
    text-align: left !important;
}
</style>