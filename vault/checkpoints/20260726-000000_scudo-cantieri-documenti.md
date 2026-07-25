# Checkpoint — 2026-07-26T00:00:00Z

## Tipo
unit-complete (revisione fondatore 25/07 — Scudo differenziato: cantieri +
documenti fisici + base normativa)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Completato
1. **Ricerca normativa** → `docs/SCUDO_NORMATIVA_CAVE.md`: quadro D.Lgs
   81/08 + D.Lgs 624/96 (nelle cave il documento è il **DSS**, da inviare
   alla ASL prima dell'avvio; il **POS** riguarda i cantieri esterni in cui
   l'azienda opera; DUVRI, nomine, verbale consegna DPI firmato, idoneità
   art. 41, attestati art. 37). Fonti citate.
2. **Cantieri e siti** (nuova collezione `cantieri`, demo+live via
   orgCollection): anagrafica cava/cantiere esterno con comune, stato,
   conteggio documenti collegati, aggiungi/rimuovi con conferma.
3. **Documenti fisici**: il form documenti ora ha TIPO normativo (DSS, POS,
   DVR, DUVRI, Nomina, Verbale DPI, Idoneità, Attestato), collegamento a
   CANTIERE o LAVORATORE, e **allegato foto/scansione** (immagine o PDF,
   ≤400 KB — limite del documento Firestore, dichiarato in interfaccia:
   l'archivio pesante arriverà con Firebase Storage). L'allegato si riapre
   con 📎 dalla lista (blob, senza toccare lo stato del documento).
4. Lista documenti arricchita: badge del tipo + «📍 cantiere» / «👷
   lavoratore» collegati.
Verificato in browser: cantiere aggiunto (3), documento POS creato e
collegato, 6 documenti in lista, zero errori JS; test puri 43+174+7 verdi;
smoke 9 superfici TUTTE PULITE. Screenshot salvati.

## Ultimo commit
(questo commit)

## Prossimo passo atomico
Proseguire la differenziazione delle altre verticali nell'ordine del valore
(fallback: Flotta ordine-di-lavoro con ricambi, Campo funzioni operative
specifiche) e la seconda passata estetica core (topbar/tab). Ogni unità:
commit + checkpoint + screenshot.
