<template>
    <div>
        <v-list density="compact">
            <v-list-item v-for="(file, index) in localModelValue" :key="index">
                <template v-slot:title>
                    <a :href="file.url" target="_blank">{{ file.name }}</a>
                </template>
                <template v-slot:prepend>
                    <v-btn size="small" icon="mdi-delete" variant="text" color="red" @click="removeFile(index)">
                    </v-btn>
                </template>
            </v-list-item>
        </v-list>
    </div>
</template>

<script>
export default {
    name: "FuExistingFilesList",
    props: {
        modelValue: { type: Array, default: () => [] },
    },
    data() {
        return {
            localModelValue: [...this.modelValue]
        }
    },
    methods: {
        removeFile(index) {
            this.localModelValue.splice(index, 1);
        }
    },
    watch: {

        localModelValue(val) {
            this.$emit('update:modelValue', val)
        },
        modelValue(val) {
            // ne recopier que si le tableau est différent
            if (JSON.stringify(val) !== JSON.stringify(this.localModelValue)) {
                this.localModelValue = [...val]
            }
        }
    }
};
</script>