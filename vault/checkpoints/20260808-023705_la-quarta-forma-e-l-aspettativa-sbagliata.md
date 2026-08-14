# Checkpoint — 2026-08-08T02:37:05Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`dd15588` — *nomi-liberi: misurata la quarta forma — e l'aspettativa era sbagliata*

## Che cosa è stato completato

Misurata la **quarta forma**: un nome riferito **nudo** — `const x = pippo`,
`f(a, pippo)`, `return pippo` — fuori dai template e fuori dalle chiamate.

⛔ **E la misura ha smentito l'aspettativa, che è il motivo per cui si misura.**
Nel checkpoint precedente me l'ero segnata come *«rumore atteso molto più alto,
la misura potrebbe dire di lasciar perdere»*. Con gli elenchi **veri** di quel
file: **35 allarmi su 69.412 riferimenti**, e sono ancora tutti falsi — ma per
**tre ragioni diverse**, e sono loro il risultato:

1. **globali e parole chiave** che l'elenco non ha ancora (`NaN`, `Infinity`,
   `AbortSignal`, `caches`, `innerWidth`, `innerHeight`, `devicePixelRatio`,
   `from`, `as`, `get`) più una libreria da CDN (`XLSX`): **una decina di nomi,
   dichiarabili per nome**;
2. ⛔ **i COMMENTI.** `chiave ×3` nel core sono **tre commenti in italiano**.
   `mascheraCodice` maschera le **stringhe**, non i commenti — e questa forma, a
   differenza delle altre tre, **li incontra**. Servono **tutt'e due** i
   tokenizzatori, non uno: è la regola di CLAUDE.md («due tokenizzatori, e vanno
   scelti») in un caso in cui la risposta è **entrambi**;
3. **i flag di una regex**: `gu ×1` in Conti è `/…/gu`.

**Verdetto: la quarta forma si può fare.** Resta **misura** finché non è fatta —
una guardia che accusa 35 volte a vuoto insegna a non guardarla, ed è il danno
che questa casa ha già pagato con la colonna delle prove del delta.

⚠️ **E prima ancora, il righello.** Senza `\b` davanti al lookahead la regex fa
backtracking e combacia con un **prefisso** del nome: «escHtml» → «escHtm»,
«toast» → «toas», **3.354** allarmi tronchi di una lettera. Quarto righello
storto della notte, e il segno era leggibile al primo sguardo — i nomi erano
tutti corti di un carattere.

## Prove

Giro `node`: **23 comandi, 0 caduti**.

## In volo

⏳ Il **giro del browser** sulla porta **8831**, uscita in
`scratchpad/io-core/giro-6.txt`, su una **copia di `e65d20e`** (lo dichiara
nella prima riga). Le intestazioni di **controprova** viste finora si
dichiarano da sé.

## Prossimo passo atomico

⛔ **Raccogliere `giro-6.txt` quando finisce** (in coda scrive `USCITA <n>`),
nell'ordine che non si negozia:
1. le righe **«non ho guardato»** — denominatori, superfici non raggiunte,
   «0 su N»;
2. **poi** i KO, togliendo le **controprove** (l'intestazione le dichiara);
3. se esce con **2** si è dichiarato **non valido** da sé e va rifatto.

Poi, con la misura già in mano:

1. ⏱️ **Chiudere la quarta forma**: `senzaCommenti` sopra `mascheraCodice`, i
   dieci nomi nell'elenco `GLOBALI` **con la ragione accanto**, e i flag di
   regex esclusi. Attesa: **zero**. Controprova: un nome tolto dall'import e
   usato solo come riferimento nudo.
2. ⏱️ Le proposte delle schede di ricerca, per priorità.

## Blocchi
Nessuno.
