# Checkpoint — 2026-08-08T05:27:14Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`2d905ff` — *numeri-nei-documenti: anche la SOMMA SCRITTA deve fare il totale*

## Che cosa è stato completato

Il controllo sugli addendi **esisteva già**, ma leggeva **una notazione sola**.
`STATO_PRODOTTO.md` scompone a parole («1890 sulle funzioni delle app, 300
sulle regole di stile…») e quella la guardava; `DEVELOPMENT.md` la scompone in
**aritmetica** — «(contate lanciandole: 1890 + 300 + 71 + 32 + 9 + 8)» — e
quella forma **non la guardava nessuno**.

Ci stava dentro un **difetto vero**, trovato stanotte: «1890 + 297 + **63** +
32 + 9 + 8» fa **2299**, non i 2307 dichiarati due parole prima. Il `63` era un
`run-helpers` fermo da giorni.

> **L'ho trovato a occhio aggiornando il totale — cioè per fortuna, non per
> controllo.** È il motivo per cui questa unità esiste: la prossima volta la
> fortuna potrebbe non esserci.

## ⚠️ La stessa lezione di due ore fa, in un'altra veste

L'elenco `BROWSER` guardava **due documenti su tre**; qui il controllo non
arrivava per una differenza di **notazione**, non di contenuto. Sempre lo
stesso principio:

> **Un numero è sorvegliato solo dove il controllo ARRIVA, e l'elenco di dove
> arriva va guardato quanto il numero.**

E due numeri che si contraddicono **nella stessa riga** sono peggio di un
numero vecchio: fanno dubitare di tutti gli altri.

## La controprova

Rimette il **difetto vero** (`71` → `63`) e pretende che il controllo veda la
differenza. E pretende anche di aver trovato **almeno cinque addendi**: una
catena letta a metà tornerebbe «a posto» sommando due numeri, che è la forma
di falso verde più facile da non vedere.

## Prove

- `numeri-nei-documenti`: **24 → 26**, 0 fallite.
- Giro `node` sulla copia di quello che si committava: **23 comandi, 0 caduti**.

## In volo

⏳ Il **giro del browser**, porta **8823**, `scratchpad/io-core/giro-7.txt`,
copia di `958018d`, pid 28054. **2.734 righe**.

## Prossimo passo atomico

⛔ **Raccogliere `giro-7.txt` quando finisce** (in coda scrive `USCITA <n>`):
1. prima le righe **«non ho guardato»** — su Genesi il banco del contrasto
   dichiara **69 classi mai comparse** (22 misurate, 47 solo elencate);
2. **poi** i KO, togliendo le **controprove** (l'intestazione le dichiara);
3. uscita **2** = si è dichiarato **non valido** e va rifatto.

Poi, a giro fermo (tocca le pagine):
- ⏱️ **Togliere le 59 righe inerti** (import mai usati) e portare la quinta
  domanda di `nomi-liberi` a regola. L'elenco lo stampa la suite
  (`[misura] quinta forma`): si rilancia e si legge, non si ricopia. Un'unità
  per app, un file per commit.

## Blocchi
Nessuno.
