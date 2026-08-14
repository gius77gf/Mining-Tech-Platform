# Checkpoint — 2026-08-14 07:25 UTC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit di questo tratto
- `c53b8537` — ricerca: il canone di escavazione, e i quattro righelli che
  rispondevano zero da soli
- `5b6e7c2e` — nomi liberi: le suite non le guardava nessuno
- `40ea1fc3` — CLAUDE.md: il controllo che esclude i propri test
- `fad37f94` — roadmap: tre voci proponevano un lavoro già fatto
- `e3c271d6` — Conti: lo zero sui soldi dovuti all'ente
- `74e3377e` — Sentinella: la conferma di una volata inventava tre numeri

## ⛔ IL RISULTATO PIÙ GRANDE: IL GIRO DEL BROWSER È ARRIVATO IN FONDO

Per la prima volta da giorni. **21 passate in 47 minuti, 0 KO veri**, su Flotta,
Genesi, l'import, i CSV e le pagine vive. Le due passate cadute sono
**controprove** — il loro rosso è quello voluto.
È B10, chiusa due ore prima: il giro intero è 198 passate = **13,5 ore**, cioè
più di una sessione, e due notti di fila era stato spento a metà con i primi KO
che erano difetti **chiusi cinque ore prima**. Adesso un ciclo verifica **le
superfici che ha toccato**, e il registro si apre con la riga che dice quante
passate ha lasciato fuori.

## Che cosa è stato completato

**Il ripiego silenzioso, censito in cinque app.** Un ingresso che l'utente non ha
scritto, sostituito da una costante di mestiere, e il numero che ne esce si
presenta come misurato.
- **Flotta**: 1 pezzo per ogni intervento vecchio — **6 contro 18** sullo stesso
  consumo, nel verso che dice «non devi ordinare niente»;
- **Conti**: `dovuto: 0` con la tariffa mai impostata — uno zero su soldi dovuti
  a un ente — **e il fratello vivo**: `€ 0,00` di totale mentre tutte le righe
  sotto dicevano «—»;
- **Sentinella**: la conferma di una volata scriveva **`0 / 0 / 0`** dove nessuno
  aveva dichiarato niente (nel CSV per l'ente: «il ricettore è a **zero
  metri**»), e `statoMisura` diceva **«Conforme» con ratio 0** su una lettura di
  9 contro una soglia di 5. Rimisurati da me prima e dopo, alla cifra;
- **Scudo**: **zero difetti**, col denominatore.

**E tre difetti dei controlli, tutti trovati dal loro stesso rosso:**
1. `nomi-liberi` **escludeva le suite per costruzione**, quindi il suo «0 fuori
   scope» non poteva vedere il nome libero vissuto in `run-kpi.mjs` quella
   notte. Costo della stretta misurato prima di farla: **0 allarmi** sulle due
   domande che contano, 45 sulle altre tre (globali di Node e codice-stringa).
   I banchi del browser restano fuori **col numero**: il loro codice gira in un
   **terzo ambiente**, dentro `page.evaluate()`;
2. `sonda-vuoto` **aveva trovato** il difetto di Sentinella e l'aveva perso: lo
   scusava citando il commento che giustificava il ripiego. Quella ragione non
   era il motivo per cui il caso era innocuo, **era il meccanismo del difetto**;
3. una prova di Conti **benediceva lo zero**: si chiamava «non inventa un
   dovuto» e pretendeva `dovuto === 0`.

## ⛔ Le due cose da ricordare
1. **Una riga di roadmap non spuntata manda a rifare il lavoro.** B0-decies era
   chiusa dal 10/08 e un cantiere ci ha speso due ore. Censite tutte e 22 le
   voci: sbagliate **nei due versi** (tre superate ancora `- [ ]`, una chiusa
   ancora nell'indice). Adesso il conto è un **controllo** con la sua
   controprova: 19 voci aperte, 19 righe d'indice.
2. **Ho corretto quattro righelli falsi con un righello falso.** Nella sezione
   che smontava i `grep` di una ricerca ho scritto «8 occorrenze» dove sono
   **90**: avevo riportato il numero di un comando più stretto lanciato un
   minuto prima. L'ha preso il **rilancio**, non la rilettura.

## Le misure
`run-kpi` 2238 → **2270**, prove **2.694 → 2.726**, giro `node` **35 comandi a
posto, 0 caduti**, **3.096** asserzioni, copertura app **753/753**, condivisi
**180/180**. Ogni unità verificata sulla **copia di quello che si committa**, con
l'indice costruito da HEAD più il solo blocco di ciascuna: dentro `run-kpi.mjs`
scrivevano fino a **tre cantieri insieme**.

## Che cos'è vivo
- **Il secondo giro mirato** dalle 07:22 su `74e3377e`: 36 passate (Conti,
  Sentinella, Scudo, pagine vive), stima ~80 minuti. Registro in
  `…/scratchpad/giro-mirato-2/registro.txt`.
- **Tre cantieri**: `accorciaVoceTendina` in `shared/` (la regola del `shared/`
  lasciata scritta dal cantiere di Sentinella), il ripiego silenzioso su **Campo
  e Terra**, e una **ricerca** sul rapporto di fine turno.

## Prossimo passo atomico
Raccogliere i tre cantieri uno per volta — indice da HEAD più il solo blocco di
ciascuno, verifica sulla copia — e **leggere il secondo giro mirato** con
`browser/leggi-giro.mjs` quando finisce, riverificando ogni KO prima di aprirci
un cantiere. Poi **B6** (la finestra di caricamento: «sto caricando» non è «non
c'è»), che vuole il browser e quindi va fatta **quando il giro è finito**, non
mentre gira.

## Blocchi
- **Force-with-lease sul ramo**: fermo al fondatore; CI verde con l'eccezione
  dichiarata e sorvegliata.
- **B0-septies**, le **soglie di sicurezza** e **`dRecFreq` intero all'ingresso**
  (porterebbe la soglia DIN da 5 a 15 mm/s, cioè più permissiva su un numero che
  decide se si può sparare): fermi al fondatore.
