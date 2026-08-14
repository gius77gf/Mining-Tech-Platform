# Checkpoint — una prova che gira nel fuso sbagliato misura il contenitore

- **Tipo**: unità (19 prove sul programma di monitoraggio) + **ricerca misurata**
  che apre un cantiere serio
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `be44876`

## L'unità

19 prove su `statoRigaProgramma`, `programmaEsteso`, `riepilogoProgramma`,
`allerteProgramma`, `ultimaLettura`, `piuGiorni`, `etichettaFrequenza`. Sono la
domanda che l'azienda si fa davvero: **sono in regola con le misure che
l'autorizzazione mi chiede?** Sbagliare lì non produce un numero storto: produce
un **verde tranquillo su una misura che l'ente si aspettava**.

Le regole bloccate: si riparte dall'ultima misura **vera** (altrimenti ogni
ritardo si somma al successivo e dopo cinque giri il punto è indietro di un mese
col semaforo verde); il confine della tolleranza è preciso al giorno; «mai
misurato» è giallo e non rosso, perché un rosso che non serve insegna a ignorare
i rossi; la riga di un punto sparito **resta visibile**; l'ordine è l'urgenza,
non l'alfabeto.

Controprova su una copia: **8 difetti rimessi, 8 visti, 0 non visti**.

## ⚠️ Quello che l'ottava controprova ha fatto emergere

L'ottavo difetto era «i giorni sommati in ora locale invece che UTC». Sotto
l'orologio del contenitore — che è **UTC** — la controprova rispondeva **«non
distingue»**. Il difetto c'era, la prova era giusta: in UTC quel difetto **non
esiste**.

Rilanciata con `TZ=Europe/Rome` la controprova ha visto il difetto. E, di
rimbalzo, la **suite intera** in ora italiana è caduta in **due punti** su
`ritmoMedioAnnuo` di Terra — due prove che in UTC erano verdi.

È la lezione già scritta, in una veste nuova: **un controllo che gira in un
ambiente diverso da quello del cliente misura l'ambiente, non il prodotto.** Il
contenitore è in UTC; le cave sono in Italia.

## Il cantiere che ne esce (`docs/RICERCA_GIORNO_LOCALE_202607.md`)

Misurato eseguendo il codice vero con l'orologio italiano, non ragionandoci
sopra. **Tre punti sbagliati SEMPRE:**

1. **Il grafico «ultimi 6 mesi» del core mostra il mese sbagliato.** La
   **chiave** con cui si raccolgono i dati è UTC, l'**etichetta** che l'utente
   legge è locale: la barra scritta «mag» contiene la produzione di **aprile**.
   Tutte e sei le barre, tutto l'anno, per tutti gli utenti italiani, in due
   schermate (scheda cava e gemello digitale).
2. **Le scadenze delle fatture di Conti cadono un giorno prima.** Fattura del
   01/07 a 30 giorni → propone il **30/07**. Su un documento fiscale, e su un
   conto che poi diventa «giorni di ritardo» nel sollecito.
3. **Il ritmo medio di Terra non vede la misura di oggi**, e quel ritmo stima
   *quando finisce il volume concesso*.

E **sei sbagliati fra mezzanotte e le due** — che in un ufficio è un caso di
bordo, ma in una cava con il **turno di notte** è l'orario in cui si scrive il
rapportino. Terra arriva a **rifiutare** un rilievo di oggi dicendo che è «nel
futuro».

Sotto c'è un difetto di forma già noto a questo progetto: `oggiISO` esiste in
**sei posti** in **tre versioni**, cinque giuste e una no. Campo aveva capito
tutto e l'aveva scritto nel commento; poi la regola è stata ricopiata quattro
volte e riscritta male una quinta.

## Stato

- **560** KPI (433 all'inizio della giornata) → **819** prove `node`, verdi in UTC
- **127 prove nuove** in giornata, **2 difetti di prodotto** corretti, **2**
  misurati e in coda (l'ora persa nell'import di Sentinella, il giorno locale)
- **con `TZ=Europe/Rome` la suite cade in 2 punti**: è il difetto n. 3 qui sopra,
  ed è la prova che la misura è vera
- giro a 19 banchi: ancora in corso, moduli e pagine non toccati

## Prossimo passo atomico

A giro finito, nell'ordine (ognuna una sua unità, ognuna con la prova che nasce
rossa):

1. **`isoLocale`/`oggiISO` in `shared/deepwork-id-client/dw-shell.js`**, con
   Campo che **ri-esporta** e il test che pretende l'**identità**, non il
   comportamento;
2. i **tre della categoria A**, che sbagliano ogni giorno;
3. i **sei della categoria B**, uno per uno, distinguendo la data **scritta su
   un dato** dalla data **proposta**;
4. la passata `TZ=Europe/Rome` dentro la suite, altrimenti fra un mese ci
   ricaschiamo;
5. la regola in `run-stile.mjs` che rende tutto questo verificabile.

In coda restano le due correzioni già isolate: l'ora persa in `preparaLetture` e
lo zero di comodo in `apps/flotta/index.html` (~1397/1401).

## Bloccanti

- Nessuno.
