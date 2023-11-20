<template>
  <v-container>
    <v-layout v-if="loading" style="justify-content: center; align-items: center; height: 70vh;">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-layout>
    <v-row v-else>
      <v-col v-if="filteredItems.length > 0" v-for="campaign in filteredItems" cols="12" md="4" sm="12" lg="3">
        <v-card rounded="rounded" @click="goCampaign(campaign)">
          <template v-slot:title>
            {{ campaign.structure.name }}
          </template>

          <template v-slot:subtitle>
            {{ campaign.name }}
          </template>

          <template v-slot:actions>
            <v-btn color="primary" variant="tonal" block rounded-xl v-if="campaign.state === 'opened'"
                   @click="this.$router.push('/campaigns/'+campaign.id)">
              <template v-slot:prepend>
                <v-icon>mdi-vote</v-icon>
              </template>
              <template v-slot:default>
                Accéder au vote
              </template>
              <template v-slot:append>
                <v-icon>mdi-arrow-right</v-icon>
              </template>
            </v-btn>
          </template>

        </v-card>
      </v-col>

      <v-col v-else>
        <v-card>
          <v-card-title>
            Aucun vote en cours
          </v-card-title>
          <v-card-text>
            <p>
              Aucun vote n'est en cours pour le moment.
            </p>
            <p>
              Revenez plus tard !
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name    : "VotesIndex",
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