<template>

    <v-data-table
        :headers="headers"
        :items="localItems"
        :items-per-page="50"
        class="elevation-1"
        hide-default-footer></v-data-table>

    <div class="pa-6 bg-grey-lighten bg-grey-lighten-4">
        <h3 class="mb-3 pb-3">Ajouter des membres :</h3>
        <v-autocomplete v-model="addingMembers" v-model:search="search" :items="this.matchMembers"
                        :item-value="item => item" hide-no-data hide-details required @change="addMember" multiple closable-chips
                        chips label="Ajouter un membre">
            <template v-slot:chip="{ props, item }">
                <v-chip v-bind="props" :prepend-icon="item?.icon" :text="item?.name"></v-chip>
            </template>

            <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props" :prepend-icon="item?.icon" :title="item.title"></v-list-item>
            </template>
        </v-autocomplete>

        <v-btn color="primary" class="mt-5" @click="addMember">
            Ajouter les membres
        </v-btn>
    </div>
</template>

<script>

export default {
    components: {
        FuDatabase : () => import('../Database/FuDatabase.vue'),
    },
    props: {
        model: {
            type: String,
            default: () => 'default',
        },
        localItems: {
            type: Array,
            default: () => [],
        },
    },

    data() {
        return {
            search: '',
            searchingMember: '',
            addingMembers: [],
            matchMembers: [],
            editedMembers: [],
            referentiels: {
                roles: ['Membre', 'Bureau', 'CA', 'Bureau Exécutif'],
            },
            headers: [
                { title: 'Nom', key: 'name', sortable: true },
                { title: 'Ville', key: 'town', sortable: true },
                { title: 'Role', key: 'role_name', sortable: true },
                { title: 'Peut voter ?', key: 'can_vote', sortable: true },
                { title: 'Actions', key: 'actions', sortable: false },
            ],
        };
    },
}
</script>

<style scoped>

</style>