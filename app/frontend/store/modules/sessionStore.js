import axios from "axios";

// si on a un token dans le local storage ou en session on le met dans le header par defaut de axios
const token = sessionStorage.getItem('token') || localStorage.getItem('token');

if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

<<<<<<< HEAD

console.log(window.location.pathname);

=======
>>>>>>> hotfix/Session
// initial state
const state = () => ({
    currentUser: null,
    roles: [],
    originalUser: null,
    editProfilDialog: false,
    subdomain: null
});

// getters
const getters = {
    currentUser: (state) => state.currentUser,
    roles: (state) => state.roles,
    getOriginalUser: (state) => state.originalUser,
    subdomain: (state) => state.subdomain,
};

// actions
const actions = {
    fetchUser({ commit }) {
        axios.get('/api/current_user').then((response) => {
            commit('setCurrentUser', response.data.user);
            commit('setRoles', response.data.roles);
<<<<<<< HEAD

            if (response.data.user === null &&
                window.location.pathname !== '/connexion' &&
                window.location.pathname !== '/mot-de-passe-oublie' &&
                window.location.pathname !== '/users/password/edit'
            ) {
                window.location.href = '/connexion';
            }

=======
>>>>>>> hotfix/Session
            commit('setOriginalUser', response.data.original_user);
        });
    },
    async logout({ commit }) {
        try {
            await axios.delete('/users/sign_out');
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
            axios.post('/api/login', user)
                .then((response) => {
                    // On definit le header par defaut de axio avec le bearer token recu
                    axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token;
                    // On stocke le token dans le local storage ET en session pour le cross domain
                    localStorage.setItem('token', response.data.token);
                    sessionStorage.setItem('token', response.data.token);
                    commit('setCurrentUser', response.data.user);
                    resolve(response);
                })
                .catch((error) => {
                    reject(error); // Reject with the error if request fails
                });
        });
    },
    connect_google({ commit }, payload) {
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
    switch_to({ commit, dispatch, state }, user_id) {
        axios.get('/api/switch/' + user_id).then((response) => {
            commit('setCurrentUser', response.data.current_user);
            commit('setOriginalUser', response.data.original_user);
            window.location.href = response.data.redirect_to;
        });
    },
    switch_back({ commit, dispatch, state }) {
        axios.get('/api/switch_back').then((response) => {
            commit('setCurrentUser', response.data.current_user);
            commit('setOriginalUser', null);
            window.location.href = response.data.redirect_to;
        });
    },
    password_recovery({ commit }, email) {
        // Return a Promise
        return new Promise((resolve, reject) => {
            axios.post('/users/password', email)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error); // Reject with the error if request fails
                });
        });
    },
    password_reset({ commit }, payload) {
        // Return a Promise
        return new Promise((resolve, reject) => {
            axios.put('/users/password', payload)
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
    setCurrentUser: (state, user) => {
        state.currentUser = user;
    },
    setOriginalUser: (state, user) => {
        state.originalUser = user;
    },
    setSubdomain: (state, subdomain) => {
        state.subdomain = subdomain;
    },
    setRoles: (state, roles) => {
        state.roles = roles;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};