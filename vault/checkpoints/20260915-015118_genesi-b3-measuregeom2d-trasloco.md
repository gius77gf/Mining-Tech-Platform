# Checkpoint — 2026-09-15T01:51:18Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
aa60b0d6 (pushato)

## Cosa è stato completato

Estratta `measureGeom2D()` da `apps/genesi/genesi.html`: componeva SOLO
`misuraGeom2D(D2.holes, D2.S, D2.B)`, già pura dal blocco G35 (13/09).
A differenza delle unità precedenti, qui è stato aggiunto un piccolo
wrapper nel modulo — `export function measureGeom2D(design){ return
misuraGeom2D(design.holes, design.S, design.B); }` — invece di
inlineare la chiamata a `misuraGeom2D` nei sette punti di chiamata
(come fatto per `crestZ`): con sette siti, tenere il nome corto evita
di ripetere tre campi ovunque, stesso schema già usato per
`computeInnesco2D`.

Verifica standard rispettata:
- Cercato "measureGeom2D" in `run-kpi.mjs` PRIMA di toccare nulla: DUE
  pinned test da correggere, non uno solo — un dettaglio che poteva
  sfuggire:
  1. Un test isolava il corpo di `misuraGeom2D` con
     `srcGD35.slice(i)` fino alla **fine del file**, perché era
     l'ultima funzione del modulo. Aggiungendo `measureGeom2D` subito
     dopo, quel test ha smesso di essere vero (non è più l'ultima) e
     ha iniziato a fallire per un motivo sottile: il commento appena
     scritto sopra il nuovo export conteneva la stringa letterale
     `D2.holes, D2.S, D2.B` in prosa, catturata dallo slice e dal
     controllo "la funzione pura non legge `D2`" — la stessa trappola
     già presa su `_sigDetTimes` questo stesso ciclo, qui nel posto
     dove nessuno se l'aspettava (un test PRE-ESISTENTE, non uno
     nuovo). Corretto in due modi: lo slice ora si ferma alla
     dichiarazione di `measureGeom2D` invece che a fine file, e il
     commento del modulo è stato riscritto senza la stringa `D2.`
     letterale (usa "stato del progetto" in prosa, e il parametro si
     chiama `design` non `D2`, come già `tempiDetonazione`).
  2. Il nuovo test dedicato che stavo scrivendo (`v.measureGeom2D`) è
     stato inserito per errore dentro un test più vecchio basato su
     `CODICE_G`/`quante` (niente `v` in scope lì) invece che dentro il
     blocco `{ const v = await app("genesi", ...); ... }` a cui
     appartiene — errore di posizionamento, non di logica: "v is not
     defined". Spostato nel punto giusto, subito dopo l'ultimo test
     che già usava `v` in quel blocco.
- Nuova prova dedicata, verificata contro un difetto iniettato reale
  (scambio S/B nel composer): **uno scambio S/B è invisibile per i
  casi CON fori** (la spaziatura si ricalcola dalle posizioni, il
  ripiego non entra mai in gioco) — stessa trappola già presa su
  `_spazTipico`/`computeInnesco2D`. Il caso genuinamente sensibile è
  SENZA fori, dove `misuraGeom2D` ripiega direttamente sui due campi:
  usato quello nel test, verificato che lo scambio venga catturato
  prima di fidarsene.
- Fondo di copertura di `genesi-data.js` alzato 167→168.
- Bucket-shift misurato con `git stash`/`stash pop` +
  `genesi-estraibili.mjs --elenco`: 138→137 funzioni, "1-2" 41→40,
  estraibili 49→48. Nessuno spostamento collaterale per altre
  funzioni (come `crestZ`, a differenza di `mdlProfSnap`): i sette
  chiamanti leggevano già abbastanza altre variabili di modulo.
- Cascata documenti: 3.464 prove (nove suite), `genesi-data.js`
  168/168, condivisi 332/332, Genesi 137 funzioni / 48 estraibili.
- `numeri-nei-documenti.mjs`: 43 passati, 0 falliti.
- `sintassi-pagine.mjs`: 34/34.
- Giro isolato su worktree dedicata (`/tmp/wt-b3-measuregeom`,
  `run_in_background: true` + `TaskOutput`): **40 comandi a posto, 0
  caduti**, 3.929 asserzioni (era 3.928: +1 per la prova nuova) — il
  giro stesso ha segnalato la divergenza fra documento e uscita vera,
  corretta subito dopo (non prima, per non scrivere un numero
  indovinato).

## Lezione di questa unità

Le due sviste (il test che isolava fino a fine file, il test nuovo
piazzato nel blocco sbagliato) sono state prese ENTRAMBE dal primo
lancio di `run-kpi.mjs` dopo l'edit, prima di qualsiasi commit o
worktree — cioè esattamente dove questa casa vuole che vengano prese.
Nessuna delle due è arrivata al giro isolato. Conferma che "cercare il
nome PRIMA di toccare nulla" da solo non basta quando il nome cercato
compare anche in un test che non lo chiama per nome esplicito (qui: un
test che isola un intervallo di testo con `indexOf`/`slice`, non con
un pattern sul nome della funzione) — vale la pena, dopo aver cercato
il nome, anche leggere una volta il file per intero nella zona
toccata e chiedersi «qualche altro test assume che questa fosse
l'ULTIMA funzione, o l'UNICA in un certo intervallo?».

## Stato roadmap

B3 in corso. Storia append-only aggiornata in `docs/DEVELOPMENT.md` e
`apps/deepwork-id/tests/copertura-funzioni.mjs`.

## Prossimo passo atomico

Il bucket "1-2" (40 funzioni) resta composto quasi interamente da
funzioni DOM/ambiente (escluse per costruzione dal conto estraibili)
più:

⛔ **`computeMIC` — NON toccare** (legame di sicurezza deliberato,
vedi checkpoint precedenti).

Candidati piccoli rimasti da valutare uno per uno (misurare prima di
assumere): `riconStorico` (legge `GDB`, probabilmente solo un alias
di I/O senza logica propria — verificare se vale la pena spostarla o
se è come `sitoStore`, non estraibile per mancanza di contenuto),
`d2Up` (setter di stato locale, probabilmente non un vero candidato),
`sitoStore` (alias trivale, probabilmente non un vero candidato).

Restano deferred per il costo misurato: `interpFronte` (16 punti di
chiamata) e il gruppo `selRoccia`/`selEsplosivo`/`selInnesco` (46
punti di chiamata, 10 pinned test in 5 blocchi indipendenti).

Con i candidati piccoli quasi esauriti, dopo aver verificato
`riconStorico`/`d2Up`/`sitoStore` (probabilmente NON estraibili),
vale la pena valutare seriamente il fallback generico della roadmap:
il prossimo ponte in `docs/MAPPA_ECOSISTEMA.md`, o una passata in
profondità su un'altra app verticale.

Nessuno stop volontario: si prosegue subito.
