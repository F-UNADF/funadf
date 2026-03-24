<template>
  <v-container style="max-width: 1200px;">
    <template v-if="churches.length > 0">
      <v-card class="mb-5" rounded>
        <v-img
            variant="elevated"
            src=""
            class="cover"
            cover
            style="overflow: visible;"
        >
          <v-avatar
              size="150"
              color="grey"
              class="avatar elevation-5"
              variant="elevated"
          >
            <v-img :src="getChurchLogo" :alt="selectedChurch.name"></v-img>
          </v-avatar>
        </v-img>

        <v-card-text class="structureInfos">
          <h2 class="display-1 mb-3">
            {{ selectedChurch.name }}
          </h2>

          <div class="mb-4" v-if="churches.length > 1">
            <v-select
                v-model="selectedChurchId"
                :items="churchOptions"
                label="Choisir une église"
                variant="outlined"
                density="compact"
                hide-details
                style="max-width: 400px; margin: 0 auto;"
            />
          </div>

          <v-chip class="mr-2" prepend-icon="mdi-tag">
            Église
          </v-chip>

          <v-chip class="mr-2" prepend-icon="mdi-id-card">
            {{ getFriendlyId(selectedChurch.id) }}
          </v-chip>

          <v-chip
              class="mr-2"
              color="green"
              variant="flat"
              v-if="selectedChurch.town"
          >
            {{ selectedChurch.town }}
          </v-chip>

          <div class="mt-4">
            <v-btn
                color="primary"
                variant="flat"
                rounded="xl"
                size="small"
                prepend-icon="mdi-pencil"
                @click="editChurch"
            >
              Modifier la fiche
            </v-btn>
          </div>
        </v-card-text>
      </v-card>

      <v-row>
        <v-col cols="12" md="4">
          <v-card class="mb-5" variant="elevated">
            <v-card-title>
              Coordonnées
            </v-card-title>

            <v-list lines="one">
              <v-list-item>
                <v-list-item-title>Nom</v-list-item-title>
                <v-list-item-subtitle>
                  {{ selectedChurch.name || 'Non renseigné' }}
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <v-list-item-title>Email</v-list-item-title>
                <v-list-item-subtitle>
                  <template v-if="selectedChurch.email">
                    <a :href="`mailto:${selectedChurch.email}`">
                      {{ selectedChurch.email }}
                    </a>
                  </template>
                  <template v-else>
                    Non renseigné
                  </template>
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <v-list-item-title>Téléphone</v-list-item-title>
                <v-list-item-subtitle>
                  <template v-if="selectedChurch.phone_1">
                    <a :href="`tel:${selectedChurch.phone_1}`">
                      {{ selectedChurch.phone_1 }}
                    </a>
                  </template>
                  <template v-else>
                    Non renseigné
                  </template>
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <v-list-item-title>Adresse</v-list-item-title>
                <v-list-item-subtitle>
                  {{ fullAddress }}
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <v-list-item-title>Site web</v-list-item-title>
                <v-list-item-subtitle>
                  <template v-if="selectedChurch.website">
                    <a :href="normalizedWebsite(selectedChurch.website)" target="_blank">
                      {{ selectedChurch.website }}
                    </a>
                  </template>
                  <template v-else>
                    Non renseigné
                  </template>
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card>

          <v-card class="mb-5">
            <v-card-title>
              Localisation
            </v-card-title>
            <v-card-text>
              <div class="mb-2">
                <strong>Ville :</strong> {{ selectedChurch.town || 'Non renseignée' }}
              </div>
              <div class="mb-2">
                <strong>Code postal :</strong> {{ selectedChurch.zipcode || 'Non renseigné' }}
              </div>
              <div class="mb-2">
                <strong>Latitude :</strong> {{ selectedChurch.latitude ?? 'Non renseignée' }}
              </div>
              <div>
                <strong>Longitude :</strong> {{ selectedChurch.longitude ?? 'Non renseignée' }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="8">
          <v-card class="mb-5">
            <v-card-title>
              Informations générales
            </v-card-title>

            <v-table>
              <tbody>
              <tr>
                <td width="220"><strong>Type</strong></td>
                <td>{{ getStructureTypeLabel(selectedChurch.type) }}</td>
              </tr>
              <tr>
                <td><strong>Identifiant</strong></td>
                <td>{{ getFriendlyId(selectedChurch.id) }}</td>
              </tr>
              <tr>
                <td><strong>Créée le</strong></td>
                <td>{{ formatDate(selectedChurch.created_at) || 'Non renseigné' }}</td>
              </tr>
              <tr>
                <td><strong>Mise à jour le</strong></td>
                <td>{{ formatDate(selectedChurch.updated_at) || 'Non renseigné' }}</td>
              </tr>
              </tbody>
            </v-table>
          </v-card>

          <v-card>
            <v-card-title>
              Accès rapides
            </v-card-title>

            <v-card-text>
              <div class="d-flex flex-wrap ga-3">
                <v-btn
                    variant="outlined"
                    prepend-icon="mdi-map-marker"
                    :href="googleMapsUrl"
                    target="_blank"
                    v-if="fullAddress !== 'Non renseignée'"
                >
                  Ouvrir dans Google Maps
                </v-btn>

                <v-btn
                    variant="outlined"
                    prepend-icon="mdi-web"
                    :href="normalizedWebsite(selectedChurch.website)"
                    target="_blank"
                    v-if="selectedChurch.website"
                >
                  Visiter le site
                </v-btn>

                <v-btn
                    variant="outlined"
                    prepend-icon="mdi-email"
                    :href="`mailto:${selectedChurch.email}`"
                    v-if="selectedChurch.email"
                >
                  Envoyer un email
                </v-btn>

                <v-btn
                    variant="outlined"
                    prepend-icon="mdi-phone"
                    :href="`tel:${selectedChurch.phone_1}`"
                    v-if="selectedChurch.phone_1"
                >
                  Appeler
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <template v-else>
      <v-card rounded>
        <v-card-text class="py-10 text-center">
          <v-icon size="60" class="mb-4">mdi-church</v-icon>
          <h2 class="mb-2">Aucune église trouvée</h2>
          <p class="text-medium-emphasis mb-0">
            Vous n’avez actuellement aucune présidence sur une église.
          </p>
        </v-card-text>
      </v-card>
    </template>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';

export default {
  name: 'MyChurch',

  data() {
    return {
      selectedChurchId: null,
    };
  },

  computed: {
    ...mapGetters('profileStore', {
      presidences: 'getPresidences',
    }),

    churches() {
      return (this.presidences || []).filter((structure) => structure.type === 'Church');
    },

    churchOptions() {
      return this.churches.map((church) => ({
        title: `${church.name} ${church.town ? '- ' + church.town : ''}`,
        value: church.id,
      }));
    },

    selectedChurch() {
      if (!this.churches.length) {
        return {};
      }

      return (
          this.churches.find((church) => church.id === this.selectedChurchId) ||
          this.churches[0]
      );
    },

    getChurchLogo() {
      if (this.selectedChurch?.id) {
        return `/logos/${this.selectedChurch.id}.png`;
      }

      return '';
    },

    fullAddress() {
      const parts = [
        this.selectedChurch.address_1,
        this.selectedChurch.address_2,
        this.selectedChurch.zipcode,
        this.selectedChurch.town,
      ].filter(Boolean);

      return parts.length ? parts.join(', ') : 'Non renseignée';
    },

    googleMapsUrl() {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(this.fullAddress)}`;
    },
  },

  methods: {
    formatDate(value) {
      if (!value) {
        return '';
      }

      return moment(value).format('DD/MM/YYYY');
    },

    getFriendlyId(id) {
      if (!id) {
        return '';
      }

      return id.toString().padStart(5, '0');
    },

    getStructureTypeLabel(type) {
      if (type === 'Church') {
        return 'Église';
      }

      if (type === 'Association') {
        return 'Association';
      }

      return type || 'Non renseigné';
    },

    normalizedWebsite(website) {
      if (!website) {
        return '';
      }

      if (website.startsWith('http://') || website.startsWith('https://')) {
        return website;
      }

      return `https://${website}`;
    },

    editChurch() {
      this.$router.push({
        name: 'StructureEdit',
        params: { id: this.selectedChurch.id },
      });
    },
  },

  beforeMount() {
    this.$store.dispatch('profileStore/getProfile').then(() => {
      if (this.churches.length > 0) {
        this.selectedChurchId = this.churches[0].id;
      }
    });
  },
};
</script>

<style scoped>
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

.structureInfos {
  position: relative;
  z-index: 1;
  text-align: center;
}

a {
  color: inherit;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>