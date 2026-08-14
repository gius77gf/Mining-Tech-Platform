# Checkpoint — 2026-08-08T10:07:58Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
1290225

## Che cosa è stato completato
**La guardia che vede una funzione provata e mai usata** — cioè il 100% di
copertura che mente con la faccia tranquilla.

`copertura-funzioni.mjs` risponde «703 su 703, nessuna funzione scoperta», e la
risposta è **vera**: ogni funzione esportata è chiamata per nome **da una
prova**. Ma «chiamata da una prova» e «usata dal prodotto» sono due domande
diverse, e la seconda non la faceva nessuno. Stessa famiglia della copertura
che non vedeva il codice aggiunto senza prove (03/08): un numero **monotòno**
che resta al 100% qualunque cosa succeda al prodotto.

### La misura
645 funzioni esportate da 10 moduli, guardate contro **16** pagine. **Sei** non
le chiama nessuno, e **due** sono frasi calcolate e mai mostrate:
· `descriviScaglione` — spiega perché uno scaglione si applica. Il resto della
  famiglia è vivo (lo sconto si applica davvero): manca la **frase** a chi legge
  il preventivo;
· `descriviPotenziale` — il «se andava male: grave» accanto a un mancato
  infortunio, cioè la ragione per cui un near-miss si registra. La pagina mostra
  solo l'aggregato.
Le altre quattro sono **TENUTE con la ragione**: due gemelle di funzioni vive
per una scheda non ancora fatta, un'etichetta superata dallo stato calcolato, un
aiuto condiviso che nessuna app ha ancora chiesto.

### Il righello ha sbagliato QUATTRO volte prima di reggere
Tutte nei modi già pagati da questo repository, e tutte scritte nel file:
1. spogliatore dei commenti **scritto a mano** → `testoBilancioFoto` dichiarata
   orfana mentre Scudo la usa in due punti. Si usa `senzaCommenti` di casa;
2. elenco delle pagine **scritto a mano**, senza `apps/genesi/nuvola-poc.html`:
   i cinque lettori di nuvole risultavano orfani mentre quella pagina li importa
   tutti. Derivato dal disco: **11 falsi → 6 veri**;
3. la controprova **non iniettava niente** (la finta finiva nel testo unito, non
   fra i moduli da cui si enumerano gli export). L'ha detto la controprova
   stessa — «l'iniezione non è arrivata» — ed è la ragione per cui esiste;
4. il **riepilogo non stava in fondo**, e `giro-node.mjs` stampa l'ultima riga
   di ogni comando: del giro non si vedeva il risultato ma l'ultima voce di un
   elenco. Il segno è stato che il totale saliva di **1 invece che di 4**.

## Verifica
· registrata in `scripts.test`, la verità da cui il giro deriva la lista:
  **23 → 25 comandi, 0 caduti**;
· verificato sulla copia di quello che si committa (confronto patch-a-patch
  identico);
· totale del giro **2.596 → 2.601**, misurato sommando le righe «Risultato»:
  l'aritmetica avrebbe detto 2.600.

## Stato roadmap
Quarta unità del blocco. Le prime tre sono nate da righe «non ho guardato» di un
banco; questa è nata dalla domanda gemella — **un numero che non può scendere**.

## Prossimo passo atomico
**Collegare le due frasi**, una app per volta, un file per commit:
1. `descriviPotenziale` nella riga del singolo near-miss di Scudo (la lista
   mostra oggi solo l'aggregato `descriviRischioPotenziale`). Verificare con
   uno scatto che la frase non finisca dove il testo è tagliato dal
   `line-clamp:2` — è già successo due volte in un giorno, e lì la parte
   tagliata era proprio quella che il principio del fondatore esiste per far
   leggere;
2. `descriviScaglione` nella riga del preventivo/ordine di Conti dove lo
   scaglione si applica.
Chiudendone una, la sua riga va **tolta** da `ACCETTATE` in
`funzioni-mai-usate.mjs`: la guardia lo pretende (una riga che scusa un caso
che non si presenta più viene segnalata), quindi il conto scende e si vede.

## Blocchi
Nessuno.
