# Checkpoint — 2026-08-07 00:37:15 UTC

## Tipo
unit-complete (tre unità: `chiediDati` e la stretta di `nomi-liberi`, la lezione
in CLAUDE.md, la verifica della ricerca sul DDT)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`78fd448` — *La ricerca sul DDT aveva ragione sui «non c'è» e torto sul perché —
e il perché era un articolo di legge inventato*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|---|---|
| 92 | **`chiediDati` + `nomi-liberi` stretto** (`942db1e`) | **6** chiamate orfane, 1 settimana, 0 falsi allarmi nuovi |
| 93 | **CLAUDE.md, la lezione dell'ampiezza** (`f267acd`) | 1 regola nuova, misurata |
| 94 | **La ricerca sul DDT verificata** (`78fd448`) | 2 «non c'è» veri, 2 giustificazioni false |

## ⛔ Il difetto della giornata: un bottone che non faceva NIENTE da una settimana

`chiediDati()` è chiamata **sei volte** in `apps/flotta/index.html` e non
esisteva da nessuna parte. Provato **premendo il bottone**, non dedotto: click
su «è ripartito» di una macchina ferma → `chiediDati is not defined`, **zero
modali aperte**. Stessa sorte per «il prossimo tagliando», «data della spesa»,
«verifica eseguita», «la prossima scadenza».

L'origine, trovata in git: il commit **`486011d` del 31/07** ha portato in
`shared/dw-app-ui.js` **sette** delle otto funzioni della struttura del core.
La ottava no — e la usava una app sola.

## ⛔ E LA PARTE CHE VALE PIÙ DELLA CORREZIONE: perché nessun controllo l'aveva visto

`nomi-liberi.mjs` esiste **apposta** per questa famiglia e rispondeva «nessun
nome chiamato che non esiste». Il riconoscitore dei dichiarati era
`\b(?:const|let|var)\s+([^;\n]*)` — prendeva **tutta la riga** — e nel suo
commento c'era la ragione, sensata: *«largo di proposito: un falso negativo
costa meno di un falso allarme»*. Effetto vero: legava **ogni parola sulla
stessa riga di un `const`**, cioè era cieco sulla forma più frequente che il
codice abbia, `const x = qualcosa(...)`.

| | prima (larga) | dopo (stretta) |
|---|---|---|
| `conta` tolto dall'import di Campo | **non visto** | visto |
| falsi allarmi nuovi su 12 pagine e 18 moduli | — | **2**, dichiarabili per nome (`import(` è sintassi, `require(` è Node) |
| difetti veri trovati | 0 | **1** (`chiediDati`, 6 chiamate) |

⚠️ **La lezione non è «stringere sempre»: è che l'ampiezza è un numero, e quel
numero si misura.** Il timore era ragionevole e la misura l'ha smentito in
cinque minuti.
⚠️ Corollario: `UI_CONDIVISA` di `run-stile` aveva **sei** nomi scritti a mano
mentre la struttura condivisa ne espone **dieci**. Un elenco a mano non poteva
accorgersi di `chiediDati` — non sapeva nemmeno che quel nome esistesse. Ora è
derivato da `window.X =` del file condiviso.

## ⛔ La ricerca sul DDT: giusta sul «non c'è», falsa sul «perché»
I due «non c'è» (*porto*, *aspetto esteriore*) sono **veri**. ⚠️ E il primo
`grep` stava per smentirli al contrario: `grep porto` risponde **191** per via
di «im**porto**» e «tras**porto**».
Ma la giustificazione era inventata: «DPR 472/1996, **art. 7 e 8**» — il decreto
è un **articolo unico**, ed è il **comma 3** a elencare il contenuto del DDT; e
*porto* e *aspetto esteriore* erano requisiti della **bolla di accompagnamento**
(DPR 627/1978), che proprio il 472/1996 ha **abolito**. ⚠️ L'URL citato dalla
ricerca dice `atto/**abrogato**`: la fonte avvisava da sola.
Il prodotto invece aveva ragione: le quattro citazioni dentro
`apps/conti/index.html` sono corrette. **Settima volta in questo blocco che a
sbagliare non è l'app.**

## ⚠️ Misurato e NON ancora corretto: i CSV di Scudo
Le altre cinque app marchiano i file esportati in dimostrazione
(`DATI-DI-ESEMPIO_`). **Scudo ha `db.mode`, ha il banner del tour, e i suoi
quattro export CSV non sono marchiati** — fra cui `scudo_registro_infortuni.csv`,
che è il documento che si porta a un ispettore. `csv-dimostrazione.mjs` copre
cinque app e Scudo non è fra loro.
⚠️ **Genesi NON è lo stesso caso, e non va contato come tale**: dichiara di sé
alla riga 1053 «localStorage, nessun account» — non ha una modalità
dimostrazione. I suoi 7 CSV non sono un difetto di questa famiglia.

## Stato delle prove
Prove `node` **2.191** (nomi liberi 6 → **7**), copertura **660/660**, banchi del
browser **116**. Giro `node` 21 comandi, 0 caduti sulla copia di ciò che si
committa, a ogni commit.

## Prossimo passo atomico
1. **Raccogliere il cantiere di Scudo** (`scudo-frasi-da-uno.mjs`, in corso).
   Con la stessa procedura: indice, verifica sulla copia, banco lanciato davvero.
2. **Poi, e solo dopo**: marchiare i quattro CSV di Scudo con `marchiaCsv` +
   `nomeCsvDimostrazione` come fanno le altre cinque app, e aggiungere `scudo`
   all'elenco `APP` di `csv-dimostrazione.mjs`. ⛔ Non prima: il cantiere ha in
   mano `apps/scudo/index.html`.
3. **Le 19 decisioni scadono OGGI, venerdì 07/08.** Se non arriva risposta si
   procede con la colonna «la mia risposta» di `docs/DECISIONI_WEEKEND.md`,
   **dichiarandolo nel commit**; restano ferme le 6 che richiedono il fondatore.
4. Le due proposte del DDT (*porto*, *aspetto esteriore*) sono **buone come
   prassi commerciale** e vanno costruite con quell'etichetta, mai come obbligo
   di legge.

## Code aperte, dichiarate
- I **4 CSV di Scudo** senza marchio della dimostrazione (sopra).
- In **Scudo** restano 25 ternari del singolare a mano: non sono difetti.
- Su **Scudo** il banco delle modali apre 2 modali su 34.
- La tendina `#ppv-scelta` di Sentinella taglia un'opzione: dichiarata.
- Il **7,5%** del motore dei grafici e il **minimo di visibilità**: misurati,
  dichiarati, non corretti.
- In **Conti**, `.meta.pesa` taglia 15 px su 1 riga DDT su 5: accettato.

## Blocchi
Nessuno.
