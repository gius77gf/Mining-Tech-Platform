# Checkpoint — 2026-08-08 20:15 UTC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`4a5175a` — la forma che decideva al posto dell'esistenza in sei app, la
regola 30 che la tiene fuori, e le copie dei giri morti

## 1 · Venti punti in sei app, adesso zero

Dopo gli otto di Flotta sono stati letti **uno per uno** gli altri dodici:
**Scudo 4, Genesi 3, Sentinella 2, Terra 2, Campo 1**. Tutti la stessa
decisione — *«ha una data?»* risposta dalla **forma** invece che
dall'**esistenza** — e i posti dicono perché conta:

- **sei sono guardie sull'ingresso** («Serve una data valida», «Serve la data
  prevista della volata»): sono quelle che decidono se una data impossibile
  **entra in archivio**;
- **una data il file che Sentinella importa** da Genesi;
- le altre scelgono la scadenza, il precompilato, la data del visore.

⛔ Il caso più eloquente: il **modulo** di Genesi questa regola l'aveva imparata
il **03/08** — il commento in cima a `genesi-data.js` lo racconta per esteso —
mentre la **pagina** teneva ancora la copia più debole in tre punti. *La forma
peggiore del difetto non è l'invenzione: è la copia più debole di una regola che
sta già in casa.*

**Regola 30** di `run-stile`, con la controprova nei due versi: la vede rimessa
in una pagina vera (Terra, «315 passati, 1 falliti») e **non accusa un
commento**. Il costo della stretta è stato misurato **prima**: dopo la
correzione le occorrenze sono **zero su otto superfici**, quindi la regola nasce
senza nessun falso allarme da dichiarare. Stile **314 → 316**; i tre documenti
sorvegliati aggiornati a **2.355**.

## 2 · Settantuno copie di giri morti, 1,3 GB

Trovate **fermando** un giro. In fondo a `tutti.mjs` c'è scritto che la copia si
toglie «SEMPRE, anche se il giro è caduto» — e quella riga vale per un giro che
**arriva** in fondo: un `SIGKILL`, o una sessione che finisce, non esegue nessun
`finally`.

⛔ E su questa macchina il disco è un'**allocazione fissa**: quando finisce, le
**scritture** falliscono mentre `df` mostra spazio libero. Il costo non è
l'ordine: è un giro che un giorno muore per un motivo che non c'entra niente.

L'unico momento in cui qualcuno può pulire è **l'avvio del giro successivo**, e
adesso è lì. Si toglie solo ciò che ha il nome del giro (`giro-copia-<pid>`)
**e il cui pid non è più vivo**: la copia di un giro che sta girando adesso non
si tocca, se no sarebbe la famiglia del server riusato — un giro che sabota
l'altro. Controprova nei due versi: pid morto → tolta, pid vivo → intatta.

## La regola di casa che avevo violato, e che si è ripagata

«Il giro completo si lancia **una volta per blocco, alla fine**, mai mentre si
lavora.» Lanciandolo a metà blocco ho fatto durare ogni giro `node` **venti
minuti invece di due**. L'ho fermato per questo — e le 71 copie le ho viste solo
perché mi sono fermato a guardare.

## Prossimo passo atomico

Rilanciare il giro del browser **adesso che il blocco è quasi chiuso**, sul
commit di adesso, e leggerlo con `leggi-giro.mjs`: sezione 0 (quanto è vecchio —
dovrebbe dire «fresco»), poi le righe «non ho guardato», poi i KO. La domanda da
portarci dentro: **quali controprove non sanno fallire** sul codice di oggi.

## Blocchi

Nessuno.
