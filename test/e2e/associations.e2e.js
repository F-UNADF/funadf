// Parcours 2 : l'admin crée une association, y ajoute des membres et une église, nomme un président.
// Le président nommé retrouve ensuite l'association dans son espace « Association ».
const { test, expect } = require('@playwright/test');
const data = require('./support/data');
const { connecter, seDeconnecter } = require('./support/session');
const { champ, ouvrirActions, ajouterMembres, ligneMembre, choisirOption } = require('./support/ui');

test('l’admin crée une association, ajoute membres et église, nomme un président', async ({ page }) => {
  const nom = `Association E2E ${Date.now()}`;

  await connecter(page, data.admin);
  await page.goto('/admin/associations');

  // Création
  await page.getByRole('button', { name: 'Ajouter une association' }).first().click();
  const formulaire = page.getByRole('dialog');
  await champ(formulaire, 'Nom *').fill(nom);
  await champ(formulaire, 'Code postal *').fill('69001');
  await champ(formulaire, 'Ville *').fill('Lyon');
  await formulaire.getByRole('button', { name: 'Enregistrer' }).click();
  await expect(page.getByText('Association enregistrée')).toBeVisible();
  await expect(formulaire).toBeHidden();

  const ligne = page.getByRole('row').filter({ hasText: nom });
  await expect(ligne).toBeVisible();
  await expect(ligne).toContainText('Lyon (69001)');

  // Membres : deux pasteurs et une église
  await ouvrirActions(page, nom, 'Modifier l\'association');
  await page.getByRole('dialog').getByRole('tab', { name: 'Membres' }).click();
  await ajouterMembres(page, ['MARTIN Marc', 'DURAND Jeanne', `${data.autreEglise} (Bordeaux)`]);
  await expect(page.getByText('Membres ajoutés avec succés')).toBeVisible();

  for (const membre of ['MARTIN Marc', 'DURAND Jeanne', `${data.autreEglise}`]) {
    await expect(ligneMembre(page, membre)).toContainText('Membre');
  }

  // Président : rôle choisi dans le menu de la ligne
  await ligneMembre(page, 'MARTIN Marc').getByRole('button', { name: 'Membre' }).click();
  await choisirOption(page, 'Président');
  await expect(page.getByText('Role modifié avec succés')).toBeVisible();
  await expect(ligneMembre(page, 'MARTIN Marc').getByRole('button', { name: 'Président' })).toBeVisible();

  // Rechargement : tout est bien enregistré en base
  await page.reload();
  const ligneApres = page.getByRole('row').filter({ hasText: nom });
  await expect(ligneApres).toContainText('MARTIN Marc');
  await ouvrirActions(page, nom, 'Modifier l\'association');
  await page.getByRole('dialog').getByRole('tab', { name: 'Membres' }).click();
  await expect(ligneMembre(page, 'MARTIN Marc').getByRole('button', { name: 'Président' })).toBeVisible();
  await expect(ligneMembre(page, 'DURAND Jeanne').getByRole('button', { name: 'Membre' })).toBeVisible();
  await expect(ligneMembre(page, data.autreEglise)).toBeVisible();

  // Le président voit l'association dans son espace « Association »
  await page.keyboard.press('Escape');
  await seDeconnecter(page);
  await connecter(page, data.marc);
  await page.goto('/association/associations');
  await expect(page.getByRole('row').filter({ hasText: nom })).toBeVisible();
});
