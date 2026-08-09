# Checkpoint — 2026-08-09T00:28:51Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`47bb21d`

## Task completato

**La domanda dichiarata APERTA del filone è chiusa: una voce di costo senza
importo spariva in silenzio.**

`riepilogoCosti` la scartava alla **prima riga**, e da lì in poi non esisteva
per nessuno: né nel totale, né in `conto`, né nell'elenco a schermo, né nel CSV
che va dal commercialista.

⛔ **E la decisione non andava presa: era già presa dieci righe più giù nella
stessa funzione**, dove le voci senza **data** vengono contate e dichiarate
invece che buttate, col commento che spiega perché. Una correzione fatta a metà
del **proprio** file è la firma della copia debole, e qui i due casi erano nello
stesso posto.

## Le quattro cose imparate

1. ⚠️ **Quello che NON cambia va scritto quanto quello che cambia.** Sommare un
   importo che non si legge è impossibile, e se un negativo sia una correzione
   da contare è una domanda di prodotto **a sé**, che resta aperta. Totali
   invariati (6200 prima e dopo): cambia solo che l'omissione **si vede**.
2. ⛔ **La frase più tranquilla della schermata poteva essere FALSA.** «Nessuna
   voce lasciata fuori» guardava **solo** le voci senza data: dichiarava
   «nessuna» avendo in mano **uno dei tre** motivi. È il numero tranquillo nella
   sua forma verbale.
3. ⛔ **E LA PROVA DEL BANCO BENEDICEVA IL SILENZIO.** Pretendeva «nel file c'è
   la SOLA voce che ha un importo» — cioè esattamente il difetto — e il suo
   commento aveva perfino scritto che la domanda vera era un'altra «da aprire a
   parte», mentre l'asserzione la teneva chiusa. Quando si chiude una domanda,
   **si va a guardare la prova che la teneva aperta**.
4. ⚠️ **Un banco può contare come difetto un MIGLIORAMENTO.** Il KO
   preesistente di `conti-frasi-da-uno` (verificato lanciandolo anche su
   **HEAD**, per non attribuirmelo) pinnava la **punteggiatura** e non il
   singolare: la frase era diventata «1 preventivo esportato · 1 riga nel
   foglio». Corretto rendendo l'asserzione **più giusta, non più permissiva**.

✅ **E `iniezioni-fresche` — sistemato un'ora prima — si è ripagato da solo**:
ha preso in tre secondi l'iniezione di `conti-frasi-da-uno` scaduta sulla riga
che avevo appena cambiato. Senza, sarebbe rimasta muta fino al prossimo giro del
browser, cioè ore.

## Verifiche
- `run-kpi`: **1921 → 1922**, 0 falliti — il caso nuovo prova **tutti e quattro**
  i modi in cui un importo non si legge (`null`, stringa vuota, «abc», e lo zero
  **scritto**, che deve stare dalla parte di chi l'ha scritto)
- banco di Conti: **80 → 81**, 0 KO, e la terza gamba continua a tornare (12
  frasi confrontate col file)
- `conti-frasi-da-uno`: **41/41**; controprova **14/14 iniezioni**, 19 prove
  cadute
- `iniezioni-fresche`: **213/213**
- `node giro-node.mjs`: **32 comandi a posto, 0 caduti**, identità della patch
  verificata
- i tre documenti sorvegliati portati a **2.367**; il numero del «giro completo»
  è dichiarato **DERIVATO**, non rimisurato — perché non l'ho rimisurato

## Stato roadmap
Filone «i numeri che mentono con la faccia tranquilla»: la domanda *«chi decide
i numeri di ciò che ESCE?»* è chiusa su tutte le superfici, terza gamba
compresa, e adesso **non c'è più nessuna domanda di prodotto in sospeso** su
questo filone.

## Prossimo passo atomico
**Leggere il giro del browser** (pid 32676,
`scratchpad/resp/giro/registro4.txt`) quando ha finito.
⛔ Prima domanda: **«sta ancora scrivendo?»** — processo figlio vivo e file che
cresce — non «che cosa dice».
Poi `node apps/deepwork-id/tests/browser/leggi-giro.mjs <registro>` in
quest'ordine: **sezione 0** (età: attesta `7cddb59`) → **righe «non ho
guardato»** → **KO veri**.
⚠️ Quel giro attesta un commit di **prima** delle unità di stanotte: i suoi KO
sui file toccati (Conti, il core, Genesi) vanno riverificati sul commit di
adesso prima di aprirci un cantiere — è la sezione 0 che serve a saperlo.

## Blocchi
Nessuno.

## Note
Sette unità in questo blocco, tutte committate e spinte: `fe55bb6`, `cc8225e`,
`bfa4517`, `7581402`, `ba76ecb`, `34e20c3` e `47bb21d`.
