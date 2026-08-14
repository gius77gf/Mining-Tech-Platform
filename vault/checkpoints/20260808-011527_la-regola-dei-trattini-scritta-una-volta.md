# Checkpoint — 2026-08-08T01:15:27Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`ce62251` — *stampe-fs: la regola dei trattini scritta UNA volta, e la misura sugli altri fogli*

## Che cosa è stato completato

**La regola scritta una volta sola.** Me n'ero accorto **dopo** averla copiata
due volte — Sentinella e Scudo, a un'ora di distanza — ed è il modo in cui
nascono le divergenze. Ora è `TRATTINI`, accanto a `TAGLIATI`, con l'elenco
**dichiarato** delle colonne in cui il vuoto è una risposta vera: «Ora» per
Sentinella (facoltativa per disegno fin dall'import), «Taglia» per Scudo
(«unica» esiste davvero come risposta). Restituisce anche i **nomi** delle
colonne colpevoli: un numero nudo non dice dove guardare.

⚠️ **E la firma vuole UN argomento solo.** `pg.evaluate(fn, x)` ne passa uno:
scritta a due parametri, `ammesse` sarebbe arrivata `undefined` e la guardia
avrebbe accusato **proprio le colonne legittime** — il rosso falso, che costa
quanto il verde falso.

**La misura sugli altri fogli**, che gira come misura e **non** ancora come
regola, perché il giudizio è foglio per foglio:

| foglio | trattini | dove | giudizio |
|---|---|---|---|
| Flotta · libretto macchina | 15 | «Quota» | **da guardare** |
| Conti · preventivo | 2 | «Sconto» | **giusti** — «nessuno sconto» è uno stato vero |
| Conti · DDT | 0 | — | pulito |
| Conti · fattura | 2 | «Quantità», «Prezzo unitario» | **da guardare** |
| Terra · denuncia | non misurato | — | apre una finestra nuova |

I due della fattura stanno sulla **riga unica** delle fatture registrate a
*importo unico*, dove il dettaglio non esiste **per scelta** — ma la riga non
lo dice, ed è la stessa forma dei «superamenti —» corretti un'ora prima.

⛔ **Nessuno dei due è stato corretto, di proposito**: un trattino si
**giudica**, non si conta, e su un documento fiscale il giudizio va fatto con
calma. Sono **candidati**, dichiarati in `docs/I_FOGLI_CHE_NESSUN_BANCO_PREME.md`
con la ragione — non lavoro saltato.

## Prove

Banco `stampe-fs`: **76 su 76**, 0 KO. Giro `node`: **23 comandi, 0 caduti**,
sulla copia di quello che si committava.

## Prossimo passo atomico

⛔ **Raccogliere il giro del browser** (`scratchpad/io-core/giro-5.txt`, pid
7002, porta 8823) **e rilanciarlo sul commit corrente** — quello in corso parte
da un `HEAD` di oltre quaranta commit fa, quindi il suo verde non riguarda
quello che c'è adesso. Ordine: prima le righe **«non ho guardato»**
(denominatori, superfici non raggiunte, «0 su N»), poi i KO, distinguendo le
**controprove**, dove il rosso è quello voluto.

Poi, i candidati e i rimandati, in ordine di valore:

1. ⏱️ **I 15 trattini «Quota» del libretto macchina di Flotta** — il conto più
   alto dei tre, e non ancora guardato uno per uno.
2. ⏱️ **La riga «importo unico» della fattura di Conti**: dire sulla riga che
   il dettaglio non c'è **per scelta**, invece di due trattini. Documento
   fiscale: si legge il codice prima di toccarlo.
3. ⏱️ **La denuncia di Terra**, che il banco non misura per i trattini: apre
   una finestra nuova, e la sezione che raccoglie il popup c'è già.
4. ⏱️ **La seconda domanda sui RIFERIMENTI in `nomi-liberi`**, non solo sulle
   chiamate — misurando prima gli allarmi su una copia, perché lì il rumore
   atteso è molto più alto.

## Blocchi
Nessuno.
