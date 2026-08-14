# Checkpoint — da ogni app si torna indietro, e ora c'è chi lo controlla

- **Tipo**: correzione per la dimostrazione dal vivo + banco nuovo
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `a89f25d`

## Il difetto

**Genesi era l'unica app senza il ritorno all'ecosistema.** Da lì, in una
dimostrazione, si restava chiusi dentro: per tornare alla vetrina serviva il
tasto indietro del browser. Tutte le altre sette hanno il bottone `.dw-home` in
alto a destra; Genesi ha una sua struttura (schermata a tutto schermo con la
barra in basso) e quel bottone non c'era mai arrivato.

Aggiunto con la stessa forma, la stessa posizione e le stesse misure delle
altre, nella tinta di Genesi, ancorato alla sua schermata di casa.

## Il banco: `tests/browser/vetrina-collegamenti.mjs`

Apre la vetrina, segue **tutti e nove i riquadri** e per ognuno pretende:

1. la pagina risponde;
2. la pagina **monta davvero** qualcosa — non basta lo stato 200: una pagina che
   va in errore nel proprio programma risponde 200 e resta vuota, come il core
   senza Firebase;
3. da lì si torna all'ecosistema con un comando **visibile**.

**35 asserzioni, tutte a posto.** Con `--senza-ritorno` il banco toglie il
comando da ogni app e pretende di fallire: **sette bocciature su sette**.

Nessun test esistente poteva vedere questa famiglia di difetti: i collegamenti
sono `href`, e un `href` sbagliato non fa fallire niente.

## Una soglia mia, sbagliata

La prima versione chiedeva più di quaranta elementi per dire «la pagina è viva»,
e bocciava **Deepwork ID**, che ne ha trentasette ed è esattamente la pagina che
deve essere: un modulo d'accesso. Non ho abbassato la soglia — ho cambiato la
domanda: una pagina è viva se ha del testo **e** qualcosa con cui si
interagisce, un modulo da compilare oppure un'interfaccia montata.

## Due eccezioni dichiarate

Il core si apre sulla schermata d'accesso ed è quello che deve fare; Deepwork ID
è la porta d'ingresso, non una stanza da cui uscire. Sono scritte nel banco, non
lasciate implicite.

## Stato delle suite

`run-kpi` 325 · `run-stile` 114 · `run-helpers` 43 · `run-demo` 7 ·
`run-manifest` 9 · `run-pointcloud` 23 — tutte a zero falliti.

## Prossimo passo atomico

Sul telefono la vetrina è lunga **6.800 px**. Prima di accorciarla va **misurato**
quanto si scorre per arrivare ai ponti, che sono l'argomento più forte: se
stanno oltre il quinto schermo, quasi nessuno li vedrà. Prima ipotesi da
verificare a schermo: portare i ponti **prima** della griglia delle app, o
riassumerli in una riga nell'apertura.

## Bloccanti

- Nessuno su questa unità.
- Da chiarire col fondatore a voce prima della presentazione: perché ci sono
  sia Deepwork sia Genesi.
