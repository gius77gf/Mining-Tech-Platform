# Checkpoint — 2026-08-07 13:00:00 UTC

## Tipo
unit-complete (quattro unità: i nomi dei due livelli + PARTE 7, i due temi nel
giro, il conto «che morde», e la riga che si contraddiceva da sola)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`57b4107` — *Il conto «che morde» ha subito trovato una riga che si
contraddiceva da sola, e sotto un commento di schema fermo a sei giorni fa*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|---|---|
| 147 | **i nomi dei due livelli + PARTE 7** (`d15fb80`) | 20 sostituzioni, contrasto identico (997 testi, 0 sotto soglia) |
| 148 | **i due temi chiari nel giro** (`d8a6f6d`) | esecuzioni **129 → 132**, tutte verificate a mano prima |
| 149 | **il conto «che morde»** (`f49a3dd`) | arretrato **33 grezzi → 7 che mordono**, prove 13 → 15 |
| 150 | **la riga che si contraddiceva** (`57b4107`) | una riga scaduta trovata e corretta il giorno stesso del conto nuovo |

## ⛔ Il conto nuovo ha pagato subito
`documenti-invecchiati` contava tutti i commit sull'app. Le sei palette di
stamattina ne hanno aggiunti **sei** senza toccare una funzione o un bottone:
un contatore che sale per ragioni che non contano insegna a non guardarlo.
Adesso stampa anche quelli che **mordono** — chi ha aggiunto o tolto una `export
function` o un `<button>` — e sono **7 su 33**, con **Flotta a zero** (il grezzo
diceva 3).
Guardando *che cosa* avevano aggiunto quei sette è saltata fuori, in mezz'ora,
una riga di `CONCORRENTI_CAMPO.md` che **si contraddiceva dentro lo stesso
riquadro**: intestazione «completa dal 01/08», corpo «manca». Ed è la terza
forma dell'invecchiamento, già censita il 06/08 — il verdetto regge e scade la
prova. Sotto c'era la causa: il commento di schema di `scudo-data.js:29`
elencava le origini **senza `fermo`**, da sei giorni.
⛔ E il commit di verifica del documento **non** è stato spostato: ho
riverificato una riga, non il documento. Una data incollata non è una verifica.

## ⛔ E i due temi chiari sono entrati nel giro solo adesso
Stamattina il banco aveva trovato **54 violazioni** nei due temi chiari.
Registrarli allora avrebbe messo il giro in rosso per l'intera giornata, cioè
lo avrebbe reso un rumore da ignorare. Sono entrati con l'ultima delle sei app a
zero, e tutt'e tre le passate sono state **provate a mano** su una copia di HEAD
prima di essere registrate: chiaro 3.694/0, sole 3.696/0, e la controprova di
giorno 6 superfici avvelenate su 6 bocciate, testimone `color-mix` 0.

## Stato delle prove
Prove **2.251** (`run-kpi` 1844, `run-stile` 295), copertura 677/677, banchi
**132**, giro `node` **23 comandi, 0 caduti** verificato sulla copia ogni volta.

## Che cosa sta girando adesso
**Tre cantieri**, su superfici che non si toccano:
1. **il righello** — la geometria del gradiente in `contrasto.mjs` (quattro
   accuse false su trentadue, tutte fra i casi con la forbice larga);
2. **`shared/`** — le strisce di stato, WCAG 1.4.11: sul chiaro `--warn` fa
   **1,62:1** sul fondo di Scudo e 1,85 in Campo, passa solo il rosso. Tre app
   su sei l'hanno segnalato da sole, 10 delle 13 regole stanno in `shared/`;
3. **il core** — le 116 regole `body.outdoor-mode`, che sono codice morto
   dichiarato. ⚠️ Le 13 `body:not(.outdoor-mode)` **non** lo sono e il mandato
   lo dice: togliere il prefisso abbassa la specificità e può far vincere
   un'altra regola senza nessun errore da leggere.

## Prossimo passo atomico
1. **Raccogliere i tre cantieri**, uno per uno, verificando sulla copia di
   quello che si committa e scrivendo io i conti dei documenti.
2. ⚠️ Il cantiere del righello **cambierà i numeri del banco**: quando
   riconsegna, i due numeri delle passate nuove (3.694 e 3.696) vanno
   riverificati prima di fidarsi del giro.
3. ⛔ **Le 19 decisioni**: è venerdì 07/08, si applicano **a fine giornata** se
   non è arrivata risposta, dichiarandolo nel commit. «Entro venerdì» vuol dire
   fine del venerdì.
4. Poi: gli **altri quattro** commit che mordono (Campo `csvAppello`/
   `csvAttivita`, Sentinella `csvRicettori`/`contaCoperture`, Scudo
   `etichettaScadenza`) vanno confrontati con le righe dei loro documenti, come
   è stato fatto per la riga di Campo.

## Code aperte, dichiarate
- Le strisce di stato (in mano al cantiere 2).
- `.vita.danger` e `.riga.dng` di Terra non misurati da nessuno.
- 17 classi in Scudo, 13 in Conti, 18 in Terra che dipingono un fondo e non
  compaiono mai durante il giro.
- Le etichette della barra in basso di Conti tagliate a 430 px con dieci voci.
- Le altre dei checkpoint precedenti.

## Blocchi
Nessuno.
