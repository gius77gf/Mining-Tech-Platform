# Checkpoint — 2026-07-23T02:15:00Z

## Tipo
unit-complete (Genesi drone — piano/metodo del passo 3, NON codice speculativo)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — vault/PASSO3_FRONTE_METODO.md)

## Completato
Dopo aver reso il visore capace di leggere il LAS (formato nativo ODM) e allineato
la guida del weekend, ho messo per iscritto il **metodo del passo 3** senza scriverne
ancora il codice (ho promesso al fondatore di costruirlo sulla forma REALE del suo
fronte, non a indovinare). Il documento è il piano data-indipendente:
- Input = `.xyz` del fronte già ritagliato dal POC.
- Metodo: PCA per l'orientamento della faccia → proiezione sul piano verticale →
  envelope a bin (percentile, robusto al rumore) → profilo cresta→piede → altezza
  reale e **burden per foro** = distanza orizzontale foro→profilo.
- Aggancio alla scheda 2D di Genesi (D2), riusando `pointcloud.js` per la lettura;
  il passo 3 aggiunge solo la parte geometrica, anch'essa pura e testabile.
- Limiti onesti (scala approssimata da drone consumer, rumore, resta una stima) +
  riepilogo in parole semplici per Giuseppe.
Motivo di NON scrivere il codice ora: le soglie/tolleranze si tarano sul dato vero;
costruirle a vuoto rischierebbe i "numeri fuorvianti" che il fondatore ha criticato.

## Verifica
Solo documento (nessun codice): niente da testare. Coerente con `pointcloud.js`
(già in CI) come mattone di lettura riusabile.

## Prossimo passo atomico
Quando il fondatore porta la nuvola del weekend: implementare `fronteProfilo(pos)`
in un modulo puro (PCA→sezione→envelope) + test CI su faccia sintetica, poi collegarlo
alla scheda 2D dietro un pulsante con avvertenza. Nel frattempo (never-stop): rotazione
fallback su altre app/test/ricerca EVITANDO churn su superfici già mature e testate.

## Blocchi
Passo 3 (codice): gated sul dato reale del fondatore. #321 estetica: gated.
LAZ compresso: fuori portata senza decompressore pesante (dato messaggio guida).
