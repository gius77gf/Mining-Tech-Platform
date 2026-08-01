# L'onere di escavazione, e il caso che ha cambiato il disegno

**Data:** 01/08/2026 · **App:** Terra
**Unità precedente:** `20260801-045000_la-sentinella-che-non-chiudeva.md`

## Cosa è stato fatto

La seconda voce dell'elenco di `docs/RICERCA_DOCUMENTI_ENTI_202607.md` — *«i 5
documenti da fare per primi»* — è il **riepilogo annuale dei volumi con il
calcolo dell'onere di escavazione**: la scadenza che «fa perdere giornate
intere», e che in alcune regioni va presentata **anche se non si è estratto
nulla**.

I volumi c'erano già (`riepilogoAnnuale`). Mancava il conto. Adesso ci sono:

- **`onereEscavazione(riepilogo, { tariffaEuroM3, volumeDetrattoM3 })`** — il
  lordo, il detratto per recupero, l'imponibile, l'importo, e la **banda
  d'incertezza** del volume;
- **`descriviOnere(onere)`** — la riga come va scritta sul foglio.

## ⛔ La tariffa non sta nel codice

Cambia da regione a regione e da titolo a titolo: la scrive il cliente nella
scheda del titolo. Senza, la risposta **non è zero** — è «non calcolabile», con
scritto dove si imposta. Un «€ 0» su un documento che va all'ente non è un
vuoto: è una **dichiarazione**.

Ma una tariffa **di** zero (una regione che non la chiede) è un dato, non
un'assenza, e allora il conto si fa e l'importo è davvero zero. Le due cose sono
provate separatamente.

## ⚠️ Il caso che ha cambiato il disegno, e che avevo sbagliato

Il prototipo in scratchpad ha prodotto questo risultato:

> **anno con un solo rilievo di CUMULO** → non calcolabile

Il mio primo istinto è stato che fosse sbagliato: un rilievo c'è, quindi l'anno
è *misurato*, quindi lo scavo è stato zero, quindi l'onere è **zero euro** —
vero e dichiarabile.

**È sbagliato l'istinto.** Un rilievo del cumulo misura **il mucchio, non il
fronte**: di quanto sia stato tolto dal fronte, quell'anno, non si sa niente.
Scrivere «€ 0 dovuti» su un foglio che va all'ente vorrebbe dire **dichiarare in
difetto** una cosa che nessuno ha misurato — la faccia peggiore del principio
dell'assenza, perché qui il numero tranquillo lo legge un ispettore.

La ragione è scritta nel modulo, per esteso, perché il prossimo lettore avrà lo
stesso istinto che ho avuto io. Ed è **esattamente** il motivo per cui
`CLAUDE.md` pretende il prototipo in scratchpad prima di scrivere nel modulo:
leggendo il piano, quel caso non si vede.

E il motivo che la funzione restituisce chiude il cerchio: dice che «zero
misurato» e «non misurato» per l'ente non sono la stessa cosa, **così chi non ha
davvero estratto niente lo dichiara** invece di lasciarlo dedurre.

## ⚠️ E la regola 20 ha bocciato la mia funzione dieci minuti dopo

Scritta `onereEscavazione`, `run-stile` è passata da **271 a 269**. Non due
prove fallite: due **in meno** — cioè il caso che `CLAUDE.md` dice di guardare
sempre («si controlla che il totale sia SALITO, non solo che i falliti siano
zero»).

La causa: **la regola 20**, scritta da me poche ore prima. `onereEscavazione`
dichiara `calcolabile` e **nessuno lo leggeva**, perché avevo scritto lo strato
dati e non il lettore. Una bandiera che non legge nessuno non protegge niente.

Il rimedio giusto non era spegnere la regola: era il disegno che la regola
indica, e che il progetto usa già in `origineDi` → `descriviOrigine`. La frase
che va all'ente è una **regola**, non un disegno: la scrive il modulo, e la
pagina di stampa non deve decidere come si racconta un onere non calcolabile.
Da lì è nata `descriviOnere`, che è anche il pezzo che serviva comunque.

## Le frasi, come escono

> Volume scavato 20.000 m³, meno 2.000 m³ detratti per recupero: imponibile
> 18.000 m³ × 0,52 €/m³ = € 9.360,00.

> La tariffa al metro cubo non è impostata: cambia da regione a regione e da
> titolo a titolo, quindi l'app non la inventa. Scrivila nella scheda del titolo
> e il conto si fa da sé.

> Nessun rilievo di scavo nel 2026: il volume dell'anno non è stato misurato,
> quindi l'onere non si può calcolare. Se in quest'anno non si è estratto nulla
> va dichiarato a parte — per l'ente «zero misurato» e «non misurato» non sono
> la stessa cosa.

## Verifica

- **5 prove nuove**, `run-kpi` **1108 → 1113**, 0 falliti. `run-stile` 271/0,
  `run-demo` 8/0, `run-helpers` 49/0, `run-pointcloud` 26/0, `run-manifest` 9/0.
  **Totale 1.476.**
- Copertura **458/458**, Terra **50/50**; fondo di Terra alzato 48 → 50.
- Sonda del vuoto 7/0, nomi doppi 0 da sistemare, `numeri-nei-documenti` 17/17
  coi tre documenti aggiornati **dalla misura** (e gli addendi che tornano:
  1113 + 271 + 49 + 26 + 9 + 8 = 1.476).
- **Controprova, 3 iniezioni su una copia, 3 cadute**, con i caratteri stampati:
  il cumulo che torna a pagare (**−18**), la tariffa assente che torna a valere
  zero euro (**+12**), e la guardia rilassata a `!rilieviScavo && !rilieviCumulo`
  (**−20**) — quest'ultima fa dichiarare **€ 0 all'ente** su un anno in cui si è
  misurato solo il mucchio. È la prova che il caso del prototipo è reale.

## Prossimo passo atomico

La **pagina di stampa** del riepilogo annuale, che consuma `descriviOnere` e i
due campi che il cliente imposta (tariffa €/m³ e volume detratto per recupero).
⚠️ È una modifica visiva: vuole lo scatto, quindi aspetta che il giro del
browser liberi la CPU. Il giro è a 319 asserzioni, banco 12 su 37, senza nessun
KO fuori dalle sezioni di controprova.
