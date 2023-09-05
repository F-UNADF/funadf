<template>
  <v-container>
    <v-row>
      <v-col v-for="campaign in this.campaigns" cols="12" md="4" sm="12" lg="3">
        <v-card>
          <v-card-title>
            <h3>{{ campaign.name }}</h3>
          </v-card-title>
          <v-card-text>
            <p>Some text</p>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" variant="tonal" block rounded-xl>
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
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "VotesIndex",
  data() {
    return {
      campaigns: [
        {
          name: 'Campaign 1',
        },
        {
          name: 'Campaign 2',
        },
      ]
    }
  },
}
</script>

<style scoped>

</style>