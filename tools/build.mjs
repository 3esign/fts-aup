import { readFile, writeFile } from 'node:fs/promises';

const course = JSON.parse(await readFile(new URL('../data/course.json', import.meta.url), 'utf8'));
const tok = JSON.parse(await readFile(new URL('../data/tok.json', import.meta.url), 'utf8'));

const NAV = [
  { href: 'index.html', label: 'Naslovna', id: 'home' },
  { href: 'odrzano.html', label: 'Održano', id: 'held' },
  { href: 'sledeci.html', label: 'Sledeći čas', id: 'next' },
  { href: 'literatura.html', label: 'Literatura', id: 'lit' },
  { href: 'projekti.html', label: 'Projekti', id: 'projects' },
  { href: 'oblak.html', label: 'Oblak ideja', id: 'cloud' }
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function shell({ pageId, title, desc, body }) {
  const navHtml = NAV.map(n =>
    `<a href="${n.href}"${n.id === pageId ? ' aria-current="page"' : ''}>${n.label}</a>`
  ).join('\n      ');
  return `<!doctype html>
<html lang="sr-Latn">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${esc(title)} — ${esc(course.titleSr)} · FTS Travnik</title>
  <meta name="description" content="${esc(desc)}">
  <link rel="icon" href="assets/mark.svg" type="image/svg+xml">
  <link rel="stylesheet" href="assets/style.css">
  <script type="module" src="assets/app.js"></script>
</head>
<body>
  <a class="skip" href="#main">Pređi na sadržaj</a>
  <header class="site-header">
    <a class="brand" href="index.html">
      <img src="assets/mark.svg" alt="" width="34" height="34">
      <span>${course.shortName}</span>
    </a>
    <nav class="main-nav" aria-label="Glavna navigacija">
      ${navHtml}
    </nav>
    <div class="header-actions">
      <button id="lang-toggle" class="lang-btn" type="button" data-lang="sr" hidden>English</button>
    </div>
  </header>
  <div class="course-band">
    <p class="course-line">
      <strong id="band-title">${esc(course.titleSr)}</strong>
      <span>Šifra: ${esc(course.code)}</span>
      <span id="band-inst">Univerzitet u Travniku · Fakultet za tehničke studije (FTS)</span>
      <span id="band-level">${esc(course.levelSr)}</span>
    </p>
  </div>
  <main id="main" class="shell" tabindex="-1">
${body}
  </main>
  <footer class="site-footer">
    <span id="footer-prof">Profesor: doc. dr Semir Poturak</span>
    <span>Fakultet za tehničke studije · Univerzitet u Travniku · <a href="https://github.com/3esign/${esc(course.slug)}">GitHub repozitorijum</a></span>
  </footer>
</body>
</html>
`;
}

// 1. index.html — Naslovna
const indexBody = `    <section class="page-top">
      <div>
        <p class="eyebrow">Fakultet za tehničke studije · Univerzitet u Travniku</p>
        <h1>${esc(course.titleSr)}.</h1>
        <p class="lede">${esc(course.subtitleSr)}</p>
        <div class="actions">
          <a class="button accent" href="projekti.html">Uputstvo za projekte i predaju →</a>
          <a class="button secondary" href="sledeci.html">Plan po sedmicama (1–15)</a>
          <a class="button secondary" href="literatura.html">Literatura i alati</a>
        </div>
      </div>
      <div class="thesis">
        <p class="eyebrow">Cilj predmeta</p>
        <p>${esc(course.goalSr)}</p>
      </div>
    </section>

    <dl class="meta-grid" aria-label="Osnovni podaci o predmetu">
      <div class="meta-cell"><dt>Šifra predmeta</dt><dd>${esc(course.code)}</dd></div>
      <div class="meta-cell"><dt>Profesor</dt><dd>doc. dr Semir Poturak</dd></div>
      <div class="meta-cell"><dt>Status i preduslov</dt><dd>${esc(course.statusSr)}</dd></div>
      <div class="meta-cell"><dt>Održanih časova</dt><dd>${tok.odrzano.length} (početak semestra)</dd></div>
    </dl>

    <section class="two-col">
      <div class="card card-accent">
        <p class="eyebrow">Struktura bodovanja (100 bodova)</p>
        <h2>Provera znanja i obaveze</h2>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Aktivnost</th><th>Bodovi</th></tr></thead>
            <tbody>
              ${course.assessment.map(a => `<tr><td>${esc(a.nameSr)}</td><td><strong>${esc(a.points)}</strong></td></tr>`).join('\n              ')}
            </tbody>
          </table>
        </div>
      </div>
      <div class="card">
        <p class="eyebrow">Radno okruženje i alati</p>
        <h2>Preporučeni softver i oprema</h2>
        <ul>
          ${course.software.map(s => `<li>${esc(s)}</li>`).join('\n          ')}
        </ul>
        <p class="muted">Zvanični rokovi i termini za tekući semestar potvrđuju se na času i na DL platformi fakulteta.</p>
      </div>
    </section>

    <section>
      <p class="eyebrow">Ishodi učenja</p>
      <h2>Šta student ume po završetku predmeta</h2>
      <ul class="outcome-list">
        ${course.outcomes.map(o => `<li><span class="outcome-id">${esc(o.id)}</span><span>${esc(o.text)}</span></li>`).join('\n        ')}
      </ul>
    </section>`;

// 2. odrzano.html — Održano
const heldBody = tok.odrzano.length === 0
  ? `    <section class="page-top">
      <div>
        <p class="eyebrow">Tok nastave</p>
        <h1>Održano na času.</h1>
        <p class="lede">Hronološki pregled stvarno održanih časova (najnoviji na vrhu), sa sažetkom rada, prilozima i studentskim rezultatima.</p>
      </div>
    </section>
    <div class="empty-box">
      <h2>Semestar tek počinje</h2>
      <p>Održani časovi se upisuju ovde isključivo nakon održane nastave, sa tačnim datumom, temom i pregledanim studentskim prilozima.</p>
      <div class="actions">
        <a class="button" href="sledeci.html">Pogledaj plan za prvu sedmicu →</a>
        <a class="button secondary" href="projekti.html">Pripremi Dnevnik projekta</a>
      </div>
    </div>`
  : `    <section class="page-top">
      <div>
        <p class="eyebrow">Tok nastave</p>
        <h1>Održano na času.</h1>
        <p class="lede">Hronološki pregled održanih časova, najnoviji na vrhu.</p>
      </div>
    </section>
    ${tok.odrzano.map(c => `<article class="card" style="margin-bottom:1.25rem"><p class="eyebrow">${esc(c.datum)} · Sedmica ${esc(c.sedmica)}</p><h2>${esc(c.naslov)}</h2><p>${esc(c.sazetak)}</p></article>`).join('\n')}`;

// 3. sledeci.html — Sledeći čas i 15-nedeljni plan
const nextBody = `    <section class="page-top">
      <div>
        <p class="eyebrow">Plan nastave · 15 sedmica</p>
        <h1>Sledeći čas i silabus.</h1>
        <p class="lede">Pregled svih 15 nastavnih sedmica prema silabusu predmeta, sa temama, ishodima učenja i kolokvijumskim tačkama.</p>
      </div>
      <div class="thesis">
        <p class="eyebrow">Priprema za početak</p>
        <p>Za prvu sedmicu pripremite radno okruženje, otvorite svoj nedeljni Dnevnik projekta i proučite strukturu zadatka na strani <a href="projekti.html">Projekti</a>.</p>
      </div>
    </section>

    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>Sed.</th><th>Tema predavanja i vežbi</th><th>Sadržaj</th><th>Ishodi</th></tr>
        </thead>
        <tbody>
          ${course.weeks.map(w => `<tr${w.milestone ? ' class="milestone"' : ''}>
            <th scope="row">${String(w.w).padStart(2, '0')}</th>
            <td>${esc(w.title)}</td>
            <td>${esc(w.topics)}</td>
            <td>${esc(w.outcomes)}</td>
          </tr>`).join('\n          ')}
        </tbody>
      </table>
    </div>`;

// 4. literatura.html — Literatura
const litBody = `    <section class="page-top">
      <div>
        <p class="eyebrow">Knjige, propisi i alati</p>
        <h1>Literatura.</h1>
        <p class="lede">Osnovna i dopunska literatura iz silabusa i izvoda predmeta, uz zakonsku regulativu i proverene digitalne resurse.</p>
      </div>
    </section>

    <section class="two-col">
      <div>
        <p class="eyebrow">Obavezna osnova</p>
        <h2>Osnovna literatura</h2>
        <ul class="lit-list">
          ${course.literaturePrimary.map(l => `<li><span class="lit-author">${esc(l.author)}</span> — ${esc(l.title)}. <span class="lit-pub">${esc(l.pub)}</span></li>`).join('\n          ')}
        </ul>
      </div>
      <div>
        <p class="eyebrow">Proširenje i praksa</p>
        <h2>Dopunska literatura i izvori</h2>
        <ul class="lit-list">
          ${course.literatureSecondary.map(l => `<li><span class="lit-author">${esc(l.author)}</span> — ${esc(l.title)}. <span class="lit-pub">${esc(l.pub)}</span></li>`).join('\n          ')}
        </ul>
      </div>
    </section>`;

// 5. projekti.html — Platforma za projekte i predaju
const projectsBody = `    <section class="page-top">
      <div>
        <p class="eyebrow">Platforma za studentske projekte</p>
        <h1>Projekti, faze i predaja.</h1>
        <p class="lede">Jasan tok izrade semestralnog projekta kroz pet kontrolnih tačaka, uputstvo za Dnevnik i javno deljenje radnih faza preko GitHub-a.</p>
        <div class="actions">
          <a class="button accent" href="https://github.com/3esign/${esc(course.slug)}/issues/new?template=predaja.yml">Podeli fazu projekta (GitHub Issue) ↗</a>
          <a class="button secondary" href="https://github.com/3esign/${esc(course.slug)}/issues/new?template=ideja.yml">Predloži temu ili pitanje ↗</a>
        </div>
      </div>
      <div class="thesis">
        <p class="eyebrow">Pravilo privatnosti i zvanične predaje</p>
        <p>Javni GitHub repozitorijum služi za uputstva, otvorenu razmenu projekata i galeriju odobrenih faza. Zvanične ocene i lični kontakti ostaju isključivo na fakultetskoj DL platformi.</p>
      </div>
    </section>

    <section class="two-col">
      <div>
        <p class="eyebrow">Pet faza semestralnog rada</p>
        <h2>Kontrolne tačke projekta</h2>
        <ol class="stage-list">
          ${course.projectStages.map(st => `<li><span class="stage-num">${esc(st.id)}</span><div><h3>${esc(st.name)}</h3><p>${esc(st.desc)}</p></div></li>`).join('\n          ')}
        </ol>
      </div>
      <div class="card card-accent">
        <p class="eyebrow">Lična kontrolna lista studenta</p>
        <h2>Provera pre predaje faze</h2>
        <p class="muted">Stanje ove liste čuva se samo lokalno u vašem pregledaču.</p>
        <ul class="check-list">
          <li><label><input type="checkbox" data-check-id="dnevnik"><span>Nedeljni Dnevnik je dopunjen novim skicama, crtežima ili beleškama.</span></label></li>
          <li><label><input type="checkbox" data-check-id="razmera"><span>Svaki crtež i prilog ima jasnu razmeru, orijentaciju i čitljiv potpis.</span></label></li>
          <li><label><input type="checkbox" data-check-id="izvori"><span>Svi korišćeni tekstovi, podaci i fotografije imaju naveden izvor.</span></label></li>
          <li><label><input type="checkbox" data-check-id="privatnost"><span>U javnom prilogu nema privatnih brojeva telefona, mejlova ni tuđih podataka bez dozvole.</span></label></li>
          <li><label><input type="checkbox" data-check-id="format"><span>Fajlovi su optimizovani za čitanje i štampu (PDF/A3 ili čiste slike bez viška megabajta).</span></label></li>
        </ul>
      </div>
    </section>`;

// 6. oblak.html — Oblak ideja
const cloudBody = `    <section class="page-top">
      <div>
        <p class="eyebrow">Istraživanje i eksperimenti</p>
        <h1>Oblak ideja.</h1>
        <p class="lede">Otvoreni predlozi tema, kratkih radionica i ogleda. Ideje na ovoj strani nisu ispitna obaveza dok ih profesor izričito ne uvede u nastavu.</p>
      </div>
    </section>

    <section class="three-col">
      ${course.ideas.map(i => `<article class="card">
        <span class="tag">${esc(i.tag)}</span>
        <h3>${esc(i.title)}</h3>
        <p>${esc(i.desc)}</p>
      </article>`).join('\n      ')}
    </section>`;

const outputs = [
  ['index.html', shell({ pageId: 'home', title: 'Naslovna', desc: course.subtitleSr, body: indexBody })],
  ['odrzano.html', shell({ pageId: 'held', title: 'Održano', desc: 'Pregled održanih časova i rezultata.', body: heldBody })],
  ['sledeci.html', shell({ pageId: 'next', title: 'Sledeći čas i silabus', desc: '15-nedeljni plan predavanja i vežbi.', body: nextBody })],
  ['literatura.html', shell({ pageId: 'lit', title: 'Literatura', desc: 'Osnovna i dopunska literatura, propisi i alati.', body: litBody })],
  ['projekti.html', shell({ pageId: 'projects', title: 'Projekti i predaja', desc: 'Faze semestralnog projekta, Dnevnik i predaja.', body: projectsBody })],
  ['oblak.html', shell({ pageId: 'cloud', title: 'Oblak ideja', desc: 'Otvoreni predlozi tema i eksperimenata.', body: cloudBody })]
];

for (const [file, html] of outputs) {
  await writeFile(new URL(`../${file}`, import.meta.url), html, 'utf8');
}
console.log(`Built ${outputs.length} pages for ${course.slug}`);
