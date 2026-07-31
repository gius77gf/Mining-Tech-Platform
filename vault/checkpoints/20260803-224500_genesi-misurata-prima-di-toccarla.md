# Checkpoint — Genesi misurata prima di toccarla

**Commit:** `5e05c00`
**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`

## Che cosa è stato fatto

Genesi è l'ultima superficie che si scrive in casa la struttura del core.
Il piano era già scritto — «rinominare `mdl` in `modal`, caricare il
condiviso, attenzione a `chiediValore`» — ma era scritto **leggendo le
funzioni**. Prima di eseguirlo l'ho misurato.

Quattro cose trovate, tre delle quali cambiano il piano, e **nessuna** delle
tre si vede nel codice delle funzioni:

1. **Genesi non carica niente di `shared/`.** Zero fogli, zero script,
   nemmeno `deepwork-style.css`. Nelle sei app e nell'amministrazione
   «passare al condiviso» voleva dire **togliere una copia** da una pagina
   che il condiviso lo caricava già. Qui vuol dire **collegare una pagina
   mai collegata**, e il rischio non è la funzione che si sposta: è tutto il
   resto che arriva insieme.
2. **Il nome `modal` è già occupato**, e da qualcosa che pesa: il **cancello
   di consenso**, l'avvertenza che dichiara *estetici* i frammenti volanti e
   **vieta** di usarli per definire aree di sgombero. La rinomina è uno
   scambio di inquilino su un id che porta un'avvertenza di sicurezza. E il
   prefisso `mdl` è sovraccarico: **sette** id non sono della modale ma
   dell'editor del fronte 3D — da rinominare sono **cinque**, non dodici.
3. **Il CSS non è una copia invecchiata**, ed è il **contrario**
   dell'amministrazione: lì 15 regole su 18 erano identiche carattere per
   carattere e le locali erano quelle vecchie; qui **2 su 14**, e tutte e
   dodici le divergenti divergono per **una cosa sola** — come si chiama la
   stessa idea (`var(--line)` contro `var(--border)`, `var(--tx)` contro
   `var(--text)`).

## Il numero che decide

> Il foglio condiviso pronuncia **76** variabili. Genesi ne definisce **12**.
> Le non definite sono **72 su 76**.

E una variabile CSS che non esiste **non fallisce**: la dichiarazione diventa
invalida e la proprietà ricade sull'ereditato. Nessuna riga rossa — un bordo
che sparisce, un raggio che torna a zero. È la stessa forma del principio del
prodotto: **l'assenza di un dato non è un dato favorevole**, e qui il dato
assente si traveste da «va bene così».

Contagio misurato: **22 selettori** del condiviso cadrebbero su markup che
Genesi ha **già** — `.kpi`, `.kpi.ok`, `.badge.tag`, `.note.ok`, `.dw-btn`,
non solo la famiglia `.modal-*` che si vuole.

## Il piano che ne esce: due unità, non una

- **A — solo il JavaScript.** Rinominare il cancello di consenso, rinominare
  i cinque id della modale (lasciando i sette del 3D), riscrivere l'**unico**
  punto che chiama `chiediValore` (riga 3895: passa un valore dove il
  condiviso vuole l'HTML del campo — la divergenza che compilerebbe in
  silenzio), caricare `dw-app-ui.js`, togliere le locali, aggiornare le tre
  chiamate a `mdlApri` e le cinque a `mdlChiudi`. **Non** caricare il foglio.
- **B — il colore.** Chiede prima una voce in `docs/PALETTE_APP.md` coi nomi
  del condiviso: `--grad`, `--edge`, `--sh1..4`, `--halo-1/2`, `--glow-*` sono
  **concetti** che Genesi non ha, non sinonimi di qualcosa che ha.

Insieme metterebbero nello stesso commit una migrazione meccanica e una
scelta cromatica: se qualcosa viene storto in uno screenshot, non si saprebbe
quale delle due.

E una cosa da **non** contare: Genesi non prende `go()`. Non ha pagine `.page`
né una pillola `.nav`, si muove per sezioni `data-scr`. Non è una copia
staccata, è un'altra cosa.

## Le misure sono controllate, non ricordate

Stanno in `numeri-nei-documenti.mjs` — **8 → 14** prove. Ed è **voluto** che
siano destinate a cadere: l'unità A fa sparire i cinque id `mdl`, la prova
fallisce, e il documento va riscritto **subito** invece che sei settimane
dopo.

**Controprova: otto difetti** rimessi uno alla volta su **copie** (il
`genesi.html` vero non si tocca mentre gira un giro del browser). Otto su
otto fanno cadere la prova col loro nome, **una sola** ciascuno; sui file
sani **7 passate, 0 cadute**.

Imparata scrivendola: per i due difetti sul **documento** la difesa del
«quanti caratteri ho cambiato» stampa **+0** — `72` → `70` è una sostituzione
a lunghezza uguale. È il corollario già scritto in `CLAUDE.md`, presentatosi
da solo.

## Numeri

- `numeri-nei-documenti.mjs`: **8 → 14** prove, 0 fallite
- totale `node` invariato a **1.343** (questo file non è nel conteggio delle
  sei suite: è il controllo che *legge* quel conteggio)
- copertura funzioni pure: **424 / 424**

## In corso

Il **giro a 25 banchi** del browser è ancora vivo (era ai «campi interi ·
controprova» quando ho controllato: i KO che si leggono lì sono **attesi**, è
la controprova che li produce). Finché gira: `docs/`, `vault/` e le suite
`node`; nessuna modifica a moduli e pagine.

## Prossimo passo atomico

Quando il giro finisce, **unità A** come sopra, nell'ordine scritto — è
adesso meccanica, e ogni passo ha una prova che sa dire se è stato fatto.
Poi, dal censimento: **Conti — note di credito** (oggi l'unico modo di
annullare una fattura emessa è eliminarla, e l'app stessa scrive che è
sbagliato) e **registro costi**.

## Nessun blocco

Restano aperte le decisioni del fondatore in `DECISIONI_WEEKEND.md` (punti
5a/5b, 10, 11, 12, 13, 14, 15) più la domanda su **Firebase Storage** per le
foto di Scudo.
