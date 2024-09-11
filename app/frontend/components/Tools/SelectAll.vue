<template>
  <div>
    <v-select multiple chips v-model="localModelValue" :items="options" label="Gestion des accès">
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
      default: [],
      required: true,
    },
    modelValue: {
      type: Array,
      default: [],
      required: true,
    },
  },
  data() {
    return {
      selectAll: false,
      localModelValue: [...this.modelValue], // Utilisez une copie locale
    };
  },
  watch: {
    modelValue: function (val, oldVal) {
      if (val.length !== oldVal.length) {
        this.localModelValue = [...val]; // Mettez à jour la copie locale
        this.selectAll = this.localModelValue.length === this.options.length;
      }
    },
    localModelValue: function (val, oldVal) {
      if (val.length !== oldVal.length) {
        this.$emit("update:modelValue", val);
      }
    },
  },
  methods: {
    updateModelValue() {
      this.localModelValue = [...this.options];
      this.selectAll = this.localModelValue.length === this.options.length;
      this.$emit("update:modelValue", this.localModelValue);
    },
    toggle() {
      if (!this.selectAll) {
        this.localModelValue = [...this.options]; // Tout sélectionner
      } else {
        this.localModelValue = []; // Tout désélectionner
      }
      this.selectAll = !this.selectAll; // Mettez à jour selectAll à la fin
    },
  },
  mounted() {
    // nextTick is necessary to avoid a warning
    this.$nextTick(() => {
      this.selectAll = this.localModelValue.length === this.options.length;
    });
  },
};
</script>
