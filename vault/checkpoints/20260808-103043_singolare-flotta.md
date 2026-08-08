# Checkpoint — 2026-08-08T10:30:43Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
7517c07

## Che cosa è stato completato
**Sedici frasi di Flotta che con «1» dicevano «negli ultimi 1 giorni»**, e il
righello affilato con la seconda domanda promessa dal checkpoint precedente.

### La seconda domanda, e quanto è costata
Non «c'è una guardia **vicino**» ma «c'è una guardia **su questa variabile**»,
più lo scarto delle COSTANTI in maiuscolo. Rumore: **22 su 38 → 5 su 28**.

### E il residuo di Flotta era vero
`finestra = Math.max(1, …)` nel modulo: il valore **può essere esattamente 1**.
Anche qui la sostituzione non è meccanica — cambia la **preposizione**:
«negli ultimi 1 giorni» → «**nell'ultimo giorno**», mentre nel moltiplicatore
«3 mezzi × 1 giorni» il singolare è «giorno».
· disponibilità, affidabilità e consumi ricambi (9 frasi) **più il titolo del
  grafico dei fermi**, che *concatena* invece di interpolare e che la prima
  passata non aveva nemmeno visto;
· «Periodicità proposta: ogni **1 mesi**» — il campo è `type="number"` con
  `min="0"`: quel valore lo digita chi compila;
· «Spesa registrata in 1 mesi»; le tre frasi dei piani a ore.

### Il residuo, dichiarato per nome (5 su 28)
· `${m} mesi` da una lista letterale `[6,12,24]`;
· `${c.termine} mesi` e `${mesi} mesi` del controllo IVA — termine di legge 12
  o 24 mesi, e la frase sta dietro `mesi > c.termine`;
· `${x.quante} foto` ×2 — in italiano **«foto» è invariabile**.

## Verifica
· copia di quello che si committa, confronto patch-a-patch identico: **25
  comandi, 0 caduti**;
· `sintassi-pagine` 34/0 a ogni passo.

## Stato roadmap
Settima unità del blocco.

## Prossimo passo atomico
Il censimento del singolare è **chiuso**: resta una misura in scratchpad, non
una regola, e il perché è scritto nel commit. Il prossimo cantiere con resa
**già misurata** sono le **57 classi «non giudicabili fuori dal loro posto»**
del banco del contrasto: comporle sulle superfici che l'app dichiara (`--bg`,
`--card`, `--card2`), tenere il **caso peggiore** e stampare la **forbice**.
Resa attesa, misurata prima: **17 classi misurabili su sei app, 1 sola sotto
soglia** (`terra .avatar.ico.danger`, 3,88 nel caso peggiore, forbice 1,02).
Va aperto sapendo che vale poco.

## Blocchi
Nessuno.
