// scripts/fetch-wait.mjs
// Holt die offiziellen AMSS-Wartezeiten (Quelle: Uprava granične policije RS)
// und schreibt sie nach data/wait-times.json.
// Läuft per GitHub Action. Braucht nur Node 20+ (eingebautes fetch).
//
// Geparst werden NUR die für deine Route relevanten serbischen Übergänge:
//   - Batrovci/Bajakovo (Grenze HR–RS)
//   - Gradina/Kalotina  (Grenze RS–BG)
// AMSS liefert nur serbische Grenzen – die anderen bleiben in der App manuell/KI.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const URL_AMSS = 'https://www.amss.org.rs/stanje-na-putu/strana/mapa';
const OUT = 'data/wait-times.json';

const TARGETS = [
  { key: 'batrovci', name: /BATROVCI/i },
  { key: 'gradina',  name: /GRADINA/i }
];

// Aus einem Textstück die Minuten ziehen: "od 30 do 60" -> 60, "oko 45 min" -> 45,
// "2 sata" / "2 h" -> 120. Gibt null zurück, wenn nichts gefunden.
function minutes(s) {
  if (!s) return null;
  const range = s.match(/od\s*(\d+)\s*do\s*(\d+)/i);
  if (range) return parseInt(range[2], 10);
  const sat = s.match(/(\d+)\s*(sat|sata|sati|h)\b/i);
  if (sat) return parseInt(sat[1], 10) * 60;
  const min = s.match(/(\d+)\s*(min|minut)/i);
  if (min) return parseInt(min[1], 10);
  return null;
}

// Im Abschnitt eines Übergangs den PKW-Block ("PUTNIČKIM") isolieren und
// Izlaz (Ausreise RS) + Ulaz (Einreise RS) lesen.
function parseSection(text) {
  const start = text.search(/PUTNI/i);
  if (start === -1) return null;
  let block = text.slice(start);
  const cut = block.search(/TERETN/i);          // vor den LKW-Zahlen abschneiden
  if (cut !== -1) block = block.slice(0, cut);
  const iz = block.match(/Izlaz[^.]*?Srbij[^.]*?(\d[^.]*)/i);
  const ul = block.match(/Ulaz[^.]*?Srbij[^.]*?(\d[^.]*)/i);
  return {
    izlaz: iz ? minutes(iz[1]) : null,   // Ausreise aus Serbien
    ulaz:  ul ? minutes(ul[1]) : null    // Einreise nach Serbien
  };
}

function sectionFor(text, re) {
  const i = text.search(re);
  if (i === -1) return null;
  // Festes Fenster ab dem Namen. parseSection schneidet intern am PKW-Block sauber zu.
  return text.slice(i, i + 700);
}

function deepEqual(a, b) { return JSON.stringify(a) === JSON.stringify(b); }

const res = await fetch(URL_AMSS, {
  headers: { 'User-Agent': 'Mozilla/5.0 (compatible; GrenzenCheck/1.0)' }
});
if (!res.ok) { console.error('AMSS HTTP', res.status); process.exit(0); } // nicht überschreiben
const html = await res.text();
const text = html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/\s+/g, ' ');

const crossings = {};
for (const t of TARGETS) {
  const sec = sectionFor(text, t.name);
  if (!sec) continue;
  const parsed = parseSection(sec);
  if (parsed && (parsed.izlaz != null || parsed.ulaz != null)) crossings[t.key] = parsed;
}

if (Object.keys(crossings).length === 0) {
  console.error('Keine Werte geparst – Datei bleibt unverändert.');
  process.exit(0);
}

// Nur schreiben, wenn sich die Werte geändert haben (sonst keine sinnlosen Commits).
let prev = null;
try { prev = JSON.parse(readFileSync(OUT, 'utf8')); } catch {}
if (prev && deepEqual(prev.crossings, crossings)) {
  console.log('Unverändert – kein Commit.');
  process.exit(0);
}

mkdirSync('data', { recursive: true });
const out = {
  updated: new Date().toISOString(),
  source: 'AMSS / Uprava granične policije RS',
  crossings
};
writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log('Geschrieben:', JSON.stringify(crossings));
