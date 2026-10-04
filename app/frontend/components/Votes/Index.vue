<template>
  <div>
    <v-row v-if="loading">
      <v-col v-for="n in 3" :key="n" cols="12" sm="6" lg="4">
        <v-skeleton-loader type="card"></v-skeleton-loader>
      </v-col>
    </v-row>

    <div v-else-if="filteredItems.length === 0" class="list-empty">
      <v-icon size="40" color="grayLight">mdi-vote-outline</v-icon>
      <p class="text-subtitle-1 font-weight-medium mt-2 mb-1">Aucun vote en cours</p>
      <p class="text-body-2 text-medium-emphasis">
        Quand une de vos structures ouvrira un vote, il apparaîtra ici.
      </p>
    </div>

    <v-row v-else>
      <v-col v-for="campaign in filteredItems" :key="campaign.id" cols="12" sm="6" lg="4">
        <v-card class="h-100 d-flex flex-column" variant="outlined">
          <v-card-item>
            <v-card-subtitle class="mb-1">{{ campaign.structure.name }}</v-card-subtitle>
            <v-card-title class="text-subtitle-1 font-weight-bold text-wrap">{{ campaign.name }}</v-card-title>
            <template v-slot:append>
              <campaign-state-chip :state="campaign.state"></campaign-state-chip>
            </template>
          </v-card-item>
          <v-spacer></v-spacer>
          <v-card-actions v-if="campaign.state === 'opened'">
            <v-btn color="primary" variant="flat" block append-icon="mdi-arrow-right"
              :to="{ name: 'votes.show', params: { id: campaign.id } }">
              Accéder au vote
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import CampaignStateChip from "../Campaigns/StateChip.vue";

export default {
  name    : "VotesIndex",
  components: {CampaignStateChip},
  computed: {
    ...mapGetters('votesStore', {
      items  : 'getItems',
      loading: 'getLoading',
    }),
    filteredItems() {
      return this.items.filter(item => {
        return true;
      });
    },
  },
  methods : {
    goCampaign(campaign) {
      if (campaign.state === 'opened'){
        this.$router.push('/campaigns/' + campaign.id);
      }
      return false;
    },
  },
  data() {
    return {}
  },
  beforeMount: function () {
    this.$store.dispatch('votesStore/items');
  },
}
</script>

<style scoped>

</style>