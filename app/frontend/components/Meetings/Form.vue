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
        <v-tab value="attendees" v-if="this.editedItem.id">Participants</v-tab>
      </v-tabs>

      <v-window v-model="tab">
        <v-window-item key="infos" value="infos">
          <v-row>
            <v-col cols="12" md="12">
              <v-text-field v-model="editedItem.name" label="Nom" :rules="[rules.required]" required>
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="editedItem.begin_at" type="date" label="Date de début">
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="editedItem.end_at" type="date" label="Date de fin">
              </v-text-field>
            </v-col>
            <v-col cols="12" md="12">
              <v-text-field v-model="editedItem.description" label="Description">
              </v-text-field>
            </v-col>
          </v-row>
        </v-window-item>
        <v-window-item key="attendees" value="attendees">
          <v-data-table v-model="this.deletingAttendees" :headers="headers" :items="this.attendees" density="compact"
            class="elevation-1" show-select>
            <template v-slot:top>
              Nombre de participants : {{ this.attendees.length }}
              <br>
              Nombre de participants sélectionnés : {{ this.deletingAttendees.length }}
              <v-btn variant="text" color="blue"
                @click="deletingAttendees = this.attendees.map(attendee => attendee.id)">Selectionner
                tout</v-btn>
              <v-btn variant="text" color="red" @click="deletingAttendees = []">Déselectionner tout</v-btn>
            </template>
            <template v-slot:item="{ item }">
              <tr>
                <td>
                  <v-checkbox hide-details density="compact" v-model="this.deletingAttendees"
                    :value="item.id"></v-checkbox>
                </td>
                <td>{{ item.id }}</td>
                <td>{{ item.lastname }} {{ item.firstname }}</td>
              </tr>
            </template>
          </v-data-table>

          <div class="pa-6 bg-grey-lighten bg-grey-lighten-4">
            <h3 class="mb-3 pb-3">Ajouter des participants :</h3>
            <v-autocomplete v-model="addingAttendees" :items="this.referentiels.users" :item-value="item => item.id"
              :item-title="item => item.lastname + ' ' + item.firstname" hide-no-data hide-details required multiple
              closable-chips chips label="Ajouter un participant">
              <template v-slot:chip="{ props, item }">
                <v-chip v-bind="props">
                  {{ item.title }}
                </v-chip>
              </template>
            </v-autocomplete>

            <v-btn color="primary" class="mt-5" @click="addAttendee">
              Ajouter les membres
            </v-btn>

            <v-btn color="red" class="mt-5 ml-5" @click="removeAttendees" v-if="deletingAttendees.length > 0">
              Supprimer les membres
            </v-btn>

            <v-btn color="grey" class="mt-5 ml-5" @click="fileImportForm = !fileImportForm">Importer un fichier</v-btn>

            <div class="mt-3" v-if="this.addingAttendeesFromImport.length > 0">
              Nombre de participants importé depuis le fichier :
              {{ this.addingAttendeesFromImport.length }}
              <v-alert type="info" class="mt-3" dense>
                <strong>Attention</strong> : Les participants importés ne seront pas ajoutés à la liste des participants
                avant que vous cliquiez sur "Ajouter les membres"
              </v-alert>
            </div>
          </div>
        </v-window-item>
      </v-window>
    </v-card-text>
    <v-card-actions class="bg-blue-lighten-5">
      <v-spacer></v-spacer>
      <v-btn color="red" @click="close()">Annuler</v-btn>
      <v-btn color="blue" @click="save()">Enregistrer</v-btn>
    </v-card-actions>


    <v-dialog v-model="fileImportForm" max-width="50%">
      <file-import-form @close="fileImportForm = false"
        @import="(ids) => addingAttendeesFromImport = ids"></file-import-form>>
    </v-dialog>

  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
import { VDataTable } from 'vuetify/labs/VDataTable'
import FileImportForm from './Import/File.vue'

export default {
  name: "MeetingForm",
  components: { VDataTable, FileImportForm },
  computed: {
    ...mapGetters('meetingsStore', {
      items: 'getItems',
      item: 'getItem',
      attendees: 'getAttendees',
      formLoading: 'getFormLoading',
      dialogForm: 'getDialogForm',
      referentiels: 'getReferentiels',
    }),
    getTitle() {
      return (this.editedItem.id === null) ? "Ajouter un rassemblement" : "Modifier un rassemblement";
    },
  },
  methods: {
    closeFileImportForm() {
      this.fileImportForm = false;
    },
    close: function () {
      this.$store.commit('meetingsStore/setDialogForm', false);
      this.$store.commit('meetingsStore/setItem', {});
    },
    save: function () {
      this.$store.dispatch('meetingsStore/save', { meeting: this.editedItem }).then(response => {
        this.$root.showSnackbar('Rassemblement enregistré avec succès', 'success');
        this.close();
      }, error => {
        this.$root.showSnackbar('Un probleme est survenu lors de l\'enregistrement du rassemblement', 'error');
        let errors = error.response.data.errors;
        this.$root.showSnackbar(errors.join('<br/>'), 'error');
      });
    },
    addAttendee: function () {
      // merged addingAttendees and addingAttendeesFromImport
      let ids = this.addingAttendees.concat(this.addingAttendeesFromImport);
      this.$store.dispatch('meetingsStore/addAttendees', { meeting: this.editedItem, attendees: ids }).then(response => {
        this.$root.showSnackbar('Participants ajoutés avec succès', 'success');
        this.addingAttendees = [];
        this.addingAttendeesFromImport = [];
      }, error => {
        this.$root.showSnackbar('Un probleme est survenu lors de l\'ajout des participants', 'error');
      });
    },
    removeAttendees: function () {
      this.$store.dispatch('meetingsStore/removeAttendees', { meeting: this.editedItem, attendees: this.deletingAttendees }).then(response => {
        this.$root.showSnackbar('Participants supprimés avec succès', 'success');
        this.deletingAttendees = [];
      }, error => {
        this.$root.showSnackbar('Un probleme est survenu lors de la suppression des participants', 'error');
      });
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
      tab: 'infos',
      addingAttendees: [],
      addingAttendeesFromImport: [],
      deletingAttendees: [],
      fileImportForm: false,
      headers: [
        { title: 'ID', key: 'id', sortable: true },
        { title: 'Nom', key: 'lastname', sortable: true },
      ],
      rules: {
        required: value => !!value || 'Champ obligatoire',
      },
    };
  },
}
</script>

<style scoped>
.v-input__slot {
  align-items: center;
  justify-content: center;
}
</style>