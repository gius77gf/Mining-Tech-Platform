# Checkpoint — 2026-08-08T01:45:19Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`36c7815` — *Terra: misurato l'ultimo foglio scoperto — zero trattini*

## Che cosa è stato completato

Il riepilogo annuale di Terra vive in una **finestra a parte**, e per questo
nessuna misura sui trattini lo raggiungeva. **«Non misurato» non è «a posto»**:
misurato, e sono **zero**.

Con questo il censimento si chiude. **Tutti** i fogli raggiungibili sono stati
premuti e letti, e **ogni trattino giudicato** — non contato:

| foglio | trattini | esito |
|---|---|---|
| Sentinella · report ambientale | 8 | 6 **giusti** («Ora»), **2 corretti** |
| Scudo · verbale DPI | 5 | **5 corretti** («Modello») |
| Scudo · cartella | 0 | pulita |
| Flotta · libretto macchina | 4 | **1 corretto**, 3 giusti |
| Conti · preventivo | 2 | **giusti** («Sconto») |
| Conti · DDT | 0 | pulito |
| Conti · fattura | 2 | **2 corretti** (riga a importo unico) |
| Terra · riepilogo annuale | **0** | pulito |

**10 difetti veri corretti, 11 trattini giusti, 0 aperti.**

⛔ **E gli undici «giusti» sono la metà che vale di più.** Sono i posti in cui
il prodotto **si rifiuta** di scrivere un numero comodo — la colonna «Quota»
spenta perché sommare percentuali non ha senso, l'ora facoltativa per disegno,
l'aliquota assente che su una fattura è la dichiarazione di un'operazione non
imponibile. Accusarli sarebbe stato il danno peggiore che questa notte potesse
fare: mandare a rovinare cose sane, che è esattamente ciò che CLAUDE.md dice
del righello che non sa quanto sbaglia.

## Prove

Giro `node`: **23 comandi, 0 caduti**, sulla copia di quello che si committava.
`stampe-fs --solo=terra`: 16 su 16. Documento chiuso:
`docs/I_FOGLI_CHE_NESSUN_BANCO_PREME.md`.

## Prossimo passo atomico

⛔ **Raccogliere il giro del browser** (`scratchpad/io-core/giro-5.txt`, pid
7002, porta 8823) **e rilanciarlo sul commit corrente** — quello in corso parte
da un `HEAD` di oltre cinquanta commit fa, quindi il suo verde non riguarda
quello che c'è adesso. Ordine: prima le righe **«non ho guardato»**
(denominatori, superfici non raggiunte, «0 su N»), poi i KO, distinguendo le
**controprove**, dove il rosso è quello voluto — l'intestazione lo dichiara.

Poi:

1. ⏱️ **Trasformare le misure in regole.** Oggi i trattini sono una **regola**
   su Sentinella e Scudo, e solo una **misura stampata** su Flotta, Conti e
   Terra. Prima di stringere, la regola di casa: **contare gli allarmi** e
   dichiarare per nome le colonne in cui il vuoto è una risposta — «Sconto» per
   Conti, «Quota» per Flotta — perché una regola unica appiattirebbe verdetti
   che oggi sono opposti.
2. ⏱️ **La seconda domanda sui RIFERIMENTI in `nomi-liberi`**, non solo sulle
   chiamate: un `const x = pippo` con `pippo` inesistente non lo vede nessuno.
   Dichiarato nell'intestazione dalla prima stesura e mai misurato — prima di
   scriverlo, **contare gli allarmi su una copia**, perché lì il rumore atteso
   è molto più alto che sulle chiamate.

## Blocchi
Nessuno.
