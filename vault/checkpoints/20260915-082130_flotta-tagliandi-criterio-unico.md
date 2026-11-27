# Checkpoint — 2026-09-15T08:21:30Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
3fd449cd (pushato)

## Cosa è stato completato

Chiusa la Flotta rimandata nel checkpoint precedente (`20260915-080110`).
Riverificato a mano il finding della ricerca in background, poi disegnato e
verificato personalmente il fix con più cura data la complessità.

**Il difetto**: `tagliandiInScadenza` (dashboard KPI) e `urgenzaManutenzione`
(fonte unica dichiarata per scheda/lista/ordini/Quadro) decidevano "vince ore
o data" con criteri diversi per un tagliando con entrambe le soglie vicine:
la prima confrontava i "giorni grezzi" (0 fisso se già scaduta a ore, giorni
di calendario veri sul lato data — due scale non equivalenti), la seconda il
RANGO del colore. Riprodotto: tagliando scaduto di 100h e di 5gg — la scheda
dice "SCADUTA (+100h)" (via ore), il cruscotto contava "1 a data".

**La correzione**: `conData` (dentro `tagliandiInScadenza`) confronta adesso
`RANGO_URGENZA[u.cls]` contro `RANGO_URGENZA[uData.cls]` (calcolato con
`urgenza(dEntrambi, oggi)`, la stessa funzione che `urgenzaManutenzione`
chiama per il lato data), non più i giorni grezzi — stesso criterio, non due
calcoli paralleli che potevano divergere.

**Verifica**:
- Riprodotto indipendentemente (non lo script dell'agente) sia il caso
  "scaduta per tutto" sia il pareggio di colore "warn/warn" con un ritmo di
  consumo misurato: in entrambi, prima del fix `tagliandiInScadenza`
  divergeva da `urgenzaManutenzione`, dopo concorda.
- Nuovo test: "⛔ Flotta · tagliandiInScadenza: la tessera del cruscotto non
  contraddice più la scheda del mezzo" — verifica `via` uguale fra le due
  funzioni sia nel caso "scaduta per tutto" sia nel pareggio di colore.
- `run-kpi.mjs`: 2993/0 (invariato nei test preesistenti, compreso quello
  che verifica "ore già oltre e data fra 9 giorni: comandano le ore" — il
  vecchio confronto ci azzeccava per caso in quel caso specifico).
  `run-stile.mjs`: 328/0. `sintassi-pagine.mjs`: 34/34.
  `numeri-nei-documenti.mjs`: 43/0 (cascata 2992→2993, 3.476→3.477).
- Controprova: rimesso il vecchio confronto sui giorni grezzi, il nuovo
  test cade esattamente sull'asserzione attesa; ripristinato e riverificato.
- Giro isolato su worktree separata: **40 comandi a posto, 0 caduti**, cifra
  "asserzioni eseguite dal giro" aggiornata a 3.943.
- `git status --short` verificato prima del commit: esattamente i 6 file
  intesi (lo staging era misto con lavoro non ancora pronto su
  Sentinella/Conti nello stesso `run-kpi.mjs`: verificato con
  `git diff --cached -- run-kpi.mjs | grep "^@@"` che solo l'hunk di Flotta
  fosse nell'indice).

## Stato roadmap

Nessuna voce di roadmap dedicata (difetto da ricerca mirata). Il quarto giro
di ricerca (Sentinella, Conti, Genesi) ha già riportato tre findings, in
lavorazione: Sentinella (foglio volata, chiave debole su lettura — FIX GIÀ
SCRITTO E VERIFICATO IN LOCALE, non ancora committato), Conti (due findings:
`applicaIncassi` senza note — FIX GIÀ SCRITTO E VERIFICATO IN LOCALE, non
ancora committato; numerazione DDT "senza salti" dichiarata ma non
imposta — non ancora affrontato), Genesi (`simulaPerforazione` ripiega
silenziosamente su B/S/prof invece di rispettare il contratto
`volumeForo`/`non calcolabile` — non ancora affrontato).

## Prossimo passo atomico

Finire e committare l'unità Sentinella (fix in `sentinella-data.js` +
test in `run-kpi.mjs`, già verificati in locale con controprova: solo
manca lo staging separato da Conti, il giro isolato e il commit). Poi Conti
(`applicaIncassi`, stesso stato: pronto, da isolare/committare). Poi
decidere su DDT (Conti, probabilmente una nota in `DECISIONI_WEEKEND.md`
più che un fix — tocca l'assunzione "readonly = niente doppioni" che è
vera, ma "senza salti" non lo è mai stata davvero) e su Genesi
(`simulaPerforazione`, fix scoped chiaro: usare `volumeForo` come guardia,
sul modello di `pfNominale`). Nessuno stop volontario: si prosegue subito.
