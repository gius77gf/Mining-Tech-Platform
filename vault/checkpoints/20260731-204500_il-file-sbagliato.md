# Checkpoint — il file sbagliato, e una misura che dice di NON irrigidire

- **Tipo**: tre unità sulla stessa domanda
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `677c4ec` (le prove con l'emulatore ricontate), `9fb9cd3` (il
  listino non accetta più il file sbagliato), `92f910d` (il messaggio a chi
  carica), + la misura degli incroci

## Il difetto più grosso della giornata, e non faceva rumore

Ri-caricando nel **listino** di Conti il **prospetto dei prezzi** — che è un
altro file, con le colonne in un altro ordine — **entravano tutti i prodotti**,
con prezzo **zero** e con l'**IVA presa dalla colonna del prezzo**:
«Stabilizzato 0/30» con IVA 8,5%. Un listino intero sbagliato, pronto per
finire in un DDT e poi in una fattura, **senza un solo avviso**.

La causa era lo **zero di comodo**: un prezzo illeggibile diventava 0 e la riga
entrava lo stesso. È esattamente la regola che avevo scritto **ieri** per i
ricambi di Flotta — *«uno zero farebbe sembrare gratis un pezzo che non lo è»* —
e nel listino non valeva, cioè nel posto dove pesa di più.

Adesso senza un prezzo leggibile la riga non entra; nel file sbagliato non ne
entra nessuna, e il messaggio nomina il caso vero: *«se stai caricando il file
prezzi convertiti, non è quello giusto»*. Dire quali colonne servono è corretto
ma non basta: chi ha appena scaricato un file **dall'app** non pensa di aver
sbagliato file. Uno zero **scritto apposta** entra ancora: è una decisione di
chi compila.

## La misura generale, e perché mi sono fermato

Provate **tutte** le combinazioni — 32 file scaricati × 17 lettori — in **109**
casi l'intestazione di un file estraneo verrebbe letta come un dato.

Il numero da solo spaventa più di quanto serva, e va detto con precisione: **non
è un difetto che scatta da solo**, succede solo caricando un file nel posto
sbagliato. Ho provato a scrivere una regola generica che riconoscesse «una riga
che sembra un'intestazione», e l'ho **scartata**: ogni versione aveva falsi
positivi veri — una riga come `Bianchi;capocava;` è fatta di parole esattamente
come un'intestazione, e verrebbe buttata via.

**Misurare prima di irrigidire vale anche quando la misura dice di non
irrigidire.** Restano le due difese che funzionano: ogni file scaricato ha un
nome diverso dagli altri (regola 13), e quando le colonne non tornano l'app dice
quali servono invece di caricare a metà.

## Le prove con l'emulatore: erano quattro suite, non una

Il numero «58» era giusto ma parziale — è `run.mjs`, le regole di sicurezza.
Accanto ce ne sono altre tre: 19 sull'SDK, 21 sulle funzioni, 8 sul primo
avvio. **106 in tutto**, e nessun documento le nominava: un prodotto che si
presenta con meno di quello che ha è il difetto simmetrico di quello che si teme
di solito.

⚠️ Detto anche quello che **non** si è potuto fare: in questo ambiente
`firebase emulators:exec` cade su una chiamata bloccata dalla rete di lavoro. Il
106 è **contato sui file**, non su un'esecuzione di oggi, e la distinzione resta
scritta nei documenti: *«contate» e «passate» non sono la stessa cosa*.

## Dove siamo con le prove

**KPI 402**, **Stile 149**, e le altre quattro suite senza rete a 82: **633**
in tutto. Tredici banchi del browser, con il giro definitivo in corso.

## Prossimo passo atomico

Leggere il **RIEPILOGO del giro definitivo** (in corso) e sistemare quello che è
rosso. Poi, se è verde: il prossimo buco documentato è che **pesate/DDT,
incassi e clienti di Conti non hanno un file che si ri-carica** — ma quello è la
**decisione 12** del fondatore, non una scelta mia.

## Bloccanti

- Nessuno. La verifica delle 106 prove con l'emulatore resta impossibile in
  questo ambiente (rete), e va rifatta dove l'emulatore parte.
