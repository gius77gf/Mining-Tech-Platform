# Checkpoint — 2026-11-26T14:45:28Z

## Tipo
conferma + consegna al ciclo automatico (nessun codice in questa unità)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
62176083 (docs: il giro node sul commit cab86b44 esegue 4330 asserzioni, non 4329)

## Cosa è stato completato
- Giro `node` sul commit di F1 (cab86b44): **43 comandi su 43, 4330
  asserzioni**. Nei documenti c'era 4329 (una somma): corretto a 4330.
  ⚠️ La causa dell'unità in più, MISURATA confrontando i due registri suite
  per suite (`diff` delle righe «N passati» di giro4 e giro5): KPI 3233 →
  3235 (+2, atteso) e **`import-esistenti` 334 → 335** (+1: conta un
  controllo per file, e il banco nuovo è un file in più). Il messaggio del
  commit 62176083 dice «una suite che conta i banchi»: il meccanismo è
  giusto, il nome preciso è questo. Vale per ogni fetta: **un file di test
  nuovo aggiunge 1 al giro oltre alle sue prove**.
- La somma delle prove in `docs/DEVELOPMENT.md` è tornata sorvegliata dal
  giro («addendi verificati uno per uno»).
- **Routine riarmata dal fondatore** (26/11): «Weekly Dev Session», solo
  Genesi, ogni 3 ore alle :45 UTC lun–sab, col piano foro per foro nel
  prompt. In più «Compattazione ogni 3 ore» alle :50 (cinque minuti DOPO
  l'avvio, per scelta del fondatore) che invia `/compact`: è un tentativo —
  se arriva come testo e non come comando, una riga e si prosegue.
- Il canarino su GitHub (`.github/workflows/canarino.yml` su main) è ANCORA
  in pausa: riaccenderlo vuole una Pull Request su main, chiesta al
  fondatore e non ancora autorizzata. Non farlo di iniziativa.

## Prossimi passi
- **Prossimo passo atomico — F2, `micFinestra` per prima.** Già letto:
  `micFinestra(holes, kg)` conta i fori nella finestra di 8 ms e restituisce
  `n * kg`; chiamanti: `computeMIC` e la riga 1509 della pagina,
  `genesi-data.js` riga ~3575 (curva burden/carica, con `r.kg`).
  ⛔ Il modo di tenerla IDENTICA alla cifra sui progetti senza valori per
  foro, provato a mente e da provare in scratchpad: NON sommare le cariche
  (una somma di n volte 58,3 non dà gli stessi decimali di n × 58,3), ma
  calcolare per ogni finestra `c * kg + Σ(valore proprio − kg)` sui soli
  fori che hanno un `kg` proprio, e prendere il massimo. Senza valori
  propri è esattamente `n * kg` di oggi. Attenzione: con valori propri la
  finestra col massimo può NON essere quella con più fori — si confrontano
  i chili, non i conteggi.
  Poi `caricaTotale(nf, kg)` (chiamanti: pagina righe ~5132 e ~8128, modulo
  ~1682): stessa forma, `nf * kg + Σ(proprio − kg)`, e lì serve passare i
  fori — la firma si ALLARGA con un terzo argomento facoltativo, non si
  copia. Poi il consumo specifico. Ogni passo: prova di neutralità sulla
  dimostrazione (stessi numeri prima e dopo) + una prova in cui un foro più
  carico cambia solo ciò che deve.
- Dopo F2: F3 (il comando per l'utente sulla selezione multipla).

## Blocchi
Nessuno.
