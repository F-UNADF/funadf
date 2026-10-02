import axios from "axios";

const state = () => ({
    items  : [],
    offset : 0,
    loading: false,
    loaded : false,
    hasMore: false,
    error  : false,
});

// getters
const getters = {
    getItems  : (state) => state.items,
    getOffset : (state) => state.offset,
    getLoading: (state) => state.loading,
    getLoaded : (state) => state.loaded,
    getHasMore: (state) => state.hasMore,
    getError  : (state) => state.error,
};

// actions
const actions = {
    // Première page : on repart toujours de zéro (sinon la liste saute des éléments au retour sur le fil)
    items   : function ({commit}) {
        commit('setLoading', true);
        commit('setError', false);
        return new Promise((resolve, reject) => {
            axios.get('/api/me/events?offset=0', {}).then((res) => {
                const items = res.data.events || [];
                commit('setItems', items);
                commit('setOffset', items.length);
                commit('setHasMore', items.length >= 5);
                resolve(res);
            }).catch((error) => {
                commit('setError', true);
                reject(error);
            }).finally(() => {
                commit('setLoading', false);
                commit('setLoaded', true);
            });
        });
    },
    loadMore: function ({commit, state}) {
        commit('setLoading', true);
        return new Promise((resolve, reject) => {
            axios.get('/api/me/events?offset=' + state.offset, {}).then((res) => {
                const items = res.data.events || [];
                commit('pushItems', items);
                commit('setOffset', state.offset + items.length);
                commit('setHasMore', items.length >= 5);
                resolve(res);
            }).catch((error) => {
                commit('setError', true);
                reject(error);
            }).finally(() => {
                commit('setLoading', false);
            });
        });
    },
    search  : function ({commit}, payload) {
        commit('setLoading', true);
        return new Promise((resolve, reject) => {
            axios.get('/api/me/events?search=' + encodeURIComponent(payload), {}).then((res) => {
                commit('setItems', res.data.events || []);
                commit('setOffset', 0);
                // La recherche renvoie tous les résultats d'un coup : pas de « Voir plus »
                commit('setHasMore', false);
                resolve(res);
            }).catch((error) => {
                commit('setError', true);
                reject(error);
            }).finally(() => {
                commit('setLoading', false);
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
    setLoaded : (state, payload) => state.loaded = payload,
    setHasMore: (state, payload) => state.hasMore = payload,
    setError  : (state, payload) => state.error = payload,
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};