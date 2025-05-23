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
              <v-text-field v-model="editedItem.title" label="Titre" :rules="[rules.required]" required>
              </v-text-field>
            </v-col>
            <v-col class="12" md="6" v-if="userIsAdmin()">
              <v-checkbox v-model="editedItem.pinned" label="Épinglé l'actualité"></v-checkbox>
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete v-model="editedItem.structure_id" :items="referentiels.structures" item-value="id"
                item-title="name" label="Structure">
              </v-autocomplete>
            </v-col>
            <v-col cols="12" md="12" style="padding-bottom:70px;">
              <vue-editor v-model="editedItem.content">
              </vue-editor>
            </v-col>
            <v-col cols="12" md="12">
              <v-file-input v-model="files" hide-details show-size counter multiple
                label="Pièces jointes"></v-file-input>

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
            </v-col>
            <v-col cols="12" md="12">
              <select-all :options="referentiels.levels" v-model="editedItem.accesses"></select-all>
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
import { VueEditor } from "vue3-editor";
import SelectAll from '../Tools/SelectAll.vue';

export default {
  name: "PostForm",
  components: { SelectAll, VueEditor },
  computed: {
    ...mapGetters('postsStore', {
      items: 'getItems',
      item: 'getItem',
      formLoading: 'getFormLoading',
      dialogForm: 'getDialogForm',
      referentiels: 'getReferentiels',
    }),
    ...mapGetters('sessionStore', {
      roles: 'roles',
    }),
    getTitle() {
      return (this.editedItem.id === null) ? "Ajouter une actu" : "Modifier une actu";
    },
  },
  methods: {
    close: function () {
      this.$store.commit('postsStore/setDialogForm', false);
      this.$store.commit('postsStore/setItem', {});
    },
    save: function () {
      this.$store.dispatch('postsStore/save', {
        post: this.editedItem,
        files: this.files
      }).then(response => {
        this.$root.showSnackbar('Actu enregistrée avec succès', 'success');
        this.$emit('refresh');
        this.close();
      }, error => {
        this.$root.showSnackbar('Un probleme est survenu lors de l\'enregistrement de l\'actu', 'error');
        let errors = error.response.data.errors;
        this.$root.showSnackbar(errors.join('<br/>'), 'error');
      });
    },
    deleteFile: function (file_id) {
      this.$store.dispatch('postsStore/deleteFile', file_id).then(response => {
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
    userIsAdmin(){
      return this.roles.includes('admin');
    }
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
