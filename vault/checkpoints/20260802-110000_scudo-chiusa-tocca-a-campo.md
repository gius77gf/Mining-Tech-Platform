# Checkpoint — Scudo è chiusa, tocca a Campo

- **Tipo**: unità (13 prove su near-miss e muro delle scadenze) + il censimento
  che sposta il cantiere
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `3879488`

## L'unità

`descrizioneNearMiss`, `riepilogoNearMiss`, `muroScadenze`,
`dataDaPeriodicita`. Un mancato infortunio si segnala **in piedi sul piazzale,
con i guanti**, in pochi secondi — o non lo segnala nessuno.

Le regole che valgono il lavoro:

- **Da due tocchi esce già una frase leggibile**: una segnalazione veloce non
  deve lasciare una riga vuota nel registro.
- **Quello che scrive la persona vince** su quello che compone l'app.
- **Una segnalazione senza categoria non sparisce dal conto** — finisce sotto
  «Non classificato». Le prove pretendono che la somma per categoria **e** per
  luogo torni col totale: toglierla farebbe sembrare che si segnali meno di
  quanto si segnala.
- **«Quante segnalazioni hanno prodotto un'azione» è un conto di EVENTI**, non
  di azioni: due azioni sullo stesso near-miss restano **un** near-miss
  seguito, altrimenti il registro sembra più seguito di com'è.
- **Con pochi numeri lo si dice**, invece di disegnare una tendenza che i dati
  non contengono.
- Una scadenza già passata **non finisce in un mese futuro** del muro.
- E la data proposta da una periodicità **non cade in un giorno che non
  esiste**: dal 31 gennaio, «fra un mese» è il 28 febbraio, non il 3 marzo.

Controprova: **8 difetti rimessi, 8 visti, 0 non visti.**

## Il censimento, rifatto

```
sentinella   77/107
scudo        56/71     (era 22/71 stamattina)
conti        35/58
flotta       29/71
campo        26/73     ← adesso la meno coperta
terra        23/39
```

Di Scudo restano scoperte quasi solo **costanti** (`TIPI_DOCUMENTO`,
`NEARMISS_CATEGORIE`, `MESI_NOMI`, `MANSIONI_PRESET`…) e il trasporto dati.
La parte che **decide** è coperta.

## Prossimo passo atomico

**Campo**, che ora è la meno coperta e non è un'app minore: è quella che sta in
mano a chi lavora, con il rapportino, la checklist di inizio turno, l'appello,
la chiusura del turno. Restano scoperte, fra le altre, `turnoCorrente`,
`eDelGiorno`, `operatoriDi`, e — soprattutto — le funzioni della **chiusura del
turno**, che è il punto in cui l'app dice *«questo turno è chiuso, non ci si
scrive più sopra»*: una regola che vale come una firma, e che nessuna prova
guarda.

## Stato

- **721** KPI (433 all'inizio della giornata) → **1004** prove `node`, verdi in
  UTC **e** in ora italiana
- **288 prove nuove** in giornata, **7 difetti di prodotto** trovati e corretti

## Bloccanti

- Nessuno.
