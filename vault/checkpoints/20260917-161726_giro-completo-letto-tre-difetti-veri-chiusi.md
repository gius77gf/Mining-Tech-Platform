# Checkpoint — 2026-09-17T16:17:26Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
13037106

## Cosa è stato completato
Il giro completo del browser (`tests/browser/tutti.mjs`, rilanciato nel
blocco precedente) è **arrivato in fondo** dopo un riavvio del contenitore
che l'ha ucciso a metà — diagnosticato con `leggi-giro.mjs`, non a occhio.
Risultato: 277 banchi a posto, 38 da guardare, **42 KO veri**, ~10 famiglie
di difetti distinte. Chiusi finora tre difetti reali, ciascuno con verifica
diretta, controprova (difetto rimesso e ritolto), giro node isolato su
worktree, e aggiornamento della documentazione che il difetto invalidava:

1. **Conti** (commit `908c1446`): la riga di priorità nel Quadro diceva
   «scaduta da 71 giorni» senza la data assoluta — unico punto del prodotto
   a non seguire la regola «un tempo relativo porta con sé la data»
   (`doppia-data.mjs`). Aggiunta la data fra parentesi.
2. **Genesi** (commit `13037106`): la barra `#d2-tools` (Fori/Fronte/Piede/
   Tratto, annulla/ripeti, reset) usciva dallo schermo a 390/360/320px
   (`fuori-schermo.mjs`); le due modali «Obiettivo x50» scrivevano l'unità
   in `<span class="u">` invece di `<u class="uni">`, finendo in maiuscolo
   (`modali-dentro.mjs`). Di riflesso, aggiornato in
   `docs/LA_STRUTTURA_DEL_CORE_SCRITTA_SEI_VOLTE.md` il conto "vivo" del
   contagio selettori (24 → 23: l'ultima `class="u"` di Genesi è sparita).

## Stato roadmap
In corso: chiudere le restanti famiglie di KO dal giro completo. Prossime,
già investigate ma non ancora committate:
- **Scudo**: la tendina `#vf-attrezzatura` (Verifica periodica) tagliava a
  metà parola la voce SELEZIONATA — sia il placeholder «— nessuna
  attrezzatura collegata —» sia le voci con matricola. Fix pronto e
  verificato a mano (`modali-dentro.mjs`, `tendine-nelle-finestre.mjs`
  entrambi puliti; controprova conferma): `voceAttrezzaturaInElenco` non
  scrive più la matricola (resta nel form-hint sotto, già sempre popolato)
  e usa il modello da solo quando c'è (più specifico del tipo); placeholder
  accorciato a «— nessuna —». Aggiornato anche il test in `run-kpi.mjs`.
  **Manca**: isolare in worktree e lanciare il giro node prima di committare.
- **Conti**: `appunti-dimostrazione.mjs` aveva una regex scaduta
  (`/Oggetto: sollecito di pagamento/`) — dal 15/09 la lettera ha tre
  livelli di escalation (`livelloSollecito`) con oggetti diversi, e la
  dimostrazione capita su un livello "ultimo avviso". Fix pronto e
  verificato a mano su tutti e tre i modi (normale/`--live`/`--controprova`,
  tutti puliti). **Manca**: worktree + giro node (anche se questo fix non
  tocca `run-kpi.mjs`, va comunque isolato per disciplina).

Ancora da investigare (KO letti dal registro del giro, non ancora aperti):
- Campo: il foglio di fine turno ordina fermo/dettaglio/«nessuno in carico»
  in un modo che il banco giudica sbagliato (2 KO, stessa causa).
- Genesi: 4 KO di "riga import CSV non fa entrare — dice DI CHI si parla
  (riga 2/3)" — messaggi di errore import senza identificare la riga.
- Scudo: un infortunio chiuso nel CSV porta i giorni ma nessuna nota (2 KO).
- Scudo: «la manina promette un tocco che c'è» — 1 caso "fa e non lo dice".
- Core: "il core e le volate mai misurate" — 3 KO su `volRiga`/`misureVolataProgetto`.
  **INVESTIGATO IN PARTE**: sospetto sia una prova scaduta (regex `/24 kg/`
  non prevede il formato con un decimale fisso `perLettura(v,1,true)` →
  "24,0 kg"), non un difetto di prodotto — `volRiga` in `index.html:636`
  risulta già correttamente cablato su `misureVolataProgetto`. Da
  confermare misurando l'output vero del banco prima di toccare la regex.
- Sentinella: scheda della singola volata, "che cosa manca" elenca una
  voce sola (2 KO).
- Conti: registro vendite CSV per il commercialista, aliquota/imposta
  vuote dove non dovrebbero esserlo (4 righe di KO, 2 casi).

## Prossimo passo atomico
1. Isolare in worktree i fix Scudo (`apps/scudo/index.html`,
   `apps/scudo/scudo-data.js`, `apps/deepwork-id/tests/run-kpi.mjs`) e Conti
   (`apps/deepwork-id/tests/browser/appunti-dimostrazione.mjs`), lanciare
   `giro-node.mjs`, e se pulito committarli (separatamente o insieme, dato
   che toccano file diversi e sono indipendenti).
2. Misurare con `core-volate-non-misurate.mjs` l'output vero di `volRiga`
   sul caso "tutto misurato" prima di decidere se il difetto è nella prova
   o nel prodotto.
3. Proseguire con le famiglie non ancora investigate, nello stesso ordine
   del registro del giro, con lo stesso rigore (lettura diretta della
   causa, non fix a naso).
4. Il giro completo del browser NON va rilanciato finché non sono chiuse
   tutte le famiglie misurate in questo registro — rilanciarlo ora
   sprecherebbe ore per ririsentire difetti già noti.

## Blocchi
Nessuno.
