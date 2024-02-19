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
        <v-tab value="attendees">Participants</v-tab>
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
          <v-data-table :headers="headers" :items="this.attendees" density="compact" class="elevation-1">
            <template v-slot:item="{ item }">
              <tr>
                <td>{{ item.id }}</td>
                <td>{{ item.lastname }} {{ item.firstname }}</td>
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
          </div>
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
import { VDataTable } from 'vuetify/labs/VDataTable'

export default {
  name: "MeetingForm",
  components: { VDataTable },
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
      console.log(this.addingAttendees);
      this.$store.dispatch('meetingsStore/addAttendees', { meeting: this.editedItem, attendees: this.addingAttendees }).then(response => {
        this.$root.showSnackbar('Participants ajoutés avec succès', 'success');
        this.addingAttendees = [];
      }, error => {
        this.$root.showSnackbar('Un probleme est survenu lors de l\'ajout des participants', 'error');
      });
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
      tab: 'infos',
      addingAttendees: [],
      headers: [
        { title: 'ID', key: 'id', sortable: true },
        { title: 'Nom', key: 'lastname', sortable: true },
        { title: 'Actions', key: 'actions', sortable: false },
      ],
      rules: {
        required: value => !!value || 'Champ obligatoire',
      },
    };
  },
}
</script>
