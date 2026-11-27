# Checkpoint — 2026-11-26T14:14:37Z

## Tipo
unit-complete (fix + ricerca raccolta + piano) — sessione INTERATTIVA col
fondatore; la routine automatica resta FERMA per suo ordine.

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
6accfcce (docs(genesi): rapporto della deep-research sui formati di scambio in cava)

## Cosa è stato completato
1. **Deep-research raccolta** (cinque filoni, note in `research_notes/`,
   rapporto in `reports/Genesi formati di scambio cava.md`, consegnato al
   fondatore). Il terzo giro `node` sul commit 19043d66 ha confermato
   43 comandi su 43 e 4326 asserzioni: la somma scritta nel checkpoint
   precedente era giusta.
2. **Il delta fatto dal codice** (`docs/RICERCA_CONTINUA_GENESI.md`,
   sezione 26/11), partendo dal meccanismo. Due difetti veri, misurati e
   corretti:
   - `ondaDaCsv` prendeva le prime due colonne per tempo e ampiezza: una
     tabella a canali di sismografo (Tran/Vert/Long/MicL, senza tempo)
     diventava un'onda col canale trasversale al posto dell'orologio. Ora il
     tempo non deve mai scendere e deve avanzare; `ondaPercheNo` (nuova)
     dice all'utente quale caso è.
   - `deviazioneForiDaCsv`, senza intestazione, leggeva per posizione: la
     riga d'esempio del manuale Boretrak (`1,1,1000.000,1000.000,1000.000`)
     diventava una deviazione di 1000 m, accettata. Ora le tre forme senza
     intestazione documentate dal costruttore (5, 8, 9 colonne) si rifiutano
     col loro nome.
   Le letture VERE di quei file non sono costruite: nessun file reale in
   mano (il fondatore: «nessuno» disponibile).
3. **Decisione 32** (aggancio al cantiere) scritta in
   `docs/DECISIONI_WEEKEND.md` e **rimandata dal fondatore** in
   conversazione («un punto a cui pensare in futuro»).
4. **Il piano per «portare Genesi al livello dei concorrenti»** (richiesta
   del fondatore) in `docs/GENESI_ROADMAP_COMPETITOR.md`, sezione 26/11:
   il distacco misurato è che in Genesi tutti i fori di una volata sono
   uguali (un `D2.kg`, un `D2.prof`, un `D2.stem`, un `D2.diam`, un
   `D2.incl`). Sei fette F1–F6. Matrice corretta in due righe troppo
   generose (IREDES-like, import MWD) e con la riga nuova «foro per foro».

## Numeri propagati
- Prove senza rete: 3.730 → **3.731** (run-kpi 3232 → 3233).
- `genesi-data.js`: 179 → **180** funzioni esportate (`ondaPercheNo`);
  condivisi 352 → **353**.
- Giro `node`: scritto **4327** (4326 confermato + 1 prova nuova); il giro
  lanciato dopo questo file dice il numero vero, e se è un altro si scrive
  quello.

## Verifica prima del commit
- run-kpi 3233/0; sintassi-pagine, copertura-funzioni, nomi-liberi,
  funzioni-mai-usate, iniezioni-fresche, import-esistenti: verdi;
  numeri-nei-documenti 43/0.
- `giro-node.mjs`: lanciato dopo questo file.

## Prossimi passi
- **Prossimo passo atomico — F1 del progetto foro per foro**: in
  `apps/genesi/genesi-data.js` tre lettori puri, `caricaDiForo(h, D2)`,
  `profonditaDiForo(h, D2)`, `borraggioDiForo(h, D2)`, che restituiscono
  il valore proprio del foro se è un numero finito e ALTRIMENTI quello del
  progetto (mai zero al posto di un dato che manca: `null` resta `null`),
  con le prove in `run-kpi.mjs`; poi `.volata.json` che salva e riapre i
  valori per foro (andata e ritorno). NESSUN punto di calcolo cambia in F1.
  F2 è `micFinestra`/`micSenzaConto`/`caricaTotale` che sommano le cariche
  vere: prima di toccarle, leggere le 24 occorrenze di `.kg` nel modulo e
  decidere la firma (un argomento in più, non una copia).
- Dopo il cantiere foro per foro: LAZ (default di OpenDroneMap), blocchi e
  archi nel DXF.

## Blocchi
Nessuno. Decisione 32 rimandata dal fondatore; file veri di strumenti non
disponibili.
