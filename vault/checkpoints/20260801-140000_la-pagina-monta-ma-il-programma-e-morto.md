# Checkpoint — «la pagina monta» passava anche col programma morto

- **Tipo**: unità (prova d'avvio + controprova che uccide il modulo)
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `3c299ec`

## La domanda

Il checkpoint precedente diceva: la prova «la pagina monta davvero» afferma
«1379 caratteri, 1973 elementi, 59 campi, 142 comandi» — quei numeri
**scenderebbero** se qualcosa non partisse?

## La risposta, misurata

**No.** Uccidendo il modulo di ogni superficie, la prova passa su **nove
superfici su nove**. Il markup delle app è quasi tutto statico: Conti col
programma morto fa comunque **488 elementi e 54 campi**, sopra ogni soglia.

Quella prova, da sola, non sa fallire per la ragione per cui esiste. La salva
solo «nessun errore di pagina» — e soltanto se il modulo muore **rumoroso**: uno
che esce in silenzio (un `return` anticipato, un'import fallita e catturata)
passerebbe tutte e due.

Va detto anche il verso buono: la prova **non è sbagliata**, misura quello che
dichiara — «la pagina è viva». Il difetto è che chi la legge le attribuisce di
più. Per questo la risposta non è cambiarla, è **affiancarle** la domanda che
manca.

## Il segno scelto misurando, non indovinando

La nota del modo la scrive il programma all'avvio, e solo lui. Misurate le
stesse pagine vive e morte: **57-72 caratteri contro 0**, su tutte e sei le app.
Non è un'ipotesi, è la differenza che si vede.

## Due cose imparate scrivendola

1. **Era flaky.** Scritta coi 2200 ms fissi del resto del banco, ogni tanto
   Terra — la prima app visitata — arrivava a 0 caratteri, per averne 57 al giro
   dopo sulla stessa pagina immobile: paga il riscaldamento del browser. Una
   prova che fallisce a caso è **peggio di nessuna prova**, perché insegna a
   ignorare il rosso e il primo rosso vero passa inosservato. Adesso aspetta la
   **condizione**, non l'orologio.
2. **Mi aspettavo sette superfici e sono sei.** L'amministrazione di Deepwork ID
   la nota ce l'ha, ma non è un riquadro della vetrina e questo banco non ci
   passa. L'ha detto il conto dei soggetti — la stessa difesa che stamattina ha
   scoperto la settima superficie di cui non sapevo.

## La controprova

`--senza-programma` uccide il modulo e pretende che tutte e **sei** le app
diventino rosse. Verificato: **6 su 6**. Se il modulo non si trova nel sorgente,
la controprova lo grida invece di passare in silenzio.

Core, vetrina e Genesi non hanno questo segno e **restano scoperti**: sta
scritto nel file e nel LEGGIMI, così non sembra che siano coperte tutte.

## Stato

- **17 banchi** del browser (erano 15 stamattina)
- **177** prove di stile, **433** KPI, 43 helper, 23 pointcloud, 9 manifest,
  7 demo — tutte verdi

## Prossimo passo atomico

Trovare il segno d'avvio anche per **core, vetrina e Genesi**, che oggi restano
scoperti. Per il core la strada c'è già ed è scritta in `CLAUDE.md`: senza rete
il modulo non parte e restano i segnaposto che il core installa apposta
(«Funzione nav non ancora pronta») — quindi il segno è l'**assenza** di quei
segnaposto, ed è misurabile con `finto-firebase.mjs` montato e non montato.

## Bloccanti

- Nessuno.
