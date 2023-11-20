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
        } catch (error) {
            commit('setCurrentUser', null);
            commit('setOriginalUser', null);
        }
        window.location.href = '/';
    },
    switch_to({ commit, dispatch, state }, user_id) {
        axios.get('/api/switch/' + user_id).then((response) => {
            commit('setCurrentUser', response.data.current_user);
            commit('setOriginalUser', response.data.original_user);
            window.location.href = response.data.redirect_to;
        });
    },
    switch_back({ commit, dispatch,  state }) {
        axios.get('/api/switch_back').then((response) => {
            commit('setCurrentUser', response.data.current_user);
            commit('setOriginalUser', null);
            window.location.href = response.data.redirect_to;
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