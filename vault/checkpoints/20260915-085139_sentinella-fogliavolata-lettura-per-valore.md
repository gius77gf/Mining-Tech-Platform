# Checkpoint — 2026-09-15T08:51:39Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
d616ea8e (pushato)

## Cosa è stato completato

Chiusa l'unità Sentinella rimandata nel checkpoint precedente
(`20260915-082130`). Riverificato a mano il finding del quarto giro di
ricerca in background, poi disegnato e verificato personalmente il fix.

**Il difetto**: `fogliaVolata` cercava la lettura confermata di una PPV da
strumento con `.find()` su `(data, ora facoltativa)` — stessa famiglia del
difetto già chiuso oggi su `_findVolata` nel core. Con più letture dello
stesso punto nello stesso giorno e senza `ora` nell'import (facoltativa),
sceglieva in silenzio la PRIMA in archivio. Se la lettura confermata era
quella **annullata** ma non la prima nell'array, l'avviso di sicurezza
"lettura dichiarata non valida" poteva sparire dalla scheda.

**La correzione**: `.find()` → `.filter()`, aggiungendo al confronto
`ppv.valore` (il numero già confermato sulla volata, già scritto lì) oltre
a data e ora. Con un solo candidato residuo si usa quello; con più di uno
si **dichiara l'ambiguità** invece di sceglierne uno a caso — e per
prudenza, se anche solo una delle candidate ambigue è annullata, l'avviso
di sicurezza resta acceso comunque (l'ambiguità non deve mai nascondere un
allarme).

**Verifica**:
- Nuovo test in `run-kpi.mjs`: due letture stesso giorno (una valida, una
  annullata, valori diversi) in ordine A e ordine B (invertito) — l'avviso
  c'è in entrambi i casi, non dipende dall'ordine in archivio; poi vera
  ambiguità (due letture stesso giorno E stesso valore) → si dichiara
  "non si sa quale sia quella confermata" e l'avviso resta acceso.
- La controprova browser `sentinella-foglio-volata.mjs` aveva
  un'iniezione (`DIFETTI_MODULO #3`, "la lettura si cerca per data e
  basta") ancorata sul vecchio `.find()` a riga singola: **scaduta**
  (`iniezioni-fresche.mjs` l'ha presa: "il codice si è mosso perché è
  migliorato", non un difetto nuovo). Riancorata sul blocco `.filter()`
  nuovo (stesso difetto concettuale: torna a "solo data, prima trovata,
  mai ambigua"). Rilanciata con `--controprova --difetto=5`: **2 controlli
  caduti su 41**, confermando che la controprova sa ancora fallire.
- `numeri-nei-documenti.mjs`: cascata dei quattro documenti aggiornata
  (run-kpi 2993→2994, totale 3.477→3.478) e la cifra "asserzioni eseguite
  dal giro" ricalcolata fresca sulla worktree isolata di questa unità
  (3.944, non un numero fisso — si rimisura a ogni giro).
- Giro isolato su worktree separata (scoped esattamente ai 7 file di
  questa unità, isolata dal lavoro non ancora committato su Conti nello
  stesso `run-kpi.mjs` — verificato con `git diff --cached -- run-kpi.mjs
  | grep "^@@"` che solo l'hunk di Sentinella fosse nell'indice):
  **40 comandi a posto, 0 caduti**.

## Stato roadmap

Nessuna voce di roadmap dedicata (difetto da ricerca mirata). Del quarto
giro di ricerca (Sentinella, Conti, Genesi): Sentinella chiusa (questa
unità). Restano Conti (due findings: `applicaIncassi` senza note — FIX
GIÀ SCRITTO E VERIFICATO IN LOCALE, non ancora committato; numerazione
DDT "senza salti" dichiarata ma non imposta — non ancora affrontato) e
Genesi (`simulaPerforazione` ripiega silenziosamente su B/S/prof invece
di rispettare il contratto `volumeForo`/"non calcolabile" — non ancora
affrontato, e non ancora riverificato indipendentemente di persona).

## Prossimo passo atomico

Isolare, verificare e committare l'unità Conti (`applicaIncassi`, fix e
test già scritti e verificati in locale nella sessione precedente a
questa compattazione: manca solo lo staging separato — l'hunk di
`run-kpi.mjs` va estratto con la stessa tecnica di taglio delle patch
usata qui — il giro isolato e il commit). Poi decidere su DDT (Conti,
probabilmente una nota in `DECISIONI_WEEKEND.md` più che un fix — tocca
l'assunzione "readonly = niente doppioni" che è vera, ma "senza salti"
non lo è mai stata davvero) e su Genesi (`simulaPerforazione`, fix scoped
chiaro: usare `volumeForo` come guardia, sul modello di `pfNominale`, ma
prima riverificare di persona il finding dell'agente). Nessuno stop
volontario: si prosegue subito.
