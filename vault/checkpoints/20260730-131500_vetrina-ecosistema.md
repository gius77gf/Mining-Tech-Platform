# Checkpoint — la vetrina dell'ecosistema, per la presentazione al cliente

- **Tipo**: richiesta urgente del fondatore (presentazione di domani)
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: (aggiunto sotto dopo il commit)

## Cosa ha chiesto il fondatore

Una schermata di presentazione con tutte le app, più accattivante e «del giusto
livello», il prima possibile, usando più agenti in parallelo.

## Da dove si partiva

`apps/index.html`: 103 righe, una griglia di riquadri di **solo testo**. Diceva
cosa c'è; non faceva capire che livello è.

## Tre cantieri in parallelo

1. **Anteprime** — ha esplorato tutte e otto le superfici, scelto per ognuna la
   schermata più densa e catturato telefono + scrivania a doppia risoluzione,
   guardando davvero gli scatti e ripetendo quelli venuti male.
2. **Testi** — ha letto il codice app per app e scritto titolo, apertura, nove
   schede (cos'è, descrizione, tre punti forti, a chi serve), quattro ponti e
   la chiusura. Ogni affermazione ha in fondo al file la riga di codice da cui
   viene. Ha anche **escluso** tre cose che non poteva sostenere.
3. **Ricerca estetica** — cinque riferimenti veri (Linear, Deswik, Hexagon,
   Procore, Stripe) e una specifica di 686 righe. Da lì due idee entrate in
   pagina: **raggruppare per fase del lavoro** invece che in fila, e la
   **miniatura disegnata** al posto della lettera gigante.

## Cosa c'è adesso in pagina

- **Apertura** con marchio, claim, i numeri dell'ecosistema e un **ventaglio di
  tre telefoni** con schermate vere (Scudo, Terra, Conti): fa vedere il
  prodotto nei due secondi che uno concede.
- **Nove schede**, ognuna con **l'anteprima vera dell'app**, la sua tinta presa
  dalla palette reale — non un colore inventato in questa pagina — su bordo,
  alone e nome, con il fondo sempre della famiglia Deepwork.
- **Quattro famiglie**: la roccia, il cantiere, l'azienda, la base. La griglia
  usa `auto-fit`, così una famiglia da due riempie la riga invece di lasciare
  un buco.
- **Sezione sui ponti**: le quattro cose che nessuno strumento saprebbe fare da
  solo. È l'argomento più difficile da copiare, e prima non era scritto da
  nessuna parte.

## Quattro difetti trovati guardando, non leggendo

1. L'alone d'apertura **allargava la pagina**: sul telefono compariva lo
   scorrimento laterale.
2. **Tre schede su nove non comparivano**: l'animazione d'ingresso parte da
   «invisibile» e l'osservatore non era scattato. Ora c'è una rete di sicurezza
   che dopo un secondo e mezzo mostra tutto comunque — meglio un'animazione
   persa che un pezzo di pagina mancante.
3. Le famiglie da due app restavano **schiacciate a sinistra**.
4. I telefoni del ventaglio, lasciati liberi di crescere, sbordavano in su e
   **coprivano i due bottoni**. L'altezza va dichiarata.

## Peso e verifiche

Dieci anteprime in scheda + tre da telefono: **392 kB in tutto**, catturate a
1600 px e riportate a 760 (il doppio della scheda più larga sul telefono).
Caricamento pigro, misure dichiarate nel markup perché la griglia non balli, e
se un'immagine non arriva si toglie da sola e resta la miniatura disegnata.

`run-stile` 114 passati (la vetrina è entrata nell'elenco delle superfici);
contrasto misurato su **107 testi**, nessuno sotto soglia; nessuno scorrimento
laterale né sul telefono né sullo schermo grande; nessun errore di pagina.

## Prossimo passo atomico

Sul telefono la pagina è lunga **6.800 px**: nove schede una sotto l'altra, e
per arrivare ai ponti si scorre a lungo. Va misurato quanto ci mette una
persona ad arrivare in fondo e va accorciata la lettura — prima ipotesi da
provare (e da verificare a schermo, non da dare per buona): sul telefono
l'anteprima più bassa e i tre punti forti che compaiono solo al tocco.

## Bloccanti

- Nessuno su questa unità.
- Da chiarire col fondatore, a voce, prima della presentazione: perché ci sono
  sia Deepwork sia Genesi, che sulla progettazione si sovrappongono.
