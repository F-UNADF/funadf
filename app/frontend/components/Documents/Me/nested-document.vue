<template>
  <v-list-group>

    <template #activator="{ props, isOpen }">
      <v-list-item :value="props.value"
                   v-bind="props">
        <template v-slot:prepend>
          <v-icon>
            {{ isOpen ? 'mdi-folder-open' : 'mdi-folder' }}
          </v-icon>
        </template>
        <v-list-item-title>
          {{ item.name }} ({{item.documents.length + item.categories.length}})
        </v-list-item-title>
      </v-list-item>
    </template>


    <nested-document
        v-if="item.categories.length>0"
        v-for="child in item.categories"
        :key="child.id"
        :item="child"
    />

    <v-list-item
        v-if="item.documents.length>0"
        v-for="child in item.documents"
        :key="child.id"
        @click="$emit('downloadDocument', child)"
    >
      <template v-slot:prepend>
        <v-icon>
          {{ (child.type === 'url')?'mdi-link':'mdi-download'}}
        </v-icon>
      </template>
      <v-list-item-title>
        {{ child.name }}
        <span v-if="child.description !== null" class="text-grey text-caption">({{ extrait(child.description) }})</span>
      </v-list-item-title>
    </v-list-item>
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