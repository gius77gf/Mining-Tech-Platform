# Checkpoint — 2026-09-18T12:17:04Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
0645b781 — fix(conti): apertoDi non propagato a prioritaIncasso/agingIncassi/incassoPerMese/kpiFrom

## Cosa è stato completato
Dal deep-pass QA su Conti (agente a92657d52f86a1f91): `apertoDi(f, note)` è
già la fonte di verità per gli IMPORTI in `prioritaIncasso`/`agingIncassi`/
`incassoPerMese`/`kpiFrom`, ma la condizione che ne discende — "se
`apertoDi(f, note) <= 0` la fattura non conta più" — era applicata solo a
`fattureOltre90`/`esposizioneClienti`/`testoSollecito`. Una fattura mai
incassata ma stornata per intero da nota di credito restava scaduta e
urgente su un residuo di zero euro in tutt'e quattro. Corretto con la stessa
guardia nei quattro punti.

## Verifica
- Nuovo test con controprova (due fatture, una stornata per intero, una
  vera): tutt'e quattro le funzioni la escludono; senza note tornano a
  contarla entrambe.
- Giro completo su worktree isolata: 41/41, 0 caduti. KPI 3149→3150.
  9-suite sum: **3.646**. Asserzioni totali del giro: **4148**.
  `numeri-nei-documenti.mjs` verificato su quattro documenti.

## Nota di metodo su questo giro di verifica
Il numero "asserzioni eseguite dal giro" (distinto dal 9-suite-sum, vedi
CLAUDE.md) NON si può scrivere per tentativi finché `numeri-nei-documenti.mjs`
fallisce: quando fallisce viene escluso dalla somma dei comandi "sommabili"
e il totale stampato è sistematicamente più basso (mancano i suoi ~43). La
sequenza che converge, misurata qui: (1) si fissa il 9-suite-sum (quello lo
si conosce sempre, è la somma dei propri numeri); (2) si rilancia il giro e
si legge il numero che *lui* dichiara come vero nel messaggio di
disallineamento — non si indovina; (3) lo si scrive; (4) si rilancia ancora,
perché scrivere quel numero fa PASSARE `numeri-nei-documenti.mjs`, che a
quel punto contribuisce lui stesso alla somma e la fa salire di nuovo (qui:
4105 → 4148); (5) si rilancia un'ultima volta per confermare 0 caduti. Sono
serviti sei giri in tutto (non quattro) — imprevisto: due documenti in più
(`docs/DECISIONI_WEEKEND.md`, `vault/ROADMAP_SETTIMANA.md`) portavano lo
stesso 9-suite-sum e non erano nella mia prima lista.
Corollario collaterale, non un difetto: lanciare più `giro-node.mjs` in
worktree diverse IN PARALLELO va bene per le 8 suite `node`, ma
`browser/server-orfani.mjs` (il banco che verifica che un server statico
orfano venga tolto) può dare un falso rosso per contesa sulla porta
condivisa fra le worktree — misurato una volta su tre giri paralleli,
sparito rilanciando in sequenza. Non un difetto di prodotto: un limite del
mio uso della worktree, da tenere a mente.

## Stato roadmap
Vedi vault/ROADMAP_SETTIMANA.md.

## Coda di lavoro
1. **Accessibilità toast** (`/tmp/wt-toast-a11y`): fix scritti e verificati,
   giro pulito già confermato con **0 caduti** prima della scoperta del
   problema di convergenza sopra — i suoi numeri (KPI 3151, 9-suite-sum
   3.647) vanno riverificati con la stessa sequenza (il "4147"/asserzioni
   totali lì dentro non è ancora stato portato a convergenza). Prossimo
   passo: rilanciare il giro su quella worktree e applicare la stessa
   sequenza di convergenza.
2. **Campo — CLASSE_HSE** (`/tmp/wt-campo-hse`): fix scritto e verificato,
   ma il giro lì è stato lanciato IN PARALLELO con altri due (da qui la
   nota sul falso rosso di `server-orfani.mjs`) — va rilanciato da solo.
3. **Sentinella — misureDelGiornoPerReclamo/rispostaReclamo**
   (`/tmp/wt-sentinella-reclamo`): fix scritto e verificato con due
   controprove (KPI resta 3149, nessun nuovo `test()`, solo asserzioni
   aggiunte a due test esistenti). Giro completo non ancora lanciato su
   questa worktree.
4. La trappola del focus nella modale (`shared/dw-app-ui.js`, tocca tutte
   le 8 superfici — unità a parte, più rischiosa, non ancora iniziata).
5. Conti — listener accumulato su `#modal-foot` (index.html:6165, flusso
   "Scrivi il verbale") — non ancora affrontato.

## Prossimo passo atomico
Lanciare il giro (da solo, non in parallelo con altri) su
`/tmp/wt-sentinella-reclamo`, applicare la sequenza di convergenza dei
numeri se serve, commit+push+checkpoint. Poi la stessa cosa su
`/tmp/wt-campo-hse` (rilanciare da solo). Poi riverificare
`/tmp/wt-toast-a11y` con la sequenza di convergenza. Poi la trappola del
focus e il listener di Conti. Continuare "mai fermarsi".

## Blocchi
Nessuno.
