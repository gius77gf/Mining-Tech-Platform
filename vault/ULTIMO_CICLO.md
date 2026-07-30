# Ultimo ciclo automatico

> **A cosa serve questo file.** Ogni volta che un ciclo di lavoro automatico
> parte davvero e riesce a raggiungere il repository, aggiorna le righe qui
> sotto. Se la data è vecchia, vuol dire che **la routine non sta
> lavorando** — e si vede subito, senza dover cercare tra i commit.

**Ultimo ciclo riuscito:** 2026-07-31 00:40 UTC
**Cosa ha fatto:** una giornata sola su una cosa sola — **far entrare i dati del
cliente e poterli riportare fuori**, perché è il primo giorno del pilota. Il
doppione dentro lo stesso file (dieci gestori su dieci lo lasciavano passare, e
l'export di Scudo scrive una riga per scadenza: ri-caricarlo faceva comparire
tre volte lo stesso lavoratore); il giro di andata e ritorno provato per la
prima volta, che ha detto che **solo sette** file si ri-caricano davvero e tutti
gli altri sono prospetti, non backup; un bottone di Conti che **non faceva
niente** (due elementi con lo stesso identificativo) e il file dei prezzi
convertiti che, ri-caricato per sbaglio, riempiva il listino di prodotti a
prezzo zero con l'IVA sbagliata. Poi il giro completo degli **zeri di comodo**
nei lettori CSV: sei esaminati uno per uno su cosa fa quel numero, quattro tolti
(prezzo, ore motore, base d'asta, persone di una squadra), due lasciati con la
ragione scritta.
**Prove:** 662 senza rete (erano 555), 13 banchi nel browser (erano 11), due
regole di stile nuove (12 e 13) e un banco nuovo sugli identificativi ripetuti.
**Commit di partenza:** `f8a4090`

---

## ✅ La routine funziona — prova del 28/07

Questo è il **primo canarino scritto da un ciclo automatico vero**, non a
mano. Dimostra che la catena regge: la sveglia scatta, il messaggio arriva,
la sessione raggiunge il repository e committa.

Una cosa imparata, che vale la pena scrivere: gli scatti di prova delle
19:00 non erano falliti — erano **in coda**. Un messaggio programmato entra
solo quando la conversazione è libera, e in quel momento era occupata da
ore di lavoro ininterrotto. Non era un guasto: era traffico. Quindi
**l'assenza immediata del canarino non significa che la routine è rotta**:
può voler dire che la sessione sta lavorando. Va giudicata sull'arco di
qualche ora, non sui minuti.

## Come si legge

- **Data di oggi o di ieri** → la routine sta lavorando, tutto bene.
- **Data di più di un giorno fa** (nei giorni lun–sab) → **la routine si è
  fermata**. La procedura per rimetterla in piedi è in
  `docs/ROUTINE_AUTOMATICA.md`.

## Regola per i cicli automatici

Ogni ciclo, **appena verificato di poter raggiungere il repository**, deve
aggiornare le tre righe in cima (data e ora UTC, cosa sta per fare, hash del
commit di partenza) e committarle con un messaggio che inizia per
`canarino:`. Non è un adempimento burocratico: è l'unico segnale che dice al
fondatore, in un colpo d'occhio, se il lavoro automatico è vivo — ed è
quello che la sentinella su GitHub controlla per avvisarlo via email.
