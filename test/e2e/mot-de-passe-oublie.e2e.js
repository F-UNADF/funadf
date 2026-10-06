// Parcours 6 : mot de passe oublié, de la demande du lien à la connexion avec le nouveau mot de passe.
const { test, expect } = require('@playwright/test');
const data = require('./support/data');
const { connecter, seConnecter } = require('./support/session');
const { dernierMail, lien } = require('./support/mails');

test.describe('Mot de passe oublié', () => {
  test('une adresse inconnue est signalée', async ({ page }) => {
    await page.goto('/connexion');
    await page.getByRole('link', { name: 'Mot de passe oublié ?' }).click();
    await expect(page).toHaveURL(/\/mot-de-passe-oublie$/);
    await page.getByLabel('Adresse e-mail').fill('personne@e2e.test');
    await page.getByRole('button', { name: 'Recevoir le lien' }).click();
    await expect(page.getByText('Aucun compte ne correspond à cette adresse e-mail.')).toBeVisible();
  });

  test('le membre reçoit le lien, choisit un nouveau mot de passe et se connecte avec', async ({ page }) => {
    const compte = data.oubli;
    const nouveau = 'Nouveau-mdp-e2e-7';

    await page.goto('/mot-de-passe-oublie');
    await page.getByLabel('Adresse e-mail').fill(compte.email);
    await page.getByRole('button', { name: 'Recevoir le lien' }).click();
    await expect(page.getByText('Un e-mail vient de vous être envoyé.')).toBeVisible();
    await expect(page).toHaveURL(/\/connexion$/);

    const mail = await dernierMail(compte.email, 'Réinitialiser mon mot de passe');
    const url = new URL(lien(mail, 'reset_password_token='));
    expect(url.pathname).toBe('/users/password/edit');

    // Lien suivi depuis l'e-mail : page de la SPA servie par Rails
    await page.goto(url.pathname + url.search);
    await expect(page.getByRole('heading', { name: 'Choisir un mot de passe' })).toBeVisible();

    // Confirmation différente : refusée par le formulaire
    await page.getByLabel('Nouveau mot de passe').fill(nouveau);
    await page.getByLabel('Confirmer le mot de passe').fill('autre-chose');
    await page.getByRole('button', { name: 'Enregistrer le mot de passe' }).click();
    await expect(page.getByText('Les deux mots de passe ne sont pas identiques.')).toBeVisible();

    await page.getByLabel('Confirmer le mot de passe').fill(nouveau);
    await page.getByRole('button', { name: 'Enregistrer le mot de passe' }).click();
    await expect(page.getByText('Votre mot de passe est enregistré.')).toBeVisible();
    await expect(page).toHaveURL(/\/connexion$/);

    // L'ancien mot de passe ne fonctionne plus, le nouveau oui
    await seConnecter(page, compte);
    await expect(page.getByText(/Adresse e-mail ou mot de passe incorrect/)).toBeVisible();
    await connecter(page, compte, { motDePasse: nouveau });

    // Le lien ne sert qu'une fois
    await page.evaluate(() => localStorage.clear());
    await page.goto(url.pathname + url.search);
    await page.getByLabel('Nouveau mot de passe').fill('Encore-un-autre-9');
    await page.getByLabel('Confirmer le mot de passe').fill('Encore-un-autre-9');
    await page.getByRole('button', { name: 'Enregistrer le mot de passe' }).click();
    await expect(page.getByText(/Le mot de passe n’a pas pu être enregistré/)).toBeVisible();
  });
});
