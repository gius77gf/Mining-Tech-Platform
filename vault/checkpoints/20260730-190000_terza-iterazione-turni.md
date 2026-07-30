# Checkpoint — 30/07/2026 19:00 UTC

## Task completato
**Terza iterazione sulla sezione «Quello che dichiarano i turni» di Terra.**

| Commit | Cosa |
|---|---|
| `95e0abb` | Quattro difetti, tre trovati solo guardando gli stati a schermo |

## Il metodo, e perché ha funzionato
La sezione era nata stamattina con **una** iterazione. La direttiva chiede almeno
tre. Invece di rileggere il codice ho **renderizzato gli stati che non avevo mai
visto** — Campo assente, nessun turno, nessun rilievo, un rilievo solo,
dichiarato sopra la misura, dichiarato sopra di poco — servendo un modulo dati
modificato per **intercettazione della richiesta**, senza toccare niente nel repo.

Tre dei quattro difetti si vedono solo così. Uno stava nel mio progetto.

## 1. La banda di coerenza valeva in un senso solo (il peggiore)
Qualunque eccesso, anche dell'1%, diventava un allarme rosso «sopra-misura». Ma
se una stima a occhio può stare quindici punti **sotto** la misura senza che sia
un problema, può stare quindici punti **sopra** per la stessa ragione: è la stessa
imprecisione, nell'altro verso. **Un allarme che scatta su una differenza normale
insegna a non guardarlo più** — che è esattamente ciò che quelle soglie larghe
dovevano evitare. Avevo scritto la ragione nel commento e poi violata nel codice
tre righe sotto.

Ora la banda è simmetrica, e `sopra-misura` scatta solo **oltre** di essa, dove il
verso cambia davvero il significato (o le stime sono gonfie, o il rilievo non
copre tutto). Aggiunto `verso` come **parola**, perché «−16%» da solo non dice chi
dei due è più alto.

## 2. Senza rilievi il dichiarato si perdeva
La sezione diventava due note grigie che dicono «non posso», mentre in archivio
c'erano **quindici rapportini** con la produzione dichiarata. È il caso in cui
quel dato vale **più** di tutti — una cava che non ha ancora fatto volare il drone
non ha nessun'altra fonte — e l'app lo teneva nascosto. Ora mostra gli ultimi 30
giorni, dichiarati come tali, dicendo che non c'è niente contro cui confrontarli.

## 3. La terza tessera a 390 px
Restava a metà larghezza con un buco accanto. La convenzione dell'app c'era già —
la sezione «Confronto fra due rilievi», **dieci righe sopra**, marca la terza
tessera `largo` — e non l'avevo usata. Misurato dopo la correzione: 175+175 sulla
prima riga, 358 pieni sulla seconda, in entrambi i gruppi.

## 4. Una frase indicava le tessere sbagliate
Nel caso «nessun turno» diceva «il volume che vedi nelle tessere è ancora quello
dell'ultimo volo», ma le tessere di **questa** sezione mostrano un trattino: quel
volume sta altrove. Adesso nomina il rilievo con la sua data.

## La domanda che il checkpoint lasciava aperta, e la risposta
La sezione di riferimento ha le tendine per scegliere il periodo, la mia no.
Risposta: **la tendina si mette**, per coerenza con l'app, **ma le scelte non sono
date libere — sono i confini dei voli.** Una data qualsiasi permetterebbe di
chiedere un periodo che non corrisponde a nessuna misura, e il numero che ne esce
sarebbe uno scostamento nato solo dalle date. Meglio togliere la possibilità di
fare la domanda sbagliata che spiegare dopo perché la risposta non vale.
Con un intervallo solo la tendina non compare: una scelta con una voce sola è un
ingombro.

## Stato
Suite: **286 KPI**, **60 stile**, 7 demo, 43 helper, 23 pointcloud, 9 manifest.
Tutte verdi. Sei stati renderizzati a 390 px, screenshot guardati, larghezze
misurate, tendina provata cambiando periodo — sull'intervallo più vecchio l'app
dice onestamente che in quel periodo nessun turno ha dichiarato.

## Prossimo passo atomico
**Seconda iterazione sulla sezione dei turni dal lato di CAMPO**, cioè l'altra
metà del ponte: oggi Campo non sa niente di Terra. Chi compila il rapportino di
turno scrive una produzione e non vede mai se quel numero si è poi parlato col
rilievo — e sono proprio le persone le cui stime il confronto giudica.

L'unità è piccola e ha un solo modo di sbagliare, da evitare subito: **non deve
diventare un rimprovero**. Se Campo mostrasse «le tue stime erano gonfie del 22%»
la conseguenza prevedibile è che i turni comincino a scrivere numeri prudenti
invece di numeri veri, e il dato peggiora proprio dove serve. La forma giusta è
informativa e di squadra: «l'ultimo rilievo ha misurato X, i turni del periodo ne
avevano dichiarati Y», senza colpevoli e senza percentuali sbattute in faccia.

Da fare: (1) leggere in `apps/campo/index.html` dov'è la vista di chi compila il
rapportino e dove starebbe questa informazione senza affollarla; (2) l'accessorio
di sola lettura verso i rilievi di Terra, gemello di `rapportiniCampo()` in Terra
(`orgCollection`, seconda istanza dell'SDK sull'app "terra", nessuna scrittura);
(3) riusare le funzioni di Terra oppure — meglio — spostare la coppia
`misuratoPeriodo`/`riconciliazioneTurni` in un posto condiviso, perché altrimenti
la stessa convenzione finisce scritta due volte, che è **esattamente** il difetto
costato una giornata con i numeri; (4) provarlo a 390 px e guardare lo screenshot.

Restano aperti e già scritti: la larghezza dei comandi di Scudo (36–38 px invece
di 44, compromesso misurato), il badge dell'idoneità (caso che la WCAG 2.5.8
esenta), e i tre punti che aspettano il fondatore — progetto Firebase (10
minuti), permessi per ruolo, blocco del turno chiuso lato server.
