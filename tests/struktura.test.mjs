import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const PAGES = ['index.html', 'odrzano.html', 'sledeci.html', 'literatura.html', 'projekti.html', 'oblak.html'];

test('all 6 pages exist, carry valid internal links, skip link, and lang="sr-Latn"', async () => {
  for (const page of PAGES) {
    const html = await readFile(new URL(page, root), 'utf8');
    assert.match(html, /<html lang="sr-Latn">/, `${page} missing sr-Latn`);
    assert.match(html, /class="skip" href="#main"/, `${page} missing skip link`);
    assert.match(html, /aria-current="page"/, `${page} missing active nav indicator`);

    const hrefs = [...html.matchAll(/href="([^"#?]+)"/g)].map(m => m[1]);
    for (const h of hrefs) {
      if (/^https?:\/\//.test(h)) continue;
      await access(new URL(h, root));
    }
  }
});

test('course.json has 15 weeks and 100-point assessment', async () => {
  const course = JSON.parse(await readFile(new URL('data/course.json', root), 'utf8'));
  assert.equal(course.weeks.length, 15, 'expected 15 syllabus weeks');
  assert.ok(course.outcomes.length >= 8, 'expected learning outcomes');
  assert.ok(course.projectStages.length === 5, 'expected 5 project stages');
});
