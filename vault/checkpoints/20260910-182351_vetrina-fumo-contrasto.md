# Checkpoint — 2026-09-10T18:23:51Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
f27eb3d8

## Completato
La vetrina: `--fumo` #8d8878 → #9a9583, i quattro testi piccoli a cavallo
dei gradienti passano il 4,5 (contrasto sulla vetrina: 5 KO → 1, e quell'uno
è il testo dentro il marchio, limite del righello). KO preesistenti,
verificati su `d82a7871`. Roadmap: voce «LA VETRINA E IL CONTRASTO DEL
"FUMO"».

## Metodo (per chi rifà la passata su un'altra app)
`scratchpad/racc/pass/cammina.mjs <app> <porta> <cartella>`: serve la
cartella viva, apre ogni sezione a 320 e 430, scatta a fette da 1400 px
(PIL non c'è: si usa `clip` di Playwright), stampa scorrimento laterale ed
errori di pagina. Le fette si LEGGONO tutte; una misura decide (`.fl` con
getComputedStyle, le tacche con getBoundingClientRect), lo scatto propone.

## Prossimo passo atomico
A giro del browser FERMO (guardare `ps` per `tutti.mjs`, poi la porta):
1. `contrasto.mjs`: saltare i `<text>` dentro `svg[aria-hidden="true"]` e
   contarli nel riepilogo («N testi decorativi dentro un marchio, non
   giudicati»), controprova nei due versi; rilanciare `--solo=vetrina` → 0 KO.
2. Leggere il registro completo del giro filtrato con `leggi-giro.mjs`
   (sezione 0, «non ho guardato», KO veri) e chiudere ciò che è vero.

## Blocchi
Nessuno.
