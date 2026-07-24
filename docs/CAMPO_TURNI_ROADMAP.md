# Campo — operativo di campo vs competitor: confronto onesto e roadmap (24/07)

Nota di ricerca (zero modifiche al codice): dove sta Campo rispetto ai software di
gestione turni / short-interval-control minerari. Modifiche dati gated sul fondatore.

## Cosa fa Campo OGGI (dal codice)
- **Attività di giornata** con stati al tocco (pianificata→in corso→conclusa→
  anomalia con causale), ricerca/conteggio/modifica/export CSV.
- **Squadre** (CRUD, stato operativa/ferma), **rapportini di turno** bozza→inviato
  con **consegne al turno dopo (handover)** e **copertura** (chi ha consegnato e
  chi manca) — l'handover digitale che i leader vendono come feature chiave c'è già.
- **Fermi raggruppati per causale**, avanzamento giornata, **export consegna turno**.
- **Ponte Genesi**: piano di carico → registro carica reale foro per foro.

## Cosa fanno i leader (GroundHog SIC, ABB OMS, Datamine Production, Oxmaint)
1. **Report di fine turno con KPI** consegnato al supervisore (attività fatte/
   mancate, fermi, produzione) — il deliverable ricorrente.
2. **Durata dei fermi** (non solo causale): tempo perso per categoria → i fermi
   diventano ore e costi, non solo etichette.
3. **Short Interval Control vero**: monitoraggio a intervalli di ~15 min con
   flag di deviazione dal target IN turno — richiede dati in tempo reale da mezzi
   e impianti: **fuori portata onesta** per un'app browser a inserimento manuale
   (dichiararlo, non fingerlo).
4. Notifiche al telefono di tutta la squadra (noi: PWA installabile già pronta;
   le push restano gated sul progetto Firebase).

## Passi FATTIBILI (ordinati per impatto/riuso)
1. **Rapporto di fine turno stampabile** (impatto ALTO, riuso ALTO, NON tocca i
   dati): come il report di Genesi — attività fatte/totali, fermi per causale,
   produzione dai rapportini, consegne. Trasforma dati già presenti nel
   deliverable che i supervisori si aspettano.
2. **Durata dei fermi** (impatto alto, *tocca i dati*): ora/da-quando su un'anomalia
   → "ore perse per causale" nel riepilogo e nel report. *(→ fondatore.)*
3. **Target di turno semplice** (impatto medio, *tocca i dati*): obiettivo
   produzione per turno → scostamento nel report (SIC "alla nostra portata",
   senza tempo reale). *(→ fondatore.)*

## Prossimo passo (quando il fondatore sceglie)
Consigliato il **punto 1** (report fine turno): valore immediato, zero rischio,
zero modifiche ai dati — attuabile anche come prossima unità autonoma.

## Fonti
- [GroundHog Short Interval Control](https://groundhogapps.com/groundhog-short-interval-control/)
- [ABB — Digitalization of SIC in mining](https://new.abb.com/mining/digital-applications/operations-management-system-oms-for-mining/digitalization-of-short-interval-control-(sic)-and-production-scheduling-in-mining)
- [Datamine — Production accounting](https://dataminesoftware.com/solutions/production/)
- [Oxmaint — Shift logbook/handover](https://oxmaint.com/blog/post/shift-logbook-software-digital-handover-operations)
