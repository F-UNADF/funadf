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
                {title: 'Nom', value: 'name', type: 'structure'}, // type structure : logo + nom
                {title: 'Président', value: 'president', type: 'user'}, // type user : NOM + Prenom (friendly_id)
                {title: 'Ville', value: 'zipcode', type: 'localisation'}, // type localisation : TOWN (zipcode)
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