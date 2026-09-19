# Checkpoint — %Y-%m-%dT%H:%M:%SZ

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
501b7442

## Completato
Unità 86 — Conti: `rimanenzeBilancio`, `descriviRimanenzeBilancio`, quattro
colonne in `csvRimanenze`, la pagina del Report con «al costo» e «bilancio»
(il minore, criterio scritto, tre «non lo so» con la ragione). Chiusa la
voce aperta dalla ricerca dell'11/09; run-kpi 2885, Conti 200/200.

## Imparato
- «Tutte al listino a 20 €/m³» era supposto, non misurato: la sabbia a 20
  restava al costo (1.760 contro 1.936). La prova ora tiene i due casi, e
  la frase dice che il criterio è cumulo per cumulo.
- Il costo dell'anno vuole i rilievi di Terra, che la pagina carica pigra:
  un riquadro sincrono si disegna col listino e si ridisegna quando
  arrivano — mai uno zero nel frattempo.

## Prossimo passo atomico
Leggere il giro del browser lanciato alle 09:13Z su `184781db`
(`scratchpad/giri/giro-browser-20260911-0913.log`, `leggi-giro.mjs`) quando
`ultimo-exit.txt` compare, e chiudere i KO veri. Poi la voce aperta «CONTI —
LA TARIFFA DEL CANONE PER PRODOTTO»: sul listino (`prodotti`) un campo
facoltativo `canoneAliquota` per prodotto; in `canonePeriodo` ogni riga
`perProdotto` usa la tariffa del prodotto se c'è, altrimenti quella
dell'organizzazione, e lo DICHIARA riga per riga (`tariffa: "prodotto" |
"generale"`); la pagina del canone lo scrive; campo nel form del listino;
prove in run-kpi; scatto.

## Blocchi
Nessuno.
