# Checkpoint — 31/07/2026 03:45 UTC

## Task completati
**Le prove sui buchi entrano nella suite permanente**, la descrizione della PR
torna al passo col ramo, e una verifica che mancava sulla guardia dei campi interi.

| Commit | Cosa |
|---|---|
| `5165097` | Le 17 asserzioni sui buchi in `run-kpi.mjs`, col motore che espone la geometria |
| — | Descrizione PR #322 riscritta (155 commit) e sweep con la tastiera su sei app |

## Il browser serve per SCOPRIRE, non per tenere chiuso
Le prove sui buchi difendevano una correzione in `shared/` — codice che usano sei
app — e vivevano nello **scratchpad**: alla prossima sessione non ci sarebbero
state. Ma giravano nel browser, mentre la suite gira con `node` e senza rete.

La soluzione non era portare Playwright nella suite: `tratti` e `percorso`
prendono **numeri** e restituiscono una **stringa**. Il motore le espone ora in
`dwGrafici.geometria`, con scritto accanto perché — la regola dei buchi è una
decisione di prodotto, non un dettaglio di disegno. Il motore è uno script
classico, quindi si carica con `createRequire`.

Controprova fatta rimettendo la vecchia implementazione nel file vero: la suite
diventa rossa su due prove, e una di esse rifà a mano la vecchia logica proprio
per spiegare **perché** era sbagliata.

## Una verifica che mancava, e il rischio che copriva
La guardia sui campi interi è un ascoltatore su `beforeinput` montato su **sette**
superfici: intercetta ogni battuta in ogni campo numerico della piattaforma. Avevo
provato che ferma la virgola e lascia passare le cifre **mandando eventi**, ma non
che l'inserimento normale funzionasse ancora **davvero**, girando le app.

Fatto: 15 campi interi visibili in sei app, digitando con la tastiera, girando
tutte le sezioni di ognuna. Tutti accettano «12», zero errori di pagina.

Un limite dichiarato: in **Genesi** i 12 campi interi vivono tutti dentro modali e
sezioni non visibili dall'esterno, quindi lì la guardia resta verificata solo per
montaggio e non per digitazione. Non è un difetto noto, è una copertura che manca:
scritto qui perché la prossima volta si sappia dove guardare.

## La descrizione della PR
Era rimasta a 138 commit mentre il ramo è a 155, e — la cosa che contava — elencava
ancora **P2 fra le cose che mancano**, mentre è finito e va nei due sensi. Aggiunti
il quinto ponte con le sue tre ragioni, la decisione su `shared/dw-ponti.js`, il
grafico nuovo, la correzione dei buchi, le regole 4–7 e i conteggi veri delle
suite. Il fondatore legge quel testo per decidere il merge: lasciarlo dire il falso
su un ponte finito era la cosa peggiore da lasciare lì.

## Stato
Suite: **292 KPI**, **72 stile**, 7 demo, 43 helper, 23 pointcloud, 9 manifest.
Tutte verdi, e la CI su GitHub è verde su entrambi i job.

## Prossimo passo atomico
**Seconda iterazione sul lato Campo del ponte** — ne ha **una**, e la direttiva
chiede almeno tre. Con lo stesso metodo che sul lato Terra ha trovato quattro
difetti: renderizzare gli stati che non ho mai visto, servendo un modulo dati
modificato per intercettazione, e **guardarli**.

Gli stati da mettere a schermo, in ordine:
1. **Terra non raggiungibile** (`rilieviTerra` che torna null): oggi la sezione
   sceglie di non dire niente. Va guardato che il vuoto non lasci un buco strano
   fra «Produzione di oggi» e la lista dei rapportini;
2. **nessuna autorizzazione con materiale**, quindi nessuna densità: c'è un ramo
   che rimanda a Terra, e non l'ho mai visto renderizzato;
3. **un rilievo solo** (nessun intervallo): la sezione tace, va verificato;
4. **lo scarto grosso**, per leggere la frase senza rimprovero nel caso in cui
   conta davvero — quando i numeri non tornano;
5. **i viaggi dentro il periodo**, che aggiungono la coda «nel conto non entrano i
   viaggi»: da rileggere a schermo, perché è una frase che si incastra in fondo a
   un'altra e potrebbe risultare confusa.

Da guardare anche, con la sezione accanto al riferimento: sul lato Terra ci sono
**tessere e un grafico**, qui solo una nota di testo. Va deciso se è giusto — la
schermata dei rapportini è un posto di lavoro, non un quadro di controllo, e
riempirla di tessere la peggiorerebbe — oppure se manca almeno il numero in
evidenza. La risposta va **scritta**, non lasciata implicita.

Restano aperti e già scritti: la larghezza dei comandi di Scudo (36–38 px invece
di 44, compromesso misurato), il badge dell'idoneità (caso che la WCAG 2.5.8
esenta), e i tre punti che aspettano il fondatore — progetto Firebase (10
minuti), permessi per ruolo, blocco del turno chiuso lato server.
