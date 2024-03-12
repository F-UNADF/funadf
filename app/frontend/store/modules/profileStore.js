import axios from "axios";

const state = {
  profile: {},
  gratitudes: [],
  fees: [],
  presidences: [],
  phases: [],
  responsabilities: [],
  roles: [],
};

const getters = {
  getProfile: (state) => state.profile,
  getGratitudes: (state) => state.gratitudes,
  getFees: (state) => state.fees,
  getPresidences: (state) => state.presidences,
  getPhases: (state) => state.phases,
  getResponsabilities: (state) => state.responsabilities,
  getRoles: (state) => state.roles,
};

const mutations = {
  setProfile: (state, profile) => (state.profile = profile),
  setGratitudes: (state, gratitudes) => (state.gratitudes = gratitudes),
  setFees: (state, fees) => (state.fees = fees),
  setPresidences: (state, presidences) => (state.presidences = presidences),
  setPhases: (state, phases) => (state.phases = phases),
  setResponsabilities: (state, responsabilities) =>
    (state.responsabilities = responsabilities),
  setRoles: (state, roles) => (state.roles = roles),
};

const actions = {
  getProfile: function ({ commit }) {
    return new Promise((resolve, reject) => {
      axios
        .get("/api/profile", {})
        .then((res) => {
          commit("setProfile", res.data.profile);
          commit("setGratitudes", res.data.gratitudes);
          commit("setFees", res.data.fees);
          commit("setPresidences", res.data.presidences);
          commit("setPhases", res.data.phases);
          commit("setResponsabilities", res.data.responsabilities);
          commit("setRoles", res.data.roles);

          resolve(res);
        })
        .catch((error) => {
          reject(error, 2000);
        });
    });
  },
};

export default {
  namespaced: true,
  state: state,
  getters: getters,
  mutations: mutations,
  actions: actions,
};
