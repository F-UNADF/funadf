import axios from "axios";

// initial state
const state = () => ({
    currentUser     : {},
    roles           : [],
    originalUser    : {},
    editProfilDialog: false,
    subdomain       : null
});

// getters
const getters = {
    currentUser     : (state) => state.currentUser,
    roles           : (state) => state.roles,
    getOriginalUser : (state) => state.originalUser,
    subdomain       : (state) => state.subdomain,
    editProfilDialog: (state) => state.editProfilDialog
};

// actions
const actions = {
    async fetchUser({commit}) {
        try {
            const response = await axios.get('/api/current_user');
            commit('setCurrentUser', response.data.user);
            commit('setRoles', response.data.roles);

            // if response.dqtq.user is empty or null the rediredct to login page
            if (response.data.user === null && window.location.pathname !== '/connexion') {
                window.location.href = '/connexion';
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
    login({ commit }, user) {
        // Return a Promise
        return new Promise((resolve, reject) => {
            axios.post('/users/sign_in', user)
                .then((response) => {
                    commit('setCurrentUser', response.data.user);
                    commit('setOriginalUser', null);
                    resolve(response);
                })
                .catch((error) => {
                    reject(error); // Reject with the error if request fails
                });
        });
    },
    switch_to({ commit, dispatch, state }, user_id) {
        axios.get('/api/switch/' + user_id).then((response) => {
            commit('setCurrentUser', response.data.current_user);
            commit('setOriginalUser', response.data.original_user);
            window.location.href = response.data.redirect_to;
        });
    },
    switch_back({
                    commit,
                    dispatch,
                    state
                }) {
        axios.get('/api/switch_back').then((response) => {
            commit('setCurrentUser', response.data.current_user);
            commit('setOriginalUser', null);
            window.location.href = response.data.redirect_to;
        });
    }
};

// mutations
const mutations = {
    setCurrentUser     : (state, user) => {
        state.currentUser = user;
    },
    setOriginalUser    : (state, user) => {
        state.originalUser = user;
    },
    setSubdomain       : (state, subdomain) => {
        state.subdomain = subdomain;
    },
    setRoles           : (state, roles) => {
        state.roles = roles;
    },
    setEditProfilDialog: (state, value) => {
        state.editProfilDialog = value;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};