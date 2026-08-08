# Checkpoint — 2026-08-08 16:03 UTC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`7bea25c` — docs: il tema del sole c'è su sei superfici su dieci

## Che cosa è stato completato
Nata da **24 righe «NON misurata»** del giro del browser — quelle che qui si
leggono **prima dei KO**.

Misurato cercando il `<script src>`: caricano `shared/dw-tema.js` **solo le
sei app verticali**. Fuori restano il **core** (che ha un suo impianto a due
temi, dichiarato nel suo commento) e, **senza nessun tema**, la **vetrina**,
**Genesi** e **Deepwork ID**.

Perché conta: il sole è il tema che rende leggibile un telefono **in cava**.
Genesi si usa **al fronte**; la schermata di **accesso** è la prima cosa che si
apre, all'aperto.

⛔ **Non l'ho fatto, di proposito.** L'estetica è una **direttiva vincolante del
fondatore** — palette propria per ogni app, scelta con ricerca cromatica vera e
verificata per contrasto. Qui c'è la **misura** e il **perché**; la scelta è
sua. Sta in roadmap come proposta, non come lavoro fatto a metà.

## ⚠️ Come ci sono arrivato, che serve più della conclusione
La prima misura l'avevo fatta con `grep -c 'dw-tema.js'` e dava «il core lo
carica, 2 volte». Erano **due commenti**, e uno dice **esattamente il
contrario**. Contare i commenti come codice è la trappola che questo repository
ha già pagato più volte, e l'ho rifatta in una riga di shell: l'ha presa il
**rileggere prima di scrivere**, non un controllo.

## Stato della giornata
**Diciannove unità** chiuse, tutte committate e spinte, CI verde.

## Prossimo passo atomico
1. **Raccogliere il giro del browser** quando finisce (PID 16670, oltre 4h30,
   ancora vivo): `leggi-giro.mjs`, **sezione 1 prima della 2**, e la riga «le
   tre passate più lente» per ritarare il limite di 30 minuti.
   ⚠️ Attesta `c3888fe`: **nessuna** delle diciannove unità di oggi è dentro.
2. Poi la **coda offline** della 5b, che è **una misura prima che una
   funzione** e vuole una pagina collegata all'**emulatore**: quel ponteggio
   oggi non c'è, ed è un'unità a sé.

## Blocchi
Nessuno.
