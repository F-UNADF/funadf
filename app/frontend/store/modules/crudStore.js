// stores/crudStore.js
import axios from "axios";
import { ref } from "firebase/database";

export default function createCrudStore({ resource }) {
    const baseUri = `/api/${resource}`;

    return {
        namespaced: true,
        state: () => ({
            items: [],
            item: {},
            loading: false,
            dialog: false,
            config: {},
            referentiels: [],
            members: [],
        }),
        getters: {
            getItems: (state) => state.items,
            getItem: (state) => state.item,
            getLoading: (state) => state.loading,
            getDialog: (state) => state.dialog,
            getConfig: (state) => state.config,
            getReferentiels: (state) => state.referentiels,
            getMembers: (state) => state.members,
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
                // si il a des membres
                if (res.data.members) {
                    commit('setMembers', res.data.members);
                }
            },
            async fetchConfig({ commit }) {
                const res = await axios.get(`${baseUri}/config`);
                commit('setConfig', res.data.config);
            },
            async saveItem({ commit, dispatch }, item) {
                const method = item.id ? 'patch' : 'post';
                const uri = item.id ? `${baseUri}/${item.id}` : baseUri;

                const formData = new FormData();
                const resourceName = resource.slice(0, -1);

                for (const key in item) {
                    // Gestion spéciale pour les objets/fichiers si besoin
                    if (item[key] instanceof File || item[key] instanceof Blob) {
                        formData.append(`${resourceName}[${key}]`, item[key], item[key].name);
                    } else if ( item[key] !== null ) {
                        formData.append(`${resourceName}[${key}]`, item[key]);
                    }
                }

                const res = await axios[method](uri, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });

                commit('setItem', res.data[resource.slice(0, -1)]);
                commit('setDialog', false);
                await dispatch('fetchItems');
            },
            referentiels: function ({ commit }) {
                return new Promise((resolve, reject) => {
                    axios.get(`/api/referentiels/${resource}`, {}).then((res) => {
                        commit('setReferentiels', res.data);
                        resolve(res);
                    }).catch((error) => {
                        reject(error, 2000);
                    });
                });
            },
            addMembers: function ({ dispatch, commit, state }, members) {
                return new Promise((resolve, reject) => {
                    axios.post(`/api/${resource}/${state.item.id}/members`, { members: members })
                        .then((res) => {
                            commit('setMembers', res.data.members);
                            resolve(res);
                        }).catch((error) => {
                            reject(error, 2000);
                        });
                });
            },
            setRole: function ({ dispatch, commit, state }, data) {
                return new Promise((resolve, reject) => {
                    axios.post(`/api/${resource}/${state.item.id}/roles/edit`, data)
                        .then((res) => {
                            commit('setMembers', res.data.members);
                            resolve(res);
                        }).catch((error) => {
                            reject(error, 2000);
                        });
                });
            },
            removeMember: function ({ dispatch, commit, state }, membership_id) {
                return new Promise((resolve, reject) => {
                    axios.delete(`/api/memberships/${membership_id}`, {})
                        .then((res) => {
                            commit('setMembers', res.data.members);
                            resolve(res);
                        }).catch((error) => {
                            reject(error, 2000);
                        });
                });
            }
        },
        mutations: {
            setItems: (state, items) => (state.items = items),
            setItem: (state, item) => (state.item = item),
            setLoading: (state, loading) => (state.loading = loading),
            setDialog: (state, dialog) => (state.dialog = dialog),
            setConfig: (state, config) => (state.config = config),
            setReferentiels: (state, referentiels) => (state.referentiels = referentiels),
            setMembers: (state, members) => (state.members = members),
            setMemberInMembersById: (state, membership) => {
                const index = state.members.findIndex(member => member.id === membership.id);
                if (index !== -1) {
                    state.members[index] = membership;
                }
            },
            removeMemberIdMembersById: (state, membership_id) => {
                const index = state.members.findIndex(member => member.id === membership_id);
                if (index !== -1) {
                    state.members.splice(index, 1);
                }
            }
        },
    };
}
