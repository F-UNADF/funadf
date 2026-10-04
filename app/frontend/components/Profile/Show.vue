<template>
    <v-container style="max-width: 1200px;">
        <v-card class="mb-5" rounded>
            <div class="cover">
                <v-avatar size="150" color="grayLighter" class="avatar elevation-5">
                    <v-img v-if="profile.id" :src="getAvatar" :alt="`${profile.firstname} ${profile.lastname}`" cover></v-img>
                </v-avatar>
            </div>
            <v-card-text class="userInfos">
                <h2 class="display-1 mb-3">
                    {{ this.profile.lastname }} {{ this.profile.firstname }}
                </h2>

                <v-btn class="mr-4" color="primary" @click="editProfile()" variant="flat" rounded="xl" size="small"
                    prepend-icon="mdi-pencil">Modifier mon profil</v-btn>
                <v-chip class="mr-2" prepend-icon="mdi-tag">{{ getLevel }}</v-chip>
                <v-chip class="mr-2" prepend-icon="mdi-id-card">{{ getId }}</v-chip>
                <v-chip class="mr-2" color="primary" variant="tonal" v-for="role in this.roles" :key="role">{{ roleLabel(role) }}</v-chip>
            </v-card-text>
        </v-card>

        <v-row>
            <v-col cols="12" md="4">
                <v-card class="mb-5">
                    <v-card-title>
                        Cotisations
                    </v-card-title>
                    <v-card-text>
                        <v-chip class="mr-2 mb-2" :color="hasPaidFeeForYear(year) ? 'success' : 'error'" variant="tonal"
                            v-for="year in this.years" :key="year"
                            :prepend-icon="hasPaidFeeForYear(year) ? 'mdi-check-circle' : 'mdi-close-circle'"
                            :aria-label="`${year} : ${hasPaidFeeForYear(year) ? 'payée' : 'non payée'}`">
                            {{ year }}
                        </v-chip>
                        <p class="text-caption text-medium-emphasis mt-1">
                            <v-icon size="small">mdi-check-circle</v-icon> payée
                            <v-icon size="small" class="ms-3">mdi-close-circle</v-icon> non payée
                        </p>
                    </v-card-text>
                </v-card>

                <v-card class="mb-5">
                    <v-card-title>Coordonnées</v-card-title>
                    <v-list lines="two" density="compact">
                        <v-list-item v-for="row in identityRows" :key="row.label">
                            <v-list-item-subtitle>{{ row.label }}</v-list-item-subtitle>
                            <v-list-item-title class="text-wrap" :class="{ 'text-medium-emphasis': !row.value }">
                                {{ row.value || 'Non renseigné' }}
                            </v-list-item-title>
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
                        <v-list-item v-if="!gratitudes || gratitudes.length === 0" class="text-medium-emphasis">
                            Aucune reconnaissance enregistrée.
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
                                    Église
                                </th>
                                <th class="text-left">Dates</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="phase in this.phases" :key="phase.id">
                                <td>{{ phase.function }}</td>
                                <td>{{ phase.church_name }}</td>
                                <td>{{ formatRange(phase.start_at, phase.end_at) }}</td>
                            </tr>
                            <tr v-if="!phases || phases.length === 0">
                                <td colspan="3" class="text-medium-emphasis">Aucun parcours enregistré.</td>
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
                                <th class="text-left">Type</th>
                                <th class="text-left" colspan="2">
                                    Église / Association
                                </th>
                                <th class="text-left">Ville</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="structure in this.presidencies" :key="structure.id">
                                <td width="50">
                                    <v-icon :aria-label="structure.mtype === 'Church' ? 'Église' : 'Association'">{{ getIcon(structure.mtype) }}</v-icon>
                                </td>
                                <td width="40">
                                    <v-avatar size="40" color="grey">
                                        <v-img :src="getLogo(structure.id)" alt=""></v-img>
                                    </v-avatar>
                                </td>
                                <td>{{ structure.name }}</td>
                                <td>{{ structure.zipcode }} {{ structure.town }}</td>
                            </tr>
                            <tr v-if="!presidencies || presidencies.length === 0">
                                <td colspan="4" class="text-medium-emphasis">Aucune présidence en cours.</td>
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
        identityRows: function () {
            const p = this.profile || {};
            const address = [p.address_1, [p.zipcode, p.town].filter(Boolean).join(' ')].filter(Boolean).join(', ');
            return [
                { label: 'Prénom', value: p.firstname },
                { label: 'Nom', value: p.lastname },
                { label: 'E-mail', value: p.email },
                { label: 'Date de naissance', value: p.birthdate ? this.formatDate(p.birthdate) : null },
                { label: 'Téléphone', value: p.phone_1 },
                { label: 'Adresse', value: address },
            ];
        },
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
            return "Reconnaissance non renseignée";
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
        roleLabel(role) {
            const labels = { admin: 'Administrateur', moderator: 'Modérateur' };
            return labels[role] || role;
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
/** MOBILE FIRST */
.cover {
  height: 200px;
  position: relative;
  margin-bottom: 80px;

  border-radius: 10px 10px 0 0;

  background: linear-gradient(
      135deg,
      #6E7BD8 0%,
      #A866A4 50%,
      #F44C47 100%
  );
}

.avatar {
    position: absolute;
    bottom: -35%;
    left: 50%;
    transform: translateX(-50%);
}

.userInfos {
    position: relative;
    z-index: 1;
    text-align: center;
}
</style>