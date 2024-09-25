import axios from "axios";

// initial state
const state = () => ({
    items       : [],
    item        : {},
    loading     : false,
    formLoading : false,
    referentiels: [],
    dialogForm  : false,
    votersCount : 0,
});

// getters
const getters = {
    getItems       : (state) => state.items,
    getItem        : (state) => state.item,
    getLoading     : (state) => state.loading,
    getFormLoading : (state) => state.formLoading,
    getReferentiels: (state) => state.referentiels,
    getDialogForm  : (state) => state.dialogForm,
    getVotersCount : (state) => state.votersCount,
};

// actions
const actions = {
    items       : function ({commit}) {
        commit('setLoading', true);
        return new Promise((resolve, reject) => {
            axios.get('/api/campaigns', null).then((res) => {
                commit('setItems', res.data.campaigns);
                commit('setLoading', false);
                resolve(res);
            }).catch((error) => {
                reject(error, 2000);
            });
        });
    },
    item        : function ({commit}, id) {
        return new Promise((resolve, reject) => {
            axios.get('/api/campaigns/' + id, {}).then((res) => {
                let item = res.data.campaign;
                item['motions'] = res.data.motions;
                item['voting_tables'] = res.data.voting_tables;
                item['results'] = res.data.results;
                item['free_results'] = res.data.free_results;
                item['choices_results'] = res.data.choices_results;
                item['voters'] = res.data.voters;
                commit('setItem', res.data.campaign);
                resolve(res);
            }).catch((error) => {
                reject(error, 2000);
            });
        });
    },
    changeState : function ({dispatch}, {
        id,
        state
    }) {
        console.log(state);
        return new Promise((resolve, reject) => {
            axios.patch('/api/campaigns/' + id + '/change_state', {state_event: state}).then((res) => {
                dispatch('items');
                resolve(res);
            }).catch((error) => {
                reject(error, 2000);
            });
        });
    },
    save        : function ({
                                dispatch,
                                commit,
                                state
                            }, item) {
        return new Promise((resolve, reject) => {
            if (item.id) {
                axios.patch('/api/campaigns/' + item.id, {campaign: item}, {}).then((res) => {
                    dispatch('items');
                    commit('setItem', res.data.campaign);
                    resolve(res.data.campaign);
                }).catch((error) => {
                    reject(error, 2000);
                });
            } else {
                axios.post('/api/campaigns', {campaign: item}, {}).then((res) => {
                    commit('setItem', res.data.campaign);
                    dispatch('items');
                    resolve(res.data.campaign);
                }).catch((error) => {
                    reject(error, 2000);
                });
            }
        });
    },
    delete      : function ({
                                dispatch,
                                commit,
                                state
                            }, id) {
        return new Promise((resolve, reject) => {
            axios.delete('/api/campaigns/' + id, {}).then((res) => {
                commit('removeItemInItemsById', id);
                dispatch('item', id);
                resolve(res);
            }).catch((error) => {
                reject(error, 2000);
            });
        });
    },
    referentiels: function ({commit}) {
        return new Promise((resolve, reject) => {
            axios.get('/api/referentiels/campaigns', {}).then((res) => {
                commit('setReferentiels', res.data);
                resolve(res);
            }).catch((error) => {
                reject(error, 2000);
            });
        });
    },
    votersCount : function ({commit}, id) {
        return new Promise((resolve, reject) => {
            axios.get('/api/campaigns/' + id + '/voters_count', {}).then((res) => {
                commit('setVotersCount', res.data.voters_count);
                resolve(res);
            }).catch((error) => {
                reject(error, 2000);
            });
        });
    }
};

// mutations
const mutations = {
    setItems             : (state, payload) => state.items = payload,
    setItem              : (state, payload) => state.item = payload,
    setLoading           : (state, payload) => state.loading = payload,
    setReferentiels      : (state, payload) => state.referentiels = payload,
    setDialogForm        : (state, payload) => state.dialogForm = payload,
    setFormLoading       : (state, payload) => state.formLoading = payload,
    setVotersCount       : (state, payload) => state.votersCount = payload,
    setItemInItemsById   : function (state, item) {
        if (typeof item !== 'object') {
            item = JSON.parse(item);
        }
        let index = state.items.findIndex(el => el.id === item.id);
        if (-1 !== index) {
            Object.assign(state.items[index], item);
        } else {
            state.items.push(item);
        }
    },
    removeItemInItemsById: function (state, id) {
        let index = state.items.findIndex(el => el.id === id);
        if (-1 !== index) {
            state.items.splice(index, 1);
        }
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};