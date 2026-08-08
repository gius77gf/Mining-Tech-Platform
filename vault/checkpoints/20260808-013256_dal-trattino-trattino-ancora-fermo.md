# Checkpoint — 2026-08-08T01:32:56Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`e27fe4a` — *Flotta: «dal — — ancora fermo» sul libretto che si porta a chi compra*

## Che cosa è stato completato

Localizzati i quattro trattini «fuori tabella» del libretto macchina — il passo
che il checkpoint precedente diceva di fare **prima** di giudicare — e uno era
un difetto vero.

**Il difetto.** Un fermo senza data d'inizio usciva sul foglio stampato
letteralmente:

    Guasto meccanico · dal — — ancora fermo

Due cose in una: un trattino al posto della data — che su un **libretto
macchina**, il foglio che si porta a chi compra la macchina, si legge come una
data che non conta, mentre la verità è che nessuno l'ha scritta — e la frase
che si **spezza a metà**.

**La causa era il segno che serviva**: la frase si componeva con
`dataIt(x.inizio)` **a mano in due punti** (l'elenco dei fermi e il foglio). La
stessa frase in due posti è la copia debole di CLAUDE.md, dentro una pagina
sola. Ora è `quandoFermo`, scritta una volta e usata da tutt'e due; su una data
che non si può leggere scrive **«senza data d'inizio registrata»**.

⚠️ Raggiungibilità **dichiarata**: il form pretende la data d'inizio, quindi
oggi il caso arriva da dati vecchi — latente, non impossibile.

**Gli altri tre trattini sono giusti**: due sono le tessere «Consumo» e
«Gasolio», che è la convenzione onesta per «non calcolabile», e il terzo è il
conto dei giorni di quel fermo — che senza la data d'inizio **non si può
calcolare**, ed è esattamente ciò che deve dire.

## ⛔ E il controllo scritto stanotte ha preso il MIO errore

Scrivendo `quandoFermo` ho usato `dataISOEsiste` **senza importarla** in
Flotta. `nomi-liberi` è diventato **rosso al primo giro** — è precisamente la
famiglia per cui esiste (un nome chiamato che non esiste, la pagina che muore
al primo tocco), e stavolta l'ha vista **prima del commit** invece che una
settimana dopo, come era successo con `chiediDati` e con `conta`.

## E due migliorie al righello, nate dalla stessa misura

- il banco **localizza** i trattini fuori tabella («fuori tabella: CONSUMO»)
  invece di scrivere «(fuori tabella)»: un banco che dice **dove** non ha
  guardato è inutile quanto uno che non guarda;
- il selettore di Flotta è ristretto a **`#page-sch`** — il foglio vero, che il
  `@media print` della pagina dichiara — invece di `body`, che portava dentro
  pezzi di schermo. Da 15 trattini a 4, e i 10 di «Quota» spariscono perché non
  erano nel foglio.

## Prove

Giro `node`: **23 comandi, 0 caduti**, sulla copia di quello che si committava.
`stampe-fs --solo=flotta`: 12 su 12. `nomi-liberi` 12 su 12 dopo la correzione,
`import-esistenti` 140 su 140 (1.107 nomi verificati).

## Prossimo passo atomico

⛔ **Raccogliere il giro del browser** (`scratchpad/io-core/giro-5.txt`, pid
7002, porta 8823) **e rilanciarlo sul commit corrente** — quello in corso parte
da un `HEAD` di oltre quaranta commit fa. Ordine: prima le righe **«non ho
guardato»**, poi i KO, distinguendo le **controprove**.

Poi:

1. ⏱️ **La riga «importo unico» della fattura di Conti**: due trattini su
   «Quantità» e «Prezzo unitario» dove il dettaglio non esiste **per scelta** —
   ma la riga non lo dice. Documento fiscale: si legge il codice prima di
   toccarlo.
2. ⏱️ **La denuncia di Terra**, che nessuna misura sui trattini raggiunge (apre
   una finestra nuova; la sezione che raccoglie il popup c'è già).
3. ⏱️ **La seconda domanda sui RIFERIMENTI in `nomi-liberi`**, non solo sulle
   chiamate — misurando prima gli allarmi su una copia.

## Blocchi
Nessuno.
