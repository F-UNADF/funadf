<template>
  <v-progress-circular v-if="formLoading" indeterminate color="primary"></v-progress-circular>
  <v-card v-else>
    <v-card-title class="bg-blue text-white">
      <v-btn @click="close()" icon size="small" color="white" variant="outlined" class="mr-5">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      {{ this.getTitle }}
    </v-card-title>
    <v-card-text>

      <v-row>
        <v-col>
          <v-autocomplete
              v-model="editedItem.structure_id"
              :items="referentiels.structures"
              item-value="id"
              item-title="name"
              label="Structure">
          </v-autocomplete>
        </v-col>
        <v-col>
          <v-text-field
              v-model="editedItem.name"
              label="Nom"
              :rules="[rules.required]"
              required>
          </v-text-field>
        </v-col>
      </v-row>

      <v-tabs color="primary" class="mb-3" align-tabs="center" v-model="tab">
        <v-tab value="motions">Motions</v-tab>
        <v-tab value="voting-tables">Table des votes</v-tab>
      </v-tabs>

      <v-window v-model="tab">
        <v-window-item key="motions" value="motions" class="py-3">
          <v-row>
            <v-col cols="12" sm="11">
              <v-row class="bg-grey-lighten-4 px-1 rounded" v-for="motion in this.editedItem.motions"
                     :key="motion.id" justify="left">
                <v-col cols="12" sm="6">
                  <v-text-field
                      v-model="motion.name"
                      label="Motion"
                      :rules="[rules.required, rules.max255]"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-btn-toggle size="small" v-model="motion.kind" rounded>
                    <v-btn value="binary" color="success" class="py-1">
                      Oui/Non
                    </v-btn>
                    <v-btn value="neutral" color="primary" class="py-1">
                      Oui/Non/Neutre
                    </v-btn>
                    <v-btn value="free" color="secondary" class="py-1">
                      Text libre
                    </v-btn>
                  </v-btn-toggle>
                </v-col>
                <v-col cols="12" sm="1">
                  <v-btn icon size="x-small" @click="moveMotionUp(motion)" v-if="motion.order > 0">
                    <v-icon>mdi-chevron-up</v-icon>
                  </v-btn>
                  <v-btn icon size="x-small" @click="moveMotionDown(motion)"
                         v-if="motion.order < this.editedItem.motions.length - 1">
                    <v-icon>mdi-chevron-down</v-icon>
                  </v-btn>
                </v-col>
                <v-col cols="12" sm="1">
                  <v-btn icon color="red" size="x-small" @click="removeMotion(motion)">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" sm="1">
              <v-btn color="success" icon @click="addMotion()">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-window-item>

        <v-window-item key="voting-tables" value="voting-tables" class="py-3">
          <v-row>
            <v-col cols="12" sm="11">
              <v-row class="bg-grey-lighten-4 px-1 rounded" v-for="voting_table in this.editedItem.voting_tables"
                     :key="voting_table.id" justify="left">
                <v-col cols="12" sm="3">
                  <v-select
                      v-model="voting_table.position"
                      :items="referentiels.positions"
                      label="Qualité"
                  >
                  </v-select>
                </v-col>
                <v-col cols="12" sm="3">
                  <v-btn-toggle size="small" v-model="voting_table.as_member" rounded>
                    <v-btn :value="true" color="success" class="py-1">
                      Membre
                    </v-btn>
                    <v-btn :value="false" color="primary" class="py-1">
                      Non Membre
                    </v-btn>
                  </v-btn-toggle>
                </v-col>
                <v-col cols="12" sm="5">
                  <v-btn-toggle size="small" v-model="voting_table.voting" rounded>
                    <v-btn value="count" color="success" class="py-1">
                      Comptabilisé
                    </v-btn>
                    <v-btn value="consultative" color="primary" class="py-1">
                      Consultatif
                    </v-btn>
                  </v-btn-toggle>
                </v-col>
                <v-col cols="12" sm="1">
                  <v-btn icon color="red" size="x-small" @click="removeVotingTable(voting_table)">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" sm="1">
              <v-btn color="success" icon @click="addVotingTable()">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-window-item>
      </v-window>
    </v-card-text>
    <v-card-actions class="bg-blue-lighten-5">
      <v-spacer></v-spacer>
      <v-btn color="red" @click="close()">Annuler</v-btn>
      <v-btn color="blue" @click="save()">Enregistrer</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import {mapGetters} from "vuex";
