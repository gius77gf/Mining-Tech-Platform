# Checkpoint — 2026-08-08T01:57:43Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`290f72b` — *stampe-fs: la controprova della regola nuova di Conti*

## Che cosa è stato completato

Una regola senza la sua controprova è una riga che **non si sa se sappia
fallire**, ed è la regola più vecchia di questa casa. Rimessi i due trattini
della riga a **importo unico** — il difetto vero corretto un'ora prima — la
regola cade e **nomina le colonne colpevoli**: `["QUANTITÀ","PREZZO
UNITARIO"]`. **2 difetti rimessi, 0 iniezioni mancate.**

⚠️ **L'iniezione sta in una chiave nuova, e l'ho guardato prima di scriverla.**
`DIFETTI` non aveva ancora Conti — le voci `apps/conti/index.html` che
esistevano stanno in `COME_LIVE`, che è l'altra tabella. Una seconda voce con
la stessa chiave in un oggetto letterale **cancella la prima senza far rumore**,
ed è già costato mezz'ora stanotte: la lezione ha funzionato al primo riuso.

⏱️ **Resta senza controprova la regola di Terra**, e la ragione è che sul suo
riepilogo i trattini sono **zero**: non c'è un difetto vero da rimettere, e
inventarne uno proverebbe il **rilevatore**, non il prodotto. **Dichiarato
invece che simulato** — un banco che si autocertifica su un difetto finto dice
meno di uno che dichiara di non aver potuto provare.

## Prove

Giro `node`: **23 comandi, 0 caduti**, sulla copia di quello che si committava.
`stampe-fs --solo=conti`: 22 su 22 sano, **7 KO** in controprova.

## Prossimo passo atomico

⛔ **Raccogliere il giro del browser** (`scratchpad/io-core/giro-5.txt`, pid
7002, porta 8823) **e rilanciarlo sul commit corrente** — quello in corso parte
da un `HEAD` di oltre cinquanta commit fa, quindi il suo verde non riguarda
quello che c'è adesso. Ordine: prima le righe **«non ho guardato»**
(denominatori, superfici non raggiunte, «0 su N»), poi i KO, distinguendo le
**controprove**, dove il rosso è quello voluto — l'intestazione lo dichiara.

Poi:

1. ⏱️ **La seconda domanda sui RIFERIMENTI in `nomi-liberi`**, non solo sulle
   chiamate: un `const x = pippo` con `pippo` inesistente non lo vede nessuno.
   Dichiarato nell'intestazione dalla prima stesura e **mai misurato** — prima
   di scriverlo, **contare gli allarmi su una copia**, perché lì il rumore
   atteso è molto più alto che sulle chiamate.
2. ⏱️ **La regola dei trattini su Flotta**, oggi ferma a misura: i tre
   legittimi stanno **fuori da qualunque tabella**, quindi servirebbe un elenco
   che nomina testo di pagina — fragile. La via che regge è dare a quelle
   tessere un'**intestazione leggibile dal DOM**, non allargare la regola.

## Blocchi
Nessuno.
