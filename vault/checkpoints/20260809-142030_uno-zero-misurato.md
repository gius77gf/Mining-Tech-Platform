# Checkpoint — 2026-08-09T14:20:30Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`3a3ca66`

## Task completato

**I due cantieri raccolti, e il difetto che nessuno dei due poteva chiudere,
chiuso da me in `shared/`.**

| | |
|---|---|
| stato nuovo | `misura-zero` distinto da `no-misura` |
| il dato che li distingue | `mis.rilievi` — **1 contro 0**, era già lì |
| contrasto dentro le modali | **4.686 testi**, **1** sotto soglia |
| il difetto del core | **3,28:1** dove ne servono 4,5 |

## Le tre cose imparate

1. ⛔ **UNO ZERO MISURATO NON È UNA MISURA MANCANTE — il principio del fondatore
   nel verso che nessuno guarda.** Non un dato **assente** spacciato per
   favorevole: un dato **presente** spacciato per **assente**. Sullo zero
   misurato Terra scriveva *«non risulta nessun rilievo elaborato di scavo»* —
   falsa, e falsa **proprio quando i turni dichiarano una produzione**, cioè
   quando il fronte fermo è l'allarme più forte che quella schermata sappia
   dare. L'app **taceva l'allarme dicendo di non sapere**.
2. ✅ **E IL CANTIERE HA FATTO LA COSA GIUSTA NON CORREGGENDOLO.** Lo ha
   misurato, lo ha **dichiarato**, e si è fermato: la decisione vive in
   `shared/`, fuori dal suo mandato, e correggere solo il grafico avrebbe
   lasciato la sezione a dire il contrario **sullo stesso schermo** — la pagina
   che si smentisce da sola, precedente già pagato in Conti. Un cantiere che si
   ferma al confine e scrive perché vale più di uno che «sistema» a metà.
3. ⛔ **E `nomi-liberi` HA PRESO UN DIFETTO DURO NELLA MIA CORREZIONE.** Avevo
   scritto `numeroIt()` nella pagina di Terra, che non ce l'ha: la pagina
   sarebbe **morta al primo tocco**, senza nessun errore di sintassi da vedere.
   Preso **sulla copia del committato**, prima del push. È il caso esatto per
   cui quel controllo è stato stretto il 07/08 — e stavolta la vittima ero io.

## Verifiche
- controprova: rimesso il difetto in `dw-ponti`, la prova cade («atteso
  `misura-zero`, ottenuto `no-misura`»); ripristino **da copia** + `diff -q`
- regola 18 rispettata: **tutti** i lettori dello stato lo coprono (Terra lo
  racconta, Campo lo tratta come prima — dichiarato, non per svista)
- `giro-node` **34 comandi a posto, 0 caduti** sulla copia del committato
- ⚠️ il totale di `run-kpi` **non sale** (1979 prima e dopo) e **non è un test
  inerte**: il contatore conta i blocchi `test()`, non le asserzioni, e le tre
  nuove stanno dentro un blocco esistente. Che girino lo dimostra la
  controprova, **non il numero** — ed è una distinzione che vale la pena
  ricordare, perché la regola di casa «il totale deve salire» vale per i
  blocchi, non per le asserzioni.

## Il contrasto dentro le modali, chiuso col denominatore
Il buco era vero e provato **nei due versi**: sul cammino di `contrasto.mjs`
1.050 testi e **zero** dentro una finestra; aprendone una a mano, 4 testi
misurati subito. Adesso: **89 modali aperte su 186**, 2.182 testi nel tema
scuro, 1.190 per ognuno degli altri due, **un solo** testo sotto soglia in
tutto — quello del core.
⚠️ E il resto è **dichiarato**: il gesto raggiunge 90 finestre su 186 (le altre
vogliono una riga scelta prima), la misura è solo a **430 px**, e i temi chiaro
e sole non esistono su otto superfici. La passata «forzate», che chiuderebbe
gran parte del 90/186, è rimasta in scratchpad: è il candidato più forte per il
passo dopo.

## Prossimo passo atomico
1. Leggere il giro quando finisce (`leggi-giro.mjs`, ordine **età → «non ho
   guardato» → KO veri**). ⚠️ Attesta `c6694e7` con **161** banchi: **non
   contiene** le quattro passate `--modali`, quindi la loro assenza lì non vuol
   dire «il buco è aperto».
2. Portare nel banco la passata **forzate** (90/186 → quasi tutte), e misurare
   il colore delle finestre anche a **390 e 320 px**.

## Blocchi
In attesa del fondatore: **`#vf-ente`** (art. 71 c.11) — l'ultima delle sette
tendine, riconfermata anche oggi dal banco; **quali** delle 47 mancanze
confermate diventino lavoro; e se `disponibilitaTurno` debba restare **100%**
su un turno chiuso in cui nessuno ha registrato fermi.
