# Flotta — manutenzione mezzi: confronto onesto e roadmap (ricerca in tempi morti)

Nota di ricerca (fallback dei cicli automatici, zero modifiche al codice): dove sta
Flotta rispetto ai software di gestione flotta/manutenzione minerari, e quali passi
sono **fattibili nel browser** senza spese e nel rispetto del multi-tenant. Le
modifiche al modello dati restano gated sul fondatore.

## Cosa fa Flotta OGGI (dal codice)
- **Telemetria ore motore** (import CSV `parseTelemetriaCsv`) e anagrafica **mezzi**.
- **Manutenzione predittiva doppia**: per **data** (`urgenza`) e per **ore motore**
  (`urgenzaOre`) + `previsioneGiorni` (quando scatterà, dato l'uso al giorno).
- **Ricambi/magazzino**: `scaricoGiacenza`, `sottoScorta` (sotto scorta minima).
- **Disponibilità flotta** (`disponibilitaFlotta`) e **priorità operative**
  (`prioritaOperative`: incrocia mezzi, manutenzioni, ricambi).
- **Costi**: `ripartizioneCosti`, `kpiFrom`. Ordinamento mezzi (stato/ore/nome).
Base matura: manutenzione a scadenza+ore, scorte, priorità, costi — org-isolata.

## Cosa fanno i leader (ricerca — es. software fleet MSHA/minerari)
- **Controllo pre-turno / workplace exam**: checklist giornaliera dell'operatore
  (giro macchina) prima dell'uso — requisito tipico di compliance (MSHA).
- **Ordini di lavoro** (work order): manutenzione con **ricambi consumati + ore
  manodopera**, storico per mezzo.
- **Consumo carburante per mezzo** e per ora motore (efficienza, anomalie).
- **Scadenze di legge del mezzo** (revisioni/collaudi/certificazioni) come per le
  persone in Scudo.
- Telematica in tempo reale (GPS/centralina) — Flotta importa CSV, niente live
  (coerente con "nessuna spesa"; il live è fase commercializzazione).

## Divario e passi FATTIBILI nel browser (ordinati per impatto/riuso)
1. **Ordine di lavoro** (impatto ALTO, riuso ALTO): legare una manutenzione ai
   **ricambi consumati** (già c'è `scaricoGiacenza`) + ore → il magazzino si
   aggiorna dall'evento di manutenzione, e ogni mezzo ha lo storico costi ricambi.
   Unisce pezzi che Flotta ha già separati. *(modello dati → fondatore.)*
2. **Consumo carburante per mezzo** (impatto medio): €/ora e litri/ora per mezzo,
   con evidenza di chi consuma più del previsto (spesso sintomo di guasto). ATTENZIONE
   onestà: oggi `costi` tiene il carburante **aggregato** (voce+importo), non per
   mezzo — quindi serve attribuirlo al mezzo (campo nel CSV telemetria o nei costi).
   Non è "gratis": le ore motore ci sono già, ma il carburante per mezzo è un dato
   nuovo. *(modello dati/CSV → fondatore.)*
3. **Controllo pre-turno** (impatto medio): checklist rapida dell'operatore; le voci
   "non ok" generano una priorità/manutenzione (stesso schema dell'ispezione Scudo).
   *(modello dati → fondatore.)*
4. **Scadenze di legge del mezzo** (impatto medio): revisioni/collaudi come scadenze
   (riusa lo schema di `urgenza`), per non trovarsi un mezzo non a norma.

## Limiti onesti
- Flotta **pianifica e avvisa**; non sostituisce il libretto/registro ufficiale del
  mezzo né la telematica del costruttore. La manutenzione predittiva è basata su
  ore/date dichiarate, non su diagnostica di centralina.
- Ogni passo con nuovi campi tocca il modello dati multi-tenant → via `orgCollection`
  e solo col via libera del fondatore.

## Prossimo passo (quando il fondatore sceglie)
Consigliato il **punto 1 (ordine di lavoro)**: massimo valore e riuso (unisce
`scaricoGiacenza` + manutenzioni che Flotta ha già). Il punto 2 (carburante per
mezzo) è utile ma richiede prima il dato carburante attribuito al mezzo. Da
confermare con lui quale attivare.

## Fonti
- [Fleet Rabbit — MSHA compliance software per flotte minerarie](https://fleetrabbit.com/industry/mining-fleet-software/best-msha-compliance-software-surface-underground-mining-2026)
- [Farmonaut — Mining safety/fleet management](https://farmonaut.com/mining/mining-safety-management-software-7-ways-for-safer-mining)
- [Taro — Quarrying (gestione mezzi/attività)](https://taro.solutions/taro-quarrying/)
