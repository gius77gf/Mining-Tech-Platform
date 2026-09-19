# Checkpoint — 2026-09-18T08:03:23Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
b830d401 — fix(core): esitoSparo blocca anche troppi colpi esplosi senza mancati

## Cosa è stato completato
Dal deep-pass mirato sul core (agente af68760cefe52ac3e), un difetto
vero verificato dal vivo con Playwright (montando `finto-firebase.mjs`
prima del `goto`, dati del ripiego offline):

`esitoSparo()` in `shared/deepwork-id-client/dw-shell.js:1966-1981` ha
una guardia di coerenza che il commento della funzione dichiara
simmetrica ("l'unico caso impossibile" nominato per entrambi i lati),
ma l'implementazione copriva solo un lato: bloccava «colpi mancati >
fori caricati» ma non il gemello «colpi esplosi > fori caricati»
quando `mancati` resta `null` — che è il caso NORMALE, perché "colpi
esplosi (contati)" è il primo campo che si compila. Verificato dal
vivo: 10 colpi esplosi dichiarati su 2 fori caricati → nessun blocco,
nessun avviso, il rapportino si salva e il numero impossibile finisce
nel PDF stampato (collegato al registro esplosivi/deposito).

Aggiunto il ramo mancante (`esplosi !== null && mancati === null &&
fori > 0 && esplosi > fori`) senza toccare i tre rami esistenti — è
la stessa domanda applicata all'altro numero, non un allargamento.

## Verifica
- Nuovo test in `run-kpi.mjs`: copre il caso incoerente (13 esplosi su
  12 fori, mancati non scritto), il caso limite (esplosi === fori:
  resta coerente) e conferma che appena si scrive anche "mancati" il
  ramo della somma (preesistente) riprende il sopravvento invariato.
- `core-esito-sparo.mjs` esteso con un caso vivo in Playwright
  (mirror esatto del blocco "più mancati che fori" già presente, sul
  lato degli esplosi) e una dodicesima voce dedicata in `DIFETTI`
  (questa volta puntata su `shared/deepwork-id-client/dw-shell.js`,
  non su `index.html` come le altre undici — il meccanismo di
  iniezione del banco è generico per file, verificato che funzioni).
  Contatore `ATTESE` aggiornato da 47 a 50.
- Normale: **50/50**. Controprova completa: 27/50 (23 KO, tutti e 12 i
  difetti rimessi). Controprova isolata (`--difetto=12`): **3 KO su
  50**, confermando che il nuovo fix ha una copertura di regressione
  propria e non solo di riflesso da altri difetti.
- Giro completo su worktree isolata: **41 comandi a posto, 0 caduti**.
  Asserzioni: **4130** (documenti corretti da 4129). 9-suite sum:
  **3.630**. Banchi invariati (345, banco esteso non nuovo).
  `numeri-nei-documenti.mjs`: 43 passati, 0 falliti, confermato PRIMA
  del commit.

## Stato roadmap
Vedi vault/ROADMAP_SETTIMANA.md. Unità core chiusa.

## Prossimo passo atomico
Chiudere l'unità **Scudo** (quinto giro di deep-pass, agente
aaab8ded50f563b28) — **già implementata sul disco in una worktree
separata `/tmp/wt-scudo2` (HEAD 14c568b5), da ricostruire sulla nuova
HEAD b830d401** perché il fix non tocca file in comune col core (nessun
conflitto atteso, ma la worktree va rifatta da capo per essere sulla
HEAD giusta prima del giro):

`cartellaLavoratore` (`apps/scudo/scudo-data.js:4598+`) — il fascicolo
personale per l'ispettore non segnalava un DPI previsto dalla mansione
ma mai consegnato (controllava solo il caso "zero consegne in
totale"). Il Quadro (`allarmiDpi`) e il "Fascicolo per l'ispettore"
(`fascicoloIspezione`) già incrociavano mansione.dpi con le consegne
reali — solo `cartellaLavoratore`/`fogliaCartella` no. **Fix già
scritto e verificato**: nuovo calcolo `tipiMancanti` (Set, dedup per
tipo) usando lo stesso vocabolario di `allarmiDpi`
(`ultimaConsegnaDpi`/`statoConsegnaDpi`, stato "mancante"), aggiunto
come riga a `righeGuaste`/`daSistemare` (NON a `vuoti`, che resta per
il caso "zero consegne totali" — coerente con la distinzione già
documentata nel codice fra "completa" e "in regola"). Test in
`run-kpi.mjs` con fixture sintetica (un lavoratore, una mansione che
richiede due tipi di DPI, uno consegnato uno no) più un caso di dedup
(due mansioni che chiedono lo stesso tipo mancante → si conta una
volta sola). **Verificato anche contro dati demo reali**: `node
--input-type=module` diretto su `scudo.DEMO` conferma che d4 (2 DPI
mancanti secondo `allarmiDpi`: gilet, scarpe) ora mostra "2 DPI
previsti dalla mansione e mai consegnati" nella sua `cartellaLavoratore`.

Passi per chiudere:
1. `git worktree remove --force /tmp/wt-scudo2` (è sulla HEAD vecchia),
   poi `git worktree add -q --detach /tmp/wt-scudo2 HEAD` sulla nuova
   b830d401
2. Ricopiare `apps/scudo/scudo-data.js` e ricostruire il delta di
   `run-kpi.mjs` (il testo del nuovo test è già scritto qui sopra e
   nel main tree — riapplicarlo con lo stesso pattern
   Read-anchor+Edit già usato per Conti/core)
3. KPI: 3136 → 3137 (verificare, non assumere). 9-suite sum:
   3.630 → 3.631. Nessun nuovo banco browser per questa unità (a meno
   di deciderne uno in più, non fatto per limiti di tempo — la
   copertura pure-function + la verifica dal vivo dell'agente
   originale sono considerate sufficienti)
4. Giro completo, wait-loop sul PID, correggere l'eventuale mismatch
   sulle asserzioni leggendo l'uscita VERA
5. `numeri-nei-documenti.mjs` verde, commit -F, push, checkpoint
6. Poi continuare "mai fermarsi": mantenere ≥3 cantieri paralleli
   (candidati: un secondo report da Sentinella/Terra/core su angoli
   diversi, ricerca continua sul mestiere per un'app a rotazione, un
   terzo giro su Genesi), verificando sempre ogni difetto contro il
   codice attuale prima di agire.

## Blocchi
Nessuno.
