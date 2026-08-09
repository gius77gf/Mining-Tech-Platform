# Checkpoint — 2026-08-09T22:13:17Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`a3757c8`

## Task completato

**Il campo vuoto resta vuoto: le tre guardie costruite oggi non si spengono più
in due clic.**

| | |
|---|---|
| difetto | `applyDesign` metteva **5 kg/foro** su un valore assente |
| via | **due clic**, e il secondo non passava dalla carica |
| campi che inventano il proprio minimo | **24 su 27**, contati nel browser |
| `run-kpi` | 2017 → **2026** |

## Le tre cose imparate

1. ⛔ **UNA GUARDIA CHE SI PUÒ SPEGNERE DA UN'ALTRA PARTE NON È UNA GUARDIA.**
   MIC, carica totale col costo e frammentazione dicevano correttamente «non
   calcolabile»… finché non si toccava **un campo qualunque**, e `applyDesign`
   rimetteva numeri inventati. Il lavoro di tre unità si annullava in due clic,
   **senza un toast e senza un errore**.
   ⚠️ E peggio di come l'avevo scritto: dopo il secondo clic **il campo mostrava
   ancora `0` mentre il progetto usava `5`** — schermo e calcolo in disaccordo,
   perché `applyDesign` non richiama `syncDesignInputs`.
2. ⛔ **IL `null` MORIVA PRIMA DI ARRIVARE A CHI LO SAPEVA LEGGERE.** `gsv`
   faceva già la cosa giusta (`v == null || !isFinite` → campo vuoto), ed è così
   che si comportano **tutti** gli altri campi di Genesi. Era `Math.round(D2.kg)`
   a **distruggere il `null`** un istante prima. Cioè la difesa c'era: qualcuno
   le passava davanti.
3. ⛔ **UN CAMPO VUOTO È MUTO**, ed è il difetto del 03/08. Quindi
   `volataSenzaValori` **nomina** all'apertura i campi senza valore leggibile,
   col nome che si legge sullo schermo, e il campo porta
   `placeholder="vuoto = non calcolabile"`. Un'assenza va **detta**, non solo
   non-inventata.

## Il pezzo di metodo che vale
⛔ **La prova che conta guarda il PERCORSO, non le funzioni.** Le altre prove
chiamano `micFinestra`, `caricaTotale`, `fragKuzRam` e le trovano corrette —
ed erano corrette. Il difetto viveva **fra** di loro. La prova nuova modella il
giro intero (salvo con la carica illeggibile, riapro, tocco un altro campo
cinque volte) e **pinna i due numeri inventati che il browser aveva misurato**
(60 kg totali, X50 127 cm). L'iniezione che la fa cadere produce un esito rosso
**identico** a quello del browser: `{kg:5, mic:5, qtot:60, costo:1194,
pf:0.0476, x50:127.13}`.

## Le due bozze bocciate in scratchpad
- il controllo sui **limiti** usava `Number.isFinite(+min)`, e **`+null` fa 0**:
  un minimo assente passava e stringeva contro zero. La trappola nominata in
  `CLAUDE.md`, **in un argomento a cui nessuno guarda**;
- **arrotondare prima o dopo il clamp**: con un minimo non intero, 2,4 esce 2,5
  prima e 3 dopo. Tenuto «prima», come lo scriveva la pagina.

## Verifiche
- `giro-node` **34 comandi a posto, 0 caduti** sulla copia del committato;
  asserzioni **2791 → 2800**
- `run-kpi` **2026/0** · `run-stile` **318/0** · `sintassi-pagine` 34/0 ·
  `copertura` 0 scoperte (fondo `genesi-data` 54 → **57**) ·
  `iniezioni-fresche` **309/309**
- **dieci** controprove, tutte cadute, ripristino **da copia** con `diff -q`
- i clamp **mordono ancora**: la prova `UN CLAMP NON È UNA GUARDIA` passa, più
  una gemella che pretende che i limiti 5–200 siano ancora scritti nella pagina
- caso sano invariato: `kg 58,4` → campo «58», totale «701», MIC 58,4, X50 28

## Aperto, contato e non stimato
**B0-sexies**: restano **15** campi con la stessa forma (24 su 27 inventano il
minimo al secondo clic). ⛔ Ma la geometria **non si corregge solo in
`applyDesign`**: `pfNominale()` scrive `(D2.B||3)*(D2.S||3.5)*(D2.prof||10)` —
una **seconda invenzione a valle**, raggiungibile **già subito dopo `apri`** e
letta da quattro punti. **Cantiere aperto adesso**, con le due metà insieme.
Fuori di proposito: `psCharge` (farla a metà è peggio) e i due del recettore,
che inventano nella direzione che **allarma** e toccano `ppvLimit`.

## Prossimo passo atomico
1. Raccogliere il cantiere della geometria, **rimisurare**, committare io.
2. **B0-quinquies** (`#sm-cava` del core: prima chiedere **perché la scatola è
   142 px**, non accorciare la parola) e **B3-bis** (il quinto bottone d'uscita
   di Campo).
3. Rilanciare il giro del browser **quando non ci sono cantieri col browser
   aperti** — è la misura di B0.

## Blocchi
In attesa del fondatore: **quali** delle 47 mancanze confermate diventino
lavoro; se `disponibilitaTurno` debba restare **100%** su un turno chiuso senza
fermi; le righe dell'Allegato VII da aggiungere a `SCADENZE_PRESET`.
