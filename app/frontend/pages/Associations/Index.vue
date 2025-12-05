<template>
    <div>
        <fu-database :model="model" :headers="headers" :domain="domain" />
    </div>
</template>

<script>
import FuDatabase from "@/components/Database/FuDatabase.vue";

export default {
    name: "AssociationsIndex",
    components: {
        FuDatabase,
    },
    props: {
        domain: {
            type: String,
            default: () => 'me',
        },
    },
    data() {
        return {
            items: [],
            model: 'associations',
            headers: [
                { title: 'ID', value: 'id' },
                { title: 'Nom', value: 'name' }, // type structure : logo + nom
                { title: 'Président', value: 'president', type: 'user' }, // type user : NOM + Prenom (friendly_id)
                { title: 'Ville', value: 'zipcode', type: 'localisation' }, // type localisation : TOWN (zipcode)
                { title: 'Actions', value: 'actions', sortable: false },
            ],
        };
    },
}

</script>

<style scoped>
/* Optional: Add styles here */
</style>