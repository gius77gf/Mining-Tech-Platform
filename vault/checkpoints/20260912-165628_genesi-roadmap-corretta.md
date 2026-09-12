# Checkpoint — 2026-09-12T16:56:28Z

## Tipo
correzione documentale (nessun codice toccato), app singola

## App
Genesi (direttiva del fondatore ancora in vigore: solo Genesi)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`f0f7cdbf`

## Completato

Il "prossimo passo atomico" del checkpoint 127 era **sbagliato**: proponeva
di costruire "P0.2 Signature-hole (superposizione d'onda)" come funzione
nuova, seguendo `docs/GENESI_ROADMAP_COMPETITOR.md`. Prima di scrivere
codice ho cercato (`grep -n "sommaRitardata\|ondaDaCsv"
apps/genesi/genesi-data.js`) — regola di CLAUDE.md "la risposta è quasi
sempre già in casa" — e ho trovato la funzione **già scritta, testata (2
test, 40 asserzioni in `run-kpi.mjs`) e wired in pagina**
(`sigFile`/`sigImport`/`sigRender`).

Controllando per lo stesso motivo gli altri gap dichiarati dallo stesso
documento (datato 21/07, mai riverificato nel codice da allora):
- **P0.1 (riconciliazione previsto-vs-reale, foro per foro)**: già fatta.
  `confrontoPerForo` + un pannello vero in pagina ("Foro per foro —
  progetto aperto contro consuntivo").
- **P1.1 (burden reale dal 3D del fronte)**: già fatta. `distanzaDaSpezzata`
  + `h.burdenVero`, con segnalazione in pagina (rosso/ambra) quando si
  scosta dal nominale oltre 15 cm.
- Trovata anche una riga falsa indipendente: "import MWD" fra i punti di
  forza — cercato (`grep -n "MWD" apps/genesi/*.{html,js}`), zero
  occorrenze, mai verificata dal 21/07.

**Tre "gap" su sei del documento erano già chiusi**, e la sua Sintesi
chiamava ancora la riconciliazione "il gap più grande". Il documento è
stato riscritto (non solo annotato) per riflettere lo stato vero, con la
cronologia della correzione dichiarata in testa e nei punti toccati —
compreso un mio primo errore nella stessa correzione (avevo scritto "26
prove" per il signature-hole contando a mente invece che con `grep -c`;
il numero vero, contato, è 2 test/40 asserzioni — corretto prima di
committare).

Nessun file di codice toccato in questa unità. Nessuna verifica
`giro-node.mjs` necessaria (regola: solo per modifiche al codice/test);
verificato invece che `numeri-nei-documenti.mjs` (43/43) e `run-stile.mjs`
(328/328) restassero verdi, per escludere effetti collaterali.

## Stato roadmap

Nessuna voce nuova aperta: questa unità **chiude** un errore nel
"prossimo passo" proposto dal checkpoint precedente, senza sostituirlo
con una feature nuova propria — vedi sotto.

## Blocchi e limiti noti

Nessuno nuovo.

## Prossimo passo atomico

Il gap vero rimasto in Genesi, secondo `docs/GENESI_ROADMAP_COMPETITOR.md`
ora corretto, è **P2.1 — frammentazione da immagine del muckpile** (foto
del cumulo → curva granulometrica reale, confronto con Kuz-Ram/KCO):
è "pesante" (richiede segmentazione/ML per la versione precisa), quindi
prima di aprirlo si valuta una versione base realizzabile nel browser
(es. watershed/soglia su un istogramma di bordi, senza backend) e si
scrive un piano prima del codice. In alternativa, più piccolo e più
sicuro come prossima unità: **P1.1 residuo — import deviazione fori
"as-drilled" (boretrack)**, che completerebbe la simulazione di
deviazione già esistente con un dato reale importato da CSV, sul modello
già rodato di `ondaDaCsv`/`leggiCsv`. Prima di iniziare uno dei due:
rileggere `docs/GENESI_FRAMMENTAZIONE_DA_FOTO.md` (esiste già una ricerca
dedicata, da controllare con lo stesso metodo — grep nel codice — prima
di fidarsi delle sue conclusioni).
