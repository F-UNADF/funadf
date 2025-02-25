<template>
  <v-card>
    <v-card-title class="bg-primary text-white">
      <v-btn @click="this.$emit('close')" icon size="small" color="white" variant="outlined" class="mr-5">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      Modifier un document
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="12">
          <v-text-field v-model="this.document.name" label="Nom" :rules="[rules.required]" required>
          </v-text-field>
        </v-col>
        <v-col cols="12" md="12">
          <v-textarea v-model="document.description" label="description" required>
          </v-textarea>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions class="bg-primary-lighten-5">
      <v-spacer></v-spacer>
      <v-btn color="red" @click="this.$emit('close')">Annuler</v-btn>
      <v-btn color="blue" @click="save()">Enregistrer</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import moment from "moment";
import axios from "axios";

export default {
  name: "DocumentForm",
  props: {
    document: Object,
  },
  methods: {
    save: function () {
      axios
          .put(`/api/documents/${this.document.id}`, {
            name: this.document.name,
            description: this.document.description,
          })
          .then((response) => {
            this.$emit("close");
          })
          .catch((error) => {
            console.log(error);
          });
    },
  },
  data() {
    return {
      rules: {
        required: value => !!value || 'Champ obligatoire',
      },
    };
  },
}
</script>

<style scoped></style>