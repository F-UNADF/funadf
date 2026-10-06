// Parcours 7 : l'admin dépose un fichier dans les documents ; un membre le voit et le télécharge.
const fs = require('fs');
const { test, expect } = require('@playwright/test');
const data = require('./support/data');
const { connecter, seDeconnecter } = require('./support/session');
const { champ } = require('./support/ui');

test('l’admin dépose un document, un membre le retrouve et le télécharge', async ({ page }) => {
  const id = Date.now();
  const fichier = {
    name: `reglement-interieur-${id}.txt`,
    mimeType: 'text/plain',
    buffer: Buffer.from(`Règlement intérieur ADD+ (e2e ${id})\nArticle 1 : tout membre est tenu informé.\n`),
  };
  const nomAffiche = `Règlement intérieur ${id}`;

  // Dépôt par l'admin
  await connecter(page, data.admin);
  await page.goto('/admin/documents');
  await page.locator('input[type="file"]').setInputFiles(fichier);
  await expect(page.getByText(fichier.name)).toBeVisible();
  await page.getByRole('button', { name: 'Envoyer' }).click();

  // Le fichier arrive dans « Non répertoriés », sous le nom du fichier
  const dossier = page.locator('.v-list-item').filter({ hasText: /Non répertoriés \(\d+\)/ });
  await expect(dossier).toBeVisible();
  await dossier.locator('.mdi-chevron-down').click(); // déplie le dossier
  // (hors liste des fichiers choisis du composant de dépôt)
  const ligne = page.locator('.v-list-item:not(.v-file-upload-item)').filter({ hasText: `reglement-interieur-${id}` });
  await expect(ligne).toBeVisible();

  // Renommage et description
  await ligne.locator('.mdi-pen').click();
  const formulaire = page.getByRole('dialog');
  await champ(formulaire, 'Nom').fill(nomAffiche);
  await formulaire.getByLabel('description').fill('Version adoptée en assemblée');
  await formulaire.getByRole('button', { name: 'Enregistrer' }).click();
  await expect(formulaire).toBeHidden();
  await expect(page.locator('.v-list-item').filter({ hasText: nomAffiche })).toBeVisible();
  await seDeconnecter(page);

  // Le membre le voit dans ses documents
  await connecter(page, data.pasteur);
  await page.getByRole('link', { name: 'Documents' }).click();
  await expect(page).toHaveURL(/\/documents$/);
  await expect(page.getByText(data.categorieDocuments)).toBeVisible();
  await page.getByText(/Non répertoriés \(\d+\)/).click();
  const document = page.locator('.v-list-item').filter({ hasText: nomAffiche });
  await expect(document).toContainText('Version adoptée en assemblée');

  // Téléchargement : ouvert dans un nouvel onglet, le fichier reçu est celui déposé
  // (selon Chromium, le téléchargement est rattaché à l'onglet ouvert ou à la page d'origine : on écoute les deux avant le clic)
  const ongletOuvert = page.waitForEvent('popup');
  const telechargementSurPage = page.waitForEvent('download').catch(() => null);
  await document.click();
  const onglet = await ongletOuvert;
  const telechargement = await Promise.race([onglet.waitForEvent('download'), telechargementSurPage]);
  expect(telechargement.suggestedFilename()).toBe(fichier.name);
  const contenu = fs.readFileSync(await telechargement.path());
  expect(contenu.equals(fichier.buffer)).toBe(true);
});
