# Checkpoint — 2026-09-17T22:25:19Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
a7c64cb3

## Cosa è stato completato
Terzo giro di deep-pass su Sentinella (dopo Terra/Flotta/Genesi/Campo in
questo stesso blocco):

1. **Ponte meteo con Campo, wiring incompleto**: `csvAmbiente` (export
   ARPA) e `contaFuoriCondizioni` (Quadro + schede) chiamavano
   `misuraFuoriCondizioni` senza il meteo del giorno (`IDX_METEO_GIORNO`),
   mentre `schedaPunto` — che disegna lo stesso conto a schermo — lo
   passava già. Un giorno di pioggia/vento forte poteva dare un verdetto
   diverso sullo schermo rispetto al documento spedito all'ente. Corretto
   passando il ponte anche nei due punti mancanti.
2. **`rispostaReclamo` scriveva "sotto la soglia" senza soglia
   confrontabile**: se per il giorno del reclamo esistevano misure ma
   nessuna aveva una soglia (punto senza soglia né ricettore), la lettera
   di chiusura sceglieva comunque la risposta rassicurante. Aggiunta una
   terza risposta che dichiara l'impossibilità del confronto.
3. Ancora invecchiata in `sentinella-numeri-tranquilli.mjs` (citava
   `csvAmbiente` a 3 argomenti) trovata da `iniezioni-fresche.mjs`
   (591/592 → 592/592), corretta, controprova del banco riverificata
   (12/28 KO col difetto rimesso).

Verificato: giro completo su worktree isolata (`git worktree add --detach
HEAD` + `git diff --cached | git apply` + `git add -A`), 41/41 comandi a
posto, 4098 asserzioni, KPI 3116/3116, `numeri-nei-documenti.mjs` pulito.
Rifatto DUE volte (prima e dopo il fix dell'ancora) per essere sicuri che
il giro misurasse ciò che si stava per committare.

In coda al commit, un append di sola ricerca in `docs/RICERCA_CONTINUA_TERRA.md`
(proposta monitoraggio falda/piezometri per Terra) — non ancora
verificato con grep indipendente, non ancora deciso se implementare.

## Stato roadmap
Seconda passata deep-QA completa su tutte le app (Conti, Scudo, Sentinella,
Genesi, Core, Terra, Flotta, Campo). Terza passata: Sentinella fatta
(questo checkpoint), Conti fatta (agente a5fa955d5c679000d, 1 difetto
trovato, ancora da fixare — vedi sotto).

## Prossimo passo atomico
1. **Fixare il difetto Conti trovato dal terzo giro di deep-pass**
   (report dell'agente a5fa955d5c679000d): in "Fattura differita dai
   DDT" (`apps/conti/index.html` sezione Fatture), finché nessun cliente
   è scelto nella tendina `dif-cli`, `pesateDaFatturare` (conti-data.js
   ~3257-3266, filtro `!clienteId || p.clienteId === clienteId`) non
   filtra nulla e mescola DDT di clienti diversi nell'anteprima
   (`fatturaDaPesate`, righe/imponibile/IVA/totale sommati tra ragioni
   sociali diverse). Il blocco vero c'è solo al momento dell'emissione
   (index.html ~7503-7509), ma l'anteprima prima di quel click mostra
   cifre fuorvianti. Fix minimo: mostrare la lista/i totali della fattura
   differita SOLO quando `dif-cli` è valorizzato, così il placeholder
   "scegli il cliente" (index.html ~4720-4722) torna raggiungibile
   davvero. Aggiungere un test/controprova che inietti il filtro non
   applicato e verifichi che la UI non calcoli totali misti. Poi il solito
   giro su worktree isolata, commit, checkpoint, push.
2. Verificare con grep indipendente la proposta Terra/falda prima di
   deciderne l'implementazione (cercare `quotaFondoM`, `fondoAutorizzato`,
   `conformitaQuota`, `TIPI_SCADENZA_TERRA` in `apps/terra/terra-data.js`
   e confermare che `presetScadenzaTerra("acque")` dia davvero `null`).
3. Rilanciare la rotazione di ricerca continua sul topic più vecchio
   (ricontrollare `git log -1 --format=%ci -- docs/RICERCA_CONTINUA_*.md`
   dopo il push di questo commit).
4. Mantenere ≥3 cantieri paralleli in background (direttiva 26/07).

## Blocchi
Nessuno.
