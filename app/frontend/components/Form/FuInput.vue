<template>
    <div>
        <template v-if="type === 'text'">
            <v-text-field
                v-model="localValue"
                :label="label"
                :rules="rules"
                :placeholder="placeholder"
                variant="solo"
                @input="handleInput"
                clearable
            ></v-text-field>
        </template>
        <template v-else-if="type === 'file'">
            <v-file-input
                v-model="localValue"
                :label="label"
                :rules="rules"
                :placeholder="placeholder"
                @input="handleInput"
                variant="solo"
                clearable
            ></v-file-input>
        </template>
        <template v-else-if="type === 'members'">
            <FuMembersInput
                v-model="localValue"
                :model="model"
                :label="label"
                :rules="rules"
                :placeholder="placeholder"
                @input="handleInput"></FuMembersInput>
        </template>
    </div>
</template>

<script>

import FuMembersInput from "@/components/Form/FuMembersInput.vue";

export default {
    name : "FuInput",
    components: {
        FuMembersInput,
    },
    props: {
        field      : {
            type    : Object,
            required: true,
        },
        type       : {
            type   : String,
            default: () => "text",
        },
        value      : {
            type    : Object,
            required: true,
        },
        model      : {
            type   : String,
            default: () => "default",
        },
        label      : {
            type   : String,
            default: () => "",
        },
        rules      : {
            type   : Array,
            default: () => [],
        },
        placeholder: {
            type   : String,
            default: () => "",
        },
    },
    methods: {
        handleInput     : function (newValue) {
            this.localValue = newValue;
            this.$emit('input', newValue);
            this.$emit('update:value', newValue);
        },
    },
    watch: {
        value(newValue, oldValue) {
            this.localValue = newValue
        }
    },
    data() {
        return {
            localValue: this.value,
        };
    },
};
</script>