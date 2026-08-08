# Checkpoint — 2026-08-08T01:39:07Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`4c1bb43` — *Conti: sulla fattura a importo unico, «non dettagliata» invece di due trattini*

## Che cosa è stato completato

Chiusi gli **ultimi due trattini non giudicati** dei cinque fogli stampati. La
riga esce quando una fattura è registrata a **importo unico**, senza il
dettaglio delle righe: quantità e prezzo unitario **non mancano per sbaglio,
non ci sono per scelta**. Due trattini in mezzo a una tabella di numeri si
leggono «niente da segnalare», e su un **documento fiscale** la differenza fra
«non dettagliato» e «vuoto» la nota chi lo legge.

⚠️ **E nella stessa riga l'aliquota il trattino lo TIENE**, per una decisione
già scritta dodici righe più su: su una fattura un'aliquota che non c'è è la
dichiarazione di un'**operazione non imponibile**, cioè una cosa vera e non
un'assenza. Tre celle vicine, **due risposte diverse** — ed è la ragione per
cui un trattino si giudica e non si conta.

## Il bilancio dei trattini, chiuso

| app | esito finale |
|---|---|
| Sentinella | 6 **giusti** (colonna «Ora») + 2 **corretti** |
| Scudo | 5 **corretti**, 0 restanti |
| Flotta | 10 **fuori dal foglio** (righello ristretto a `#page-sch`) + 1 **corretto** + 3 **giusti** |
| Conti | 2 **giusti** (sconto), 0 sul DDT, 2 **corretti** (fattura) |
| Terra | **non misurata** — apre una finestra nuova |

**11 difetti veri corretti, 11 giusti, 10 che non erano nel foglio, 0 aperti**
sui quattro fogli raggiunti. Terra resta l'unica non misurata, e la ragione è
tecnica e dichiarata.

## Prove

Giro `node`: **23 comandi, 0 caduti**, sulla copia di quello che si committava.
`stampe-fs --solo=conti`: 19 su 19, e la fattura passa da 2 trattini a **0**.

## Prossimo passo atomico

⛔ **Raccogliere il giro del browser** (`scratchpad/io-core/giro-5.txt`, pid
7002, porta 8823) **e rilanciarlo sul commit corrente** — quello in corso parte
da un `HEAD` di oltre quaranta commit fa, quindi il suo verde non riguarda
quello che c'è adesso. Ordine: prima le righe **«non ho guardato»**
(denominatori, superfici non raggiunte, «0 su N»), poi i KO, distinguendo le
**controprove**, dove il rosso è quello voluto.

Poi:

1. ⏱️ **La denuncia di Terra**, l'unico foglio che nessuna misura sui trattini
   raggiunge: apre una **finestra nuova**, e la sezione di `stampe-fs` che
   raccoglie il popup c'è già — va solo puntata la stessa domanda.
2. ⏱️ **Trasformare le misure in regole**: oggi i trattini sono una regola su
   Sentinella e Scudo, e solo una **misura stampata** su Flotta e Conti. Prima
   di stringere, la regola di casa: **contare gli allarmi** e dichiarare per
   nome le colonne in cui il vuoto è una risposta («Sconto» per Conti, «Quota»
   per Flotta).
3. ⏱️ **La seconda domanda sui RIFERIMENTI in `nomi-liberi`**, non solo sulle
   chiamate — misurando prima gli allarmi su una copia.

## Blocchi
Nessuno.
