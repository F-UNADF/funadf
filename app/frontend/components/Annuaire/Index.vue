<template>
  <v-container>
    <v-card color="transparent" class="mb-5">
      <v-text-field :loading="loading" density="compact" variant="solo" label="Nom, Prenom, Ville, Code postal..."
        prepend-inner-icon="mdi-magnify" single-line hide-details v-model="search" @input="searching()"></v-text-field>
    </v-card>

    <v-row>
      <v-col v-for="result in annuaires" :key="result.id" cols="12" md="6" lg="3">
        <v-card class="mx-auto h-100" :title="result.name" :prepend-icon="result.mdi" :append-avatar="result.photo_url">
          <template v-slot:subtitle>
            <span v-if="result.zipcode && result.town">{{ result.zipcode + ' - ' + result.town }}</span>
          </template>
          <!-- Create list of contact info email + phone -->
          <v-list density="compact">
            <v-list-item prepend-icon="mdi-tag" :title="result.level" v-if="result.level">
            </v-list-item>
            <v-list-item prepend-icon="mdi-email" :title="result.email" v-if="result.email">
            </v-list-item>
            <v-list-item prepend-icon="mdi-phone" :title="result.phone" v-if="result.phone">
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';


export default {
  name: "AnnuaireIndex",
  methods: {
    searching() {
      if (this.search.length < 3) return;
      this.loading = true;

      // request to /api/annuaire
      axios.get('/api/search', {
        params: {
          query: this.search
        }
      }).then(response => {
        console.log(response.data);
        this.annuaires = response.data;
        this.loading = false;
      }).catch(error => {
        console.log(error);
      });
    },
  },
  data() {
    return {
      loading: false,
      annuaires: [],
      search: "",
    };
  },
}

</script>

<style scoped></style>