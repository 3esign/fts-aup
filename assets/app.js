// Zero-dependency progressive enhancement: SR/EN toggle + local checklist memory.
const STRINGS = {
  sr: {
    langBtn: 'English',
    nav: ['Naslovna', 'Održano', 'Sledeći čas', 'Literatura', 'Projekti', 'Oblak ideja'],
    courseTitle: "Arhitektura Unutrašnjih Prostora",
    courseLevel: "Diplomski studij (II ciklus) · II godina · III semestar · 7 ECTS · 2P+1V+2S (189 sati)",
    profLabel: 'Profesor: doc. dr Semir Poturak',
    instLabel: 'Univerzitet u Travniku · Fakultet za tehničke studije (FTS)'
  },
  en: {
    langBtn: 'Srpski',
    nav: ['Home', 'Held classes', 'Next class', 'Literature', 'Projects', 'Idea cloud'],
    courseTitle: "Interior Architecture",
    courseLevel: "Graduate (Cycle II) · Year 2 · Semester 3 · 7 ECTS · 2L+1E+2S (189 hours)",
    profLabel: 'Professor: Assoc. Prof. Dr. Semir Poturak',
    instLabel: 'University of Travnik · Faculty of Technical Studies (FTS)'
  }
};

function applyLang(lang) {
  const s = STRINGS[lang] || STRINGS.sr;
  document.documentElement.lang = lang === 'en' ? 'en' : 'sr-Latn';
  const btn = document.getElementById('lang-toggle');
  if (btn) {
    btn.textContent = s.langBtn;
    btn.setAttribute('data-lang', lang);
  }
  const navLinks = document.querySelectorAll('.main-nav a');
  navLinks.forEach((a, i) => { if (s.nav[i]) a.textContent = s.nav[i]; });
  const titleEl = document.getElementById('band-title');
  const levelEl = document.getElementById('band-level');
  const instEl = document.getElementById('band-inst');
  const profEl = document.getElementById('footer-prof');
  if (titleEl) titleEl.textContent = s.courseTitle;
  if (levelEl) levelEl.textContent = s.courseLevel;
  if (instEl) instEl.textContent = s.instLabel;
  if (profEl) profEl.textContent = s.profLabel;
  try { localStorage.setItem('fts-aup:lang', lang); } catch {}
}

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('lang-toggle');
  if (btn) {
    btn.hidden = false;
    let saved = 'sr';
    try { saved = localStorage.getItem('fts-aup:lang') || 'sr'; } catch {}
    if (saved !== 'sr') applyLang(saved);
    btn.addEventListener('click', () => {
      const next = (btn.getAttribute('data-lang') || 'sr') === 'sr' ? 'en' : 'sr';
      applyLang(next);
    });
  }

  // Persistent student self-checklist on projekti.html
  document.querySelectorAll('input[data-check-id]').forEach(box => {
    const key = 'fts-aup:check:' + box.getAttribute('data-check-id');
    try { box.checked = localStorage.getItem(key) === '1'; } catch {}
    box.addEventListener('change', () => {
      try { localStorage.setItem(key, box.checked ? '1' : '0'); } catch {}
    });
  });
});
