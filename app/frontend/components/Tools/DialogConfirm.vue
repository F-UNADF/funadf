<template>
  <v-card>
    <v-card-title v-if="null !== title">
      <slot name="title"><h3 class="m-auto">{{ title }}</h3></slot>
    </v-card-title>

    <v-card-text>
      <slot name="content">{{ content }}</slot>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
          color="grey darken-1"
          flat
          @click="canceled"
      >
        {{ textCancel }}
      </v-btn>
      <v-btn
          color="blue darken-1"
          flat
          @click="confirm"
      >
        {{ textConfirm }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>

export default {
  name: 'dialog-confirm',

  props: {
    title      : {
      type   : String,
      default: null,
    },
    content    : {
      type   : String,
      default: "Etes-vous sûr ?",
    },
    textConfirm: {
      type   : String,
      default: "Oui",
    },
    textCancel : {
      type   : String,
      default: "Non",
    },
    loading    : {
      type   : Boolean,
      default: false,
    }
  },

  methods: {
    confirm() {
      this.$emit("confirm");
    },

    canceled() {
      this.$emit("cancel");
    },
  },
};
</script>