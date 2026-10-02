<template>
  <div>
    <v-data-table :headers="tableHeaders" :items="displayedItems" class="elevation-1 fu-database" :loading="loading" items-per-page="50"
      :items-per-page-options="itemsPerPage" :items-per-page-text="$t('itemsPerPage')" hover>
      <template v-slot:top>
        <div class="fu-database__toolbar">
          <v-text-field v-if="enabledSearch" v-model="search" :label="$t('search')" class="fu-database__search"
            prepend-inner-icon="mdi-magnify" density="compact" hide-details clearable
            variant="outlined"></v-text-field>

          <v-btn icon="mdi-refresh" variant="text" color="primary" :aria-label="$t('refresh')" @click="fetchItems"></v-btn>

          <v-spacer></v-spacer>

          <template v-for="action in config?.toolbarActions">
            <v-btn :color="action.color || 'primary'" variant="flat" :prepend-icon="action.icon || 'mdi-plus'"
              :text="$t(action.title)" @click="manageAction(action)"></v-btn>
          </template>
        </div>
      </template>
      <template v-slot:loading>
        <v-skeleton-loader type="table-row@5"></v-skeleton-loader>
      </template>
      <template v-slot:no-data>
        <div class="fu-database__empty">
          <v-icon size="40" color="grayLight">mdi-tray-remove</v-icon>
          <template v-if="search">
            <p class="text-subtitle-1 font-weight-medium mt-2 mb-1">{{ $t('noSearchResult', { search }) }}</p>
            <v-btn variant="text" color="primary" @click="search = ''">{{ $t('clearSearch') }}</v-btn>
          </template>
          <template v-else>
            <p class="text-subtitle-1 font-weight-medium mt-2 mb-1">{{ $t(this.model + '.noData') }}</p>
            <p class="text-body-2 text-medium-emphasis mb-3">{{ $t(this.model + '.noDataExplain') }}</p>
            <template v-for="action in addActions">
              <v-btn :color="action.color || 'primary'" variant="tonal" :prepend-icon="action.icon || 'mdi-plus'"
                :text="$t(action.title)" @click="manageAction(action)"></v-btn>
            </template>
          </template>
        </div>
      </template>
      <template v-slot:item="{ item }">
        <tr>
          <td v-for="(header, index) in headers" :key="index" :class="{ 'text-right': header.value === 'actions' }">
            <template v-if="header.value === 'actions'">
              <v-menu location="bottom end">
                <template v-slot:activator="{ props }">
                  <v-btn v-bind="props" icon="mdi-dots-vertical" variant="text"
                    :aria-label="$t('rowActions', { name: item.name || item.title || item.id })"></v-btn>
                </template>

                <v-list density="compact" min-width="200">
                  <template v-for="(action, index) in config?.itemActions" :key="index">
                    <v-divider v-if="action.action === 'delete' && index > 0" class="my-1"></v-divider>
                    <v-list-item :value="index" @click="manageAction(action, item)"
                      :prepend-icon="action.icon || 'mdi-pencil'"
                      :base-color="action.action === 'delete' ? 'error' : undefined">
                      <v-list-item-title>{{ $t(action.title) }}</v-list-item-title>
                    </v-list-item>
                  </template>
                </v-list>
              </v-menu>
            </template>
            <template v-if="header.type === 'datetime'">
              {{ (null !== item[header.value] ? new Date(item[header.value]).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) : '') }}
            </template>
            <template v-else-if="header.type === 'date'">
              {{ (null !== item[header.value] ? new Date(item[header.value]).toLocaleDateString('fr-FR') : '') }}
            </template>
            <template v-else-if="header.type === 'currency'">
              {{ new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(item[header.value]) }}
            </template>
            <template v-else-if="header.type === 'structure'">
              <div class="d-flex align-center">
                <v-avatar size="32" class="me-2">
                  <img :src="`/logos/${item['structure']['id']}.png`" class="w-100" alt="">
                </v-avatar>
                {{ item['structure']['name'] }}
              </div>
            </template>
            <template v-else-if="header.type === 'user'">
              <user-display :user="item[header.value]"></user-display>
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
    <v-dialog max-width="440" v-model="dialogConfirmDelete">
      <v-card :title="$t(this.model + '.delete')">
        <v-card-text>
          <strong v-if="deletingItem?.name || deletingItem?.title">{{ deletingItem.name || deletingItem.title }}</strong>
          <p class="mt-2">{{ $t(this.model + '.deleteMessage') }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="dialogConfirmDelete = false">{{ $t('cancel') }}</v-btn>
          <v-btn color="error" variant="flat" :loading="deleting" @click="confirmDelete()">{{ $t('default.delete') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import fuForm from "@/components/Form/FuForm.vue";
import UserDisplay from "@/components/Users/Display.vue";

export default {
  name: "FuDatabase",
  components: {
    fuForm,
    UserDisplay,
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
    domain: {
      type: String,
      default: () => null,
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
    tableHeaders() {
      return this.headers.map(header => header.value === 'actions' ? { align: 'end', ...header } : header);
    },
    addActions() {
      return (this.config?.toolbarActions || []).filter(action => action.action === 'add');
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
        search: this.search, domain: this.domain,
      });
    },
    manageAction(action, item = null) {
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
      this.deleting = true;
      this.$store.dispatch(`${this.model}/deleteItem`, this.deletingItem.id).then(() => {
        this.dialogConfirmDelete = false;
        this.deletingItem = {};
        this.$root.showSnackbar(this.$t(`${this.model}.deleteSuccess`), 'success');
      }, () => {
        this.$root.showSnackbar(this.$t('errors.unknownError'), 'error');
      }).finally(() => {
        this.deleting = false;
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
      deleting: false,
      dialogConfirmDelete: false,
      debounceTimer: null,
    };
  },
  watch: {
    search: function () {
      clearTimeout(this.debounceTimer);

      this.debounceTimer = setTimeout(() => {
        if (this.localItems.length === 0) {
          this.$store.dispatch(`${this.model}/fetchItems`, {
            search: this.search,
            domain: this.domain,
          });
        }
      }, 500);
    },
  },
  mounted() {
    this.$store.dispatch(`${this.model}/fetchItems`, { search: this.search, domain: this.domain });
    this.$store.dispatch(`${this.model}/fetchConfig`);
    this.$store.dispatch(`${this.model}/referentiels`);
  },

}

</script>

<style>
.v-data-table-rows-no-data {
  text-align: left !important;
}

.fu-database__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid rgb(var(--v-theme-border));
}

.fu-database__toolbar .fu-database__search {
  flex: 1 1 220px;
  max-width: 360px;
}

.fu-database__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 32px 16px;
}

.fu-database__empty p {
  max-width: 52ch;
}

@media (max-width: 599px) {
  .fu-database__toolbar .fu-database__search {
    max-width: none;
    flex-basis: 100%;
  }
}
</style>
