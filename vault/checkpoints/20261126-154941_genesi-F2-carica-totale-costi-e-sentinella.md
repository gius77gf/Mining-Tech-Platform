# Checkpoint — 2026-11-26T15:49:41Z

## Tipo
unit-complete (ciclo automatico del 26/11, canarino 14040243)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
14040243 (canarino: ciclo automatico del 26/11…)

## Cosa è stato completato
- Giro `node` sul commit 42119393: 43 comandi su 43, **4332** asserzioni
  (letto dal giro tutto verde, uguale ai documenti).
- F2, carica totale: collegati altri due chiamanti.
  · Scheda dei costi del Progetto (`renderScheda2D`, `_cV`): lì `Q` è
    `D2.kg` (riga `const B=g.B, …, Q=D2.kg`) e `_nf=g.n` sono i fori
    disegnati → `scartoKg:scartoCaricheProprie(D2.holes, Q)`.
  · Registro per Sentinella (`_sentDati`): `nf=g.n||k.nf` — i fori in
    pianta, o la griglia solo se in pianta non ce n'è nessuno (e allora lo
    scarto è zero perché nessun foro lo porta) → terzo argomento di
    `caricaTotale`.
- Ponte di debug: `sentKgTotali` (sola lettura).
- Banco `genesi-foro-per-foro.mjs`: 17 → 21 — scheda dei costi (letta dal
  DOM), Sentinella e scheda volata CSV dicono lo STESSO numero (12 × 58 +
  42 = 738 con un foro a 100 kg; 696 senza). Controprova: 7 KO.
- Nessun numero tracciato cambia (nessuna prova `node` nuova, nessun file
  nuovo): numeri-nei-documenti 43/0.

## Prossimi passi
- **Prossimo passo atomico — `syncKgTot`, il campo a due versi.** In
  scratchpad: (1) lettura = `caricaTotale(n, D2.kg, scarto)`; (2) scrittura
  di un totale T: i fori con carica propria restano fermi,
  `kg = (T − Σ proprie) / (fori senza propria)`; casi limite: tutti i fori
  con carica propria (niente da distribuire: dirlo, non dividere per zero);
  T < Σ proprie (carica negativa: rifiutare col motivo). PRIMA leggere il
  gestore `change` di `dKgTot` per intero (clamp 5–200 su D2.kg, kgAuto) e
  verificare che senza cariche proprie il comportamento resti identico.
  Se la regola di distribuzione non è l'unica ragionevole → sezione in
  docs/DECISIONI_WEEKEND.md e si passa a `computeKPI`.
- Poi `computeKPI` (conta sulla griglia: capire se k.qtot è mostrato accanto
  a fori disegnati), consumo specifico, metri perforati per foro; poi F3.

## Blocchi
Nessuno.
