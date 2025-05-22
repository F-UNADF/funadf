<template>
    <v-data-table :headers="headers" :items="localItems" density="compact" class="elevation-1">
        <template v-slot:no-data>
            <v-progress-linear indeterminate color="cyan" v-if="loading"></v-progress-linear>
            <v-alert v-else class="my-3" color="info" icon="$info" :title="$t(this.model + '.noData')"
                :text="$t(this.model + '.noDataExplain')"></v-alert>
        </template>
        <template v-slot:item="{ item }">
            <tr>
                <td>
                    <div class="d-flex align-center">
                        <v-avatar
                            :icon="(item.member_type == 'Structure') ? 'mdi-office-building' : 'mdi-account'"></v-avatar>
                        <div class="ml-3">
                            <h4>{{ item.name }}</h4>
                        </div>
                    </div>
                </td>
                <td>
                    <div v-if="item.town !== null" class="d-flex align-center">
                        <v-icon>mdi-map-marker</v-icon>
                        <div class="ml-3">
                            <h4>{{ item.town }} <small>({{ item.zipcode }})</small></h4>
                        </div>
                    </div>
                </td>
                <td>
                    <v-menu>
                        <template v-slot:activator="{ props }">
                            <v-btn color="secondary" v-bind="props">
                                {{ getRoleName(item.role_friendly_name) }}
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item v-for="(role, index) in this.referentiels.roles" :key="index"
                                @click="setRole(item, role.name)">
                                <v-list-item-title>{{ role.friendly_name || role.name }}</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </td>
                <td>
                    <v-switch v-model="item.can_vote" inset color="secondary" label="Peut voter ?"
                        @change="setCanVote(item)"></v-switch>
                </td>
                <td>
                    <v-tooltip location="top" text="Supprimer le membre">
                        <template v-slot:activator="{ props }">
                            <v-icon v-bind="props" small class="text-error" title="Delete"
                                @click="removeMember(item.membership_id)">
                                mdi-delete
                            </v-icon>
                        </template>
                    </v-tooltip>
                </td>
            </tr>
        </template>
    </v-data-table>

    <div class="pa-6 bg-grey-lighten bg-grey-lighten-4">
        <h3 class="mb-3 pb-3">Ajouter des membres :</h3>
        <v-autocomplete v-model="addingMembers" v-model:search="search" :items="this.matchMembers"
            :item-value="item => item" hide-no-data hide-details required multiple closable-chips chips
            label="Ajouter un membre">

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
    props: {
        model: {
            type: String,
            default: () => 'default',
        },
    },
    mounted() {
        this.fuDatabaseReady = true;
    },
    computed: {
        referentiels() {
            return this.$store.getters[`${this.model}/getReferentiels`] || {};
        },
        localItems() {
            return this.$store.getters[`${this.model}/getMembers`] || [];
        }
    },
    methods: {
        getRoleName(role) {
            let roles = this.referentiels.roles;
            if (roles && roles.hasOwnProperty(role)) {
                return roles[role];
            }
            return role;
        },
        updateMatchingMembers() {
            let search = this.search.toLowerCase();
            if (search.length < 3) {
                this.matchMembers = [];
                return;
            }

            let members = this.referentiels.members;


            let matchMembers = members.filter((member) =>
                member.name.toLowerCase().includes(search)
            ).map((member) => ({
                id: member.member_id,
                type: member.member_type,
                name: member.name,
                title: member.name,
                icon: (member.member_type == 'Structure') ? 'mdi-account-group' : 'mdi-account',
            }));
            this.matchMembers = matchMembers;
        },
        addMember() {
            this.$store.dispatch(`${this.model}/addMembers`, this.addingMembers).then(response => {
                this.$root.showSnackbar('Membres ajoutés avec succés', 'success');
                this.localItems = this.$store.getters[`${this.model}/getMembers`] || [];
                this.addingMembers = [];
                this.search = '';
            }, error => {
                this.$root.showSnackbar('Un probleme est survenu lors de l\'enregistrement des membres', 'error');
                let errors = error.response.data.errors;
                this.$root.showSnackbar(errors.join('<br/>'), 'error');
            });
        },
        setRole(member, role) {
            this.$store.dispatch(`${this.model}/setRole`, { member: member, role: role }).then(response => {
                this.$root.showSnackbar('Role modifié avec succés', 'success');
                this.localItems = this.$store.getters[`${this.model}/getMembers`] || [];
            }, error => {
                this.$root.showSnackbar('Un probleme est survenu lors de la modification du role', 'error');
                let errors = error.response.data.errors;
                this.$root.showSnackbar(errors.join('<br/>'), 'error');
            });
        },
        removeMember(membership_id) {
            this.$store.dispatch(`${this.model}/removeMember`, membership_id).then(response => {
                this.$root.showSnackbar('Membre supprimé avec succés', 'success');
            }, error => {
                this.$root.showSnackbar('Un probleme est survenu lors de la suppression du membre', 'error');
                let errors = error.response.data.errors;
                this.$root.showSnackbar(errors.join('<br/>'), 'error');
            });
        },
    },
    watch: {
        search: function () {
            this.updateMatchingMembers();
        },
    },
    data() {
        return {
            search: '',
            searchingMember: '',
            addingMembers: [],
            matchMembers: [],
            editedMembers: [],
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

<style scoped></style>