// stores/crudStore.js
import axios from "axios";

export default function createCrudStore({ resource }) {
    const baseUri = `/api/${resource}`;

    return {
        namespaced: true,
        state: () => ({
            items: [],
            item: {},
            loading: false,
            dialog: false,
            config: {}
        }),
        getters: {
            getItems: (state) => state.items,
            getItem: (state) => state.item,
            getLoading: (state) => state.loading,
            getDialog: (state) => state.dialog,
            getConfig: (state) => state.config,
        },
        actions: {
            async fetchItems({ commit }, params = {}) {
                const queryString = new URLSearchParams(params).toString();
                const uri = queryString ? `${baseUri}?${queryString}` : baseUri;
                commit('setLoading', true);
                try {
                    const res = await axios.get(uri);
                    commit('setItems', res.data[resource]);
                } finally {
                    commit('setLoading', false);
                }
            },
            async fetchItem({ commit }, id) {
                const res = await axios.get(`${baseUri}/${id}`);
                commit('setItem', res.data[resource.slice(0, -1)]); // singular
            },
            async fetchConfig({ commit }) {
                const res = await axios.get(`${baseUri}/config`);
                commit('setConfig', res.data.config);
            },
            async saveItem({ commit }, item) {
                const method = item.id ? 'patch' : 'post';
                const uri = item.id ? `${baseUri}/${item.id}` : baseUri;
                const res = await axios[method](uri, { [resource.slice(0, -1)]: item });
                commit('setItem', res.data[resource.slice(0, -1)]);
            },
        },
        mutations: {
            setItems: (state, items) => (state.items = items),
            setItem: (state, item) => (state.item = item),
            setLoading: (state, loading) => (state.loading = loading),
            setDialog: (state, dialog) => (state.dialog = dialog),
            setConfig: (state, config) => (state.config = config),
        },
    };
}
