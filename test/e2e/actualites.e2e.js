// Parcours 4 : l'admin publie une actu réservée à un niveau de reconnaissance ;
// un membre concerné la voit dans son fil et l'ouvre, un membre non concerné ne la voit pas.
const { test, expect } = require('@playwright/test');
const data = require('./support/data');
const { connecter } = require('./support/session');
const { champ, choisirOption } = require('./support/ui');

test.describe.configure({ mode: 'serial' });

const titre = `Convocation au synode E2E ${Date.now()}`;
const contenu = 'Le synode se tiendra à Lyon. Merci de confirmer votre présence.';
let urlActu;

// Date locale au format d'un champ datetime-local (la veille : déjà publiée)
function hierLocal() {
  const d = new Date(Date.now() - 24 * 3600 * 1000);
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

test.describe('Actualités', () => {
  test('l’admin publie une actu réservée aux pasteurs AEM de la fédération', async ({ page }) => {
    await connecter(page, data.admin);
    await page.goto('/admin/posts');
    await page.getByRole('button', { name: 'Ajouter une actu' }).first().click();

    const formulaire = page.getByRole('dialog');
    await champ(formulaire, 'Titre *').fill(titre);
    await champ(formulaire, 'Structure').fill('Fédération');
    await choisirOption(page, data.federation);
    await formulaire.locator('input[type="datetime-local"]').first().fill(hierLocal());
    await formulaire.locator('.ql-editor').fill(contenu);

    // Niveaux d'accès : uniquement « Pasteur AEM »
    await formulaire.locator('.v-select').filter({ hasText: 'Accessible par :' }).click();
    await choisirOption(page, 'Pasteur aem');
    await formulaire.locator('.v-toolbar-title').click(); // referme la liste
    await formulaire.getByRole('button', { name: 'Enregistrer' }).click();

    await expect(page.getByText('Actu enregistrée')).toBeVisible();
    await expect(page.getByRole('row').filter({ hasText: titre })).toContainText(data.federation);

    // Le niveau d'accès est bien enregistré
    await page.getByRole('button', { name: `Actions pour ${titre}` }).click();
    await page.locator('.v-overlay--active').getByText('Modifier l\'actu', { exact: true }).click();
    await expect(page.getByRole('dialog').locator('.v-select').filter({ hasText: 'Accessible par :' })).toContainText(/Pasteur AEM/i);
  });

  test('un pasteur AEM membre voit l’actu dans son fil et l’ouvre', async ({ page }) => {
    await connecter(page, data.pasteur);
    const carte = page.locator('.v-card').filter({ hasText: titre });
    await expect(carte).toBeVisible();
    await expect(carte).toContainText(data.federation);
    await carte.click();

    await expect(page).toHaveURL(/\/actus\/\d+$/);
    urlActu = new URL(page.url()).pathname;
    await expect(page.getByRole('heading', { name: titre })).toBeVisible();
    await expect(page.getByText(contenu)).toBeVisible();
  });

  test('un membre d’un autre niveau ne la voit ni dans son fil ni par son adresse', async ({ page }) => {
    await connecter(page, data.stagiaire);
    await expect(page.getByRole('heading', { name: 'Actualités' })).toBeVisible();
    // Le fil est chargé (vide ou non) avant de conclure à l'absence de l'actu
    await expect(page.locator('.v-skeleton-loader')).toHaveCount(0);
    await expect(page.getByText(titre)).toHaveCount(0);

    expect(urlActu).toBeTruthy();
    await page.goto(urlActu);
    await expect(page.getByText('Cette actualité n’a pas pu être affichée.')).toBeVisible();
    await expect(page.getByText(titre)).toHaveCount(0);
  });
});
