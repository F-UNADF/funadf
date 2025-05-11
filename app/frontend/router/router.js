import {createRouter, createWebHistory} from "vue-router";
import FeedIndex from "../components/Feed/Index.vue";
import AnnuaireIndex from "../components/Annuaire/Index.vue";
import ProfileShow from "../components/Profile/Show.vue";
import DocumentsIndex from "../components/Documents/Me/Index.vue";
import VotesIndex from "../components/Votes/Index.vue";
import VotesShow from "../components/Votes/Show.vue";
import AssociationsIndex from "../components/Associations/Index.vue";
import EventsIndex from "../components/Events/Index.vue";
import CampaignsIndex from "../components/Campaigns/Index.vue";
import PostsIndex from "../components/Posts/Index.vue";
import UsersIndex from "../components/Users/Index.vue";
import ChurchesIndex from "../components/Churches/Index.vue";
import FeesIndex from "../components/Fees/Index.vue";
import RolesIndex from "../components/Roles/Index.vue";
import MeetingsIndex from "../components/Meetings/Index.vue";
import PushNotificationsIndex from "../components/PushNotifications/Index.vue";

const router = createRouter({
    history: createWebHistory(),
    routes : [
        {
            path    : "/",
            redirect: "/feed",
        },
        {
            path     : "/feed",
            component: FeedIndex,
            name     : "feed.index",
        },
        {
            path     : "/mon-profil",
            component: ProfileShow,
            name     : "profile.index",
        },
        {
            path     : "/annuaire",
            component: AnnuaireIndex,
            name     : "annuaire.index",
        },
        {
            path     : "/documents",
            component: DocumentsIndex,
            name     : "documents.index",
        },
        {
            path     : "/campaigns",
            component: VotesIndex,
            name     : "votes.index",
        },
        {
            path     : "/campaigns/:id",
            component: VotesShow,
            name     : "votes.show",
        },

        // ASSOCIATION
        {
            path     : "/association/associations",
            component: AssociationsIndex,
            name     : "association.associations",
        },
        {
            path     : "/association/events",
            component: EventsIndex,
            name     : "association.events",
        },
        {
            path     : "/association/campaigns",
            component: CampaignsIndex,
            name     : "association.campaigns",
        },
        {
            path     : "/association/posts",
            component: PostsIndex,
            name     : "association.posts",
        },
        {
            path     : '/association/users',
            component: UsersIndex,
            name     : 'association.users',
        },
        {
            path     : '/association/churches',
            component: ChurchesIndex,
            name     : 'association.churches',
        },

        // ADMIN
        {
            path     : "/admin/users",
            component: UsersIndex,
            name     : "admin.users",
        },
        {
            path     : "/admin/churches",
            component: ChurchesIndex,
            name     : "admin.churches",
        },
        {
            path     : "/admin/associations",
            component: AssociationsIndex,
            name     : "admin.associations",
        },
        {
            path     : "/admin/campaigns",
            component: CampaignsIndex,
            name     : "admin.campaigns",
        },
        {
            path     : "/admin/events",
            component: EventsIndex,
            name     : "admin.events",
        },
        {
            path     : "/admin/posts",
            component: PostsIndex,
            name     : "admin.posts",
        },
        {
            path     : "/admin/fees",
            component: FeesIndex,
            name     : "admin.fees",
        },
        {
            path     : "/admin/roles",
            component: RolesIndex,
            name     : "admin.roles",
        },
        {
            path     : "/admin/meetings",
            component: MeetingsIndex,
            name     : "admin.meetings",
        },
        {
            path     : '/admin/documents',
            component: DocumentsIndex,
            name     : 'admin.documents'
        },
        {
            path     : '/admin/push_notifications',
            component: PushNotificationsIndex,
            name     : 'admin.push_notifications'
        }
    ],
});

export default router;