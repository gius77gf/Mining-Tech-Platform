# Checkpoint — 2026-09-17T16:47:06Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
5ad3c864

## Cosa è stato completato
**Tutti e 42 i KO veri** del giro completo del browser (letto con
`leggi-giro.mjs` nel ciclo precedente: 277 banchi a posto, 38 da guardare,
42 KO veri in ~13 famiglie) sono stati chiusi, verificando ogni volta se la
causa fosse un difetto di prodotto o una prova invecchiata da un
miglioramento reale — mai a naso, sempre leggendo il sorgente e misurando
l'uscita vera del banco prima di correggere.

**Difetti di prodotto veri (5)**, commit `908c1446`..`5ad3c864`:
- Conti: la fattura scaduta nel Quadro non portava la data assoluta.
- Genesi: la barra `#d2-tools` usciva dallo schermo a 390/360/320px; le
  modali «Obiettivo x50» scrivevano l'unità in maiuscolo.
- Scudo: la tendina `#vf-attrezzatura` tagliava a metà parola la voce
  scelta (placeholder e voci con matricola).
- Scudo: una riga di documento sostituito rispondeva al tocco (un toast)
  senza mostrare la manina.

**Prove scadute da miglioramenti reali (10 banchi), stesso commit**:
Conti (`appunti-dimostrazione.mjs`, tre livelli di sollecito dal 15/09;
`conti-registro-vendite.mjs`, colonna causale dal 15/09), core
(`core-volate-non-misurate.mjs`, un decimale fisso sui kg), Campo
(`campo-foglio-turno.mjs`, causale e minuti del fermo dal 15/09), Genesi
(il conto "vivo" dei selettori condivisi in
`docs/LA_STRUTTURA_DEL_CORE_SCRITTA_SEI_VOLTE.md`, aggiornato di riflesso),
`import-righe-perse.mjs` (numerazione fisica delle righe CSV dal 15/09,
più la SOGLIA della sua controprova che non teneva conto della prova
`extra` della telemetria), Sentinella (`sentinella-foglio-volata.mjs`, una
fixture di test completata per isolare davvero la sola mancanza che
voleva dimostrare, dopo che il "dopo-volata" dell'11/09 le aggiungeva sei
mancanze non volute), Scudo (`scudo-documenti.mjs`, la nota della denuncia
INAIL dal 16/09).

Ogni fix verificato con: lettura diretta del sorgente prima di toccare
qualunque regex/valore atteso, esecuzione reale del banco (mai dedotto),
controprova rilanciata dopo il fix per confermare che il banco sa ancora
fallire, giro node isolato su worktree pulito prima di ogni commit.

## Stato roadmap
Il giro completo del browser è ora, per quanto misurato, senza KO veri
residui rispetto alla lettura fatta con `leggi-giro.mjs`. Non è stato
rilanciato per intero (richiede ore): la prossima volta che gira darà la
prima misura pulita da fine luglio/agosto su questo fronte.

La "seconda iterazione" sui documenti `CONCORRENTI_*` stale prosegue in
parallelo (Campo chiuso nel blocco precedente; restano Conti, Flotta,
Scudo, Sentinella, Terra — tutti sicuri da fare mentre si lavora altrove).

## Prossimo passo atomico
1. Se emerge tempo libero prima di rilanciare il giro completo del
   browser (che costa ore e va lanciato quando non c'è altro lavoro di
   codice pendente), proseguire con la riverifica dei documenti
   `CONCORRENTI_*` rimasti stale (Conti: 64 commit/31 mordenti era la
   misura precedente — va rimisurata, è passato tempo).
2. Quando si deciderà di rilanciare il giro completo del browser: farlo
   SENZA lavorare in parallelo su moduli dati o pagine (la copia che il
   giro serve va congelata), e stavolta — con zero KO noti in partenza —
   ogni nuovo KO trovato sarà davvero nuovo, non un arretrato.
3. Continuare con la lista "SE LA ROADMAP SEMBRA FINITA" di CLAUDE.md:
   punto 1 (sovrapposizione nuova nella mappa ecosistema) o punto 2 (passata
   in profondità su un'app), se non emerge altro lavoro più urgente.

## Blocchi
Nessuno.
