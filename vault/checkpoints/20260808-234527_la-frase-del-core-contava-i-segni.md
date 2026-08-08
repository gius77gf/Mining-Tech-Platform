# Checkpoint — 2026-08-08T23:45:27Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`7581402`

## Task completato

**L'ultima superficie della terza gamba: il core.**

La domanda di `CLAUDE.md` nomina tre cose che escono — «un CSV, un PDF, **una
frase di riepilogo**». Il core ha **un solo** export di file
(`deepwork_fori_fronte_*.csv`): il file lo scrive `foriDalModello`, che
**filtra** (`m && m.position`), e il messaggio contava `_recon.markers.length`.
Un segno senza posizione entrava nel numero **annunciato** e non nel **file**:
la forma esatta in cui questa famiglia si presenta — la frase conta l'array
SORGENTE mentre il ciclo che scrive filtra.

Corretto **contando una volta sola**: l'array si calcola, e la sua lunghezza va
sia nel file sia nella frase.

## Le tre cose imparate

1. ⚠️ **Onestà sulla gravità, perché la misura la ridimensiona.** Oggi i segni
   li crea un punto solo, che scrive sempre `position`: la divergenza è
   **latente** — vive per un modello ricaricato, un record vecchio, una
   scrittura parziale. Resta corretta perché il difetto gemello in Flotta era
   latente allo stesso modo, e la versione giusta stava già nello stesso file.
2. ⛔ **Quell'export non lo apre nessun banco, e la ragione è MISURATA, non una
   svista**: `_recon` è una variabile del **modulo** (`let _recon=null`), quindi
   non si inietta da fuori, e senza rete il 3D non parte affatto. Quando un
   banco non può arrivare a una proprietà, la si sorveglia **dove si legge** —
   qui la **regola 31** di `run-stile`, che è statica: la riga della frase non
   può contenere `markers.length`.
3. ⚠️ **Il righello ha sbagliato una volta, col segno di sempre.** L'ancora era
   una regex che provava a scavalcare le parentesi — `[^)]*` si ferma alla prima
   `)` di `plurale(...)` — quindi non trovava la frase **né nel core né nella
   sua controprova**: la regola accusava **sé stessa**. Adesso l'ancora è la
   **riga**.

⚠️ E un allarme sollevato e chiuso con la misura: dopo aver aggiunto quattro
asserzioni, il totale di `run-stile` restava **318** — che è il segno del file
di test inerte. Non lo era: quel totale conta i **blocchi `test`**, non le
asserzioni, verificato lanciando la suite **da HEAD** (anche lì 318). La
domanda era giusta; la risposta l'ha data il confronto, non il ragionamento.

## Verifiche
- `run-stile`: **318 test, 0 falliti**; provata a fallire rimettendo il difetto
  nel core — la regola cade e **nomina la riga** — con ripristino **da copia** e
  `diff -q`, non con `git checkout`
- `node giro-node.mjs`: **32 comandi a posto, 0 caduti**, rifatto sulla **copia
  di ciò che si committa**, identità della patch verificata

## Stato roadmap
Filone «i numeri che mentono con la faccia tranquilla».
Domanda *«chi decide i numeri di ciò che ESCE?»*: **chiusa su tutte le
superfici** — Campo 6/6, Sentinella 5/5, Terra 3/3, core 2/2 + il CSV dei fori,
Flotta 9/9, Conti 12/12, Genesi, Scudo 5/5. La **terza gamba** (la frase contro
il file) gira su Flotta, Conti, Scudo, Campo, Genesi e adesso il core.

## Prossimo passo atomico
**Leggere il giro del browser** (pid 32676, registro
`scratchpad/resp/giro/registro4.txt`) quando ha finito.
⛔ La prima domanda **non** è «che cosa dice» ma **«sta ancora scrivendo?»** —
due `stat` a venticinque secondi di distanza, e si guarda che esista un processo
figlio col tempo di CPU che sale. Un giro che si pianta si ferma a metà di una
sezione e le passate mai eseguite **non compaiono in nessuna riga**.
Poi si legge con `node apps/deepwork-id/tests/browser/leggi-giro.mjs <registro>`
in quest'ordine: **sezione 0** (l'età: attesta `7cddb59`, quindi pochi commit) →
**righe «non ho guardato»** → **KO veri**.
Da questo giro il conto dei KO non è più gonfiato dal riepilogo finale
(`cc8225e`): sul registro precedente diceva 47 e ne erano **10**.

## Blocchi
Nessuno.

## Note
Il giro cammina su una **copia** di `7cddb59` (`git worktree`), quindi si può
continuare a lavorare sull'albero vivo senza invalidarlo: alle 23:45 era a otto
passate su ~196, cioè ha davanti alcune ore.
