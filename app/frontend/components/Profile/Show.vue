<template>
    <v-container style="max-width: 1200px;">

        <v-card class="mb-5" rounded>
            <v-img variant="elevated" height="300" src="" class="bg-teal-lighten-2" cover style="overflow: visible;">
                <v-avatar size="200" color="grey" class="avatar" variant="elevated">
                    <v-img :src="getAvatar" alt="John"></v-img>
                </v-avatar>
            </v-img>
            <v-card-text style="padding-left: 300px;">
                <h2 class="display-1">
                    {{ this.profile.lastname }} {{ this.profile.firstname }}
                </h2>

                <v-btn class="mr-4" color="primary" @click="editProfile()" variant="flat" rounded="xl" size="small"
                    prepend-icon="mdi-pencil">Modifier mon profil</v-btn>
                <v-chip class="mr-2" prepend-icon="mdi-tag">{{ getLevel }}</v-chip>
                <v-chip class="mr-2" prepend-icon="mdi-id-card">{{ getId }}</v-chip>
                <v-chip class="mr-2" color="green" variant="flat" v-for="role in this.roles">{{ role }}</v-chip>
            </v-card-text>
        </v-card>

        <v-row>
            <v-col cols="12" md="4">
                <v-card class="mb-5">
                    <v-card-title>
                        Cotisations
                    </v-card-title>
                    <v-card-text>
                        <v-chip class="mr-2" :color="hasPaidFeeForYear(year) ? 'green' : 'red'" variant="flat"
                            v-for="year in this.years">
                            {{ year }}
                        </v-chip>
                    </v-card-text>
                </v-card>

                <v-card class="mb-5" variant="elevated">
                    <v-list lines="one">
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>Prénom</v-list-item-title>
                                <v-list-item-subtitle>{{ this.profile.firstname }}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>Nom</v-list-item-title>
                                <v-list-item-subtitle>{{ this.profile.lastname }}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>Email</v-list-item-title>
                                <v-list-item-subtitle>{{ this.profile.email }}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>Date de naissance</v-list-item-title>
                                <v-list-item-subtitle>{{ this.profile.birthdate }}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>Téléphone</v-list-item-title>
                                <v-list-item-subtitle>{{ this.profile.phone_1 }}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>Adresse</v-list-item-title>
                                <v-list-item-subtitle>{{ this.profile.address_1 }}, {{ this.profile.zipcode }}, {{
                        this.profile.town }}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-card>


                <v-card>
                    <v-card-title>
                        Reconnaissances
                    </v-card-title>

                    <v-list lines="one">
                        <v-list-item v-for="gratitude in this.gratitudes" :key="gratitude.id" :title="gratitude.level"
                            :subtitle="formatDate(gratitude.start_at)">
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-col>

            <v-col cols="12" md="8">
                <v-card class="mb-5">
                    <v-card-title>
                        Parcours
                    </v-card-title>
                    <v-table>
                        <thead>
                            <tr>
                                <th class="text-left">
                                    Fonction
                                </th>
                                <th class="text-left">
                                    Eglise
                                </th>
                                <th>Dates</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="phase in this.phases" :key="phase.id">
                                <td>{{ phase.function }}</td>
                                <td>{{ phase.church_name }}</td>
                                <td>{{ formatRange(phase.start_at, phase.end_at) }}</td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-card>

                <v-card>
                    <v-card-title>
                        Présidences
                    </v-card-title>
                    <v-table>
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th class="text-left" colspan="2">
                                    Eglise / Association
                                </th>
                                <th>Ville</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="structure in this.presidencies" :key="structure.id">
                                <td width="50">
                                    <v-icon>{{ getIcon(structure.mtype) }}</v-icon>
                                </td>
                                <td width="40">
                                    <v-avatar size="40" color="grey">
                                        <v-img :src="getLogo(structure.id)" alt="Logo"></v-img>
                                    </v-avatar>
                                </td>
                                <td>{{ structure.name }}</td>
                                <td>{{ structure.zipcode }} {{ structure.town }}</td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-card>
            </v-col>

        </v-row>

    </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';

export default {
    name: 'ProfileShow',
    computed: {
        ...mapGetters('profileStore', {
            profile: 'getProfile',
            gratitudes: 'getGratitudes',
            roles: 'getRoles',
            phases: 'getPhases',
            presidencies: 'getPresidences',
            fees: 'getFees',
        }),
        getAvatar: function () {
            return "/avatars/" + this.profile.id + ".png";
        },
        getId: function () {
            if (this.profile.id) {
                return this.profile.id.toString().padStart(5, '0');
            }
        },
        getLevel: function () {
            // On cree un copy local de gratitudes
            let my_gratitudes = [...this.gratitudes];
            if (my_gratitudes && my_gratitudes.length > 0) {
                let mostRecentGratitude = my_gratitudes.sort((a, b) => new Date(b.start_at) - new Date(a.start_at))[0];
                return mostRecentGratitude.level;
            }
            return "Info indisponible";
        },
    },
    methods: {
        formatDate: function (value) {
            if (value !== null) {
                return moment(value).format('DD/MM/YYYY');
            }
            return;
        },
        getLogo: function (id) {
            if (id) {
                return "/logos/" + id + ".png";
            }
        },
        formatRange: function (start_at, end_at) {
            if (start_at && end_at) {
                const startDate = moment(start_at).format('DD/MM/YYYY');
                const endDate = moment(end_at).format('DD/MM/YYYY');
                return `Du ${startDate} au ${endDate}`;
            } else if (start_at && !end_at) {
                const startDate = moment(start_at).format('DD/MM/YYYY');
                return `Depuis le ${startDate}`;
            } else {
                return ''; // or any default value you prefer
            }
        },
        getIcon: function (type) {
            if (type === 'Church') {
                return 'mdi-church';
            } else if (type === 'Association') {
                return 'mdi-office-building';
            }
        },
        hasPaidFeeForYear(year) {
            return this.fees.filter(fee => fee.what === year.toString()).length > 0;
        },
        editProfile: function () {
            this.$store.dispatch('usersStore/getItem', this.profile.id);
        },
    },

    data() {
        return {
            years: [...Array(5)].map((a, b) => new Date().getFullYear() - b),
        }
    },

    beforeMount() {
        this.$store.dispatch('profileStore/getProfile');
    },

}
</script>

<style scoped>
.avatar {
    margin: 0 auto;
    display: block;
    position: absolute;
    bottom: -100px;
    left: 50px;
}
</style>