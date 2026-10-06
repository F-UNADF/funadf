// Tests de bout en bout (navigateur réel → SPA → API Rails → MySQL).
// Lancement : bin/e2e (prépare la base funadf_e2e, construit le front, puis lance Playwright).
// Playwright démarre lui-même le serveur Rails de l'environnement e2e (port 3100).
const { defineConfig, devices } = require('@playwright/test');

const PORT = process.env.E2E_PORT || '3100';
const BASE_URL = `http://127.0.0.1:${PORT}`;

module.exports = defineConfig({
  testDir: './test/e2e',
  testMatch: '**/*.e2e.js',
  // Une seule base partagée et des parcours qui la modifient : exécution en série.
  workers: 1,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  // Pas de nouvel essai : les parcours modifient la base (mots de passe, votes), un 2e essai échouerait pour une autre raison
  retries: 0,
  // Large : les parcours enchaînent plusieurs connexions, et la VM Docker locale ou la CI peuvent être lentes
  timeout: 90_000,
  expect: { timeout: 10_000 },
  outputDir: 'tmp/e2e/test-results',
  reporter: [
    ['list'],
    ['html', { outputFolder: 'tmp/e2e/report', open: 'never' }],
  ],
  use: {
    baseURL: BASE_URL,
    locale: 'fr-FR',
    timezoneId: 'Europe/Paris',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
    acceptDownloads: true,
    // Le code de la SPA marque déjà certains éléments avec data-test
    testIdAttribute: 'data-test',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
  ],
  webServer: {
    command: `rm -f tmp/pids/e2e-server.pid && exec bin/rails server -e e2e -p ${PORT} -b 127.0.0.1 -P tmp/pids/e2e-server.pid`,
    url: `${BASE_URL}/connexion`,
    env: { RAILS_ENV: 'e2e', E2E_HOST: `127.0.0.1:${PORT}` },
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
    stdout: 'ignore',
    stderr: 'ignore',
  },
});
