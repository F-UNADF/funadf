import axios from "axios";

// initial state
const state = () => ({
    items: [],
    item: {},
    members: [],
    loading: false,
    formLoading: false,
    referentiels: [],
    dialogForm: false,
});

// getters
const getters = {
    getItems: (state) => state.items,
    getItem: (state) => state.item,
    getMembers: (state) => state.members,
    getLoading: (state) => state.loading,
    getFormLoading: (state) => state.formLoading,
    getReferentiels: (state) => state.referentiels,
    getDialogForm: (state) => state.dialogForm,
};

// actions
const actions = {
    items: function ({commit}) {
        commit('setLoading', true);
        return new Promise((resolve, reject) => {
            axios.get('/api/associations', {}).then((res) => {
                commit('setItems', res.data.associations);
                commit('setLoading', false);
                resolve(res);
            }).catch((error) => {
                reject(error, 2000);
            });
        });
    },
    item: function ({commit}, id) {
        return new Promise((resolve, reject) => {
            axios.get('/api/associations/' + id, {}).then((res) => {
                commit('setItem', res.data.association);
                commit('setMembers', res.data.members);
                resolve(res);
            }).catch((error) => {
                reject(error, 2000);
            });
        });
    },
    save: function ({dispatch, commit, state}, item) {
        return new Promise((resolve, reject) => {
            if (item.id) {
                axios.patch('/api/associations/' + item.id, {association: item}, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                }).then((res) => {
                    commit('setItemInItemsById', res.data.association);
                    commit('setItem', res.data.association);
                    resolve(res.data.association);
                }).catch((error) => {
                    reject(error, 2000);
                });
            } else {
                axios.post('/api/associations', {association: item}, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                }).then((res) => {
                    commit('setItem', res.data.association);
                    commit('setItemInItemsById', res.data.association);
                    resolve(res.data.association);
                }).catch((error) => {
                    reject(error, 2000);
                });
            }
        });
    },
    delete: function ({dispatch, commit, state}, id) {
        return new Promise((resolve, reject) => {
            axios.delete('/api/associations/' + id, {}).then((res) => {
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
            axios.get('/api/referentiels/associations', {}).then((res) => {
                commit('setReferentiels', res.data);
                resolve(res);
            }).catch((error) => {
                reject(error, 2000);
            });
        });
    },
    addMembers: function ({dispatch, commit, state}, members) {
        return new Promise((resolve, reject) => {
            axios.post('/api/associations/' + state.item.id + '/members', {members: members})
            .then((res) => {
                commit('setMembers', res.data.members);
                resolve(res);
            }).catch((error) => {
                reject(error, 2000);
            });
        });
    },
    setRole: function ({dispatch, commit, state}, data) {
        return new Promise((resolve, reject) => {
            axios.post('/api/associations/' + state.item.id + '/roles/edit', data)
            .then((res) => {
                commit('setMemberInMembersById', res.data.membership);
                resolve(res);
            }).catch((error) => {
                reject(error, 2000);
            });
        });
    },
    removeMember: function ({dispatch, commit, state}, membership_id) {
        return new Promise((resolve, reject) => {
            axios.delete('/api/associations/' + state.item.id + '/members/' + membership_id, {})
            .then((res) => {
                commit('removeMemberIdMembersById', membership_id)
                resolve(res);
            }).catch((error) => {
                reject(error, 2000);
            });
        });
    }
};

// mutations
const mutations = {
    setItems: (state, payload) => state.items = payload,
    setItem: (state, payload) => state.item = payload,
    setMembers: (state, payload) => state.members = payload,
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
    setMemberInMembersById: function (state, item) {
        if (typeof item !== 'object') {
            item = JSON.parse(item);
        }
        let index = state.members.findIndex(el => el.membership_id === item.membership_id);
        if (-1 !== index) {
            Object.assign(state.members[index], item);
        } else {
            state.members.push(item);
        }
    },
    removeMemberIdMembersById: function (state, id) {
        let index = state.members.findIndex(el => el.membership_id === id);
        if (-1 !== index) {
            state.members.splice(index, 1);
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