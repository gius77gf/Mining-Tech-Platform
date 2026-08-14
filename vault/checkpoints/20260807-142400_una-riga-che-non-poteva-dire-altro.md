# Checkpoint — 2026-08-07 14:24:00 UTC

## Tipo
unit-complete (quattro unità: la riga diagnostica del core, la lezione in
CLAUDE.md, la verifica di C1, il riconteggio delle mancanze del delta)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`f928548` — *Le mancanze del delta ricontate leggendo i documenti: 54 → 41, e
le scadute 6 → 18*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|---|---|
| 156 | **la riga diagnostica del core** (`dd02ea1`) | tre copie della decisione sul tema → **una**; la riga ora misura invece di ripetere |
| 157 | **la lezione in CLAUDE.md** (`664b848`) | `sintassi-pagine` 15 → 14 e ritorno |
| 158 | **C1 verificata contro il codice** (`66679db`) | **una proposta su tre** era giusta com'era scritta |
| 159 | **le mancanze del delta ricontate** (`f928548`) | confermate **54 → 41**, scadute **6 → 18** |

## ⛔ Una riga che non poteva dire altro
Il pannello diagnostico del core scriveva «Outdoor mode: disattivato». Non era
un testo vecchio: era una **costante travestita da misura** — quel tema non
esiste dalla v4.4, ogni salvataggio riscrive `outdoor:false` e `applyTheme`
toglie sempre la classe. Su un pannello diagnostico, cioè il posto dove si va a
cercare la verità quando qualcosa non torna. È la forma più beffarda del
principio del fondatore: non un numero tranquillo dove non si è misurato
niente, ma **una riga di stato che non ha mai guardato il suo stato**.
E la causa era sotto: la decisione «siamo nel chiaro?» scritta **tre volte
identica**, e con dentro una regola di prodotto invisibile — l'`outdoor` di un
documento salvato prima della v4.4 **vale chiaro**, cioè la migrazione di chi
quel tema l'aveva acceso in cava. Adesso è una funzione sola.

## ⛔ Due «non c'è» su tre riscritti, di nuovo
C1 proponeva tre mancanze sulle verifiche periodiche delle attrezzature.
Verificate coi comandi: il **verificatore** non c'è davvero (`grep -ci
verificator|organismo` = 0 su tutti e quattro i file); il **verbale** invece si
può già allegare — manca il **legame** con la scadenza, che è un'altra cosa; e
l'esito **non è testo libero, non c'è affatto**, quindi non è un campo da
irrigidire ma da aggiungere. **La stessa proporzione del 01/08**, ed è la
ragione per cui niente entra sulla parola di chi propone.

## ⚠️ E un conto che misura una forma di scrittura, non la verità
Le mancanze del delta sono scese da 54 a **41** e le scadute salite da 6 a
**18** — tredici chiuse in cinque giorni, con la riga che se n'è accorta. Ma
**Scudo dà zero**, e non perché non abbia mancanze: le scrive con altre parole.
Dichiarato invece che incassato come un buon risultato: è la stessa cosa del
«2» di Terra, che sembrava un merito ed era un denominatore.

## Stato delle prove
Prove **2.251**, copertura 677/677, banchi 137, giro `node` **23 comandi,
0 caduti** verificato sulla copia a ogni commit.

## Che cosa sta girando adesso
**Quattro cantieri**, su superfici che non si toccano:
1. **il righello** — la geometria del gradiente in `contrasto.mjs`;
2. **Sentinella** — la barra a 320 px (328 px di contenuto in 302);
3. **il core** — le nove uscite: solo **due** sono premute da un banco;
4. **Scudo** — i tre campi della verifica periodica usciti da C1.

## Prossimo passo atomico
1. **Raccogliere i quattro cantieri**, uno per uno, sulla copia di quello che si
   committa, scrivendo io i conti dei documenti.
2. ⚠️ Quello del righello **cambierà i numeri** delle due passate nuove del giro
   (3.694 e 3.696): vanno riverificati prima di fidarsi.
3. ⛔ **Le 19 decisioni**: è venerdì 07/08. Si applicano **a fine giornata** se
   non è arrivata risposta, dichiarandolo nel commit.

## Code aperte, dichiarate
- Le sei tabelle del delta scrivono le mancanze in due modi diversi: il conto
  di B4 va uniformato o dichiarato ogni volta.
- Le altre dei checkpoint precedenti.

## Blocchi
Nessuno.
