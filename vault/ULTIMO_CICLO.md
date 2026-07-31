# Ultimo ciclo automatico

> **A cosa serve questo file.** Ogni volta che un ciclo di lavoro automatico
> parte davvero e riesce a raggiungere il repository, aggiorna le righe qui
> sotto. Se la data è vecchia, vuol dire che **la routine non sta
> lavorando** — e si vede subito, senza dover cercare tra i commit.

**Ultimo ciclo riuscito:** 2026-08-01 00:07 UTC
**Cosa sta per fare:** il ciclo precedente ha passato la giornata sui
**controlli che non guardavano dove credevano** — la regola che vieta i dialoghi
del browser era cieca su 764 iniezioni su 1030, core compreso, mentre la sua
controprova diceva «a posto». Da lì: tokenizzatore rifatto, controprove **a
tappeto** per tutte le regole, banco del contrasto che adesso sa fallire, e il
segno d'avvio per le otto superfici che hanno un programma.
Questo ciclo riprende dal «Prossimo passo atomico»: leggere il riepilogo del
giro a **17 banchi** (lanciato e in corso), poi eseguire per la prima volta il
banco della **doppia data** — scritto ieri ma volutamente mai lanciato e non
ancora in elenco — con la sua controprova, e solo dopo metterlo nella suite.
**Commit di partenza:** `fb9bbb3`

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
