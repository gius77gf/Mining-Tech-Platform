# Checkpoint — 2026-08-08T06:00:10Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`f77a45a` — *classi-orfane: l'elenco delle pagine si deriva dal disco — ne
perdeva quattro*

## Che cosa è stato completato

Terza tappa del censimento degli **elenchi scritti a mano**. `run-stile` ha la
sua guardia dal 03/08 («ogni pagina del repo è guardata o esclusa con la
ragione»), e quel giorno aveva scoperto quattro pagine dimenticate — fra cui,
**testualmente**, *«due che l'utente apre davvero: quella in cui si finisce
quando manca un permesso, e il portone di Genesi»*.

In `classi-orfane` la guardia non c'era, e mancavano **le stesse due**:
`apps/deepwork-id/non-autorizzato.html` e `apps/genesi/login.html`, più due
superfici di collaudo.

> La correzione era stata fatta **in un file e non nell'altro**: è la **copia
> debole**, applicata a un elenco invece che a una funzione.

Adesso l'elenco si **deriva dal disco** — una pagina nuova entra da sé — e chi
resta fuori lo dice con la ragione.

**Misura:** 12 → **14 pagine**, 1.152 → **1.184 classi**, e **zero classi
morte**. Nelle due pagine appena coperte non si nascondeva niente: il valore non
è quello che ha trovato, è che da adesso sono guardate senza che nessuno debba
ricordarsene.
La controprova **scala con l'elenco**: 14 refusi iniettati su 14 pagine, 14
visti (erano 12 su 12).

## ⚠️ E per la quarta volta stanotte il righello sono stato io

Cercando quali pagine mancassero ho scritto un `grep` che pretendeva un
**prefisso di cartella** (`"(apps|shared)/…"`), e mi ha nascosto che il
**core** — `index.html`, alla radice, senza prefisso — era già nella lista. Per
un minuto ho creduto che la superficie più importante del prodotto fosse
scoperta.

## Il filo di queste tre unità

| dove | l'elenco | che cosa mancava |
|---|---|---|
| `numeri-nei-documenti` | `BROWSER` | 1 documento su 3 — quello che si apre per **decidere** |
| `run-stile` | `MODULI` | 3 moduli condivisi, fra cui l'**SDK** e il **motore dei temi** |
| `classi-orfane` | `PAGINE` | 2 pagine che **l'utente apre davvero** |

> **Un elenco scritto a mano si accorcia da solo, e ogni volta che si accorcia
> il verde che stampa vale un po' meno.**

## Prove

- `classi-orfane`: 2 + 6 prove, 0 fallite, 14 pagine.
- Giro `node` sulla copia di quello che si committava: **23 comandi, 0 caduti**.

## In volo

⏳ Il **giro del browser**, porta **8823**, `scratchpad/io-core/giro-7.txt`,
copia di `958018d`, pid 28054. Cammina ancora, oltre le 3.900 righe, dentro le
controprove finali.

## Prossimo passo atomico

⛔ **Raccogliere `giro-7.txt` appena finisce** (in coda scrive `USCITA <n>`):
1. prima le righe **«non ho guardato»** — su Genesi il banco del contrasto
   dichiara **69 classi mai comparse** (22 misurate, 47 solo elencate);
2. **poi** i KO, togliendo le **controprove**, che il registro dichiara da sé
   («⚠️ CONTROPROVA: qui sotto il rosso è quello VOLUTO»);
3. uscita **2** = si è dichiarato **non valido** e va rifatto.

Poi, a giro fermo (tocca le pagine):
- ⏱️ **Togliere le 59 righe inerti** (import mai usati) e portare la quinta
  domanda di `nomi-liberi` a regola.

## Blocchi
Nessuno.
