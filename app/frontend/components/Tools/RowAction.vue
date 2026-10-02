<template>
  <!-- Bouton-icône de ligne de tableau : focusable au clavier, nommé pour les lecteurs d'écran, avec infobulle -->
  <v-tooltip location="top" :text="label">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" :icon="icon" :color="color" variant="text" size="small" :aria-label="label"
        :loading="loading" @click.stop="$emit('click')"></v-btn>
    </template>
  </v-tooltip>
</template>

<script>
export default {
  name: "RowAction",
  emits: ["click"],
  props: {
    icon: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: "primary",
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
