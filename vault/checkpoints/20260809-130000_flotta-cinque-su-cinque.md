# Checkpoint — 2026-08-09T13:00:00Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`897fd58`

## Task completato

**Le cinque «CONFERMATA ASSENTE» di Flotta rimisurate una per una.** Tutti e
cinque i verdetti reggono; **tre ricerche su cinque** non tornano più.

| riga | verdetto | ricerca |
|---|---|---|
| Piani a km / miglia | ✅ regge | ⛔ `miglia` **23** — tutte `famiglia`, `migliaia`, `somiglia` |
| Firma digitale cliente | ✅ regge | ⛔ `firma` **4**, e due sono «una **firma** troppo stretta» detto di una **funzione** |
| Budget tracking | ✅ regge | ✅ `budget` 1, in un commento, come già scritto |
| Link fatture a ordini | ✅ regge | ⛔ `fattura` **2** (erano 0), tutt'e due prosa |
| Unità di misura per mezzo | ✅ regge | ✅ `unitaMisura` zero |

## Le due cose imparate

1. ⛔ **IL TERMINE DI RICERCA ERA SBAGLIATO, NON IL VERDETTO — e il caso di
   `miglia` è quello da ricordare.** Cercare «miglia» in un testo italiano
   trova **fa-miglia**, **mi-gliaia**, **so-miglia**: ventitré occorrenze, zero
   pertinenti. È il righello che sbaglia, nella forma più banale possibile — e
   avrebbe fatto dichiarare scaduta una riga giusta.
   ⚠️ Il segno per riconoscerlo: **un termine corto che è anche un pezzo di
   parole comuni**. Va cercato con un confine (`\bkm\b`) o cambiato.
2. ⛔ **E LA STESSA PAROLA PUÒ VALERE DUE MESTIERI.** `firma` in questo
   repository è tanto la firma di una persona quanto la **firma di una
   funzione** — e quest'ultima compare spesso, perché «una firma troppo
   stretta» è una delle regole scritte in `CLAUDE.md`. Una prova che conta le
   occorrenze di una parola **polisemica** senza dire quale significato ha
   trovato non è verificabile: adesso lo dice.

## Verifiche
- i dodici termini delle cinque righe rilanciati **col comando**
- ogni occorrenza non-zero **aperta**: nessuna era una funzione del prodotto
- `numeri-nei-documenti` **28/0**, conto delle 47 invariato (flotta resta 5)
- `giro-node` **34 comandi a posto, 0 caduti** sulla copia del committato

## Stato del censimento delle 47
**9 su 47 rimisurate** (terra 4 + flotta 5), **38 rimaste**: campo 11,
sentinella 13, conti 8, scudo 6. Su nove righe, **sei ricerche** non tornavano
più e **zero verdetti** sono cambiati — il che dice due cose: le verifiche del
01-07/08 erano fatte bene, e le loro **prove** invecchiano molto più in fretta
dei loro giudizi.

## Il giro del browser
Ancora vivo dalle 07:55Z su una copia di `494863f`.

## Prossimo passo atomico
⛔ **Il giro, appena finisce, ha la precedenza**: `leggi-giro.mjs` nell'ordine
**età → righe «non ho guardato» → KO veri**; nessun KO diventa cantiere prima
di essere riprodotto **con la sua passata** e **con l'iniezione viva**.
Se non è ancora finito: **Scudo (6 righe)**, poi conti 8, campo 11,
sentinella 13. Metodo fisso: si rilancia il comando che la riga dichiara, e
**ogni occorrenza non-zero si apre** — due volte su nove il termine era
sbagliato, non il codice.

## Blocchi
Nessuno di tecnico. In attesa del fondatore: le **7 tendine tagliate**
(Scudo 5 + Sentinella 2) e **`#vf-ente`** (termine dell'art. 71 c.11).
