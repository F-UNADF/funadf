<template>
  <div>
    <template v-if="type === 'text'">
      <v-text-field v-model="localValue" :label="label" :rules="computeRules(rules)" :placeholder="placeholder"
        hide-details="auto" clearable></v-text-field>
    </template>
    <template v-else-if="type === 'file'">
      <v-file-input v-model="localValue" :label="label" :rules="computeRules(rules)" :placeholder="placeholder"
        hide-details="auto" @change="prepareInput($event.target.files)" clearable></v-file-input>
    </template>
    <template v-else-if="type === 'bool'">
      <v-checkbox v-model="localValue" :label="label" :rules="computeRules(rules)" :placeholder="placeholder"
        hide-details="auto" clearable></v-checkbox>
    </template>
    <template v-else-if="type === 'datetime'">
      <v-text-field v-model="localValue" :label="label" :rules="computeRules(rules)" :placeholder="placeholder"
        hide-details="auto" clearable type="datetime-local" :value="getIsoDate(localValue)"></v-text-field>
    </template>
    <template v-else-if="type === 'date'">
      <v-text-field v-model="localValue" :label="label" :rules="computeRules(rules)" :placeholder="placeholder"
                    hide-details="auto" clearable type="date"></v-text-field>
    </template>
    <template v-else-if="type === 'float'">
      <v-text-field v-model="localValue" :label="label" :rules="computeRules(rules)" :placeholder="placeholder"
                    hide-details="auto" clearable type="float"></v-text-field>
    </template>
    <template v-else-if="type === 'files'">
      <fu-file-upload v-model="localValue" :label="label"></fu-file-upload>
    </template>
    <template v-else-if="type === 'list_files'">
      <fu-existing-files-list v-model="localValue"></fu-existing-files-list>
    </template>
    <template v-else-if="type === 'select_one'">
      <v-combobox v-model="localValue" :label="label" :rules="computeRules(rules)" :placeholder="placeholder"
        hide-details="auto" :items="items"></v-combobox>
    </template>
    <template v-else-if="type === 'select_multiple'">
      <select-all v-model="localValue" :label="label" :rules="computeRules(rules)" :placeholder="placeholder"
        hide-details="auto" :items="items" multiple chips clearable></select-all>
    </template>
    <template v-else-if="type === 'autocomplete_one'">
      <v-autocomplete v-model="localValue" :label="label" :rules="computeRules(rules)" :placeholder="placeholder"
        hide-details="auto" :items="items" clearable>
      </v-autocomplete>
    </template>
    <template v-else-if="type === 'wysiwyg'">
      <vue-editor v-model="localValue" :label="label" :rules="computeRules(rules)" :placeholder="placeholder"
        hide-details="auto" clearable>
      </vue-editor>
    </template>
    <template v-else-if="type === 'members'">
      <FuMembersInput :model="model"></FuMembersInput>
    </template>
    <template v-else>
      {{ $t('form.errors.unknownInputType') }} {{type}}
    </template>
  </div>
</template>

<script>
import FuMembersInput from "@/components/Form/FuMembersInput.vue";
import FuFileUpload from "@/components/Form/FuFileUpload.vue";
import FuExistingFilesList from "@/components/Form/FuExistingFilesList.vue";
import { VueEditor } from "vue3-editor";
import SelectAll from "./SelectAll.vue";

export default {
  name: "FuInput",
  components: {
    SelectAll,
    VueEditor,
    FuMembersInput,
    FuFileUpload,
    FuExistingFilesList,
  },
  props: {
    type: {
      type: String,
      default: () => "text",
    },
    value: {
      type: [String, Number, Array, Object, File, null],
      default: () => "",
    },
    model: {
      type: String,
      default: () => "default",
    },
    label: {
      type: String,
      default: () => "",
    },
    rules: {
      type: Array,
      default: () => [],
    },
    placeholder: {
      type: String,
      default: () => "",
    },
    items: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    computeRules(rules) {
      //rules est un tableau contenant les clés des rules à appliquer de localRules
      //on va les appliquer à la valeur
      let computedRules = [];
      for (let rule of rules) {
        if (this.localRules.hasOwnProperty(rule)) {
          computedRules.push(this.localRules[rule]);
        }
      }
      return computedRules;
    },
    prepareInput(file) {
      if (!file.length) {
        this.$root.showSnackbar("Aucun fichier sélectionné", 'warning');
        return;
      }

      if (file.length > 1) {
        this.$root.showSnackbar("Vous devez sélectionner un seul fichier", 'warning');
        return;
      }

      this.$emit('update:modelValue', file[0]);
    },
    getIsoDate(dateString) {
      if (!dateString) return null;
      const date = new Date(dateString);
      const tzOffset = date.getTimezoneOffset() * 60000; // décalage en millisecondes
      const localISOTime = new Date(date - tzOffset).toISOString().slice(0, 16);
      return localISOTime;
    },
  },
  watch: {
    value(newValue, oldValue) {
      this.localValue = newValue
    },
    localValue(newValue) {
      // si new Value vient du combo box, on ne prend que la valeur
      if (this.type === 'select_one' && typeof newValue === 'object' && newValue !== null) {
        this.$emit('update:modelValue', newValue.value);
        return;
      }
      this.$emit('update:modelValue', newValue);
    },
  },
  data() {
    return {
      localValue: this.value,
      menu: false,
      localRules:
      {
        required: value => !!value || this.$t('form.errors.required'),
        minLength: value => (value && value.length >= 3) || this.$t('form.errors.minLength', [3]),
        maxLength: value => (value && value.length <= 255) || this.$t('form.errors.maxLength', [255]),
        email: value => {
          const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          // attention une chaine vide est valide, email peut parfois être vide
          return value === null || value === "" || pattern.test(value) || this.$t('form.errors.email');
        },
      }
    };
  },
};
</script>