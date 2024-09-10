<template>
  <div>
    <v-select multiple chips v-model="mSelected" :items="options" label="Gestion des accès">
      <template v-slot:prepend-item>
        <v-list-item density="compact">
          <v-checkbox v-model="selectAll" label="Tout selectionner" hide-details @click="toggle()"></v-checkbox>
        </v-list-item>
      </template>
    </v-select>
  </div>
</template>

<script>
export default {
  name: "SelectAll",
  props: {
    options: {
      type: Array,
      required: true,
    },
    selected: {
      type: Array,
      required: true,
    },
  },
  methods: {
    toggle() {
      this.mSelected = [];
      if (this.selectAll === false) {
        this.mSelected = this.options;
      }
    },
  },
  watch: {
    mSelected: function (val) {
      this.$emit("update:selected", val);
      this.selectAll = this.mSelected.length === this.options.length;
    },
  },
  mounted() {
    this.mSelected = this.selected;
    // Si selected is undefined, on le met à vide
    if (this.mSelected === undefined) {
      this.mSelected = [];
    }
    this.selectAll = this.mSelected.length === this.options.length;
  },
  data() {
    return {
      selectAll: false,
      mSelected: [],
    };
  },
};
</script>
