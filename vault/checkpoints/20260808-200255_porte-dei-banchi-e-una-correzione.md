# Checkpoint — 2026-08-08T20:02:55Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Task completato
**Una mia diagnosi era falsa, e la misura l'ha smentita: nessun banco riusa la
porta di un altro.**

Nei **due** checkpoint precedenti avevo scritto che i server orfani rimasti
vivi erano un pericolo, «perché un giro futuro che trovasse quella porta
occupata e la riusasse misurerebbe l'albero vivo invece della propria copia
immobile». Suonava bene ed era coerente col racconto che sta in `CLAUDE.md`.
**È falsa.** Misurata prima di costruirci sopra un'unità:

| | |
|---|---|
| banchi che alzano un server | **48** |
| · rileggono dal server un contrassegno col proprio pid | **36** |
| · la porta la prendono e basta (se occupata l'errore è RUMOROSO: dieci escono con un'eccezione, due lo gestiscono) | **12** |
| · **la riusano** | **0** |

Gli orfani erano **spreco** — porte e memoria, due vivi da 3h25 e 3h48 — non un
rischio di correttezza. Tolti (risparmiando quello del giro vivo, riconosciuto
dalla sua cartella `giro-copia-*`).

E la misura è diventata un controllo permanente,
`apps/deepwork-id/tests/porte-banchi.mjs`, in `npm test` nei due versi: una
difesa che resta nello scratchpad, alla sessione dopo non esiste. Non difende
un numero — difende la **proprietà**: nessun banco riusa una porta che risponde
già. La forma riconosciuta è quella VERA, la riga che `tutti.mjs` aveva davvero
e che il 07/08 gli ha fatto misurare per venti minuti la copia di un altro
commit.

## Le tre cose imparate

1. ⛔ **Una diagnosi scritta con sicurezza vale quanto la misura che non ho
   fatto.** L'avevo scritta due volte, e la regola di casa dice perché è grave:
   manda il cantiere dopo a non provare la strada giusta. Qui avrei aperto
   un'unità per «mettere il contrassegno in 35 banchi» contro un pericolo
   misurato a **zero**.
2. ⚠️ **Il primo righello contava un LETTERALE invece della DOMANDA**, col
   segno di sempre: cercavo la stringa `__contrassegno` e ottenevo **13 su
   52**, perché `flotta-disegni` e `terra-geometrie` il contrassegno ce l'hanno
   con una rotta che porta il loro nome (`/__flotta-disegni-<pid>`). Chiedendo
   la forma — una `fetch` a una rotta `__`, il proprio pid, e una fermata
   dichiarata — il conto vero è **36 su 48**. Quasi tre volte tanto.
3. ⛔ **I dodici senza contrassegno NON vengono corretti, e la ragione è
   scritta.** Il contrassegno protegge dal caso «`listen` è fallito e io tiro
   avanti»; chi esce con un'eccezione quel caso non ce l'ha. Dodici file
   toccati per un pericolo misurato a zero sarebbero rischio senza guadagno. È
   la stessa contabilità con cui in `CLAUDE.md` è stata scartata la scala
   `--nav-scala`: **la decisione si scrive, così non rinasce da sola.**

⚠️ E scrivendo il controllo ho rifatto l'errore di un'ora prima: avevo messo
`ok(riusaLaPorta(altra) || true, …)` — un'asserzione che **non sa cadere**,
perché `|| true` la rende vera qualunque cosa risponda la funzione. L'avevo
scritta per «dichiarare senza pretendere». Se un caso vale, si pretende; se non
vale, si toglie. Adesso pretende, e passa.

## Verifiche
- `porte-banchi.mjs`: **3 passati, 0 falliti**, 48 banchi guardati; controprova
  nei due versi (la forma di `tutti.mjs` viene vista, un banco sano non viene
  accusato, un file senza server non c'entra, e il contrassegno si riconosce
  anche quando la rotta porta il nome del banco)
- `node giro-node.mjs` → **32 comandi a posto, 0 caduti** (erano 30), rifatto
  su una copia di ciò che si committa, identità della patch verificata
- documenti in pari: giro completo **2.662**, i «dodici» diventano **tredici**
  con addendi che sommano a **296** (verificato: 2.366 + 296 = 2.662), comandi
  del giro da 30 a **32**

## Stato roadmap
Filone «i numeri che mentono con la faccia tranquilla», più igiene degli
strumenti.
Domanda *«chi decide i numeri di ciò che ESCE?»*: Campo 6/6, Sentinella 5/5,
Terra 3/3 puliti; core 2/2 (un difetto, corretto); **Flotta 4/9** (quattro
difetti, tutti corretti e blindati); Conti 12, Scudo 5, Genesi 9 in analisi.

## Prossimo passo atomico
**Chiudere Flotta portando il banco da 4 a 9 documenti**, cominciando dai due
che il cantiere ha dichiarato **puliti** — `flotta-costi.csv` e
`flotta-scadenze-di-legge.csv` — perché un negativo va **misurato aprendo il
file**, non dedotto leggendo il codice: su cinque app il censimento statico
aveva dato zero e il difetto c'era.
Due cose già misurate su questo banco, da non riscoprire:
1. i file di Flotta non escono tutti allo stesso modo — situazione e registro
   sono `data:` URL, giri, lista della spesa e ricambi sono `blob:` col BOM;
2. i bottoni non stanno dove il nome della schermata farebbe pensare:
   `btn-int-csv` e `btn-sco-csv` sono tutt'e due in **page-man**. Si controlla
   col numero di riga del bottone contro quelli dei `<div class="page" id=…>`.

## Blocchi
Nessuno.

## Note
Il giro del browser (pid 21084) cammina ancora sulla sua copia
`giro-copia-21084`, porta 8823: da leggere con `leggi-giro.mjs` quando finisce,
partendo dalla **sezione 0** (l'età del giro) e poi dalle righe «non ho
guardato», prima dei KO.
