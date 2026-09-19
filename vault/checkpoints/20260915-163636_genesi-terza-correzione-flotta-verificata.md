# Checkpoint — 2026-09-15T16:36:36Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
68aa9dff

## Cosa è stato completato
Due unità di ricerca/documentazione, entrambe senza toccare codice.

**Unità 29 — terza correzione a `docs/RICERCA_CONTINUA_GENESI.md`.**
Prima di scrivere codice per il delta trovato nella seconda correzione
(burden nel pannello `holeInfoShow`), seguita la catena dati vera:
`h.burdenLoc` esiste ed è popolato sempre (`computeSeq2D` →
`computeEnergia2D` → `energiaSuMaglia`, incondizionata), ma vive in
`D2.holes`. Il pannello legge invece `g.userData.f`, che viene da
`SIM.fori` — un array ricostruito da zero in `buildSim()`
(genesi.html:1791) da un TERZO stato `P.holes`, con un letterale che
copia solo `{i, id, x, tDet, prof, h, cz, zoff, kg}`, senza
`burdenLoc`. "Due righe" (seconda correzione) era ottimista: il
cantiere vero tocca la ricostruzione della scena 3D e riconcilia tre
stati (P, D2, SIM) — è "medio", non preso per costruzione oggi.

**Unità 30 — riverifica indipendente del settimo giro di ricerca su
Flotta** (arrivato via subagent handback, TCO e decisione di
sostituzione mezzi). Per la regola "niente entra sulla parola
dell'agente": rilanciato il grep citato
(`possessoDal|costoPossessoAnnuo|messaInServizio` in
`apps/flotta/flotta-data.js`) e confermato che le tre righe di uscita
combaciano esattamente; verificato inoltre che `etaMezziAnni`,
`tcoMezzo` e `meritoDiSostituzione` NON esistono nel modulo (zero
`grep -n "^export function"` per tutt'e tre) — il delta è genuino, non
un falso "non c'è". Committato il giro di ricerca (append, mai
sovrascritto), nessun codice toccato.

Con questa il conto delle ricerche riverificate di persona oggi sale a
5 su 5 (Genesi ×3, Sentinella, Terra, Flotta — quest'ultima confermata
vera, le altre quattro contenevano almeno una correzione).

## Verifica
- `numeri-nei-documenti.mjs`: 43 passati, 0 falliti (solo documenti,
  nessun codice toccato in nessuna delle due unità)
- Grep di riverifica su Flotta: righe di output identiche a quelle
  citate dall'agente; tre funzioni proposte come mancanti confermate
  assenti
- Push riuscito al primo tentativo su entrambi i commit:
  `70bea48c..3f20b29f` e `3f20b29f..68aa9dff`

## Stato roadmap
G9 di Genesi: proposta 3 (annotazione) ha ora tutt'e tre le correzioni
scritte in coda al documento di ricerca — il pannello esiste, il delta
(burden/PPV) è reale ma "medio", non preso oggi. Flotta ha un settimo
giro di ricerca verificato e pronto per essere tradotto in unità
concreta quando si arriva al punto 2 della sequenza "se la roadmap
sembra finita" (rimandati/raccomandazioni ricerca).

## Prossimo passo atomico
Il ciclo prosegue senza fermarsi. Prossima unità: tradurre il settimo
giro di ricerca di Flotta in una prima fetta concreta, applicando la
lezione di oggi ("scomposizione prima di scrivere codice", già usata
per Terra e Genesi) — partire da UNA funzione pura piccola e testabile
piuttosto che le quattro insieme:
1. `etaMezziAnni(possessoDal|messaInServizio, oggi)` — la più semplice
   delle quattro proposte, zero dipendenze da altri dati, testabile in
   isolamento in `run-kpi.mjs`.
2. Prima di scriverla: leggere `fascicoloMezzo` in `apps/flotta/
   index.html` per capire dove mostrarla senza rompere la struttura
   esistente (regola dello stile vincolante: struttura identica al
   core).
3. Se il tempo lo consente nella stessa unità, `costoOrarioMezzo`
   esteso con l'ammortamento — ma solo dopo aver verificato chi altro
   lo chiama (la regola della "firma allargata a metà": tutti i
   chiamanti vanno cercati, non solo il punto che si sta correggendo).
Se questa unità si esaurisce prima, la prossima riparte da qui senza
bisogno di rileggere altro. Il ciclo continua senza fermarsi (regola
del fondatore, mai in pausa).
