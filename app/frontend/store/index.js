import {createStore} from 'vuex';
import sessionStore from './modules/sessionStore';
import usersStore from './modules/usersStore';

const debug = process.env.NODE_ENV !== 'production';

const store = createStore({
    modules: {
        session: sessionStore,
        users: usersStore,
    },
    namespaced: true,
    strict: debug,
});

export default store;
