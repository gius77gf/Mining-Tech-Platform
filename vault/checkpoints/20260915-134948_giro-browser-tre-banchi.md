# Checkpoint — 2026-09-15T13:49:48Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
880d4e1b

## Cosa è stato completato
Sedicesima unità del ciclo odierno: prima verifica a livello di rendering
(browser, non solo `node`) di tutte le unità di oggi. Lanciato un giro
mirato (`tutti.mjs --solo=campo,conti,flotta,terra --limite=1800`), letto
correttamente con `leggi-giro.mjs` invece del grezzo `grep "^  KO"` (che dava
485 righe fuorvianti): **150 passate lette, 544 KO voluti dalle controprove
correttamente esclusi, 12 KO veri** in soli 3 banchi.

Investigati tutti e 12: **nessuno era un difetto del prodotto**. Tutti e tre
i banchi erano invecchiati per funzionalità/dati di demo migliorati DOPO
essere stati scritti — famiglia già documentata più volte in CLAUDE.md
("un banco che porta dentro un numero atteso invecchia col crescere della
dimostrazione"):

1. `flotta-ponte-conti.mjs`: atteso "640 € in Conti" non tornava più — la
   demo di Conti ha guadagnato una spesa da 200 € collegata a un ordine di
   Flotta (`c90`, "Rotazione gomme", `ordineFlotta.id: "n2"`), vero totale
   840 €. Corretto il numero atteso.
2. `conti-barre-peso.mjs`: pretendeva sempre almeno una fascia "a zero €"
   nell'aging-list da confrontare coi 12 € veri — ma ora tutte e sei le
   fasce hanno un importo vero (anche "Senza scadenza", riempita dal fix
   `069d70e`). Reso il confronto diretto opzionale (si dichiara quando non
   c'è una fascia a zero, non fallisce più): la domanda sistemica "lo zero
   si disegna zero" resta comunque coperta dalla sezione 2 dello stesso
   banco (8 righe a zero su tutte le liste).
3. `conti-rimanenze.mjs`: quattro assert non conoscevano l'estensione
   "valore al costo + minore fra costo/listino per il bilancio" (11/09,
   `rimanenzeBilancio`, art. 2426 c.c.) — header CSV, corpo righe, testo
   piede e toast tutti nella forma vecchia. Aggiornati con i valori VERI
   stampati dalla pagina (8,62 €/m³, criteri costo/listino), non
   ricalcolati a mano.

Nessuna modifica al codice di prodotto: solo ai tre file di test.

## Verifica
- Ogni fix verificato individualmente: banco eseguito da solo → 0 KO, poi
  rieseguito con `--controprova` → conferma che sa ancora fallire su un
  difetto vero reiniettato (conti-rimanenze: 26/34 cadono; conti-barre-peso:
  3 collisioni rilevate; flotta-ponte-conti: 3/10 cadono su "Conti assente")
- `run-kpi.mjs`: 3011 passati, 0 falliti
- `run-stile.mjs`: 328 passati, 0 falliti
- `git status --short` prima del commit: solo i 3 file di test modificati,
  nessun file di prodotto toccato
- Push riuscito al primo tentativo: `1d8ab600..880d4e1b`

## Stato roadmap
Vedi `vault/ROADMAP_SETTIMANA.md`. Restano aperti nell'ottavo giro di
ricerca su Scudo: finding 1 (scadenza/documento INAIL — tre termini
diversi, chiede una scelta), finding 2 (terzo gradino di gravità, tocca
anche il rischio latente UNI 7249) e finding 4 (stato aperto/chiuso più
visita di rientro dopo 60 giorni — ora sbloccato dal `lavoratoreId`
aggiunto nell'unità precedente). Conti Finding 2 (scoring cliente) resta
riservato a una decisione del fondatore in `docs/DECISIONI_WEEKEND.md`,
non va implementato senza di essa.

## Prossimo passo atomico
Implementare Scudo Finding 4 (dall'ottavo giro di ricerca, secondo
passaggio su infortuni/INAIL): aggiungere un campo `stato`
(aperto/chiuso) all'infortunio registrato, con la regola che un
infortunio con prognosi ancora aperta (`giorniAssenza == null`) resta
"aperto", e un promemoria per la visita medica di rientro obbligatoria
(art. 41 c.2 lett. e-ter) quando l'assenza dichiarata supera 60 giorni.
Passare da `cartellaLavoratore`/`fogliaCartella` (già estesi in questa
sessione con `suoiInfortuni`) e verificare dove il prodotto mostra già
scadenze/promemoria (`scadenzeImminenti` o analogo) per riusare lo stesso
schema invece di inventarne uno nuovo. Ciclo continua senza fermarsi
(regola del fondatore, mai in pausa).
