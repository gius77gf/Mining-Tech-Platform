# Checkpoint — 2026-09-18T00:29:14Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
b3af4d10

## Cosa è stato completato
Chiusi i due difetti trovati dal terzo giro di deep-pass su Flotta
(agente aff43964bd31baec6): la "metà mancante" della correzione dei CSV
col punto inglese (csvRegistroInterventi, l'helper `R()` di csvLibretto,
csvRicambi, csvListaDellaSpesa, csvCosti — tutti ora con `mostra()`), e
`vitaComponenti` che ignorava il contatore sostituito (ora riusa
`contatoreDelTagliando`, come i tagliandi a ore). Due nuovi banchi con
controprova, ancore aggiornate in due banchi esistenti (l'anchor-scadere
già documentato in CLAUDE.md, preso stavolta prima del push grazie a
`iniezioni-fresche.mjs`). Giro isolato: 41/41, 4108 asserzioni, KPI
3120/3120.

In parallelo (background, entrambi completati):
- Ricerca continua su Scudo (agente acc9f17fadd844d08): dodicesimo giro,
  Accordo Stato-Regioni 2025 sulla formazione (FAD sincrona/asincrona).
  Nessun codice toccato.
- Terzo giro deep-pass su Terra (agente a82876ad086170520): **TRE
  difetti**, il primo un CRASH DURO. Lavoro iniziato in questa sessione
  (vedi sotto), NON ANCORA COMMITTATO.

## Lavoro Terra in corso (non committato)
1. **✅ FATTO** — `shared/dw-ponti.js`: sostituito `dataISOBuona` (solo
   forma, `/^\d{4}-\d{2}-\d{2}$/`) con `dataISOEsiste` (calendario vero)
   nei suoi 4 punti d'uso (`produzioneDichiarata`, `misuratoPeriodo`,
   `intervalliFraRilievi`, `produzionePerFronte`). Un rilievo con
   `data:"2026-13-45"` mandava `avanzamentoDaUltimoRilievo` in
   `RangeError: Invalid time value` (crash duro, pagina Rilievi bloccata
   sul segnaposto di caricamento). Due nuovi test in `run-kpi.mjs`,
   verificati contro il difetto rimesso (falliscono correttamente).
2. **✅ FATTO** — `apps/terra/terra-data.js`: `proiezioneAnnua` e
   `kpiFrom` passati da `rilievoUsabile` a `rilievoUsabileConData` (i due
   punti che affettano i rilievi per anno/mese — lo stesso caso per cui
   `rilievoUsabileConData` esiste, per allinearsi a `riepilogoAnnuale`
   della Denuncia, che già usava la guardia giusta). Due nuovi test,
   verificati contro il difetto rimesso.
3. **⚠️ VALUTATO E SCARTATO** — `estrattoComplessivo` (terzo punto
   segnalato dall'agente, usato da `vitaCava`): NON toccato. Un test
   esistente ("ritmoMedioAnnuo non fa partire il periodo da una data
   inventata") dichiara ESPLICITAMENTE come intenzionale che il volume
   di un rilievo con data storta continui a consumare il titolo
   ("quello che manca è il QUANDO", non il quanto) — applicare
   `rilievoUsabileConData` qui avrebbe rotto quella decisione già presa,
   verificata da test, non un difetto. Se va rivista è una scelta di
   prodotto, non un fix silenzioso: **non ho scritto nulla in
   DECISIONI_WEEKEND.md su questo, da fare se si vuole riaprire la
   domanda**.
4. **NON ANCORA FATTO** — punto 3 dell'agente: `frontiAmbigui`
   (`conformitaProgetto`, terra-data.js:3799-3893) calcolato dal modulo
   ma mai letto da `apps/terra/index.html` (`renderConformita`,
   `cardConformita`/`itemConformita`) — guardia scollegata, il commento
   del modulo descrive ESATTAMENTE lo scenario di rischio che dovrebbe
   evitare. Da collegare alla pagina.
5. **NON ANCORA VERIFICATO** — pista segnalata ma non confermata dal vivo
   dall'agente: `varianzaLottoAnno` (terra-data.js:3564-3577) filtra con
   `String(r.data).slice(0,4)` grezzo prima di `volumeMisuratoDiLotto`
   (che usa `rilievoUsabile`, non `...ConData`) — probabile quarta
   manifestazione della stessa famiglia, da controllare.
6. **NON ANCORA VERIFICATO DAL VIVO**: la mia verifica Playwright del
   fix crash (#1) non è ancora riuscita — un problema con un server di
   verifica su una porta condivisa da server orfani di sessioni
   precedenti (già ripulite). Da rifare prima di committare.

## Stato roadmap
Terzo giro di deep-pass: Sentinella ✅, Conti ✅, Scudo ✅, Genesi ✅,
Flotta ✅ (questo commit). Terra: in corso (fix #1 e #2 pronti da
verificare live e committare; #3 da fare; #5 da controllare).

## Prossimo passo atomico
1. **Verificare dal vivo il fix del crash** (punto 1 sopra) con
   Playwright: server d'iniezione su una porta libera VERIFICATA con
   contrassegno (non riusare una porta occupata da un processo
   orfano — controllare `ss -ltn` prima), iniettare il rilievo
   `{id:"rX", data:"2026-13-45", volumeM3:999999, stato:"elaborato",
   fronteId:"f1"}` in `apps/terra/terra-data.js`, navigare alla sezione
   Rilievi, confermare **zero errori di pagina** (prima: `RangeError:
   Invalid time value`) e che la sezione "Quello che dichiarano i
   turni" si carichi davvero (non resti bloccata sul segnaposto).
2. Scrivere un banco browser dedicato con controprova per il crash
   (reinserire `dataISOBuona` e verificare che il banco lo catturi).
3. Decidere e implementare il punto 4 (collegare `frontiAmbigui` alla
   pagina — mostrare un avviso quando un fronte è condiviso da più
   lotti, leggendo il campo che il modulo già calcola).
4. Verificare dal vivo il punto 5 (`varianzaLottoAnno`) prima di
   decidere se è un difetto vero.
5. Il solito ciclo: doc-bookkeeping (KPI sale di almeno 2 da questa
   sessione, verificare col giro), giro isolato completo, commit,
   checkpoint, push.
6. Mantenere ≥3 cantieri paralleli (attualmente sotto soglia: nessun
   agente in background al momento di questo checkpoint).

## Blocchi
Nessuno bloccante; il lavoro Terra è a metà ma non impedisce di
proseguire (nessun conflitto con altre unità).
