// stores/crudStore.js
import axios from "axios";

function singularize(word) {
    if (word.endsWith('ies')) {
        return word.slice(0, -3) + 'y'; // e.g., "parties" -> "party"
    }
    if (word.endsWith('ches') || word.endsWith('shes') || word.endsWith('xes') || word.endsWith('ses') || word.endsWith('zes')) {
        return word.slice(0, -2); // e.g., "churches" -> "church"
    }
    if (word.endsWith('s') && !word.endsWith('ss')) {
        return word.slice(0, -1); // e.g., "regions" -> "region"
    }
    return word; // return as is if no rule matched
}

function appendFormData(fd, key, value) {
  if (value instanceof File || value instanceof Blob) {
    fd.append(key, value, value.name); // OK pour Rails
  } else if (Array.isArray(value)) {
    value.forEach((v, i) => {
      if (typeof v === 'object' && !(v instanceof File)) {
        Object.keys(v).forEach(subKey => {
          fd.append(`${key}[${i}][${subKey}]`, v[subKey]);
        });
      } else {
        fd.append(`${key}[]`, v);
      }
    });
  } else if (value !== null && typeof value === 'object') {
    Object.keys(value).forEach(subKey => {
      appendFormData(fd, `${key}[${subKey}]`, value[subKey]);
    });
  } else {
    fd.append(key, value);
  }
}

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
                    console.log('fetchItems response:', res.data); // Debug log
                    commit('setItems', res.data[resource]);
                } finally {
                    commit('setLoading', false);
                }
            },
            fetchItem({ commit }, id) {
                axios.get(`${baseUri}/${id}`).then((res) => {
                    commit('setItem', res.data[singularize(resource)]);

                    if (res.data.members) {
                        commit('setMembers', res.data.members);
                    }
                });
            },
            async fetchConfig({ commit }) {
                const res = await axios.get(`${baseUri}/config`);
                commit('setConfig', res.data.config);
            },
            async saveItem({ commit, dispatch }, item) {
                const method = item.id ? 'patch' : 'post';
                const uri = item.id ? `${baseUri}/${item.id}` : baseUri;

                const formData = new FormData();
                const resourceName = singularize(resource);

                for (const key in item) {
                    appendFormData(formData, `${resourceName}[${key}]`, item[key]);
                }

                const res = await axios[method](uri, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });

                commit('setItem', res.data[singularize(resource)]);
                commit('setDialog', false);
                await dispatch('fetchItems');
            },
            deleteItem({ commit, dispatch }, id) {
                return new Promise((resolve, reject) => {
                    axios.delete(`${baseUri}/${id}`, {}).then(async (res) => {
                        await dispatch('fetchItems');
                        resolve(res);
                    }).catch((error) => {
                        reject(error, 2000);
                    });
                });
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
