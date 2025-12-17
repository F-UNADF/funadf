import {createStore} from "vuex";
import sessionStore from "./modules/sessionStore";
import usersStore from "./modules/usersStore";
import campaignsStore from "./modules/campaignsStore";
import menuStore from "./modules/menuStore";
import eventsStore from "./modules/eventsStore";
import votesStore from "./modules/votesStore";
import feedStore from "./modules/feedStore";
import feedEventStore from "./modules/feedEventStore";
import rolesStore from "./modules/rolesStore";
import profileStore from "./modules/profileStore";
import documentsStore from "./modules/documentsStore";
import pushNotificationsStore from "./modules/pushNotificationsStore";

import createCrudStore from './modules/crudStore';

const debug = process.env.NODE_ENV !== "production";

const store = createStore({
    modules: {
        sessionStore,
        usersStore,
        campaignsStore,
        menuStore,
        eventsStore,
        votesStore,
        feedStore,
        feedEventStore,
        rolesStore,
        profileStore,
        documentsStore,
        pushNotificationsStore,
        regions: createCrudStore({ resource: "regions" }),
        churches: createCrudStore({ resource: "churches" }),
        associations: createCrudStore({ resource: "associations" }),
        posts: createCrudStore({ resource: "posts" }),
        fees: createCrudStore({ resource: "fees" }),
    },
    strict: debug,
});

export default store;
