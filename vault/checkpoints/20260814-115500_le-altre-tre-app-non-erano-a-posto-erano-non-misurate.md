# Checkpoint — 2026-08-14 11:55 UTC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit di questo tratto
- `5a770173` — Flotta e Conti: la finestra di caricamento era misurata su TRE app su sei

## Che cosa è stato completato

**Le altre tre app non erano «a posto»: erano NON MISURATE** — la riga che
questo repository ripete da settimane, applicata al **banco** invece che al
prodotto. Il banco della finestra di caricamento guardava Campo, Scudo e
Sentinella perché erano le app in cui il difetto era stato trovato. Aprendo le
altre: **Flotta 10 contatori nati «0», Conti 9**, cioè esattamente ciò che B6
aveva curato. Adesso nascono «—», col perché scritto dentro le due pagine.

## ⛔ E la prima misura sulle tre app nuove era FALSA, per la fixture
Il server del banco ritardava `(campo|scudo|sentinella)-data.js` — **un elenco
dentro una regex**. Aggiungendo tre app a `APPS` il ritardo non le ha seguite:
i dati arrivavano subito, **la finestra non esisteva**, e il banco ha accusato
Flotta di **16 «numeri tranquilli»** che erano i valori veri della
dimostrazione e di comandi «muti» che invece navigavano. È la *fixture
indovinata*: il caso non arrivava al ramo che doveva provare. Adesso si ritarda
il modulo dell'**app che si sta misurando**.

## Due eccezioni dichiarate, trovate dalla domanda del verso opposto
I due contatori della scheda di un **ordine di lavoro** in Flotta (esiste solo
quando qualcuno ne apre uno) e il KPI **«m³ estratti mese»** di Terra, che resta
«—» perché nella dimostrazione nessun rilievo cade nel mese in corso. Per poterlo
dichiarare quel KPI ha adesso un **id**: un elemento che un controllo deve
nominare deve avere un nome.
⚠️ E **la controprova di Terra non esisteva**: Terra non ha nessuno `span.cnt`,
quindi la sua prima domanda restava senza iniezione — il banco avrebbe detto «a
posto» su una difesa che non ha mai provato a far cadere.

## Le misure
Banco: **22 schermate su 22** nelle tre app nuove, **21 passati, 0 falliti**, 61
comandi premuti e 0 muti. Controprova: **21 iniezioni a bersaglio**, e le due
domande cadono su **tutte e tre** le app. Giro `node` sulla copia di ciò che si
committa: **36 comandi a posto, 0 caduti**, **3.161** asserzioni, prove
**2.787**. **CI verde** su tutti e sette i commit del ramo dopo la correzione
dei claims (l'unico rosso resta `173bd3b9`, quello che l'ha aperta).

## ⚠️ Il contenitore si è riavviato a metà unità
Nessuna perdita: `git rev-parse HEAD` diceva `3c8a0ec3` e le modifiche erano
nell'indice. I due processi in volo (giro `node` e controprova) sono stati
**rilanciati**, non dati per buoni: un processo ucciso non lascia un registro
che lo dichiari.

## Prossimo passo atomico
Portare la **terza domanda** (i comandi che rispondono) anche alle schermate
**dentro le linguette**: il banco dichiara già che 6 contatori di Scudo e 2 di
Flotta non sono raggiungibili nella finestra perché la linguetta ha
l'ascoltatore nel modulo. Sono **soggetti non misurati**, e adesso che la
guardia esiste vale la pena chiedersi se una linguetta premuta nella finestra
debba rispondere anche lei.

## Blocchi
- **Force-with-lease sul ramo**, **B0-septies**, le **soglie di sicurezza** e
  **`dRecFreq` intero all'ingresso**: fermi al fondatore.
