# Checkpoint — 2026-09-16T06:09:36Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
88bfdfaf

## Cosa completato
- Chiuso il **secondo tema pronto del dodicesimo giro di ricerca su
  Scudo** (dopo `notificheScadenzeNonLette`): il preset `rischio-chimico`
  in `SCADENZE_PRESET` — gemello di `rumore-vibraz` (stessa categoria
  "cava", stesso tipo "Altro", stessa periodicità proposta 48 mesi),
  Titolo IX D.Lgs 81/08 — e il tipo di documento «Scheda dati di
  sicurezza (SDS)» in `TIPI_DOCUMENTO`.
- **Prima fetta deliberata**: entrambi entrano nei meccanismi generici
  già esistenti (lo scadenzario con `livelloScadenza`, il ciclo di vita
  del documento valido/da rivedere/scaduto già condiviso da tutti gli
  altri tipi) senza costruire una corsia dedicata. I campi propri di
  una SDS (`sostanza`, `classificazione`, `dataRevisioneSds`) restano
  il passo successivo — una scelta di modello dati (una SDS per
  sostanza? un registro plurale?) che merita la sua unità dedicata,
  non da improvvisare in coda a un'altra.
- Test in `run-kpi.mjs`: `rischio-chimico` gemello di `rumore-vibraz`
  (stessa categoria/periodicità), il tipo documento esiste, «Altro»
  resta in fondo all'elenco. Verificato anche nel browser (scratchpad,
  non permanente: la dropdown mostra la nuova opzione, un documento di
  quel tipo si crea e appare nell'elenco — nessun difetto trovato,
  quindi nessun banco permanente nuovo: il meccanismo è generico e già
  coperto dai banchi esistenti sul registro documenti).
- Verifica: `run-kpi` 3061/0, `run-stile` 330/0, `classi-orfane` 0/0,
  `funzioni-mai-usate` 0 da collegare (nessuna funzione nuova, solo
  dati), `nomi-liberi` 0 fuori scope, `copertura-funzioni` invariata
  (nessuna funzione aggiunta). Giro isolato rilanciato due volte:
  **4027** asserzioni, 40/40 comandi a posto, 0 caduti.
  `numeri-nei-documenti.mjs`: 43/0.
- Doc-cascade: run-kpi 3060→3061, somma nove suite 3.554→3.555, giro
  completo 4026→4027 (copertura e banchi browser invariati: nessuna
  funzione né banco nuovo in questa unità).
- Commit `88bfdfaf`, pushato su `claude/scheduled-tasks-remote-control-bk4ap6`.

## Unità collaterale (stesso blocco)
Ricerca in background (haiku) su consegna di turno e gestione della
fatica in Campo, appesa a `docs/RICERCA_CONTINUA_CAMPO.md`. Riverificata
indipendentemente PRIMA di tradurla in codice: **tutte e tre le
mancanze dichiarate erano false**, già colmate sotto altri nomi
(`riassuntoChiusura` produce già il timestamp "consegnato... alle
HH:MM"; `riposoPrimaDelTurno` dichiara già il fallback con
`daInizio`/`attendibile`; "SEGNALAZIONI DEL TURNO" è già in prima
posizione dopo "LAVORI NON CONCLUSI", per scelta commentata nel
codice). Zero su tre implementate — correzione appesa in coda al
documento di ricerca perché nessun cantiere futuro le riproponga.
Commit `50667fbf`, già pushato.

## Stato roadmap
Vedi `vault/ROADMAP_SETTIMANA.md`. Con questa unità Scudo ha chiuso TRE
temi del dodicesimo giro (barriere ICAM — unità precedente alla
precedente, notifiche scadenze, rischio chimico); restano anagrafica
attrezzature (medio, confine con Flotta già dichiarato) e la decisione
22 (quale strada INAIL) che aspetta il fondatore. Conti ha chiuso
entrambi i temi pronti del decimo giro. Campo ha avuto un giro di
ricerca con esito "già a posto" su tutti e tre i punti proposti — non
serve un'altra passata a breve su quel tema specifico.

## Prossimo passo atomico
Candidati aperti, in ordine di prontezza:
1. Rotazione ricerca continua: Sentinella e Terra non hanno avuto un
   giro di ricerca continua in questa sessione — sono i due candidati
   più freschi per il prossimo giro mirato in background.
2. Anagrafica attrezzature in Scudo (`RICERCA_CONTINUA_SCUDO.md`, tema
   3): entità `attrezzature/{id}` con tipo/modello/matricola/
   costruttore/anno, campo `attrezzaturaId` sulla verifica periodica —
   costo medio, confine con Flotta (parco mobile) già dichiarato dalla
   ricerca come decisione di prodotto non ostacolo tecnico.
3. Non fermarsi qui per la regola del fondatore (esaurimento crediti):
   proseguire immediatamente con l'unità successiva.

## Blocchi
Nessuno.
