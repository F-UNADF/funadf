import axios from "axios";

// initial state
const state = () => ({
    currentUser: null,
});

// getters
const getters = {
    currentUser(state) {
        return state.currentUser;
    }
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
};

// mutations
const mutations = {
    setCurrentUser(state, user) {
        state.currentUser = user;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};