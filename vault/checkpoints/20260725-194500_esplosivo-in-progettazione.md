# Checkpoint — 2026-07-25T19:45:00Z

## Tipo
unit-complete (revisione fondatore 25/07 — G2b esplosivo nella progettazione)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Completato
- **Sezione «Indice» ELIMINATA** (schermata + voce di menu): il menu inferiore
  ora è Home · 2D · 3D.
- **Scelta esplosivo e innesco DENTRO la progettazione**: due selettori nella
  sezione «Carica & sequenza» del 2D con la SOLA dicitura; cambiarli ricalcola
  subito carica derivata e scheda. Selettore esplosivo anche nel pannello 3D.
- **Approfondimento SOLO su richiesta**: bottone ⓘ accanto a ciascun selettore
  (e chip «materiali») apre un riquadro dedicato con la scheda completa del
  SOLO elemento selezionato (specifiche, applicazione, pro/contro, costo);
  chiusura con ✕ o clic fuori.
- Rinominata nel 3D l'etichetta «Ritardo Nonel (ms)» → «Ritardo foro (ms)»
  (coerenza con la regola ferrea sui dati orientativi).
Verificato in browser reale: nav 3 voci, 14 esplosivi nel selettore, cambio
esplosivo → chip e kg/foro ricalcolati (ANFO→Heavy ANFO: 60→79 kg), overlay
aperto/chiuso, zero errori JS. Screenshot salvati.

## Ultimo commit
(questo commit)

## Prossimo passo atomico
G2c: input del quantitativo TOTALE di esplosivo della volata in «Carica &
sequenza»; l'app lo divide sui fori (kg/foro) e ricalcola i derivati.
