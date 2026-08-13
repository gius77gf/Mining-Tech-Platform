# Checkpoint — 2026-08-13 19:16 UTC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`a38a5017` — *Terra: il cumulato e il residuo del titolo sul foglio che va
all'ente*

## Che cosa è stato completato

**B0-sexdecies.** La regola c'era **nella stessa pagina, con la sua ragione
scritta dal 07/08**: senza nessuna misura sotto il titolo la frase diceva *«il
cumulato arriva a 0 m³ — lo 0% del concesso — e restano 1.200.000 m³»*, tre
numeri rassicuranti costruiti sul niente. Il **foglio stampato** e il **CSV**
quella frase la scrivevano ancora, identica: leggevano `residuoFineAnno != null`
invece della bandiera `misurabile`.

Misurato col titolo compilato e **zero rilievi** — che è lo stato del primo
giorno d'uso, e ci si arriva da un bottone vero:

| dove | prima | dopo |
|---|---|---|
| schermo | `—` | `—` |
| stampa · Cumulato a fine 2026 | **0 m³ (0% del concesso)** | non misurato |
| stampa · Residuo del concesso | **1.200.000 m³** | non misurato |
| CSV · Cumulato / Residuo | **`;0`**, **`;1200000`** | celle vuote, col motivo |

A otto righe di distanza, sullo stesso foglio, c'era già un «Totale 2026 · **non
misurato**»: due convenzioni opposte sullo stesso dato, e quella tranquilla nel
posto dove la legge un ispettore.

## ⛔ La parte che vale più del difetto
**Il banco scritto apposta non lo vedeva.** `terra-numeri-tranquilli` costruisce
l'anno cieco svuotando i rilievi, ma la dimostrazione dichiara
`estrattoPregressoM3: 880000` → `misurabile` resta **vero** e la sezione
incriminata non veniva **nemmeno attraversata**. Il banco sorvegliava la
bandiera **per ANNO** e non quella **per TITOLO**.

> **Un banco che guarda il posto giusto con la fixture sbagliata risponde
> «pulito» senza aver guardato.**

È la famiglia del «controllo che non guarda dove crede», in una veste nuova: non
il filtro e non la domanda, ma **i dati con cui la domanda viene fatta**.

## Altro, misurato
- Il **verbale** arrotondava all'unità il volume copiato dall'atto (`n0` →
  `nD`), mentre il prospetto duecento righe più su dichiara la regola opposta.
  I decimali sono raggiungibili: «1.200.000,50» entra come 1200000,5.
- Un «non c'è» **dichiarato con la prova**: una quota testuale stamperebbe
  «Quota NaN m» in tre posti, ma non ci si arriva da nessuna porta
  (`parseFrontiCsv` e il form filtrano tutt'e due). **Non toccato**: sarebbe una
  guardia contro un caso che oggi non esiste.
- I casi sani restano invariati **alla cifra**: 40.000 m³ (3,3%) / 1.160.000 m³
  con un rilievo; 880.000 m³ (73,3%) / 320.000 m³ con la dimostrazione.

`run-kpi` **2088 → 2092**, 0 falliti; `sintassi-pagine` 34;
`numeri-nei-documenti` 41 — sulla **copia di quello che si committa**, perché
l'albero porta anche due cantieri. Documenti: **2.540 → 2.544**.

## Che cos'è vivo adesso
- **Cantiere Conti** e **cantiere Sentinella** sulla stessa domanda: hanno già
  depositato i blocchi di prove, il resoconto non è ancora arrivato.
- **Cantiere sul core** per **B0-quindecies** (i 61 testi del tema chiaro).
- **Il giro del browser** su `d3653ec`, dentro il blocco `contrasto`.

## Prossimo passo atomico
Raccogliere **Conti** appena consegna, con la disciplina solita: diff letto riga
per riga, blocco di prove estratto **senza la prosa intorno**, `run-kpi`
**letto** prima di scrivere il messaggio del commit, verifica sulla copia, e i
quattro documenti aggiornati col numero **letto** (adesso `run-kpi` 2092, i
documenti dichiarano 2.544). Poi Sentinella, poi il core.

## Blocchi
- **Force-with-lease sul ramo**: la CI resta rossa su **quella riga sola**
  finché non arriva il sì del fondatore. La correzione è costruita e provata.
- **B0-septies** e le **soglie di sicurezza**: fermi al fondatore.
