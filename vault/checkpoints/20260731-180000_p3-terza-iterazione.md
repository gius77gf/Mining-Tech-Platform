# Checkpoint — 31/07/2026 18:00 UTC

## Task completato
**S26 — ponte P3, terza iterazione: i cinque stati che non avevo mai visto a
schermo.** Con questo il ponte Campo ↔ Scudo ha le tre iterazioni che la direttiva
sull'eccellenza pretende.

| Commit | Cosa |
|---|---|
| `5fb5f58` | Un difetto nelle parole, due domande implicite chiuse |

## Il difetto, ed è di lingua prima che di codice
Il riepilogo diceva:

> «Di 2 persone non lo sappiamo: **non sono collegate** al personale di Scudo.»

Ma una di quelle due **è** collegata — a una scheda che non esiste più. Sono due
problemi diversi che portano a **due azioni diverse**:

| stato | cosa vuol dire | cosa si fa |
|---|---|---|
| `non-collegato` | un lavoro non ancora fatto | si apre «collega» e si sceglie |
| `collegamento-rotto` | qualcuno ha tolto quella scheda da Scudo | è un dato da **riparare** |

Ora si contano separati (`senzaCollegamento`, `collegamentiRotti`) e la frase li
distingue: *«una non è collegata al personale di Scudo, e per una la scheda
collegata non esiste più»*.

## Due domande implicite, chiuse e scritte
La direttiva dice che ogni virgola va decisa. Queste due erano *funzionanti* ma
**non decise**:

1. **Col filtro per squadra attivo, la nota conta le persone filtrate.** Giusto,
   perché la frase dice «fra chi è **in elenco**»: il conto e quello che si ha sotto
   gli occhi sono la stessa cosa. Un totale diverso da ciò che si vede costringerebbe
   a chiedersi quale dei due è vero.
2. **La sezione di Campo conta tutti, anche chi è in una squadra ferma.** È la
   *rubrica* di chi c'è in squadra, non il turno di oggi. La domanda «chi sta
   lavorando adesso» la risponde **Scudo**, dall'altro capo del ponte, dove le
   scadenze si contrassegnano «in turno». Due domande diverse, due posti.

## E quattro stati che non avevano niente che non andasse
Detto per intero, perché inventare una correzione dove non serve è un modo di
sprecare un'iterazione: **nessun operatore in anagrafica** (la nota non compare
affatto, invece di comparire vuota), **tutte le squadre ferme**, **il filtro
attivo**, e dal lato di Scudo la frase *«nessuna squadra risulta in turno»* —
finalmente **vista** invece che soltanto scritta.

## Stato
Suite: **318 KPI** (tre asserzioni nuove dentro una prova esistente), 72 stile,
7 demo, 43 helper, 23 pointcloud, 9 manifest. Verdi. Le dieci asserzioni che usano
il comando di collegamento continuano a passare.

## Prossimo passo atomico
**Il ponte P3 nel Quadro di Campo**, che è dove chi comanda il turno guarda per
primo. Oggi la risposta «chi è in turno è in regola?» vive solo dentro la sezione
delle squadre: chi apre l'app la mattina vede il Quadro e non sa che quella
informazione esiste. È il difetto classico di una funzione buona messa in una
stanza in cui nessuno entra.

Da fare, nell'ordine: (1) guardare **come sono fatte oggi le tessere del Quadro** e
decidere se questa è una tessera o una riga d'avviso — non aggiungere una tessera
per abitudine; (2) il vincolo che viene prima di tutto: **non deve diventare un
allarme che si accende sempre**, perché un cartello rosso fisso si smette di
guardare in tre giorni — quindi compare solo quando c'è davvero un documento scaduto
fra chi è schierato; (3) portarci il tocco alla sezione giusta, non un vicolo cieco;
(4) renderizzare e guardare, coi due stati (c'è qualcosa / non c'è niente).

Restano aperti e già scritti: la larghezza dei comandi di Scudo (36–38 px invece
di 44, compromesso misurato), il badge dell'idoneità (caso che la WCAG 2.5.8
esenta), i dodici campi interi di Genesi verificati solo montando la guardia e non
digitando (vivono tutti in modali), e i tre punti che aspettano il fondatore —
progetto Firebase (10 minuti), permessi per ruolo, blocco del turno chiuso lato
server.
