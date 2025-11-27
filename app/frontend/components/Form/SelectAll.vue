<template>
  <div>
    <v-select v-model="localModelValue" :items="this.items" v-bind="$attrs">
      <template v-slot:prepend-item>
        <v-list-item density="compact">
          <v-checkbox v-model="selectAll" label="Tout selectionner" hide-details></v-checkbox>
        </v-list-item>
      </template>
    </v-select>
  </div>
</template>

<script>
export default {
  name: "SelectAll",
  computed: {
    selectAll: {
      get() {
        return this.localModelValue.length === this.items.length;
      },
      set(value) {
        this.localModelValue = value ? [...this.items] : [];
      }
    },
  },
  props: {
    items: {
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
      localModelValue: [...this.modelValue],
    };
  },
  watch: {
    modelValue: function (val, oldVal) {
      if (val.length !== oldVal.length) {
        this.localModelValue = [...val]; // Mettez à jour la copie locale
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
      this.localModelValue = [...this.items];
      this.$emit("update:modelValue", this.localModelValue);
    },
  },
};
</script>
