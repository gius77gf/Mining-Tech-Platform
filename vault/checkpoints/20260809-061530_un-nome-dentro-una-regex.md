# Checkpoint — 2026-08-09T06:15:30Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`e84fea5`

## Task completato

**Il controllo che esiste per prendere le iniezioni scadute cercava UN NOME
SOLO** — e sotto quel buco c'erano **tre iniezioni scadute**, una delle quali
aveva prodotto **tre KO fantasma** che avevo già riverificato due volte
credendoli difetti del prodotto.

`iniezioni-fresche.mjs` cercava `const DIFETTI = [`. Restavano fuori `DIFETTO`,
`DIFETTI_MODULO`, `DIFETTI_PAGINA`, `DIFETTI_FLOTTA`, `DIFETTI_MOTORE`,
`DIFETTO_MODULO`, `INIEZIONI`, `COME_LIVE`, e ogni tabella scritta come
**oggetto**. Conto: **215 dichiarate, 296 esistenti.**

| fronte | prima | dopo |
|---|---|---|
| `iniezioni-fresche` | 215 in 23 banchi | **296 in 44 tabelle di 35 banchi**, 0 illeggibili |
| `campo-foglio-turno --live` | 32 passati, **3 falliti** | **35/0**, 9 iniezioni |
| `scudo-verifica-periodica --controprova` | 2 difetti su 3, «✔ OK» | **3 su 3**, 7 prove cadute |
| `scudo-frasi-da-uno --controprova` | 16 su 17 | **17 su 17**, 19 cadute su 44 |

## Le tre cose imparate

1. ⛔ **UN NOME DENTRO UNA REGEX SI NASCONDE MEGLIO DI UN'ECCEZIONE
   DICHIARATA.** Questo file era nato l'08/08 proprio per **togliere**
   un'eccezione, con scritto sopra che «un'eccezione dichiarata onestamente
   resta un posto in cui nessuno guarda». E il giorno dopo il buco più grosso
   non era in un elenco: era in `/const DIFETTI\s*=\s*\[/`. Un elenco di
   eccezioni lo rileggi — è scritto come una scelta; **un nome dentro una regex
   non si presenta come una scelta**, quindi non viene riletto mai.
   ⚠️ E la riga che descrive esattamente questo difetto stava **in fondo alla
   riga di roadmap dell'unità precedente**, scritta da me: *«un censimento che
   cerca UN nome risponde "non c'è" con la stessa faccia con cui direbbe la
   verità»*. L'avevo imparata sul mio `grep` di `__usciti` e l'ho rifatta due
   ore dopo nel codice.
2. ⛔ **TRE KO FANTASMA, E LI AVEVO RIVERIFICATI DUE VOLTE.** I 3 KO del foglio
   di turno di Campo non erano prodotto: la passata `--live` non riusciva a
   fingere i dati veri (l'ancora era diventata una chiamata a
   `avvisoTestoDimostrazione`), quindi serviva la pagina in **modo
   dimostrazione** e la accusava di dichiararsi d'esempio — cosa che faceva
   giustamente. Avevo scritto in roadmap, in due punti: *«non è un'iniezione
   scaduta, `iniezioni-fresche` dà 215/215»*. Il 215/215 era **vero e
   irrilevante**: quel controllo non guardava le tabelle `COME_LIVE`.
   ⚠️ E il numero che avrebbe dovuto insospettirmi c'era: il banco dichiarava
   «**6** iniezioni come live» dove adesso ne dichiara **9** (tre voci per tre
   rotte). Ho letto un numero più basso come una conferma.
   ⚠️ Il banco lo diceva anche in chiaro — «⛔ INIEZIONE MANCATA: 0 soggetti» e
   «il giro non vale» — dentro un registro da cinquemila righe. Il valore del
   controllo non è che *scopre* una cosa che nessuno diceva: è che la porta da
   **una riga sepolta** a **un rosso in tre secondi prima del commit**. Ma
   `scudo-verifica-periodica` non diceva niente del tutto: `if (inj.file !==
   file || !t.includes(inj.da)) continue;`, nessun conto, e la controprova
   passava con 2 difetti su 3.
