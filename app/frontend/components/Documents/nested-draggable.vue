<template>
  <v-list-group>

    <template #activator="{ props, isOpen }">
      <v-list-item>
        <template v-slot:prepend>
          <v-icon v-if="item.id > -1" class="handle">mdi-menu</v-icon>
          <v-icon>
            {{ isOpen ? 'mdi-folder-open' : 'mdi-folder' }}
          </v-icon>
        </template>
        <v-list-item-title>
          {{ item.name }} ({{item.documents.length + item.categories.length}})
        </v-list-item-title>
        <template v-slot:append>
          <!-- Bouton Collapse/Expand -->
          <v-btn size="small" variant="text" icon @click="props.onClick">
            <v-icon>{{ isOpen ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
          </v-btn>

          <v-btn v-if="item.id > -1" size="small" variant="text" icon color="success" @click="$emit('updateCategory', item)">
            <v-icon>mdi-pen</v-icon>
          </v-btn>
          <v-btn v-if="item.id > -1" size="small" variant="text" icon color="warning" @click="$emit('deleteCategory', item)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-list-item>
    </template>


    <draggable
        class="list-group"
        :list="item.categories"
        group="categories"
        itemKey="order"
        handle=".handle"
        @change="$emit('change')"
    >
      <nested-draggable
          v-if="item.categories.length>0"
          v-for="child in item.categories"
          :key="child.id"
          :item="child"
          v-on:change="$emit('change')"
      />

      <v-list-item v-if="!item.categories.length && item.id !== -1" class="border-sm border-dashed bg-grey-lighten-3">
        Glissez ici une sous-catégorie...
      </v-list-item>
    </draggable>

    <draggable
        class="list-group"
        :list="item.documents"
        group="documents"
        itemKey="order"
        handle=".handle"
        @change="$emit('change')"
    >
      <v-list-item
          v-if="item.documents.length>0"
          v-for="child in item.documents"
          :key="child.id"
      >
        <template v-slot:prepend>
          <v-icon class="handle">mdi-menu</v-icon>
        </template>
        <v-list-item-title>
          {{ child.name }}
          <span v-if="child.description !== null" class="text-grey text-caption">({{ extrait(child.description) }})</span>
        </v-list-item-title>
        <template v-slot:append>
          <v-btn size="small" variant="text" icon color="primary" @click="$emit('downloadDocument', child)">
            <v-icon>
              {{ child.type === 'url' ? 'mdi-link' : 'mdi-download' }}
            </v-icon>
          </v-btn>
          <v-btn size="small" variant="text" icon color="success" @click="$emit('updateDocument', child)">
            <v-icon>mdi-pen</v-icon>
          </v-btn>
          <v-btn size="small" variant="text" icon color="warning" @click="$emit('deleteDocument', child)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-list-item>

      <v-list-item v-if="!item.documents.length" class="border-sm border-dashed bg-grey-lighten-4">
        Glissez ici un document...
      </v-list-item>
    </draggable>
  </v-list-group>
</template>

<script>
import {VueDraggableNext} from 'vue-draggable-next'

export default {
  components: {
    draggable: VueDraggableNext,
  },
  props: {
    item: Object,
  },
  computed: {
    extrait() {
      return (description) => {
        return description.length > 50 ? description.substring(0, 50) + '...' : description;
      }
    }
  },
  name: 'NestedDraggable',
}

</script>

<style scoped>
.handle {
  cursor: grab;
}
</style>