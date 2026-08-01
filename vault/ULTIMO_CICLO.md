# Ultimo ciclo automatico

> **A cosa serve questo file.** Ogni volta che un ciclo di lavoro automatico
> parte davvero e riesce a raggiungere il repository, aggiorna le righe qui
> sotto. Se la data è vecchia, vuol dire che **la routine non sta
> lavorando** — e si vede subito, senza dover cercare tra i commit.

**Ultimo ciclo riuscito:** 2026-08-01 **18:48 UTC**
**Commit di partenza:** `8647a7a`

**Cosa sta per fare.** Il ciclo precedente ha chiuso sette unita' di prodotto
su sei app e — cosa che conta di piu' — **due buchi negli strumenti di
controllo**: le prove non sapevano distinguere «non calcolabile» da una
divisione per zero, e cinque prove non potevano fallire perche' scritte in modo
asincrono su un contatore sincrono.

Questo ciclo riparte dal **prossimo passo atomico** dell'ultimo checkpoint, che
e' gia' stato chiuso (il banco delle finestre di conferma, con la sua
controprova che sa fallire: 24 modali, 222 elementi misurati). Quindi si va
avanti nell'ordine dichiarato dal fondatore per quando la roadmap sembra
finita: **le mancanze CONFERMATE** dalla verifica del delta, che sono 63 su
105 righe verificate.

⚠️ E si riparte con la regola imparata a spese nostre un'ora fa: **la verifica
vale per lo stato CHE SI COMMITTA**, non per quello che si era misurato. Con
cantieri paralleli aperti, o si misura la copia esatta di cio' che si sta per
committare, o si aspetta che chiudano.

**Stato al momento della partenza:** 1.617 prove senza rete, copertura
515/515, 49 banchi del browser, albero pulito e tutto spinto.
