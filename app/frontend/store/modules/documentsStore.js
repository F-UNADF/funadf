import axios from "axios";

// initial state
const state = () => ({
    items: [],
});

// getters
const getters = {
    getItems: (state) => state.items,
};

// actions
const actions = {
    items: function ({commit}) {
        return new Promise((resolve, reject) => {
            axios
                .get("/api/documents", {})
                .then((res) => {
                    commit("setItems", res.data);
                    resolve(res);
                })
                .catch((error) => {
                    reject(error, 2000);
                });
        });
    },
    upload: function ({dispatch, commit, state}, files) {
        console.log(files);
        return new Promise((resolve, reject) => {
            axios.post("/api/documents", files, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((res) => {
                resolve(res);
            })
            .catch((error) => {
                reject(error, 2000);
            });
        });
    },
    addCategory: function ({dispatch, commit, state}, category) {
        return new Promise((resolve, reject) => {
            axios.post("/api/categories", category)
            .then((res) => {
                resolve(res);
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
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
