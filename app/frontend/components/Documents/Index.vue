<template>
  <v-container>
    <h1 class="mb-5">Documents</h1>

    <v-row>
      <v-col md="4">

        <v-card class="mb-5" color="white">
          <v-card-title>
            {{ (localCategory.id) ? 'Modifier' : 'Ajouter' }} une catégorie
          </v-card-title>
          <v-card-text>
            <v-text-field
                v-model="localCategory.name"
                label="Nom de la catégorie"
                dense
                outlined
                clearable
                @keyup.enter="saveCategory"
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn v-if="localCategory.id" color="warning" variant="flat" @click="localCategory = {}">
              Annuler
            </v-btn>
            <v-btn color="success" variant="flat" @click="saveCategory">
              {{ (localCategory.id) ? 'Modifier' : 'Ajouter' }}
            </v-btn>
          </v-card-actions>
        </v-card>

        <v-file-upload
            @update:modelValue="handleFileUpload"
            clearable
            density="dense"
            multiple
            browse-text="Parcourez vos fichiers"
            divider-text="ou"
            icon="mdi-upload"
            title="Déplacez vos fichiers ici"
        >
        </v-file-upload>

        <v-btn color="success" @click="submitFiles" class="mt-3">
          Envoyer
        </v-btn>
      </v-col>

      <v-col md="8">
        <v-list>
          <draggable
              class="list-group"
              :list="items"
              group="categories"
              itemKey="order"
              handle=".handle"
              @update="updateItems"
          >
            <nested-draggable
                v-for="item in items" :key="item.id"
                :item="item"
                @change="updateItems"
                @downloadDocument="downloadDocument"
                @updateDocument="updateDocument"
                @deleteDocument="deleteDocument"
                @updateCategory="updateCategory"
                @deleteCategory="deleteCategory"
            >
            </nested-draggable>

            <v-list-item v-if="!items.length" class="border-dashed">
              Glissez ici une catégorie...
            </v-list-item>
          </draggable>
        </v-list>
      </v-col>
    </v-row>


    <v-dialog v-model="dialog.update" width="650">
      <document-form :document="localDocument" @close="close"></document-form>
    </v-dialog>


  </v-container>
</template>

<script>
import {VFileUpload} from 'vuetify/labs/VFileUpload'
import {VueDraggableNext} from 'vue-draggable-next'
import axios from "axios";
import NestedDraggable from "./nested-draggable.vue";
import DocumentForm from "./Form.vue";

export default {
  name: 'DocumentsIndex',
  components: {
    DocumentForm,
    VFileUpload,
    draggable: VueDraggableNext,
    NestedDraggable,
  },
  methods: {
    close() {
      this.dialog.update = false;
      this.refreshItems();
    },
    downloadDocument(activeItems) {
      if (activeItems?.href) {
        window.open(activeItems.href, "_blank"); // Ouvrir le fichier
      }
    },
    updateItems() {
      // on envoie au back
      axios.post("/api/update_order_documents", {items: this.items})
          .then((res) => {
            this.refreshItems();
          })
          .catch((error) => {
            console.error(error);
          });
    },
    refreshItems() {
      axios
          .get("/api/documents", {})
          .then((res) => {
            this.items = res.data;
          })
          .catch((error) => {
            console.error(error);
          });
    },
    updateDocument(document) {
      this.localDocument = document;
      this.dialog.update = true;
    },
    deleteDocument(document) {
      axios
          .delete("/api/documents/" + document.id)
          .then((res) => {
            this.refreshItems();
          })
          .catch((error) => {
            console.error(error);
          });
    },
    updateCategory(category) {
      this.localCategory = category;
    },
    handleFileUpload(files) {
      for (let i = 0; i < files.length; i++) {
        this.filesToUpload.push(files[i]);
      }
    },
    submitFiles() {
      if (null === this.filesToUpload) {
        this.$root.showSnackbar("Vous devez sélectionner au moins un fichier !", 'warning');
        return;
      }

      const formData = new FormData();
      for (let i = 0; i < this.filesToUpload.length; i++) {
        formData.append('files[]', this.filesToUpload[i]);
      }

      this.$store.dispatch('documentsStore/upload', formData).then(() => {
        this.filesToUpload = null;
        this.refreshItems();
      });
    },
    saveCategory() {
      if (this.localCategory.name === '') {
        this.$root.showSnackbar("Vous devez saisir un nom de catégorie !", 'warning');
        return;
      }

      // On cree un formData category[name]
      const formData = new FormData();
      formData.append('category[name]', this.localCategory.name);

      axios[!this.localCategory.id ? 'post' : 'put']("/api/categories" + (this.localCategory.id ? '/' + this.localCategory.id : ''), formData)
          .then((res) => {
            this.localCategory = {};
            this.refreshItems();
          })
          .catch((error) => {
            console.error(error);
          });
    },
    deleteCategory(category) {
      // Confirmation de l'utilisateur
      if (!confirm("Voulez-vous vraiment supprimer cette catégorie ?")) {
        return;
      }

      axios
          .delete("/api/categories/" + category.id)
          .then((res) => {
            this.refreshItems();
          })
          .catch((error) => {
            console.error(error);
          });
    },
    log(event) {
      console.log(this.items);
    },
  },
  data() {
    return {
      filesToUpload: [],
      newCategory: '',
      items: [],
      dialog: {
        update: false,
      },
      localDocument: {},
      localCategory: {},
    };
  },
  mounted() {
    this.refreshItems();
  },
}
</script>

<style scoped>

</style>