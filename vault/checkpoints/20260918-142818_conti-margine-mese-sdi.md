# Checkpoint — 2026-09-18T14:28:18Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
3f542d5b — fix(conti): margineMese non escludeva le fatture scartate dallo SdI

## Cosa è stato completato
Dal deep-pass QA su Conti (agente a0dcbb7a264c32e8d): `margineMese` (il
margine mensile per competenza, schermata "Chiusura del mese") contava
fra i ricavi anche le fatture scartate dallo SdI — la guardia
`statoSdi(f, oggi).nonEmessa` già propagata a sei altre funzioni. Corretto
aggiungendo `oggi` alla firma e il filtro al calcolo delle fatture emesse.

## Verifica
Giro completo su worktree isolata (`git add -A` prima del giro): **41/41,
0 caduti**. KPI 3153→3154. 9-suite sum: **3.650**. Asserzioni totali del
giro: **4154**.

## Stato roadmap
Vedi vault/ROADMAP_SETTIMANA.md.

## Coda di lavoro
1. **Genesi Decking** (agente ae164109bbdd90b50, verificato dal vivo):
   `renderScheda2D` (genesi.html, righe ~7327/7334) usa `D2.stem` grezzo
   invece del valore guardato (`(+D2.stem>0)?+D2.stem:null`) che
   `computeKPI` già applica allo stesso campo — un borraggio illeggibile
   viene trattato come zero, disegnando un piano di carico fisicamente
   diverso (deck più lunghi del 30%, niente borraggio di testa) senza dire
   "non calcolabile". Richiede un banco browser (Genesi non ha funzioni
   pure testabili in node per questa parte del canvas SVG).
2. **La trappola del focus nella modale** (`shared/dw-app-ui.js`):
   `dwUiAggancia()` gestisce `Escape` ma non `Tab`, nessun `inert`/
   `aria-hidden` sul contenuto dietro. Tocca tutte le 8 superfici — unità
   a parte, più rischiosa.
3. Nuovi agenti di deep-pass QA da lanciare per mantenere ≥3 cantieri
   paralleli (gli ultimi quattro — Terra, Flotta, Conti ×2, Genesi — sono
   tutti tornati; tre già chiusi, uno (Genesi) in coda).

## Prossimo passo atomico
Implementare Genesi/Decking: scrivere un banco browser sul modello di
`terra-valore-calendario-impossibile.mjs`/`conti-modal-foot-listener.mjs`
(server statico + iniezione nella risposta HTTP + Playwright), verificarlo
mirato con controprova, registrarlo SUBITO in `tutti.mjs` e fare `git add
-A` sulla worktree PRIMA di lanciare il giro (le due lezioni di questo
blocco). Poi la trappola del focus. Poi dispatchare nuovi agenti QA.
Continuare "mai fermarsi".

## Blocchi
Nessuno.
