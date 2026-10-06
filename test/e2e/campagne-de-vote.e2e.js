// Parcours 3 : campagne de vote complète, de la préparation au PDF des résultats.
// L'admin prépare la campagne (résolution présente dès la création, table des votes,
// estimation des votants) et l'ouvre ; un pasteur membre vote ; le président d'église
// vote au nom de son église ; l'admin clôture, lit les résultats et télécharge le PDF.
const { test, expect } = require('@playwright/test');
const data = require('./support/data');
const { connecter, seDeconnecter } = require('./support/session');
const { champ, choisirOption } = require('./support/ui');

test.describe.configure({ mode: 'serial' });

const campagne = `Assemblée générale E2E ${Date.now()}`;
const resolution = 'Approuver le rapport moral';

function ligneCampagne(page) {
  return page.getByRole('row').filter({ hasText: campagne });
}

test.describe('Campagne de vote', () => {
  test('l’admin prépare la campagne, vérifie l’estimation des votants et ouvre le vote', async ({ page }) => {
    await connecter(page, data.admin);
    await page.goto('/admin/campaigns');
    await page.getByRole('button', { name: 'Ajouter une campagne' }).first().click();

    const formulaire = page.getByRole('dialog');
    await expect(formulaire.getByText('Ajouter une campagne')).toBeVisible();
    await champ(formulaire, 'Structure organisatrice').fill('Fédération');
    await choisirOption(page, data.federation);
    await champ(formulaire, 'Nom de la campagne').fill(campagne);

    // Une première résolution est déjà prête à remplir à la création
    await expect(formulaire.getByRole('tab', { name: 'Résolutions (1)' })).toBeVisible();
    await champ(formulaire, 'Intitulé de la résolution 1').fill(resolution);

    // Table des votes : pasteurs AEM membres et églises membres, votes comptabilisés
    await formulaire.getByRole('tab', { name: 'Table des votes' }).click();
    await expect(formulaire.getByText('Ajoutez une ligne pour indiquer qui vote.')).toBeVisible();
    await formulaire.getByRole('button', { name: 'Ajouter une ligne' }).click();
    await formulaire.getByTestId('voting-line').nth(0).locator('.v-select').click();
    await choisirOption(page, 'Pasteur AEM');
    await formulaire.getByRole('button', { name: 'Ajouter une ligne' }).click();
    await formulaire.getByTestId('voting-line').nth(1).locator('.v-select').click();
    await choisirOption(page, 'Églises');

    // Estimation : 2 pasteurs AEM membres (Pierre, Paul) + 1 église membre présidée (Marseille)
    await expect(formulaire.getByTestId('estimate')).toContainText('3 votants comptabilisés');
    await expect(formulaire.getByTestId('estimate')).toContainText('0 votant consultatif');
    await expect(formulaire.getByTestId('line-count').nth(0)).toContainText('2 votants');
    await expect(formulaire.getByTestId('line-count').nth(1)).toContainText('1 votant');
    await expect(formulaire.getByTestId('members')).toContainText(`Membres de ${data.federation}`);

    await formulaire.getByRole('button', { name: 'Enregistrer la campagne' }).click();
    await expect(page.getByText('Campagne enregistrée')).toBeVisible();
    await expect(ligneCampagne(page)).toContainText('À venir');
    await expect(ligneCampagne(page)).toContainText(data.federation);

    // Ouverture du vote
    await ligneCampagne(page).getByRole('button', { name: 'Ouvrir le vote' }).click();
    await expect(page.getByText('Le statut de la campagne a été mis à jour')).toBeVisible();
    await expect(ligneCampagne(page)).toContainText('Vote ouvert');
  });

  test('un pasteur membre vote avec son bulletin', async ({ page }) => {
    await connecter(page, data.pasteur);
    await page.goto('/campaigns');
    const carte = page.locator('.v-card').filter({ hasText: campagne });
    await expect(carte).toContainText('Vote ouvert');
    await carte.getByRole('link', { name: 'Accéder au vote' }).click();

    await expect(page.getByRole('heading', { name: campagne })).toBeVisible();
    const bulletin = page.getByRole('checkbox', { name: /Pierre PASTEUR/ });
    await expect(page.getByText('Pierre PASTEUR (vote comptabilisé)')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Voter' })).toBeDisabled();
    await bulletin.check();

    await expect(page.getByText(`1. ${resolution}`)).toBeVisible();
    await page.getByLabel(resolution, { exact: true }).getByRole('button', { name: 'Oui' }).click();
    await page.getByRole('button', { name: 'Voter' }).click();

    const confirmation = page.getByRole('dialog');
    await expect(confirmation).toContainText('Vous allez voter avec 1 bulletin.');
    await confirmation.getByRole('button', { name: 'Confirmer mon vote' }).click();
    await expect(page.getByText('Votre vote est enregistré.')).toBeVisible();
    await expect(page).toHaveURL(/\/campaigns$/);

    // Plus aucun bulletin disponible : la campagne disparaît de ses votes
    await expect(page.locator('.v-card').filter({ hasText: campagne })).toHaveCount(0);
  });

  test('le président d’église vote au nom de son église', async ({ page }) => {
    await connecter(page, data.president);
    await page.goto('/campaigns');
    await page.locator('.v-card').filter({ hasText: campagne }).getByRole('link', { name: 'Accéder au vote' }).click();

    // Deux bulletins : son église et lui-même ; il n'utilise que celui de l'église
    await expect(page.getByText(`${data.eglise} (vote comptabilisé)`)).toBeVisible();
    await expect(page.getByText('Paul PRESIDENT (vote comptabilisé)')).toBeVisible();
    await page.getByRole('checkbox', { name: new RegExp(data.eglise) }).check();
    await page.getByLabel(resolution, { exact: true }).getByRole('button', { name: 'Non' }).click();
    await page.getByRole('button', { name: 'Voter' }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Confirmer mon vote' }).click();
    await expect(page.getByText('Votre vote est enregistré.')).toBeVisible();

    // Son bulletin personnel reste disponible, celui de l'église est utilisé
    await page.locator('.v-card').filter({ hasText: campagne }).getByRole('link', { name: 'Accéder au vote' }).click();
    await expect(page.getByText(`${data.eglise} a déjà voté`)).toBeVisible();
    await expect(page.getByRole('checkbox', { name: /Paul PRESIDENT/ })).toBeVisible();
  });

  test('l’admin clôture, voit les résultats et télécharge le PDF', async ({ page }) => {
    await connecter(page, data.admin);
    await page.goto('/admin/campaigns');

    await ligneCampagne(page).getByRole('button', { name: 'Clôturer définitivement le vote' }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Clôturer le vote' }).click();
    await expect(ligneCampagne(page)).toContainText('Clôturé');

    await ligneCampagne(page).getByRole('button', { name: 'Modifier la campagne' }).click();
    const formulaire = page.getByRole('dialog');
    await formulaire.getByRole('tab', { name: 'Résultats' }).click();

    // 2 votants, 1 Oui (pasteur), 1 Non (église)
    const resultat = formulaire.getByRole('row').filter({ hasText: resolution });
    await expect(resultat.getByRole('cell')).toHaveText(['2', /^1\s+\(50\.00%\)/, /^1\s+\(50\.00%\)/, /^0/, '2', '0']);
    const votants = formulaire.locator('table').last();
    await expect(votants).toContainText('PASTEUR Pierre');
    await expect(votants).toContainText(data.eglise);
    await expect(votants).not.toContainText('PRESIDENT Paul');

    // PDF : téléchargé par l'API avec le jeton, puis ouvert dans un nouvel onglet
    const [reponse] = await Promise.all([
      page.waitForResponse((r) => /\/api\/campaigns\/\d+\/results/.test(r.url())),
      formulaire.getByRole('button', { name: 'Télécharger' }).click(),
    ]);
    expect(reponse.status()).toBe(200);
    expect(reponse.headers()['content-type']).toContain('application/pdf');
    const pdf = await reponse.body();
    expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    expect(pdf.length).toBeGreaterThan(1000);
  });
});
