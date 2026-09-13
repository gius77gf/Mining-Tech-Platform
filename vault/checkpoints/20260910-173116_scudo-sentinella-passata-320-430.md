# Checkpoint — 2026-09-10T17:31:16Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
15065f47

## Completato
Passata in profondità su Scudo e Sentinella a 320 e 430 px. Scudo: niente da
correggere (visti-e-lasciati in roadmap). Sentinella: l'arretrato dichiarato
di `fuori-schermo` (22 righe, tre larghezze) era `--info-basis:110px` →
190px, i comandi vanno a capo sotto il testo; 0 fuori a 390/360/320;
Sentinella in `PRETESE` con controprova. Roadmap: voce «PASSATA IN PROFONDITÀ
SU SCUDO E SENTINELLA».

## Metodo (per chi rifà la passata su un'altra app)
`scratchpad/racc/pass/cammina.mjs <app> <porta> <cartella>`: serve la
cartella viva, apre ogni sezione a 320 e 430, scatta a fette da 1400 px
(PIL non c'è: si usa `clip` di Playwright), stampa scorrimento laterale ed
errori di pagina. Le fette si LEGGONO tutte; una misura decide (`.fl` con
getComputedStyle, le tacche con getBoundingClientRect), lo scatto propone.

## Prossimo passo atomico
La stessa passata su CAMPO e poi TERRA: `cammina.mjs campo 8700 <cartella>`,
guardare ogni fetta a 320 e 430, misurare prima di correggere (le sonde
`tacche.mjs`, `catlab.mjs`, `tabelle.mjs`, `riga.mjs`, `fl.mjs` sono in
`scratchpad/racc/pass/`), leggere l'arretrato dichiarato dai banchi
(`fuori-schermo`, `contrasto`, `finestra-caricamento`) PRIMA dei KO; i punti
d'uscita li aprono `campo-*` e `terra-*`. Poi il core.

## Da guardare (trovato di passaggio, NON di questa unità)
`fuori-schermo.mjs` senza `--solo` esce 1 sulla VETRINA: 16 comandi «fuori
dallo schermo» a 390/360/320 — sono i nomi delle app nel nastro che scorre
(`div.scorre`, 2730 px, dentro `section.striscia` con `overflow-x:hidden`),
otto voci ripetute due volte per il giro continuo. Misurato anche su
`d82a7871` (stamattina, prima delle unità 45-47): PREESISTENTE, non causato
da oggi. Da decidere in un'unità sua: o le voci del nastro non sono comandi
(sono un ticker: `aria-hidden` sulle copie e niente `href`), o il banco
riconosce il nastro e lo dichiara. Non è nell'arretrato dichiarato del banco.

## Blocchi
Nessuno.
