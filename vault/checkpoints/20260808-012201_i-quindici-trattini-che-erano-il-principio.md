# Checkpoint — 2026-08-08T01:22:01Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`d974936` — *Flotta: i 15 trattini «Quota» erano il principio applicato, non un difetto*

## Che cosa è stato completato

Guardato uno per uno il candidato col conto più alto — i **15 trattini** del
libretto macchina di Flotta — e **il verdetto si è ribaltato**.

La colonna «Quota» di quel grafico è **spenta di proposito** (`quota: false`),
e il commento accanto porta la misura che l'ha fatta spegnere:

> *una giornata all'83% si dichiarava «quota 12,8%» sul totale di 650, e la
> giornata a 0 mezzi operativi «quota 0,0%» — cioè il numero più tranquillo che
> questa schermata sappia dire proprio sul giorno in cui la cava era ferma.*

Sommare percentuali non ha senso, quindi la quota sul totale **non esiste**: il
«—» lì è l'app che si **rifiuta** di scrivere un numero comodo. È il principio
del fondatore nella sua forma migliore, e accusarlo sarebbe stato **mandare a
rovinare una cosa sana** — il danno che CLAUDE.md descrive per il righello che
non sa quanto sbaglia.

⚠️ **E il righello era largo.** La misura guardava `body` in `@media print`,
cioè **tutta la pagina** e non il foglio. Dichiarando «Quota» come colonna
ammessa i quindici si dividono: **10 in «Quota»** (giusti) e **5 fuori da
qualunque tabella**, che il banco non sa ancora localizzare — e finché non lo
dice, **non si giudicano**. Scritto nel commento perché quella misura non
diventi una regola così com'è: ristretta al `body` accuserebbe lo **schermo**
credendo di guardare la **stampa**.

## Bilancio dei trattini all'08/08

| app | esito |
|---|---|
| Sentinella | 6 **giusti** (colonna «Ora», facoltativa per disegno) + 2 **corretti** |
| Scudo | 5 **corretti**, 0 restanti |
| Flotta | 10 **giusti** + 5 **da localizzare** |
| Conti | 2 **giusti** (sconto), 0 sul DDT, **2 candidati** (fattura a importo unico) |
| Terra | **non misurata** — apre una finestra nuova |

Cioè: su 30 trattini guardati, **9 erano difetti veri e corretti**, **18
giusti**, **3 restano aperti e dichiarati**. Il rapporto conta più del totale:
un trattino su tre era una faccia tranquilla, e due su tre erano il prodotto
che diceva la verità.

## Prove

Giro `node`: **23 comandi, 0 caduti**, sulla copia di quello che si committava.
Banco `stampe-fs --solo=flotta`: 12 su 12.

## Prossimo passo atomico

⛔ **Raccogliere il giro del browser** (`scratchpad/io-core/giro-5.txt`, pid
7002, porta 8823) **e rilanciarlo sul commit corrente** — quello in corso parte
da un `HEAD` di oltre quaranta commit fa. Ordine: prima le righe **«non ho
guardato»**, poi i KO, distinguendo le **controprove**.

Poi, in ordine di valore:

1. ⏱️ **I 5 trattini «fuori tabella» di Flotta**: prima si **restringe il
   selettore** al contenitore del foglio, poi si guarda che cosa resta. Senza
   quel passo si giudica lo schermo credendo di giudicare la stampa.
2. ⏱️ **La riga «importo unico» della fattura di Conti**: dire sulla riga che
   il dettaglio non c'è **per scelta**, invece di due trattini. Documento
   fiscale: si legge il codice prima di toccarlo.
3. ⏱️ **La denuncia di Terra**, che nessuna misura sui trattini raggiunge:
   apre una finestra nuova, e la sezione che raccoglie il popup c'è già.
4. ⏱️ **La seconda domanda sui RIFERIMENTI in `nomi-liberi`** — misurando prima
   gli allarmi su una copia.

## Blocchi
Nessuno.
