# Ultimo ciclo automatico

> **A cosa serve questo file.** Ogni volta che un ciclo di lavoro automatico
> parte davvero e riesce a raggiungere il repository, aggiorna le righe qui
> sotto. Se la data è vecchia, vuol dire che **la routine non sta
> lavorando** — e si vede subito, senza dover cercare tra i commit.

**Ultimo ciclo riuscito:** 2026-08-02 04:37 UTC — **la giornata della copertura**
**Cosa ha fatto:** le prove sulle funzioni pure delle app sono passate da **433 a
962** (totale `node` **1.245**), e la copertura è arrivata a **401 funzioni su
409**: Campo e Scudo al 100%, Sentinella 101/102, Conti 56/57, Terra 37/38,
Flotta 65/70. Ogni blocco ha la sua controprova su una copia del modulo, e sono
passate tutte (9/9, 11/11, 18/18, 14/14, 13/13, 12/12, 11/11, 9/9, 2/2).
Scrivendo le prove sono uscite **cinque duplicazioni**: tre sono difetti veri
(`messaggioNumero` scritta due volte con tre messaggi diversi su dieci,
`dataPiuGiorni` identica in Scudo e Sentinella e **già staccata** sul caso
d'errore, `giorni` lo stesso involucro in Conti e Sentinella) e due no
(`numeroIt` e `CAUSALI_FERMO`: differenze **volute e dichiarate**). Il criterio
per distinguerle sta in `docs/LA_STESSA_REGOLA_SCRITTA_DUE_VOLTE.md`.
Nati due controlli che contano al posto della memoria — `copertura-funzioni.mjs`
(con un **fondo** per app) e `nomi-doppi.mjs` — più la misura del raggruppamento
delle migliaia fra Node e Chromium (`docs/MIGLIAIA_NODE_CONTRO_CHROMIUM.md`).
**Cosa sta facendo adesso:** aspetta l'ultimo banco del **giro a 19 banchi** del
browser per applicare le **tre correzioni già pronte** (una sola
`messaggioNumero`, `dataPiuGiorni` in `shared/` e irrigidita, il raggruppamento
scritto nei moduli), con le prove di **identità** e la **regola 16** dello stile.
**Commit di partenza:** `ba14668`

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
