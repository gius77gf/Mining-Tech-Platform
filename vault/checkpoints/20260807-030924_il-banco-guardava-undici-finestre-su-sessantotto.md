# Checkpoint — 2026-08-07 03:09:24 UTC

## Tipo
unit-complete (sei unità: registro infortuni marchiato, mora sullo stornato,
Terra+Sentinella raccolte, canarino, rilevatori unificati, le modali del core)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`e5b1405` — *Il banco delle modali guardava 11 finestre su 68 del core: adesso
ne apre 38, e dentro c'erano numeri da chiamare alti 15 px*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|---|---|
| 106 | **il registro infortuni marchiato** (`38fdb23`) | 4 CSV, e il banco passa a **36 bottoni / 33 file** |
| 107 | **la mora sullo stornato** (`c59eb83`) | `apertoDi(f, note)` in **12 chiamate su 15** |
| 108 | **Terra + Sentinella con un dato solo** (`5b4c82e`) | **9** frasi, terra 35 → **48** prove |
| 109 | **canarino** (`a5b9a37`) | ciclo vivo alle 02:47 UTC |
| 110 | **i rilevatori unificati** (`38a03da`) | Scudo da 8/20/6 a **19/37/8**, resta 44 ok / 0 KO |
| 111 | **le modali del core** (`e5b1405`) | **11 → 38** su 68, **176** aperture vere |

## ⛔ Il banco che guardava un terzo di quello che credeva
Sul core apriva **11 modali su 68**, e le «436 aperture» erano **gonfie**: non
guardava com'era la finestra *prima* del click, quindi una modale rimasta aperta
faceva rispondere «aperta» a ogni tocco. Tre cause, tutte misurate — e la prima
vale per chiunque scriva un banco:
1. il controllo «sono rimasto dove ero?» era `p.url()`, e in una app a
   **schermata sola** l'indirizzo non cambia mai: rispondeva **sempre di sì**.
   Il giro credeva di essere in `@cave` e misurava `@notifiche`;
2. «mi sono spostato» ha **due significati opposti**: confinandolo, il giro ha
   perso **tutte** le schede di dettaglio, che non sono sezioni ma un piano più
   sotto;
3. `SEZIONI_CORE` conteneva **17 schermate su 33** — cioè *ogni* banco del
   browser guardava metà core.
Dentro le finestre nuove: **cinque `<a>` alti 15 px** (numeri di telefono, e
l'unico ponte dalla scheda rapportino al progetto), la **data tagliata** proprio
dove distingue cinque rapportini fra loro, e la Dashboard che rendeva il
documento largo **678 px su uno schermo da 390** — due `<canvas>` in una griglia
senza `min-width:0`, e un canvas senza attributi vale **300 px per specifica**.

## ⛔ Due elenchi di rilevatori invece di uno
`scudo-frasi-da-uno.mjs` teneva le **sue** liste, scritte a poche ore da quelle
condivise, e **già diverse**. È il difetto di CLAUDE.md applicato ai controlli,
nella forma peggiore: «nessuna frase al plurale» voleva dire due cose diverse a
seconda del banco, e **nessuno se ne accorgeva perché erano tutt'e due verdi**.
⚠️ Non ho fuso gli elenchi — sarebbe la mossa ovvia e sbagliata: allargare il
condiviso rende più severi **tutti** gli altri banchi in una volta, e l'ampiezza
di un controllo è un numero che si misura **prima**. Scudo importa il condiviso e
tiene solo il **delta**, dichiarato parola per parola.

## ⛔ E il registro infortuni usciva senza dirsi dimostrazione
Scudo dichiarava i dati d'esempio sui fogli **stampati** da sempre, e non sui
**CSV**: quattro file, fra cui quello che si porta a un ispettore. La forma più
insidiosa — chi vede la pagina dichiararsi due volte non sospetta che il file
taccia. E la controprova **ha detto di essere mezza cieca** («0 chiamate tolte»)
invece di tacere: sono **due elenchi che vanno tenuti insieme**.

## Stato delle prove
Prove `node` **2.196**, copertura **662/662**, banchi **122**. Giro `node` 21
comandi, 0 caduti sulla copia di ogni commit. Controprove **rilanciate da me**:
Scudo 17/17, Conti 14/14, Terra **20/20**, campo-sentinella cade come deve.

## Che cosa sta girando adesso
1. **Il giro completo del browser** su una copia di `e5b1405` — è la prima volta
   che gira con `SEZIONI_CORE` a **26 schermate** invece di 17: possono uscire
   violazioni vere mai viste, ed è per questo che va guardato.
2. **Un cantiere** sul solo KO rimasto: a 320 px, con una finestra aperta dentro
   una scheda di dettaglio, il documento va a **333 px** e **nessun elemento
   sporge a destra** — è il traboccamento **all'indietro**, che
   `scrollWidth > clientWidth` non sa raccontare.

## Prossimo passo atomico
1. **Leggere il giro completo** e raccogliere il cantiere del 320 px. ⛔ Un banco
   registrato che fallisce rende rosso il giro di tutti: quel KO va chiuso prima
   di aprire altro.
2. **Ad albero fermo**, tre cose già progettate e misurate:
   · la correzione del **motore dei grafici** col suo banco
     (`docs/IL_GRAFICO_DISEGNATO_ALLA_MISURA_DI_FUORI.md`);
   · il **pieno senza spesa** nei dati d'esempio di Flotta — renderebbe
     **visibile** una funzione e **misurabile** una regola in un colpo solo;
   · il **censimento delle classi orfane** dentro le prove.
3. **`unita-maiuscole` guarda le maiuscole**: ignorandole escono **15 casi in
   più, 4 falsi allarmi** (`DB` il database, `H` l'altezza) e **11 veri, tutti
   nel core** — `MC TOTALI`, `KG/FORO`, `KG/MC`. La stretta costa quattro nomi
   da dichiarare: è una decisione, e il numero c'è già.
4. ⚠️ **Le 19 decisioni**: è venerdì 07/08 dalle 00:00 UTC, ma «entro venerdì»
   vuol dire **a fine giornata**. Non applicate all'alba: si applicano se a fine
   giornata non è arrivata risposta, dichiarandolo nel commit.

## Code aperte, dichiarate
- **Il KO del 320 px** (sopra), affidato a un cantiere.
- **Genesi**: l'XML con l'id interno dell'esplosivo; la Home che esporta lo stato
  del 3D invece di quello aperto — decisione, non copia debole.
- **Conti**: `.meta.pesa` taglia 15 px su 1 riga DDT su 5.
- **Scudo**: le tre copie di `.fld`/`.fcamp` divergono sul `gap`, e unificarle
  cambia Terra (53 usi).
- Il **minimo di visibilità** dei grafici e `#ppv-scelta` di Sentinella:
  misurati, dichiarati.

## Blocchi
Nessuno.
