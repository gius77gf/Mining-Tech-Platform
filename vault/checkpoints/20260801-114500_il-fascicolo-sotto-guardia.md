# Il fascicolo sotto guardia

**Data:** 01/08/2026 · **Area:** `apps/deepwork-id/tests/browser/stati-non-misurati.mjs`
**Unità precedente:** `20260801-111500_la-cartella-del-lavoratore.md`

## Il buco che restava

La cartella del lavoratore era provata **solo dal modulo**. Ma il difetto che
quella funzione esiste per impedire non vive nel modulo: vive **sul foglio
stampato**, dove una sezione vuota si legge «a questa persona non serve» invece
di «non è stato registrato niente». Il modulo può dire benissimo la cosa giusta
e la pagina stamparla bianca lo stesso — ed è esattamente quello che il DDT
faceva fino a stamattina.

## Il banco adesso chiede il foglio come lo chiede l'utente

Sceglie la persona nella tendina, preme il bottone, **conferma la modale del
core**, e legge il foglio. Due casi:

| persona | che cosa deve dire |
|---|---|
| Mario Rossi | cartella piena: le sezioni ci sono, e **non** compare «non è completa» |
| Anna Neri | cartella incompleta: «non è stato registrato niente» **e** la frase che spiega come vanno lette le sezioni vuote |

⚠️ Due accortezze, tutt'e due imparate stanotte: `window.print` va **spento**
prima (il dialogo del browser bloccherebbe il banco), e il bottone di conferma
della modale è `.mbtn.primary`, non `.dw-btn` — un banco che clicca il selettore
sbagliato resta appeso sulla modale e va in timeout invece di dire perché.

Il banco passa da **32 a 37 prove**, da 15 a **17 stati**.

## La controprova

Rimesse **bianche** le sezioni vuote (`−109 caratteri`: il ripiego rosso
sostituito con la stringa vuota) — cioè il difetto che la cartella esiste per
impedire — il banco cade sul caso giusto, e il messaggio mostra il foglio
troncato dove la dichiarazione **non** c'è più. Ripristinato e verificato con
`git status` vuoto.

Vale la pena notare **quale** delle quattro asserzioni cade: quella sul
contenuto del foglio, non quella sulla frase finale — perché `descriviCartella`
continua a scriverla. Sono due strati diversi (le sezioni e la chiusura) e la
controprova ne toglie uno solo: difesa in profondità, caso 2 della tassonomia.
Se cadessero tutte e due sarebbe segno che la chiusura ripete le sezioni — che
è proprio quello che ho tolto un'unità fa.

## Verifica

`stati-non-misurati` **37/0** — 17 stati, 6 app, due fogli stampati (DDT e
cartella). Controprova incorporata: cade. Controprova per regressione: cade sul
caso giusto. `suite-collegate` 3/0, 44 file.

## Prossimo passo atomico

Il **censimento delle sei app**, che è il debito dichiarato due checkpoint fa e
non è ancora stato pagato. Adesso però conviene farlo in modo diverso da come ho
provato due volte: non una sonda che apre tutte e sei le app e visita tutte le
sezioni (lenta, e mi ha costretto a fermarla), ma **partendo dal sorgente** —
l'elenco delle frasi che ogni app sa dire è già misurato — e chiedendo al banco,
che ormai ne copre 17, **quali di quelle frasi non sono in nessuna delle sue
liste**. È un confronto fra due elenchi di testo: si fa senza browser, in
`node`, e può diventare una misura permanente invece di una sonda usa-e-getta.
