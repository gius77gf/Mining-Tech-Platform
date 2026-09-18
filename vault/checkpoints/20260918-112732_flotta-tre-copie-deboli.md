# Checkpoint — 2026-09-18T11:27:32Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
f2b2f81e — fix(flotta): tre copie deboli mai propagate dalla correzione originale

## Cosa è stato completato
Dal deep-pass QA su Flotta (agente a106be18e1d4b3d04): tre difetti,
stessa famiglia — una correzione fatta in un punto del modulo, mai
propagata al secondo consumatore dello stesso dato.

1. Ordinamento del magazzino ricambi (`$ric-list`) usava ancora la
   formula grezza già sostituita in `sottoScorta`. Nuova funzione pura
   `ordinaMagazzino(ricambi)` in `flotta-data.js`, che estende
   `RANGO_SCORTA` a tutti e quattro gli stati e ordina l'intero
   magazzino (non solo il sottoinsieme filtrato di `sottoScorta`).
2. `csvBudget` scriveva i numeri col punto inglese, a differenza dei
   quattro CSV gemelli corretti il 17/09. Ora usa
   `mostra(numeroDichiarato(x), 2)`.
3. `propostaScorte` mostrava "soglia oggi 0" per un ricambio mai
   impostato — la stessa bugia già corretta in `statoScorta`. Ora usa
   `numeroDichiarato(r.sogliaMin)`; badge "imposta a X" invece di
   "alza a X" quando non c'era nessuna soglia da alzare.

## Verifica
- Tre nuovi test dedicati con controprova.
- KPI: 3147 → **3149**.
- `sonda-vuoto.mjs`: dichiarato `flotta.ordinaMagazzino` in
  `ALLARMI_ACCETTATI` (stessa eredità di `statoScorta`/`sottoScorta`
  già dichiarate) — trovato SOLO al giro completo, non dal KPI/sintassi.
- Giro completo su worktree isolata: **41/41, 0 caduti**. Asserzioni:
  **4147**. 9-suite sum: **3.645** (3149+330+83+34+9+8+7+3+22).
  `numeri-nei-documenti.mjs`: 43 passati, 0 falliti — inclusa la
  copertura funzioni pure aggiornata (1045→1046).

## Stato roadmap
Vedi vault/ROADMAP_SETTIMANA.md.

## Coda di lavoro — quattro unità rimaste, tutte in shared/dw-app-ui.js
(agente a2cd701aa80f1f010):
1. Genesi — toast di errore senza CSS distintivo (`.err`/`.success`/
   `.warn` assenti nel CSS locale, mentre il JS chiama `toast(m,"err")`
   in `genesi.html:1282`).
2. Toast senza `role="status" aria-live="polite"` in Genesi
   (`genesi.html:1092`) e deepwork-id/admin (`admin.html:103`).
3. Nessuna trappola del focus nella modale (`dwUiAggancia()` gestisce
   `Escape` ma non `Tab`, nessun `inert`/`aria-hidden`) nonostante
   `aria-modal="true"` su tutte le 8 pagine.
4. Listener accumulato senza fine su `#modal-foot` in Conti
   (`index.html:6165`, flusso "Scrivi il verbale"): ogni apertura
   aggiunge un `addEventListener` in più, `once:false`, mai
   `removeEventListener` — `apriModale()` svuota solo `innerHTML` del
   contenitore persistente.

**NOTA**: 1, 2 e 3 sono difetti di accessibilità/UI su Genesi e su
tutte e otto le superfici — probabilmente si possono affrontare come
un'unica unità "accessibilità toast/modale", oppure separatamente se
il rischio di toccare `dw-app-ui.js` (foglio condiviso da tutte le
app) consiglia di isolarle. Il 4 è un difetto isolato in Conti,
indipendente dagli altri tre.

## Prossimo passo atomico
Con la coda a 4 item (tutti nella stessa area), dispatchare 2-3 nuovi
agenti di deep-pass QA in background su superfici NON ancora coperte
in questa sessione con un giro dedicato (Conti — solo toccato di
striscio finora — Scudo con un angolo diverso, o una seconda passata
su Campo/Sentinella con focus su aree diverse da quelle già battute),
per mantenere ≥3 cantieri paralleli mentre si implementano in
foreground le 4 unità rimaste. Continuare "mai fermarsi".

## Blocchi
Nessuno.
