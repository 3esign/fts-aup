# Arhitektura Unutrašnjih Prostora (04.143-M)

**Univerzitet u Travniku · Fakultet za tehničke studije (FTS)**  
**Profesor:** doc. dr Semir Poturak  
**Nivo:** Diplomski studij (II ciklus) · II godina · III semestar · 7 ECTS · 2P+1V+2S (189 sati)  
**GitHub Pages (planirana adresa):** `https://3esign.github.io/fts-aup/`

## Šta se nalazi u repozitorijumu

- **Uputstva i silabus za studente** (`index.html`, `sledeci.html`, `literatura.html`) — 15 nastavnih sedmica, ishodi učenja, bodovanje i literatura.
- **Tok nastave** (`odrzano.html`, `data/tok.json`) — hronološka evidencija održanih časova.
- **Platforma za projekte** (`projekti.html`, `.github/ISSUE_TEMPLATE/`) — pet faza semestralnog rada, lokalna kontrolna lista studenta i šabloni za javno deljenje faza projekta i predloga tema.
- **Oblak ideja** (`oblak.html`) — otvorene istraživačke teme odvojene od obaveznog gradiva.

## Razvoj i provera bez spoljnih zavisnosti

```bash
npm run build   # regeneriše sve HTML strane iz data/course.json i data/tok.json
npm test        # pokreće fabričku kapiju čistoće (cistoca.test.mjs) i proveru strukture/linkova
```

## Pravila privatnosti

Ocene, privatni mejlovi i brojevi telefona nikada ne ulaze u ovaj repozitorijum. Svaka objava prolazi `npm test`.
