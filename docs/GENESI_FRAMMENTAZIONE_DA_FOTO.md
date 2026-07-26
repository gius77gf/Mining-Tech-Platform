# Genesi — frammentazione da foto: si può fare? (documento per la decisione)

Documento per Giuseppe (fondatore). Domanda concreta: i competitor stimano la
**pezzatura del cumulo (muckpile) da una fotografia** (Split-Desktop, WipFrag,
Strayos, Motion Metrics PortaMetrics). **Possiamo farlo anche noi, solo nel
browser, senza backend e senza spese?** E con che affidabilità, onestamente?

## Risposta in una riga
La **parte tecnica** (riconoscere i sassi in foto e calcolare una curva) si può
far girare **tutta nel browser**. Ma una stima **"carica una foto e hai la
granulometria esatta", in un clic, senza taratura, è strutturalmente poco
affidabile** — e lo è *anche per i leader di mercato*. Quindi: **fattibile sì,
"misura affidabile in un clic" no.** Spacciarla per misura sarebbe esattamente la
gonfiatura che vogliamo evitare.

## Perché non è affidabile "in un clic" (è fisica, non è codice scadente)
Da una **foto 2D** non si vede quello che conta di più:
- **I sassi piccoli (i fini)** cadono dietro e tra quelli grandi, o sono troppo
  piccoli da vedere → vengono **sistematicamente sottostimati**.
- **L'interno del cumulo** non si vede: la foto misura solo la superficie, che
  non è un campione rappresentativo.
- **Ombre, luce, inclinazione, messa a fuoco** creano bordi falsi.
- Serve **una scala** (un oggetto di dimensione nota nella foto), altrimenti non
  si sa quanto è grande un sasso.

Numeri tipici di errore documentati in letteratura (vagliatura = riferimento vero):
- **Fini sottostimati di circa il 20%** sul totale, ma nelle classi più fini
  l'errore arriva al **30–100% e oltre**.
- **Pezzatura media (x50) sovrastimata di circa il 50%** se non corretta; scende
  al 2–16% **solo dopo taratura** contro vagliatura.

## Cosa fanno davvero i competitor (nessuno fa "un clic e via")
- **Split-Desktop / WipFrag**: chiedono **oggetto di scala** e **taratura su
  vagliatura** (≥3 campioni); permettono la **correzione manuale** dei bordi.
- **Motion Metrics PortaMetrics**: usa **tre telecamere (stereo 3D)** — hardware,
  non solo software — per avere la scala senza oggetto di riferimento.
- **Strayos**: AI **+ correzione a mano** dei singoli sassi.

Morale: perfino i leader (a) chiedono taratura, oppure (b) usano telecamere 3D,
e (c) prevedono **correzione umana**. Il loro vantaggio non è "gira nel browser":
è la **taratura, il 3D e i dati** dietro.

## Cosa possiamo fare — ordinato per fattibilità e onestà

