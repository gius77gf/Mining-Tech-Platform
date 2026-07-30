# Checkpoint — 30/07/2026 06:00 UTC

## Task completati
**La virgola decimale, chiusa su tutte e sei le app — e ricondotta a UNA regola.**

| Commit | Cosa |
|---|---|
| `88ba5a1` | Genesi: via i tre dialoghi del browser, dentro la modale del core |
| `14aadf3` | Core e Deepwork ID: gli ultimi tre dialoghi del browser |
| `78e59ec` | Le regole vincolanti diventano controlli automatici (`run-stile.mjs`) |
| `26e6f0e` | Genesi: la virgola nei parametri di volata |
| `a1d8436` | Campo: la virgola sulla carica per foro, che finisce in Genesi |
| `74e6712` | Piano di carico: le colonne si leggono per nome, non per posizione |
| `3aa2037` | Revisione dei cantieri Flotta, Conti e Terra |
| `1385928` | **Una convenzione sola, in `shared/`** |
| `4f4b4d3` | Genesi sulla convenzione condivisa: tutte e sei allineate |

## Il filo della giornata: lo stesso difetto, quattro volte la stessa forma
Tre volte in ventiquattr'ore ho trovato **una causa sola travestita da tre
difetti locali**:
1. le **unità in maiuscolo** — corrette in Terra, poi in Sentinella, poi in
   Campo; la causa stava in `shared/dw-grafici`;
2. i **dialoghi del browser** — sei posti, di cui due nel core, che è il
   riferimento che le app devono copiare;
3. **come si legge un numero scritto a mano** — quattro copie della stessa
   convenzione, e le sei app che leggevano «1.250» in **tre modi**: Flotta
   chiedeva sempre, Conti e Terra risolvevano quando una sola lettura era
   possibile, Sentinella/Campo/Genesi prendevano 1,25 **in silenzio**.

La lezione non è «fare attenzione»: è che una convenzione condivisa **deve stare
in `shared/`**, altrimenti si riscrive da sola in ogni app e diverge senza che
nessun test se ne accorga. Per questo oggi è nato `run-stile.mjs`.

## Il difetto peggiore misurato oggi
`<input type="number">` in Chromium: digitando «2,4» il `.value` diventa **«24»**
e `checkValidity()` risponde **true**. Il browser scarta la virgola, tiene le
cifre e dichiara valido un numero dieci volte più grande.

Dove faceva più male, misurato caso per caso:
- **Genesi, spalla**: «4,5» non dava 45 — dava **8**, perché `applyDesign`
  stringe la spalla in [1,5–8]. Il 45 finiva schiacciato sul massimo e l'app
  **non lo diceva**. Un errore nascosto dietro un limite ragionevole è peggio di
  un errore che si vede.
- **Campo, carica per foro**: «44,7» → 447 kg, e quel numero **esce nel CSV** che
  torna a Genesi a tarare la riconciliazione: il fattore dieci non restava in
  Campo, avvelenava l'altra app.
- **Conti, imponibile**: «1.250,75» → 1.25075 → fattura da **€ 1,25** invece di
  € 1.250,75. Errore per mille, in silenzio.

## La regola, adesso scritta una volta sola
`numeroScritto()` in `shared/deepwork-id-client/dw-shell.js`:
si ripulisce ciò che arriva dai fogli di calcolo (€, spazi fini, nbsp); le forme
ammesse sono **elencate** («2,4,5» non è 245); se la scrittura è **ambigua** — un
separatore solo, esattamente tre cifre dopo — si guardano le due letture e si
tengono quelle che stanno nei **limiti del campo**: se ne resta una si usa senza
disturbare, se restano entrambe **non si indovina**. Su ciò che non si capisce il
valore è `null`, mai zero.

`numIt` resta com'era e legge i file delle **macchine**, dove il decimale è il
punto: per un CSV «1.250» è 1,25 ed è giusto. La differenza fra i due non è un
dettaglio — è la ragione per cui il difetto esisteva.

E il **messaggio** sta accanto alla regola, perché quando `ambiguo` è arrivato i
punti che gestivano solo «non-numero» hanno iniziato a dire cose false: in Campo
un «1.250» nei chili rispondeva «i chili non possono essere negativi».

## Quello che ho imparato sulle prove, e che è già in CLAUDE.md
**Una prova che non sa fallire non dimostra niente.** `run-stile.mjs` passava su
tutte le superfici **e** passava anche con un `window.prompt()` rimesso a mano
nel core: tagliava i commenti con una espressione regolare e il core scendeva da
537.000 a **137.000** caratteri, perché `/*` e `*/` compaiono anche dentro
stringhe e regex. Diceva «nessuna violazione» perché non stava guardando quasi
niente. Ora la controprova **inietta il difetto nei file veri, dentro la suite**.

E **undici volte** una mia prova ha accusato il codice sbagliando io: firme
indovinate (`prossimoTagliando` vuole il piano, non il mezzo), aritmetica mia
(6,25 a un decimale è 6,3), `elementFromPoint` che vive nel viewport, «è mio»
che deve voler dire discendente e non antenato, il toast letto alla fine quando
ne era arrivato un altro dopo, e due prove che inchiodavano **le parole** di un
messaggio invece del comportamento. Ogni volta il codice aveva ragione.

## Stato
Suite: **39 stile** (nuova), **270 KPI** (erano 179 ieri mattina), 7 demo,
43 helper, 9 manifest, 23 pointcloud. Tutte verdi, `run-stile` in CI.
Le sei app rigirate a 390 px: nessun punto decimale nel testo mostrato, nessuno
scroll orizzontale, nessun errore di pagina, nessun dialogo del browser in tutta
la piattaforma.

## Prossimo passo atomico
**IL CORE: 32 campi decimali ancora `type="number"`** — è il prodotto che va in
produzione a ogni merge, e fra quei campi ci sono le **coordinate GPS della
cava** (`cf-lat`/`cf-lon`, step 0,0001: «37,0625» diventerebbe 370625) e i
**parametri di volata** (`a-b` spalla, `a-s` interasse, `a-mh` carica massima per
ritardo, `a-pm` consumo specifico).

Buona notizia: **la lettura è già tollerante.** 12 dei 15 campi con id passano da
`parseNum`, che fa `replace(',', '.')`, quindi manca **solo il tipo del campo**.
Da guardare a mano tre casi che non si leggono con `$(id).value` — `a-mh`,
`ef-x`/`ef-y`, `umc-k` — più i 17 campi costruiti dinamicamente.

⚠️ **Il core non si può provare col browser in questo ambiente**: importa
Firebase e tre librerie da CDN e la rete verso gstatic/jsdelivr è chiusa, quindi
le funzioni vere restano gli stub che il core installa di proposito. Si verifica
estraendo la logica ed eseguendola contro un finto DOM, come ho fatto in
`14aadf3` (27 asserzioni). Il numero 32 è inchiodato in `run-stile.mjs`: se
scende, quel test va aggiornato insieme all'elenco.

Poi resta **P2, Campo → Terra**, l'ultimo ponte.
