# Ultimo ciclo automatico

> **A cosa serve questo file.** Ogni volta che un ciclo di lavoro automatico
> parte davvero e riesce a raggiungere il repository, aggiorna le righe qui
> sotto. Se la data è vecchia, vuol dire che **la routine non sta
> lavorando** — e si vede subito, senza dover cercare tra i commit.

**Ultimo ciclo riuscito:** 2026-08-04 10:24 UTC — **il ciclo che ha trovato
quattro difetti veri, e uno era vivo nella sicurezza**
**Cosa ha fatto (ciclo precedente, chiuso poco fa):** una sonda che chiama
**tutte** le funzioni pure con dati vuoti cercando **un solo segno** — *un numero
tranquillo dove non è stato misurato niente* — ha trovato quattro difetti.
Il peggiore era **live**: una scadenza importata da un file con la data sbagliata
di battitura («2026-13-45» ha la forma giusta e non esiste) entrava in archivio e
restava **verde per sempre** — una visita medica che nessuno avrebbe mai visto
fra quelle da fare. Corretto in sei punti, perché lo stesso difetto era scritto
sei volte con nomi diversi, e la correzione ha fatto nascere `dataISOEsiste`
(«2026-02-30» non è nemmeno un errore per `Date.parse`: scivola al 2 marzo).
Gli altri tre: Sentinella diceva «Conforme» su punti che nessuno aveva letto,
Flotta poteva dichiarare «SCADUTA» un tagliando **senza obiettivo**, Conti poteva
**bloccare la pagina**. Poi le altre **cinque porte d'ingresso** con lo stesso
filtro a sola forma. Prove `node`: **1.343 → 1.359**.

**Cosa sta facendo adesso:** il giro a 25 banchi del browser gira sul codice
finale; nel frattempo si riparte dal «prossimo passo atomico» del checkpoint —
**Genesi al condiviso (unità A)**, la **tracciabilità del volume dal visore** in
Terra/Genesi e le **note di credito** in Conti, tutte e tre già misurate e
pianificate con le prove scritte prima.
**Commit di partenza:** `844896f`

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
