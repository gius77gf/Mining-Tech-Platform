# Checkpoint — 2026-11-26T16:05:34Z

## Tipo
unit-complete (fix di un difetto vero + calcolo + copertura con controprova)
— ciclo automatico del 26/11.

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
9b2d642b (feat(genesi): foro per foro, F2 — la carica totale vera anche nella scheda dei costi e nel registro per Sentinella)
Giro `node` su quel commit: 43 comandi su 43, 4332 asserzioni.

## Cosa è stato completato
1. **⛔ Difetto vero, trovato dal banco e corretto.** `applyDesign` chiamava
   `genMaglia2D()` a OGNI parametro toccato. Misurato nel browser cambiando
   solo il borraggio: 13 fori → 12 (quello aggiunto a mano spariva), il primo
   foro da 0,7 tornava a 0 (lo spostamento a mano perso), ritardo a mano e
   carica propria persi — i primi due senza nessun avviso. Ora la maglia si
   rigenera solo se cambia la sua geometria: `firmaMaglia(D2)` (spalla,
   interasse, file, fori per fila, sfalsamento) si prende quando la maglia
   nasce o quando un progetto salvato rimette i suoi fori, e `applyDesign`
   la confronta; se i fori sono gli stessi ricalcola solo la sequenza. Quando
   rigenera davvero, il toast dice anche dei fori con valori loro.
2. **Il campo «Esplosivo totale» a due versi** (`syncKgTot` + gestore):
   mostra `caricaTotale(n, kg, scarto)`; un totale scritto passa da
   `caricaProgettoDaTotale(tot, n, holes)` — i fori con una carica propria
   restano fermi, il resto si distribuisce sugli altri; tutti con carica
   propria, o totale minore della somma delle proprie → rifiuto col motivo
   (non clamp a 5 kg). Senza cariche proprie è `tot/n` alla cifra. La regola
   discende da F1 (il campo scrive la carica del PROGETTO), non è una scelta
   nuova: per questo non è andata in DECISIONI.
3. Due guardie sul sorgente in `run-kpi` (G43 e B0-decies) erano cadute
   sulla prima stesura: la riga è stata riscritta in modo da lasciare intatto
   ciò che sorvegliano (nessun `||D2.x` in più in `applyDesign`; la riga
   `D2.holes=holes; …; computeSeq2D();` com'era).
4. Un'iniezione di `genesi-maglia-assente.mjs` citava la riga della maglia
   assente, cambiata (+`D2.firmaMaglia=null`): presa da `iniezioni-fresche`
   (745 su 746) e riagganciata.
5. Banco `genesi-foro-per-foro.mjs`: 21 → 32, controprova 15 KO con 5
   iniezioni su 5 applicate per file. `run-kpi` 3237 → 3239.

## ⚠️ Verifica ANCORA IN CORSO al momento di questo commit
Il cambio di `applyDesign` tocca un comportamento di base: sto facendo
girare TUTTI i banchi di Genesi nel browser sull'albero di lavoro
(`genesi-*.mjs` + `ponte-genesi-*.mjs`, registro in scratchpad
`genesi-banchi.log`). Al momento del commit i primi 3 erano verdi. L'esito
completo e la controprova di `genesi-maglia-assente.mjs` vanno nel
checkpoint successivo; se un banco contava sulla rigenerazione, si corregge
con un commit a sé. Il giro `node` completo parte dopo.

## Numeri propagati
3.735 → **3.737**; `genesi-data.js` 185 → **187**, condivisi 358 → **360**;
giro `node` scritto **4334** per somma (+2 prove, nessun file nuovo).

## Prossimi passi
- **Prossimo passo atomico**: leggere `genesi-banchi.log` (esito della
  passata dei banchi di Genesi), lanciare `genesi-maglia-assente.mjs
  --controprova`, poi il giro `node`. Poi `computeKPI` (carica totale sulla
  GRIGLIA: decidere se aggiungere lo scarto quando i fori disegnati sono
  tanti quanti la griglia), consumo specifico, metri perforati per foro.
- Poi F3: il comando per l'utente sulla selezione multipla.

## Blocchi
Nessuno.
