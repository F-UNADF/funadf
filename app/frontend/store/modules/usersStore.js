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
  fetchItems: function ({ commit }, payload) {
    commit("setLoading", true);
    console.log(payload);
    return new Promise((resolve, reject) => {
      axios
        .get("/api/users", { params: payload })
        .then((res) => {
          commit("setLoading", false);
          commit("setItems", res.data.users);
          resolve(res);
        })
        .catch((error) => {
          reject(error, 2000);
        });
    });
  },
  save: function ({ dispatch, commit, state }, item) {
    return new Promise((resolve, reject) => {
      if (item.user.id) {
        axios
          .patch(
            "/api/users/" + item.user.id,
            { user: item },
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          )
          .then((res) => {
            commit("setItemInItemsById", res.data.user);
            resolve(res);
          })
          .catch((error) => {
            reject(error, 2000);
          });
      } else {
        axios
          .post(
            "/api/users",
            { user: item },
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          )
          .then((res) => {
            commit("setItemInItemsById", res.data.user);
            resolve(res);
          })
          .catch((error) => {
            reject(error, 2000);
          });
      }
    });
  },
  addRole: function ({ dispatch, commit, state }, payload) {
    return new Promise((resolve, reject) => {
      console.log(payload);
      axios
        .patch("/api/users/" + payload.id + "/add_role", payload)
        .then((res) => {
          commit("setItemInItemsById", res.data.user);
          resolve(res);
        })
        .catch((error) => {
          reject(error, 2000);
        });
    });
  },
  removeRole: function ({ dispatch, commit, state }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .patch("/api/users/" + payload.id + "/remove_role", payload)
        .then((res) => {
          commit("setItemInItemsById", res.data.user);
          resolve(res);
        })
        .catch((error) => {
          reject(error, 2000);
        });
    });
  },
  sendInvitation: function ({ dispatch, commit, state }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/users/" + payload.id + "/send_invitation", payload)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error, 2000);
        });
    });
  },
  delete: function ({ dispatch, commit, state }, id) {
    commit("setFormLoading", true);
    return new Promise((resolve, reject) => {
      axios
        .delete("/api/users/" + id, {})
        .then((res) => {
          commit("removeItemInItemsById", id);
          commit("setDialogForm", false);
          commit("setItem", {});
          resolve(res);
        })
        .catch((error) => {
          reject(error, 2000);
        });
    });
  },
  enable: function ({ dispatch, commit, state }, id) {
    return new Promise((resolve, reject) => {
      axios
        .patch("/api/users/" + id + "/enable", {})
        .then((res) => {
          commit("setItemInItemsById", res.data.user);
          resolve(res);
        })
        .catch((error) => {
          reject(error, 2000);
        });
    });
  },
  disable: function ({ dispatch, commit, state }, id) {
    return new Promise((resolve, reject) => {
      axios
        .patch("/api/users/" + id + "/disable", {})
        .then((res) => {
          commit("setItemInItemsById", res.data.user);
          resolve(res);
        })
        .catch((error) => {
          reject(error, 2000);
        });
    });
  },
  referentiels: function ({ commit }) {
    return new Promise((resolve, reject) => {
      axios
        .get("/api/referentiels/users", {})
        .then((res) => {
          commit("setReferentiels", res.data);
          resolve(res);
        })
        .catch((error) => {
          reject(error, 2000);
        });
    });
  },
  getItem: function ({ commit }, id) {
    commit("setFormLoading", true);
    return new Promise((resolve, reject) => {
      axios
        .get("/api/users/" + id, {})
        .then((res) => {
          commit("setItem", res.data);
          commit("setDialogForm", true);
          commit("setFormLoading", false);
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
  setReferentiels: (state, payload) => (state.referentiels = payload),
  setDialogForm: (state, payload) => (state.dialogForm = payload),
  setFormLoading: (state, payload) => (state.formLoading = payload),
  setItemInItemsById: function (state, item) {
    if (typeof item !== "object") {
      item = JSON.parse(item);
    }
    let index = state.items.findIndex((el) => el.id === item.id);
    if (-1 !== index) {
      Object.assign(state.items[index], item);
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
