# Checkpoint — 2026-08-08 13:28 UTC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`8b47281` — refactor(conti,flotta): i tre CSV che si ri-caricano tornano nel modulo

## Da dove è nata
Dalla riga del giro del browser che dice **«33 righe rientrate su 34 scritte, 1
resta fuori»** — cioè una di quelle che dichiarano «non torna», e che questo
repository ha imparato a leggere **prima dei KO**.

## Che cosa era, e che cosa NON era

⚠️ **La riga non era un difetto**, ed è il primo esito da scrivere: la riga che
non rientra è il rilievo ancora `pianificato`, senza volume misurato, e
`rientroRilievi` lo **dichiara già** prima di scaricare.

Ma tirando quel filo: dei **sette** file che si ri-caricano davvero, **tre**
erano composti da una stringa **dentro la pagina** — `conti_listino.csv`,
`conti_gare.csv`, `flotta_ricambi.csv`. È il posto che `CLAUDE.md` indica come
quello dove vivono le copie deboli, e il segno c'era già in due dei tre:
`${p.densita ?? ""}` e `${p.iva ?? 22}` avevano la loro guardia, `${p.prezzo}`
**no** — un valore crudo in mezzo a due guardati; e sopra le gare stava il
commento di una copia debole **già corretta lì** (`${+g.base || 0}`, che faceva
rientrare una gara senza base come una gara da **zero euro**).

Effetto pratico: il loro giro scrivi/leggi lo poteva provare **solo** il giro
del browser — un'ora e mezza — mentre i quattro fratelli scritti nel modulo si
provano in millisecondi.

## I due difetti sospettati, MISURATI E SCARTATI
Vanno scritti perché nessuno li rifaccia alla cieca:
- **Conti, prezzo assente → «undefined» nel file**: il salvataggio **rifiuta**
  un prodotto se non è `prezzo > 0` (riga `!(prezzo > 0)` in `index.html`),
  quindi oggi il caso **non è raggiungibile**;
- **Flotta, `giacenza ?? 0` come «assenza travestita da dato»**: la pagina tratta
  la giacenza come `+r.giacenza||0` **dappertutto** — non esiste uno stato «mai
  contata». Lo zero nel file è la **convenzione dell'app**, non una bugia.
  Chiamarla difetto voleva dire inventare uno stato che il prodotto non ha.

Quello che cambia davvero: il file non può più contenere la parola «undefined»,
e adesso c'è una prova che lo dice.

## Fatto
- `csvListino` e `csvGare` in `conti-data.js`, `csvRicambi` in `flotta-data.js`
  (con `numeroDichiarato` importata da `shared/`, non riscritta);
- le tre pagine chiamano il compositore invece di comporre;
- `run-kpi` **1892 → 1897**: 8 prove aggiunte, 3 sostituite da una forma **più
  forte** — i `PROTEZIONI` che contavano i `csvCell(` nel sorgente sono stati
  rifatti come Sentinella il 07/08: invece di **contare** le protezioni si prova
  che il giro **regga** il valore cattivo, perché un conto ≥ 1 lo passa anche
  chi protegge la colonna sbagliata;
- le intestazioni si chiedono al **compositore**, non a una regex sulla pagina
  (che dopo lo spostamento faceva cadere la prova per il motivo sbagliato: è
  successo, 6 rosse, ed è la stessa correzione già scritta lì per i ricettori).

## Verifiche
- **controprova sui file veri**: rimesso il prezzo crudo e tolto `csvCell` al
  nome dei ricambi → **3 prove cadono**; ripristinato da copia `cp` + `diff -q`.
  ⚠️ Onesto: dei tre valori cattivi, su Flotta ne mordono **due** — `=SOMMA(A1:A9)`
  non contiene un punto e virgola, quindi sopravvive anche senza protezione;
- giro `node` **27/27** sul disco **e** sulla copia di ciò che si committava
  (patch identica);
- **i bottoni premuti davvero**: `csv-dimostrazione --solo=conti` **71 ok / 0 KO**,
  `--solo=flotta` **50 ok / 0 KO**, ognuno su una porta sua col contrassegno pid
  riletto dal server.

## Numeri riallineati
2.333 → **2.338**, copertura 703 → **706**. E trovato per strada in
`DEVELOPMENT.md` un caso della **terza forma di invecchiamento**: il verdetto «i
condivisi sono tutti al 100%» reggeva, la **prova** accanto era ferma a un
perimetro di tre moduli (`593 · 23/23 · 31/31 · 5/5`) contro i cinque di oggi
(**136/136**). Rimisurata e dichiarata.

## Prossimo passo atomico
**Raccogliere il giro del browser** (PID 16670, avviato ~11:10Z, registro in
`scratchpad/nomi4/giro-nuovo.txt`) con
`node apps/deepwork-id/tests/browser/leggi-giro.mjs <registro>`: **sezione 1
prima della 2**, poi la riga «le tre passate più lente» per ritarare il limite
di 30 minuti.
⚠️ Attesta `c3888fe`: le cinque unità dopo **non ci sono dentro**.
⚠️ Nel registro il rosso di una **controprova** è il verde del banco —
l'intestazione adesso lo dichiara.
⚠️ E il giro **non** è invalidato dalle modifiche di oggi: prende l'impronta
della **propria worktree** (`impronta(COPIA || RADICE_IMPRONTA)`), che è immobile.

## Blocchi
Nessuno.
