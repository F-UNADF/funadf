<template>
    <div>
        <v-file-upload v-model="localModelValue" browse-text="Rechercher des fichiers" divider-text="ou choisissez localement" icon="mdi-upload"
            title="Glissez et déposez ici" density="compact" @change="prepareInput" multiple clearable>
        </v-file-upload> Totodsdsd
    </div>
</template>

<script>
import { VFileUpload } from 'vuetify/labs/VFileUpload'

export default {
    name: "FuFileUpload",
    components: {
        VFileUpload,
    },
    data() {
        return {
            localModelValue: []
        };
    },
    methods: {
        prepareInput(files) {
            if (!files.length) {
                this.$root.showSnackbar("Aucun fichier sélectionné", 'warning');
                return;
            }
            this.$emit('update:modelValue', this.files);
        }
    }
};
</script>
