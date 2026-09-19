# Checkpoint — 2026-09-18T08:11:52Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
0eddb5c8 — fix(scudo): un DPI mai consegnato entra nel fascicolo per l'ispettore

## Cosa è stato completato
Dal quinto giro di deep-pass su Scudo (agente aaab8ded50f563b28):
`cartellaLavoratore` (il fascicolo personale stampato per l'ispettore)
non segnalava un DPI previsto dalla mansione ma mai consegnato —
guardava solo il caso "zero DPI consegnati in totale" (`vuoti`). Il
Quadro (`allarmiDpi`) e il "Fascicolo per l'ispettore" aziendale
(`fascicoloIspezione`) già incrociano `mansione.dpi` con le consegne
reali; solo la cartella individuale no, e la stampa usciva con "tutte
le sezioni contengono dati registrati" mentre un DPI obbligatorio
mancava (caso verificato dal vivo dall'agente: Luca Bianchi/d2,
mansione "Escavatorista/palista" richiede otoprotettori mai
consegnati).

Aggiunto lo stesso incrocio già usato da `allarmiDpi`
(`ultimaConsegnaDpi`/`statoConsegnaDpi`, stato "mancante"), con dedup
per tipo se due mansioni chiedono lo stesso dispositivo. Entra in
`daSistemare`, non in `vuoti` — una consegna vera c'è comunque
(l'elmetto, nel caso di test), e la distinzione "completa" vs "in
regola" è quella già documentata nel modulo.

## Verifica
- Nuovo test in `run-kpi.mjs`: fixture sintetica (mansione con due
  tipi di DPI, uno consegnato uno no) più un caso di dedup (due
  mansioni che chiedono lo stesso tipo mancante → si conta una volta
  sola). KPI: 3136 → **3137**.
- Verificato anche contro dati demo REALI (non solo la fixture
  sintetica): `node --input-type=module` diretto su `scudo.DEMO`
  conferma che d4 (2 DPI mancanti secondo `allarmiDpi`: gilet, scarpe)
  ora mostra "2 DPI previsti dalla mansione e mai consegnati" nella
  sua `cartellaLavoratore` — coerenza fra Quadro e fascicolo
  confermata su un caso vero, non solo inventato.
- Giro completo su worktree isolata: **41 comandi a posto, 0 caduti**.
  Asserzioni: **4131** (documenti corretti da 4130). 9-suite sum:
  **3.631**. Banchi invariati (345, nessun nuovo banco browser per
  questa unità — coperta da pure-function test + verifica dal vivo
  dell'agente originale, entrambe considerate sufficienti). Nessun
  test browser dedicato aggiunto per limiti di tempo.
  `numeri-nei-documenti.mjs`: 43 passati, 0 falliti, confermato PRIMA
  del commit.

## Stato roadmap
Vedi vault/ROADMAP_SETTIMANA.md. Unità Scudo chiusa. **Quarta ondata
(core + Scudo) completa.**

## Nuovo report arrivato, da chiudere
**Genesi, terzo giro di deep-pass** (agente a9e03772971dd3763):
stessa identica famiglia del secondo giro appena chiuso (dir/costi non
persistenti su Salva/Apri) — due ALTRI campi della stessa card
"Geometria volata", `D2.errColl` (errore al colletto) e `D2.dev`
(deviazione), non vengono scritti da `volSnapshot()` (genesi.html,
elenco esplicito righe 5206-5215 — sono gli UNICI due assenti su 34
campi censiti fra form/applyDesign/syncDesignInputs/guardie) e "Apri"
non ha nessun fallback per loro. Impatto reale verificato dal vivo:
questi due campi alimentano `simulaPerforazione()` → la riga
"Precisione di perforazione" della scheda validatori (rischio
proiezioni, badge colorato); aprendo un secondo progetto senza reload,
il pannello mostra il rischio calcolato con i valori del progetto
PRECEDENTE. Riprodotto con `window.__genesi.D2` iniettato: progetto A
con errColl=0.9/dev=14, poi Apri progetto B (senza quei campi salvati,
cioè lo stato NORMALE di ogni volata salvata oggi, dato che
`volSnapshot` non li ha mai scritti) → B mostra ancora 0.9/14, non i
default di fabbrica 0.15/2.5. Il campo del form conferma il leak
(visibile a schermo, non solo interno). Fix raccomandato dall'agente
(stesso pattern esatto del fix dir/costi, non applicato — sola
verifica): (1) aggiungere `errColl:D2.errColl,dev:D2.dev` a
`volSnapshot`; (2) aggiungere il fallback in "Apri"
(`D2.errColl=...isFinite...?+_dsg.errColl:0.15`, idem `dev:2.5`);
(3) nuovo banco sul modello di
`genesi-dir-costi-non-persistono-su-apri.mjs`, controprova nei due
versi, registrato in `tutti.mjs`.

## Terzo nuovo report arrivato — PRIORITÀ ALTA (tocca il fix di Campo
## fatto oggi stesso in questa sessione)
**Ponti condivisi, shared/dw-ponti.js** (agente ae364dae722db1d02):
`idoneitaDiTurno` (righe 862-888) sa che `idoneitaOperatore`/
`statoPeggioreScadenze` restituiscono 8 stati, incluso `"senza data"`
(una scadenza HSE con data illeggibile), ma l'oggetto aggregato che
espone NON ha un contatore per quello stato — solo `scadute,
inScadenza, regolari, senzaScadenze, senzaCollegamento,
collegamentiRotti, nonCollegati, nonIdonei, conPrescrizioni`. Verificato
con `node` diretto (funzione pura): una scadenza con `dataScadenza:
"2026-13-45"` produce `tuttoInRegola: false` ma TUTTI i contatori
nominati a zero.

La lacuna si propaga in **5 punti di Campo**, tutti senza copertura per
"senza data": (1) `CLASSE_HSE` (index.html:2512) — riga verde,
indistinguibile da "regolare"; (2) `notaScadenzeHSE` (2454) — didascalia
vuota; (3) il widget Quadro (2101-2130) — nota nascosta; (4) il
riepilogo Personale (2572-2593) — **scrive testualmente "Documenti in
corso di validità per tutte le persone in elenco, secondo Scudo"**,
un'affermazione falsa; (5) **`rapportoGiornata`/`testoConsegnaTurno` in
campo-data.js — CORRETTI OGGI STESSO in questa sessione (commit
136adec5) per aggiungere le clausole scadute/inScadenza, col commento
che dichiara "uno degli 8 stati" ma il fix copriva solo 4 rami**: "senza
data" resta scoperto anche nel documento stampato e firmato per
l'ispettore, appena corretto per un problema adiacente.

Controprova che è un difetto e non una scelta: `apps/scudo/index.html`
ha la mappa gemella `B` (badge locale) già completa su tutti e 4 gli
stati, con un commento che racconta la stessa correzione fatta il
03/08 (regola 18) — il lato Scudo del ponte tratta "senza data"
correttamente, solo il lato Campo (via `idoneitaDiTurno`) no. La causa
è nell'aggregato condiviso, non nelle singole app.

Fix raccomandato dall'agente (non applicato — sola verifica): aggiungere
`senzaData: conta("senza data")` all'oggetto restituito da
`idoneitaDiTurno`, poi far leggere quel contatore a tutti e 5 i punti
di Campo elencati sopra.

Osservazione minore (non un difetto attivo, solo un rischio
strutturale): `scadenzeDiChiLavora` (ponte P3 lato Scudo) è importata
e ri-esportata ma mai chiamata — Scudo reimplementa la stessa domanda
a mano in index.html:2789-2813. Comportamento oggi identico, ma è la
famiglia "copia debole" — se il ponte cambierà, questa pagina non lo
erediterà. Non richiede azione immediata, solo tenerlo a mente.

## Prossimo passo atomico
1. **PRIORITÀ**: implementare il fix del ponte `idoneitaDiTurno`
   (senzaData) e propagarlo ai 5 punti di Campo — soprattutto ai due
   documenti stampati appena corretti oggi, che sono il caso più
   grave (un ispettore che legge un rapporto firmato con
   un'affermazione falsa). Worktree isolata, test in run-kpi.mjs che
   copre sia il ponte sia (idealmente) tutti e 5 i punti di Campo,
   giro completo, doc delta, commit, push, checkpoint.
2. Poi implementare il fix di **Genesi** (`errColl`/`dev`): applicare
   esattamente il pattern raccomandato (identico a quello già usato
   per dir/costi nel commit c4d85939), nuovo banco Playwright dedicato
   con controprova, registrarlo in `tutti.mjs`. Worktree isolata,
   giro completo, doc delta preciso, commit, push, checkpoint.
3. Continuare "mai fermarsi": mantenere ≥3 cantieri paralleli aprendone
   di nuovi man mano che si chiudono (candidati: ricerca continua sul
   mestiere per Sentinella/Terra/Conti, un settimo giro su Conti o un
   sesto su Scudo su angoli ancora diversi, una seconda passata sui
   ponti condivisi se il primo giro trova poco).

## Blocchi
Nessuno.
