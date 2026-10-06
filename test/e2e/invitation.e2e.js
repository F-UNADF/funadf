// Parcours 5 : l'admin invite un utilisateur ; l'invité ouvre le lien de l'e-mail,
// choisit son mot de passe puis se connecte.
const { test, expect } = require('@playwright/test');
const data = require('./support/data');
const { connecter, seDeconnecter } = require('./support/session');
const { dernierMail, lien } = require('./support/mails');
const { champ, choisirOption } = require('./support/ui');

test('l’admin invite un utilisateur, qui choisit son mot de passe depuis l’e-mail et se connecte', async ({ page }) => {
  const id = Date.now();
  const invite = { email: `invite-${id}@e2e.test`, motDePasse: 'Bienvenue-e2e-42', prenom: 'Ines', nom: `Invitee${id}` };

  await connecter(page, data.admin);
  await page.goto('/admin/users');
  await page.getByRole('button', { name: 'Ajouter un utilisateur' }).click();

  // Deux formulaires identiques s'ouvrent (App.vue et Users/Index.vue partagent l'état du dialogue) : on prend celui du dessus
  // (on attend la fin de leur ouverture et du chargement des listes avant de saisir)
  await page.waitForLoadState('networkidle');
  const fiche = page.getByRole('dialog').last();
  await champ(fiche, 'Prénom').fill(invite.prenom);
  await champ(fiche, 'Nom').fill(invite.nom);
  await champ(fiche, 'Email').fill(invite.email);
  await champ(fiche, 'Ville').fill('Toulouse');

  // Reconnaissance du pasteur
  await fiche.getByRole('tab', { name: 'Reconnaissances' }).click();
  await fiche.locator('.v-window-item--active').getByRole('button').filter({ has: page.locator('.mdi-plus') }).click();
  await fiche.locator('.v-window-item--active .v-select').first().click();
  await choisirOption(page, 'Pasteur APE');
  await fiche.locator('.v-window-item--active input[type="date"]').first().fill('2024-09-01');

  await fiche.getByRole('tab', { name: 'Informations générales' }).click();
  await expect(champ(fiche, 'Nom')).toHaveValue(invite.nom);
  await expect(champ(fiche, 'Email')).toHaveValue(invite.email);
  await fiche.getByRole('button', { name: 'Enregistrer', exact: true }).click();
  await expect(page.getByText('Utilisateur enregistré avec succès')).toBeVisible();

  // L'invité apparaît, invitation en attente, avec sa reconnaissance
  await champ(page, 'Chercher un utilisateur').fill(invite.nom);
  const ligne = page.getByRole('row').filter({ hasText: invite.email });
  await expect(ligne).toContainText('Invitation en attente');
  await expect(ligne).toContainText('Pasteur APE');
  await seDeconnecter(page);

  // L'e-mail d'invitation est parti, avec le lien d'acceptation
  const mail = await dernierMail(invite.email, 'Bienvenue');
  const url = lien(mail, '/users/invitation/accept');
  const chemin = new URL(url).pathname + new URL(url).search;

  // Tant que l'invitation n'est pas acceptée, l'invité ne peut pas se connecter
  await page.goto('/connexion');
  await page.getByLabel('Adresse e-mail').fill(invite.email);
  await page.getByLabel('Mot de passe', { exact: true }).fill(invite.motDePasse);
  await page.getByRole('button', { name: 'Se connecter' }).click();
  await expect(page.getByText(/Adresse e-mail ou mot de passe incorrect/)).toBeVisible();

  // Choix du mot de passe
  await page.goto(chemin);
  await expect(page.getByText('Pour commencer, merci de renseigner un mot de passe.')).toBeVisible();
  await page.locator('#user_password').fill(invite.motDePasse);
  await page.locator('#user_password_confirmation').fill(invite.motDePasse);
  await page.getByRole('button', { name: 'Créer mon mot de passe' }).click();
  await page.waitForLoadState('networkidle');

  // Le lien ne sert qu'une fois
  await page.goto(chemin);
  await expect(page.getByText('Pour commencer, merci de renseigner un mot de passe.')).toHaveCount(0);

  // Connexion avec le mot de passe choisi
  await connecter(page, invite);
  await page.getByRole('button', { name: 'Mon compte' }).click();
  await expect(page.locator('.v-overlay--active').getByText(invite.email)).toBeVisible();
});
