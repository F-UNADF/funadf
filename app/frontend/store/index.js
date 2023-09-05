import {createStore} from 'vuex';
import sessionStore from './modules/sessionStore';
import usersStore from './modules/usersStore';
import churchesStore from "./modules/churchesStore";
import associationsStore from "./modules/associationsStore";
import campaignsStore from "./modules/campaignsStore";
import menuStore from "./modules/menuStore";
import eventsStore from "./modules/eventsStore";
import postsStore from "./modules/postsStore";

const debug = process.env.NODE_ENV !== 'production';

const store = createStore({
    modules: {
        sessionStore,
        usersStore,
        churchesStore,
        associationsStore,
        campaignsStore,
        menuStore,
        eventsStore,
        postsStore,
    },
    strict : debug,
});

export default store;
