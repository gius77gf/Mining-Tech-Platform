# Checkpoint — 2026-09-19T18:31:11Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
3f4b0ecc (feat(genesi): G56d seconda iterazione, anello visivo per foro senza raccordo)

## Cosa è stato completato
Seguendo il mandato del fondatore ("solo Genesi, massimo sforzo") e la
priorità di `docs/RICERCA_GENESI_CAD.md` (sezione 3, «Trasformazioni»),
implementata la seconda trasformazione CAD dopo il mirror di G50:
**ruotare i tratti**.

- [x] **G57 — `trattiRuotati(tratti, gradi)` (genesi-data.js)**: ruota
  tutti i punti di tutti i tratti attorno al loro centroide comune
  (nessun pivot da scegliere, stessa scelta minima di `foriRiflessi`).
  Deliberatamente **non** applicabile ai fori: `mx`/`my` di un foro sono
  burden/spaziatura rispetto alla faccia, non coordinate cartesiane
  libere — mescolarle con una rotazione qualunque romperebbe quel
  significato fisico (stesso principio già scritto per `foriRiflessi`,
  che specchia solo `mx`).
- [x] **Perché serve davvero**: risolve un problema reale già scritto
  nel messaggio dell'import DXF (G47d) — «un file DXF esterno può avere
  una convenzione di assi diversa... verifica l'orientamento» — per cui
  finora l'unico rimedio a un'importazione storta era annullare e
  reimportare. Ora si corregge sul posto.
- [x] **UI**: nuovo input angolo (default 90°, gradi, decimale
  italiano) + bottone «↻ Ruota tratti» nella toolbar `#d2-tools`,
  visibili solo con `D2.tool==='tratto' && D2.tratti.length>0` (stesso
  schema di "Elimina selezionati"/"Rifletti selezionati"). Angolo letto
  con `gvv()` (mai `+valore`, mai 0 su illeggibile): un angolo non
  numerico ferma l'azione con un toast invece di ruotare ogni punto a
  NaN,NaN.
- [x] **Verificato dal vivo con Playwright** (non solo a unità):
  1. import di un DXF vero (2 LINE) col tool Tratto;
  2. rotazione di 90° — coordinate finali verificate a mano contro la
     matrice di rotazione (centroide (7.5, 1.25), risultati esatti al
     centesimo);
  3. Ctrl+Z torna esattamente ai punti originali;
  4. angolo illeggibile ("abc") → toast di errore, tratti invariati;
  5. cambio tool a "Fori" → il bottone sparisce;
  6. screenshot a 320/390/430 px: il nuovo input+bottone va a capo
     sulla riga sotto, nessun elemento esce dallo schermo
     (`getBoundingClientRect` misurato, non solo guardato).
- [x] 6 test nuovi in `run-kpi.mjs`: la rotazione esatta, l'involuzione
  di due rotazioni da 180°, i casi limite (angolo 0/null/NaN/false, un
  tratto senza `pts`), il collegamento nella pagina (nessuna scrittura
  su fori/fronte/piede dal gestore del bottone), la guardia sull'angolo
  illeggibile.

## Verifica prima del commit
- `run-kpi.mjs`: 3220/0 (era 3214/0; un test scritto con
  l'aspettativa sbagliata — `{pts:[]}` inventato dove il codice
  restituisce l'oggetto invariato `{}` — corretto prima di committare,
  non nascosto).
- `sintassi-pagine.mjs`: 34/0. `nomi-liberi.mjs`: 32/0.
- `numeri-nei-documenti.mjs`: 43/0 (due propagazioni: le prove `node`
  3.712→**3.718**, e il conto delle funzioni condivise — `genesi-data.js`
  175→**176** — che `trattiRuotati` faceva scattare senza che l'avessi
  visto subito: il documento lo dichiara ora).
- **`giro-node.mjs` completo, misurato ripetutamente**: la prima misura
  dopo l'unità (4229) è arrivata con `numeri-nei-documenti.mjs` ancora
  rosso per il conto delle funzioni non aggiornato — stessa causa già
  chiusa per G56c/G56d, un comando che cade non viene contato mentre
  cade. Corretto il documento, il giro torna 41/41 comandi a posto e sale
  a **4272** asserzioni, confermato stabile su un secondo lancio.
- `tutti.mjs --solo=genesi`: lanciato, non ancora concluso al momento di
  questo commit (~15 minuti, il contenitore è sotto carico da più giri
  paralleli lanciati in questa sessione). Questa unità è stata verificata
  a mano con Playwright in modo più mirato e approfondito di quanto farebbe
  il batch generico (import DXF reale, matematica della rotazione
  controllata a mano, tre larghezze di schermo) — se al prossimo ciclo il
  suo registro mostra un KO nuovo non-controprova, va riletto prima di
  proseguire.

## Stato roadmap
Seconda delle quattro trasformazioni CAD della sezione 3 di
`docs/RICERCA_GENESI_CAD.md` completata (mirror G50, ora rotate G57 —
limitato ai tratti per la ragione di dominio fisico spiegata sopra).
Restano: Scale (nessun caso d'uso reale trovato finora per i tratti —
da valutare se serve davvero prima di costruirlo) e Blocchi/simboli
riusabili (costo grande, esplicitamente rimandato dal censimento).

## Prossimi passi
- **Prossimo passo atomico**: controllare l'esito di `tutti.mjs
  --solo=genesi` al prossimo ciclo.
- Valutare se «Scale» per i tratti ha un caso d'uso reale (un rilievo
  DXF in un'unità di misura diversa da quella di Genesi?) prima di
  costruirlo — la stessa disciplina già applicata a rotate/mirror:
  costruire solo dove risolve un problema vero, non "perché un CAD ce
  l'ha".
- Mandato del fondatore invariato: solo Genesi, massimo sforzo.

## Blocchi
Nessuno.
