# Checkpoint — 2026-08-10T00:30:19Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`7072988` — *fix(genesi,campo): il 2D che moriva in silenzio, e il numero uno
nelle frasi*

## Che cosa è stato fatto

Due cantieri chiusi e **rimisurati** prima di committare, le loro prove
integrate, e la sorveglianza del totale del giro — che senza questa
integrazione sarebbe già stata stale.

### Genesi · B0-nonies — la difesa disinnescata dal caso che deve coprire
`measureGeom2D` passava un dato di progetto **grezzo** a `.toFixed`: con
l'interasse assente la catena `measureGeom2D → renderScheda2D → draw2D →
setScreen` si spezzava e la scheda validatori usciva a **0 righe** invece di 28.
⛔ E il danno peggiore era il secondo: il toast di `volataSenzaValori` — scritto
apposta per dire *«un valore non si legge»* — stava nella riga **dopo**
`setScreen`, quindi **non veniva mai eseguito**.

| | prima | dopo |
|---|---|---|
| righe della scheda (`design.S:null`) | **0** | **28** |
| errori di pagina | 1 | **0** |
| toast | `""` | nomina l'interasse |
| volata sana | — | `diff -u` sulle 28 righe: **identiche** |

- **Perché moriva `S` e non `B`, `n`, `Lm`, e non è per caso**: quelli escono
  dalle coordinate dei fori, che sono sempre numeri (`c*null` fa 0). `Sm` era
  **l'unico che ripiegava su un dato grezzo**.
- La guardia scritta è **più stretta** di quella ovvia — `Number.isFinite(D2.S)`
  invece di `Sm===null` — perché quella reggeva su `null` ma **non** su `''`,
  `undefined` o una stringa. E l'uscita «senza fori» è stata normalizzata: *due
  uscite con due contratti sono una copia più debole.*
- ⛔ Il «Rapporto S/B» **non era un tranquillo: accusava** — «maglia stretta in
  larghezza», la colpa alla maglia per un campo che nessuno aveva compilato. Il
  badge non poteva vederlo: `null/3` fa **0**, finito, dentro la fascia bassa.
- Il motivo «non calcolabile» **non è stato ricopiato**: alla riga che c'era
  mancava **un parametro** (la coda), non un gemello. `nonCalcolabile(lab, why,
  coda)` ha assorbito anche le **quattro copie a mano** della stessa funzione:
  markup scritto **1 volta, 7 chiamanti**.
- Il toast spostato prima del disegno **non era dimostrabile sul caso di
  partenza** (col `.toFixed` chiuso arriverebbe comunque): è difesa in
  profondità, la seconda lettura di «non distingue». Dimostrata con un **guasto
  finto** in `renderScheda2D` — ordine nuovo: arriva; ordine vecchio: `"[]"`.

### Campo · B3-ter — la regola scritta due volte, la seconda più debole
«Sui **1** fori già caricati», mentre undici righe sotto la guardia esisteva.
- **Nessuna funzione nuova**: `plurale()`/`conta()` sono in `shared/` e Campo le
  importava già — sarebbe stata la **quinta copia**. Quello che mancava è che le
  frasi le componeva **la pagina** («la copia debole dove il documento si
  compone»): ora `frasiCaricoParziale(par, marca)` sta nel modulo. E `marca` è
  **un argomento, non una seconda funzione** — la prova in scratchpad ha
  bocciato la prima stesura, coi tag `<b>` stampati dentro il toast.
- **Censimento con denominatore**, non correzione a occhio: 499 slot, 59
  candidati, **36 scoperti → 24**, e i 24 rimasti letti **uno per uno** sono
  tutti non-difetti con la ragione. 14 frasi corrette, 3 guardie a mano
  assorbite.
- ⛔ **Il righello ha sbagliato due volte, e vale più del risultato**: il primo
  «slot» era *qualunque* codice fra due stringhe (493 candidati quasi tutti
  finti); e la ricerca della guardia dava `par.registrati` **protetta** da una
  guardia di un **altro** conto — cioè **assolveva proprio la riga del difetto**.
- ⛔ E perché nessun banco l'aveva preso: `DEMO.pianocarico` è `[]`, quindi
  `tagliaAUno` su una lista vuota non produce niente e **l'intera schermata del
  piano di carico non è misurata da nessun banco** che apra la dimostrazione.
  Segnalata come unità a sé, non fatta.

### Un numero atteso sbagliato, corretto invece che creduto
Il cantiere di Genesi consegnava le prove dicendo «il totale deve salire di
**43**». `run-kpi` conta i `test(`, non le asserzioni: sale di **4**. Scritto in
roadmap perché la prossima consegna non lo rifaccia.
`run-kpi` **2034 → 2038 → 2042**; copertura di nuovo verde, **725/725**.

### E il giro adesso apre i documenti
`giro-node.mjs`, dopo aver stampato il totale, apre i due documenti che lo
dichiarano e pretende lo stesso numero. Era rimasto **2.757** mentre il giro ne
eseguiva 2.815 — stale di 58 — sotto la riga che diceva *«dal 09/08 quel numero
non si scrive più a mano: lo stampa il giro»*. **Stamparlo e ricopiarlo restano
la stessa cosa finché nessuno CONFRONTA.**
⚠️ Il primo abbozzo saltava il controllo con `--tz` «perché con due passate si
guarda una volta sola»: ma le asserzioni sono **già** di una passata sola, e
quella guardia rendeva `giro-node --tz` cieco proprio sul controllo appena
scritto. Tolta.

## Verifica
Sulla **copia di ciò che si committa**, con `--tz`: **68 comandi a posto, 0
caduti**, **2823** asserzioni — e il numero previsto a mano (2.815 + 8) era
giusto, confermato dal controllo stesso.
⚠️ Le due righe di roadmap chiuse **dopo** la costruzione della copia sono
prosa; il numero che quel file dichiara è sorvegliato, e
`numeri-nei-documenti.mjs` sullo stato finale dà **41 passati, 0 falliti,
copertura 725/725**.

## Stato roadmap
Chiuse oggi: **B0-quinquies**, **B0-sexies**, **B0-octies**, **B0-nonies**,
**B3-bis**, **B3-ter**.
Aperte: **B0-septies** (la maglia degenere — decisione di prodotto, ferma al
fondatore; le sue misure sono ora scritte: con l'interasse assente il MIC passa
da 58 a **696 kg** e la PPV da 6,4 a **44,0 mm/s**), **B0-decies** (il recettore
assente che fa dire «SUPERA» a zero clic), **B4-bis** (le tendine del core),
**B0-bis**.

## Prossimo passo atomico
Raccogliere i **due cantieri ancora vivi** — le tendine del core (B4-bis) e il
censimento dei clamp su Scudo/Flotta/Conti/Terra/Sentinella — rimisurando ogni
affermazione **prima** di committare e mettendo nell'indice **solo** i file di
quel cantiere.
Poi integrare il banco `genesi-campi-assenti.mjs` (già scritto, in scratchpad,
229 righe) e registrarlo in `tutti.mjs`: adesso si può, perché B0-nonies è
chiusa — prima il giro sarebbe partito rosso per una ragione vera.

## Blocchi
Nessuno. Il giro del browser non è stato rilanciato: due cantieri tengono
Chromium (23 processi misurati), ed è anche la ragione per cui il giro `node`
sulla copia ha impiegato una ventina di minuti invece di quattro.
