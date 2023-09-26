import axios from "axios";

// initial state
const state = () => ({
    items  : [],
    loading: false,
});

// getters
const getters = {
    getItems  : (state) => state.items,
    getLoading: (state) => state.loading,
};

// actions
const actions = {
    items: function ({commit}) {
        commit('setLoading', true);
        return new Promise((resolve, reject) => {
            axios.get('/api/feed', {}).then((res) => {
                commit('setItems', res.data.posts);
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
    setItems  : (state, payload) => state.items = payload,
    setLoading: (state, payload) => state.loading = payload,
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};