# Checkpoint — 2026-09-10T17:56:44Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
094945c8

## Completato
La vetrina: il nastro che scorre è dichiarato decorativo (`aria-hidden` +
`tabindex=-1` sulle 18 voci); `fuori-schermo.mjs` salta i sottoalberi
`aria-hidden` e li conta nel riepilogo. Sotto i 27 KO della vetrina ne stavano 4 di Conti («Elimina fattura» fuori
dallo schermo a 320: `.item>.acts` senza `max-width:100%`), chiusi. Il banco
intero passa da 31 KO (preesistenti) a 0 su 14 superfici × 3 larghezze. Roadmap: voce «LA
VETRINA E IL NASTRO CHE SCORRE» col visto-e-lasciato su reduced-motion.

## Metodo (per chi rifà la passata su un'altra app)
`scratchpad/racc/pass/cammina.mjs <app> <porta> <cartella>`: serve la
cartella viva, apre ogni sezione a 320 e 430, scatta a fette da 1400 px
(PIL non c'è: si usa `clip` di Playwright), stampa scorrimento laterale ed
errori di pagina. Le fette si LEGGONO tutte; una misura decide (`.fl` con
getComputedStyle, le tacche con getBoundingClientRect), lo scatto propone.

## Prossimo passo atomico
La passata in profondità sul CORE (index.html alla radice): `cammina.mjs`
va esteso per il core — `apriSuperficie` vuole `montaFintoFirebase` (da
`tests/browser/finto-firebase.mjs`) e le sezioni sono `SEZIONI_CORE`
(`@home`, `@volate`, …); poi guardare ogni fetta a 320 e 430 e misurare
prima di correggere. In parallelo leggere l'arretrato dichiarato di
`contrasto` e `finestra-caricamento` sul core.

## Blocchi
Nessuno.
