# Checkpoint — 2026-09-15T10:35:18Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
35667da6 (pushato)

## Cosa è stato completato

Terzo e ultimo fix "economico" del quinto giro di ricerca (Scudo). Il
modello del lavoratore aveva solo `attivo: true|false` (in forza sì/no):
non c'era modo di modellare una sospensione disciplinare o cautelare
temporanea (es. 48 ore dopo un infortunio), che nel mondo EHS è sempre
una domanda distinta dall'essere in forza.

**La correzione**: aggiunto `sospesoFinoa: ISO|null` al lavoratore.
`abilitazioneLavoratore` (`scudo-data.js`) blocca (esito `"no"`) se quella
data è oggi o nel futuro, letta con `dataISOEsiste` — una data illeggibile
non sospende né libera nessuno per sbaglio. Il campo `attivo` resta
intoccato: sospeso e non-in-forza sono due bloccanti indipendenti. Nella
pagina, un badge accanto all'idoneità (stesso pattern del giudizio
medico: `chiediDati`, mai un `prompt()`), con un'azione per sospendere o
togliere la sospensione.

**Verifica**:
- Nuovo test in `run-kpi.mjs`, sei casi: sospeso fino a domani blocca;
  l'ultimo giorno della sospensione blocca ancora (non si libera
  all'alba); sospensione scaduta ieri libera da sola; nessuna sospensione
  non inventa un bloccante; data illeggibile non sospende nessuno; sospeso
  resta `attivo: true`.
- Controprova: tolto il controllo bloccante dal sorgente, il test è
  caduto esattamente sull'asserzione attesa; ripristinato, verde di nuovo.
- Smoke check ad-hoc con Playwright (non nella suite committata): 7
  badge/azioni di sospensione renderizzate correttamente sulla schermata
  Personale della demo, click senza errori di pagina. **Non** aggiunto un
  banco browser permanente per questa unità — il pattern UI è un mirror
  quasi esatto di quello già coperto per il giudizio di idoneità
  (`scudo-giudizio-medico.mjs`), e la parte che decide (la logica in
  `abilitazioneLavoratore`) è già esaustivamente provata in `node`.
- Giro isolato su worktree separata, scoped esattamente ai 7 file di
  questa unità: **40 comandi a posto, 0 caduti**.

## Stato roadmap

Quinto giro di ricerca **chiuso** per la parte "economica": tutte e tre
le lacune confermate ed economiche trasformate in fix (Campo — la più
seria, consegna archiviata; Terra — margine in giorni; Scudo —
sospensione temporanea). Restano dichiarate ma non affrontate le due
lacune più costose di Terra (varianza mensile piano-vs-reale, ~3-4 ore;
finestra corta-vs-lunga per l'accelerazione del ritmo, ~4-6 ore) — non
urgenti, candidati per un blocco dedicato quando servirà maggiore
profondità su Terra.

## Prossimo passo atomico

Per la regola "il lavoro non finisce mai da solo": lanciare un sesto giro
di ricerca mirata in background su un'area non coperta finora in
profondità in questa sessione — Flotta, Sentinella, Conti o Deepwork ID,
un secondo passaggio più approfondito — seguendo il mandato corretto
della routine (`docs/MAPPA_ECOSISTEMA.md` §6 come fonte di stato vivo).
**Due lezioni di processo da applicare stavolta**, pagate due volte in
questo blocco: (1) lanciare ogni agente con `isolation: "worktree"`
quando più agenti scrivono in background nella stessa sessione, per
evitare la collisione che ha fatto perdere il lavoro dell'agente Campo;
(2) controllare PRIMA la convenzione di maiuscole/minuscole del nome file
di destinazione (`docs/RICERCA_CONTINUA_<APP>.md` è quasi sempre già
maiuscolo), per non ricreare l'incidente "sei documenti doppi" già
chiuso il 05/09. In alternativa o in parallelo: le due lacune costose di
Terra rimaste aperte, o una seconda iterazione di qualità/estetica su
un'app già toccata. Nessuno stop volontario: si prosegue subito.
