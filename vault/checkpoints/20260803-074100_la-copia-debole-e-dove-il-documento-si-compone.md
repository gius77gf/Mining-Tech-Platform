# Checkpoint — 2026-08-03 07:41:00 UTC

## Tipo
unit-complete (quattro unità: CLAUDE.md, PDF fochino, parole del mestiere, Campo)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`5b10204` — *Campo: nel file esportato una giornata con tre guasti mai misurati
è identica a una senza fermi*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|---|---|
| 24 | **la copia debole ha un indirizzo** (`9a6689d`) | 24 difetti in 5 app, e stanno **tutti** dove il documento si compone |
| 25 | **il PDF del fochino** (`396449b`) | stampava tutto tranne **il numero per cui esiste**: i chili di esplosivo |
| 26 | **le parole del mestiere** (`91d0a3a`) | vocabolario **corretto**; una proposta su due **falsa** (Genesi ha già «Sequenza di sparo», `genesi.html:663`) |
| 27 | **Campo** (`5b10204`) | nel CSV una giornata con **tre guasti mai misurati** è identica a una senza fermi; e **2.300 t** sparivano dallo storico |

⛔ **La regola generale scritta stanotte, e vale per chi legge domani:**
*dove questa app compone qualcosa che **esce** — un CSV, un PDF, una frase di
riepilogo — chi decide i suoi numeri?* Se la risposta non è «la stessa funzione
che li decide a schermo», lì c'è una copia debole. È il posto dove nessuna prova
guarda, perché le prove chiamano il modulo e i file li compone la pagina. Il
censimento statico su quelle cinque app era **a zero**.

## Una controprova che misurava la fortuna
Aggiungendo la sezione «Esplosivo» al PDF è caduta la controprova della regola
10 di `run-stile`: la regola guarda una **finestra** di 500 caratteri, e i miei
spostamenti hanno fatto cadere due punti campionati appena prima di un
`empty-sub` che c'era già. Lì il difetto è **davvero innocuo** — l'iniezione che
non inietta, terza causa di «non distingue». Ma il punto vero è un altro: **una
controprova che dipende da dove cadono i campioni non misura la regola, misura
la fortuna.** Adesso i punti inadatti si scartano, **si contano e si stampano**
(«15 superfici, 111 punti, 2 scartati perché lì il difetto sarebbe innocuo»), e
una seconda guardia fa cadere la prova se gli scarti la svuotano.

## Stato delle prove
run-kpi **1599**, stile 284, helpers 63, pointcloud 32, manifest 9, demo 8 →
**1.995** senza rete; **63** banchi del browser; copertura **639/639** (Campo
103 → 106); 65 file collegati; giro `node` **20 su 20**.

## Che cosa sta girando adesso
- **due cantieri**: **Scudo** e **Genesi**, tutt'e due con la banda già scritta
  in `run-kpi.mjs` e un banco nuovo registrato in `tutti.mjs` — vanno raccolti
  tagliando la **loro** banda, non l'intero blocco finale (stanotte quattro
  bande diverse hanno convissuto nello stesso file);
- **il giro completo del browser** su una copia di `613c3b6`;
- due banchi sul **core** con l'accesso nuovo (`contrasto`, `unita-maiuscole`),
  per sapere che cosa diventa visibile prima di committare `giro.mjs`.

## ⏳ L'unità aperta sul disco, e la ragione per cui non è ancora committata
`apps/deepwork-id/tests/browser/giro.mjs` + `LEGGIMI.md`: **il core si fermava
sulla schermata d'accesso per tutti i banchi**. Misurato: 1.036 elementi ma
**258 caratteri di testo e UN bottone**, `screen-login`; con l'accesso vero
**658 caratteri, 8 bottoni**, `screen-home`. `state.user` iniettato non basta,
perché senza dati il `DB` è vuoto.
⚠️ **Non basta nemmeno l'accesso**: `modali-dentro --solo=core` con la
correzione continua a dire **0 modali aperte su 68, con 6.800 comandi provati**.
La causa seconda non è ancora trovata — il rilevatore cerca `#modal.show` +
`.modal-box` + `#modal-title`, e il core li ha tutti. Prima di committare va
saputo che cosa diventa rosso: una correzione che rende visibili difetti veri è
giusta, ma il giro non deve diventare rosso in silenzio.

## Prossimo passo atomico
1. Leggere `scratchpad/capo/core-banchi.txt` (contrasto e unità sul core con
   l'accesso vero): se il core resta pulito, committare `giro.mjs` + `LEGGIMI`
   dichiarando che le modali restano scoperte; se no, contare i difetti e
   decidere se correggerli o dichiararli come arretrato, mai spegnerli.
2. Raccogliere **Scudo** e **Genesi** app per app, con la solita procedura.
3. Poi: la seconda causa della cecità sulle modali, e le tre superfici che il
   banco dichiara di non aver guardato (core, vetrina, terra).

## Code aperte, dichiarate
Immutate: il salvataggio del rapportino (decisione di venerdì), `riepilogoCosti`
di Conti, `+null` nelle letture di Sentinella, `riepilogoControllo.gravita` di
Flotta, la scorciatoia ES6 per la regola 20. In più, da Campo: la
`consegna_turno.txt` perde i **minuti** dei fermi rispetto allo schermo — non è
una bugia, è una perdita di dettaglio, ed è il candidato per una terza passata.

## Blocchi
Nessuno. Al fondatore restano **19** decisioni.
