// Autres parcours importants du routeur (app/frontend/router/router.js) :
// agenda, annuaire, mon profil, désactivation d'un compte, « se connecter en tant que ».
const { test, expect } = require('@playwright/test');
const data = require('./support/data');
const { connecter, seConnecter, seDeconnecter } = require('./support/session');
const { champ, choisirOption } = require('./support/ui');

// Date locale au format datetime-local, décalée de `jours`
function dateLocale(jours, heure) {
  const d = new Date(Date.now() + jours * 24 * 3600 * 1000);
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${heure}`;
}

test('agenda : l’admin crée un événement, un pasteur concerné le voit dans son fil et l’ouvre', async ({ page }) => {
  const titre = `Pastorale régionale E2E ${Date.now()}`;

  await connecter(page, data.admin);
  await page.goto('/admin/events');
  await page.getByRole('button', { name: 'Ajouter un événement' }).first().click();

  const formulaire = page.getByRole('dialog');
  await champ(formulaire, 'Nom').fill(titre);
  await champ(formulaire, 'Structure').fill('Fédération');
  await choisirOption(page, data.federation);
  await champ(formulaire, 'Catégorie').fill('Pastorale');
  await champ(formulaire, 'Catégorie').press('Enter');
  await formulaire.locator('input[type="datetime-local"]').nth(0).fill(dateLocale(7, '09:00'));
  await formulaire.locator('input[type="datetime-local"]').nth(1).fill(dateLocale(7, '17:00'));
  await formulaire.getByLabel('Description de l\'événement').fill('Journée de rencontre des pasteurs de la fédération.');
  await formulaire.locator('.v-select').filter({ hasText: 'Gestion des accès' }).click();
  await choisirOption(page, 'Pasteur AEM');
  await formulaire.getByText('Description de l\'événement').first().click({ force: true }); // referme la liste
  await formulaire.getByRole('button', { name: 'Enregistrer' }).click();
  await expect(page.getByText('Événement enregistré avec succès')).toBeVisible();
  await seDeconnecter(page);

  await connecter(page, data.pasteur);
  const evenement = page.getByRole('button', { name: `${titre}, voir le détail` })
    .or(page.locator('.v-card').filter({ hasText: titre })).first();
  await expect(evenement).toBeVisible();
  await expect(evenement).toContainText(data.federation);
  await evenement.click();
  await expect(page.getByText('Journée de rencontre des pasteurs de la fédération.')).toBeVisible();
});

test('annuaire : un membre trouve un pasteur actif, pas un compte désactivé', async ({ page }) => {
  await connecter(page, data.pasteur);
  await page.getByRole('link', { name: 'Annuaire' }).click();
  await expect(page).toHaveURL(/\/annuaire$/);

  await champ(page, 'Rechercher dans l’annuaire').fill('Martin');
  const fiche = page.locator('.v-card').filter({ hasText: 'MARTIN Marc' });
  await expect(fiche).toBeVisible();
  await expect(fiche).toContainText('Pasteur APE');
  await expect(fiche).toContainText(data.marc.email);

  await champ(page, 'Rechercher dans l’annuaire').fill('Desactive');
  await expect(page.getByText('Aucun résultat pour « Desactive »')).toBeVisible();
});

test('mon profil : un membre modifie son téléphone, la modification est enregistrée', async ({ page }) => {
  const telephone = '06 12 34 56 78';
  await connecter(page, data.jeanne);
  await page.getByRole('link', { name: 'Mon profil' }).click();
  await expect(page.getByRole('heading', { name: 'DURAND Jeanne' })).toBeVisible();
  await expect(page.locator('.v-chip').filter({ hasText: 'Pasteur APE' })).toBeVisible();

  await page.getByRole('button', { name: 'Modifier mon profil' }).click();
  const fiche = page.getByRole('dialog').last();
  await expect(fiche.getByText('Modifier mon profil')).toBeVisible();
  await expect(champ(fiche, 'Prénom')).toHaveValue('Jeanne');
  await champ(fiche, 'Téléphone').fill(telephone);
  await fiche.getByRole('button', { name: 'Enregistrer', exact: true }).click();
  await expect(page.getByText('Profil enregistré avec succès')).toBeVisible();

  // Relu depuis la base après rechargement
  await page.reload();
  await page.getByRole('button', { name: 'Modifier mon profil' }).click();
  await expect(champ(page.getByRole('dialog').last(), 'Téléphone')).toHaveValue(telephone);
});

test('l’admin désactive un compte : la personne ne peut plus se connecter', async ({ page }) => {
  // Avant : la connexion fonctionne
  await connecter(page, data.bruno);
  await seDeconnecter(page);

  await connecter(page, data.admin);
  await page.goto('/admin/users');
  await champ(page, 'Chercher un utilisateur').fill('Bloque');
  await page.getByRole('button', { name: 'Modifier Bruno BLOQUE' }).click();
  await page.waitForLoadState('networkidle');
  const fiche = page.getByRole('dialog').last();
  await fiche.getByRole('tab', { name: 'Actions sensibles' }).click();
  await fiche.getByRole('button', { name: 'Désactiver l\'utilisateur' }).click();
  await expect(page.getByText('Utilisateur désactivé avec succès')).toBeVisible();
  await expect(fiche.getByRole('button', { name: 'Réactiver l\'utilisateur' })).toBeVisible();
  await fiche.getByRole('button', { name: 'Fermer' }).click();
  await seDeconnecter(page);

  await seConnecter(page, data.bruno);
  await expect(page.getByText(/Adresse e-mail ou mot de passe incorrect/)).toBeVisible();
});

test('« se connecter en tant que » : l’admin voit l’intranet d’un membre puis revient à son compte', async ({ page }) => {
  await connecter(page, data.admin);
  await page.goto('/admin/users');
  await champ(page, 'Chercher un utilisateur').fill('Pasteur');
  await page.getByRole('button', { name: 'Se connecter en tant que Pierre PASTEUR' }).click();

  await expect(page).toHaveURL(/\/feed$/);
  await expect(page.getByRole('button', { name: 'Revenir à Alice' })).toBeVisible();
  await page.getByRole('button', { name: 'Mon compte' }).click();
  await expect(page.locator('.v-overlay--active').getByText(data.pasteur.email)).toBeVisible();
  await page.keyboard.press('Escape');

  await page.getByRole('button', { name: 'Revenir à Alice' }).click();
  await expect(page).toHaveURL(/\/admin\/users$/);
  await expect(page.getByRole('button', { name: 'Revenir à Alice' })).toBeHidden();
  await page.getByRole('button', { name: 'Mon compte' }).click();
  await expect(page.locator('.v-overlay--active').getByText(data.admin.email)).toBeVisible();
});
