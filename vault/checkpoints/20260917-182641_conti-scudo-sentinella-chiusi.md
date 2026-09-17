# Checkpoint — 2026-09-17T18:26:41Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
4ec2fd56

## Cosa è stato completato
Chiuso il secondo round della "passata in profondità" (tre cantieri paralleli
in background, Conti/Scudo/Sentinella), con lo stesso metodo del round
precedente: ogni finding riverificato leggendo io stesso il sorgente e
riproducendo dal vivo con Playwright PRIMA di correggere.

**Sentinella** — 2 finding, 1 corretto + 1 in decisione:
1. `fogliaVolata`: un limite di vibrazione dichiarato SENZA la norma
   scriveva solo il numero, tacendo che la fonte manca. Aggiunta la frase
   "(norma non indicata sul progetto)".
2. **Voce 33 di `docs/DECISIONI_WEEKEND.md`**: `statoMisura` conta un
   `valore` senza lettura datata come "misurato" per il semaforo di
   conformità, mentre `statoRigaProgramma` lo dice "mai misurato" per lo
   scadenzario — sullo stesso punto (riprodotto sul dato demo `a1`/`pr5`).
   Il codice dichiarava già questo rischio come "latente"; il dato demo
   mostra che è raggiungibile con un valore scritto a mano. Routing a
   decisione perché tocca il verdetto di conformità normativa.

**Conti** — 2 finding, entrambi corretti:
1. Un incasso parziale + una nota di credito che chiude il resto (il caso
   "normale" descritto dal commento di `statoFattura`) non aveva mai una
   data di saldo vera: `dataSaldo` restava `null` (ereditata da
   `statoIncasso`, che non sa delle note), quindi la riga della fattura
   scriveva "incassata, data non registrata" su un incasso vero, e la
   fattura spariva dai tempi reali di pagamento (`contaNeiTempi` non aveva
   consumatori). Aggiunta la data vera (la più tarda fra ultimo movimento
   e nota); `tempoMedioPagamento`/`tempiPagamentoClienti` ora passano da
   `statoFattura` invece che da `statoIncasso` grezzo.
2. Il badge "SCARTATA: COME NON EMESSA" veniva tagliato a metà parola
   ("...COME NON EM") a 1280px quando la riga aveva altri bottoni azione,
   per `overflow:hidden` + `-webkit-line-clamp:2` su `.name` con un badge
   `white-space:nowrap`. Aggiunta `.name .badge{white-space:normal}`: il
   badge va a capo invece di essere clippato senza ellissi.

**Scudo** — 1 finding, corretto:
Il verbale di ispezione stampato e il fascicolo per l'ispettore non
ricevevano mai `permessi`: una voce "conforme" senza permesso di lavoro
registrato dietro (il difetto che `provaVoce`/`conformiSenzaProva` esistono
per prendere, già corretto a schermo) arrivava al documento cartaceo uguale
a una voce davvero conforme. Verificato dal vivo: il verbale ora stampa
"conforme — Non lo sappiamo — ..." sulla riga giusta, e la finestra di
conferma prima della stampa lo dichiara.

Ogni fix ha la sua controprova (difetto rimesso, test cade, difetto tolto,
test torna verde) e un test in `run-kpi.mjs`. Numeri dei documenti
(DEVELOPMENT.md/STATO_PRODOTTO.md/DECISIONI_WEEKEND.md/ROADMAP_SETTIMANA.md)
aggiornati dopo i nuovi test: 3.603 → 3.607.

## Nota di metodo
Il totale "asserzioni eseguite dal giro" (non le 9 suite contate da
`numeri-nei-documenti.mjs`, il totale intero) è risultato instabile fra
lanci consecutivi sullo STESSO commit: 4046, poi 4091, poi 4092. Non
indagato a fondo per tempo — dichiarato nei documenti invece di inseguito
riga per riga, perché nessun test lo sorveglia e il numero cambia da solo.
Da guardare in un prossimo blocco se si vuole capire la causa (sospetto:
`orologio-cliente.mjs` o un altro comando con un ramo dipendente dalla
data/ora vera).

## Stato roadmap
Deep-pass di Terra/Flotta/Campo (round 1) e Conti/Scudo/Sentinella (round 2)
chiuse. Restano Genesi e il core per completare tutte le superfici.

## Prossimo passo atomico
1. Deep-pass in profondità su Genesi e sul core (index.html alla radice),
   stesso metodo: 1-2 Agent in background, riverifica diretta di ogni
   finding con Playwright prima di agire.
2. Se emergono altre due decisioni-di-prodotto come la 33, stesso pattern:
   routing a `docs/DECISIONI_WEEKEND.md`, non implementate di iniziativa.
3. Investigare l'instabilità del totale "asserzioni eseguite dal giro" fra
   lanci consecutivi (vedi nota di metodo sopra), se il tempo lo permette.

## Blocchi
Nessuno.
