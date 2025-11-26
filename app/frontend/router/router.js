import { createRouter, createWebHistory } from "vue-router";
import FeedIndex from "../components/Feed/Index.vue";
import AnnuaireIndex from "../components/Annuaire/Index.vue";
import ProfileShow from "../components/Profile/Show.vue";
import DocumentsIndex from "../components/Documents/Index.vue";
import MeDocumentsIndex from "../components/Documents/Me/Index.vue";
import VotesIndex from "../components/Votes/Index.vue";
import VotesShow from "../components/Votes/Show.vue";
import AssociationsIndex from "../pages/Associations/Index.vue";
import EventsIndex from "../components/Events/Index.vue";
import CampaignsIndex from "../components/Campaigns/Index.vue";
import PostsIndex from "../pages/Posts/Index.vue";
import UsersIndex from "../components/Users/Index.vue";
import ChurchesIndex from "../pages/Churches/Index.vue";
import FeesIndex from "../components/Fees/Index.vue";
import RolesIndex from "../components/Roles/Index.vue";
import PushNotificationsIndex from "../components/PushNotifications/Index.vue";
import RegionsIndex from "../pages/Regions/Index.vue";
import MembersIndex from "../pages/Members/Index.vue";
import PostsShow from "../pages/Posts/Show.vue";
import EventsShow from "../pages/Events/Show.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            redirect: "/feed",
        },
        {
            path: "/feed",
            component: FeedIndex,
            name: "feed.index",
        },
        {
            path: "/mon-profil",
            component: ProfileShow,
            name: "profile.index",
        },
        {
            path: "/annuaire",
            component: AnnuaireIndex,
            name: "annuaire.index",
        },
        {
            path: "/documents",
            component: MeDocumentsIndex,
            name: "documents.index",
        },
        {
            path: "/campaigns",
            component: VotesIndex,
            name: "votes.index",
        },
        {
            path: "/campaigns/:id",
            component: VotesShow,
            name: "votes.show",
        },
        {
            path: "/actus/:id",
            component: PostsShow,
            name: "post.show",
        },
        {
            path: "/evenements/:id",
            component: EventsShow,
            name: "event.show",
        },

        // ASSOCIATION
        {
            path: "/association/associations",
            component: AssociationsIndex,
            name: "association.associations",
            props: { domain: 'association' }
        },
        {
            path: "/association/campaigns",
            component: CampaignsIndex,
            name: "association.campaigns",
            props: { domain: 'association' }
        },
        {
            path: "/association/members",
            component: MembersIndex,
            name: "association.members",
            props: { domain: 'association' }
        },

        // REGION
        {
            path: "/region/members",
            component: MembersIndex,
            name: "region.members",
            props: { domain: 'region' }
        },
        {
            path: "/region/events",
            component: EventsIndex,
            name: "region.events",
            props: { domain: 'region' }
        },
        {
            path: "/region/campaigns",
            component: CampaignsIndex,
            name: "region.campaigns",
            props: { domain: 'region' }
        },
        {
            path: "/region/posts",
            component: PostsIndex,
            name: "region.posts",
            props: { domain: 'region' }
        },

        // ADMIN
        {
            path: "/admin/users",
            component: UsersIndex,
            name: "admin.users",
            props: { domain: 'admin' }
        },
        {
            path: "/admin/churches",
            component: ChurchesIndex,
            name: "admin.churches",
            props: { domain: 'admin' }
        },
        {
            path: "/admin/associations",
            component: AssociationsIndex,
            name: "admin.associations",
            props: { domain: 'admin' }
        },
        {
            path: "/admin/regions",
            component: RegionsIndex,
            name: "admin.regions",
            props: { domain: 'admin' }
        },
        {
            path: "/admin/campaigns",
            component: CampaignsIndex,
            name: "admin.campaigns",
            props: { domain: 'admin' }
        },
        {
            path: "/admin/events",
            component: EventsIndex,
            name: "admin.events",
            props: { domain: 'admin' }
        },
        {
            path: "/admin/posts",
            component: PostsIndex,
            name: "admin.posts",
            props: { domain: 'admin' }
        },
        {
            path: "/admin/fees",
            component: FeesIndex,
            name: "admin.fees",
            props: { domain: 'admin' }
        },
        {
            path: "/admin/roles",
            component: RolesIndex,
            name: "admin.roles",
            props: { domain: 'admin' }
        },
        {
            path: '/admin/documents',
            component: DocumentsIndex,
            name: 'admin.documents',
            props: { domain: 'admin' }
        },
        {
            path: '/admin/push_notifications',
            component: PushNotificationsIndex,
            name: 'admin.push_notifications',
            props: { domain: 'admin' }
        }
    ],
});

export default router;