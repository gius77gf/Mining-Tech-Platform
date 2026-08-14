# Checkpoint — 2026-08-14 04:28 UTC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit di questo tratto
- `073b41c9` — canarino
- `c950d1c8` — Genesi: la gittata usava un burden che nessuno aveva scritto
- `37c4393f` — il debito di B5, tutte e due le parti
- `7a03bc40` — B5-bis, e le sei funzioni lasciate senza prova

## Che cosa è stato completato

Il blocco precedente si è fermato sul **limite di sessione** — l'unico stop
legittimo — e con lui sono morti **quattro cantieri prima di consegnare**. Il
loro lavoro era sul disco: 18 file, nessuna misura, nessuna controprova.
⛔ **Non è stato committato alla cieca.** La prima cosa fatta è stata *misurare*
il disco, e ha risposto subito: `copertura-funzioni` **745/751**, cioè **sei
funzioni senza prova**; `run-stile` rosso; un'iniezione scaduta. Il disco **non
era committabile**, e chi l'avesse committato per far sparire il rosso del gancio
avrebbe messo in cima al ramo un commit rotto.

Poi, **uno per uno**, con l'indice costruito da HEAD più il solo blocco di
ciascuno:

1. **Genesi — la spalla assente.** `flyrockEst` faceva `B = D2.B || SPALLA`: la
   distanza a cui si mandano via le **persone** usciva da un burden che nessuno
   aveva scritto. ⛔ E il metodo che aveva trovato il difetto gemello — affiancare
   le righe della scheda col dato e senza — **qui non lo vedeva**: la gittata
   restava **101 m con la spalla e 101 m senza**. Il ripiego riempiva il buco
   così bene da farsi assolvere dal confronto. **Un numero identico non è un
   numero verificato.** Dove la spalla decide davvero, decide nel verso che
   rassicura: **129 metri di sgombero persone in meno**.
2. **Il debito di B5**, tutte e due le parti. E la misura dice una cosa buona:
   le quattro copie di `frasePersi` erano **ancora identiche carattere per
   carattere** — si è fatto in tempo, la regola di `shared/` è stata applicata
   **prima** che il costo maturasse.
3. **B5-bis**, con le sei prove mancanti scritte da me misurando che cosa le
   funzioni **fanno**, non che cosa il cantiere diceva che facessero.

## ⛔ Due difetti dei controlli, e li ha trovati il loro stesso rosso
- **Regola 12 di `run-stile` riconosceva i gestori dal NOME del contatore.** Un
  rinominare `saltate` → `gia` — fatto **a ragione** — l'ha resa cieca su Scudo.
  Il segno non è stato un allarme: è stata la **controprova**, che togliendo la
  difesa non produceva nessuna violazione nuova. *Una regola che smette di
  guardare un soggetto non lo dice: lo dice solo la sua controprova.* Adesso la
  domanda è **strutturale**, e il costo è stato misurato prima: **10 → 11**
  gestori, nessuno perso, zero falsi allarmi.
- **E uno mio**: nei documenti avevo scritto gli addendi «2226 + 318» dove il
  vero è «2223 + 321». **Due errori che si cancellano**, quindi il totale tornava
  e il controllo passava — alla lettera il caso «somma coerente ma falsa» scritto
  nel commento di quel controllo. Corretti.

## Le misure, sulla copia di quello che si committa
`run-kpi` 2182 → **2229**, 0 falliti · `run-stile` **321/0** · copertura app
**751/751** · condivisi **174/174** · `iniezioni-fresche` **378/378** · giro
`node` **3.023** asserzioni, **34 comandi a posto, 0 caduti** · quattro documenti
allineati · albero di lavoro **pulito**.

## Prossimo passo atomico
**Il controllo per ADDENDO va dove i numeri nascono.** Il conto statico non può
farlo — le prove si generano nei cicli (2122 statiche contro 2229 vere) — quindi
non si allarga la regex: si mette in `giro-node.mjs`, che ogni suite la lancia
davvero e ne legge il verdetto, il confronto fra **ciascun addendo scritto nei
documenti** e la suite che l'ha prodotto. È la difesa contro l'errore fatto
stanotte, e va scritta con la sua controprova (due addendi che si compensano
devono cadere).
Poi **rilanciare il giro del browser** su questo stato fermo: è la verifica che
manca a tutto il lavoro delle ultime ore, e adesso la macchina è libera.

## Blocchi
- **Force-with-lease sul ramo**: la storia va ancora riscritta; la CI però è
  verde, con l'eccezione dichiarata e sorvegliata.
- **B0-septies** e le **soglie di sicurezza**: fermi al fondatore.
- ⏱️ **B7** (il banco di Sentinella intermittente) va riguardato **a macchina
  scarica**, e la voce dice di non aprirci un cantiere prima.
