// Parcours 1 : connexion, refus (mauvais mot de passe, compte désactivé), déconnexion.
const { test, expect } = require('@playwright/test');
const data = require('./support/data');
const { seConnecter, connecter, seDeconnecter } = require('./support/session');

const MESSAGE_REFUS = /Adresse e-mail ou mot de passe incorrect/;

test.describe('Connexion', () => {
  test('un membre se connecte, arrive sur son fil, puis se déconnecte', async ({ page }) => {
    await connecter(page, data.pasteur);
    await expect(page.getByRole('heading', { name: 'Fil d’actualité' })).toBeVisible();

    // Le jeton d'API est bien enregistré et accepté par le serveur
    const jeton = await page.evaluate(() => localStorage.getItem('token'));
    expect(jeton).toBeTruthy();

    await page.getByRole('button', { name: 'Mon compte' }).click();
    await expect(page.locator('.v-overlay--active').getByText(data.pasteur.email)).toBeVisible();
    await page.keyboard.press('Escape');

    await seDeconnecter(page);
    expect(await page.evaluate(() => localStorage.getItem('token'))).toBeNull();

    // Après déconnexion, l'intranet renvoie vers la connexion
    await page.goto('/feed');
    await expect(page).toHaveURL(/\/connexion$/);
  });

  test('un mauvais mot de passe est refusé', async ({ page }) => {
    await seConnecter(page, data.pasteur, { motDePasse: 'pas-le-bon' });
    await expect(page.getByText(MESSAGE_REFUS)).toBeVisible();
    await expect(page).toHaveURL(/\/connexion$/);
    expect(await page.evaluate(() => localStorage.getItem('token'))).toBeNull();
  });

  test('un compte désactivé ne peut pas se connecter', async ({ page }) => {
    await seConnecter(page, data.desactive);
    await expect(page.getByText(MESSAGE_REFUS)).toBeVisible();
    await expect(page).toHaveURL(/\/connexion$/);
  });

  test("l'accès direct à une page de l'intranet sans être connecté renvoie à la connexion", async ({ page }) => {
    await page.goto('/admin/users');
    await expect(page).toHaveURL(/\/connexion$/);
  });
});
