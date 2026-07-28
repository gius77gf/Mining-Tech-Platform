# Ultimo ciclo automatico

> **A cosa serve questo file.** Ogni volta che un ciclo di lavoro automatico
> parte davvero e riesce a raggiungere il repository, aggiorna questa riga.
> Se la data qui sotto è vecchia, vuol dire che **la routine non sta
> lavorando** — e si vede subito, senza dover cercare tra i commit.

**Ultimo ciclo riuscito:** 2026-07-28 18:50 UTC
**Esito:** riparazione della routine (scatto di prova manuale)
**Commit di riferimento:** 1aed72a

---

## Come si legge

- **Data di oggi o di ieri** → la routine sta lavorando, tutto bene.
- **Data di più di un giorno fa** (nei giorni lun–sab) → **la routine si è
  fermata**. La procedura per rimetterla in piedi è in
  `docs/ROUTINE_AUTOMATICA.md`.

## Regola per i cicli automatici

Ogni ciclo, **appena verificato di poter raggiungere il repository**, deve
aggiornare le tre righe qui sopra (data e ora UTC, cosa sta per fare, hash
del commit di partenza) e includerle nel primo commit dell'unità. Non è un
adempimento burocratico: è l'unico segnale che dice al fondatore, in un
colpo d'occhio, se il lavoro automatico è vivo.
