import {createStore} from "vuex";
import sessionStore from "./modules/sessionStore";
import usersStore from "./modules/usersStore";
import associationsStore from "./modules/associationsStore";
import campaignsStore from "./modules/campaignsStore";
import menuStore from "./modules/menuStore";
import eventsStore from "./modules/eventsStore";
import postsStore from "./modules/postsStore";
import votesStore from "./modules/votesStore";
import feedStore from "./modules/feedStore";
import feedEventStore from "./modules/feedEventStore";
import rolesStore from "./modules/rolesStore";
import profileStore from "./modules/profileStore";
import feesStore from "./modules/feesStore";
import documentsStore from "./modules/documentsStore";
import pushNotificationsStore from "./modules/pushNotificationsStore";

import createCrudStore from './modules/crudStore';

const debug = process.env.NODE_ENV !== "production";

const store = createStore({
    modules: {
        sessionStore,
        usersStore,
        associationsStore,
        campaignsStore,
        menuStore,
        eventsStore,
        postsStore,
        votesStore,
        feedStore,
        feedEventStore,
        rolesStore,
        profileStore,
        feesStore,
        documentsStore,
        pushNotificationsStore,
        regions: createCrudStore({ resource: "regions" }),
        churches: createCrudStore({ resource: "churches" }),
    },
    strict: debug,
});

export default store;
