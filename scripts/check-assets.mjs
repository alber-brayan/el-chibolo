import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const html = await readFile(path.join(root, 'index.html'), 'utf8');
const app = await readFile(path.join(root, 'assets/js/app.js'), 'utf8');
const references = new Set();
const failures = [];

for (const match of html.matchAll(/(?:src|href|data-photo)="(assets\/[^"?#]+)(?:[?#][^"]*)?"/g)) {
  references.add(match[1]);
}
for (const match of app.matchAll(/image:'([^']+)'/g)) references.add('assets/images/' + match[1]);
if (!app.includes('src="assets/images/${e.image}"')) failures.push('Ruta dinámica de imágenes incorrecta en app.js');

for (const stylesheet of ['assets/css/style.css', 'assets/css/nature.css']) {
  const css = await readFile(path.join(root, stylesheet), 'utf8');
  for (const match of css.matchAll(/url\(\s*['"]?([^)'"\s]+)['"]?\s*\)/g)) {
    if (/^(?:https?:|data:|#)/.test(match[1])) continue;
    references.add(path.posix.normalize(path.posix.join(path.posix.dirname(stylesheet), match[1])));
  }
}

for (const reference of references) {
  try { await access(path.join(root, reference)); }
  catch { failures.push('Recurso no encontrado: ' + reference); }
}

const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
for (const match of html.matchAll(/\bhref="#([^"]+)"/g)) {
  if (!ids.has(match[1])) failures.push('Destino interno no encontrado: #' + match[1]);
}

if (failures.length) {
  failures.forEach(message => console.error(message));
  process.exitCode = 1;
} else {
  console.log(`Correcto: ${references.size} recursos locales y todos los enlaces internos.`);
}
