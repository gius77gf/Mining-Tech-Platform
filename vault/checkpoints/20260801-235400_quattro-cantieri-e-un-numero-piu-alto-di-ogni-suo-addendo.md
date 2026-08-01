# Quattro cantieri, e un numero più alto di ogni suo addendo

**Data:** 01/08/2026 (notte) · **Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`
**Partenza del ciclo:** `04692c3` (canarino)
**Unità precedente:** `20260801-234500_i-tre-difetti-di-genesi-chiusi-e-i-cinque-cantieri-rientrati.md`
**Commit:** `aa14015`, `f5dab46`

## Il difetto che pesa di più

`costoOrarioMezzo` di Flotta è il numero con cui un titolare decide **se tenere
una macchina o cambiarla**. Era gonfiato del **120%** su un mezzo, dell'82% su
un altro, del 19% su un terzo — tre su sei. La causa è banale e invisibile
leggendo il codice: **numeratore e denominatore coprono periodi diversi**.
L'officina si somma da sempre; le ore vengono dalle letture del contatore
scritte sui rifornimenti, cioè solo dal periodo in cui qualcuno le ha segnate.

⚠️ E il segno che il numero non poteva essere giusto stava sotto gli occhi da
giorni: la media pesata del parco era **54,25 €/h** su mezzi fra 28 e 39 — **più
alta di ogni suo addendo**. Nessuno l'aveva guardata. Adesso è 32,38, e la
classifica era puntata sulla macchina sbagliata: la striscia rossa stava sul
Dumper D1 a 28,61 €/h mentre l'Escavatore E1 a 38,96 restava grigio.

⛔ **La correzione non baratta una domanda con l'altra**: `totale`, `officina` e
`carburante` restano quelli veri, da sempre. Cambia solo il numeratore del
rapporto, e l'officina che cade fuori dalla finestra **si conta a parte e si
dichiara**. Chi guarda la spesa non deve vederla scendere perché abbiamo
aggiustato un rapporto.

## Le tre cose che i cantieri hanno trovato oltre il mandato

**Terra ha smentito una riga del mio mandato.** Avevo scritto che la densità
sta sotto la base dell'onere di escavazione: falso, quel conto lavora tutto in
metri cubi e lo dichiara. I punti veri sono **due**, non tre. Un mandato
sbagliato che nessuno contesta diventa lavoro sbagliato.

**Scudo ha trovato quattro preset di scadenzario sul DSS che esistevano già e
che nessuno leggeva.** Non li ha riscritti: ci ha attaccato sopra il ciclo di
vita, e la periodicità dei dodici mesi la **legge da lì** invece di
ridichiararla. È la regola del `shared/` applicata dentro una app sola.

**Flotta ha misurato che il difetto ha una seconda metà**, dal lato gasolio, più
grossa (+93,7% su un mezzo): `consumoPerMezzo` scarta il primo pieno — quel
gasolio ha alimentato ore *precedenti* alla finestra — ma il numeratore lo
include. L'ha **dichiarata invece di correggerla**, perché il mandato fissava
numeri d'arrivo diversi: la scelta giusta, e il seguito è già assegnato.

## Quello che si vede solo negli scatti — tre casi, tre lezioni diverse

1. **Terra**: un secondo `addEventListener` sopravvissuto **centosessanta righe
   più in basso** spegneva la nota della provenienza della densità. Girava dopo
   il primo, quindi la riga c'era col preset e **spariva scrivendo il numero a
   mano** — cioè esattamente nello stato in cui serve. Nessun errore, nessuna
   prova rossa, e i due ascoltatori sono lontanissimi.
2. **Flotta**: la striscia rossa era sulla macchina **più economica**. La lista
   ordina per spesa totale ma si chiama «quanto costa un'ora», e la pagella due
   centimetri più sotto diceva l'opposto. Due schermate accanto che si
   smentiscono.
3. **Scudo**: la riga del Quadro era tagliata a metà da `-webkit-line-clamp`
   proprio dove il principio del fondatore vuole essere letto («…non è**…**»).
   Da lì è nata una funzione in più, che scrive la frase intera in 46 caratteri.

## E una misura che ha ingannato tre volte

«La barra di navigazione va a capo a 320px» — detto da tre sonde diverse, in tre
app diverse, e **tre volte falso**. Contavano le righe come numero di `top`
distinti, e il bottone **attivo** sta due pixel più in alto: due valori, zero a
capo. La misura giusta confronta l'altezza della barra con quella di un bottone.

## Verifica

Prove **1.769 → 1.832**, copertura **599/599**, nessuna funzione scoperta,
`documenti-invecchiati` 13/0. Controprove: 8 (Flotta) + 8 (Terra) + 16 (Scudo)
+ 12 (Conti), **tutte distinguono**. Verificato ogni volta sulla **copia di ciò
che si committa**, perché i cantieri scrivevano ancora.

Due righe del delta di Conti scendono, e **non** come «scadute»: sono state
colmate perché quella riga le proponeva. Confermate assenti da 56 a **54**.

## Prossimo passo atomico

Raccogliere i due cantieri aperti: la **metà gasolio** del €/h di Flotta, e lo
spostamento di `densitaDellaCava` in `shared/dw-ponti.js` — che è il difetto più
insidioso dei due, perché oggi Terra riconcilierebbe a 1,95 e Campo a 1,90 sulla
**stessa cava**, e nessuna delle due sbaglia da sola.

## ⛔ Errore mio, e per la seconda volta stanotte

Questo file l'avevo chiamato `20260802-001500` mentre erano le **23:54 del
01/08**: un checkpoint datato **avanti**, cioè esattamente il difetto che
`date-checkpoint.mjs` esiste per impedire e su cui `CLAUDE.md` ha un paragrafo
intero (184 checkpoint su 640 datati avanti, fino a cinque giorni).
La prima volta, tre ore fa, l'avevo presa guardando l'orologio prima di
committare. La seconda l'ho rifatta identica.

La lezione non è «stare più attenti» — è che **arrotondavo l'ora in avanti per
comodità** invece di leggerla. Il nome di un checkpoint si prende da `date -u`,
non dalla testa, e il controllo lo pretende solo per i file **nuovi**: quelli
già dentro passano lo stesso, quindi non è lui a fermarmi.
