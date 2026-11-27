# Checkpoint — 2026-09-18T10:51:05Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
0b988357 — fix(genesi): parseXYZ non disallinea più i colori dalle posizioni su un file misto

## Cosa è stato completato
Dal deep-pass QA su Genesi (agente a4a598fd97c867b83, secondo difetto del
report): `apps/genesi/pointcloud.js:parseXYZ` disallineava l'array dei
colori (`col`) da quello delle posizioni (`pos`) su un file XYZ/TXT che
mescola righe con RGB e righe senza — a differenza del PLY, il formato
XYZ non ha un header che decida `hasCol` una volta per tutte. `col`
cresceva solo sulle righe colorate: dal primo "buco" il colore del
punto N finiva sul punto N-1, silenziosamente. `nuvola-poc.html`
passa i due array come `BufferAttribute` di `count` diverso sulla
stessa geometria.

Corretto: `col` ha sempre una terna per punto; i punti senza colore
proprio prendono un grigio neutro SOLO se il file è colorato nel
complesso (un file interamente incolore resta `col:null`, usa la
scala per quota).

## Verifica
- Due nuovi test in `run-pointcloud.mjs` (file misto, file senza
  colore), controprova pulita (2→ KO su `col.length`, non un crash).
- `run-pointcloud`: 32 → **34**.
- Giro completo su worktree isolata: **41/41, 0 caduti**. Asserzioni:
  **4144**. 9-suite sum: **3.642** (3146+330+83+34+9+8+7+3+22).
  `numeri-nei-documenti.mjs`: 43 passati, 0 falliti.

## Stato roadmap
Vedi vault/ROADMAP_SETTIMANA.md.

## Coda di lavoro — sette unità verificate da agenti in background
**Deepwork ecosistema — UI/accessibilità (shared/dw-app-ui.js)**:
1. Genesi — toast di errore senza CSS distintivo (`.err`/`.success`/
   `.warn` assenti nel CSS locale, mentre il JS chiama `toast(m,"err")`).
2. Toast senza `role="status" aria-live="polite"` in Genesi e
   deepwork-id/admin.
3. Nessuna trappola del focus nella modale (`Tab` non gestito,
   nessun `inert`/`aria-hidden`) nonostante `aria-modal="true"` ovunque.
4. Listener accumulato su `#modal-foot` in Conti (`index.html:6165`).

**Terra/Genesi — ponte del volume dal visore** (agente
a7409415627631532):
5. **Il ponte Genesi→Terra accetta un volume in unità arbitrarie come
   se fosse m³ veri.** Quando una nuvola non è georeferenziata,
   `nuvola-poc.html:301` salva `volume: "1234 u³"` (stringa). Terra
   (`index.html:4777-4778`) pulisce il valore con una regex
   `[^0-9.,-]` che toglie anche "u³" — il controllo `if (!vol)`, che
   secondo il suo stesso messaggio d'errore dovrebbe intercettare
   proprio il caso "non georeferenziata", scatta solo su 0/NaN, non su
   un numero in unità sbagliate. Il numero finisce mostrato come m³
   veri e propagato a `riepilogoAnnuale`, `prospettoDenuncia`,
   `baseOnereEscavazione`, `vitaCava`, `valoreMateriale`. Fix minimo
   suggerito dall'agente: controllare
   `ultimo.calcolo?.georeferenziato === false` (il dato esiste già,
   propagato fino a `_origineDalVisore.georeferenziato`) prima dello
   strip regex, e bloccare l'import con lo stesso messaggio d'errore
   già scritto — oggi vero solo a parole.

**Flotta — tre copie deboli, correzione fatta in un punto e non
propagata** (agente a106be18e1d4b3d04):
6. **Ordinamento del magazzino ricambi** (`index.html:2464`, `$ric-
   list`) usa ancora la formula grezza `(giacenza-sogliaMin)` già
   dichiarata rotta e sostituita in `sottoScorta`
   (`flotta-data.js:1352-1389`): uno scaffale VUOTO senza soglia
   (chiave 0) finisce ordinato DOPO un pezzo con qualche unità ma
   sotto una soglia scritta (chiave negativa) — la stessa inversione
   di priorità già corretta altrove nello stesso file, ma non qui.
7. **`csvBudget`** (`flotta-data.js:1805-1814`) interpola i numeri
   grezzi (punto inglese) invece di passare da `mostra()`/
   `perLettura()`, a differenza dei quattro CSV gemelli
   (`csvCosti`/`csvRicambi`/`csvRegistroInterventi`/
   `csvListaDellaSpesa`) corretti il 17/09 per lo stesso identico
   difetto.
8. **`propostaScorte`** (`flotta-data.js:3862`, usata da
   `index.html:3563`) mostra "soglia oggi 0" per un ricambio che non
   ha MAI avuto una soglia impostata — la stessa bugia già corretta in
   `statoScorta` (`flotta-data.js:1293-1322`, "una soglia mai scritta
   non è una soglia a zero") ma non propagata a questo secondo calcolo.

(Nota: 6, 7, 8 sono tre difetti distinti ma piccoli, tutti nello
stesso file/stessa famiglia — probabilmente si possono chiudere in
un'unica unità Flotta.)

## Prossimo passo atomico
Priorità suggerita: (5) il ponte del volume — è un dato che entra
sbagliato nella denuncia annuale che va all'ente, il più grave dei
sette; poi (6+7+8) insieme come un'unica unità Flotta (stessa app,
stesso pattern, basso rischio); poi le quattro di dw-app-ui.js/
accessibilità. Isolare in una nuova worktree e continuare "mai
fermarsi". La coda è ora abbondante (8 item): non serve dispatchare
nuovi agenti finché non si accorcia sotto 3-4.

## Blocchi
Nessuno.
