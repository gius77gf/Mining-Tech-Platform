# Checkpoint — Genesi 5/9: anche il composito legge il nominale

## Tipo
unit-complete (parziale, dichiarato)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Task completato
**`genesi_composito_<pezzo>.csv` è pulito**, ed era il sospetto più forte dei
cinque rimasti: compone una **forma d'onda campionata**, cioè esattamente il
posto in cui un valore «sporcato apposta» è normale e va distinto da quello di
progetto.
Seguita la variabile a ritroso, come pretende il checkpoint precedente:
`_sigComp = _sigSuperpose(_sigData, _sigDetTimes())` → **`_sigDetTimes()` legge
`D2.holes[].tDet`**, cioè i ritardi del **progetto**, col ripiego che li
ricalcola dai parametri (`c*ritardo + r*ritardoFila`). Nessuno scatter: quello
vive in `buildSim`, su un altro oggetto.
⚠️ E c'è la parte che rende il file leggibile a distanza di mesi: il **nome**
dichiara con che cosa è stato costruito — `<onda>_<n>fori_<ritardo>ms` — quindi
due compositi diversi non si sovrascrivono e chi lo riapre sa su quale ipotesi
è stato fatto. È la stessa regola dei nomi di file già pagata sul core e su
Genesi.

Genesi: **5 su 9**. Puliti finora — piano di carico, riconciliazione, piano
d'innesco XML, composito, e il `.volata.json` (chiuso in precedenza).

## Restano QUATTRO, e sono questi
`genesi_scheda_volata.csv` (2993), `genesi_confronto_AB.csv` (3126),
`genesi_legge_di_sito.csv` (3753) e quello a riga 3908 (il ponte verso
Sentinella, che scrive `CSV_SENT_HEAD` + una riga sola).
⚠️ Nessuno dei quattro è stato guardato: **non sono «probabilmente a posto»**,
sono **non misurati**. La scansione veloce provata sul lotto ha risposto
«nessuna fonte» perché leggeva finestre troppo strette — una risposta vuota, non
un via libera.

## Prossimo passo atomico
`genesi_confronto_AB.csv` (3126): compone `R.map(r=>r.map(v=>csvCell(v===null
||v===undefined?'':v)))` — cioè una **matrice già pronta**, e la domanda è chi
la riempie e se i suoi numeri sono gli stessi che il confronto mostra a schermo.
È il candidato migliore dei quattro perché confronta DUE volate: se una delle
due colonne si costruisce in modo diverso dall'altra, è la copia debole nella
sua forma più difficile da vedere (due metà che sembrano simmetriche).
Poi gli altri tre.

## Stato roadmap
Giro *«chi decide i numeri di ciò che ESCE?»*, dopo una serata:
core 2/2 (1 difetto) · **Flotta 9/9** (4) · **Conti 3/12** (3) · Campo 6/6,
Sentinella 5/5, Terra 3/3, Scudo 5/5 puliti · **Genesi 5/9**.
**Otto difetti veri**, tutti della stessa famiglia e tutti corretti; Flotta e
Conti blindate da due banchi nuovi che aprono i file davvero (`31` e `23`
asserzioni, controprove nei due versi).

## Blocchi
Nessuno.

## Note
Il giro del browser (pid 21084) è vivo da quasi tre ore sulla sua copia. Va
letto con `leggi-giro.mjs` partendo dalla **sezione 0**: il branch è andato
avanti di undici commit stasera, quindi i suoi KO vanno letti come vecchi di
undici commit, non come di adesso.
