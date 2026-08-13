# Checkpoint — 2026-08-13 20:20 UTC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimi commit
- `c7ae9fdf` — *Il contrasto non testuale del core si misura — e il banco aveva
  due difetti del righello prima del prodotto*
- `64bf8406` — la voce di roadmap (vedi la nota qui sotto: doveva stare nel
  primo)

## Che cosa è stato completato

**B0-novodecies.** `contrasto-non-testo.mjs` ha l'elenco delle superfici
**scritto a mano** e conteneva **le sei app, non il core**. Prima ancora di
misurare il prodotto, verificare le righe «non ho guardato» ha trovato **due
difetti del banco**:

1. **Cinque righe su ventuno erano false.** `usati` viveva dentro il ciclo che
   gira **una volta per sezione**: un selettore che vive in una schermata sola
   veniva dichiarato «mai comparso» dalle altre venticinque, mentre è a schermo.
   Fatta la sottrazione dopo tutte le sezioni: **21 → 16**, verdetti invariati.
2. **Il censimento chiedeva «sta nel DOM?», la misura guarda solo il VISIBILE.**
   Un soggetto reso e mai mostrato sarebbe sparito da **tutt'e due** i conti —
   il buco del `.toast.success` di `CLAUDE.md`. Misurato: `.scad-badge.warn`,
   `.scad-badge.danger` e `.sitem.danger` hanno **22 nodi ciascuno e zero
   visibili** in tutte e 26 le sezioni.

⛔ **E la controprova stava per essere promossa da un prodotto rotto**: il core
**non riceve l'iniezione** (non ha i `--bar-…`), quindi i suoi sei KO veri
avrebbero fatto dire «✓ so fallire» a un banco che non aveva iniettato niente —
la **terza delle cinque cause**. Adesso l'iniezione si conta per superficie.

⛔ **Due verdi falsi chiusi**, e il primo l'ho incontrato di persona: `--solo=`
con un nome sconosciuto usciva **zero**. Il banco diceva «tutto a posto»
**proprio mentre dichiarava di non aver guardato niente**.

## La misura
| tema | elementi | righe di stato | sotto 3:1 |
|---|---|---|---|
| buio | 1915 | 50 (di cui **17 vere**: 33 sono ambra di marca) | **1** |
| chiaro | 1915 | 15 | **6** |
| sole | — | il core non ce l'ha, **verificato** | — |

Nel giro completo del chiaro (7 superfici, 15.213 elementi) **le sei app sono
tutte a zero**: il core era insieme l'unica superficie **non misurata** e l'unica
**con difetti** — il costo esatto di un elenco scritto a mano. La correzione è la
voce **B0-duovicies**: non entra qui perché tocca `index.html`, dove lavora un
altro cantiere.

⚠️ Col core nell'elenco, le passate 225 e 226 di `tutti.mjs` diventano **rosse**
su sette difetti **veri**. Non è una regressione, ed è scritto perché chi legge
il prossimo giro non lo prenda per tale.

## ⛔ Un errore mio, da non rifare
La voce di roadmap doveva stare **dentro** `c7ae9fdf` e non c'è: lo script che
la scriveva è saltato su un'asserzione, e il `git commit` — su una riga a parte
— è passato lo stesso. È alla lettera la regola di `CLAUDE.md`, *«uno script che
non fallisce non ha per forza fatto qualcosa»*, in una veste nuova: non un
`sed` che non trova, ma **una scrittura che non avviene e un commit che parte
comunque**. La difesa è quella già scritta: **leggere l'esito prima del passo
successivo**, e non mettere sulla stessa riga la misura e il commit.

## Prossimo passo atomico
Raccogliere il cantiere sul core (**B0-vicies** la pastiglia «NON SALVA» che si
sovrappone in chiaro a 430 px, e **B0-unvicies** il rosso scritto a mano), poi
aprire **B0-duovicies** — i sette contrasti non testuali — sapendo già la causa:
`--success/--warn/--danger/--info` sono dichiarati **una volta sola** nel `:root`
del buio, e `body.light-mode` ridichiara solo gli inchiostri dei **testi**. È la
stessa forma della correzione già fatta, un piano più in là.

## Blocchi
- **Force-with-lease sul ramo**: la CI resta rossa su **quella riga sola**.
- **B0-septies** e le **soglie di sicurezza**: fermi al fondatore.
