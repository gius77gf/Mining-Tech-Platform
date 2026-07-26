# Passo 3 drone — dal fronte ritagliato alla volata (metodo)

Nota di lavoro (non è una feature: è il PIANO del passo 3, così quando il
fondatore mi porta la sua nuvola vera del weekend lo costruisco sulla forma
reale, non a indovinare). Il metodo qui sotto NON dipende dai dati specifici
(è geometria standard di face-profiling); a dipendere dai dati saranno solo le
soglie/tolleranze, che si tarano sul suo caso.

## Input (già disponibile)
Il POC `nuvola-poc.html` esporta il **fronte isolato** come `.xyz` (punti X Y Z,
coordinate reali in metri, già ritagliato coi cursori). È l'output del ritaglio:
solo la faccia della cava, senza il resto della scena.

## Metodo (dalla nuvola al profilo 2D del fronte)
1. **Orientamento della faccia (PCA)**: dai punti del fronte si calcolano gli assi
   principali (PCA/covarianza). La faccia di una cava è ~verticale: l'asse a
   varianza minima ≈ la NORMALE alla faccia; gli altri due danno la direzione
   orizzontale lungo il fronte (strike) e la verticale (~Z). Serve per non
   dipendere da come è orientata la nuvola nel mondo.
2. **Sezione/proiezione**: si proietta ogni punto sul piano verticale (strike, Z).
   Si ottiene una nube 2D "vista di lato" della faccia.
3. **Envelope (profilo)**: si suddivide lo strike in fasce (bin) di ~0,5–1 m; per
   ogni fascia si prende il bordo lato-cava (l'inviluppo dei punti più esterni
   verso il vuoto) → una **polilinea cresta→piede** = il profilo del fronte.
   Robustezza: mediana/percentile nel bin invece del singolo punto estremo (il
   drone consumer fa rumore); bin vuoti interpolati dai vicini.
4. **Cresta e piede**: dal profilo, il punto più alto lato-vuoto = **cresta**, il
   più basso = **piede** (toe). Danno **altezza del fronte** reale e inclinazione.
5. **Burden reale per foro**: posato il foro (dalla maglia di Genesi) a monte della
   cresta, il **burden** a ogni quota = distanza orizzontale foro→profilo. Così il
   burden non è più un numero fisso: segue le rientranze/sporgenze reali della
   faccia (è il valore che i tool seri estraggono dal face-profiling).

## Aggancio a Genesi (motore 2D esistente)
- Il profilo (polilinea) e l'altezza reale alimentano la **scheda 2D** (`D2`): H del
  fronte, inclinazione, e — dove il fondatore lo vorrà — un **burden effettivo** per
  foro al posto del nominale, con AVVERTENZA (resta una stima, il fochino verifica).
- Riuso già pronto: `apps/genesi/pointcloud.js` (parser LAS/PLY/XYZ + pre-shift UTM)
  legge i punti; il passo 3 aggiunge SOLO la parte geometrica (PCA→sezione→envelope),
  che sarà anch'essa una funzione **pura e testabile** (come i parser).

## Limiti onesti (da ripetere al fondatore)
- La **scala** da drone consumer (DJI Mini, senza GCP/RTK) è approssimativa: buona per
  PROGETTARE la volata, non per un consuntivo certificato. Coerente con la filosofia
  Deepwork ("meno preciso, più economico").
- Il **rumore** della nuvola può creare falsi rientri: per questo l'envelope usa
  percentili, non il singolo punto. Le soglie si tarano sul dato vero del weekend.
- Niente auto-magia: il profilo è una **proposta** che l'operatore corregge.

## In parole semplici (per Giuseppe)
Quando mi porti la nuvola del tuo drone, il programma la "guarda di lato", trova la
linea della parete (dalla cresta in alto fino al piede in basso) e misura quanto è
alta e quanto "sporge" davanti a ogni foro. Quella linea diventa la base della
simulazione della volata: non più un fronte finto e diritto, ma la forma vera della
tua cava — con l'avviso che resta una stima, non una misura da geometra. Lo costruisco
appena provi il caricatore (col `.las` che ti dà ODM) e mi dici com'è venuta la nuvola.

## Prossimo passo atomico (quando c'è il dato reale)
Implementare `fronteProfilo(pos)` in un modulo puro (PCA → sezione → envelope a bin
con percentile) + test in CI su una faccia sintetica; poi collegarlo alla scheda 2D
di `genesi.html` dietro un pulsante, con l'avvertenza.
