// Factory cleanliness gate (Svemir / Univerzitet standard):
// Verifies zero bookkeeping leaks, zero "nastavnik/teacher" role drift,
// zero phone/camera filenames, and zero local filesystem paths in public HTML, JSON and JS.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const htmlFiles = (await readdir(root)).filter(f => f.endsWith('.html')).sort();

const stripHtml = html => html
  .replace(/<script[\s\S]*?<\/script>/g, ' ')
  .replace(/<style[\s\S]*?<\/style>/g, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ');

const BANNED = [
  [/\bnastavni[kc]\w*/i, 'role must be "profesor", never "nastavnik"'],
  [/\bteacher\b/i, 'role must be "professor", never "teacher"'],
  [/Ispravke ranijih zapisa|Otvorena pitanja o rasporedu|kadrovi se još traže|neuparenih u evidenciji/i, 'bookkeeping leak'],
  [/sa telefona|na telefonu|Samsung|DCIM|202\d{5}_\d{6}\.jpg|IMG_\d+|Screenshot_/i, 'phone/camera artifact leak'],
  [/C:\\Svemir|D:\\Svemir|evidencija\/prijem-|karantin-slika|DOZVOLJENE_SLIKE/i, 'internal filesystem path leak'],
  [/bez duplikata po SHA-256/i, 'internal hash bookkeeping leak']
];

function scan(label, text, hits) {
  for (const [re, reason] of BANNED) {
    const m = text.match(re);
    if (m) hits.push(`${label}: ${reason} — "${m[0]}"`);
  }
}

test('public HTML pages pass cleanliness gate', async () => {
  const hits = [];
  assert.ok(htmlFiles.length >= 6, 'expected at least 6 HTML pages');
  for (const f of htmlFiles) {
    const raw = await readFile(new URL(f, root), 'utf8');
    scan(f, stripHtml(raw), hits);
  }
  assert.deepEqual(hits, []);
});

test('JSON data and client JS pass cleanliness gate', async () => {
  const hits = [];
  for (const rel of ['data/course.json', 'data/tok.json', 'assets/app.js']) {
    const raw = await readFile(new URL(rel, root), 'utf8');
    scan(rel, raw, hits);
  }
  assert.deepEqual(hits, []);
});
