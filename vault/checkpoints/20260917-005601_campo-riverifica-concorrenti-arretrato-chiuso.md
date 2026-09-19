# Checkpoint — 2026-09-17T00:56:01Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
565b250b

## Cosa è stato completato
Riverificato l'arretrato di `docs/CONCORRENTI_CAMPO.md` misurato da
`documenti-invecchiati.mjs` (38 commit su `apps/campo/`/`shared/dw-ponti.js`
dal precedente `97cbf67`, di cui 12 che MORDONO). Cercati i termini delle
undici capacità ancora "CONFERMATO ASSENTE" (geofencing/GPS, IoT/sensori,
tablet in-cab, dispatch, RFID/barcode/QR, mixed-fleet monitoring,
offline/IndexedDB, multi-sito, meteo a griglia, RFID componenti,
manutenzione predittiva) **solo nelle righe aggiunte** dell'intero
intervallo (`git diff 97cbf67..6225df74 -- apps/campo/ shared/dw-ponti.js |
grep '^+'`): un solo colpo, "vibrazione" nel commento di
`righeVolateDelGiorno` (ponte P6, 05/09) — falso positivo del gergo di casa
(è una lettura di vibrazione da Sentinella, non un sensore IoT). Nessuna
riga della tabella delta si muove: le undici mancanze restano vere.

Corretta anche la citazione del commit di verifica: il primo tentativo
citava il canarino `a8bb5c5d` (non tocca mai `apps/campo/` né il
documento), preso subito da `documenti-invecchiati.mjs` con l'errore
esplicito «una data incollata non è una verifica». Letta la logica del
controllo (`tocchiDoc.includes(pieno) || tocchiApp.includes(pieno)`) e
corretto citando `6225df74`, l'ultimo commit che ha davvero toccato
`apps/campo/` (una mia unità precedente di questo stesso blocco).

Verificato dopo la correzione: `documenti-invecchiati.mjs` dà Campo
**0 commit dopo, 0 mordenti**; `numeri-nei-documenti.mjs` 43/0;
`prove-grep-scadute.mjs` 6/0. Commit + push fatti.

## Stato roadmap
Il giro completo del browser (PID 449, rilanciato nel ciclo precedente) è
**ancora vivo** e sta scrivendo (ultime righe: KO veri su Scudo/Sentinella
sulle barre di navigazione a più larghezze — da leggere con `leggi-giro.mjs`
quando finisce, non a occhio). Non toccato nessun modulo dati o pagina.

La "seconda iterazione" sui documenti CONCORRENTI_* stale prosegue:
Campo chiuso; restano da riverificare Conti (64 commit/31 mordenti al
precedente censimento), Flotta, Scudo, Sentinella, Terra.

## Prossimo passo atomico
1. Ripetere lo stesso metodo su `docs/CONCORRENTI_CONTI.md`: leggere il
   commit di verifica dichiarato, contare l'arretrato
   (`git log --oneline <hash>..HEAD -- apps/conti/ shared/dw-ponti.js`),
   enumerare gli item ancora "CONFERMATO ASSENTE", cercarli solo nelle
   righe aggiunte dell'intervallo, verificare se qualcuno è stato chiuso.
   Citare come commit di verifica l'ultimo che ha DAVVERO toccato
   `apps/conti/` (`git log --format=%H -1 -- apps/conti/`), non un
   canarino. Verificare con `documenti-invecchiati.mjs` prima di committare.
2. In parallelo, continuare a controllare il giro browser (PID 449) senza
   toccare moduli dati o pagine: `ps -p 449` e, quando sembra fermo,
   `leggi-giro.mjs` (mai a occhio).
3. Se il giro finisce, leggere i risultati con `leggi-giro.mjs` e aprire
   unità dedicate per ogni difetto vero trovato, con lo stesso rigore
   (verifica diretta, controprova, giro node isolato, doc-cascade,
   checkpoint) usato per le sedici unità precedenti.

## Blocchi
Nessuno. Il giro browser in corso non blocca il lavoro su `docs/`.
