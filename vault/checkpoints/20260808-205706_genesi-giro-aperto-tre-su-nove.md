# Checkpoint — Genesi, tre documenti su nove guardati

## Tipo
unit-complete (parziale, e il parziale è dichiarato)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Task completato
Aperto il giro su **Genesi**, l'ultima app del censimento *«chi decide i numeri
di ciò che ESCE?»*. È la più a rischio, perché qui la famiglia ha già avuto la
sua forma peggiore — il file di scambio che portava lo **scatter simulato** al
posto del ritardo nominale.

**Guardati tre punti d'uscita su nove**, e tutti e tre reggono:

1. **`genesi_piano_carico.csv`** — è il vicino di casa del difetto storico,
   perché porta la colonna `ritardo_ms`. Legge `D2.holes`, cioè i fori del
   **progetto 2D**, il cui `tDet` è nominale: lo scatter nasce dentro
   `buildSim` (`f.tNom = f.tDet; f.tDet = f.tDet + gauss*sd`) e vive solo nei
   fori della **simulazione**, che sono un altro oggetto. Il file esce col
   numero che il pannello mostra.
   ⚠️ *Seconda domanda, fatta perché la prima non bastava*: la riga scrive
   `D2.prof`, `D2.kg` e `D2.stem` — i **valori di serie** — per ogni foro, e
   sembrava il caso «il file dice il default dove lo schermo dice il valore
   vero». **Non lo è**: un foro del progetto 2D porta solo la posizione
   (`{mx, my}` più i calcolati), profondità e carica sono globali per
   costruzione, quindi non esiste un valore per foro da perdere. Le colonne si
   chiamano `carica_prog_kg` e `borraggio_prog_m` — «progettata» — ed è
   esattamente quello che sono.
2. **`genesi_riconciliazione.csv`** — `csvRiconciliazione(st)`, funzione del
   modulo: non decide niente in pagina.
3. **`Volata_<n>_<data>.volata.json`** — è il file dove il difetto storico
   viveva, ed è **già chiuso** (sta in `CLAUDE.md` col racconto e la misura).
   Qui non è stato riaperto: contarlo fra i «guardati» sarebbe gonfiare.

## Restano SEI, e vanno detti per nome
`genesi_scheda_volata.csv` (2993), `genesi_confronto_AB.csv` (3126),
`genesi_composito_<pezzo>.csv` (3438), `genesi_legge_di_sito.csv` (3753),
quello col nome in variabile (3908) e **`genesi_piano_innesco.xml`** (4129).
⚠️ L'ultimo è il più delicato dei sei: è un file di **interscambio** verso
detonatori elettronici e software terzi, cioè un file che qualcun altro
**rilegge** — e la regola di casa dice che un file di scambio deve portare il
**nominale**, non il campione. Il segno da cercare è sempre quello: **un numero
con quindici decimali dove lo schermo ne mostra zero**.

## Prossimo passo atomico
**`genesi_piano_innesco.xml` (riga 4129): da quale oggetto prende il ritardo?**
Si risponde in un minuto: se legge `D2.holes[].tDet` è nominale e va bene; se
legge i fori della simulazione (`S.fori`, `buildSim`) porta lo scatter, e allora
è il difetto storico in un secondo file — con l'aggravante che questo lo rilegge
una macchina che spara. Poi gli altri cinque, con la stessa domanda.
Le tre lezioni dei banchi scritti oggi, da riusare:
- ancora d'iniezione **corta** (una riga sola, vecchio comportamento rimesso
  ombreggiando la variabile): quella lunga scade in un'ora e non lo dice;
- **terzo testimone** nel confronto file↔schermo, se no due copie deboli si
  danno ragione a vicenda e la prova resta verde;
- `URL.revokeObjectURL` reso inerte nella pagina di prova, se l'export revoca
  il blob subito dopo il click (se no il banco muore a metà con `Failed to
  fetch`).

## Stato roadmap
Giro *«chi decide i numeri di ciò che ESCE?»*:
core 2/2 (1 difetto) · **Flotta 9/9** (4) · **Conti 3/12** (3) · Campo 6/6,
Sentinella 5/5, Terra 3/3, **Scudo 5/5** puliti · **Genesi 3/9**.
Totale: **otto difetti veri**, tutti della stessa famiglia, tutti corretti e —
per Flotta e Conti — blindati da due banchi nuovi che aprono i file davvero.

## Blocchi
Nessuno.

## Note
Il giro del browser (pid 21084) è vivo da quasi tre ore sulla sua copia
`giro-copia-21084`. Va letto con `leggi-giro.mjs` partendo dalla **sezione 0**
(di quanti commit il branch è andato avanti da quello che il giro attesta — e
oggi sono molti), poi dalle righe «non ho guardato», poi dai KO, separando il
rosso VOLUTO con i marcatori `⚠️ CONTROPROVA` / `FINE CONTROPROVA`.
