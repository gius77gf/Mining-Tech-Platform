# Checkpoint — 2026-08-26T08:02:09Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
adfa8179

## Domanda del fondatore
«Puoi fare in modo che la vetrina giri anche offline? Mi pare che tutte le app
dovrebbero essere in grado di farlo, in questo modo dovrebbe essere anche più
fluida.»

## La premessa era mezza vera, e l'ho misurata invece di crederci
Censite le dieci superfici:
- **otto hanno il manifest** (quindi si installano sul telefono);
- **due sole hanno un service worker**: il core (`/sw.js`) e Genesi.
Cioè le sei app verticali si installano e poi hanno bisogno della rete lo
stesso. La vetrina non aveva né l'uno né l'altro: staccando la rete era una
**pagina bianca**.

⚠️ E non bastava il service worker del **core**, che pure ha la radice come
ambito e quindi controlla anche `/apps/`: misurato aprendo prima il core (col
finto Firebase, se no non parte) e poi la vetrina — service worker attivo con
ambito `/`, e la vetrina offline **ancora bianca**. Il suo ripiego di
navigazione riporta a `./index.html`, che dalla sua posizione è il core.

## E «più fluida» è vero solo per una metà, misurata
Netlify manda `cache-control: public, max-age=0, must-revalidate` su **tutto**,
immagini comprese. Alla riapertura i byte non si riscaricano (la validazione
risponde **304 con zero byte**, verificato), ma il browser deve chiedere una
per una **148 immagini** prima di mostrarle.

Misurato in laboratorio, riaprendo la pagina:
- **senza** service worker: 50 risorse servite dalla rete;
- **con**: **zero**.

⚠️ Il tempo a schermo, lì, non è cambiato — e va detto: il server di prova è
locale e senza latenza, quindi 50 andate e ritorni costano niente. Su un
telefono in cava sono esattamente il posto dove se ne vanno i secondi.
⛔ E la parte che NON cambia: la scorrevolezza dell'animazione. Quella è CPU, e
sta già a 16,7 ms per fotogramma. Un service worker non la tocca.

## Fatto
1. **`apps/sw.js`** — service worker della vetrina. Precarica lo *scheletro*
   (pagina + marchio, ~133 KB); le immagini entrano in cache **man mano che si
   vedono**. Ragione scritta nel file: precaricare tutto vorrebbe dire 12,8 MB
   in faccia a chi apre per la prima volta, magari col telefono in cava.
   - immagini → **cache per prima**: il nome è l'impronta del contenuto, quindi
     quel file non cambierà mai;
   - pagina → **rete per prima**, cache come ripiego: cambia allo stesso
     indirizzo a ogni deploy, e servirla dalla cache mostrerebbe per giorni una
     versione vecchia a chi la rete ce l'ha;
   - **gestore stretto**: un service worker in `/apps/sw.js` ha per ambito
     `/apps/`, cioè controlla anche `/apps/terra/` e le altre. Su tutto ciò che
     non è la vetrina non si chiama `respondWith`, e il browser fa quello che
     avrebbe fatto senza di noi.
2. **`netlify.toml`** — `max-age=31536000, immutable` per `/apps/img/*`. Vale
   perché quei nomi sono impronte del contenuto; **non** si estende alle
   pagine, dove `must-revalidate` è ciò che fa arrivare subito una correzione.
3. **`senza-rete.mjs`** — il righello, con la controprova.

## Tre errori miei prima che reggesse
1. **L'iniezione della controprova non iniettava niente**: la regola cercava un
   indirizzo che finisce in `apps/index.html`, ma la pagina si apre da `/apps/`
   — la cartella. Service worker ancora attivo, controprova che diceva «regge
   lo stesso». Terza delle cinque cause; adesso il righello **conta** le
   sostituzioni e si ferma se sono zero.
2. **Il criterio non distingueva**: chiedeva testo, otto nomi e i collegamenti,
   e senza service worker passavano comunque, perché il browser si ritira fuori
   il **documento** dalla sua cache. A cambiare erano le immagini: **88
   contro 0**. Il criterio adesso le comprende — più severo, non più permissivo.
3. **Ho chiuso un commento a metà** scrivendo dentro un blocco `/* … */` una
   glob che contiene due asterischi e una barra: quella sequenza chiude il
   commento, e il resto diventava codice. È la trappola già scritta nelle
   istruzioni — un esempio di codice dentro un commento va scritto senza i suoi
   delimitatori.

## Verifica
Giro node **37/37, 3.282 asserzioni**. Catena della vetrina: marchio 6/6, tour
vivo 7/7, tour aperto 9 app su 9, **senza rete 6/6** — e la controprova 2/2,
cioè col service worker tolto il righello vede che non regge.

## Prossimo passo atomico
Portare a `main`. Poi, se il fondatore vuole: **le sei app verticali si
installano ma non hanno un service worker**. Per loro non basta copiare questo
— i loro dati vivono su Firestore, e l'offline vero lì è la persistenza di
Firebase, che è un cantiere a sé e va deciso con lui.

## Blocchi
Nessuno.
