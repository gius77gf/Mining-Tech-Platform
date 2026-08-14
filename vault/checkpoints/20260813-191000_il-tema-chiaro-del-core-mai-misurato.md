# Checkpoint — 2026-08-13 19:10 UTC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`97b2caf0` — *Contrasto: il tema chiaro del core si misura, e sotto c'erano 61
testi*

## Che cosa è stato completato

**B0-quaterdecies.** L'unità non è nata da un sospetto sul codice ma da una
riga che il banco stampava **da sempre** e che nessuno aveva letto:

> ⚠️ core non ha il tema «chiaro»: la classe viene tolta dalla pagina stessa.
> NON misurata.

Sono le righe «non ho guardato», che in questa casa si leggono **prima** dei
KO. Il **numero era giusto** (8 superfici su 14 non misurate in ognuno dei due
temi) e **la ragione no**: il core il tema chiaro **ce l'ha** —
`body.light-mode` a riga 7971, e `applyTheme` fa
`classList.toggle('light-mode', temaChiaro())`. Quello che non ha è
`window.dwTema`, cioè l'**interruttore condiviso** che il banco usa per le app,
perché non carica `shared/dw-tema.js`.

⚠️ **Appiccicare la classe era già stato provato e aveva prodotto decine di KO
falsi** — sta scritto dentro il banco, e leggerlo prima ha evitato di rifarlo.
La via che regge è quella che gli altri banchi del core usano già: **si passa
dai dati**. Le impostazioni di partenza dichiarano `theme:'dark'`; servite con
`'light'`, il core entra nel suo tema **dalla propria porta** e `applyTheme` lo
conferma invece di toglierlo. E la sostituzione si **conta**: se non trova quel
testo il banco **si ferma**, invece di misurare il buio credendo di misurare il
chiaro (un `replace` che non trova niente non fallisce).

## Che cosa ha detto la misura

Il confronto che toglie ogni dubbio sul righello — **stessa superficie, stessi
451 testi, stesso banco, a due minuti di distanza**:

| tema | testi misurati | sotto soglia |
|---|---|---|
| scuro | 451 | **0** |
| chiaro | 451 | **61** |

A cambiare non è lo strumento: è il tema. E il meccanismo è **uno solo**:
`body.light-mode` ridefinisce le **superfici** (`--bg`, `--card`, `--card2`,
`--text`, `--muted`) e **non ridefinisce gli inchiostri di stato**. Un verde
`#66bb6a` che sul fondo scuro regge, su una scheda **bianca** fa **1,9:1** —
sono i «35%», «69%», «31%» dell'elenco. È l'immagine speculare della lezione
dell'08/08 («il bianco su un pieno di stato non regge»): **un inchiostro di
stato pensato per il buio non regge sul chiaro.**

⚠️ **I 61 non entrano in un cantiere sulla parola del banco.** L'08/08, su 32
KO di contrasto, **quattro erano accuse false**, tutte fra i casi a **forbice
larga**. Qui la forbice è stampata accanto a ognuno: `.addbtn` ha **5,46**, gli
altri stanno sotto **0,4**. Il vincolo è scritto nella voce nuova
**B0-quindecies**, che è la correzione: sta nel **blocco della palette**, non
nei sessantuno punti.

## Che cos'è vivo adesso
- **Tre cantieri** su Conti, Terra e Sentinella, tutti sulla stessa domanda —
  *dove l'app compone qualcosa che ESCE, chi decide i suoi numeri?* Hanno già
  scritto su cinque file; **Terra ha consegnato** il suo blocco di prove.
- **Il giro completo del browser**, ripartito alle 19:02 su `d3653ec` — cioè
  sullo stato di oggi, con dentro il banco nuovo di Flotta. Sette passate
  chiuse.

## Prossimo passo atomico
**Raccogliere i tre cantieri** man mano che consegnano, con la disciplina
solita: diff letto riga per riga (non sulla parola dell'agente), blocco di
prove estratto **senza la prosa intorno**, `run-kpi` **letto** prima di
scrivere il messaggio del commit, verifica sulla **copia di quello che si
committa**, e i documenti aggiornati col numero **letto** — oggi `run-kpi` sta
a **2088** e i quattro documenti dichiarano **2.540**.

## Blocchi
- **Force-with-lease sul ramo** per togliere dalla storia il nome di un
  checkpoint datato due minuti avanti: la CI resta rossa su **quella riga sola**
  finché non arriva il sì del fondatore. La correzione è costruita e provata.
- **B0-septies** (il 2D di una volata senza maglia) e le **soglie di sicurezza**
  (`ppvLimit`, curve USBM/DIN): fermi al fondatore.
