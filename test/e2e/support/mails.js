// Lecture des e-mails capturés par l'environnement e2e (test/e2e/support/mail_catcher.rb).
const fs = require('fs');
const path = require('path');
const { expect } = require('@playwright/test');

const DOSSIER = path.resolve(__dirname, '../../../tmp/e2e/mails');

function tousLesMails() {
  if (!fs.existsSync(DOSSIER)) return [];
  return fs.readdirSync(DOSSIER)
    .filter((f) => f.endsWith('.json'))
    .sort()
    .map((f) => JSON.parse(fs.readFileSync(path.join(DOSSIER, f), 'utf8')));
}

// Dernier e-mail reçu par `destinataire` (dont l'objet contient `objet`), en l'attendant au besoin.
async function dernierMail(destinataire, objet) {
  let trouve;
  await expect.poll(() => {
    trouve = tousLesMails().reverse().find((m) => m.to.includes(destinataire) && (!objet || m.subject.includes(objet)));
    return !!trouve;
  }, { message: `e-mail « ${objet} » pour ${destinataire}`, timeout: 15_000 }).toBe(true);
  return trouve;
}

// Premier lien du corps HTML dont l'URL contient `fragment`, décodé (&amp;).
function lien(mail, fragment) {
  const liens = [...mail.html.matchAll(/href="([^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, '&'));
  const url = liens.find((l) => l.includes(fragment));
  if (!url) throw new Error(`Aucun lien contenant « ${fragment} » dans l'e-mail « ${mail.subject} »`);
  return url;
}

module.exports = { dernierMail, lien, tousLesMails };
