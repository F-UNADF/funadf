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
import FeesIndex from "../pages/Fees/Index.vue";
import RolesIndex from "../components/Roles/Index.vue";
import PushNotificationsIndex from "../components/PushNotifications/Index.vue";
import RegionsIndex from "../pages/Regions/Index.vue";
import MembersIndex from "../pages/Members/Index.vue";
import PostsShow from "../pages/Posts/Show.vue";
import ArchivateRedirect from "../components/Archivate/Redirect.vue";
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
            meta: { title: "Fil d’actualité" },
        },
        {
            path: "/mon-profil",
            component: ProfileShow,
            name: "profile.index",
            meta: { title: "Mon profil" },
        },
        {
            path: "/annuaire",
            component: AnnuaireIndex,
            name: "annuaire.index",
            meta: { title: "Annuaire" },
        },
        {
            path: "/documents",
            component: MeDocumentsIndex,
            name: "documents.index",
            meta: { title: "Documents" },
        },
        {
            path: "/archivate",
            component: ArchivateRedirect,
            name: "archivate.redirect",
            meta: { title: "Archivate" },
        },
        {
            path: "/campaigns",
            component: VotesIndex,
            name: "votes.index",
            meta: { title: "Votes" },
        },
        {
            path: "/campaigns/:id",
            component: VotesShow,
            name: "votes.show",
            meta: { title: "Vote" },
        },
        {
            path: "/actus/:id",
            component: PostsShow,
            name: "post.show",
            meta: { title: "Actualité" },
        },
        {
            path: "/evenements/:id",
            component: EventsShow,
            name: "event.show",
            meta: { title: "Événement" },
        },

        // ASSOCIATION
        {
            path: "/association/associations",
            component: AssociationsIndex,
            name: "association.associations",
            meta: { title: "Mes associations" },
            props: { domain: 'association' }
        },
        {
            path: "/association/campaigns",
            component: CampaignsIndex,
            name: "association.campaigns",
            meta: { title: "Campagnes de vote" },
            props: { domain: 'association' }
        },
        {
            path: "/association/members",
            component: MembersIndex,
            name: "association.members",
            meta: { title: "Membres" },
            props: { domain: 'association' }
        },

        // REGION
        {
            path: "/region/members",
            component: MembersIndex,
            name: "region.members",
            meta: { title: "Membres de la région" },
            props: { domain: 'region' }
        },
        {
            path: "/region/events",
            component: EventsIndex,
            name: "region.events",
            meta: { title: "Événements" },
            props: { domain: 'region' }
        },
        {
            path: "/region/campaigns",
            component: CampaignsIndex,
            name: "region.campaigns",
            meta: { title: "Campagnes de vote" },
            props: { domain: 'region' }
        },
        {
            path: "/region/posts",
            component: PostsIndex,
            name: "region.posts",
            meta: { title: "Actualités" },
            props: { domain: 'region' }
        },

        // ADMIN
        {
            path: "/admin/users",
            component: UsersIndex,
            name: "admin.users",
            meta: { title: "Utilisateurs" },
            props: { domain: 'admin' }
        },
        {
            path: "/admin/churches",
            component: ChurchesIndex,
            name: "admin.churches",
            meta: { title: "Églises" },
            props: { domain: 'admin' }
        },
        {
            path: "/admin/associations",
            component: AssociationsIndex,
            name: "admin.associations",
            meta: { title: "Associations" },
            props: { domain: 'admin' }
        },
        {
            path: "/admin/regions",
            component: RegionsIndex,
            name: "admin.regions",
            meta: { title: "Régions" },
            props: { domain: 'admin' }
        },
        {
            path: "/admin/campaigns",
            component: CampaignsIndex,
            name: "admin.campaigns",
            meta: { title: "Campagnes de vote" },
            props: { domain: 'admin' }
        },
        {
            path: "/admin/events",
            component: EventsIndex,
            name: "admin.events",
            meta: { title: "Agenda" },
            props: { domain: 'admin' }
        },
        {
            path: "/admin/posts",
            component: PostsIndex,
            name: "admin.posts",
            meta: { title: "Actualités" },
            props: { domain: 'admin' }
        },
        {
            path: "/admin/fees",
            component: FeesIndex,
            name: "admin.fees",
            meta: { title: "Cotisations" },
            props: { domain: 'admin' }
        },
        {
            path: "/admin/roles",
            component: RolesIndex,
            name: "admin.roles",
            meta: { title: "Rôles" },
            props: { domain: 'admin' }
        },
        {
            path: '/admin/documents',
            component: DocumentsIndex,
            name: 'admin.documents',
            meta: { title: "Documents" },
            props: { domain: 'admin' }
        },
        {
            path: '/admin/push_notifications',
            component: PushNotificationsIndex,
            name: 'admin.push_notifications',
            meta: { title: "Notifications push" },
            props: { domain: 'admin' }
        }
    ],
});

export default router;