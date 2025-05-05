<template>
  <v-container>
    <h1 class="mb-5">Documents</h1>

    <v-list>
      <nested-document
          v-for="item in items" :key="item.id"
          :item="item"
          @downloadDocument="downloadDocument"
      >
      </nested-document>
    </v-list>

  </v-container>
</template>

<script>
import NestedDocument from "./nested-document.vue";
import axios from "axios";
import NestedDraggable from "~/components/Documents/nested-draggable.vue";

export default {
  name: 'MeDocumentsIndex',
  components: {
    NestedDraggable,
    NestedDocument,
    axios
  },
  methods: {
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
    downloadDocument(activeItems) {
      if (activeItems?.href) {
        window.open(activeItems.href, "_blank"); // Ouvrir le fichier
      }
    },
  },
  data() {
    return {
      items: [],
    };
  },
  mounted() {
    this.refreshItems();
  },
}
</script>

<style scoped>

</style>