# Checkpoint — 2026-08-08T01:51:38Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`1ab3654` — *stampe-fs: i trattini diventano regola anche su Conti e Terra*

## Che cosa è stato completato

Le misure sono diventate **regole**, ma solo dove il giudizio era chiuso — e
con le colonne ammesse dichiarate **per nome**, non con una soglia larga:

- **Conti**, tutti e tre i fogli: soglia **zero** fuori da «Sconto», l'unica
  colonna in cui il vuoto è uno **stato vero** («nessuno sconto» non è un dato
  mancante). Il preventivo ne ha 2 lì, DDT e fattura zero;
- **Terra**, riepilogo annuale: soglia **zero** senza nessuna colonna ammessa —
  qui non ne serve, e se un giorno servisse va dichiarata per nome.

⛔ **Flotta resta una MISURA, e la ragione è scritta.** Dei quattro trattini
rimasti, tre sono **legittimi** ma stanno **fuori da qualunque tabella**: le
tessere «Consumo» e «Gasolio», e il conto dei giorni di un fermo senza data
d'inizio. Un elenco di colonne ammesse dovrebbe nominare **testo di pagina**
invece di intestazioni — è fragile, e una regola fragile che sbaglia insegna a
non guardarla. È la stessa ragione per cui l'ampiezza di un controllo si
**misura** invece di deciderla a priori.

Banco `stampe-fs` **76 → 82** prove.

## Prove

Giro `node`: **23 comandi, 0 caduti**, sulla copia di quello che si committava.
`--solo=conti` 22 su 22, `--solo=terra` 17 su 17.

## Prossimo passo atomico

⛔ **Raccogliere il giro del browser** (`scratchpad/io-core/giro-5.txt`, pid
7002, porta 8823) **e rilanciarlo sul commit corrente** — quello in corso parte
da un `HEAD` di oltre cinquanta commit fa, quindi il suo verde non riguarda
quello che c'è adesso. Ordine: prima le righe **«non ho guardato»**
(denominatori, superfici non raggiunte, «0 su N»), poi i KO, distinguendo le
**controprove**, dove il rosso è quello voluto — l'intestazione lo dichiara.

Poi:

1. ⏱️ **Le controprove delle regole nuove**: quelle di Sentinella e Scudo hanno
   la loro iniezione in `DIFETTI`; Conti e Terra no — la regola c'è e **non è
   ancora stata provata contro il difetto**. Una prova che non sa fallire non
   dimostra niente, ed è la regola più vecchia di questa casa.
   ⚠️ E l'iniezione va messa **dentro la chiave che già esiste** per quel file:
   una seconda voce con la stessa chiave in un oggetto letterale **cancella la
   prima senza far rumore** — costato mezz'ora stanotte.
2. ⏱️ **La seconda domanda sui RIFERIMENTI in `nomi-liberi`**, non solo sulle
   chiamate — misurando prima gli allarmi su una copia.

## Blocchi
Nessuno.
