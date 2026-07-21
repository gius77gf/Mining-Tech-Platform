# Checkpoint — 2026-07-21T02:02:03Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(vault ecosistema: 98b8f55 — schede+indice; piattaforma: questo commit)

## Completato
RICERCA POTENZIALE SU TUTTE E 7 LE APP (richiesta esplicita del fondatore
del 21/07: qualità massima, più mole di lavoro, ricerca specifica per app
e sul potenziale di ognuna).
- 7 schede "Potenziale — <App>" create e pushate su ecosistema-vault/main
  (Genesi, Terra, Scudo, Flotta, Campo, Conti, Sentinella): competitor,
  standard/normative verificate, KPI con formule, raccomandazioni feature
  ordinate per impatto/fattibilità (S/M/L; "subito manuale" vs "hardware").
  Fonti reali citate; prezzi non pubblici = n.d.; soglie non confermate
  segnalate.
- Wiki indice aggiornato con sezione "Potenziale per app".
- vault/ROADMAP_VISIONE.md (piattaforma): sintesi trasversale — tesi del
  ciclo chiuso, potenziale per app, temi trasversali, backlog "come
  diventa lavoro".
- ROADMAP_SETTIMANA.md: nuova sezione con le prime 10 voci "subito/S"
  pronte + rimando alla Visione.

## Contesto tecnico
I 7 workflow deep-research della sera precedente erano FALLITI per limite
di sessione web (reset 1am UTC): nessun claim verificato. Rifatta la
ricerca dopo il reset con subagenti controllati (WebSearch; WebFetch
spesso 403 → dichiarato nel metodo di ogni scheda). Revisione serale:
suite pure verdi (helpers 22, kpi 57, demo 6); main sano.

## Stato roadmap
Fallback punto 2 (ricerca competitor → schede + sintesi) COMPLETATO in
modo esaustivo per tutte le app. Ora esiste un backlog ampio e concreto
di lavoro "subito" che risponde alla criticità sollevata dal fondatore
("il lavoro programmato è troppo poco").

## Prossimo passo atomico
Aprire PR della sessione verso main con: ROADMAP_VISIONE.md,
ROADMAP_SETTIMANA.md aggiornata, questo checkpoint. Dopo merge: RESTART
da origin/main, poi iniziare la prima voce "subito/S" del backlog
(suggerita: Sentinella — libreria soglie normative preimpostate, taglia
S, nessun dato sensibile del fondatore coinvolto). Continuare fino a
esaurimento crediti.

## Blocchi
Nessuno per il backlog "subito". Le voci di integrazione (SdI, pesa,
telematics, centraline, mitigazione password, dati default) restano
gated per il fondatore (vedi docs/DECISIONI_WEEKEND.md).
