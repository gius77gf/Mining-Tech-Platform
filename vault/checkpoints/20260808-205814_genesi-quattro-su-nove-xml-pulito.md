# Checkpoint — Genesi 4/9: anche il piano d'innesco XML regge

## Tipo
unit-complete (parziale, dichiarato)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Task completato
**`genesi_piano_innesco.xml` — il più delicato dei nove — è pulito.**
Era il candidato numero uno: è un file di **interscambio** verso i software dei
detonatori elettronici, cioè un file che qualcun altro **rilegge**, ed è
esattamente il posto dove la regola di casa dice che deve uscire il **nominale**
e non il campione.
Due risposte, tutt'e due giuste:
- **la fonte**: legge `D2.holes`, i fori del progetto 2D, il cui `tDet` è
  nominale. Lo scatter nasce in `buildSim` e vive solo nei fori della
  simulazione, che sono un altro oggetto;
- **chi compone**: `xmlPianoInnesco(...)`, funzione del modulo — spostata lì il
  03/08 proprio perché era un blocco anonimo in pagina, *«un file che esce
  dall'azienda, e verso software di TERZI, che nessuna prova poteva chiamare
  perché non aveva un nome»*.

Genesi passa a **4 su 9**: piano di carico, riconciliazione, piano d'innesco XML
e il `.volata.json` (già chiuso in precedenza).

## ⚠️ E i cinque che restano NON sono stati decisi — la scansione veloce ha fallito, e va detto
Ho provato a chiudere il censimento con una scansione a finestra sui cinque
rimasti (`genesi_scheda_volata`, `genesi_confronto_AB`, `genesi_composito`,
`genesi_legge_di_sito`, quello a riga 3908) cercando da quale oggetto leggono.
**La finestra era troppo stretta**: quegli export leggono da variabili assegnate
più in alto, fuori dalle venti righe guardate, e infatti la scansione ha
risposto «nessuna fonte» su tre di loro — che è una risposta vuota, non un via
libera.
Sono **esattamente** il controllo che dice «pulito» perché non ha guardato dove
crede. Restano **aperti**, e chi li riprende deve seguire l'assegnazione della
variabile a ritroso invece di leggere il solo corpo dell'export.

## Prossimo passo atomico
I cinque export rimasti di Genesi, uno per uno, seguendo **a ritroso** da dove
viene l'oggetto che iterano. La domanda è sempre la stessa e ha un segno
riconoscibile: **un numero con quindici decimali dove lo schermo ne mostra
zero** — non è precisione, è un campione scappato dal suo recinto.
Il sospetto più forte è `genesi_composito_<pezzo>.csv`: è l'unico dei cinque in
cui la scansione ha trovato qualcosa (`D2.ritardo`), e compone una forma d'onda
campionata — cioè il posto dove un valore «sporcato apposta» è normale e va
distinto da quello di progetto.

## Stato roadmap
Giro *«chi decide i numeri di ciò che ESCE?»*:
core 2/2 (1 difetto) · **Flotta 9/9** (4) · **Conti 3/12** (3) · Campo 6/6,
Sentinella 5/5, Terra 3/3, Scudo 5/5 puliti · **Genesi 4/9**.
**Otto difetti veri**, tutti corretti; Flotta e Conti blindate da due banchi
nuovi che aprono i file davvero.

## Blocchi
Nessuno.

## Note
Il giro del browser (pid 21084) è vivo da quasi tre ore. Da leggere con
`leggi-giro.mjs`: sezione 0 (età), righe «non ho guardato», poi i KO.
