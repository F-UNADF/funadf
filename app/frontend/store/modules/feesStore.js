import axios from "axios";

// initial state
const state = () => ({
  items: [],
  item: {},
  loading: false,
  formLoading: false,
  dialogForm: false,
  referentiel: [],
});

// getters
const getters = {
  getItems: (state) => state.items,
  getItem: (state) => state.item,
  getLoading: (state) => state.loading,
  getFormLoading: (state) => state.formLoading,
  getDialogForm: (state) => state.dialogForm,
  getReferentiel: (state) => state.referentiel,
};

// actions
const actions = {
  items: function ({ commit }) {
    commit("setLoading", true);
    return new Promise((resolve, reject) => {
      axios
        .get("/api/fees", {})
        .then((res) => {
          commit("setItems", res.data.fees);
          commit("setLoading", false);
          resolve(res);
        })
        .catch((error) => {
          reject(error, 2000);
        });
    });
  },
  item: function ({ commit }, id) {
    return new Promise((resolve, reject) => {
      axios
        .get("/api/fees/" + id, {})
        .then((res) => {
          commit("setItem", res.data.fee);
          resolve(res);
        })
        .catch((error) => {
          reject(error, 2000);
        });
    });
  },
  save: function ({ commit }, item) {
    return new Promise((resolve, reject) => {
      if (item.fee.id) {
        axios
          .patch("/api/fees/" + item.fee.id, item)
          .then((res) => {
            commit("setItem", res.data.fee);
            resolve(res.data.fee);
          })
          .catch((error) => {
            reject(error, 2000);
          });
      } else {
        axios
          .post("/api/fees", item)
          .then((res) => {
            console.log(res.data);
            commit("setItem", res.data.fee);
            resolve(res.data.fee);
          })
          .catch((error) => {
            reject(error, 2000);
          });
      }
    });
  },
  delete: function ({ dispatch, commit, state }, id) {
    return new Promise((resolve, reject) => {
      axios
        .delete("/api/fees/" + id, {})
        .then((res) => {
          commit("removeItemInItemsById", id);
          resolve(res);
        })
        .catch((error) => {
          reject(error, 2000);
        });
    });
  },
  referentiels: function ({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get('/api/referentiels/fees', {}).then((res) => {
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
  setItems: (state, payload) => (state.items = payload),
  setItem: (state, payload) => (state.item = payload),
  setLoading: (state, payload) => (state.loading = payload),
  setReferentiels: (state, payload) => (state.referentiels = payload),
  setDialogForm: (state, payload) => (state.dialogForm = payload),
  setFormLoading: (state, payload) => (state.formLoading = payload),
  setReferentiels: (state, paypload) => (state.referentiel = paypload),
  setItemInItemsById: function (state, item) {
    if (typeof item !== "object") {
      item = JSON.parse(item);
    }
    let index = state.items.findIndex((el) => el.id === item.id);
    if (-1 !== index) {
      Object.assign(state.items[index], item);
    } else {
      state.items.push(item);
    }
  },
  removeItemInItemsById: function (state, id) {
    let index = state.items.findIndex((el) => el.id === id);
    if (-1 !== index) {
      state.items.splice(index, 1);
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
