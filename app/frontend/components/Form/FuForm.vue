<template>
    <v-form @submit.prevent="save" v-model="valid">
        <v-card>
            <v-toolbar color="primary" dark>
                <v-toolbar-title :text="$t(getTitleSlug)"></v-toolbar-title>
                <v-btn icon variant="text" @click="$emit('close')">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text>
                <template v-if="config?.form?.tabs">
                    <v-tabs v-model="tab" align-tabs="center" color="primary" class="mb-3">
                        <template v-for="t in config.form.tabs">
                            <v-tab :value="t.name" v-if="manageCondition(t.if)">
                                {{ t.title }}
                            </v-tab>
                        </template>
                    </v-tabs>

                    <v-tabs-window v-model="tab">
                        <template v-for="t in config.form.tabs">
                            <v-tabs-window-item :value="t.name" v-if="manageCondition(t.if)" class="pb-5">
                                <v-row>
                                    <v-col v-for="(field, index) in t.fields" :key="index" cols="12"
                                        :md="field.grid || 12">
                                        <fu-input 
                                            :type="field.type" 
                                            :value="editedItem[field.name]" 
                                            :model="model"
                                            :label="getLabel(field)"
                                            :rules="field.rules"
                                            :placeholder="$t(model + '.' + field.name)"
                                            v-model="editedItem[field.name]"
                                            :items="field.items"
                                        ></fu-input>
                                    </v-col>
                                </v-row>
                            </v-tabs-window-item>
                        </template>
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
                            v-model="editedItem[field.name]"
                        ></fu-input>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions class="bg-primary">
                <v-spacer></v-spacer>
                <v-btn text @click="$emit('close')">{{ $t('cancel') }}</v-btn>
                <v-btn color="light" type="submit" :disabled="false === valid || null === valid">{{ $t('save') }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-form>
</template>

<script>
import FuInput from "./FuInput.vue";

export default {
    name: "FuForm",
    components: { FuInput },
    props: {
        model: {
            type: String,
            default: () => "default",
        },
        config: {
            type: Object,
            default: () => ({}),
        },
    },
    computed: {
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
    methods: {
        getLabel(field) {
            if (field.label) {
                return this.$t(field.label);
            } else {
                return this.$t(this.model + '.' + field.name);
            }
        },
        save() {
            if(false === this.valid || this.valid === undefined ) {
                this.$root.showSnackbar(this.$t('form.error'), 'error');
                return;
            }

            this.$store.dispatch(`${this.model}/saveItem`, this.editedItem).then(response => {
                this.$root.showSnackbar(this.$t(`${this.model}.saved`), 'success');
                this.dialog = false;
            }, error => {
                this.$root.showSnackbar(this.$t('form.error'), 'error');
                let errors = error.response.data.errors;
                this.$root.showSnackbar(errors.join('<br/>'), 'error');
            });
        },
        manageCondition(condition) {
            if (condition) {
                // condition[0] = this.editedItem[condition[0]];
                // condition[1] = symbole
                // condition[2] = comparaison
                let cleanCondition2 = condition[2] === 'null' ? null : condition[2];

                switch (condition[1]) {
                    case '==':
                        return this.editedItem[condition[0]] == cleanCondition2;
                    case '===':
                        return this.editedItem[condition[0]] === cleanCondition2;
                    case '!=':
                        return this.editedItem[condition[0]] != cleanCondition2;
                    case '!==':
                        return this.editedItem[condition[0]] !== cleanCondition2;
                    case '<':
                        return this.editedItem[condition[0]] < cleanCondition2;
                    case '<=':
                        return this.editedItem[condition[0]] <= cleanCondition2;
                    case '>':
                        return this.editedItem[condition[0]] > cleanCondition2;
                    case '>=':
                        return this.editedItem[condition[0]] >= cleanCondition2;
                }
            }
            return true;
        },
    },
    watch: {
        item: {
            handler(newValue) {
                this.editedItem = JSON.parse(JSON.stringify(newValue));
            },
            immediate: true,
        },
    },
    data() {
        return {
            valid: false,
            editedItem: {},
            tab: null,
        };
    },
}
</script>