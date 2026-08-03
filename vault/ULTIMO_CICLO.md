# Ultimo ciclo automatico

> **A cosa serve questo file.** Ogni volta che un ciclo di lavoro automatico
> parte davvero e riesce a raggiungere il repository, aggiorna le righe qui
> sotto. Se la data è vecchia, vuol dire che **la routine non sta
> lavorando** — e si vede subito, senza dover cercare tra i commit.

**Ultimo ciclo riuscito:** 2026-08-03 **00:47 UTC**
**Commit di partenza:** `6484882`

**Cosa sta per fare.** Il ciclo precedente si è fermato due volte, e nessuna
delle due per scelta:
1. **il limite della piattaforma** (reset all'una UTC), che ha ucciso tre
   cantieri mentre scrivevano — Conti (`valorePesata`), Flotta+Campo (gli
   ultimi punti del censimento) e la riverifica del delta di Conti;
2. **il contenitore si è riportato indietro di due ore.** Tutto il lavoro
   spinto era su GitHub e non si è perso niente di committato, ma la copia
   locale è tornata a `45617e9` con dentro file **più vecchi** di quelli del
   remoto. Committarli avrebbe resuscitato tre difetti chiusi il giorno prima:
   la prova che pretendeva «pericolo» su soglia 0 (blindava il difetto della
   decisione 16), le due righe che dichiaravano accettabile il DPI senza data
   (decisione 14), e le righe che dichiaravano ancora aperti i difetti sulle
   date di Conti. Sono stati messi da parte con `git stash` — non cancellati —
   e la cartella è stata riallineata a `origin`.

⚠️ **Una unità è andata persa** perché non era ancora committata quando il
contenitore è tornato indietro: il controllo che pretende che la tabella
riassuntiva del delta — copiata in cima a **tutti e sei** i documenti dei
concorrenti — torni con i suoi addendi. Il difetto che aveva trovato resta
vero ed è scritto: in due documenti su sei mancavano **due righe per parte**,
tolte dalle confermate senza essere aggiunte altrove. Va rifatto.

Questo ciclo quindi:
1. **rilancia i tre cantieri uccisi dal limite**, con i mandati già scritti:
   la premessa di `valorePesata` che regge su una schermata su due, gli ultimi
   punti del censimento in Flotta e Campo, la riverifica del delta di Conti
   (dove il conto non torna di due righe);
2. **rifà il controllo sulla tabella del delta**, che è la difesa contro
   esattamente il difetto del punto 1;
3. prosegue con l'obiettivo della settimana — **lo standard di ogni funzione**,
   cioè i numeri che mentono con la faccia tranquilla, funzione per funzione.

**Stato al momento della partenza:** giro `node` **20 comandi su 20**, albero
pulito e allineato a `origin`. **1.925 prove** senza rete, **53** banchi del
browser, copertura **602/602** e nessuna funzione scoperta, 60 file di test
collegati, 15 pagine che compilano, 858 nomi importati verificati.
Decisioni del fondatore ancora aperte: **19** (erano 24 sabato).
