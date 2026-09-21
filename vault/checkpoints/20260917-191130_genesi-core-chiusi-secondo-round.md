# Checkpoint — 2026-09-17T19:11:30Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
b82130ac

## Cosa è stato completato
Chiuso il secondo round della "passata in profondità" su Genesi e sul core
(index.html), completando così tutte le sei app più il core. Stesso metodo
dei round precedenti: Agent in background, ogni finding riverificato dal vivo
con Playwright prima di correggere.

**Core** (commit `decf1c9c`) — 2 finding, entrambi corretti:
1. Ogni PDF stampato dal core (rapportino, rapportino fochino, modulo vuoto,
   report tecnico, schema di volata) scriveva in piè di pagina "Deepwork per
   Cofa Mineraria" — un nome inventato, mai in nessun dato demo, avanzo di
   sviluppo mai parametrizzato. In un ecosistema esplicitamente venduto ad
   aziende concorrenti, ogni cliente stampava un documento con il nome
   sbagliato. Due delle cinque funzioni avevano già, tre righe più sotto, un
   piè di pagina generico corretto: tolta la riga duplicata sbagliata. Le
   altre tre non avevano un gemello corretto: sostituite con lo stesso
   principio (nessun nome di cliente inventato), coerente con due funzioni
   più recenti dello stesso file che già non ne stampavano uno. Verificato
   generando un vero PDF (jsPDF via jsdelivr, serve `--ignore-certificate-
   errors` sul browser Playwright in questo ambiente, altrimenti la libreria
   non si scarica per via del proxy): "Generato da Deepwork" su ogni pagina,
   "Cofa" sparito dal file e dal sorgente.
2. Le schede "Gestione mezzo" (Lavori/Consumi/Riparazioni) mostravano alcuni
   numeri decimali col punto inglese invece della virgola italiana ("0.5 h",
   "104.0 L", "€280.00"), anche nel report tecnico PDF che li duplica.
   Passati tutti da `perLettura`, come il resto dell'app. Verificato dal
   vivo su tre schermate (mezzo strada, mezzo lavoro, tab consumi).

**Genesi** (commit `b82130ac`) — 1 finding, corretto:
L'import di un `.volata.json` (bottone "Importa", schermata 3D) leggeva la
geometria del file (`v.geometria.spalla_m`/`interasse_m`) in una variabile
mai più riusata, e non scriveva mai `SPALLA`/`INTERASSE`: un file che
dichiara una maglia diversa importava fori disposti sulla maglia rimasta in
memoria da PRIMA, e il pannello "NUOVA VOLATA" la mostrava come se fosse
quella importata, senza nessun avviso — a cascata Powder Factor e curva di
frammentazione calcolati sulla maglia sbagliata. Stessa sorte per il
diametro foro. Riprodotto in due modi (file di esempio del repository, e un
giro di andata e ritorno completo: progetta 6×7, esporta, ricarica la
pagina, reimporta lo stesso file) prima di correggere con lo stesso
`valoreCampo` già usato per profondità e carica. Aggiunta una sezione
permanente a `apps/deepwork-id/tests/browser/genesi-documenti-che-escono.mjs`
(giro di andata e ritorno della geometria, 3 iniezioni nuove, controprova
verificata: 2 KO col difetto rimesso).

## Stato roadmap
Deep-pass completata su tutte e sei le app (Terra/Flotta/Campo nel primo
round, Conti/Scudo/Sentinella nel secondo, Genesi e il core in questo
blocco). Nessuna superficie resta scoperta da questo censimento.

## Prossimo passo atomico
Per la routine del ciclo (fase aperta dal fondatore il 26/08, due binari):
1. `docs/MAPPA_ECOSISTEMA.md` §1/§6: cercare una sovrapposizione fra le 56
   direzioni NON ancora censita come ponte (l'ultimo censimento diceva
   "sovrapposizioni non collegate: 0" — quindi probabilmente serve prima
   CENSIRE una sovrapposizione nuova, non costruirne una già nota).
2. In alternativa: una SECONDA iterazione della passata in profondità (con
   la deep-pass ora completa su tutte le superfici una volta, una seconda
   passata più mirata su un'area specifica può trovare ciò che la prima ha
   guardato di sfuggita).
3. Le due proposte minori dalla ricerca continua su Campo (17/09, settimo
   giro: campo-fase nel rapportino, distinzione sterile/commerciale) restano
   in `docs/RICERCA_CONTINUA_CAMPO.md`, non ancora implementate — da
   valutare come piccola unità futura se non emerge altro di più urgente.
4. Nota di metodo aperta: il totale "asserzioni eseguite dal giro" (non le 9
   suite di `numeri-nei-documenti.mjs`) è risultato STABILE (4092 su tre
   lanci consecutivi a codice invariato) quando confrontato correttamente —
   l'apparente instabilità notata nel checkpoint precedente era un artefatto
   di doc stale confrontata fra commit diversi, non vera nondeterminismo.
   Chiuso, nessun'azione ulteriore necessaria.

## Blocchi
Nessuno.
