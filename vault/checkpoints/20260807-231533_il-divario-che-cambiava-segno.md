# Checkpoint — 2026-08-07T23:15:33Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`74aa564` — *Terra: il lotto senza volume faceva cambiare SEGNO al divario di recupero*

## Che cosa è stato completato

`divarioRecupero` di Terra contava a parte i lotti **senza superficie
dichiarata** (`senzaMq`) e nel suo commento spiegava perché: *«un divario
calcolato su tre lotti quando ce ne sono sei è più piccolo del vero, cioè di
nuovo la buona notizia»*. La riga accanto — i **metri cubi** — usa lo stesso
aiuto `somma`, con `(+x[campo] || 0)`: un lotto che il volume non lo dichiara
valeva **zero m³**, e il divario scendeva senza dirlo.

⛔ **E aperta la pagina, non era «più piccolo»: era capovolto.** Tolto il
volume di `lo5` (iniezione nella **risposta HTTP** del proprio server, mai sul
file — il giro del browser stava girando su un'altra porta), il Piano scriveva
**-43.000 m³** dove il vero è **+97.000**: il divario **cambia segno** e si
legge «il recupero è avanti in volume», che è esattamente il contrario. Il
numero tranquillo nella sua forma peggiore.

Non è un caso di laboratorio: il form scrive `volumeM3: m3.ok ? m3.valore :
null`, quindi è uno stato **previsto** dal prodotto (`avanzamentoLotto` ha già
la frase apposta). Invisibile solo perché tutti e sei i lotti della
dimostrazione un volume ce l'hanno — la stessa ragione per cui le barre dei
grafici sembravano sane finché non c'è stata una barra alta.

Fatto:
- `senzaM3` in `apps/terra/terra-data.js`, in **tutt'e due** i `return`
  (compreso quello vuoto, se no la pagina legge `undefined`);
- la riga d'avviso gemella in `apps/terra/index.html`, subito sotto quella dei
  m². **Misurata resa, non dedotta**: sonda che apre la sezione Piano e legge
  la frase dal DOM (`innerText` del `body` — la prima passata rispondeva NO
  perché la sezione non era aperta e `innerText` su un nodo nascosto ricade su
  `textContent`), più lo screenshot **guardato**;
- **sei asserzioni** nuove in `run-kpi.mjs`, dentro un `test()` solo: il caso
  sano, il caso muto, il numero che **non si muove** (che è il punto), il
  ritorno a 70.000 se il volume ci fosse, «un lotto ancora **previsto** non è
  una mancanza», e il caso della dimostrazione col segno che si gira;
- controprova: rimessa la bandiera a `const senzaM3 = 0;` → la prova cade
  («atteso 1, ottenuto 0»); l'iniettore **stampa quanti caratteri ha tolto**
  e si ferma se non sostituisce niente; ripristino **da copia** con `diff -q`
  più `grep -c` sulla riga che doveva tornare, non `git checkout`.

Verifica sulla **copia di quello che si committava** (`git worktree` +
`git diff --cached | git apply` + `git add -A`): giro `node` **23 comandi, 0
caduti**.

## Numeri riallineati (⚠️ non a memoria: lanciando le suite)

- `run-kpi` **1886 → 1887**; totale delle sei suite che contano asserzioni
  **2.303 → 2.304** in `docs/DEVELOPMENT.md`, `docs/STATO_PRODOTTO.md`,
  `docs/DECISIONI_WEEKEND.md` (i tre che `numeri-nei-documenti.mjs` sorveglia
  — il terzo no, ma il numero è lo stesso e restare indietro lo rende falso);
- nella **roadmap** — che quel controllo **non** guarda, ed era ferma a 2.298 e
  «149 banchi» — anche il conto dei banchi: **153 esecuzioni**, **71 file
  distinti** letti dalla tabella `BANCHI` di `tutti.mjs`. ⚠️ La cartella ne ha
  **75**: la differenza sono gli aiuti (`giro.mjs`, `impronta.mjs`, il runner),
  e contarli sarebbe stata l'ennesima **etichetta più larga del suo numero**.

## Direttiva 7 — la riga che l'aveva proposta

Aggiornato `docs/PIANO_LOTTI_TERRA.md`, dove `divarioRecupero` è dichiarata
«quella su cui si gioca l'onestà della schermata»: adesso la pagina dice anche
che quell'onestà era scritta **a metà**, con la misura del segno che si gira.
La proposta veniva da un mio checkpoint precedente (riga ⏱️, «non ancora
verificata»): verificata, vera, chiusa.

## Prossimo passo atomico

⛔ **Raccogliere il giro del browser** che sta girando in
`scratchpad/io-core/giro-5.txt` (porta 8823, pid 7002), **e poi rilanciarlo sul
commit corrente**: quello in corso parte da un `HEAD` di oltre trenta commit
fa, quindi il suo verde non riguarda quello che c'è adesso. Nell'ordine
prescritto: prima le righe **«non ho guardato»** (denominatori, superfici non
raggiunte, «0 su N»), poi i KO — e distinguendo le **controprove**, dove il
rosso è quello voluto: l'intestazione adesso lo dichiara, non va indovinato
dal testo.

Poi, in coda, i due rimandati ancora **non verificati da me** (proposti da un
cantiere, e per regola non entrano sulla parola dell'agente):

- ⏱️ **Terra · `csvRilievi`**: la guardia sarebbe unilaterale
  (`volumeM3 == null || !Number.isFinite(+r.volumeM3)` non copre `""`), e il
  messaggio direbbe «8 rilievi» mentre il lettore ne restituisce **7**;
- ⏱️ **Scudo · verbale DPI**: «Consegnato il» scriverebbe «—» su una data
  assente, mentre la colonna accanto è stata corretta il 03/08 per esattamente
  questo.

## Blocchi
Nessuno.
