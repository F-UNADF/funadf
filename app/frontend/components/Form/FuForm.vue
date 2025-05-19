<template>
    <v-card>
        <v-toolbar color="primary" dark>
            <v-toolbar-title :text="$t(getTitleSlug)"></v-toolbar-title>
            <v-btn icon variant="text" @click="$emit('close')">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-toolbar>
        <v-card-text>
            <v-form v-model="valid">
                <template v-if="config?.form?.tabs">
                    <v-tabs v-model="tab"
                            align-tabs="center"
                            color="primary"
                            class="mb-3">
                        <v-tab v-for="t in config.form.tabs" :value="t.name">{{ t.title }}</v-tab>
                    </v-tabs>

                    {{config.form.tabs}}

                    <v-tabs-window v-model="tab">
                        <v-tabs-window-item v-for="t in config.form.tabs" :value="t.name" v-if="!t.hasOwnProperty('if') || manageCondition(t.if)">
                            <v-row>
                                <v-col v-for="(field, index) in t.fields" :key="index" cols="12" :md="field.grid || 12">
                                    <fu-input
                                        :type="field.type"
                                        :value="editedItem[field.name]"
                                        :model="model"
                                        :label="$t(model + '.' + field.name)"
                                        :rules="field.rules"
                                        :placeholder="$t(model + '.' + field.name)"
                                    ></fu-input>
                                </v-col>
                            </v-row>
                        </v-tabs-window-item>
                    </v-tabs-window>
                </template>
                <!-- Forumulaire simple sans onglet -->
                <v-row>
                    <v-col v-for="(field, index) in config?.form?.fields" :key="index" cols="12" :md="field.grid || 12">
                        <fu-input
                            :type="field.type"
                            :value="editedItem[field.name]"
                            :model="model"
                            :label="$t(model + '.' + field.name)"
                            :rules="field.rules"
                            :placeholder="$t(model + '.' + field.name)"
                        ></fu-input>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="$emit('close')">{{ $t('cancel') }}</v-btn>
            <v-btn color="primary" @click="save">{{ $t('save') }}</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import FuInput from "./FuInput.vue";

export default {
    name      : "FuForm",
    components: {FuInput},
    props     : {
        model : {
            type   : String,
            default: () => "default",
        },
        config: {
            type   : Object,
            default: () => ({}),
        },
    },
    computed  : {
        item() {
            return this.$store.getters[`${this.model}/getItem`] || {};
        },
        getTitleSlug() {
            let item = this.$store.getters[`${this.model}/getItem`] || {};
            if (item && item.id) {
                return `${this.model}.edit`;
            } else {
                return `${this.model}.add`;
            }
        }
    },
    methods   : {
        save() {
            this.$store.dispatch(`${this.model}/saveItem`, this.editedItem).then(response => {
                this.$root.showSnackbar(this.$t(`${this.model}.saved`), 'success');
                this.dialog = false;
            }, error => {
                this.$root.showSnackbar(this.$t('error'), 'error');
                let errors = error.response.data.errors;
                this.$root.showSnackbar(errors.join('<br/>'), 'error');
            });
        },
        manageCondition(condition) {
            if (condition) {
                // condition[0] = this.editedItem[condition[0]];
                // condition[1] = symbole
                // condition[2] = comparaison
                switch (condition[1]) {
                    case '==':
                        return this.editedItem[condition[0]] == condition[2];
                    case '===':
                        return this.editedItem[condition[0]] === condition[2];
                    case '!=':
                        return this.editedItem[condition[0]] != condition[2];
                    case '!==':
                        return this.editedItem[condition[0]] !== condition[2];
                    case '<':
                        return this.editedItem[condition[0]] < condition[2];
                    case '<=':
                        return this.editedItem[condition[0]] <= condition[2];
                    case '>':
                        return this.editedItem[condition[0]] > condition[2];
                    case '>=':
                        return this.editedItem[condition[0]] >= condition[2];
                }
            }
            return true;
        },
    },
    watch     : {
        item: {
            handler(newValue) {
                this.editedItem = JSON.parse(JSON.stringify(newValue));
            },
            immediate: true,
        },
    },
    data() {
        return {
            valid     : false,
            editedItem: {},
            tab       : null,
        };
    },
}
</script>