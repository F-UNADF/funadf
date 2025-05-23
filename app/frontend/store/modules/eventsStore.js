import axios from "axios";

// initial state
const state = () => ({
    items: [],
    item: {},
    loading: false,
    formLoading: false,
    referentiels: [],
    dialogForm: false,
});

// getters
const getters = {
    getItems: (state) => state.items,
    getItem: (state) => state.item,
    getLoading: (state) => state.loading,
    getFormLoading: (state) => state.formLoading,
    getReferentiels: (state) => state.referentiels,
    getDialogForm: (state) => state.dialogForm,
};

// actions
const actions = {
    items: function ({ commit }, payload) {
        commit('setLoading', true);
        return new Promise((resolve, reject) => {
            axios.get('/api/events', { params: payload }).then((res) => {
                commit('setItems', res.data.events);
                commit('setLoading', false);
                resolve(res);
            }).catch((error) => {
                reject(error, 2000);
            });
        });
    },
    item: function ({ commit }, id) {
        return new Promise((resolve, reject) => {
            axios.get('/api/events/' + id, {}).then((res) => {
                let event = res.data.event;
                event.category = event.category.name;
                event.files = res.data.files;
                event.accesses = res.data.accesses;
                commit('setItem', res.data.event);
                resolve(res);
            }).catch((error) => {
                reject(error, 2000);
            });
        });
    },
    save: function ({
        dispatch,
        commit,
        state
    }, item) {
        return new Promise((resolve, reject) => {
            if (item.event.id) {
                axios.patch('/api/events/' + item.event.id, item, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                }).then((res) => {
                    commit('setItemInItemsById', res.data.event);
                    commit('setItem', res.data.event);
                    resolve(res.data.event);
                }).catch((error) => {
                    reject(error, 2000);
                });
            } else {
                axios.post('/api/events', item, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                }).then((res) => {
                    commit('setItem', res.data.event);
                    commit('setItemInItemsById', res.data.event);
                    resolve(res.data.event);
                }).catch((error) => {
                    reject(error, 2000);
                });
            }
        });
    },
    delete: function ({ dispatch,
        commit,
        state
    }, id) {
        return new Promise((resolve, reject) => {
            axios.delete('/api/events/' + id, {}).then((res) => {
                commit('removeItemInItemsById', id);
                resolve(res);
            }).catch((error) => {
                reject(error, 2000);
            });
        });
    },
    deleteFile: function ({
        dispatch,
        commit,
        state
    }, id) {
        return new Promise((resolve, reject) => {
            axios.delete('/api/files/' + id, {}).then((res) => {
                resolve(res);
            }).catch((error) => {
                reject(error, 2000);
            });
        });
    },
    referentiels: function ({ commit }, payload) {
        return new Promise((resolve, reject) => {
            axios.get('/api/referentiels/events', { params: payload }).then((res) => {
                commit('setReferentiels', res.data);
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
    setReferentiels: (state, payload) => state.referentiels = payload,
    setDialogForm: (state, payload) => state.dialogForm = payload,
    setFormLoading: (state, payload) => state.formLoading = payload,
    setItemInItemsById: function (state, item) {
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