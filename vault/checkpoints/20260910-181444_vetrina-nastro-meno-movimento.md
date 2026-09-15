# Checkpoint — 2026-09-10T18:14:44Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
a710c8ac

## Completato
La vetrina: il nastro dei nomi stava SOTTO la foto della sezione dopo dal
25/08 (`.fondale` con `inset:-12%` che sale sopra il nastro statico):
`position:relative; z-index:1`, verificato con hit-test a fondale cliccabile
(prima `span.velo`, dopo il nome) a 1280 e 390. E sotto
`prefers-reduced-motion` il nastro va a capo centrato, la copia doppia dei
nomi sparisce (9 su 9 visibili a 390 e 320, prima 2 su 9).
Roadmap aggiornata nella voce «LA VETRINA E IL NASTRO CHE SCORRE».

## Metodo (per chi rifà la passata su un'altra app)
`scratchpad/racc/pass/cammina.mjs <app> <porta> <cartella>`: serve la
cartella viva, apre ogni sezione a 320 e 430, scatta a fette da 1400 px
(PIL non c'è: si usa `clip` di Playwright), stampa scorrimento laterale ed
errori di pagina. Le fette si LEGGONO tutte; una misura decide (`.fl` con
getComputedStyle, le tacche con getBoundingClientRect), lo scatto propone.

## Prossimo passo atomico
1. Quando il giro filtrato del browser finisce (registro in
   `scratchpad/giri/`), leggerlo con `leggi-giro.mjs`: sezione 0, righe «non
   ho guardato», poi i KO veri; chiudere ciò che è vero. 2. Un'asserzione
   sul nastro con meno movimento in `vetrina-collegamenti.mjs` (contesto con
   `reducedMotion:'reduce'`, pretendere 9 nomi con larghezza dentro lo
   schermo a 390) — da scrivere SOLO a giro fermo, perché i banchi si
   caricano dalla cartella viva.

## Blocchi
Nessuno.
