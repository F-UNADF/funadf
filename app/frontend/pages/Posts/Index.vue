<template>
    <div>
        <fu-database 
            :model="model"
            :headers="headers" />
    </div>
</template>

<script>
import FuDatabase from "@/components/Database/FuDatabase.vue";

export default {
    name: "PostsIndex",
    components: {
        FuDatabase,
    },
    data() {
        return {
            items: [],
            model: 'posts',
            headers: [
                {title: 'ID', value: 'id'},
                {title: 'Titre', value: 'title'},
                {title: 'Structure', value: 'structure', type: 'structure'},
                {title: 'Actions', value: 'actions', sortable: false},
            ],
        };
    },
    methods: {
    },
    mounted() {
    },
}

</script>

<style scoped>
/* Optional: Add styles here */
</style>