# Checkpoint — 2026-09-15T18:48:35Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
ae20fa41

## Cosa è stato completato
Unità 43-45: riverificato di persona il settimo giro di ricerca su
Terra (ripristino ambientale progressivo e fideiussione). Il risultato
principale è che Terra copre il dominio in profondità — piano lotti a
sei stati, la prescrizione "recupero ambientale contestuale alla
coltivazione, lotto per lotto" già nell'atto demo (2 occorrenze, non
1 come riportato — unica correzione, il resto confermato),
`divarioRecupero`/`garanziaVincolata`/`attesaCollaudo`/`relazioneLotto`
tutte esistenti. Un solo delta piccolo confermato: nessuna funzione
misurava da quanto un lotto è "esaurito" senza che il recupero sia
partito — la misura che renderebbe visibile una violazione della
contestualità prescritta.

Implementata `attesaRecupero(lotto, oggi)`, il gemello strutturale di
`attesaCollaudo` per la transizione precedente (esaurito→recupero
iniziato), ma più semplice: uno stato "esaurito" ha per costruzione
`recuperoIniziatoIl` vuoto (il passaggio a "in-recupero" avviene
proprio quando il recupero parte), quindi niente ramo "già iniziato"
come nel collaudo. Usa `esauritoIl`, già scritto sul lotto e già
sommato da `divarioRecupero`. Nessun termine di legge inventato: solo
"da quanto si aspetta", come la sorella. Wired nella riga del lotto,
stesso punto di `attesaCollaudo` (form-hint).

Chiusa anche una verifica visiva su Terra (contrasto e fuori-schermo)
dato il tocco diretto a `index.html`, per lo stesso motivo delle
verifiche fatte oggi su Flotta/Campo/Scudo.

Con questa il conto delle ricerche riverificate di persona oggi sale a
11 su 11 (10 confermate as-is o con correzione minore, 1 — la
mancanza n. 2 di Flotta — corretta prima di tradurla in codice).

## Verifica
- `run-kpi.mjs`: 3031 passati, 0 falliti (era 3028)
- `run-stile.mjs`: 328 passati, 0 falliti
- Controprova su `attesaRecupero`: tolto il guardiano sullo stato
  "esaurito", la prova sulla pertinenza cade; ripristinato
  byte-identico
- `sintassi-pagine.mjs`: 34 passati, 0 falliti
- `copertura-funzioni.mjs`: 0 funzioni scoperte (1015/1015)
- Giro isolato su worktree (`giro-node.mjs`, sesto lancio della
  sessione): 39/40 comandi a posto — l'unico caduto è il doc-cascade
  check, atteso. Misura reale "asserzioni eseguite dal giro": **3.938**
- `numeri-nei-documenti.mjs`: 43 passati, 0 falliti dopo la correzione
  finale della cascata
- `contrasto.mjs --solo=terra`: 646 testi misurati, 0 sotto soglia
- `fuori-schermo.mjs --solo=terra`: 3 schermate pulite, 1281 elementi
  guardati, 0 fuori posto
- Push riuscito al primo tentativo: `ab29d492..ae20fa41`

## Stato roadmap
Terra: il delta sul ripristino progressivo è chiuso, senza voci
gated — era un'aggiunta puramente informativa, nessuna soglia di
legge inventata. Con questa unità sono state completate sei ricerche
tradotte in codice oggi (Genesi verificato ×3, Flotta ×2, Campo ×2,
Scudo, Terra) e tre in decisioni scritte (Flotta soglia sostituzione,
Conti pesate nel fido, Sentinella meteo).

## Prossimo passo atomico
Il ciclo prosegue senza fermarsi. Nessuna ricerca in background in
corso in questo momento. Con undici ricerche riverificate oggi e sette
unità di codice completate su sei app diverse più il core della
disciplina di ricerca, le strade aperte:
1. Lanciare una nuova ricerca in background — tutte le sei app
   verticali hanno avuto un giro nuovo oggi tranne Conti (che ne ha
   avuto uno, il quarto, più vecchio delle altre); si può ripartire
   dalla app con il documento di ricerca più vecchio in assoluto o
   scegliere un tema trasversale (RICERCA_CONTINUA_MESTIERE/ASSENZA/
   PAROLE/NORME, fermi al 04/09).
2. Riprendere la scomposizione già avviata su Terra (sezioni
   trasversali) o Genesi (burden nel pannello foro) con la cura di un
   pattern UI nuovo, se c'è tempo.
3. Seconda iterazione UX/qualità su Deepwork ID o il core, non
   toccati da codice oggi.
Il ciclo continua senza fermarsi (regola del fondatore, mai in pausa).
