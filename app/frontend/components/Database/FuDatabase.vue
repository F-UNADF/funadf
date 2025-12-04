<template>
  <div>
    <v-data-table :headers="headers" :items="displayedItems" class="elevation-1" :loading="loading" items-per-page="50"
      :items-per-page-options="itemsPerPage" :items-per-page-text="$t('itemsPerPage')">
      <template v-slot:top>
        <v-toolbar>
          <v-btn icon color="info" variant="text" @click="fetchItems">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>

          <v-toolbar-title class="text-h6">
            {{ $t(this.model + '.title') }}
          </v-toolbar-title>

          <v-spacer></v-spacer>

          <v-text-field v-if="enabledSearch" v-model="search" :label="$t('search')" class="mx-4"
            append-inner-icon="mdi-magnify" density="compact" single-line hide-details
            variant="outlined"></v-text-field>

          <template v-for="action in config?.toolbarActions">
            <v-btn class="me-2" :color="action.color || 'primary'" :prepend-icon="action.icon || 'mdi-plus'"
              :text="$t(action.title)" @click="manageAction(action)"></v-btn>
          </template>

        </v-toolbar>
      </template>
      <template v-slot:no-data>
        <v-progress-linear indeterminate color="cyan" v-if="loading"></v-progress-linear>
        <v-alert v-else class="my-3" color="info" icon="$info" :title="$t(this.model + '.noData')"
          :text="$t(this.model + '.noDataExplain')"></v-alert>
      </template>
      <template v-slot:item.actions="{ item }">

      </template>
      <template v-slot:item="{ item }">
        <tr>
          <td v-for="(header, index) in headers" :key="index">
            <template v-if="header.value === 'actions'">
              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-btn v-bind="props" icon variant="text">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>

                <v-list>
                  <v-list-item v-for="(action, index) in config?.itemActions" :key="index" :value="index"
                    @click="manageAction(action, item)" :prepend-icon="action.icon || 'mdi-pencil'">
                    <v-list-item-title>{{ $t(action.title) }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
            <template v-if="header.type === 'datetime'">
              {{ (null !== item[header.value] ? new Date(item[header.value]).toLocaleString() : '') }}
            </template>
            <template v-else-if="header.type === 'structure'">
              <v-avatar size="40" class="me-2">
                <img :src="`/logos/${item['structure']['id']}.png`" class="w-100" alt="Logo">
              </v-avatar>
              {{ item['structure']['name'] }}
            </template>
            <template v-else-if="header.type === 'user' && null !== item['user_id']">
              <v-avatar size="40" class="me-2">
                <img :src="`/avatars/${item['user_id']}.png`" class="w-100" alt="Logo">
              </v-avatar>
              {{ item['lastname'] }} {{ item['firstname'] }}
            </template>
            <template v-else-if="header.type === 'localisation' && null !== item['town']">
              {{ item['town'] }} ({{ item['zipcode'] }})
            </template>
            <template v-else>
              {{ item[header.value] }}
            </template>
          </td>
        </tr>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" :fullscreen="config?.form?.fullscreen === true"
      :max-width="config?.form?.maxWidth || '600px'" @keydown.esc="dialog = false" @click:outside="dialog = false">
      <fuForm :model="model" :config="config" @close="dialog = false"></fuForm>
    </v-dialog>
    <v-dialog max-width="25%" v-model="dialogConfirmDelete">
      <v-card>
        <v-card-text>
          {{ $t(this.model + '.deleteMessage') }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="dialogConfirmDelete = false">Annuler</v-btn>
          <v-btn color="error" @click="confirmDelete()">Supprimer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import fuForm from "@/components/Form/FuForm.vue";

export default {
  name: "FuDatabase",
  components: {
    fuForm,
  },
  props: {
    model: {
      type: String,
      default: () => "default",
    },
    headers: {
      type: Array,
      default: () => [],
    },
    localItems: {
      type: Array,
      default: () => [],
    },
    enabledSearch: {
      type: Boolean,
      default: () => true,
    },
  },
  computed: {
    items() {
      return this.$store.getters[`${this.model}/getItems`] || [];
    },
    loading() {
      return this.$store.getters[`${this.model}/getLoading`] || false;
    },
    config() {
      return this.$store.getters[`${this.model}/getConfig`] || {};
    },
    dialog: {
      get() {
        return this.$store.getters[`${this.model}/getDialog`] || false;
      },
      set(value) {
        this.$store.commit(`${this.model}/setDialog`, value);
      },
    },
    displayedItems() {
      if (this.localItems.length > 0) {
        return this.localItems;
      }
      return this.items;
    },
  },
  methods: {
    fetchItems() {
      this.$store.dispatch(`${this.model}/fetchItems`, {
        search: this.search,
      });
    },
    manageAction(action, item = null) {
      console.log('manageAction', action, item);
      if (action.action === 'add') {
        this.add();
      } else if (action.action === 'edit') {
        this.edit(item);
      } else if (action.action === 'delete') {
        this.delete(item);
      } else if (action.action === 'custom') {
        this.custom(action);
      }
    },
    add() {
      let newItem = this.config?.form?.defaultItem || {};
      console.log('add', newItem);
      this.$store.commit(`${this.model}/setItem`, newItem);
      this.$store.commit(`${this.model}/setDialog`, true);
    },
    edit(item) {
      if (item) {
        this.$store.dispatch(`${this.model}/fetchItem`, item.id).then(() => {
          this.$store.commit(`${this.model}/setDialog`, true);
        });
      }
    },
    delete(item) {
      // Handled in confirmDelete
      this.deletingItem = item;
      this.dialogConfirmDelete = true;
    },
    confirmDelete() {
      this.$store.dispatch(`${this.model}/deleteItem`, this.deletingItem.id).then(() => {
        this.dialogConfirmDelete = false;
        this.deletingItem = {};
        this.$root.showSnackbar(this.$t(`${this.model}.deleteSuccess`), 'success');
      });
    }
  },
  data() {
    return {
      itemsPerPage: [
        { value: 10, title: '10' },
        { value: 25, title: '25' },
        { value: 50, title: '50' },
        { value: 100, title: '100' },
        { value: -1, title: 'Tous' }
      ],
      search: '',
      deletingItem: {},
      dialogConfirmDelete: false,
    };
  },
  watch: {
    search: function () {
      if (this.localItems.length === 0) {
        this.$store.dispatch(`${this.model}/fetchItems`, {
          search: this.search,
        });
      }
    },
  },
  mounted() {
    if (this.localItems.length === 0) {
      this.$store.dispatch(`${this.model}/fetchItems`);
      this.$store.dispatch(`${this.model}/fetchConfig`);
      this.$store.dispatch(`${this.model}/referentiels`);
    }
  },

}

</script>

<style>
.v-data-table-rows-no-data {
  text-align: left !important;
}
</style>