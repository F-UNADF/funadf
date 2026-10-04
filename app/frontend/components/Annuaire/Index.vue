<template>
  <div>
    <v-text-field v-model="search" :loading="loading" variant="outlined" density="comfortable"
      label="Rechercher dans l’annuaire" placeholder="Nom, prénom, ville ou code postal"
      prepend-inner-icon="mdi-magnify" hide-details="auto" clearable class="annuaire__search mb-6"
      :hint="hint" persistent-hint @update:model-value="searching()"></v-text-field>

    <v-alert v-if="error" type="error" variant="tonal" class="mb-4">
      La recherche n’a pas abouti. Vérifiez votre connexion puis réessayez.
    </v-alert>

    <div v-else-if="searched && !loading && annuaires.length === 0" class="list-empty">
      <v-icon size="40" color="grayLight">mdi-account-search-outline</v-icon>
      <p class="text-subtitle-1 font-weight-medium mt-2 mb-1">Aucun résultat pour « {{ searched }} »</p>
      <p class="text-body-2 text-medium-emphasis">Vérifiez l’orthographe ou essayez avec la ville ou le code postal.</p>
    </div>

    <v-row v-else>
      <v-col v-for="result in annuaires" :key="result.id" cols="12" sm="6" lg="4" xl="3">
        <v-card class="h-100" variant="outlined">
          <v-card-item>
            <template v-slot:prepend>
              <v-avatar size="48" color="grayLighter">
                <v-img v-if="result.photo_url" :src="result.photo_url" alt="" cover></v-img>
                <v-icon v-else color="primary">{{ result.mdi || 'mdi-account' }}</v-icon>
              </v-avatar>
            </template>
            <v-card-title class="text-subtitle-1 font-weight-bold text-wrap">{{ result.name }}</v-card-title>
            <v-card-subtitle v-if="result.zipcode && result.town">{{ result.zipcode + ' ' + result.town }}</v-card-subtitle>
          </v-card-item>
          <v-list density="compact" class="pt-0">
            <v-list-item v-if="result.level" prepend-icon="mdi-tag-outline" :title="result.level"></v-list-item>
            <v-list-item v-if="result.email" prepend-icon="mdi-email-outline" :title="result.email"
              :href="'mailto:' + result.email" :aria-label="`Écrire à ${result.name} : ${result.email}`"></v-list-item>
            <v-list-item v-if="result.phone" prepend-icon="mdi-phone-outline" :title="result.phone"
              :href="'tel:' + String(result.phone).replace(/\s/g, '')" :aria-label="`Appeler ${result.name} : ${result.phone}`"></v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from 'axios';


export default {
  name: "AnnuaireIndex",
  computed: {
    hint() {
      const length = (this.search || '').trim().length;
      if (length > 0 && length < 3) {
        return 'Saisissez au moins 3 caractères.';
      }
      if (!this.searched) {
        return 'Saisissez au moins 3 caractères pour lancer la recherche.';
      }
      return '';
    },
  },
  methods: {
    searching() {
      clearTimeout(this.timer);
      const query = (this.search || '').trim();
      if (query.length < 3) {
        this.annuaires = [];
        this.searched = '';
        this.error = false;
        return;
      }

      this.timer = setTimeout(() => {
        this.loading = true;
        this.error = false;
        axios.get('/api/search', {
          params: {
            query: query
          }
        }).then(response => {
          this.annuaires = response.data;
          this.searched = query;
        }).catch(() => {
          this.error = true;
        }).finally(() => {
          this.loading = false;
        });
      }, 300);
    },
  },
  data() {
    return {
      loading: false,
      error: false,
      annuaires: [],
      search: "",
      searched: "",
      timer: null,
    };
  },
}

</script>

<style scoped>
.annuaire__search {
  max-width: 640px;
}
</style>
