import axios from "axios";

// initial state
const state = () => ({
    menu: [],
});

// getters
const getters = {
    getMenu: (state) => state.menu,
};

// actions
const actions = {
    getMenu: function ({commit}) {
        return new Promise((resolve, reject) => {
            axios.get('/api/menus/admin', {}).then((res) => {
                commit('setMenu', res.data);
                resolve(res);
            }).catch((error) => {
                reject(error, 2000);
            });
        });
    }
};

// mutations
const mutations = {
    setMenu: (state, menu) => state.menu = menu,
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};