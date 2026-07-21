# Audit isolamento dati delle app verticali

_Aggiornato: 2026-07-21 · verifica automatica + lettura del codice_

## Perché questo documento (per Giuseppe)

Deepwork sarà venduto a più aziende, spesso **concorrenti tra loro**. La
regola numero uno è che **i dati di un'azienda non si vedano MAI da
un'altra**. Questo foglio spiega, in parole semplici, **come** è garantito
oggi nelle 6 app verticali (Campo, Conti, Flotta, Scudo, Sentinella, Terra)
e **come lo teniamo controllato** contro errori futuri.

## Come funziona l'isolamento

Ogni app, quando un utente è autenticato, legge e scrive i dati **solo**
attraverso lo "SDK" condiviso (`shared/deepwork-id-client`), chiamando
`orgCollection(nome)`. Quella funzione **sigilla** l'accesso sulla cartella
dell'organizzazione a cui appartiene l'utente: è come se ogni azienda avesse
un armadio con la sua serratura, e l'app potesse aprire **solo** quell'armadio.

In pratica, nel codice di ogni app:
- **Lettura** dati → `getDocs(orgCollection(nome))`
- **Aggiunta** → `addDoc(orgCollection(nome), dato)`
- **Modifica** → `updateDoc(doc(orgCollection(nome), id), dato)`
- **Rimozione** → `deleteDoc(doc(orgCollection(nome), id))`

Non esiste **nessun** punto in cui un'app costruisce "a mano" il percorso di
una cartella dati (che sarebbe la strada per sbagliare organizzazione).

## Cosa è stato verificato (21/07/2026)

1. **Tutte e 6 le app** usano `orgCollection` per ogni operazione dati
   (lettura, aggiunta, modifica, rimozione). Verifica: presente in
   `campo-data.js`, `conti-data.js`, `flotta-data.js`, `scudo-data.js`,
   `sentinella-data.js`, `terra-data.js`.
2. **Zero percorsi costruiti a mano**: nessuna occorrenza di
   `collection(db, …)` o `doc(db, …)` nelle app (ricerca su tutti i file
   `.js` e `.html` delle app → 0 risultati). Quindi non c'è modo di
   "sbagliare armadio".
3. **Modalità demo/tour**: quando non si è autenticati, i dati sono di
   esempio e vivono **solo in memoria** (niente database), quindi non c'è
   alcun rischio di mescolare dati veri di aziende diverse.
4. **Genesi** non usa il database delle organizzazioni: è un simulatore che
   lavora nel browser (localStorage locale). L'unico file senza
   `orgCollection` è il suo service-worker (`genesi-sw.js`), che serve solo
   a far funzionare l'app offline e **non tocca dati**.

## La rete di sicurezza automatica

Non ci fidiamo solo della lettura del codice: ad **ogni** modifica (push/PR),
la CI esegue i test delle **regole di sicurezza Firestore** contro
l'emulatore. Quelle regole, sul database vero, **rifiutano** a un utente di
un'organizzazione qualsiasi accesso ai dati di un'altra. Se un domani qualcuno
sbagliasse e provasse a leggere l'armadio sbagliato, **i test diventano rossi**
e la modifica non passa. È la garanzia che l'isolamento non si può rompere di
nascosto.

## Il "core" (Deepwork centrale)

Il core (la home `index.html` alla radice) è oggi **mono-azienda** per come
è nato. Il lavoro di predisposizione all'isolamento è documentato in
`docs/ISOLAMENTO_CORE.md`: lo strato dati è già stato reso "indirizzabile"
per organizzazione (dietro un interruttore `MULTI_TENANT`, oggi spento = zero
cambiamenti in produzione) e le regole/test lo coprono. L'accensione vera
(autenticazione lato server + migrazione dei dati esistenti) resta in attesa
di una tua conferma esplicita, perché tocca l'accesso e i dati reali.

## In una riga

**Le 6 app verticali isolano già oggi i dati di ogni azienda** tramite lo SDK
`orgCollection`, senza percorsi fatti a mano, con test automatici che
impediscono regressioni. Il core è predisposto ma la sua attivazione
multi-azienda attende il tuo via libera.
