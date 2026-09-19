# Checkpoint — 2026-09-16T07:06:36Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
c30e9f54

## Cosa completato
- Chiuso il tema **anagrafica attrezzature** di Scudo, segnalato tre volte
  dalla ricerca continua (luglio, 09/08, 16/09) e mai colmato prima d'ora:
  entità `attrezzature/{id}` (tipo/modello/matricola/costruttore/anno),
  con `TIPI_ATTREZZATURA` limitato — per confine dichiarato con Flotta,
  che governa già il parco mobile — alle attrezzature FISSE dell'Allegato
  VII D.M. 11/04/2011 (gru, piattaforme elevabili, carriponte…).
- Collegamento `attrezzaturaId` sulla scadenza di tipo «Verifica
  periodica»: `attrezzaturaDiScadenza` a TRE stati (assente/trovato/rotto,
  stessa forma di `verbaleDiScadenza`) e `descriviLegameAttrezzatura` a
  scriverne la frase per la nota viva della finestra di verifica.
- **Prima fetta deliberata**: la verifica periodica già esistente si
  arricchisce (tendina di collegamento nella finestra `apriVerifica` +
  nota viva con matricola/costruttore/anno), un form di censimento
  dedicato per l'anagrafica autonoma resta il passo successivo.
- Wired in 3 record demo (`at1` fascicolo completo, `at2` senza anno,
  `at3` appena aperto) collegati alle 3 verifiche periodiche già in scena
  (s24/s25/s26) — tre stati diversi di proposito, come da convenzione.
- **Difetto reale trovato durante la verifica**: `funzioni-mai-usate.mjs`
  ha preso `attrezzaturaDiScadenza` collegata a NIENTE — la pagina
  duplicava la logica a tre stati con un `ATT.find(...)` diretto invece
  di chiamare il modulo, perdendo la distinzione fra «non collegata» e
  «collegamento rotto». Corretto spostando la frase in
  `descriviLegameAttrezzatura` (che il modulo chiama internamente) e
  usandola dalla pagina.
- Test in `run-kpi.mjs`: `attrezzaturaDiScadenza` (tre stati),
  `voceAttrezzaturaInElenco` (mai una voce vuota), `descriviLegameAttrezzatura`
  (distingue assente/rotto/trovato), `TIPI_ATTREZZATURA` + collegamento dei
  tre record demo. Banco browser `scudo-verifica-periodica.mjs` esteso con
  4 nuove asserzioni (tendina preselezionata, nota con matricola/
  costruttore/anno, nota «nessuna attrezzatura» quando assente,
  persistenza del collegamento dopo il salvataggio) e controprova estesa
  a 4 iniezioni (la nuova: il salvataggio del collegamento scelto nella
  tendina non avviene) — 4/4 rimesse, controprova conferma.
- Verifica: doppio giro isolato. Il PRIMO è caduto come atteso su
  `numeri-nei-documenti.mjs` (doc-cascade vecchia); corretti i quattro
  documenti coi numeri VERI. Poi si è scoperto che il totale del giro
  completo dipende da se `numeri-nei-documenti.mjs` stesso passa (le sue
  43 asserzioni entrano nella somma solo se il comando è verde) — un
  SECONDO giro isolato, verde, ha dato **4031** e non i 3988 scritti per
  primi (differenza esatta: le 43 di `numeri-nei-documenti.mjs`). Corretto
  di nuovo, in un commit separato, e un TERZO giro isolato conferma:
  40/40 comandi a posto, 4031 asserzioni, «i 2 documenti che lo dichiarano
  dicono lo stesso numero».
- Doc-cascade finale: run-kpi 3061→3065, somma nove suite 3.555→3.559,
  copertura sei-app 1033/1033→1037/1037, giro completo 4027→4031 (nel
  mezzo, per errore di misura poi corretto, era scritto 3988).
- `copertura-funzioni.mjs`: FONDO scudo 228→232 (TIPI_ATTREZZATURA,
  attrezzaturaDiScadenza, voceAttrezzaturaInElenco,
  descriviLegameAttrezzatura).
- Commit `6570ef9d` (canarino + unità, per un errore di `git add` — vedi
  sotto), `c30e9f54` (fix del totale 3988→4031), entrambi pushati.

## Nota di processo — errore riconosciuto
Il commit `6570ef9d` doveva essere solo il canarino (`vault/ULTIMO_CICLO.md`):
ho lanciato `git add vault/ULTIMO_CICLO.md && git commit` mentre l'unità
Scudo era già in stage da un `git add` precedente, e `git commit` ha preso
TUTTO l'indice, non solo il file appena aggiunto. Il contenuto era comunque
quello già verificato (stesso stato misurato dal primo giro isolato), quindi
nessun codice non controllato è entrato — ma il messaggio di commit non
descrive il vero contenuto. Lezione: quando si fa il canarino a metà di
un'unità con file già in stage, o si isola il canarino con `git commit --
vault/ULTIMO_CICLO.md` (pathspec esplicito), o si committa prima l'unità.

## Stato roadmap
Scudo ha chiuso QUATTRO temi del dodicesimo/tredicesimo giro (barriere
ICAM, notifiche scadenze, rischio chimico, fascicolo macchina). Resta
aperta la decisione 22 (quale strada INAIL) che aspetta il fondatore.
Terra ha un tredicesimo giro di ricerca continua appeso in coda a
`docs/RICERCA_CONTINUA_TERRA.md` (pianificazione pluriennale
dell'escavazione, confronto progettato-vs-realizzato), NON ancora
riverificato indipendentemente riga per riga — sei mancanze dichiarate,
la più promettente: `varianzaLottoAnno(lotto, anno, rilievi)` collegando
`lotto.ordine` (esiste, non ancora sfruttato per la sequenza) a un
volume pianificato per anno.

## Prossimo passo atomico
1. Riverificare indipendentemente (grep sul codice vero, non sulla parola
   dell'agente) le sei mancanze del tredicesimo giro di ricerca su Terra
   in `docs/RICERCA_CONTINUA_TERRA.md` prima di tradurne una in codice.
2. Rotazione ricerca continua: Sentinella resta l'unica app senza un giro
   di ricerca in questa sessione — candidato per il prossimo lancio in
   background.
3. Non fermarsi qui per la regola del fondatore (esaurimento crediti):
   proseguire immediatamente con l'unità successiva.

## Blocchi
Nessuno.
