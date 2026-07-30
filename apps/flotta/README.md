# Flotta

App mezzi & manutenzione. Buyer: responsabile mezzi.

Sei schermate: **Quadro · Giro · Mezzi · Officina · Scadenze · Costi**.

## Cosa c'è dentro

- **Quadro** — numeri di testa, disponibilità della flotta, scadenze di
  legge, giro macchina di oggi e priorità operative (tutto ciò che è
  scaduto o sta per scadere, in un elenco solo).
- **Giro** — *controllo pre-uso*: l'operatore sceglie il mezzo, risponde a
  una checklist che cambia col **tipo di mezzo** e salva. Tre tocchi quando
  va tutto bene («segna tutto a posto» + salva). Ogni voce **«non va»**
  diventa una **manutenzione aperta sul mezzo**; se la voce è di sicurezza
  l'app propone di fermare la macchina.
- **Mezzi** — parco, stati, ore motore, import/export CSV, e per ogni mezzo
  la **scheda** (libretto macchina) con dati, scadenze, tagliandi, storico
  interventi, **fermi**, giri e consumi: si stampa e si esporta. Qui vivono
  anche i **fermi macchina**: da quando a quando una macchina non ha potuto
  lavorare e perché, da cui esce la **disponibilità reale** (giorni-macchina
  persi sui giorni-macchina disponibili), la classifica dei mezzi che si
  fermano di più e quella delle cause.
- **Officina** — manutenzioni a data o a ore motore, con **piani
  ricorrenti** (250/500/1000/2000 h, oppure a mesi) che alla chiusura
  ripianificano da soli il tagliando successivo; registro interventi;
  magazzino ricambi. Ogni manutenzione si apre come **ordine di lavoro**:
  stato (*da fare → in lavorazione → in attesa ricambi → chiuso*),
  **manodopera** (chi, quante ore, a quanto l'ora — una riga per persona),
  **ricambi** consumati con quantità e prezzo, altre spese. Il costo non si
  scrive: si somma dalle righe, e alla chiusura scarica il magazzino, entra
  nel registro interventi e nei costi della flotta. Da quei consumi veri esce
  anche **quanto tenerne a scorta**: pezzi usati al giorno × (giorni di
  consegna del fornitore + margine), con la lista della spesa esportabile.
  Un ricambio mai usato non ha nessuna proposta, e l'app lo dice.
- **Scadenze** — scadenzario di legge del mezzo, con le voci già pronte e
  il riferimento normativo.
- **Costi** — voci di spesa, ripartizione e andamento mensile, più il
  **carburante per mezzo**: rifornimenti con le ore del contatore da cui
  l'app calcola **litri/ora** ed **euro/ora**.

## Dati (Firestore, sotto l'organizzazione)

`mezzi` · `manutenzioni` · `costi` · `ricambi` · `interventi` · `scadenze`
· `disponibilita` · `controlli` (giri macchina) · `rifornimenti` · `fermi`.

I campi aggiunti sono tutti **facoltativi e retro-compatibili**: una
manutenzione senza `stato` è «da fare» e si comporta come sempre, un
`ricambioId` di prima ricompare come riga di ricambio dell'ordine, un
ricambio senza `prezzo` lo dichiara invece di valere zero di nascosto, e le
collezioni che non esistono ancora (`fermi` in testa) si leggono come vuote.

Tutti i calcoli stanno in `flotta-data.js` come **funzioni pure**
(consumo, checklist, riepilogo del giro, prossimo tagliando, fascicolo del
mezzo, costo di un ordine di lavoro, giorni di fermo e affidabilità): si
provano senza browser. L'accesso ai dati passa sempre dallo SDK
Deepwork ID (`orgCollection`), mai da percorsi Firestore scritti a mano.

## «Tagliandi 30gg»: una tessera che conta tutto e non stima niente

I tagliandi si programmano in **due** modi: a calendario (`dataPrevista`) e a
**ore del contatore** (`orePreviste`). Fino al 29/07 la tessera in cima al
Quadro contava solo i primi, e chi la guardava credeva di avere metà del
lavoro che aveva davvero — quindi non ordinava i pezzi.

Un tagliando a ore però non ha una data. Per sapere se cade nei prossimi 30
giorni serve il **ritmo d'uso** di quel mezzo (ore motore al giorno), e quel
ritmo **non si inventa: si misura** sui contatori che l'app ha già —
rifornimenti (L4) e giri macchina (L2) portano entrambi la lettura del
contatore con la sua data. Lo fa `ritmoOreMezzi()`, con quattro condizioni:

1. almeno **due** letture del contatore sullo stesso mezzo (una sola fissa il
   punto di partenza e basta);
2. le letture devono coprire almeno **metà** dell'orizzonte da stimare — 15
   giorni per stimarne 30. Proiettare 30 giorni da una finestra di 3 non è una
   stima, è una moltiplicazione per dieci di quello che si è visto, e in cava
   tre giorni possono essere di pioggia, di fermo o di doppio turno;
3. il contatore deve essere **salito** fra la prima e l'ultima lettura;
4. l'ultima lettura non può essere più vecchia dell'orizzonte: un ritmo tratto
   da letture di tre mesi fa racconta un altro periodo.

Dove il ritmo si misura, `tagliandiInScadenza()` converte le ore mancanti in
giorni e il tagliando **entra nel numero**. Dove non si misura, il tagliando
**non viene stimato e non viene nascosto**: va in un conto a parte, che la
tessera scrive sotto il numero in giallo («+1 a ore: non si sa quando») e
spiega per esteso nel suggerimento, mezzo per mezzo, col motivo. Un tagliando
a ore **già oltre** le ore previste entra nel numero senza bisogno di nessuna
stima: è da fare adesso.

Sulla pagina Manutenzioni la stessa distinzione è scritta su ogni riga: «col
ritmo **misurato** di 3,42 h al giorno» quando è una misura, «*solo se*
facesse 8 h al giorno: è un'**ipotesi**, non una misura — fuori dal conto dei
30 gg» quando è il numero medio scritto a mano nel campo *Ritmo d'uso medio*.
Quel campo resta, ma per quello che è: un'ipotesi di riserva, che non entra
nella tessera.

`kpiFrom()` mantiene la **firma storica a tre argomenti** identica, valore per
valore (i soli tagliandi a data): il conto onesto arriva passando anche
`{ letture, oggi }`. Una tessera non cambia numero da sola — cambia quando le
si danno i dati per farlo.

## Regole che l'app rispetta

- Niente numeri inventati: il consumo si mostra solo quando esistono almeno
  due rifornimenti con il contatore (il primo fissa il punto di partenza);
  i giorni senza registrazione restano buchi, non zeri.
- Un giro macchina con voci senza risposta **non si salva**.
- Il contatore delle ore non scende mai.
- Il **costo di un ordine di lavoro** non viene mai salvato a parte: si
  ricalcola dalle righe, così non può dire una cosa diversa da quella che
  hai davanti. Ore senza costo orario e pezzi senza prezzo restano
  registrati e vengono **dichiarati**, non contati a zero in silenzio.
- La **disponibilità reale** si scrive per esteso (mezzi × giorni = giorni
  macchina, meno i giorni persi): è un conto che chiunque può rifare a mano.
  I giorni di fermo si contano interi e compresi — ferma e ripartita lo
  stesso giorno è **una** giornata persa, non zero. Due fermi aperti sulla
  stessa macchina non si possono registrare: conterebbero due volte.
- Flotta è un promemoria e un archivio ordinato: **non** sostituisce il
  libretto ufficiale della macchina né i verbali dell'ente verificatore.
