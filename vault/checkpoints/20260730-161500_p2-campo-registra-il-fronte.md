# Checkpoint — P2, secondo pezzo: Campo registra il fronte

- **Tipo**: ponte fra le app, seconda metà
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `7a2da26`

## Cosa è stato fatto

- `api.frontiTerra()` in `campo-data.js`: seconda istanza dell'SDK sull'app
  «terra», **sola lettura**, percorso costruito da `orgCollection` (nessun
  percorso Firestore a mano, quindi l'isolamento fra organizzazioni vale anche
  qui). Se Terra non c'è torna `null` — non un elenco vuoto, che vorrebbe dire
  «non ci sono fronti» ed è una bugia diversa.
- La **tendina del fronte** nel rapportino di Campo, con tre stati distinti e
  nessuno dei tre muto:
  1. Terra risponde con dei fronti → si scelgono;
  2. Terra risponde ma non ne ha → «creali lì e compariranno qui»;
  3. Terra non è raggiungibile → il campo si spegne e dice perché.
- Si registra il **`fronteId`**, mai il nome. «Fronte non indicato» resta la
  prima voce: un turno che ha lavorato su due fronti non deve scegliere a caso,
  e il conto sa dichiarare quello che non è attribuito.
- Dati dimostrativi: gli **stessi tre fronti di Terra**, identificativi
  compresi, e **un rapportino di proposito senza fronte**.

## Le due prove che contano

- «i fronti della dimostrazione di Campo sono quelli di Terra»: se qui si
  inventassero altri identificativi, il ponte funzionerebbe in dimostrazione e
  si romperebbe in produzione — il modo peggiore di sbagliare, perché nessuno se
  ne accorge finché non è davanti a un cliente.
- «la dimostrazione esercita davvero la ripartizione»: pretende che ci sia sia
  produzione attribuita sia produzione senza fronte. Dati d'esempio che non
  toccano il caso interessante sono dati che mentono.

Totale prove **333 → 335**. Verificato nel browser: la tendina elenca i tre
fronti, il rapportino si crea col fronte scelto, nessun errore di pagina.
Sui dati dimostrativi il ponte dà: Fronte Nord 2.979 m³, Fronte Est 2.021 m³,
non attribuita 863 m³, copertura 85,3%.

## Prossimo passo atomico

**P2, terzo e ultimo pezzo: Terra mostra la ripartizione.** Nella sezione dei
fronti, accanto all'avanzamento misurato dal drone, la stima dai turni —
**tenuta visibilmente separata dalla misura**, perché una stima messa accanto a
una misura, nel giro di una settimana, diventa indistinguibile da essa. Vanno
mostrate anche la copertura e la quota non attribuita: se il 40% non si sa da
dove viene, la ripartizione non è una risposta.

## Tre difetti veri trovati dal cantiere delle anteprime, da chiudere dopo

1. **Sentinella**, a 390 px: la barra in basso taglia «REPORT».
2. **Core**, home: «Giuseppe F.» va a capo e la freccia di «Strumenti ufficio»
   finisce sopra la scritta.
3. **Genesi 3D**: i bottoni in alto si accavallano sul logo.

## Bloccanti

- Nessuno.