### (a) SUBITO, nel browser, senza mentire — misura ASSISTITA
L'operatore **delimita** i frammenti e **posiziona la scala** (oggetto noto); il
tool calcola area → curva → x50 → uniformità, e la sovrappone alla curva Kuz-Ram
che Genesi già prevede. Con **etichetta chiara**: *"stima assistita da immagine,
NON vagliatura; i fini sono sottostimati; per numeri quantitativi va tarata"*.
- È la stessa filosofia del **confronto con misure reali** che abbiamo appena
  aggiunto (l'operatore dà le misure, il dato è reale, il tool confronta).
- Tecnica: opzionale **OpenCV.js** (watershed) per *aiutare* il tracciamento;
  binario ~6–9 MB caricato solo quando serve. Il resto è geometria in JS.
- **Perché onesto**: l'utente vede che sta misurando lui; il tool non finge
  un'accuratezza che non ha. Coerente con Genesi = simulatore didattico.

### (b) Richiede un modello ML (esistono open, ma con avvertenze)
Un modello come **MobileSAM** (open, ~decine di MB, gira offline nel browser via
WebGPU/CPU) **aiuta a riconoscere i bordi** dei sassi meglio del watershed: l'utente
dà un tocco, il modello propone la maschera, l'utente corregge. **MA non risolve
la fisica**: scala, fini e profondità restano un problema → resta **stima**, non
misura. Da tenere come **upgrade futuro opzionale** (caricato solo su richiesta),
non un "quick win".

### (c) Richiede davvero un backend o hardware (e quindi spese) — NON ora
L'accuratezza "da leader" (errori bassi e affidabili) richiede **taratura su
dataset di vagliatura**, **telecamere 3D**, e/o un **modello addestrato sul tipo
di roccia del cliente**: tutto ciò significa training, dataci pesanti, GPU →
**backend con costi**, che hai deciso di non sostenere prima della
commercializzazione. In più, se un domani si raccolgono **foto reali dei clienti**
(concorrenti tra loro), le immagini vanno **isolate per organizzazione** — un
motivo in più per rimandare qualsiasi backend.

## Dove sarebbe FUORVIANTE (da NON presentare come misura)
1. "Carica una foto → ecco la curva" senza scala e senza correzione: numeri
   sbagliati soprattutto su fini e x50.
2. La **percentuale di fini** dalla sola immagine: sbagliata in modo sistematico.
3. Un **confronto col vaglio** senza aver tarato: farebbe sembrare Genesi "al
   livello di Split/WipFrag" quando non lo è.

## Raccomandazione
- **Fare (a)**: rifinire la *misura assistita* onesta, con etichette esplicite sui
  limiti. In-browser, zero costi, coerente con Genesi. Piccolo e sicuro.
- **Tenere (b)** (MobileSAM) come upgrade futuro dietro caricamento su richiesta —
  **da decidere tu**, perché aggiunge peso e complessità per un risultato che
  resta "stima".
- **Rimandare (c)** alla fase di commercializzazione (serve spesa/decisione tua).

**Serve la tua decisione**: procediamo con (a) come prossimo passo Genesi? E vuoi
che (b) resti in roadmap come "eventuale, più avanti"?

---
### Fonti (verificare il testo integrale prima di un uso commerciale; alcune pagine accademiche bloccano il download automatico)
- Split-Desktop + Kuz-Ram, accuratezza/bias fini: https://www.ajol.info/index.php/gm/article/view/211038
- "What's new with Split-Desktop": https://miningandblasting.wordpress.com/wp-content/uploads/2009/09/whats_new_with_split-desktop.pdf
- Accuratezza misura da immagine (errore cresce verso i fini), Springer 2007: https://link.springer.com/article/10.1007/s00603-007-0161-8
- WipFrag, errori inerenti e fini mancanti (Maerz/Palangio): https://web.mst.edu/~norbert/pdf/FRAGBL4.pdf
- Report DiVA (errori di acquisizione): https://www.diva-portal.org/smash/get/diva2:990302/FULLTEXT04.pdf
- Calibrazione sistemi ottici (Maerz): https://web.mst.edu/~norbert/pdf/syssme.pdf
- SAM per frammenti post-volata, supera Split-Desktop V4 (Minerals 2024): https://doi.org/10.3390/min14070654
- SAM in-browser (Meta): https://github.com/facebookresearch/segment-anything
- SAM2 in-browser (WebGPU+ONNX): https://medium.com/@geronimo7/in-browser-image-segmentation-with-segment-anything-model-2-c72680170d92
- MobileSAM (dimensioni/perf): https://docs.ultralytics.com/models/mobile-sam
- OpenCV.js watershed (browser): https://docs.opencv.org/3.4/d7/d1c/tutorial_js_watershed.html
- WipFrag FAQ (taratura, auto-scale): https://wipware.com/wipfrag-4-faq/
- Motion Metrics PortaMetrics (stereo 3D): https://www.motionmetrics.com/portametrics/
- Strayos Fragmentation AI (editing nodi): https://help.strayos.com/hc/en-us/articles/14155189384595-Fragmentation-AI-Customizing-Particle-Size-Ranges-and-Editing-Individual-Rock-Nodes
