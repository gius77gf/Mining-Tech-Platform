# Checkpoint — 2026-11-26T08:29:07Z

## Tipo
unit-complete (fix + copertura con controprova) — sessione INTERATTIVA col
fondatore, la routine automatica resta FERMA per suo ordine.

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
0baef8a9 (test(genesi): copertura browser per il cursore di trasparenza dei raggi-X)

## Contesto
Nuovo capitolo aperto dal fondatore il 26/11: «reverse engineering per
migliorare Genesi», delimitato a (1) concorrenti da materiale pubblico e
(2) formati di scambio — niente decompilazione. Direttiva ribadita:
**solo Genesi**, le altre app da parte; usare /deep-research.

## Cosa è stato completato
Il lettore DXF di Genesi rimisurato contro 23 file scritti da `ezdxf`
(implementazione di riferimento), non da noi: **9 su 23 letti male in
silenzio** (blocchi comparsi attorno all'origine, cartiglio letto come
terreno, contorni chiusi arrivati aperti, mesh letta come polilinea,
specchiatura ignorata, binario dichiarato «senza linee»).

- `apps/genesi/genesi-data.js`: `dxfLeggi` (sostituisce `dxfInTratti`,
  tolta: nessun alias) + `dxfFraseNonLette`. Legge solo ENTITIES, salta lo
  spazio carta, chiude le polilinee chiuse, applica l'OCS, esclude le
  superfici a maglia, riconosce il binario, e DICHIARA ciò che lascia
  fuori. Le unità non si convertono da sole (ragione nel commento).
- `apps/genesi/genesi.html`: il gestore dell'import mostra il bilancio
  (`_dxfBilancioHtml`) e prepara il fattore di «Scala tratti».
- Nuovo: `apps/deepwork-id/tests/dxf-da-cad.mjs` (26/0, controprova 8/8)
  con i campioni in `tests/campioni/dxf-da-cad/` (+ `genera.py`),
  registrata in `package.json` (normale + controprova).
- `run-kpi.mjs`: due prove nuove (dxfLeggi, dxfFraseNonLette), nove
  chiamate portate dal vecchio nome al nuovo.
- `browser/genesi-dxf-import.mjs`: 11 → 22 asserzioni (quattro campioni
  veri passati dal bottone).
- ⚠️ Fuori da Genesi, una riga sola e solo di prova: la prova
  «Flotta · csvListaDellaSpesa» in `run-kpi.mjs` leggeva l'orologio vero
  ed era caduta da sola dal 20/11 (interventi della dimostrazione datati
  aprile–luglio, finestra 180 giorni). Fissato `oggi` a 2026-08-01. Nessun
  file di Flotta toccato. ⚠️ La dimostrazione di Flotta invecchia allo
  stesso modo anche a schermo: NON sistemato (fuori mandato), da dire al
  fondatore.

## Ricerca in corso (deep-research, note in research_notes/, non committate)
Cinque filoni: IREDES, tabelle fori + innesco elettronico, concorrenti
import/export, sismografi + sonde, catena dei formati. Il rapporto finale
va in reports/ e i fatti verificati in docs/RICERCA_CONTINUA_GENESI.md.

## Verifica prima del commit
- `node apps/deepwork-id/tests/dxf-da-cad.mjs`: 26/0; `--controprova`: 8/8.
- `node apps/deepwork-id/tests/run-kpi.mjs`: 3232/0.
- `node apps/deepwork-id/tests/browser/genesi-dxf-import.mjs`: 22/0.
- sintassi-pagine, copertura-funzioni, nomi-liberi, funzioni-mai-usate,
  iniezioni-fresche, suite-collegate, import-esistenti: verdi.
- `giro-node.mjs`, due lanci dopo questo file: **42 comandi su 43 a posto,
  4283 asserzioni**, e l'unico caduto tutt'e due le volte è
  `numeri-nei-documenti.mjs` (prima i conteggi da propagare, poi la riga
  d'indice della voce nuova in roadmap) — che da solo, a correzioni fatte,
  fa **43 passati, 0 falliti**. Il numero scritto nei documenti è quindi
  **4326 = 4283 misurati + 43 misurati**, cioè una SOMMA di due misure e
  non la lettura di un giro tutto verde: detto com'è. Un terzo giro di
  conferma parte dopo il commit; se dicesse altro, si corregge il
  documento con un commit a sé.

## Prossimi passi
- **Prossimo passo atomico**: raccogliere il rapporto di deep-research
  (`reports/Genesi formati di scambio cava.md`) e fare IL DELTA partendo
  dal meccanismo, non dal nome: «chi porta dentro una tabella di fori da un
  file esterno?» (oggi: nessuno — Genesi importa solo il proprio
  .volata.json e il proprio XML) e «chi scrive un piano di perforazione che
  un altro programma legge?» (oggi: il DXF sì; l'XML "stile IREDES" ha un
  namespace privato che nessun altro legge). I due candidati forti:
  import/export CSV dei fori con mappatura dichiarata delle colonne, ed
  export IREDES DRPPlan vero. Decisioni di prodotto → docs/DECISIONI_WEEKEND.md.
- Poi lo stesso metodo "file scritti da un altro" su parseLAS/parsePLY
  (laspy) e su dxfPianoFori (ezdxf).

## Blocchi
Nessuno.
