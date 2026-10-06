import axios from "axios";

// actions
const actions = {
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
};

export default {
    namespaced: true,
    actions,
};
