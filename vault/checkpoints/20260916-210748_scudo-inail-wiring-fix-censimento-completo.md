# Checkpoint — 2026-09-16T21:07:48Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
30607674

## Cosa è stato completato
Censimento a doppio punto di chiamata completato su tutte e sei le app in
questa sessione (Campo, Terra, Conti, Sentinella, Flotta, Scudo). Su Scudo,
**quinto difetto vero trovato con lo stesso metodo nello stesso giorno**,
ma di forma diversa dagli altri quattro — verificato personalmente riga per
riga (parser, entrambi gli scrittori, il consumatore) prima di agire.

Trovato: `csvRegistroInfortuni` scrive già `dataCertificato`/`denunciaData`/
`denunciaNumero` (la denuncia INAIL, aggiunta lo stesso 16/09 al
salvataggio manuale) **dentro alla settima colonna** come frase per l'RSPP,
non come dati. `parseInfortuniCsv` non li rileggeva mai come dati:
dichiarava esplicitamente («non un dato che rientra») che la settima
colonna resta annotazione. Un registro esportato e ri-caricato perdeva
quindi la denuncia già presentata, tornando a proporla come pendente o
SCADUTA — e senza nessuna modale per correggere questi tre campi dopo la
registrazione, l'unico rimedio sarebbe stato cancellare l'evento e
ricrearlo, su un registro pensato di sola aggiunta.

**Differenza onestamente dichiarata dagli altri quattro**: lì un lettore
CSV aveva già parsato il campo sull'oggetto riga, e una sola chiamata fra
due lo scartava (bug di wiring). Qui il gap era nel lettore stesso — non
leggeva affatto le tre colonne — quindi il fix non ha toccato
`index.html`: la pagina passa già l'intero oggetto riletto a `db.aggiungi`.

Corretto: ottava, nona, decima colonna in coda. `dataCertificato`/
`denunciaData` validate con `dataISOEsiste` (una data rotta non deve
rientrare come se il certificato fosse arrivato quel giorno),
`denunciaNumero` testo libero. Compatibilità all'indietro su file a sei e
sette colonne.

**Trovato durante la prima verifica isolata (non prevista)**: il giro ha
segnalato `iniezioni-fresche.mjs` caduto — una controprova in
`tests/browser/scudo-documenti.mjs` citava la vecchia intestazione a sette
colonne, ora scaduta per il cambio appena fatto. Ri-ancorata alla nuova
intestazione a dieci colonne (terza ri-ancoratura dello stesso punto nella
storia del file), e rilanciata una seconda verifica isolata completa.

Toccati:
- `apps/scudo/scudo-data.js`: `parseInfortuniCsv`, `csvRegistroInfortuni`,
  commento del contratto aggiornato.
- `shared/deepwork-id-client/dw-shell.js`: `CSV_TABELLE` per
  `scudo.infortuni`.
- `apps/deepwork-id/tests/run-kpi.mjs`: due asserzioni esistenti corrette
  (un `eq` di uguaglianza esatta, un'ancora di fine riga), più un nuovo
  test dedicato con controprova.
- `apps/deepwork-id/tests/browser/scudo-documenti.mjs`: ri-ancoratura
  dell'iniezione scaduta.
- `docs/RICERCA_CONTINUA_SCUDO.md`: nota di chiusura onesta sulla
  differenza di forma, più una domanda aperta non risolta (`lavoratoreId`
  non fa parte del giro CSV — non verificato se sia un'omissione).

Controprova sul codice vero: rimessa la lettura delle tre colonne, due
asserzioni cadono, ripristinato via `cp` + `diff`. Verificati anche
`run-stile.mjs` (330/0), `sintassi-pagine.mjs` (34/0), `copertura-funzioni.mjs`
(pulito).

Doc-cascade: run-kpi 3108→3109, somma nove suite 3.602→3.603, giro-totale
4087→4088. **Prima verifica isolata: 40/41 comandi, 1 caduto**
(`iniezioni-fresche.mjs`) — diagnosticato, corretto, **seconda verifica
isolata: 41/41 comandi, 0 caduti, 4088 asserzioni**, esattamente il numero
predetto prima della correzione.

## Stato roadmap
Il censimento a doppio punto di chiamata, ripetuto su tutte e sei le app in
questa sessione, ha trovato **cinque difetti veri su sei tentativi**
(Campo, Terra, Conti, Sentinella, Scudo sì; Flotta no, con la ragione
distinta e scritta). Il metodo ha reso quello che poteva rendere in questo
ciclo: non c'è un'altra app su cui ripeterlo per la prima volta in questa
sessione.

## Prossimo passo atomico
Nessuna delle due strade "binario 2" aperte dai checkpoint precedenti
(censimento a doppio punto di chiamata, ricerca ASSENZA/P2) resta con
lavoro pronto da fare senza prima una decisione o una nuova indagine. Per
la prossima unità:
1. **Aprire l'indagine lasciata esplicitamente in sospeso** su Scudo:
   `lavoratoreId` nel registro infortuni fa parte o no del giro CSV per
   scelta? Richiede leggere come Terra risolve `fronteId` per NOME (non
   per id locale) sul suo import CSV, per capire se lo stesso schema si
   applica qui, prima di decidere se aggiungerlo.
2. **Riprovare il censimento a doppio punto di chiamata su Genesi**, non
   ancora provato in questa sessione (fuori dal giro `node`, ma raggiungibile
   leggendo `genesi.html` direttamente).
3. Tornare alla lista "SE LA ROADMAP SEMBRA FINITA" di CLAUDE.md: seconde
   iterazioni sulle app verticali, P3 di ASSENZA (misurata come costosa ma
   non impossibile), revisione qualità/sicurezza, nuova deep-research a
   rotazione, o la decisione di prodotto lasciata aperta su Flotta
   (round-trip CSV completo per i mezzi).
La scelta è aperta al prossimo ciclo.

## Blocchi
Nessuno.
