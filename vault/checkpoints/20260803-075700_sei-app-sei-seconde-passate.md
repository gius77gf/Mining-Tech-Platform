# Checkpoint — 2026-08-03 07:57:00 UTC

## Tipo
unit-complete (tre unità: Genesi, il core dei banchi, Scudo) — e chiude la
seconda passata su **tutte e sei** le app

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`395c165` — *Scudo: una pastiglia verde «tutte regolari» su tre visite mediche
dalla data illeggibile*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|---|---|
| 28 | **Genesi, seconda passata** (`efac49a`) | un campo svuotato lasciava **28 righe su 28** calcolate su un valore che nel campo non c'era più |
| 29 | **il core era un guscio per tutti i banchi** (`71875c1`) | **258** caratteri di testo e **un** bottone; e cinque violazioni AA che nessuno aveva mai visto |
| 30 | **Scudo, seconda passata** (`395c165`) | pastiglia **verde «tutte regolari»** su tre visite mediche dalla data illeggibile |

⛔ **La seconda passata è finita su tutte e sei le app, e il conto è questo:
Terra 5, Conti 6, Flotta 6, Sentinella 5, Campo 4, Genesi 4, Scudo 5 — più
quattro nel core. Trentanove difetti veri, e il censimento statico su tutte
quelle app era a ZERO.** Il metodo che li ha trovati è uno solo: chiamare le
funzioni coi casi limite **e poi aprire la pagina e premere i bottoni**,
guardando quello che **esce** — CSV, PDF, frasi di riepilogo.

## Il core dei banchi, che è la scoperta più grossa
`apriSuperficie` iniettava `state.user` e basta, quindi il core restava sulla
schermata d'accesso: **1.036 elementi, 258 caratteri, un bottone**. Con
l'accesso vero: **658 caratteri, otto bottoni, `screen-home`**. Il segno era
**già stampato** da mesi in fondo al banco delle modali — «core: nessuna modale
aperta … nel suo programma ce ne sono 68 da aprire»: il controllo dichiarava di
essere cieco e nessuno lo leggeva.
E appena il core è diventato visibile sono uscite **cinque** violazioni AA
(la peggiore `.av-cv` a **2,36:1**, e `.sync-badge.nonsalva` a 4,22 — che è
l'avviso «quello che scrivi non viene salvato»). Quattro corrette, e la quinta
non era un difetto: era il banco che **misurava una dissolvenza** (il toast a
metà transizione dava 1,45:1 su un testo che a schermo pieno ne fa più di
otto). Adesso `contrasto.mjs` salta ciò che sfuma e lo **conta**: «312 testi
misurati, 0 sotto soglia · 11 in dissolvenza, non misurabili».
⚠️ E la prima correzione di `.av-fc` ha **peggiorato** il rapporto (3,45 →
2,09): fondo scurito, testo scuro lasciato. **Misurare dopo, non solo prima.**

## Stato delle prove
run-kpi **1607**, stile 284, helpers 63, pointcloud 32, manifest 9, demo 8 →
**2.003** senza rete; **67** banchi del browser; copertura **642/642**;
67 file collegati; giro `node` **20 su 20**; albero **pulito**.

## Prossimo passo atomico
1. **La seconda causa della cecità sulle modali**: con l'accesso corretto
   `modali-dentro --solo=core` dice ancora **0 aperte su 68, con 6.800 comandi
   provati**. Il rilevatore cerca `#modal.show` + `.modal-box` + `#modal-title`
   e il core li ha tutti e tre: va trovato perché non scatta. Stessa domanda per
   **vetrina** e **terra**, che il banco dichiara di non aver guardato.
2. **Rilanciare il giro completo del browser** su un commit fresco: quello
   lanciato alle 03:20 gira ancora su una copia di `613c3b6`, ormai quindici
   commit indietro, ed è il primo giro con il core davvero visibile.
3. Poi: la terza passata sui punti che i cantieri hanno **dichiarato scoperti**
   — la `consegna_turno.txt` di Campo che perde i minuti dei fermi,
   `_sitoParseCsv` di Genesi che resta a metà fuori da `shared/`, e gli id
   orfani nelle mansioni di Scudo (decisione di prodotto).

## Code aperte, dichiarate
Immutate: il salvataggio del rapportino (procede venerdì 07/08),
`riepilogoCosti` di Conti, `+null` nelle letture di Sentinella,
`riepilogoControllo.gravita` di Flotta, la scorciatoia ES6 per la regola 20,
`ppvPrevFonte` e `airblastDb` di Genesi.

## Blocchi
Nessuno. Al fondatore restano **19** decisioni.
