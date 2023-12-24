import axios from "axios";

// initial state
const state = () => ({
    currentUser:  {},
    originalUser: {},
    subdomain:    null,
    googleLink:   null,
});

// getters
const getters = {
    currentUser:     (state) => state.currentUser,
    getOriginalUser: (state) => state.originalUser,
    subdomain:       (state) => state.subdomain,
    getGoogleLink:      (state) => state.googleLink,
};

// actions
const actions = {
    async fetchUser({commit}) {
        try {
            const response = await axios.get('/api/current_user');
            commit('setCurrentUser', response.data.user);
            // if response.data.user is empty or null the rediredct to login page
            if (response.data.user === null &&
                window.location.pathname !== '/connexion' &&
                window.location.pathname !== '/mot-de-passe-oublie' &&
                window.location.pathname !== '/users/password/edit'
            ) {
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
    login({commit}, user) {
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
    connect_google({commit}, payload) {
        // Return a Promise
        return new Promise((resolve, reject) => {
            axios.post('/api/connect_with_google', payload)
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
    switch_to({commit, dispatch, state}, user_id) {
        axios.get('/api/switch/' + user_id).then((response) => {
            commit('setCurrentUser', response.data.current_user);
            commit('setOriginalUser', response.data.original_user);
            window.location.href = response.data.redirect_to;
        });
    },
    switch_back({commit, dispatch, state}) {
        axios.get('/api/switch_back').then((response) => {
            commit('setCurrentUser', response.data.current_user);
            commit('setOriginalUser', null);
            window.location.href = response.data.redirect_to;
        });
    },
    password_recovery({commit}, email) {
        // Return a Promise
        return new Promise((resolve, reject) => {
            axios.post('/users/password',  email)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error); // Reject with the error if request fails
                });
        });
    },
    password_reset({commit}, payload) {
        // Return a Promise
        return new Promise((resolve, reject) => {
            axios.put('/users/password',  payload)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error); // Reject with the error if request fails
                });
        });
    },
};

// mutations
const mutations = {
    setCurrentUser:  (state, user) => {
        state.currentUser = user;
    },
    setOriginalUser: (state, user) => {
        state.originalUser = user;
    },
    setSubdomain:    (state, subdomain) => {
        state.subdomain = subdomain;
    },
    setGoogleLink:   (state, googleLink) => {
        state.googleLink = googleLink;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};