import {VDataTable} from 'vuetify/labs/VDataTable'

export default {
  name      : "CampaignForm",
  components: {
    VDataTable
  },
  computed  : {
    ...mapGetters('campaignsStore', {
      items       : 'getItems',
      item        : 'getItem',
      formLoading : 'getFormLoading',
      dialogForm  : 'getDialogForm',
      referentiels: 'getReferentiels',
    }),
    getTitle() {
      return (this.editedItem.id === null) ? "Ajouter une campagne" : "Modifier une campagne";
    },
  },
  methods   : {
    close() {
      this.$store.commit('campaignsStore/setDialogForm', false);
      this.$store.commit('campaignsStore/setItem', {});
    },
    save() {
      this.$store.dispatch('campaignsStore/save', this.editedItem).then(response => {
        this.$root.showSnackbar('Campagne enregistrée avec succès', 'success');
        this.search = response.zipcode;
        this.close();
      }, error => {
        this.$root.showSnackbar('Un probleme est survenu lors de l\'enregistrement de la campagne', 'error');
        let errors = error.response.data.errors;
        this.$root.showSnackbar(errors.join('<br/>'), 'error');
      });
    },
    moveMotionUp(motion) {
      const currentIndex = this.editedItem.motions.findIndex(
          (m) => m.id === motion.id
      );
      if (currentIndex > 0) {
        const previousIndex = currentIndex - 1;
        [this.editedItem.motions[previousIndex], this.editedItem.motions[currentIndex]] =
            [motion, this.editedItem.motions[previousIndex]];
        this.editedItem.motions[currentIndex].order = currentIndex;
        this.editedItem.motions[previousIndex].order = previousIndex;
      }
    },
    moveMotionDown(motion) {
      const currentIndex = this.editedItem.motions.findIndex(
          (m) => m.id === motion.id
      );
      if (currentIndex < this.editedItem.motions.length - 1) {
        const nextIndex = currentIndex + 1;
        [this.editedItem.motions[currentIndex], this.editedItem.motions[nextIndex]] =
            [this.editedItem.motions[nextIndex], motion];
        this.editedItem.motions[currentIndex].order = currentIndex;
        this.editedItem.motions[nextIndex].order = nextIndex;
      }
    },
    addMotion() {
      const newMotion = {
        name : '',
        kind : 'binary',
        order: this.editedItem.motions.length, // Set the initial order as the length of the motions array
      };

      this.editedItem.motions.push(newMotion);
    },
    addVotingTable() {
      const newVotingTable = {
        position  : '',
        as_member : true,
        voting    : 'count',
      };
      this.editedItem.voting_tables.push(newVotingTable);
    },
    removeMotion(motion) {
      const index = this.editedItem.motions.findIndex((m) => m.id === motion.id);
      if (index !== -1) {
        this.editedItem.motions.splice(index, 1);
        this.updateMotionOrder();
      }
    },
    removeVotingTable(voting_table) {
      const index = this.editedItem.voting_tables.findIndex((v) => v.id === voting_table.id);
      if (index !== -1) {
        this.editedItem.voting_tables.splice(index, 1);
      }
    },
    updateMotionOrder() {
      for (let i in this.editedItem.motions) {
        this.editedItem.motions[i].order = parseInt(i);
      }
    },
  },
  watch     : {
    item: {
      deep     : true,
      immediate: true,
      handler  : function () {
        this.editedItem = JSON.parse(JSON.stringify(this.item));
        this.updateMotionOrder();
      },
    },
  },

  data() {
    return {
      editedItem: {},
      tab       : 'motions',
      rules     : {
        required: value => !!value || 'Champ obligatoire',
        max255  : value => (value && value.length <= 255) || 'Maximum 255 caractères',
      },
    };
  },
}
</script>

<style scoped>

</style>