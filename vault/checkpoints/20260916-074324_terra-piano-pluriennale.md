# Checkpoint — 2026-09-16T07:43:24Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
0c6f5820

## Cosa completato
- Riverificato indipendentemente, riga per riga sul codice vero (grep,
  non sulla parola dell'agente), il tredicesimo giro di ricerca continua
  su Terra (`docs/RICERCA_CONTINUA_TERRA.md`, sequenziamento multi-anno):
  tutti e sei i grep dichiarati dalla ricerca sono risultati **veri** —
  `lotto.ordine` esiste da luglio ma non è mai usato in nessun controllo
  di sequenza (solo mostrato: "1° del progetto"); `pianificatoAnnuoM3` è
  un numero solo per tutta la vita del piano; `varianzaMensilePiano` è
  aggregata su tutti i lotti insieme; `avanzamentoLotto` non ha nozione
  di anno; `banchiDaSempre` non filtra per lotto.
- Chiuso il delta più pronto e a minor rischio dei sei proposti: il
  **confronto pianificato-vs-reale PER LOTTO PER ANNO**. Aggiunto campo
  opzionale e additivo `lotto.volumiAnnuali: [{anno, volumeM3}]` (stessa
  forma già scelta per le sezioni trasversali di `sezionePeggiore`).
  Due funzioni pure: `volumePianificatoLottoAnno(lotto, anno)` (null se
  non dichiarato, non zero) e `varianzaLottoAnno(lotto, anno, rilievi)`,
  che riusa `volumeMisuratoDiLotto` (il ponte già scritto fra lotto,
  fronti e rilievi) filtrando i rilievi sull'anno — non una sesta copia
  del ponte. Stessa forma di `varianzaMensilePiano`:
  `calcolabile`/`perche` quando manca il dato, `verso` col vocabolario
  già in uso (avanti/indietro/in pari), non un termine nuovo.
- **Prima fetta deliberata**: un solo lotto della dimostrazione (`lo4`)
  dichiara il piano per il 2026; gli altri cinque restano silenziosi —
  campo nuovo, nessun numero inventato. La riga del lotto nella pagina
  Titolo mostra la frase solo quando calcolabile. Il form per scrivere
  `volumiAnnuali` dagli altri lotti, la validazione di sequenza
  (Lotto N+1 aperto prima che N raggiunga una soglia) e il report
  tabellare per banco/anno restano i passi successivi — deliberatamente
  fuori da questa unità.
- Test in `run-kpi.mjs`: `volumePianificatoLottoAnno` (campo opzionale,
  valori corrotti scartati), `varianzaLottoAnno` (due assenze diverse —
  piano non dichiarato vs anno non misurato — stesso `motivo` di
  `volumeMisuratoDiLotto`, non riscritto; il filtro sull'anno non lascia
  entrare un rilievo dell'anno sbagliato; verso che si gira quando si
  scava più del pianificato), più la prova sulla dimostrazione (`lo4`
  indietro nel 2026, gli altri cinque non calcolabili).
- Banco browser nuovo `tests/browser/terra-piano-lotto-anno.mjs`: la
  riga del Lotto 4 nella pagina Titolo mostra ESATTAMENTE il verso e lo
  scarto calcolati dal modulo ("indietro di 19%"), le altre righe
  restano silenziose. 6/6 normale, controprova 1/1 (azzera il confronto
  nella riga: 2 KO attesi, gli altri restano verdi).
- Verifica: doppio giro isolato, con lo stesso "far west" atteso su
  `numeri-nei-documenti.mjs` al primo passaggio (doc-cascade vecchia) e
  il secondo verde: 40/40 comandi, 4035 asserzioni, confermate.
- Doc-cascade finale: run-kpi 3065→3068, somma nove suite
  3.559→3.562, copertura sei-app 1037/1037→1039/1039, giro completo
  4031→4035, banchi browser 303→305 esecuzioni / 131→132 file distinti.
- `copertura-funzioni.mjs`: FONDO terra 91→101 (di cui 8 erano arretrato
  di sessioni precedenti mai attribuito, dichiarato per nome nel
  commento; 2 di questa unità).
- Commit `0c6f5820`, pushato su `claude/scheduled-tasks-remote-control-bk4ap6`.

## Stato roadmap
Terra ha chiuso il primo (e più pronto) dei sei delta del tredicesimo
giro di ricerca continua. Restano aperti, in ordine di prontezza: la
validazione di sequenza (Lotto N+1 vs soglia su Lotto N), il report
tabellare banco×anno con stato progettuale, l'allerta su apertura fuori
programma — tutti richiedono decisioni di modello dati più grandi
(dipendenze fra lotti, storico per banco) e meritano ciascuno la propria
unità con scomposizione dedicata, non un'improvvisazione in coda.

## Prossimo passo atomico
1. Rotazione ricerca continua: Sentinella resta l'unica app senza un
   giro di ricerca in questa sessione — candidato per il prossimo
   lancio in background.
2. Il prossimo delta pronto di Terra (tredicesimo giro): la validazione
   di sequenza fra lotti (`dipendeDa: {lottoId, percentuale}` +
   `puoEssereApertoOra`) — scomporre PRIMA di scrivere codice, come
   fatto per le sezioni trasversali il 15/09, perché tocca il modello
   dati dei lotti più della semplice aggiunta additiva di oggi.
3. Non fermarsi qui per la regola del fondatore (esaurimento crediti):
   proseguire immediatamente con l'unità successiva.

## Blocchi
Nessuno.
