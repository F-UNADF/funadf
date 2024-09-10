<template>
  <v-progress-circular v-if="formLoading" indeterminate color="primary"></v-progress-circular>
  <v-card v-else>
    <v-card-title class="bg-blue text-white">
      <v-btn @click="close()" icon size="small" color="white" variant="outlined" class="mr-5">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      {{ this.getTitle }}
    </v-card-title>
    <v-card-text>
      <v-tabs color="primary" class="mb-3" align-tabs="center" v-model="tab">
        <v-tab value="infos">Informations générales</v-tab>
      </v-tabs>

      <v-window v-model="tab">
        <v-window-item key="infos" value="infos" class="py-3">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field v-model="editedItem.title" label="Nom" :rules="[rules.required]"
                hint='Exemple : "Pastorale Ressource 18/09", "Congrès National"...' persistent-hint required>
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete v-model="editedItem.structure_id" :items="referentiels.structures" item-value="id"
                item-title="name" label="Structure">
              </v-autocomplete>
            </v-col>
            <v-col cols="12" md="6">
              <v-combobox v-model="editedItem.category" :items="referentiels.categories.map((item) => item.name)"
                label="Catégorie" :rules="[rules.required]"
                hint="Si la catégorie n'existe pas, vous pouvez écrire le nom de la catégorie et appuyer sur 'Entrée' pour la créer."
                persistent-hint chips clearable required>
              </v-combobox>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field v-model="editedItem.start_at" type="datetime-local" label="Date et heure de début"
                :rules="[rules.required]" hint="Exemple : 18/09/2021 09:00" :value="getIsoDate(editedItem.start_at)"
                persistent-hint required>
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="editedItem.end_at" type="datetime-local" label="Date et heure de fin"
                :rules="[rules.required]" :value="getIsoDate(editedItem.end_at)" hint="Exemple : 18/09/2021 09:00"
                persistent-hint required>
              </v-text-field>
            </v-col>

            <v-col cols="12" md="12">
              <!-- Textarea field -->
              <v-textarea v-model="editedItem.description" label="Description de l'événement" :rules="[rules.required]"
                required rows="3">
              </v-textarea>
            </v-col>

            <v-col cols="12" md="12">
              <v-file-input v-model="files" show-size counter multiple label="Pièces jointes"></v-file-input>

              <v-list lines="one">
                <v-list-item v-for="file in editedItem.files" :key="file.id">
                  <template v-slot:prepend>
                    <v-btn icon size="small" @click="downloadFile(file.url)">
                      <v-icon small color="green">mdi-download</v-icon>
                    </v-btn>
                  </template>
                  <v-list-item-title>{{ file.name }}</v-list-item-title>
                  <template v-slot:append>
                    <v-btn icon size="small" @click="deleteFile(file.id)">
                      <v-icon small color="red">mdi-delete</v-icon>
                    </v-btn>
                  </template>
                </v-list-item>
              </v-list>

              <select-all :options="referentiels.levels" v-model:selected="editedItem.accesses"></select-all>
            </v-col>
          </v-row>
        </v-window-item>
      </v-window>
    </v-card-text>
    <v-card-actions class="bg-blue-lighten-5">
      <v-spacer></v-spacer>
      <v-btn color="red" @click="close()">Annuler</v-btn>
      <v-btn color="blue" @click="save()">Enregistrer</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";
import SelectAll from "@/components/Tools/SelectAll.vue";

export default {
  name: "EventForm",
  components: { SelectAll },
  computed: {
    ...mapGetters('eventsStore', {
      items: 'getItems',
      item: 'getItem',
      formLoading: 'getFormLoading',
      dialogForm: 'getDialogForm',
      referentiels: 'getReferentiels',
    }),
    getTitle() {
      return (this.editedItem.id === null) ? "Ajouter un événement" : "Modifier un événement";
    },
  },
  methods: {
    close: function () {
      this.$store.commit('eventsStore/setDialogForm', false);
      this.$store.commit('eventsStore/setItem', {});
    },
    save: function () {
      this.$store.dispatch('eventsStore/save', { event: this.editedItem, files: this.files }).then(response => {
        this.$root.showSnackbar('Événement enregistré avec succès', 'success');
        this.close();
      }, error => {
        this.$root.showSnackbar('Un probleme est survenu lors de l\'enregistrement de l\'événement', 'error');
      });
    },
    getIsoDate: function (value) {
      return moment(value).format('YYYY-MM-DDTHH:mm');
    },
    deleteFile: function (file_id) {
      this.$store.dispatch('eventsStore/deleteFile', file_id).then(response => {
        // remove file from list
        this.editedItem.files = this.editedItem.files.filter(function (file) {
          return file.id !== file_id;
        });
        this.$root.showSnackbar('Pièce jointe supprimée avec succès', 'success');
      }, error => {
        this.$root.showSnackbar('Un probleme est survenu lors de la suppression de la pièce jointe', 'error');
        let errors = error.response.data.errors;
        this.$root.showSnackbar(errors.join('<br/>'), 'error');
      });
    },
    downloadFile: function (url) {
      window.open(url, '_blank');
    },
  },
  watch: {
    item: {
      deep: true,
      immediate: true,
      handler: function () {
        this.editedItem = JSON.parse(JSON.stringify(this.item));
      },
    },
  },

  data() {
    return {
      editedItem: {},
      search: '',
      tab: 'infos',
      files: [],
      rules: {
        required: value => !!value || 'Champ obligatoire',
      },
    };
  },
}
</script>

<style scoped></style>