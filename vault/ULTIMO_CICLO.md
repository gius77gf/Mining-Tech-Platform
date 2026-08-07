# Ultimo ciclo automatico

> **A cosa serve questo file.** Ogni volta che un ciclo di lavoro automatico
> parte davvero e riesce a raggiungere il repository, aggiorna le righe qui
> sotto. Se la data è vecchia, vuol dire che **la routine non sta
> lavorando** — e si vede subito, senza dover cercare tra i commit.

**Ultimo ciclo riuscito:** 2026-08-07 **02:47 UTC**
**Commit di partenza:** `5b4c82e`

**Che cosa è successo nel blocco precedente.** Ventun commit, e il filo era uno:
*il caso limite è sempre **UNO**, e la dimostrazione non ce l'ha mai.* Sei
cantieri hanno aperto le app con **un dato per collezione**, coi casi costruiti
nella risposta HTTP e mai sul disco. Sono uscite **oltre settanta frasi
sbagliate**, e la forma si è affinata strada facendo: **il sostantivo era quasi
sempre già giusto** — a mancare erano il verbo, il participio, l'aggettivo.
Le due che pesano di più stanno su documenti che escono: in **Scudo** il
promemoria mandato al lavoratore diceva «SCADUTA dal 06/08 (**1 giorni fa**)»,
e in **Sentinella** la catena di taratura — cioè la voce «Riferibilità delle
misure» del report per l'**ARPA** — diceva «**Delle** 1 lettura **registrate**».

⛔ **Ma i tre difetti più gravi non erano di grammatica.**
· In **Flotta** «è ripartito» **non faceva niente da una settimana**:
  `chiediDati()` era chiamata sei volte e non esisteva più: il commit che il
  31/07 ha portato la struttura in `shared/` ne aveva traslocate **sette su
  otto**, e la ottava la usava una app sola.
· In **Genesi** il file con cui una volata si riapre scriveva lo **scatter
  d'innesco** invece del ritardo, e il giro di andata e ritorno riportava una
  volata da **42 ms a 25**.
· In **Campo** un rapporto **datato** attribuiva **2.300 t** a un giorno che
  nessuno aveva dichiarato — mentre lo schermo, due volte, lo diceva.
E in **Conti** la mora ex D.Lgs 231/2002 si calcolava su quello che una nota di
credito aveva **già stornato**: l'unica delle tre che chiede soldi a un cliente.

⛔ **La lezione da portarsi dietro, ed è la stessa dell'altra volta con un'altra
faccia: il controllo sbaglia più spesso del prodotto — otto volte in un
blocco.** `nomi-liberi` era **cieco sulla forma più frequente che il codice
abbia** (`const x = qualcosa(...)`) perché tenuto largo «per non fare falsi
allarmi»: stringendolo, **due** nomi da dichiarare e **un difetto vero** vecchio
di una settimana. Il banco delle unità non conosceva la **`t` nuda** mentre
«LORDO (T)» era su un DDT stampato. Un banco ha accusato due volte il prodotto
per **id inventati da lui**. E la ricerca sul DDT aveva ragione sui «non c'è» e
citava un **articolo di legge inesistente**.
⚠️ **L'ampiezza di un controllo è un numero, e quel numero si misura**: il
timore dei falsi allarmi era ragionevole, e la misura l'ha smentito in cinque
minuti.

**Che cosa fa adesso.** Resta **un cantiere aperto**, sul **core**: il banco
delle modali ne apre **11 su 68**, e il core è la superficie che il fondatore
mostra per prima. Poi, ad albero fermo, tre cose già progettate e misurate:
la correzione del **motore dei grafici** (Terra dipinge a ×0,925) col suo banco,
il **pieno senza spesa** nei dati d'esempio di Flotta — che renderebbe visibile
una funzione e misurabile una regola in un colpo solo — e il **censimento delle
classi orfane** portato dentro le prove.

⚠️ **E le 19 decisioni scadono OGGI, venerdì 07/08.**
