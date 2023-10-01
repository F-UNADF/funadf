import axios from "axios";

// initial state
const state = () => ({
    items    : [],
    item     : {},
    structure: {},
    motions  : [],
    voters   : [],
    results  : [],
    loading  : false,
});

// getters
const getters = {
    getItems    : (state) => state.items,
    getItem     : (state) => state.item,
    getStructure: (state) => state.structure,
    getMotions  : (state) => state.motions,
    getVoters   : (state) => state.voters,
    getLoading  : (state) => state.loading,
    getResults  : (state) => state.results,
};

// actions
const actions = {
    items: function ({commit}) {
        commit('setLoading', true);
        return new Promise((resolve, reject) => {
            axios.get('/api/votes', {}).then((res) => {
                commit('setItems', res.data.campaigns);
                commit('setLoading', false);
                resolve(res);
            }).catch((error) => {
                reject(error, 2000);
            });
        });
    },
    item : function ({commit}, id) {
        commit('setLoading', true);
        return new Promise((resolve, reject) => {
            axios.get('/api/votes/' + id, {}).then((res) => {
                commit('setLoading', false);
                commit('setItem', res.data.campaign);
                commit('setStructure', res.data.structure);
                commit('setMotions', res.data.motions);
                commit('setVoters', res.data.voters);
                commit('setResults');
                resolve(res);
            }).catch((error) => {
                reject(error, 2000);
            });
        });
    },
    vote : function ({commit}, payload) {
        console.log(payload);

        return new Promise((resolve, reject) => {
            axios.post('/api/votes', payload, {payload}).then((res) => {
                resolve(res);
            }).catch((error) => {
                reject(error, 2000);
            });
        });
    }

};

// mutations
const mutations = {
    setItems    : (state, payload) => state.items = payload,
    setItem     : (state, payload) => state.item = payload,
    setStructure: (state, payload) => state.structure = payload,
    setMotions  : (state, payload) => state.motions = payload,
    setVoters   : (state, payload) => state.voters = payload,
    setLoading  : (state, payload) => state.loading = payload,
    setResults  : (state) => {
        state.results = [];
        state.motions.forEach(element => {
            state.results.push({
                motion_id: element.id,
                name     : element.name,
                kind     : element.kind,
                choices  : element.choices,
                vote     : null,
            });
        });
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};