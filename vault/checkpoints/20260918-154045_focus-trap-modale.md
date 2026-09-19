# Checkpoint — 2026-09-18T15:40:45Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
6908c61c — fix(shared,core): la modale non intrappolava il focus (Tab usciva sul fondo)

## Cosa è stato completato
L'ultimo item della coda del deep-pass QA su shared/dw-app-ui.js: la
trappola del focus nella modale. `dwUiAggancia()` gestiva `Escape` ma non
`Tab`, e il fondo non riceveva `inert`, nonostante tutte le 8 pagine
dichiarino `aria-modal="true"`. Corretto in due posti indipendenti:
`shared/dw-app-ui.js` (7 superfici: 6 app + admin.html) e `index.html` (il
core, che non consuma il file condiviso — scoperto solo verificando dal
vivo, perché è l'originale da cui le app copiano, non un suo cliente).
Nuovo banco permanente `focus-trap-modale.mjs`, registrato in `tutti.mjs`,
con controprova su entrambe le superfici.

Lezione presa sul momento, per il prossimo che lancia un banco dentro un
giro mirato di `tutti.mjs` con `--sulla-viva`: senza `DW_RADICE` puntato
alla worktree, il banco (che alza un server SUO, non quello di `tutti.mjs`)
serve la cartella viva `/home/user/Mining-Tech-Platform` invece della
copia in verifica — e ha accusato falsamente il fix del core di non
esserci, perché leggeva l'`index.html` non ancora corretto. `--sulla-viva`
NON imposta `DW_RADICE` (lo fa solo il ramo che crea una copia da HEAD).

## Verifica
- Banco standalone: 15/15 normale, controprova 2 KO voluti (inert-check su
  Conti e sul core), guardie trovate e tolte 2/2 su entrambe.
- Giro mirato su `tutti.mjs --sulla-viva --da=355` con `DW_RADICE`
  corretto: `la modale intrappola Tab...` OK, `trappola del focus ·
  controprova` OK (il KO di `finestra di caricamento · controprova` è la
  passata precedente, voluta, non toccata da questa unità).
- `sintassi-pagine.mjs`: 34/34. `suite-collegate.mjs`: 158 banchi in
  `tutti.mjs`, 221 file guardati. `run-kpi.mjs`: 3154/0 (invariato, nessun
  modulo dati toccato). `numeri-nei-documenti.mjs`: 43/0, 357 banchi
  contati (propagato in DEVELOPMENT.md/STATO_PRODOTTO.md/
  DECISIONI_WEEKEND.md/ROADMAP_SETTIMANA.md: 355→357 esecuzioni, 157→158
  file distinti). `sonda-vuoto.mjs`: 15/0.
- Il container si è riavviato a metà di questa unità (giro lungo
  interrotto): la worktree `/tmp/wt-focus-trap` e il main tree sono
  sopravvissuti intatti (stesso `/tmp`), nessun lavoro perso.

## Stato roadmap
Chiusa la coda del deep-pass su shared/dw-app-ui.js. Durante l'attesa dei
giri, tre nuovi deep-pass QA in background hanno consegnato difetti
VERIFICATI dal vivo, in coda per l'implementazione (tutti con prova
concreta, nessuno sulla parola sola):
1. **Scudo** — `statoAppalto` (scudo-data.js:6139-6151) non segnala mai
   una qualifica appaltatore "in-scadenza": né in `problemi` né in
   `ignoti`. L'appalto resta "A posto" verde mentre "Imprese esterne",
   sulla stessa pagina, dice correttamente "In scadenza".
2. **Campo** — il banner aggregato di `renderOperatori` (index.html:~2606,
   2624) non guarda `hse.senzaScadenze` (persona collegata a Scudo con
   zero documenti): dice "Documenti in corso di validità per tutte le
   persone" anche quando una persona non è mai stata verificata.
3. **Flotta** — la fascia colorata della riga in `#sch-comp` (index.html
   ~4130, "COMPONENTI A VITA PROPRIA") è fissa a `st-accent`
   indipendentemente da `c.stato`: un componente scaduto ha lo stesso
   bordo di uno sano, solo il badge a destra cambia colore.
Più un item da investigare (non ancora un difetto confermato): un crash
di `flotta-contatore.mjs --controprova` (bottone "Riscrivi sul contatore
nuovo" alto 0px) incontrato per caso durante il giro di questa unità —
non è chiaro se sia un difetto vero del prodotto o un banco invecchiato.
E resta pendente dalla sessione precedente: verificare se il fix Flotta
`csvGiriMacchina` (worktree `/tmp/wt-flotta-csvgiri`, probabilmente stale)
è mai stato committato.

## Prossimo passo atomico
Implementare il fix Scudo `statoAppalto` (task #3): instradare
`qualifica.esito==="in-scadenza"` in un elenco `avvisi` separato (letto
sia dalla riga dell'appalto in `index.html` sia da `riepilogoAppalti`),
senza toccare il ramo `problemi`/`ignoti` esistente. Isolare in una nuova
worktree da HEAD corrente, verificare con Playwright + controprova prima
di committare. In parallelo, dispatchare nuovi agenti di deep-pass QA
(candidati non ancora battuti in questa sessione: Genesi un secondo giro,
Conti, i ponti in docs/MAPPA_ECOSISTEMA.md) per mantenere ≥3 cantieri.
Poi proseguire con Campo (task #4), Flotta fascia colore (task #5),
Flotta csvGiriMacchina (task #2), l'investigazione flotta-contatore
(task #6). Continuare "mai fermarsi".

## Blocchi
Nessuno.
