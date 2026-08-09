# Checkpoint — 2026-08-09T10:45:00Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`ed463d5`

## Task completato

**Le mancanze confermate del delta sono 41, non 42 — e da oggi quel numero è
SORVEGLIATO** invece di essere ricontato a mano ogni due giorni.

| | |
|---|---|
| dichiarato in roadmap dal 07/08 | **42** |
| verdetti veri nei sei documenti | **41** (campo 11 · conti 8 · flotta 5 · scudo 0 · sentinella 13 · terra 4) |
| `numeri-nei-documenti` | 26 → **27** prove |

## Le tre cose imparate

1. ⛔ **UN VOCABOLARIO PIÙ LARGO PRENDE ANCHE LE RIGHE CHE *PARLANO* DEL
   VERDETTO INVECE DI DARLO.** Il 07/08 il conto era stato «corretto» da 41 a
   42 allargando la ricerca al plurale, «CONFERMATE ASSENTI» — e quell'unica
   occorrenza in più è la **riga d'intestazione** della sezione di Scudo
   («**CONFERMATE ASSENTI** — in ordine di quanto le chiederebbe un
   ispettore»), non il verdetto di una funzione. Cioè la correzione che diceva
   di aver reso il conto più preciso l'ha reso sbagliato.
   Il filtro che separa le due cose **non è la parola, è dove sta**: una cella
   di verdetto ha la sua prova nella terza colonna, un'intestazione ha le altre
   due vuote.
2. ⛔ **E IL SEGNO ERA IN BELLA VISTA DA DUE GIORNI: GLI ADDENDI NON
   TORNAVANO.** La riga scriveva «11 · 13 · 8 · 5 · 4 · 0 = **42**», e quella
   somma fa **41**. È la quarta forma d'invecchiamento di `CLAUDE.md` — un
   numero fuori dalla portata di ogni controllo, con la sua smentita scritta
   accanto — e la stessa famiglia del `1890 + 297 + 63…` di `DEVELOPMENT.md`.
   ⚠️ Un numero e la sua scomposizione che si contraddicono nella **stessa
   riga** sono peggio di un numero vecchio: fanno dubitare di tutti gli altri.
3. ⛔ **LA CURA NON È RICONTARE MEGLIO: È DERIVARE.** Ricontare a mano ha già
   prodotto due numeri sbagliati in due giorni. Adesso il conto lo fa
   `numeri-nei-documenti.mjs` leggendo i **sei documenti** e confrontandoli con
   quello che la roadmap dichiara — nessuna soglia scritta a mano da
   aggiornare, e il controllo cade nel momento in cui una mancanza si chiude
   senza che la riga se ne accorga. È la regola «chi chiude un'unità aggiorna
   la riga che gliel'aveva proposta», resa meccanica.

## Verifiche
- `numeri-nei-documenti` **27 passati, 0 falliti**, e stampa la scomposizione
  per app accanto al totale
- controprova (copia + ripristino + `diff -q`): rimettendo «42» il controllo
  **cade e nomina** le sei app
- `giro-node` **34 comandi a posto, 0 caduti** sulla copia del committato

## Il giro del browser
Ancora vivo dalle 07:55Z su una copia di `494863f`.

## Prossimo passo atomico
⛔ **Il giro, appena finisce, ha la precedenza**: `leggi-giro.mjs`, nell'ordine
**età → righe «non ho guardato» → KO veri**; nessun KO diventa cantiere prima
di essere riprodotto **con la sua passata** e **con l'iniezione viva**.
Se non è ancora finito, l'unità sicura successiva è **uniformare la tabella di
`CONCORRENTI_SCUDO.md`** al formato delle altre cinque (verdetto in grassetto
in una cella, prova accanto): oggi è organizzata **per funzione**, quindi il
suo zero non vuol dire «Scudo non ha mancanze» ma «quel documento non è
confrontabile». Adesso che il conto è sorvegliato, uniformarla farà **salire**
il numero e la roadmap dovrà seguirlo — che è il comportamento giusto.

## Blocchi
Nessuno di tecnico. In attesa del fondatore: le **7 tendine tagliate**
(Scudo 5 + Sentinella 2) e **`#vf-ente`** (termine dell'art. 71 c.11).