3. ⛔ **LA STRADA "SENZA NOMI" È STATA PROVATA E SCARTATA COI NUMERI.**
   Giudicare una tabella dalla **forma** — «è una lista di coppie di stringhe»
   — sembra più solida di un vocabolario di nomi, e dà **9 allarmi di cui 7
   falsi**: `COMBINAZIONI` di `note-stato` sono classi CSS, `PAROLE` e
   `PLURALI` sono parole, `GIRI` e `LISTE` sono selettori. Tutte liste di
   coppie di stringhe, nessuna cita codice. Quindi il criterio resta il **nome**
   — ma il **denominatore si dichiara**: le 6 tabelle di coppie fuori dal
   vocabolario si contano e si stampano, così una quarta convenzione compare
   come un numero invece che come silenzio.

## Il costo dell'allargamento, misurato PRIMA di farlo
**81 iniezioni entrate, 3 scadute vere, ZERO falsi allarmi.** È la disciplina
già scritta per `nomi-liberi`: prima di lasciare largo (o stretto) un
controllo, lo si prova su una copia e si contano gli allarmi nuovi.
⚠️ Sono emerse anche **due convenzioni di posizione in più**: `[cerca, sost, 1]`
e `[nome, cerca, sost]` (`salvataggio-offline`, dove il primo elemento è una
frase in italiano → 2 falsi allarmi). Quello che tutte hanno in comune è che
l'iniezione è una coppia **adiacente**: con tre elementi rimasti si guarda il
**penultimo**. E la forma a oggetto `{file, da, a}` è la più onesta di tutte,
perché la stringa da cercare ha un **nome** e non va indovinata affatto.
⚠️ Il fondo dell'asserzione sul denominatore è salito da **100 a 250**: su un
valore che sale, una soglia bassa è cieca proprio nel verso che rassicura — è
la lezione di `copertura-funzioni`, applicata qui.

## Verifiche
- `iniezioni-fresche` **296/296**, 44 tabelle, 35 banchi, 0 illeggibili
- controprova rifatta rimettendo l'ancora vecchia di `COME_LIVE`: il controllo
  **nomina banco e tabella** e cade (ripristino da copia + `diff -q`)
- `campo-foglio-turno --live` **35/0** · `scudo-verifica-periodica` 21/0 e
  controprova 3/3 · `scudo-frasi-da-uno` 44/0 e controprova 17/17
- `giro-node` **34 comandi a posto, 0 caduti**, rilanciato sulla **copia di
  quello che si committava** (worktree + `git diff --cached | git apply` +
  `git add -A`)

## Stato dei 20 KO del giro
**8 chiusi · 12 aperti**, e la correzione è nella direzione che conta: dei 12
rimasti, **7 aspettano il fondatore** (le tendine di Scudo e Sentinella,
`#vf-ente`).
⚠️ Bilancio onesto dei venti: **due su venti erano difetti del prodotto già
chiusi**, **quattro erano attese sbagliate del banco**, **tre erano un banco
che non riusciva a montare il suo caso**. Il giro resta utile, ma un KO non è
un difetto finché non lo si è riprodotto **con la sua passata** e **con
l'iniezione viva**.

## Prossimo passo atomico
**Il KO delle barre di peso di Conti**, che è l'ultimo lavorabile senza il
fondatore: `conti-barre-peso` dà **14 ok, 1 KO** e il KO è la riga
`dice(zeri.length >= 2, "e accanto ci sono fasce a zero da confrontare (1)")`.
Non è il prodotto — il prodotto disegna 3 px per 12 € e 0 px per uno zero vero,
e tutte e quattro le asserzioni sul rapporto passano. È lo **scenario**: la
fascia d'invecchiamento con 12 € dentro ha una sola vicina vuota, e il banco ne
vuole due per distinguere «disegna in proporzione» da «disegna tutte uguali».
Si corregge nei **dati serviti** (`const LISTE` / il caso appeso al modulo),
mai sul disco. ⚠️ Prima di toccare il banco va riletto **perché** chiede due:
allargare a `>= 1` sarebbe la «correzione facile che dà il verde falso».
Poi restano: gli **stati «non misurato» di Campo** (1, e vuole lo *scenario*
ricostruito: registrare un'attività con un fermo, poi dichiarare un turno più
corto) e i **nove punti di coerenza** del raggruppamento in Genesi.

## Blocchi
Nessuno di tecnico. In attesa del fondatore: le **7 tendine tagliate**
(Scudo 5 + Sentinella 2) e **`#vf-ente`** (termine dell'art. 71 c.11).
