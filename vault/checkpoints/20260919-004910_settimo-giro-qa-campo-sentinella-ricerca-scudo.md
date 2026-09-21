# Checkpoint — 2026-09-19T00:49:10Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
47315759 — docs(decisioni): Scudo — blocco su formazione scaduta e avviso in tempo reale

## Cosa è stato completato
Quattro cantieri in parallelo (direttiva 26/07), tre di QA e uno di ricerca
continua, tutti verificati riga per riga contro il codice attuale prima di
agire — nessuno preso sulla parola dell'agente:

- [x] **Campo** (`4464b311`): `testoConsegnaTurno` — il documento "gemello"
      di `rapportoGiornata`, sincronizzato più volte oggi su
      idoneità/checklist/near-miss/volate — non aveva MAI una sezione
      "Personale presente": non chiamava né `appelloTurno` né
      `riposoDiTurno`. Chi entrava in turno non sapeva chi non era ancora
      spuntato né chi aveva meno delle 11 ore di riposo dovute (D.Lgs
      66/2003, art. 7) — proprio le due cose che la stessa funzione dice
      di voler dare per prime al turno entrante. Riprodotto sulla
      dimostrazione reale (Paolo Gallo non spuntato, Mario Rossi sotto
      soglia). Fattorizzata la costruzione comune (`personaleTurno`/
      `introPersonaleTurno`, riusate anche da `rapportoGiornata`) e
      aggiunta la sezione; `durate: DUR` mancante nella chiamata di
      index.html.
- [x] **Sentinella** (`97544f39`): unico bottone di scrittura rimasto senza
      guardia contro il doppio tocco — "Accogli nel registro" su una
      volata prevista da Genesi (ponte 3e), per-riga e senza id fisso.
      La deduplicazione (`previsteNuove`) protegge solo DOPO `refresh()`:
      contro un backend che non condivide lo stesso array in memoria
      (Firestore vero), un doppio tocco scrive due volate identiche.
      ⚠️ Misurato PRIMA di scrivere la prova (regola di CLAUDE.md): il
      doppio-click sincrono che smaschera il difetto sugli altri quattro
      bottoni dell'app QUI non lo smaschera, perché in demo `VOL`
      referenzia lo stesso array che `db.aggiungi` muta — un'autodifesa
      accidentale della demo, assente contro un backend vero. La prova
      che regge misura la proprietà giusta: il bottone si disabilita in
      modo SINCRONO, prima di ogni `await`.
- [x] **Deepwork ID** (QA): agente dispatchato, interrotto dal riavvio del
      contenitore prima di riportare — da ridispatchare in un prossimo
      blocco se il backlog resta esaurito.
- [x] **Ricerca continua su Scudo** (`4ff03001` + `47315759`): scadenze
      formazione/idoneità confrontate con SafetyCulture/Intelex/Cority/
      FileFlo/Enablon e col D.Lgs 81/08. Tre proposte: preavvisi scalati
      (candidato tecnico, in `docs/RICERCA_CONTINUA_SCUDO.md`, da
      rimisurare) e due che toccano una scelta di prodotto/sicurezza
      (blocco operazionale su formazione scaduta, avviso in tempo reale
      sulla perdita di idoneità durante un turno) — messe in
      `docs/DECISIONI_WEEKEND.md` (decisione 38), non implementate
      d'iniziativa.

Inoltre: il canarino del ciclo (`47195fa2`) e la propagazione dei numeri
(`run-kpi` 3177→3178, copertura 1049→1051/1051, «3.674» prove, «4155»
asserzioni del giro completo — misurati con gli strumenti, non a memoria,
con `giro-node.mjs` rilanciato fresco dopo tutte le modifiche).

## Verifica prima dell'ultimo commit
`run-kpi.mjs` 3178/3178 · `sintassi-pagine.mjs` 34/34 · `run-stile.mjs`
330/330 · `numeri-nei-documenti.mjs` 43/43 (413 banchi, copertura
1051/1051) · `sentinella-bottoni-occupato.mjs` 13/13 normale, 5 KO sotto
`--controprova` (tutti e cinque i bottoni, incluso il nuovo) ·
`iniezioni-fresche.mjs` 700/700 sul bersaglio · `suite-collegate.mjs` 3/3.
`giro-node.mjs` completo rilanciato fresco: 39/41 comandi a posto — i due
caduti sono `numeri-nei-documenti.mjs` (causa risolta dopo, ora verde) e
`date-checkpoint.mjs` (vedi Blocchi).

## Stato roadmap
Sette giri di deep-pass QA completati oggi/stanotte, più due giri di
ricerca continua (Flotta, Scudo). Ogni giro ha prodotto almeno un finding
verificato e corretto, tranne quando il finding era un difetto della prova
(Terra, settimo giro) o richiedeva una decisione del fondatore (Scudo,
questo giro).

## Prossimi passi
- **Prossimo passo atomico**: ridispatchare l'agente QA su Deepwork ID
  (interrotto dal riavvio del contenitore prima di riportare — nessun
  finding suo perso, semplicemente mai arrivato). In parallelo, aprire
  almeno altri due cantieri (direttiva dei tre paralleli): una nuova
  ricerca continua a rotazione su un'app non ancora toccata oggi da
  ricerca (Terra, Campo, Deepwork ID) e/o una seconda iterazione UX con
  screenshot su un'app verticale.
- Controllare se il giro di convergenza lungo (PID 688, partito ieri sera)
  è ancora vivo: era già a ~4 ore all'ultimo controllo, quindi va giudicato
  "troppo vecchio" per qualunque numero — solo eventuali suoi KO vanno
  riverificati contro il codice attuale prima di agire, come fatto con
  successo sul KO di Terra in questo stesso blocco.

## Blocchi
Un checkpoint di questo stesso blocco (`20260919-000512_settimo-giro-...`,
commit `a75b7df8`) è stato scritto e datato PRIMA di verificare `date -u`:
il nome dice 2026-09-19 ma è entrato in git alle 23:56:58Z del 18/09 (un
giorno avanti, otto minuti avanti sull'ora). `date-checkpoint.mjs` legge
ogni percorso mai entrato in storia, quindi resterà rosso su quel file
finché la storia del ramo non verrà riscritta — decisione che CLAUDE.md
lascia esplicitamente al fondatore, non presa qui. Lezione applicata da
qui in avanti: **leggere `date -u` PRIMA di scegliere il nome del file**,
mai assumere che la mezzanotte sia già passata.
