# Checkpoint — 2026-08-09T02:05:00Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`a867e71`

## Task completato

**`fuori-schermo` fa la domanda A anche a 320 px**, e il numero che la riga di
roadmap dichiarava mancante adesso c'è: **zero allarmi nuovi**.

Per settimane le due domande del banco hanno guardato larghezze diverse — A
(«la pagina esce dallo schermo?») a 390 e 360, B («l'elemento esce dal suo
riquadro?») anche a 320 — e il prezzo era già stato pagato: il **traboccamento
del corpo del core a 320 px** (333 px in 320, l'indirizzo del CDN in una parola
sola da 60 caratteri) l'ha trovato una misura **a mano**, non questo banco.

## La cosa imparata

⛔ **IL COSTO DELLA STRETTA SI MISURA, NON SI TEME** — e la riga precedente
faceva la cosa giusta a dichiararlo mancante invece di inventarlo: diceva «il
tentativo di oggi non è riuscito perché il server statico di prova non si è
alzato, quindi il numero **non c'è ancora**». Misurarlo è costato **una
passata**:

| domanda | larghezze | esito |
|---|---|---|
| A · esce dallo schermo | 320 (solo) | **0** su 12 schermate, 4.393 elementi |
| A+B · tutte e tre | 390, 360, 320 | **36 schermate pulite, 0 fuori posto**, 13.180 elementi |

I 10 (poi 28) segnalati sono **tutti** della domanda B e stanno già
nell'arretrato dichiarato: 2 del core (il nome nel `.logo-sm`, il «3» della
campanella) e 8 di Sentinella. Cioè la larghezza su cui vive **Campo** smette
di essere un punto cieco senza rendere rosso il giro di nessun altro.

## E, di fianco, la seconda gamba chiusa su Genesi

`genesi-foglio-in-cava.mjs` leggeva il documento come **testo** e non ne
guardava mai le dimensioni: era l'ultima superficie che stampa senza una misura
di larghezza. Adesso il foglio viene **reso** in una pagina alla larghezza della
carta e misurato, coi nodi di testo compresi (la scatola anonima che
`querySelectorAll` non vede).
⚠️ **Il denominatore è dichiarato, e qui è più debole che in Scudo**: il
documento di Genesi **non porta nessuna regola `@page`** — cercata, non c'è —
quindi la carta non si può leggere dal foglio come si fa lì, e si ripiega su A4
coi margini del browser (190 mm = **718 px**). Il ripiego è **scritto nel
banco** invece che nascosto: se un giorno Genesi dichiarasse la sua carta, la
misura andrebbe letta da lì.

## Verifiche
- `fuori-schermo` a 320 su tutte le superfici: **12 schermate pulite, 0 fuori
  dallo schermo**
- `fuori-schermo` con le tre larghezze: **36 schermate pulite, 0 cose fuori
  posto**, 13.180 elementi guardati
- controprova del banco rilanciata dopo la modifica: **105 cose fuori posto, 0
  schermate pulite**, e i KO voluti compaiono **anche a 320** — che è la prova
  che la larghezza nuova viene davvero chiesta
- `genesi-foglio-in-cava`: **36 passati, 0 falliti**; controprova **7/7 difetti
  rimessi, 13 prove cadute**; `iniezioni-fresche` **215/215**
- `run-stile` 318/0 · `numeri-nei-documenti` 26/0 · `sintassi-pagine` 34/0

## Stato roadmap
- ✅ chiusa la riga «`fuori-schermo` chiede la domanda A a 390 e 360»
- ⏱️ **B3 rimisurata**: diceva **171** funzioni nella pagina di Genesi e sono
  **166**; **87** estraibili e sono **82**. È la **terza** rimisurazione in tre
  giorni («186 → 174», poi 171, oggi 166): un conto che si muove da solo va
  **derivato da un comando**, e adesso la riga dice quale
- resta aperta la riga dei fogli stampati solo per il collegamento finale del
  pezzo di Genesi al giro

## Prossimo passo atomico
**Leggere il giro del browser** (pid 32676,
`scratchpad/resp/giro/registro4.txt`, attesta `7cddb59`): alle 02:00 era vivo
da 2h55 con 337 intestazioni e stava scrivendo. Prima domanda **«sta ancora
scrivendo?»** (figlio vivo + CPU che sale), poi `leggi-giro.mjs` nell'ordine
**sezione 0 (età)** → **righe «non ho guardato»** → **KO veri**.
⛔ Quel giro attesta un commit **prima** delle unità di stanotte: i suoi KO
vanno riverificati sul commit di adesso prima di aprirci un cantiere.

## Blocchi
Nessuno.
