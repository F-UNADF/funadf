import axios from "axios";

// initial state
const state = () => ({
    currentUser: null,
    subdomain  : null
});

// getters
const getters = {
    currentUser: (state) => state.currentUser,
    subdomain  : (state) => state.subdomain,
};

// actions
const actions = {
    async fetchUser({commit}) {
        try {
            const response = await axios.get('/api/current_user');
            commit('setCurrentUser', response.data);
        } catch (error) {
            commit('setCurrentUser', null);
        }
    },
    async logout({commit}) {
        try {
            await axios.delete(' /users/sign_out');
            commit('setCurrentUser', null);
        } catch (error) {
            commit('setCurrentUser', null);
        }
    }
};

// mutations
const mutations = {
    setCurrentUser: (state, user) => {
        state.currentUser = user;
    },
    setSubdomain  : (state, subdomain) => {
        state.subdomain = subdomain;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};