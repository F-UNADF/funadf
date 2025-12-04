<template>
    <v-file-input :model-value="modelValue" @update:modelValue="$emit('update:modelValue', $event)" hide-details
        show-size counter multiple chips clearable label="Rechercher des fichiers" />
</template>

<script>
export default {
    name: "FuFileUpload",
    props: {
        modelValue: { type: Array, default: () => [] },
    },
};
</script>
