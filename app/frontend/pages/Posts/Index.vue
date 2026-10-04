<template>
    <div>
        <fu-database :model="model" :headers="headers" :domain="domain" />
    </div>
</template>

<script>
import FuDatabase from "@/components/Database/FuDatabase.vue";

export default {
    name: "PostsIndex",
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
            model: 'posts',
            headers: [
                { title: 'ID', value: 'id' },
                { title: 'Titre', value: 'title' },
                { title: 'Structure', value: 'structure', type: 'structure' },
                { title: 'Publié le', value: 'published_at', type: 'datetime' },
                { title: 'Expiré le', value: 'expired_at', type: 'datetime' },
                { title: 'Actions', value: 'actions', sortable: false },
            ],
        };
    },
}

</script>

<style scoped>
/* Optional: Add styles here */
</style>