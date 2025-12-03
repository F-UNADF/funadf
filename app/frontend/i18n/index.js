import {createI18n} from 'vue-i18n';

const i18n = createI18n({
    locale: 'fr',
    legacy: false,
    messages: {
        fr: {
            itemsPerPage: 'Éléments par page',
            search: 'Rechercher',
            cancel: 'Annuler',
            save: 'Enregistrer',
            errors: {
                unauthorized: 'Vous n\'êtes pas autorisé à effectuer cette action.',
                notFound: 'La ressource demandée est introuvable.',
                serverError: 'Une erreur est survenue sur le serveur. Veuillez réessayer plus tard.',
                forbidden: 'Accès refusé. Vous n\'avez pas la permission d\'accéder à cette ressource.',
                badRequest: 'La requête est invalide. Veuillez vérifier les données envoyées.',
                conflict: 'Conflit détecté. Veuillez vérifier les données envoyées.',
                unprocessableEntity: 'Les données envoyées ne peuvent pas être traitées. Veuillez vérifier les données.',
                tooManyRequests: 'Trop de requêtes envoyées. Veuillez réessayer plus tard.',
                internalServerError: 'Erreur interne du serveur. Veuillez réessayer plus tard.',
                serviceUnavailable: 'Le service est temporairement indisponible. Veuillez réessayer plus tard.',
                gatewayTimeout: 'Délai d\'attente de la passerelle. Veuillez réessayer plus tard.',
                notImplemented: 'La fonctionnalité demandée n\'est pas encore implémentée.',
                badGateway: 'Mauvaise passerelle. Veuillez réessayer plus tard.',
                networkError: 'Erreur réseau. Veuillez vérifier votre connexion Internet.',
                timeout: 'La requête a expiré. Veuillez réessayer plus tard.',
                unknownError: 'Une erreur inconnue est survenue. Veuillez réessayer plus tard.',
                invalidCredentials: 'Identifiants invalides. Veuillez vérifier votre nom d\'utilisateur et votre mot de passe.',
                accountLocked: 'Votre compte est verrouillé. Veuillez contacter l\'administrateur.',
            },
            form: {
                error: 'Erreur lors de l\'enregistrement',
                errors: {
                    required: "Ce champ est requis",
                    min: "La valeur doit être supérieure à {min}",
                    max: "La valeur doit être inférieure à {max}",
                    email: "Veuillez entrer une adresse e-mail valide",
                }
            },
            default: {
                noData: 'Aucun résultat trouvé',
                noDataExplain: 'Aucune donnée disponible. Si vous pensez qu\'il devrait y en avoir, veuillez contacter l\'administrateur.',
                saved: 'Enregistré',
                title: 'Titre',
                add: 'Ajouter',
                edit: 'Modifier',
                delete: 'Supprimer',

                deleteMessage: 'Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.',
                name: 'Nom',
                address_1: 'Adresse',
                address_2: 'Complément d\'adresse',
                zipcode: 'Code postal',
                town: 'Ville',
                phone_1: 'Téléphone',
                email: 'Email',
                logo: 'Logo',
                website: 'Site web',
            },
            regions: {
                noData: 'Aucune région trouvée',
                noDataExplain: 'Aucune région disponible. Si vous pensez qu\'il devrait y en avoir, veuillez contacter l\'administrateur.',
                saved: 'Région enregistrée',

                title: 'Régions',
                add: 'Ajouter une région',
                edit: 'Modifier la région',
                delete: 'Supprimer la région',

                deleteMessage: 'Êtes-vous sûr de vouloir supprimer cette region ? Cette action est irréversible.',
                deleteSuccess: 'Région supprimée',

                name: 'Nom de la région',
                address_1: 'Adresse',
                address_2: 'Complément d\'adresse',
                zipcode: 'Code postal',
                town: 'Ville',
                phone_1: 'Téléphone',
                email: 'Email',
                logo: 'Logo',
                website: 'Site web',
            },
            associations: {
                noData: 'Aucune association trouvée',
                noDataExplain: 'Aucune association disponible. Si vous pensez qu\'il devrait y en avoir, veuillez contacter l\'administrateur.',
                saved: 'Association enregistrée',

                title: 'Associations',
                add: 'Ajouter une association',
                edit: 'Modifier l\'association',
                delete: 'Supprimer l\'association',

                deleteMessage: 'Êtes-vous sûr de vouloir supprimer cette association ? Cette action est irréversible.',
                deleteSuccess: 'Association supprimée',

                name: 'Nom de l\'association',
                address_1: 'Adresse',
                address_2: 'Complément d\'adresse',
                zipcode: 'Code postal',
                town: 'Ville',
                phone_1: 'Téléphone',
                email: 'Email',
                logo: 'Logo',
                website: 'Site web',
            },
            churches: {
                noData: 'Aucune église trouvée',
                noDataExplain: 'Aucune église disponible. Si vous pensez qu\'il devrait y en avoir, veuillez contacter l\'administrateur.',
                saved: 'Eglise enregistrée',

                title: 'Eglises',
                add: 'Ajouter une église',
                edit: 'Modifier l\'église',
                delete: 'Supprimer l\'église',

                deleteMessage: 'Êtes-vous sûr de vouloir supprimer cette église ? Cette action est irréversible.',
                deleteSuccess: 'Église supprimée',

                name: 'Nom de l\'église',
                address_1: 'Adresse',
                address_2: 'Complément d\'adresse',
                zipcode: 'Code postal',
                town: 'Ville',
                phone_1: 'Téléphone',
                email: 'Email',
                logo: 'Logo',
                website: 'Site web',
            },
            members: {
                title: 'Membres',
                noData: 'Aucun membre trouvé',
                noDataExplain: 'Aucun membre disponible. Si vous pensez qu\'il devrait y en avoir, veuillez contacter l\'administrateur.',
                saved: 'Membre enregistré',

                name: 'Nom du membre',
                address_1: 'Adresse',
                address_2: 'Complément d\'adresse',
                zipcode: 'Code postal',
                town: 'Ville',
                phone_1: 'Téléphone',
                email: 'Email',
                logo: 'Logo',
                website: 'Site web',
            },
            posts: {
                title: 'Actus',
                noData: 'Aucune actu trouvée',
                noDataExplain: 'Aucuns actu disponible. Si vous pensez qu\'il devrait y en avoir, veuillez contacter' +
                    ' l\'administrateur.',
                saved: 'Actu enregistrée',

                deleteMessage: 'Êtes-vous sûr de vouloir supprimer cette actu ? Cette action est irréversible.',
                deleteSuccess: 'Actu supprimée',

                add: 'Ajouter une actu',
                edit: 'Modifier l\'actu',
                delete: 'Supprimer l\'actu',

                structure: 'Structure',
                structure_id: 'Structure',
                content: 'Contenu',
                pinned: 'Épingler cette actu ? Elle sera affichée en haut de la liste des actus.',
                accesses: 'Accessible par :',
                new_attachments: 'Nouveaux fichiers',
                existing_attachments: 'Fichiers existants',
                published_at: 'Publié le',
                expired_at: 'Expiré le',
            },
        }
    }
})

export default i18n;