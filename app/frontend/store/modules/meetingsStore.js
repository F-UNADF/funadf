import axios from "axios";

// initial state
const state = () => ({
  items: [],
  item: {},
  attendees: [],
  loading: false,
  formLoading: false,
  dialogForm: false,
  referentiels: {},
});

// getters
const getters = {
  getItems: (state) => state.items,
  getItem: (state) => state.item,
  getAttendees: (state) => state.attendees,
  getLoading: (state) => state.loading,
  getFormLoading: (state) => state.formLoading,
  getDialogForm: (state) => state.dialogForm,
  getReferentiels: (state) => state.referentiels,
};

// actions
const actions = {
  items: function ({ commit }) {
    commit("setLoading", true);
    return new Promise((resolve, reject) => {
      axios
        .get("/api/meetings", {})
        .then((res) => {
          commit("setItems", res.data.meetings);
          commit("setLoading", false);
          resolve(res);
        })
        .catch((error) => {
          reject(error, 2000);
        });
    });
  },
  item: function ({ commit }, item) {
    return new Promise((resolve, reject) => {
      axios
        .get("/api/meetings/" + item.id, {})
        .then((res) => {
          commit("setItem", res.data.meeting);
          commit("setAttendees", res.data.attendees);
          resolve(res);
        })
        .catch((error) => {
          reject(error, 2000);
        });
    });
  },
  save: function ({ commit }, item) {
    return new Promise((resolve, reject) => {
      if (item.meeting.id) {
        axios
          .patch("/api/meetings/" + item.meeting.id, item)
          .then((res) => {
            commit("setItemInItemsById", res.data.meeting);
            commit("setItem", res.data.meeting);
            resolve(res.data.meeting);
          })
          .catch((error) => {
            reject(error, 2000);
          });
      } else {
        axios
          .post("/api/meetings", item)
          .then((res) => {
            commit("setItem", res.data.meeting);
            commit("setAttendees", res.data.attendees);
            resolve(res.data.meeting);
          })
          .catch((error) => {
            reject(error, 2000);
          });
      }
    });
  },
  delete: function ({ commit }, id) {
    return new Promise((resolve, reject) => {
      axios
        .delete("/api/meetings/" + id, {})
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
      axios
        .get("/api/referentiels/meetings", {})
        .then((res) => {
          commit("setReferentiels", res.data);
          resolve(res);
        })
        .catch((error) => {
          reject(error, 2000);
        });
    });
  },
  addAttendees: function ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/meetings/" + payload.meeting.id + "/add_attendees", {
          attendees: payload.attendees,
        })
        .then((res) => {
          commit("setItem", res.data.meeting);
          commit("setAttendees", res.data.attendees);
          commit("setItemInItemsById", res.data.meeting);
          resolve(res.data.meeting);
        })
        .catch((error) => {
          reject(error, 2000);
        });
    });
  },
  removeAttendees: function ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/meetings/" + payload.meeting.id + "/remove_attendees", {
          attendees: payload.attendees,
        })
        .then((res) => {
          commit("setItem", res.data.meeting);
          commit("setAttendees", res.data.attendees);
          commit("setItemInItemsById", res.data.meeting);
          resolve(res.data.meeting);
        })
        .catch((error) => {
          reject(error, 2000);
        });
    });
  }
};

// mutations
const mutations = {
  setItems: (state, payload) => (state.items = payload),
  setItem: (state, payload) => (state.item = payload),
  setLoading: (state, payload) => (state.loading = payload),
  setReferentiels: (state, payload) => (state.referentiels = payload),
  setDialogForm: (state, payload) => (state.dialogForm = payload),
  setAttendees: (state, payload) => (state.attendees = payload),
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
