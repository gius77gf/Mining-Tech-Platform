# Flotta

App mezzi & manutenzione. Buyer: responsabile mezzi.

Sei schermate: **Quadro · Giro · Mezzi · Officina · Scadenze · Costi**.

## Cosa c'è dentro

- **Quadro** — numeri di testa, disponibilità della flotta, scadenze di
  legge, giro macchina di oggi e priorità operative (tutto ciò che è
  scaduto o sta per scadere, in un elenco solo).
- **Giro** — *controllo pre-uso*: l'operatore sceglie il mezzo, risponde a
  una checklist che cambia col **tipo di mezzo** e salva. Tre tocchi quando
  va tutto bene («segna tutto a posto» + salva). Ogni voce **«non va»**
  diventa una **manutenzione aperta sul mezzo**; se la voce è di sicurezza
  l'app propone di fermare la macchina.
- **Mezzi** — parco, stati, ore motore, import/export CSV, e per ogni mezzo
  la **scheda** (libretto macchina) con dati, scadenze, tagliandi, storico
  interventi, giri e consumi: si stampa e si esporta.
- **Officina** — manutenzioni a data o a ore motore, con **piani
  ricorrenti** (250/500/1000/2000 h, oppure a mesi) che alla chiusura
  ripianificano da soli il tagliando successivo; registro interventi;
  magazzino ricambi.
- **Scadenze** — scadenzario di legge del mezzo, con le voci già pronte e
  il riferimento normativo.
- **Costi** — voci di spesa, ripartizione e andamento mensile, più il
  **carburante per mezzo**: rifornimenti con le ore del contatore da cui
  l'app calcola **litri/ora** ed **euro/ora**.

## Dati (Firestore, sotto l'organizzazione)

`mezzi` · `manutenzioni` · `costi` · `ricambi` · `interventi` · `scadenze`
· `disponibilita` · `controlli` (giri macchina) · `rifornimenti`.

Tutti i calcoli stanno in `flotta-data.js` come **funzioni pure**
(consumo, checklist, riepilogo del giro, prossimo tagliando, fascicolo del
mezzo): si provano senza browser. L'accesso ai dati passa sempre dallo SDK
Deepwork ID (`orgCollection`), mai da percorsi Firestore scritti a mano.

## Regole che l'app rispetta

- Niente numeri inventati: il consumo si mostra solo quando esistono almeno
  due rifornimenti con il contatore (il primo fissa il punto di partenza);
  i giorni senza registrazione restano buchi, non zeri.
- Un giro macchina con voci senza risposta **non si salva**.
- Il contatore delle ore non scende mai.
- Flotta è un promemoria e un archivio ordinato: **non** sostituisce il
  libretto ufficiale della macchina né i verbali dell'ente verificatore.
