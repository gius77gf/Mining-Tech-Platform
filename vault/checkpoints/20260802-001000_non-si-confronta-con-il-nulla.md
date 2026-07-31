# Checkpoint — non si confronta un mese con il nulla

- **Tipo**: unità (12 prove sull'andamento per ricettore)
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `4438a8c`

## L'unità

`limitiMese`, `lettureNelPeriodo`, `statPeriodo`, `confrontoMesi`,
`andamentoRicettore`: la schermata che risponde a «**come sta andando dove
abita la gente**», mese in corso contro mese prima.

Le due regole che valgono il lavoro difendono la stessa cosa — la regola di
onestà già scritta nel modulo, *se le letture non bastano NON si inventa una
linea*:

1. **«Nessuna misura» non è «zero mm/s».** Senza letture, media, massimo e
   minimo restano `null`. Uno zero lì significherebbe «è andato benissimo» su
   un mese in cui non si è misurato niente.
2. **Non si confronta un mese con il nulla.** La controprova lo fa vedere
   meglio di qualunque spiegazione: tolta la guardia, `deltaMedia` diventa
   **6** — la media del mese in corso meno uno zero che nessuno ha misurato.
   Un miglioramento inventato dall'assenza di dati, cioè esattamente il numero
   che un'azienda vorrebbe leggere e che non deve trovare.

Più: gli estremi del periodo sono **compresi** (escluderli toglierebbe due
letture da ogni mese, in silenzio); una media su **una** lettura sola è
dichiarata **debole** invece di passare per tendenza; sotto tre letture
`abbastanza` è falso, perché da due punti passa qualunque linea.

Controprova su una copia: **6 difetti rimessi, 6 visti, 0 non visti.**

## Stato

- **604** KPI (433 all'inizio della giornata) → **863** prove `node`, verdi in UTC
- **171 prove nuove** in giornata
- Sentinella: le funzioni scoperte erano 70 su 107 a inizio blocco, ora sono
  molte meno — restano i gruppi delle volate previste e del CSV
- giro a 19 banchi: all'ultimo banco (unità in maiuscolo)

## Prossimo passo atomico

Il giro sta per chiudere. Appena chiude, nell'ordine già fissato:
`isoLocale`/`oggiISO` in `shared/` con il test di **identità**, poi i tre punti
di categoria A del giorno locale, poi l'ora persa in `preparaLetture`, poi lo
zero di comodo di Flotta.

## Bloccanti

- Nessuno.
