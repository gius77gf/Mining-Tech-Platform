# Checkpoint — 2026-08-09T04:27:11Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`8f83dd9`

## Task completato

**La riverifica dei 20 KO del giro, completa** — tutti e venti guardati sul
commit di adesso, ciascuno col banco che li ha prodotti **e coi flag della sua
riga**. Esito: **2 chiusi, 18 ancora veri**.

| fronte | quanti | stato |
|---|---|---|
| CSV dei costi di Conti | 2 | ✅ **chiusi** dal lavoro sulle voci senza importo |
| tendine di Scudo | 5 | ⛔ veri |
| foglio di turno di Campo (`--live`) | 3 | ⛔ veri |
| frasi della nuvola di Genesi | 4 | ⛔ veri |
| stati «non misurato» di Campo | 2 | ⛔ veri |
| tendina di Sentinella | 2 | ⛔ veri (sfora di **6 px**) |
| barre di peso di Conti | 1 | ⛔ vero |
| manina di Campo | 1 | ⛔ vero |

## Le tre cose imparate

1. ⛔ **UN KO SI RIVERIFICA CON LA PASSATA CHE L'HA PRODOTTO, NON COL BANCO.**
   `campo-foglio-turno` di serie dà **35 passati, 0 falliti**: per un momento
   quei tre sembravano chiusi. Cade la variante **`--live`** (32/3), che finge i
   dati veri — e dice che con i dati veri la consegna `.txt` **continua a
   dichiararsi fatta di dati d'esempio**. Il nome della riga nel registro
   («foglio di turno · **coi dati veri tace**») porta quel dato apposta, e va
   letto per intero.
2. ⛔ **IL CASO PIÙ PICCOLO È QUELLO CHE DECIDE IL DISEGNO — e ha detto di no.**
   Ho aperto per primo il KO col margine minimo (Sentinella, **6 px**) proprio
   per scegliere la strada senza rischiare una schermata di conformità. Tre
   fatti letti nel codice: l'autore **lo sapeva già** (il commento dice
   «etichette corte… un dato tagliato non si legge»), quello che sfora è **dato
   dell'utente** (il nome del punto di misura, senza lunghezza massima), e il
   «suggerimento sotto» che avevo ipotizzato per Scudo **esiste già lì**
   (`#ppv-info`) — e il banco cade lo stesso.
   Quindi la famiglia **non si chiude accorciando il testo**: la domanda «la
   voce scelta si legge tutta a tendina chiusa» è fallibile da un nome
   abbastanza lungo, su qualunque app. Le due uscite (accettare il taglio
   quando il dato intero è leggibile accanto; oppure cambiare il campo) toccano
   uno **standard** e un **pezzo d'interfaccia**: si portano al fondatore con
   la misura, non si prendono di slancio.
3. ⛔ **QUESTO PUNTO ERA SBAGLIATO, E LA CORREZIONE VALE PIÙ DELL'OSSERVAZIONE.**
   Avevo scritto che `promesse-tocco` «dice quante ma non dice quale», e che il
   KO non era lavorabile senza modificare il banco. **Falso**: il banco stampa
   la riga colpevole — `⛔ campo — nav-att: [item.pon-voce.st-danger] «Frantoio
   primario Intasame»` — solo che la stampa **dopo** il ciclo, insieme a tutti
   i dettagli, e il mio `head -12` l'aveva tagliata via.
   È la **quinta volta** stanotte che lo strumento aveva ragione e a sbagliare
   era il modo in cui l'ho letto o misurato (il foglio di Scudo, `quantiMesi`,
   le ore motore di Flotta, la manina di Conti, e adesso questa). La forma è
   sempre la stessa: **guardo un pezzo dell'uscita e concludo sul tutto.**
   ⚠️ E il costo di non correggerlo sarebbe stato concreto: il «prossimo passo
   atomico» che avevo scritto era *modificare il banco*, cioè mezz'ora di
   lavoro su un difetto che non esiste, invece dei due minuti che servono per
   aprire la riga che il banco nomina già.

## Il tentativo che è stato ripristinato
La correzione delle tendine di Scudo: scritta, provata in scratchpad su sei
casi (tutti corretti), messa nella pagina — e il banco ha ridato gli **stessi 5
KO**. `docOrd` non sono i verbali, è **tutti** i documenti: il prefisso comune
era vuoto e la funzione faceva correttamente niente. Avevo **dedotto la premessa
dai KO** invece di leggerla dal codice. Ripristinato: un codice che
misurabilmente non fa niente, in una modale di conformità, è peggio del difetto
aperto.
⚠️ E nel farlo il giro `node` ha preso in tre secondi un errore **duro**: avevo
aperto un suggerimento come **template literal** lasciandogli la chiusura a
**singolo apice** — la stringa non si chiudeva e il parser moriva 300 righe
dopo, su una riga sana.

## Verifiche
- ogni fronte riverificato col suo banco: `conti-documenti-che-escono` 81/0 ·
  `modali-dentro --solo=scudo` 5 KO · `campo-foglio-turno --live` 32/3 ·
  `punti-nuvola` 4 KO · `conti-barre-peso` 1 KO · `stati-non-misurati` 2 KO ·
  `promesse-tocco` 1 · `modali-dentro --solo=sentinella` 2 KO
- `sintassi-pagine` 34/0 · albero pulito · tutto spinto

## Prossimo passo atomico
**La manina di Campo, che il banco nomina già**: sezione `nav-att`, riga
`.item.pon-voce.st-danger` «Frantoio primario Intasame» — una voce che mostra
la manina e non fa niente. Poi, in ordine di lavorabilità: le **4 frasi della
nuvola di Genesi** e i **2 stati «non misurato» di Campo**, che sono difetti di *testo* e non di layout,
quindi non dipendono da nessuna decisione di standard.
⛔ **Ferme in attesa del fondatore**: le 7 tendine tagliate (Scudo 5 +
Sentinella 2) — serve scegliere fra accettare il taglio col dato leggibile
accanto o cambiare il campo; e `#vf-ente`, che è il termine dell'art. 71 c.11.

## Blocchi
Nessuno di tecnico. Due decisioni di prodotto in attesa, dichiarate qui sopra.
