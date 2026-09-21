# Checkpoint — 2026-09-21T04:25:00Z circa

## Tipo
documentazione (nessun codice di prodotto toccato)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
5e88e4fb (docs(genesi): chiude ricerca assi-DXF, porta MIC/scatter in DECISIONI_WEEKEND)

## Cosa è stato completato
Continuando a scorrere `docs/RICERCA_CONTINUA_GENESI.md`, ho riletto la
ricerca del 12/09 sulla misura della frammentazione da foto — nata
apposta per informare la decisione **28** (schema a caselle) di
`docs/DECISIONI_WEEKEND.md`: "si procede con la misura assistita della
pezzatura da foto?". Quella ricerca è correttamente "solo mondo" (nessun
delta suo: la proposta spetta a chi ha il codice in mano, non alla
ricerca), ed è già ben incrociata con una seconda ricerca del 14/09.

- [x] **Osservazione, non un'azione**: la decisione 28 porta scritto,
  fin dal 12/09, "*la mia risposta, se non rispondi entro la
  settimana*: sì alla misura assistita" — e il termine dei sette giorni
  è scaduto da tempo (oggi 21/09). Ma verificato leggendo l'intero
  documento: il meccanismo "senza risposta entro la settimana procedo
  da solo e lo dichiaro nel commit" **è stato usato una volta sola**,
  il 07/08, su un lotto di decisioni nate insieme (5-18) — non si è mai
  ripetuto da allora, nemmeno su decisioni scritte prima di questa (le
  sezioni 19-27, dal 02/09 al 16/09, tutte ancora aperte con lo stesso
  termine scaduto).
- [x] **Non costruita la "misura assistita da foto".** Trattare la
  concessione del 01/08 come una regola che si rinnova ogni settimana
  per sempre, e usarla per giustificare la costruzione di una funzione
  UI nuova (non una riga), sarebbe esattamente un'inferenza su un
  permesso — la stessa famiglia di errore che la regola "niente entra
  sulla parola dell'agente" esiste per fermare, applicata qui al
  permesso del fondatore invece che alla parola di un agente di
  ricerca.
- [x] **Aggiunta una nota datata 21/09** subito dopo la nota del 14/09
  nella sezione 28, che pone la domanda esplicitamente al fondatore:
  la concessione del 01/08 vale solo per quel lotto, o è una regola
  permanente? Nessuna implementazione, nessuna decisione presa al posto
  del fondatore.

## Verifica prima del commit
`numeri-nei-documenti.mjs`: **43/0** (la nota aggiunta non tocca nessun
numero sorvegliato). `documenti-invecchiati.mjs`: **15/0**.

## Stato roadmap
Nessun codice di prodotto toccato. Una domanda di governo (non di
prodotto) resa esplicita per il fondatore, invece di essere risolta per
inferenza.

## Prossimi passi
- **Prossimo passo atomico**: proseguire lo scorrimento delle sezioni
  più vecchie di `docs/RICERCA_CONTINUA_GENESI.md` (righe 683-1397,
  "gli esplosivi in cava" secondo giro — già chiusa per nota del 14/09,
  verificare comunque) oppure passare a un'unità di codice vera se il
  rendimento di questo scorrimento continua a calare. **Non** costruire
  la misura assistita da foto (decisione 28) finché il fondatore non
  risponde alla domanda di governo appena posta, anche se il termine
  dei sette giorni è scaduto.
- Mandato del fondatore invariato: solo Genesi, massimo sforzo.

## Blocchi
Nessuno — solo una domanda esplicita al fondatore, non bloccante per il
resto del lavoro.
