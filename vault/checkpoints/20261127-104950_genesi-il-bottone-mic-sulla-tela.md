# Checkpoint — Genesi: sullo schermo il bottone «MIC» cerchia i fori che partono insieme

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit
Quello che contiene questo file («feat(genesi): sullo schermo il bottone
«MIC»…»). Stato dei precedenti: vedi «Verifiche».

## Che cosa è stato fatto
- `apps/genesi/genesi-data.js`: `foriNellaMic(holes, kg)` (227 → 228
  provate), sopra la stessa `_indiciNellaMic` che usa il foglio.
- `apps/genesi/genesi.html`: bottone `dlMic` nella riga dei livelli di
  lettura, stato `D2.micCerchi` (non salvato con la volata), anello a
  `17.5*rr` nel ciclo dei fori, messaggio che dice quanti fori ha cerchiato
  o perché non c'è niente da cerchiare.
- `run-kpi` 3272 → 3273; `genesi-pianta-schermo.mjs` 143 → 148 controlli,
  controprova dei dettagli 10 → 13 difetti.
- ⚠️ Comando nuovo sullo schermo, additivo e spento alla nascita: detto
  nella roadmap come tale.

## Trovato strada facendo
- ⛔ Un mio lancio di prova sulla copia usava la porta **8763**, che è
  quella predefinita di `genesi-selezione-multipla`: nel giro di conferma
  di `0bc3efe8` quel banco è uscito 1 con `EADDRINUSE` — NON MISURATO, non
  rotto (55 su 56 a uscita 0). Il banco ha fatto la cosa giusta: non è
  partito. Le porte dei banchi vanno da 8322 a 8977 (più 9301, 9611,
  30000): d'ora in poi le mie prove a mano usano **9401 e seguenti**.

## Verifiche (lette dai registri)
- Giro `node` sullo stato in indice: 47 comandi a posto, 0 caduti, 4539.
- Sull'albero vero: `genesi-pianta-schermo` 148/148, controprova «✔» (1/1) e
  controprova dei dettagli «✔» (13 difetti su 13, ognuno sul suo controllo);
  colonna-progetto 71/71 (il bottone nuovo sta nello schermo ed è grande
  abbastanza), strati 7/7, foro-per-foro 214/214, foglio-pianta 87/87,
  maglia-assente 40/40.
- Dei commit precedenti: `0bc3efe8` (cariche nel tempo) — giro `node` 4537 e
  55 banchi su 56 a uscita 0; il 56° (`genesi-selezione-multipla`) NON
  misurato per la mia porta occupata (vedi sopra). `fedf355f` (fondo
  arancio; contiene anche `78c2e0e7`) — giro `node` sul committato 47 comandi
  a posto, 4538. ⚠️ Il giro dei 56 banchi su `fedf355f` era a 24 su 56, tutti
  a uscita 0, quando questo file è stato scritto
  (`scratchpad/giro50-banchi.txt`): va letto fino in fondo, e deve contenere
  `genesi-selezione-multipla` a uscita 0.
- ⚠️ NON rigirati su questo stato: gli altri banchi di Genesi.

## Numeri dichiarati nei documenti
3.775 prove senza rete (3273 + 330 + 83 + 40 + 9 + 8 + 7 + 3 + 22) · giro
4539 su 47 comandi · condivisi 402 su 402 · `genesi-data.js` 228/228 · pagina
162 funzioni · 471 esecuzioni nel browser da 216 file.

## Prossimo passo atomico
Il filone della MIC è chiuso sul foglio, nel CSV e sullo schermo. Prossima
unità, da scegliere MISURANDO prima (niente è scritto):
1. **Secondo passaggio sul report**: aprirlo con un progetto «difficile»
   (MIC non calcolabile, recettore assente, fori senza ritardo, maglia
   importata da DXF con tratti, 180 fori) e GUARDARE ogni scatto a 430 e a
   stampa — i banchi coprono la geometria, non il colpo d'occhio.
2. Oppure la voce aperta **B3** (Genesi continua a uscire dalla pagina): i
   CSV di Genesi sono ancora composti nella pagina
   (`genesi_scheda_volata.csv`, `genesi_confronto_AB.csv`,
   `genesi_legge_di_sito.csv`, `genesi_piano_carico.csv`): portarne UNO nel
   modulo come funzione pura e metterlo in `documenti-dimostrazione.mjs`.
   ⚠️ Prima di spostare, contare le iniezioni dei banchi che citano quelle
   righe (`genesi-documenti-che-escono.mjs` ne ha 16) e che i banchi
   applichino PER FILE.

## Blocchi (del fondatore)
Decisioni 28, 33 (⚠ quale foro usa la gittata), 34 (lettore LAZ), 35 (spalla
al piede), 36 (accenti nei CSV: prima la prova con Excel), 37 (sul telefono:
trascinare un foro subito o dopo averlo scelto); 32 rimandata.
