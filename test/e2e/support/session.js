// Connexion par l'écran /connexion, comme un utilisateur.
const { expect } = require('@playwright/test');

async function seConnecter(page, compte, { motDePasse } = {}) {
  await page.goto('/connexion');
  await page.getByLabel('Adresse e-mail').fill(compte.email);
  await page.getByLabel('Mot de passe', { exact: true }).fill(motDePasse || compte.motDePasse);
  await page.getByRole('button', { name: 'Se connecter' }).click();
}

// Connexion réussie : on attend le fil d'actualité.
async function connecter(page, compte, options) {
  await seConnecter(page, compte, options);
  await expect(page).toHaveURL(/\/feed$/);
}

async function seDeconnecter(page) {
  await page.getByRole('button', { name: 'Mon compte' }).click();
  await page.getByRole('button', { name: 'Se déconnecter' }).click();
  await expect(page).toHaveURL(/\/connexion$/);
}

module.exports = { seConnecter, connecter, seDeconnecter };
