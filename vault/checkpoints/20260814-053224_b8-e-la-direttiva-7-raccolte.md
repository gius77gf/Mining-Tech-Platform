# Checkpoint — 2026-08-14 05:32 UTC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit di questo tratto
- `97cbf677` — B8: il file sbagliato non entra più in silenzio
- `aebd0719` — direttiva 7: i tre delta più morsi riverificati

## Che cosa è stato completato

**B8.** Un CSV di fatture importato nell'anagrafica dei lavoratori creava **due
persone chiamate «numero» e «2026/001»**, in silenzio. Adesso il file viene
riconosciuto e l'app dice **quale** file è. La difesa ovvia era **già esclusa**
dalla voce stessa — i lettori tollerano di proposito un file **senza**
intestazione — quindi non si pretende l'intestazione: si riconosce quella di
un'altra tabella (`CSV_TABELLE`, **42** censite).
✅ **I tre numeri misurati da me**: 42 intestazioni legittime → **0 rifiutate per
sbaglio**; file di un'altra app **riconosciuto**; file senza intestazione
**passa**. Il primo è quello da cui dipendeva tutto — un falso allarme lì
**blocca un import buono**, che è peggio del difetto.

**Direttiva 7.** Riguardate **61 righe** di verdetto in Scudo, Campo e
Sentinella: **zero verdetti sbagliati**. A marcire è la *forma* della prova, e la
forma peggiore è il **numero di riga** (41 su 42 scadute). Citazioni `file:riga`
nei sei documenti: **145 → 63**, rimisurato da me. Arretrato **25/14 → 18/5**.

## ⛔ Le due cose che valgono più delle unità
1. **Il controllo per addendo, scritto un'ora prima, ha preso ME.** `run-stile`
   era passata da 321 a 322, avevo aggiornato solo l'addendo di `run-kpi`, e la
   somma faceva **2693 contro 2694**. L'ha **nominato**, invece di lasciarlo
   passare come aveva fatto stanotte la coppia che si compensava.
2. **Quinta fixture sbagliata in una notte, e stavolta la regola l'ha fermata.**
   Avevo letto «42 su 42 rifiutate per sbaglio» e stavo per aprire un difetto:
   `CSV_TABELLE` è un **array** e passavo l'indice dove la funzione vuole gli id
   ammessi. La regola messa in `CLAUDE.md` poche ore prima ha impedito che
   diventasse un'accusa.
   ⚠️ E il cantiere della direttiva 7 ha trovato **tre righelli rotti**, due
   scritti da lui — fra cui un `grep` senza `-E` che rispondeva **0** proprio
   sulla riga che doveva dimostrare che una cosa **c'è**. Li ha presi il
   **rilancio di tutti gli 85 comandi**, non la rilettura.

## Le misure
`run-kpi` **2238**, `run-stile` **322/0**, copertura app **751/751**, condivisi
**179/179**, giro `node` **3.033** asserzioni, **34 comandi a posto, 0 caduti**,
CI verde, **albero pulito**.

## Che cos'è vivo
- **Il giro del browser** dalle 04:29 su `93a569c3`: 0 KO veri. ⚠️ **B10** dice
  che non può finire — 4,1 min/passata × 198 = **13,5 ore** — e che il runner è
  **tutto-o-niente**.

## Prossimo passo atomico
Aprire **B9**: `shared/` è **libera** adesso che B8 ha chiuso. `ragioneData` è
scritta **due volte identica** (Scudo e Sentinella) e in `shared/` non c'è; il
guardiano dei lettori ne copre **9 su 19**, con l'etichetta che dice «nove di
quattro app» mentre quelle app ne hanno **13**. E la divergenza è già cominciata:
`parseTaratureCsv` **fonde** «non si legge» e «la data non esiste», che sono due
rimedi diversi. Poi **B10** (il filtro `--solo=` sul runner) e **B7** (il banco
intermittente) — quest'ultimo **solo a macchina scarica**.

## Blocchi
- **Force-with-lease sul ramo**: fermo al fondatore; CI verde con l'eccezione
  dichiarata e sorvegliata.
- **B0-septies** e le **soglie di sicurezza**: fermi al fondatore.
