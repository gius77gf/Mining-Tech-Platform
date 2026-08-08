# Checkpoint — 2026-08-08T05:14:02Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`c292bd9` — *Flotta: il terzo documento a zero — arretrato 71 → 38 in tre
unità*

## Che cosa è stato completato

Terzo documento riportato a zero di arretrato, con lo stesso metodo di
Sentinella e Terra. Flotta era la più economica delle quattro rimaste, e **la
ragione è un'informazione, non un dettaglio**: **zero commit che mordono** su
otto. In quell'intervallo (+442 righe, −100) Flotta ha cambiato **come** dice
le cose, non **quali** cose sa fare.

La ricerca sul diff dà **due sole occorrenze**, tutt'e due `fattura` e tutt'e
due **prosa**: un commento sul rifornimento e la nota di un rifornimento della
dimostrazione («cisterna interna, fattura non ancora arrivata»). Nessun
**legame** fra una fattura e un ordine di lavoro — che è quello che la riga
dichiara assente.

Sui file interi: `firma digitale`, `firma grafometrica`, `stanziam`, `sforat`,
`contabil`, `miglia`, `mile` → **0 ciascuno**; **`km` → 0**, che è la prova
diretta della riga sui piani a chilometri; `budget` → **1**, ed è un commento
che spiega la domanda «la riparo ancora?», non un preventivo di spesa.

## Il numero che scende

| | arretrato | di cui mordono | documenti a zero |
|---|---|---|---|
| prima di stanotte | **71** | 16 | 0 su 6 |
| dopo Sentinella | 59 | 15 | 1 |
| dopo Terra | 46 | 10 | 2 |
| dopo Flotta | **38** | 10 | **3 su 6** |

## Prove

- `documenti-invecchiati`: `✓ flotta verificato a 5df42f6 · 0 commit dopo, di
  cui 0 che MORDONO`.
- Giro `node` sulla copia di quello che si committava: **23 comandi, 0 caduti**.

## In volo

⏳ Il **giro del browser**, porta **8823**, `scratchpad/io-core/giro-7.txt`,
copia di `958018d`, pid 28054. **1.730 righe**.

## Prossimo passo atomico

⏱️ **I tre documenti che restano**, per costo crescente — il metodo è fisso e
costa una decina di minuti l'uno:
1. **campo** (9 commit, 3 mordono);
2. **conti** (14 commit, 4 mordono);
3. **scudo** (15 commit, 3 mordono).

Il metodo, per non riscoprirlo: (1) `documenti-invecchiati` dice quanti commit
e quali **mordono**; (2) `git show <mordono> -- apps/<app>/ | grep "export
function\|<button"` dice **che cosa** è stato costruito; (3) si cerca sul
**diff** con i termini che ogni riga dichiara, **con i confini di parola**;
(4) le righe «a metà» si rimisurano sui file interi; (5) si sposta il timbro
all'ultimo commit dell'app e si scrive la sezione con le prove.

Poi:
- ⛔ **Raccogliere `giro-7.txt`**: prima le righe «non ho guardato», poi i KO
  senza le controprove; uscita 2 = non valido.
- ⏱️ **Togliere le 59 righe inerti** e portare la quinta domanda a regola —
  tocca le pagine, vuole il giro fermo.

## Blocchi
Nessuno.
