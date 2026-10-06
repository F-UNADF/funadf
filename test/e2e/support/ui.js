// Gestes répétés sur les composants Vuetify de l'intranet.
const { expect } = require('@playwright/test');

// Menu « ⋮ » d'une ligne de FuDatabase, puis l'action voulue.
async function ouvrirActions(page, nomLigne, action) {
  await page.getByRole('button', { name: `Actions pour ${nomLigne}` }).click();
  await page.locator('.v-overlay--active').getByText(action, { exact: true }).click();
}

// Choix dans la liste ouverte d'un v-select / v-autocomplete.
async function choisirOption(page, texte, { exact = true } = {}) {
  await page.locator('.v-overlay--active .v-list-item').filter({ hasText: exact ? new RegExp(`^\\s*${echapper(texte)}\\s*$`) : texte })
    .first().click();
}

// Onglet « Membres » de FuForm : recherche, sélection puis ajout.
async function ajouterMembres(page, noms) {
  const champ = page.getByRole('dialog').getByLabel('Ajouter un membre');
  for (const nom of noms) {
    await champ.fill(nom.slice(0, 12));
    await choisirOption(page, nom, { exact: false });
  }
  // Fermer la liste sans Échap (Échap fermerait aussi le formulaire)
  await page.getByText('Ajouter des membres :').click();
  await page.getByRole('button', { name: 'Ajouter les membres' }).click();
}

// Champ texte Vuetify par son libellé (le nom accessible répète le libellé, d'où le préfixe).
function champ(scope, libelle) {
  return scope.getByRole('textbox', { name: new RegExp(`^${echapper(libelle)}`) }).first();
}

// Ligne du tableau des membres de la structure ouverte.
function ligneMembre(page, nom) {
  return page.getByRole('dialog').getByRole('row').filter({ hasText: nom });
}

function echapper(texte) {
  return texte.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = { champ, ouvrirActions, choisirOption, ajouterMembres, ligneMembre, echapper };
