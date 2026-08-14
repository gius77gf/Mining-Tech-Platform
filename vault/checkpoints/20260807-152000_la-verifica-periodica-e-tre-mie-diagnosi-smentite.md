# Checkpoint — 2026-08-07 15:20:00 UTC

## Tipo
unit-complete (quattro unità: la barra di Sentinella, la verifica periodica di
Scudo, l'arretrato che dice quali commit mordono, il censimento dei nomi fissi)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`39b5865` — *Roadmap: C1-bis chiusa, con le due code dichiarate*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|---|---|
| 172 | **la barra di Sentinella** (`69078fa`) | 328 in 302 → **302 in 302**; e nel sole tagliava **141 px** a 320 |
| 173 | **la lezione in CLAUDE.md** (`80ec0aa`) | la mia diagnosi era falsa nella causa |
| 174 | **l'arretrato dice quali commit mordono** (`90a8f89`) | grezzo 33 → 41, **che mordono fermi a 7** |
| 175 | **il censimento dei nomi fissi** (`6294cd7`) | **45 fissi contro 14 costruiti** |
| 176 | **la verifica periodica di Scudo** (`7395e87`) | prove **1844 → 1853**, copertura **688/688** |

## ⛔ Tre mie diagnosi smentite dai cantieri, con la misura
È il risultato più utile della giornata, e va scritto per primo.
1. **«rimpicciolire il carattere fa salire il minimo, 328 → 333»** — numero
   giusto, **causa sbagliata**: a 320 px il foglio condiviso applicava già font
   8px, e la mia prova alzava la **spaziatura** da .8 a .9 (51 lettere × 0,1 =
   i 5 px comparsi). `getComputedStyle` lo dice in tre secondi.
2. **«il minimo è sei volte la colonna più larga»** — dedotto e falso: con `1fr`
   le tracce si equalizzano solo se ci stanno, se no il minimo è la **somma**
   (327,80 chiesti alla griglia).
3. **«riusa `origineTipo`/`origineId` per il legame col verbale»** — sbagliato:
   quella forma è polimorfa perché l'altro capo sono sei collezioni; qui è una
   sola, quindi sarebbe una costante e direbbe il verso sbagliato.
E i miei conti di `esito` (80/225) erano invecchiati di due ore: sono 89/377.
⚠️ Il danno di una diagnosi sbagliata **scritta con sicurezza** non è il tempo:
è che manda il cantiere dopo a non provare la strada giusta. Lì era proprio
quella, e ha chiuso il difetto.

## ⛔ E la seconda domanda ha trovato più della prima
Chiudendo la barra di Sentinella a 320 px, il cantiere ha chiesto «e negli altri
due temi?»: nel **sole** era tagliata **a tutte le larghezze**, fino a 141 px a
320 — due voci intere sparite — perché una regola dell'app batte per specificità
ogni gradino del foglio condiviso. La stessa causa taglia **Flotta (16 px)** e
**Terra (11 px)**. ⚠️ E **Conti risponde «ok» senza provare niente**: il suo
`overflow:hidden` sul bottone fa sì che la barra non trabocchi mai, e a essere
tagliate siano le etichette **dentro** il bottone.

## Stato delle prove
Prove **2.260** (`run-kpi` 1853), copertura **688/688**, banchi **138**, giro
`node` **23 comandi, 0 caduti** verificato sulla copia a ogni commit.

## Che cosa sta girando adesso
**Un cantiere**: la barra nei tre temi (insegna i temi al banco, chiude Flotta e
Terra, misura Conti). Il solo file non committato è il suo.

## Prossimo passo atomico
1. **Raccogliere il cantiere della barra nei tre temi**, sulla copia di quello
   che si committa. ⚠️ Se una superficie resta rossa, la passata **non** va
   registrata in `tutti.mjs`: un giro rosso per un difetto noto è un giro che si
   impara a non guardare.
2. **Le due code di Scudo**: la prova della modale (21 prove) vive in scratchpad
   e va portata in `tests/browser/` **con la registrazione in `tutti.mjs`»;
   il contrasto di Scudo è misurato solo nel tema buio.
3. ⛔ **`contrasto-non-testo.mjs` ha ancora l'accoppiamento a tappeto** sui
   gradienti che il righello ha smesso di avere: la WCAG 1.4.11 è misurata col
   righello vecchio.
4. ⛔ **Le quindici decisioni verdi a fine giornata**, col piano in roadmap
   (`ae2255d`): sette si applicano scrivendole, otto vogliono un cantiere, e
   ognuna va dichiarata **decisa dal ciclo** nel commit.

## Code aperte, dichiarate
- I due candidati coi nomi di file fissi in Genesi (`genesi-demo.volata.json`,
  `genesi_signature_composito.csv`): il contenuto dipende da una **scelta**, e
  due scelte diverse si sovrascrivono.
- «Adempimenti» è la parola che governa il minimo della barra di Sentinella:
  accorciarla è la sola strada per i bersagli di tocco a 320 px (oggi 41,4).
- Le altre dei checkpoint precedenti.

## Blocchi
Nessuno.
