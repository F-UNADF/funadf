import { createI18n } from 'vue-i18n';

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
        errors:{
          required: "Ce champ est requis",
          min: "La valeur doit être supérieure à {min}",
          max: "La valeur doit être inférieure à {max}",
          email: "Veuillez entrer une adresse e-mail valide",
        }
      },
      default: {
        noData: 'Aucun résultat trouvé',
        noDataExplain: 'Aucune donnée disponible. Si vous pensez qu\'il devrait y en avoir, veuillez contacter l\'administrateur.',
      },
      regions: {
        noData: 'Aucune région trouvée',
        noDataExplain: 'Aucune région disponible. Si vous pensez qu\'il devrait y en avoir, veuillez contacter l\'administrateur.',
        saved: 'Région enregistrée',

        title: 'Régions',
        add: 'Ajouter une région',
        edit: 'Modifier la région',
        delete: 'Supprimer la région',

        name: 'Nom de la région',
        address_1: 'Adresse',
        address_2: 'Complément d\'adresse',
        zipcode: 'Code postal',
        town: 'Ville',
        phone_1: 'Téléphone',
        email: 'Email',
        logo: 'Logo',
      },
      members: {
        title: 'Membres',
      }
    }
  }
})

export default i18n;