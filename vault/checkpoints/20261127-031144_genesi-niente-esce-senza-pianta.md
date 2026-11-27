# Checkpoint — Genesi: con la pianta non disegnabile nessun documento esce come se lo fosse

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit
Quello che contiene questo file («fix(genesi): con la pianta non
disegnabile nessun documento esce…»). Il precedente, `c8914900` (la Home alta
quanto un dito), è confermato dal giro `node` completo: 47 comandi a posto,
4523 asserzioni, uscita 0.

## Che cosa è stato fatto
- Dal rosso cronico di `genesi-campi-assenti` (aperto) a un difetto del
  PRODOTTO: una volata salvata senza spalla dichiara «Pianta non
  disegnabile», ma nove comandi producevano lo stesso il loro documento —
  scheda CSV con «Maglia;null×3.5 m» e «Carica totale;0», piano di carico
  vuoto scritto nella raccolta per Campo, DXF e XML a zero fori, report,
  finestra per Sentinella, simulazione, scatto A/B; e la riga in Home diceva
  «12 fori · 696 kg».
- Modulo: `nonEsceSenzaPianta(motivo, cosa, verbo)` — la frase, o stringa
  vuota se la pianta c'è. Pagina: `_senzaPianta(cosa, verbo)`, una guardia
  davanti ai nove comandi; `volSnapshot` scrive «pianta non disegnabile —
  manca …» nella riga che resta in Home. Salvare resta permesso.
- Prove: `run-kpi` 3259 → 3260 (controprova 5 difetti su 5);
  `genesi-maglia-assente.mjs` 16 → 31 controlli, bottoni veri, niente file,
  niente finestre, zero record per le altre app; verso opposto sul progetto
  sano. Seconda controprova `--controprova=documenti` (2 difetti, cadono
  11), registrata in `tutti.mjs`.
- Numeri: 3.762 prove senza rete; giro `node` 4524 (per somma: 4523 + 1 — da
  confermare); `genesi-data.js` 209/209; condivisi 383 su 383; 466
  esecuzioni nel browser; Genesi 151 funzioni nella pagina (51 su 151
  estraibili), tabella aggiornata.

## Lezioni di questa unità
- Una controprova sola non bastava: il difetto vecchio del banco spegne lo
  STATO («pianta non disegnabile»), e sotto di lui la sezione nuova si
  dichiara «non misurata» — le sue due iniezioni non venivano mai provate, e
  il banco usciva lo stesso «controprova ok». Quando una sezione ha una
  precondizione che un'altra iniezione distrugge, le serve una controprova
  sua.
- Una guardia messa sul DISEGNO non protegge le USCITE: è la domanda di
  CLAUDE.md («dove questa app compone qualcosa che esce, chi decide?»)
  rifatta su uno STATO invece che su un numero.
- Aggiungere una funzione alla pagina di Genesi sposta la tabella
  `genesi-estraibili` in `docs/DEVELOPMENT.md`: l'ha detto
  `numeri-nei-documenti`, non la memoria.

## Stato roadmap
Chiusa «con la pianta non disegnabile nessun documento esce come se lo
fosse». Aperte: «`genesi-campi-assenti.mjs` è rosso dal 14/09» (la terza
sezione è ancora da riscrivere), «Genesi → Campo — il piano di carico CSV…»
(fuori mandato), «il piede che esce dalla faccia» (decisione 35), E7.

## Prossimo passo atomico
**Chiudere il rosso cronico di `genesi-campi-assenti.mjs`** (adesso si può:
la verità di oggi è misurata).
1. `apps/deepwork-id/tests/browser/genesi-campi-assenti.mjs`, da «la terza
   domanda» in giù. Riscrivere, senza allentare:
   · `apriSenza("B")` e `apriSenza("B", { stem: 1.6 })`: zero errori, zero
     fori, la scheda dice «Pianta non disegnabile: manca burden» e NON
     contiene «GITTATA» né una distanza di sgombero; premendo
     `btn-scheda-csv` non esce nessun file (c'è già `nonEsceSenzaPianta`);
   · `apriSenza(null)`: «101 m» e «202 / 404 m», e il verdetto del flyrock
     inverso; `apriSenza(null, { stem: 1.6 })`: «174 m».
   Togliere i due `nonMisurati.push` che oggi scattano per costruzione,
   tenendo la precondizione vera (la pagina si è aperta nel 2D).
2. Ricontare il denominatore stampato in fondo («… 9 sulla SPALLA»).
3. Nel commento: la forbice «fra 101 e 133 m» non è raggiungibile dalla
   pagina; la provano «gittataSenzaSpalla: dove la spalla DECIDE…» e «…NON
   decide…» in `run-kpi`.
4. Controprova del banco (le sue iniezioni sulla spalla: guardare quali
   restano sensate), poi sano; aggiornare la voce di roadmap.
5. A parte: «manca burden» → la parola del campo («la spalla»): tocca
   `magliaAssenteMotivo`, due punti della pagina, `nonEsceSenzaPianta`, e le
   prove che lo citano (`genesi-maglia-assente`, `genesi-campi-assenti`,
   `run-kpi`).

## Blocchi (del fondatore)
Decisioni 28, 33 (⚠ quale foro usa la gittata), 34 (lettore LAZ), 35 (spalla
al piede), 36 (accenti nei CSV: prima la prova con Excel); 32 rimandata.
