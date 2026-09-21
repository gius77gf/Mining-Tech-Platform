# Checkpoint — 2026-09-18T10:41:01Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
2af41db9 — fix(sentinella): dataIt è la versione condivisa, non più una copia debole che legge la forma invece del calendario

## Cosa è stato completato
Dal deep-pass QA su Sentinella (agente ad42a66dfbc2e4d8e): `dataIt`
locale (`sentinella-data.js:431-435`) riconosceva una data con un
regex sulle cifre, senza validare il calendario — `dataIt("2026-02-30")`
dava «30/02/2026» invece di «—». La versione condivisa
(`shared/deepwork-id-client/dw-shell.js`, con `dataISOEsiste`) è
quella che lo schermo già usa. Corretto importando `dataIt` da
`shared/` e togliendo la funzione locale (regola del `shared/`: un
alias non è una seconda implementazione).

## Verifica
- Nuovo test dedicato con controprova su `riferimentoReferto` (verificato:
  con la vecchia funzione rimessa il test cade, riproducendo esattamente
  «30/02/2026»).
- KPI: 3145 → **3146**.
- Giro completo su worktree isolata: **41/41, 0 caduti**. Asserzioni:
  **4142**. 9-suite sum: **3.640** (3146+330+83+32+9+8+7+3+22).
  `numeri-nei-documenti.mjs`: 43 passati, 0 falliti.

## Stato roadmap
Vedi vault/ROADMAP_SETTIMANA.md.

## Coda di lavoro — cinque unità verificate, non ancora implementate
1. **Genesi — `pointcloud.js:parseXYZ`** (righe 11-19): su un file XYZ
   con righe miste (con/senza RGB), `pos`/`col` si disallineano
   indice-a-indice. `nuvola-poc.html:151-158` passa i due array come
   `BufferAttribute` di `count` diverso: colori scalati sui punti
   sbagliati. Nessun test in `run-pointcloud.mjs` copre righe miste.
2. **Genesi — toast di errore senza CSS distintivo**: non carica
   `dw-app-ui.css` ma usa il `toast()` JS condiviso (`tipo:"err"` in
   `genesi.html:1282`); il CSS locale definisce solo `#toast`/
   `#toast.show`, nessuna regola `.err`/`.success`/`.warn`.
3. **Toast senza `role="status" aria-live="polite"`** in Genesi e
   deepwork-id/admin (le altre sei superfici ce l'hanno).
4. **Nessuna trappola del focus nella modale** nonostante
   `aria-modal="true"` su tutte le 8 pagine: `dwUiAggancia()` gestisce
   `Escape` ma non `Tab`, nessun `inert`/`aria-hidden`.
5. **Listener accumulato su `#modal-foot` in Conti**
   (`index.html:6165`, flusso "Scrivi il verbale"): ogni apertura
   aggiunge un `addEventListener` in più, mai rimosso.

## Prossimo passo atomico
La coda si è assottigliata a 5 item, tutti minori/UI rispetto alle
unità di sicurezza/dati chiuse finora. Dispatchare 2-3 nuovi agenti di
deep-pass QA in background su superfici non ancora coperte in questa
sessione (Terra deep-pass mirato, Flotta, o una seconda passata su
Conti/Scudo con focus diverso dai giri precedenti), per mantenere ≥3
cantieri paralleli, mentre si implementano in foreground le unità 1-5
sopra (priorità: 1, perché è un difetto di dati silenzioso su un
rilievo reale; poi le tre di dw-app-ui.js/accessibilità, che si
potrebbero anche accorpare in un'unica unità essendo nello stesso
file).

## Blocchi
Nessuno.
