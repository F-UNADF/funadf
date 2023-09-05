import axios from "axios";

// initial state
const state = () => ({
    items       : [],
    item        : {},
    loading     : false,
    formLoading : false,
    referentiels: [],
    dialogForm  : false,
});

// getters
const getters = {
    getItems       : (state) => state.items,
    getItem        : (state) => state.item,
    getLoading     : (state) => state.loading,
    getFormLoading : (state) => state.formLoading,
    getReferentiels: (state) => state.referentiels,
    getDialogForm  : (state) => state.dialogForm,
};

// actions
const actions = {
    items       : function ({commit}) {
        commit('setLoading', true);
        return new Promise((resolve, reject) => {
            axios.get('/api/posts', {}).then((res) => {
                commit('setItems', res.data.posts);
                commit('setLoading', false);
                resolve(res);
            }).catch((error) => {
                reject(error, 2000);
            });
        });
    },
    item        : function ({commit}, id) {
        return new Promise((resolve, reject) => {
            axios.get('/api/posts/' + id, {}).then((res) => {
                let post = res.data.post;
                post.files = res.data.files;
                post.accesses = res.data.accesses;
                commit('setItem', res.data.post);
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
            if (item.post.id) {
                axios.patch('/api/posts/' + item.post.id, item, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                }).then((res) => {
                    commit('setItemInItemsById', res.data.post);
                    commit('setItem', res.data.post);
                    resolve(res.data.post);
                }).catch((error) => {
                    reject(error, 2000);
                });
            } else {
                axios.post('/api/posts', item, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                }).then((res) => {
                    commit('setItem', res.data.post);
                    commit('setItemInItemsById', res.data.post);
                    resolve(res.data.post);
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
            axios.delete('/api/posts/' + id, {}).then((res) => {
                commit('removeItemInItemsById', id);
                resolve(res);
            }).catch((error) => {
                reject(error, 2000);
            });
        });
    },
    deleteFile  : function ({
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
    referentiels: function ({commit}) {
        return new Promise((resolve, reject) => {
            axios.get('/api/referentiels/posts', {}).then((res) => {
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
    setItems             : (state, payload) => state.items = payload,
    setItem              : (state, payload) => state.item = payload,
    setLoading           : (state, payload) => state.loading = payload,
    setReferentiels      : (state, payload) => state.referentiels = payload,
    setDialogForm        : (state, payload) => state.dialogForm = payload,
    setFormLoading       : (state, payload) => state.formLoading = payload,
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