# Checkpoint — 2026-09-15T19:33:57Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
d4ef3e2d

## Cosa è stato completato
Unità 51-52: riverificato di persona il nono giro di ricerca su Conti
(trasporto conto terzi e rese). Confermato che il vettore terzo è già
modellato sul DDT e la resa NON è indifferenziata (causale "resa"
comma 2 senza termine, distinta da "errore" comma 3 a dodici mesi, già
applicata in `validaNota`) — nessuna mancanza vera su quei due punti.
Due mancanze piccole confermate: il registro vendite CSV non porta la
colonna causale pur essendo già scritta su ogni nota; nessun
aggregatore per causale per un KPI tipo "quanti resi questo mese"
(quest'ultima non presa: è un KPI nuovo, non un dato mancante).

Implementata la fetta sicura: `registroVendite` ora porta `causale`
su ogni riga (vuota per le fatture, l'etichetta di `CAUSALI_NOTA` per
le note, stesso vocabolario di `validaNota` — nessuna copia debole),
e il CSV ha una colonna finale in più. Nessun codice UI toccato: solo
il modulo dati e l'export, quindi nessuna verifica visiva necessaria
per questa unità.

Con questa il conto delle ricerche riverificate di persona oggi sale a
tredici su tredici.

## Verifica
- `run-kpi.mjs`: 3032 passati, 0 falliti (era 3031)
- `run-stile.mjs`: 328 passati, 0 falliti
- Controprova su `registroVendite`: tolta la causale dalla chiamata
  `doc()` per le note, la prova nuova cade; ripristinato byte-identico
- `documenti-dimostrazione.mjs`: 5 passati, 0 falliti, 142/142
  documenti, nessun undefined/NaN/null
- `copertura-funzioni.mjs`: 0 funzioni scoperte (1015/1015)
- Giro isolato su worktree (ottavo lancio della sessione): 39/40
  comandi a posto — l'unico caduto è il doc-cascade check, atteso.
  Misura reale "asserzioni eseguite dal giro": **3.939** (era 3.981
  nell'unità precedente — variazione reale del conto fra i comandi
  che contribuiscono una riga da sommare, non un errore: il documento
  lo dichiara invece di far finta che sia stabile)
- `numeri-nei-documenti.mjs`: 43 passati, 0 falliti dopo la correzione
  finale della cascata
- Push riuscito al primo tentativo: `8b466836..d4ef3e2d`

## Stato roadmap
Conti: il delta sul trasporto conto terzi/rese è chiuso per la parte
sicura (causale nel registro). L'aggregatore per causale (KPI "quanti
resi") resta come candidato futuro, non gated da una decisione ma da
tempo/priorità.

## Prossimo passo atomico
Il ciclo prosegue senza fermarsi. Nessuna ricerca in background in
corso in questo momento. Con tredici ricerche riverificate oggi e
nove unità di codice completate su sei app diverse (tutte e sei le
app verticali toccate oggi, più una sezione strutturale della mappa),
le strade aperte:
1. Lanciare una nuova ricerca su un tema trasversale ancora fermo al
   04/09 (ASSENZA, PAROLE) — tutte le sei app verticali hanno avuto
   almeno un giro di ricerca per-app oggi, quindi la rotazione naturale
   ora è sui temi trasversali o un secondo passaggio più approfondito
   su un'app già coperta.
2. Seconda iterazione UX/qualità su Deepwork ID o il core — non
   toccati da codice oggi, ma richiedono l'emulatore Firestore per
   una verifica completa (comandi in CLAUDE.md, sezione "REGOLE DI
   SICUREZZA FIRESTORE").
3. Riprendere la scomposizione già avviata su Terra (sezioni
   trasversali, dichiarata "non ancora conveniente da sola") o Genesi
   (burden nel pannello foro, dichiarato "medio, non preso").
Il ciclo continua senza fermarsi (regola del fondatore, mai in pausa).
