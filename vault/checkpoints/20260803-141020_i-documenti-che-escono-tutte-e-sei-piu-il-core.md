# Checkpoint — 2026-08-03 14:10:20 UTC

## Tipo
unit-complete (sette unità: core, regola 25, Flotta, Sentinella, Genesi, il ponte, più le due modali mancanti)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`f9e71de` — *Il ponte Genesi → Sentinella: una legge tarata su tre referti
arrivava «calibrata»*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|---|---|
| 49 | **le due modali che mancavano** (`1cd1c73`, `757f0b9`) | **5** nomi chiamati e mai dichiarati, **4 su percorsi d'errore** |
| 50 | **il core** (`b35f647`) | una striscia invisibile copriva **6 comandi su 137** |
| 51 | **regola 25** (`aae9fb9`) | il difetto del core reso verificabile su 14 superfici |
| 52 | **Flotta · i fogli stampati** (`998a60e`) | «€ 12.750,00» chiede **169 px in 138**, solo sulla carta |
| 53 | **Sentinella · i fogli stampati** (`b03e2df`) | una lettura datata **30 febbraio** contata solo dal documento per l'ente |
| 54 | **Genesi · il foglio in cava** (`56747db`) | il foglio non diceva **SUPERA** dove lo schermo lo dice |
| 55 | **il ponte Genesi → Sentinella** (`f9e71de`) | una legge su **3 referti** arrivava «calibrata» |

## ⛔ Il filo, e stavolta è uno solo: dove il documento si compone
Tutte e sette le unità hanno la stessa forma. Lo schermo sa una cosa, il
documento che ESCE ne dice un'altra, e la differenza è sempre **verso la
risposta che tranquillizza**. Oggi si è chiuso su tutte e sei le app **più il
core**.
Le due varianti nuove, che valgono per il futuro:
1. **Il difetto non era nei numeri, era che il bottone non si lasciava
   premere.** Il `.toast` del core, `opacity:0` ma `pointer-events:auto`,
   copriva 6 comandi su 137 — due dei quali di esportazione. E la versione
   **giusta** era già in `shared/dw-app-ui.css`, che si dichiara «copia del
   core»: qui **la copia era migliore dell'originale**, ed è il verso opposto a
   quello che cerchiamo di solito.
2. **Il fatto si perde nel PASSAGGIO fra due app, senza che nessuna sbagli.**
   Genesi dichiarava a schermo la legge provvisoria; Sentinella leggeva
   correttamente ciò che riceveva; la bandiera non era nel file. Tre stati, non
   due: un file **vecchio** risponde «non dichiarato», mai «calibrata».

## ⚠️ Tre volte lo stesso inciampo, in tre vesti — e l'ho fatto io
- `nomi-liberi` rispondeva **«0 chiamate guardate»** (maschera scambiata per
  stringa);
- la banda di prove per la mora aggiungeva **zero** prove (`eq()` fuori da
  `test()`), col totale fermo e «0 falliti»;
- e ho committato **due modali nuove senza guardarle**: lo scatto ha poi
  mostrato che `mostraTesto` tagliava il testo a 320 px — nella finestra che
  esiste **apposta** perché l'utente legga e ricopi a mano.
**Un controllo che non ha guardato niente risponde esattamente come uno che ha
guardato tutto**, e il modo di distinguerli è sempre lo stesso: stampare quanti
soggetti ha visti, e guardare lo scatto.

## Stato delle prove
Prove **2.092** senza rete (run-kpi 1691, stile 289), banchi **84**, copertura
649/649 + condivise. Giro `node` **21 comandi** verde sulla copia di ciò che si
committa, a ogni commit.

## Che cosa sta girando adesso
- **il giro completo del browser** (`giro5.txt`) — gira da **oltre tre ore**, è
  il più lungo mai fatto (il banco del contrasto adesso aspetta le animazioni).
  Ha già trovato un **KO vero**: `scudo @390 «Segnala un near-miss»` — la
  tendina `#nm-chi` mostra «— chi segnala (facoltativo) —» tagliato, 209 px in
  134. È **lo stesso difetto** che il cantiere di Campo aveva corretto nella
  propria tendina togliendo il ruolo: qui è il segnaposto a essere troppo lungo;
- **due cantieri**: **Scudo** (riprende quello interrotto dal limite di
  sessione) e **la dichiarazione «dati di esempio» sui fogli stampati**.

## ⛔ Il buco d'ecosistema aperto, con la prova
`for A in conti terra scudo; do grep -c "solo-stampa\|DATI DI ESEMPIO"
apps/$A/index.html; done` → **0, 0, 0**; Genesi → **0**. In modalità
dimostrazione lo schermo dichiara due volte che i dati sono d'esempio e la
**stampa nasconde entrambe**: un foglio di dimostrazione può essere portato a un
controllo senza niente che lo distingua da uno vero. Flotta e Sentinella sono
state chiuse stamattina; le altre quattro sono il cantiere appena lanciato.

## Prossimo passo atomico
1. Raccogliere i due cantieri, **app per app**, con la solita procedura (indice
   da `HEAD`, banda dell'app, worktree ricreata, numeri di `docs/` dalla copia).
2. **La tendina di Scudo tagliata a 390 px** — se il cantiere di Scudo non
   l'ha già presa. Il rimedio è quello già usato in Campo: accorciare il
   segnaposto, non allargare la tendina.
3. Leggere `giro5.txt` alla fine (cerca `USCITA=`).
4. Poi: le tre proposte della ricerca su Scudo, **rimisurate una per una** —
   quella scheda oggi parte con poco credito, perché la sua gemella sulle norme
   aveva tre errori su una sezione sola.

## Code aperte, dichiarate
Immutate, più: il file che Genesi manda a Sentinella **ora** dichiara la legge
provvisoria (chiuso), `riconSave` che non registra la legge che ha prodotto la
previsione, il costo unitario che schermo e foglio raccontano diverso in Genesi,
e la riga **DUVRI** da portare al fondatore col suo RSPP. Le **19 decisioni**
procedono **venerdì 07/08** se non arriva risposta.

## Blocchi
Nessuno.
