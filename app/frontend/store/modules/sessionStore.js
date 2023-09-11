import axios from "axios";

// initial state
const state = () => ({
    currentUser : {},
    originalUser: {},
    subdomain   : null
});

// getters
const getters = {
    currentUser    : (state) => state.currentUser,
    getOriginalUser: (state) => state.originalUser,
    subdomain      : (state) => state.subdomain,
};

// actions
const actions = {
    async fetchUser({commit}) {
        try {
            const response = await axios.get('/api/current_user');
            commit('setCurrentUser', response.data.user);
            // if response.dqtq.user is empty or null the rediredct to login page
            if (response.data.user === null) {
                window.location.href = '/users/sign_in';
            }
            commit('setOriginalUser', response.data.original_user);
        } catch (error) {
            commit('setCurrentUser', null);
        }
    },
    async logout({commit}) {
        try {
            await axios.delete(' /users/sign_out');
            commit('setCurrentUser', null);
            commit('setOriginalUser', null);
            window.location.href = '/users/sign_in';
        } catch (error) {
            commit('setCurrentUser', null);
            commit('setOriginalUser', null);
        }
    },
    switch_back({
                    commit,
                    dispatch,
                    state
                }) {
        axios.get('/switch_user?scope_identifier=user_' + state.originalUser.id).then((response) => {
            dispatch('fetchUser');
        });
    }
};

// mutations
const mutations = {
    setCurrentUser : (state, user) => {
        state.currentUser = user;
    },
    setOriginalUser: (state, user) => {
        state.originalUser = user;
    },
    setSubdomain   : (state, subdomain) => {
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