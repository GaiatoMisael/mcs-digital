/**
 * Gera o flyer PagoTop.
 *   node build.mjs            -> dist/flyer.html + PNGs (limpo e com guia)
 *   node build.mjs --art foto.png  -> usa a foto do artista no espaco reservado
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, resolve, extname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const here = dirname(fileURLToPath(import.meta.url));
const arg = (name) => {
  const i = process.argv.indexOf(name);
  return i > -1 ? process.argv[i + 1] : null;
};

const FONTS = [
  ['Anton', 400, 'fonts/Anton.ttf'],
  ['Archivo Black', 400, 'fonts/ArchivoBlack.ttf'],
  ['Bebas Neue', 400, 'fonts/BebasNeue.ttf'],
  ['Montserrat', 700, 'fonts/Montserrat700.ttf'],
  ['Montserrat', 900, 'fonts/Montserrat900.ttf'],
];

const faces = FONTS.map(([family, weight, file]) => {
  const b64 = readFileSync(resolve(here, file)).toString('base64');
  return `@font-face{font-family:'${family}';font-weight:${weight};font-style:normal;` +
         `src:url(data:font/ttf;base64,${b64}) format('truetype');}`;
}).join('\n');

let html = readFileSync(resolve(here, 'template.html'), 'utf8').replace('/*__FONTS__*/', faces);

// foto opcional do artista, embutida em base64
const art = arg('--art');
if (art) {
  const p = resolve(process.cwd(), art);
  if (!existsSync(p)) throw new Error(`Imagem nao encontrada: ${p}`);
  const mime = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' }[extname(p).toLowerCase()] || 'image/png';
  const b64 = readFileSync(p).toString('base64');
  html = html.replace('<div class="guide">', `<img src="data:${mime};base64,${b64}" alt=""><div class="guide">`);
}

const out = resolve(here, 'dist/flyer.html');
writeFileSync(out, html);

const browser = await chromium.launch(
  existsSync('/opt/pw-browsers/chromium') ? { executablePath: '/opt/pw-browsers/chromium' } : {}
);
const page = await browser.newPage({
  viewport: { width: 1080, height: 1080 },
  deviceScaleFactor: 2, // saida final 2160x2160
});
await page.goto(pathToFileURL(out).href);
await page.evaluate(() => document.fonts.ready);

const shots = [
  ['dist/pagotop-flyer.png', false],
  ['dist/pagotop-flyer-guia.png', true],
];
for (const [file, guide] of shots) {
  await page.evaluate((g) => document.body.classList.toggle('show-guide', g), guide);
  await page.screenshot({ path: resolve(here, file), clip: { x: 0, y: 0, width: 1080, height: 1080 } });
  console.log('ok ->', file);
}

await browser.close();
