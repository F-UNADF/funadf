import axios from "axios";

// initial state
const state = () => ({
    items  : [],
    offset : 0,
    loading: false,
});

// getters
const getters = {
    getItems  : (state) => state.items,
    getOffset : (state) => state.offset,
    getLoading: (state) => state.loading,
};

// actions
const actions = {
    items   : function ({
                            commit,
                            state
                        }) {
        commit('setLoading', true);
        return new Promise((resolve, reject) => {
            axios.get('/api/feed?offset=' + state.offset, {}).then((res) => {
                commit('setItems', res.data.posts);
                commit('setOffset', state.offset + 10)
                commit('setLoading', false);
                resolve(res);
            }).catch((error) => {
                reject(error, 2000);
            });
        });
    },
    loadMore: function ({
                            commit,
                            state
                        }) {
        commit('setLoading', true);
        return new Promise((resolve, reject) => {
            axios.get('/api/feed?offset=' + state.offset, {}).then((res) => {
                commit('pushItems', res.data.posts);
                commit('setOffset', state.offset + 10);
                commit('setLoading', false);
                resolve(res);
            }).catch((error) => {
                reject(error, 2000);
            });
        });
    },
    search  : function ({
                            commit,
                            state
                        }, payload) {
        commit('setLoading', true);
        return new Promise((resolve, reject) => {
            axios.get('/api/feed?search=' + payload, {}).then((res) => {
                commit('setItems', res.data.posts);
                commit('setOffset', 0)
                commit('setLoading', false);
                resolve(res);
            }).catch((error) => {
                reject(error, 2000);
            });
        });
    }
};

// mutations
const mutations = {
    setItems  : (state, payload) => state.items = payload,
    setLoading: (state, payload) => state.loading = payload,
    setOffset : (state, payload) => state.offset = payload,
    pushItems : (state, payload) => state.items.push(...payload),
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};