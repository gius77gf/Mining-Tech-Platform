# Checkpoint — 2026-08-08T06:14:37Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`b646f9e` — *campo-foglio-turno: i soggetti del modo erano TRE, e il commento
diceva DUE*

## Che cosa è stato completato

Primo KO del giro raccolto e chiuso — ed è **più interessante di quello che
sembrava**.

Il registro dava tre KO per giro, uno per passata: *«consegna_turno.txt →
DATI-DI-ESEMPIO_consegna_turno.txt»*. Sembrava il banco invecchiato («un banco
che porta dentro un numero atteso invecchia col crescere della dimostrazione»),
e in parte lo era. Sotto c'era una cosa più seria.

`--live` fa credere a Campo di essere in produzione, per provare che i fogli
escono **puliti**, e iniettava il modo in **due** posti: il riquadro del foglio
stampato e la riga in cima alla consegna `.txt`. Ma dal 06/08 i posti che
chiedono il modo sono **tre**: c'è anche il **nome del file**
(`marchiaCsv` → `nomeCsvDimostrazione(el.download, db.mode)`).

> Il commento del banco diceva testualmente **«I SOGGETTI SONO DUE, non uno»**
> — proprio mentre ne mancava uno.

## L'effetto era doppio, e in due direzioni opposte

- nella passata normale l'asserzione pretendeva il nome **esatto** e cadeva sul
  marchio che il prodotto mette **di proposito**: un banco che accusa il
  prodotto per una cosa che ha fatto il prodotto;
- nella passata `--live` il nome restava **marchiato** anche fingendo la
  produzione, perché l'iniezione non arrivava lì: il banco **non poteva
  accorgersi** se il nome smettesse di obbedire al modo. Il verde diceva «i
  fogli escono puliti» **avendo guardato due vestiti su tre**.

La seconda metà è quella che vale: non solo accusava a torto, ma **aveva
smesso di guardare**.

## La correzione

1. il terzo soggetto entra in `COME_LIVE`;
2. l'asserzione diventa **più giusta, non più permissiva**: uguaglianza esatta
   in tutt'e due i versi — in dimostrazione il marchio **deve** esserci, sui
   dati veri **non** deve — invece di un suffisso che passerebbe comunque.

## Prove

- **35 su 35 in tutt'e due le passate**, dove prima ce n'era una rossa per
  passata.
- Le iniezioni «come live» passano da 6 a **9**: il terzo soggetto adesso viene
  davvero toccato, e il file esce **pulito**.
- Giro `node` sulla copia di quello che si committava: **23 comandi, 0 caduti**.

⚠️ **Il prodotto non è stato toccato.** Campo obbedisce al modo anche sul nome
del file; quello che mancava era chi lo verificasse.

## In volo

⏳ Il **giro del browser**, porta **8823**, pid 28054, oltre tre ore di
cammino. Il registro non ha ancora scritto la riga d'uscita.

## Prossimo passo atomico

⛔ **Raccogliere `giro-7.txt` appena finisce**, con
`node apps/deepwork-id/tests/browser/leggi-giro.mjs <registro>`.
Dei quattro KO provvisori, **due sono chiusi qui** (erano lo stesso difetto in
due passate; il terzo è la passata `--controprova`, che il lettore già
escludeva). Restano da guardare:
1. `i documenti che escono dal core` — «lo SCHERMO dice il totale e la sua
   riserva ("12 fori · almeno 56 kg · 1.240,3 mc")»: da capire se è il banco o
   il documento;
2. `unità in maiuscolo` — terra: «Volume rimesso per il recupero (m³)» in
   maiuscolo, «dentro c'è m³». Questa **tocca la pagina di Terra**, quindi va
   fatta a giro fermo.

Poi:
- ⏱️ **Togliere le 59 righe inerti** (import mai usati) e portare la quinta
  domanda di `nomi-liberi` a regola.

## Blocchi
Nessuno.
