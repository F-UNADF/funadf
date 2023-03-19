import axios from "axios";

// initial state
const state = () => ({
    items: [],
    item: {},
    loading: false,
});

// getters
const getters = {
    getItems: (state) => state.items,
    getItem: (state) => state.item,
    getLoading: (state) => state.loading,
};

// actions
const actions = {
    items: function ({commit}) {
        commit('setLoading', true);
        return new Promise((resolve, reject) => {
            axios.get('/api/users', {}).then((res) => {
                commit('setItems', res.data);
                commit('setLoading', false);
                resolve(res);
            }).catch((error) => {
                reject(error, 2000);
            });
        });
    },
};

// mutations
const mutations = {
    setItems: (state, payload) => state.items = payload,
    setItem: (state, payload) => state.item = payload,
    setLoading: (state, payload) => state.loading = payload,
};

export default {
    namespace: true,
    state,
    getters,
    actions,
    mutations
};