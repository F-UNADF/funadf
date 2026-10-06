// Comptes et structures créés par test/e2e/seed.rb (garder les deux fichiers alignés).
const MOT_DE_PASSE = 'MotDePasse-e2e-1';

const compte = (email, prenom, nom) => ({ email, motDePasse: MOT_DE_PASSE, prenom, nom, nomComplet: `${prenom} ${nom.toUpperCase()}` });

module.exports = {
  MOT_DE_PASSE,
  admin: compte('admin@e2e.test', 'Alice', 'Admin'),
  // Pasteur AEM, membre de la Fédération E2E
  pasteur: compte('pasteur@e2e.test', 'Pierre', 'Pasteur'),
  // Pasteur AEM, président de l'Église E2E de Marseille (membre de la Fédération E2E)
  president: compte('president@e2e.test', 'Paul', 'President'),
  // Pasteur stagiaire, membre de la Fédération E2E
  stagiaire: compte('stagiaire@e2e.test', 'Sophie', 'Stagiaire'),
  desactive: compte('desactive@e2e.test', 'Denis', 'Desactive'),
  oubli: compte('oubli@e2e.test', 'Olivier', 'Oubli'),
  marc: compte('marc@e2e.test', 'Marc', 'Martin'),
  jeanne: compte('jeanne@e2e.test', 'Jeanne', 'Durand'),
  // Désactivé par l'admin pendant les tests (parcours-complementaires)
  bruno: compte('bruno@e2e.test', 'Bruno', 'Bloque'),
  federation: 'Fédération E2E',
  eglise: 'Église E2E de Marseille',
  autreEglise: 'Église E2E de Bordeaux',
  categorieDocuments: 'Statuts et règlements',
};
