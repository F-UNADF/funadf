<template>
    <v-file-upload v-model="localModelValue" browse-text="Rechercher des fichiers"
        divider-text="ou choisissez localement" icon="mdi-upload" title="Glissez et déposez ici" density="compact"
        multiple clearable></v-file-upload>
</template>

<script>
import { VFileUpload } from 'vuetify/labs/VFileUpload'

export default {
    name: "FuFileUpload",
    components: {
        VFileUpload,
    },
    props: {
        modelValue: { type: Array, default: () => [] },
    },
    data() {
        return { localModelValue: [...this.modelValue] }
    },
    watch: {
        localModelValue(val) {
            this.$emit('update:modelValue', val)
        },
        modelValue(val) {
            this.localModelValue = [...val]
        }
    }
};
</script>
