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
                <v-row>
                    <v-col v-for="(field, index) in config?.form?.fields" :key="index" cols="12" :md="field.grid || 12">
                        <template v-if="field.type === 'text'">
                            <v-text-field
                                v-model="editedItem[field.name]"
                                :label="$t(model + '.' + field.name)"
                                :rules="field.rules"
                                :type="field.type"
                                :placeholder="$t(model + '.' + field.name)"
                                variant="solo"
                                clearable
                            ></v-text-field>
                        </template>
                        <template v-else-if="field.type === 'file'">
                            <v-file-input
                                v-model="editedItem[field.name]"
                                :label="$t(model + '.' + field.name)"
                                :rules="field.rules"
                                :placeholder="$t(model + '.' + field.name)"
                                variant="solo"
                                clearable
                            ></v-file-input>
                        </template>
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
export default {
    name: "FuForm",
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
        };
    },
}
</script>