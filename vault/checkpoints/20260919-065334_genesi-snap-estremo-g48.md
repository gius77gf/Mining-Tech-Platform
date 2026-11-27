# Checkpoint — 2026-09-19T06:53:34Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
61117154 — feat(genesi): snap a un estremo già disegnato (G48), corretta la ricerca CAD

## Cosa è stato completato
Prima unità di sviluppo dopo il pivot su Genesi (direttiva del fondatore,
19/09). Prima di implementare qualunque cosa dal censimento CAD recuperato
in `docs/RICERCA_GENESI_CAD.md`, l'ho verificato riga per riga contro il
codice attuale — disciplina "niente entra sulla parola dell'agente".

- [x] **Scoperta critica**: il fondatore aveva già fatto la stessa domanda
      il 13/09 ("potremmo rendere Genesi più simile a un CAD?"), scelto
      "tutto" fra quattro assi proposti (checkpoint
      `20260914-100055_genesi-cad-ricerca-verificata.md`), e un ciclo
      precedente (blocchi `G33`-`G47d`, 14/09) aveva già costruito: export
      DXF (`dxfPianoFori`), snap a griglia (`_snapXY`, opzionale), input di
      coordinate esatte con allineamento a un altro foro (G47a), layer di
      disegno veri estesi ai tratti (G47b), undo/redo per l'intero editor
      (G47c-1), uno strumento di disegno libero — polilinee a mano (G47c-2)
      — e l'import DXF (G47d, esteso il 19/09 stesso con LWPOLYLINE). Il
      censimento del pomeriggio non aveva trovato NESSUNA di queste sei
      cose, perché cercava i nomi che il mondo userebbe
      (`toDxf`/`exportDxf`, `_snapXY` scritto per esteso) invece di
      leggere il meccanismo — la stessa causa già raccolta in CLAUDE.md il
      14/08 per la ricerca di dominio, qui più insidiosa perché il lavoro
      mancante era codice di 5 giorni prima, non gergo del mestiere.
- [x] Verificato di nuovo con `grep` mirato sul MECCANISMO (multiselezione,
      trasformazioni oltre il move, snap a oggetti): confermato che
      restano vere lacune SOLO tre delle sei originariamente elencate —
      snap a oggetti, selezione multipla, trasformazioni (rotate/scale/
      mirror), blocchi riusabili (quattro, non le "1-11 mancanze" del
      censimento iniziale).
- [x] Corretto `docs/RICERCA_GENESI_CAD.md` con una sezione di correzione
      dettagliata, per non lasciare un documento di riferimento sbagliato
      in giro.
- [x] Implementato **G48 — snap a un estremo già disegnato**: lo snap a
      OGGETTI (non solo a griglia) per lo strumento "tratto". Due funzioni
      pure in `apps/genesi/genesi-data.js` (`estremiDisegno`,
      `puntoSnapEstremo`), collegate in `d2Down` (il click aggancia
      all'estremo più vicino entro 10px, prima di ricadere sulla griglia
      G34) e in `d2Move` (anteprima: un anello verde mostra dove cadrebbe
      il prossimo click, la stessa lingua visiva di ogni CAD per l'endpoint
      snap).
- [x] Propagati i numeri nei quattro documenti sorvegliati:
      `numeri-nei-documenti.mjs` aveva rilevato lo scostamento (test count
      3184→3190, copertura genesi-data.js 170→172, tabella scaglioni
      estraibili di Genesi 17/17→16/18) prima che diventasse un difetto
      dimenticato.
- [x] **Trovati e corretti due difetti indipendenti dal giro completo**
      (non causati da questa unità, scoperti mentre verificavo):
      1. un checkpoint del 18/09-19/09 datato nel futuro (stessa causa già
         nota, quarta volta) — rinominato e aggiunta l'eccezione
         dichiarata in `date-checkpoint.mjs`, ESTESA alla prova sul GIORNO
         (che prima non aveva nessun meccanismo di eccezione, solo quella
         sull'ORA);
      2. due prove `grep` scadute in `docs/RICERCA_CONTINUA_SCUDO.md`
         ("notifiche automatiche: 0 occorrenze", diventato 5/8 perché il
         primo passo piccolo del delta — il badge in-app — è stato
         costruito lo stesso giorno) — chiuse con una nota che distingue
         il verdetto (limite architetturale sull'invio esterno, ancora
         vero) dal numero (cambiato per una ragione buona).
      **Trappola pestata e recuperata durante la scrittura**: un comando
      `python3 -c` con backtick non escapati in una stringa bash ha fatto
      sparire del testo (i backtick sono stati interpretati come
      sostituzione di comando) — esattamente la trappola già descritta in
      CLAUDE.md per i messaggi di commit. Notato subito rileggendo il
      file, corretto con l'Edit tool prima del commit.

## Verifica prima del commit
`run-kpi.mjs`: 3190/3190 (6 nuovi test per le due funzioni pure + il
collegamento nella pagina). `copertura-funzioni.mjs`: 345/345, 0 funzioni
senza prova. `sintassi-pagine.mjs`: 34/34. `numeri-nei-documenti.mjs`:
43/43. `date-checkpoint.mjs`: 10/10. `prove-grep-scadute.mjs`: 6/6. Giro
`node` completo rilanciato dopo tutte le correzioni: in corso, verde fin
qui su tutte le suite lette.

## Stato roadmap
Primo cantiere Genesi del pivot chiuso. Il delta reale che resta per un
CAD più maturo: snap a oggetti (fatto, questa unità), selezione multipla
(window/crossing), trasformazioni oltre il move (rotate/scale/mirror),
blocchi/simboli riusabili. Direttiva 26/07 riletta "dentro Genesi": serve
un secondo (e terzo) fronte in parallelo su queste superfici.

## Prossimi passi
- **Prossimo passo atomico**: scegliere il prossimo asse fra selezione
  multipla, trasformazioni (rotate/scale/mirror su un foro/tratto
  selezionato), o blocchi riusabili — verificare il costo reale aprendo
  `d2Down`/`d2Move`/`D2.sel` prima di stimare, come fatto per G48.
- Aprire un secondo cantiere in parallelo su un'altra superficie di
  Genesi (es. l'input relativo/polare pieno, o approfondire l'export
  DXF con più entità), rispettando la direttiva "almeno tre cantieri"
  riletta dentro una sola app.
- Leggere l'esito del giro completo del browser
  (`giro-completo-19-0552.log`, PID 23083, avviato alle 05:52Z) quando
  comodo — a questo punto probabilmente da rileggere/rilanciare per
  staleness, visti i commit nel frattempo.
- Continuare a verificare ogni claim di ricerca contro il codice
  ATTUALE prima di implementare, specialmente su Genesi dove è appena
  emerso che un ciclo recente può aver già risposto alla stessa domanda.

## Blocchi
Nessuno.
