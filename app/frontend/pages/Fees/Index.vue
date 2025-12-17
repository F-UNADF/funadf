<template>
  <div>
    <fu-database :model="model" :headers="headers"/>
  </div>
</template>

<script>
import FuDatabase from "@/components/Database/FuDatabase.vue";

export default {
  name: "FeesIndex",
  components: {
    FuDatabase,
  },
  data() {
    return {
      items: [],
      model: 'fees',
      headers: [
        {
          title: 'Année',
          value: 'what',
          sortable: true
        },
        {
          title: 'Qui',
          value: 'member',
          type: 'user',
          sortable: true
        },
        {
          title: 'Combien',
          value: 'amount',
          type: 'currency',
          sortable: true
        },
        {
          title: 'Payé le',
          value: 'paid_at',
          type: 'date',
          sortable: true
        },
        {
          title: 'Actions',
          value: 'actions',
          sortable: false
        },
      ],
    };
  },
  methods: {},
  mounted() {
  },
}

</script>

<style scoped>
/* Optional: Add styles here */
</style>