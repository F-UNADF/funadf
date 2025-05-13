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
      <v-row>
        <v-col cols="12" md="12">
          <v-text-field v-model="editedItem.title" label="Titre"></v-text-field>
        </v-col>
        <v-col cols="12" md="12">
          <v-textarea v-model="editedItem.body" label="Message"></v-textarea>
        </v-col>
        <v-col cols="12" md="12">
          <v-text-field v-model="editedItem.url" label="Url"></v-text-field>
        </v-col>
        <v-col cols="12" md="12">
          <select-all :options="referentiels.levels" v-model="editedItem.accesses"></select-all>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions class="bg-blue-lighten-5">
      <v-spacer></v-spacer>
      <v-btn color="red" @click="close()">Annuler</v-btn>
      <v-btn color="blue" @click="save()">Enregistrer</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import {mapGetters} from "vuex";
import moment from "moment";
import SelectAll from "../Tools/SelectAll.vue";

export default {
  name      : "PushNotificationForm",
  components: {SelectAll},
  computed  : {
    ...mapGetters('pushNotificationsStore', {
      item        : 'getItem',
      formLoading : 'getFormLoading',
      dialogForm  : 'getDialogForm',
      referentiels: 'getReferentiels',
    }),
    getTitle() {
      return (this.editedItem.id === null) ? "Ajouter une notification" : "Modifier une notification";
    },
  },
  methods   : {
    close     : function () {
      this.$store.dispatch('pushNotificationsStore/items');
      this.$store.commit('pushNotificationsStore/setDialogForm', false);
      this.$store.commit('pushNotificationsStore/setItem', {});
    },
    getIsoDate: function (value) {
      return moment(value).format('YYYY-MM-DD');
    },
    save      : function () {
      this.$store.dispatch('pushNotificationsStore/save', {
        push_notification: this.editedItem
      }).then(response => {
        this.$root.showSnackbar('Notification enregistrée avec succès', 'success');
        this.close();
      }, error => {
        this.$root.showSnackbar('Un probleme est survenu lors de l\'enregistrement de la notification', 'error');
        let errors = error.response.data.errors;
        this.$root.showSnackbar(errors.join('<br/>'), 'error');
      });
    },
  },
  watch     : {
    item: {
      deep     : true,
      immediate: true,
      handler  : function () {
        this.editedItem = JSON.parse(JSON.stringify(this.item));
      },
    },
  },

  data() {
    return {
      editedItem   : {},
      search       : '',
      matchingUsers: [],
      rules        : {
        required: value => !!value || 'Champ obligatoire',
      },
    };
  },

}
</script>
