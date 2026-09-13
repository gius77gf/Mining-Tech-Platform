# Checkpoint — 2026-09-04T02:12:12Z

## Tipo
unit-complete (banchi: il service worker del core)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
4fca9069

## Completato
Due banchi sul core (tendine, barra in alto) misuravano il guscio: al reload
di `accediAlCore` il service worker serviva `index.html` dalla cache, senza
la porticina iniettata. Contesto del core con `serviceWorkers:'block'`,
guardia che dichiara il guscio, timeout sui tentativi. Da 0 a 70 finestre
aperte; controprova nei due versi.

## In corso
Giro filtrato del browser (--solo=scudo,sentinella,flotta,core: 66 passate su
229) sulla copia di `4fca9069`, partito alle 02:11Z (registro
`scratchpad/giro-browser-0904a.log`). ⛔ Finché gira non si toccano i banchi.

## Prossimo passo atomico
Leggere il giro filtrato a fine corsa (`leggi-giro.mjs`), riverificare ogni
KO sul commit corrente; poi Conti (terza tornata completa) e l'unità dello
schermo del progetto con i chili grezzi (dopo il giro, perché tocca un banco).

## Blocchi
Nessuno. Decisioni del fondatore aperte: 5b, 19, 20, 21, 22, 23, 24, Q1.
