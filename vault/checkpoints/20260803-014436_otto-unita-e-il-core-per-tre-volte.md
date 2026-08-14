# Checkpoint — 2026-08-03 01:44:36 UTC

## Tipo
unit-complete (ciclo notturno, otto unità)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`a56b9c8` — *Il core stampava «undefined/undefined/boh» al posto di una data,
in 58 punti*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|---|---|
| 1 | la tabella del delta scritta sei volte (`a3c567c`) | due righe perse per parte in due documenti, e le sei copie **già divergenti** |
| 2 | le date illeggibili nel core (`b180e53`) | `null` → «scaduta da 56 anni»; `NaN` → badge **OK verde** e promemoria **sparito** |
| 3 | le due righe di Conti ritrovate (`81a8f91`) | `8+5+3+2 = 18`; arretrato Conti **12 → 0** |
| 4 | il rapportino a zero metri cubi (`7050dea`) | «0,0 mc» su un turno mai misurato; **4 copie** della stessa espressione, 1 già giusta |
| 5 | la premessa falsa di Conti (`0417c6e`) | totali **468,60 €** con la spunta già messa; DDT che valeva 0 € e 268,80 € insieme |
| 6 | la vibrazione azzerata (`2d08010`) | `valore: 0, prima: 3,2` **registrato come correzione di qualcuno** |
| 7 | il DDT stampato (`ea38689`) | «€ 0,00» su un documento che esce dall'azienda |
| 8 | la data stampata (`a56b9c8`) | «30/02/2026» e «undefined/undefined/boh», in **58 punti** |

⛔ **Il filo, e va scritto perché è la cosa più utile della notte:** nel solo
core, **tre volte su tre**, la causa era la stessa — una regola che esiste in
`shared/` da mesi, riscritta lì dentro in versione più debole (i giorni di
distanza, la media dei fori, la data stampata). Non è distrazione: è che
nessun controllo se ne accorge.

## Stato delle prove
run-kpi **1549**, stile 282, helpers 63, pointcloud 32, manifest 9, demo 8 →
**1.943** senza rete; **55** banchi del browser; copertura **606/606**;
61 file collegati; 15 pagine che compilano; **884** nomi importati verificati;
giro `node` **20 su 20** (e 40/40 con `--tz`).
Censimento dei numeri tranquilli: **zero punti in tutte e sei le app**.
Genesi: da 174 a **168** funzioni chiuse nella pagina.

## Prossimo passo atomico
Raccogliere i **quattro cantieri in corso**, verificare **sulla copia di quello
che si committa** (`git worktree` + `git diff --cached | git apply` + **`git -C
"$W" add -A`**) e committare app per app:
1. **Genesi** — i cinque difetti dichiarati e non corretti, il più grave dei
   quali è il **CSV esportato senza la difesa contro la CSV-injection**
   (`@SUM(1+1)` esce nudo dove `csvCell` scriverebbe `'@SUM(1+1)`);
2. **Campo** — `info` e `chi-riga` escono dal loro spazio a 320 px (198 contro
   131), sullo schermo su cui l'app vive davvero;
3. **Scudo** — il delta rimesso alla prova (16 righe, arretrato 11 commit);
4. **Terra** — seconda passata sui numeri che finiscono nella denuncia annuale.

## Code aperte, dichiarate
- ⏳ **Il salvataggio del rapportino** scrive `media_prof: 0` e `mc: 0`, e nulla
  impedisce di salvarlo senza un solo foro misurato. È una **decisione di
  prodotto** (bloccare il salvataggio o cambiare la forma del dato): proposta
  al fondatore nel commit `7050dea`, la mia risposta è la seconda.
- ⏳ **Il banco che guarda `#pes-tot`** non è stato aggiunto: cade perché legge
  prima che `refresh()` riempia il riquadro. Ragione scritta in
  `stati-non-misurati.mjs`; la metà misurabile è provata in `run-kpi`.
- ⏳ **Una regola 21 di `run-stile` sulle date formattate a mano è stata
  valutata e SCARTATA**: misurato, i soggetti rimasti sono chiavi di mese
  (`YYYY-MM`) costruite internamente, non date dell'utente. Un controllo con un
  solo soggetto vero insegna a non guardarlo.

## Blocchi
Nessuno. Al fondatore restano **19** decisioni: quelle che dipendono da lui e
le quindici di prodotto che procedono venerdì da sole.
