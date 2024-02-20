<template>
    <v-card>
        <v-card-title>
            <span class="headline">Importer un fichier</span>
        </v-card-title>
        <v-card-text>
            <v-file-input label="Importer un fichier CSV contenant une colonne avec les IDs des participants" accept=".csv"
                @change="handleFileUpload($event)" v-if="!this.parsed"></v-file-input>

            <div v-if="this.parsed">
                <b>Nombre de lignes importables : </b> {{ rowCount }}

                <v-select v-model="selectedColumn" :items="headers" label="Quelle colonne contient les IDs à ajouter ?"
                    item-text="header" item-value="header"></v-select>

                <code v-if="this.results.length > 0">Ids à importer : {{ this.results }}</code>

            </div>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" @click="$emit('close')">Annuler</v-btn>
            <v-btn color="blue" @click="$emit('import', this.results)">Importer</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import Papa from 'papaparse';
import { VDataTable } from 'vuetify/labs/VDataTable'

export default {
    name: 'FileImportForm',
    components: {
        Papa, VDataTable
    },
    methods: {
        handleFileUpload(event) {
            const file = event.target.files[0];
            const reader = new FileReader();

            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: function (results) {
                    this.content = results;
                    this.rowCount = results.data.length;
                    this.parsed = true;
                    this.headers = results.meta.fields;
                }.bind(this)
            });

        },
        displayResult() {
            // get array of the selectedColumn
            this.results = this.content.data.map(row => row[this.selectedColumn]);
            this.$emit('import', this.results);
            this.$emit('close');
        },
    },
    watch: {
        selectedColumn() {
            this.displayResult();
        }
    },
    data() {
        return {
            content: [],
            headers: [],
            results: [],
            selectedColumn: null,
            rowCount: 0,
            parsed: false,
        };
    },
};
</script>
