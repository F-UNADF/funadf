import {createStore} from 'vuex';
import sessionStore from './modules/sessionStore';
import usersStore from './modules/usersStore';
import churchesStore from "./modules/churchesStore";
import associationsStore from "./modules/associationsStore";

const debug = process.env.NODE_ENV !== 'production';

const store = createStore({
    modules: {
        sessionStore,
        usersStore,
        churchesStore,
        associationsStore,
    },
    strict: debug,
});

export default store;
