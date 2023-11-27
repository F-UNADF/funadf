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
          <v-text-field
              v-model="editedItem.friendly_name"
              label="Nom"
              :rules="[rules.required]"
              required>
          </v-text-field>

          <v-text-field
              v-model="editedItem.name"
              label="Slug"
              disabled
              :rules="[rules.required]"
              required>
          </v-text-field>

          <v-text-field
              v-model="editedItem.short_descriptions"
              label="Description"
              :rules="[rules.required]"
              required>
          </v-text-field>
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
import {VueEditor} from "vue3-editor";

export default {
  name:     "RoleForm",
  computed: {
    ...mapGetters('rolesStore', {
      items:       'getItems',
      item:        'getItem',
      formLoading: 'getFormLoading',
      dialogForm:  'getDialogForm',
    }),
    getTitle() {
      return (this.editedItem.id === null) ? "Ajouter un rôle" : "Modifier un rôle";
    },
  },
  methods:  {
    close: function () {
      this.$store.commit('rolesStore/setDialogForm', false);
      this.$store.commit('postsStore/setItem', {});
    },
    save:  function () {
      this.$store.dispatch('rolesStore/save', {role: this.editedItem}).then(response => {
        this.$root.showSnackbar('Rôle enregistré avec succès', 'success');
        this.close();
      }, error => {
        this.$root.showSnackbar('Un probleme est survenu lors de l\'enregistrement du rôle', 'error');
        let errors = error.response.data.errors;
        this.$root.showSnackbar(errors.join('<br/>'), 'error');
      });
    },
  },
  watch:    {
    item:       {
      deep:      true,
      immediate: true,
      handler:   function () {
        this.editedItem = JSON.parse(JSON.stringify(this.item));
      },
    },
    editedItem: {
      deep:      true,
      immediate: true,
      handler:   function () {
        if (this.editedItem.id === null && this.editedItem.friendly_name !== undefined) {
          // it should remove special characters and replace spaces with underscore
          // and replace accent characters with their non-accented equivalent
          this.editedItem.name = this.editedItem.friendly_name
              .toLowerCase()
              .replace(/ /g, '_')
              .normalize('NFD').replace(/[^\w-]+/g, '');
        }
      },
    },
  },

  data() {
    return {
      editedItem: {},
      tab:        'infos',
      rules:      {
        required: value => !!value || 'Champ obligatoire',
      },
    };
  },
}
</script>
