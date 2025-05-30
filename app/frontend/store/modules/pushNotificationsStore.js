import axios from "axios";

// initial state
const state = () => ({
  items: [],
  item: {},
  loading: false,
  formLoading: false,
  dialogForm: false,
});

// getters
const getters = {
  getItems: (state) => state.items,
  getItem: (state) => state.item,
  getLoading: (state) => state.loading,
  getFormLoading: (state) => state.formLoading,
  getDialogForm: (state) => state.dialogForm,
};

// actions
const actions = {
  items: function ({ commit }) {
    commit("setLoading", true);
    return new Promise((resolve, reject) => {
      axios
        .get("/api/push_notifications", {})
        .then((res) => {
          commit("setItems", res.data);
          commit("setLoading", false);
          resolve(res);
        })
        .catch((error) => {
          reject(error, 2000);
        });
    });
  },
  save: function ({ commit }, item) {
    return new Promise((resolve, reject) => {
      if (item.id) {
        axios
          .patch("/api/push_notifications/" + item.id, item)
          .then((res) => {
            commit("setItem", res.data);
            resolve(res.data);
          })
          .catch((error) => {
            reject(error, 2000);
          });
      } else {
        axios
          .post("/api/push_notifications", item)
          .then((res) => {
            commit("setItem", res.data);
            resolve(res.data);
          })
          .catch((error) => {
            reject(error, 2000);
          });
      }
    });
  },
  send: function ({ commit }, item) {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/push_notifications/send", {id: item})
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error, 2000);
        });
    });
  },
  delete: function ({ dispatch, commit, state }, id) {
    return new Promise((resolve, reject) => {
      axios
        .delete("/api/push_notifications/" + id, {})
        .then((res) => {
          commit("removeItemInItemsById", id);
          resolve(res);
        })
        .catch((error) => {
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
  setDialogForm: (state, payload) => (state.dialogForm = payload),
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
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
