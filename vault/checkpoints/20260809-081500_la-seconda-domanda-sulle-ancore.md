# Checkpoint — 2026-08-09T08:15:00Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`86acec5` (questa unità committata subito dopo)

## Task completato

**La seconda domanda sulle ancore delle controprove: non «è viva», ma «è viva
NEL FILE CHE IL BANCO SERVE?»** — più una terza strada provata e scartata coi
numeri.

| | |
|---|---|
| iniezioni che dichiarano il bersaglio | **38 su 296** |
| fuori posto oggi | **0** |
| allarmi nuovi introdotti | **0** |
| controprova sul caso storico | la 1ª domanda dice ✓, la 2ª ✗ e nomina file e riga |

## Le tre cose imparate

1. ⛔ **DUE DOMANDE CHE SEMBRANO UNA SOLA.** «La stringa esiste nel prodotto?» e
   «la stringa esiste nel file in cui inietto?» danno la stessa risposta quasi
   sempre — e differiscono esattamente nel caso che stamattina è costato una
   controprova muta: la riga di `scudo-verifica-periodica` era **salita nel
   modulo dati**, quindi cercata a tappeto risultava viva mentre il banco non
   la trovava dove sostituisce. È la forma di difetto che il controllo esisteva
   per prendere, e che la prima domanda **non poteva** vedere.
2. ⛔ **UNA GUARDIA PARZIALE SI DICHIARA PARZIALE.** La seconda domanda si può
   fare solo dove il bersaglio è **dichiarato** — il percorso nella tupla, il
   campo `file` della forma a oggetto, la **chiave** dell'oggetto per rotta —
   e sono 38 su 296. Il numero si stampa accanto al verdetto: un «✓» senza il
   suo denominatore si legge come se valesse per tutte, ed è la lezione delle
   righe «non ho guardato».
3. ⛔ **UNA TERZA STRADA PROVATA E SCARTATA, e la scarto per DUE ragioni
   diverse.** Volevo censire i banchi che **applicano** un'iniezione senza
   dichiarare se l'hanno trovata (il difetto di `scudo-verifica-periodica`:
   `if (!t.includes(inj.da)) continue;`, nessun conto).
   · Il righello a `grep` dava «2 muti, **36 senza un `.replace`
     riconoscibile**» — cioè misurava i **nomi delle variabili**, non il
     comportamento; e 36 risultati identici sono il segno con cui in questa
     casa si riconosce di stare guardando il righello.
   · Ma soprattutto la domanda **è già risolta un piano più su**:
     `iniezioni-fresche` gira in `npm test` e controlla tutte e 296 le ancore
     contro il sorgente vero, quindi un'ancora non può più morire in silenzio
     per più di un commit — che il singolo banco lo dichiari o no.
   ⚠️ La seconda ragione vale più della prima: un controllo che duplica una
   garanzia già data da un altro livello **costa manutenzione e non aggiunge
   niente**. Prima di scrivere una guardia si guarda quale strato la copre già.

## Verifiche
- `iniezioni-fresche` **296/296**, 38 col file dichiarato e verificato lì,
  0 fuori posto, 0 illeggibili, 44 tabelle in 35 banchi
- controprova sul caso storico (`file: PAGINA` su un'ancora che vive nel
  modulo): cade e **nomina** file e riga · ripristino da copia + `diff -q`
- `giro-node` **34 comandi a posto, 0 caduti**, sulla copia del committato

## Il giro del browser sta girando
Lanciato alle 07:55Z su una copia di `494863f`, pid 2712, registro in
`scratchpad/giro5/registro5.txt`. Verificato **vivo** con la domanda giusta —
un figlio che macina CPU (`interi-superfici`) e il registro che cresce
(13.551 → 14.211 byte in 30 s) — non «il file è fermo da venti secondi», che
darebbe allarmi falsi.
⚠️ Finché gira: si lavora su `docs/`, `vault/` e le suite `node`. Il giro serve
una `git worktree` immobile, quindi il lavoro ordinario è sicuro; le
**iniezioni nei moduli dati e nelle pagine** invece si aspettano.

## Prossimo passo atomico
**Leggere il giro quando finisce**, con `leggi-giro.mjs` e nell'ordine che la
regola impone: **età → righe «non ho guardato» → KO veri**. Le undici chiusure
di oggi si vedono lì; e se il registro si fermasse, la prima domanda è «sta
ancora scrivendo?» seguita da «c'è un figlio vivo che macina?».
Nel frattempo, unità sicure (solo `docs/`, `vault/`, suite `node`) fra quelle
già aperte in roadmap.

## Blocchi
Nessuno di tecnico. In attesa del fondatore: le **7 tendine tagliate**
(Scudo 5 + Sentinella 2) e **`#vf-ente`** (termine dell'art. 71 c.11).
