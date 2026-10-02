<template>
    <v-form ref="form" @submit.prevent="save" v-model="valid" validate-on="blur lazy">
        <v-card class="fu-form">
            <v-toolbar color="primary">
                <v-toolbar-title :text="$t(getTitleSlug)"></v-toolbar-title>
                <v-btn icon="mdi-close" variant="text" :aria-label="$t('close')" @click="$emit('close')"></v-btn>
            </v-toolbar>
            <v-card-text class="fu-form__body">
                <p v-if="hasRequired" class="text-caption text-medium-emphasis mb-4">{{ $t('form.requiredHint') }}</p>
                <template v-if="config?.form?.tabs">
                    <v-tabs v-if="visibleTabs.length > 1" v-model="tab" color="primary" class="mb-4">
                        <v-tab v-for="t in visibleTabs" :key="t.name" :value="t.name">
                            {{ t.title }}
                        </v-tab>
                    </v-tabs>

                    <v-tabs-window v-model="tab">
                        <v-tabs-window-item v-for="t in visibleTabs" :key="t.name" :value="t.name" class="pb-5" eager>
                            <v-row>
                                <v-col v-for="(field, index) in t.fields" :key="index" cols="12"
                                    :md="field.grid || 12">
                                    <fu-input
                                        :type="field.type"
                                        :value="editedItem[field.name]"
                                        :model="model"
                                        :label="getLabel(field)"
                                        :rules="field.rules"
                                        v-model="editedItem[field.name]"
                                        :items="field.items"
                                    ></fu-input>
                                </v-col>
                            </v-row>
                        </v-tabs-window-item>
                    </v-tabs-window>
                </template>
                <!-- Formulaire simple sans onglet -->
                <v-row>
                    <v-col v-for="(field, index) in config?.form?.fields" :key="index" cols="12" :md="field.grid || 12">
                        <fu-input
                            :type="field.type"
                            :value="editedItem[field.name]"
                            :model="model"
                            :label="getLabel(field)"
                            :rules="field.rules"
                            v-model="editedItem[field.name]"
                        ></fu-input>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions class="fu-form__actions">
                <v-spacer></v-spacer>
                <v-btn variant="text" @click="$emit('close')">{{ $t('cancel') }}</v-btn>
                <v-btn color="primary" variant="flat" type="submit" :loading="saving">{{ $t('save') }}</v-btn>
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
        visibleTabs() {
            return (this.config?.form?.tabs || []).filter(t => this.manageCondition(t.if));
        },
        hasRequired() {
            const fields = [
                ...(this.config?.form?.fields || []),
                ...this.visibleTabs.flatMap(t => t.fields || []),
            ];
            return fields.some(field => (field.rules || []).includes('required'));
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
            const label = field.label ? this.$t(field.label) : this.$t(this.model + '.' + field.name);
            const required = (field.rules || []).includes('required');
            return required ? `${label} *` : label;
        },
        async save() {
            if (this.saving) {
                return;
            }
            const { valid } = await this.$refs.form.validate();
            if (!valid) {
                this.$root.showSnackbar(this.$t('form.invalid'), 'error');
                return;
            }
            this.saving = true;
            this.$store.dispatch(`${this.model}/saveItem`, this.editedItem).then(() => {
                this.$root.showSnackbar(this.$t(`${this.model}.saved`), 'success');
            }, error => {
                const errors = error?.response?.data?.errors;
                const message = Array.isArray(errors) && errors.length
                    ? errors.join('<br/>')
                    : this.$t('form.error');
                this.$root.showSnackbar(message, 'error');
            }).finally(() => {
                this.saving = false;
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
        visibleTabs: {
            handler(tabs) {
                if (tabs.length && !tabs.some(t => t.name === this.tab)) {
                    this.tab = tabs[0].name;
                }
            },
            immediate: true,
        },
        item: {
            handler(newValue) {
                this.editedItem = JSON.parse(JSON.stringify(newValue));
            },
            immediate: true,
        },
    },
    data() {
        return {
            valid: null,
            saving: false,
            editedItem: {},
            tab: null,
        };
    },
}
</script>

<style scoped>
.fu-form__body {
    width: 100%;
    max-width: 960px;
    margin-inline: auto;
}

.fu-form__actions {
    position: sticky;
    bottom: 0;
    z-index: 1;
    background: rgb(var(--v-theme-surface));
    padding: 12px 16px;
}
</style>
