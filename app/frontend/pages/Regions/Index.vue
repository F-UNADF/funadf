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
    name: "AssociationsIndex",
    components: {
        FuDatabase,
    },
    data() {
        return {
            items: [],
            model: 'regions',
            headers: [
                {title: 'ID', value: 'id'},
                {title: 'Nom', value: 'name'},
                {title: 'Ville', value: 'zipcode'},
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