# Checkpoint — 2026-09-16T10:20:46Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
4b67df7c

## Cosa completato
- Chiuso l'ultimo delta del tredicesimo giro di ricerca continua su Terra:
  **il banco da sempre, anno per anno**. La sezione "Lo stesso banco, da
  sempre" (pagina Denuncia) diceva solo il totale aggregato — "almeno
  62.700 m³ · misurato in 2 anni su 3" — senza dire IN QUALI anni. Il
  dato anno per anno esisteva già dentro il ciclo di accumulo di
  `banchiDaSempre` (la variabile `perAnno`) e veniva buttato via ad ogni
  chiamata: nessun ricalcolo, nessuna copia debole, solo esporlo.
- `banchiDaSempre` guadagna `serieAnni: [{anno, scavo, misurabile}]` per
  ogni banco, riusando esattamente i valori già calcolati per il totale
  (verificato in test: la somma della serie torna il totale esistente).
- **Deliberatamente fuori scope**: `statoProgettuale` e
  `volumePianificato` per banco (le altre due colonne che la ricerca
  originale chiedeva). Non esiste nel modello un'entità "banco" con un
  proprio ciclo di vita — il banco è un'etichetta letta dai fronti, non
  un'entità propria — e introdurla qui sarebbe la decisione
  architetturale che il delta chiedeva di prendere a parte, non di
  sfuggita in un'unità che doveva solo esporre un dato già calcolato.
  **Questo era l'ultimo dei sei delta del tredicesimo giro: la ricerca
  continua su Terra sul sequenziamento multi-anno è chiusa.**
- Riga aggiuntiva sotto ogni banco (solo con più di un anno in finestra,
  per non ripetere il badge con un anno solo).
- Test in `run-kpi.mjs`: banco 2 (anno cieco 2024, misurato 2025/2026,
  valori 22.000 e 40.700 m³ verificati contro la dimostrazione) e banco 3
  (mai misurato, serie tutta cieca — `scavo: null` su ogni anno, non
  zero).
- Banco browser nuovo `tests/browser/terra-banchi-serie-anni.mjs` +
  `tutti.mjs`: la riga del banco 2 deve riportare ESATTAMENTE "2024 non
  misurato · 2025 22.000 m³ · 2026 40.700 m³". Controprova nei due versi.
- Nessuna funzione nuova esportata (solo un campo in più sul ritorno di
  una funzione esistente): `copertura-funzioni.mjs` invariato.
- ⚠️ **Incidente di processo, senza danno**: cercando di contare i file
  di banco distinti in `tutti.mjs` ho importato quel modulo direttamente
  con `node -e "import('.../tutti.mjs')"`, senza sapere che il file
  lancia il giro VERO del browser al caricamento (non un semplice export
  di dati). Ha alzato un server sulla porta 8823 e Chromium, lanciato
  contro il commit committato (non contro le mie modifiche non ancora
  verificate — nessun rischio di misurare la copia sbagliata), e ho
  dovuto ucciderlo a metà: prima il gruppo del processo principale
  (`kill -TERM -19768`), poi due processi rimasti orfani/riparentati a
  init (il server Python e `interi-superfici.mjs` con la sua Chromium),
  uccisi per PID separatamente. Nessun file toccato, nessuno stato git
  danneggiato — solo tempo e CPU sprecati. **Lezione**: `tutti.mjs` non
  si importa mai per leggere la sua tabella `BANCHI`: si legge il
  sorgente con grep/Read, o si accetta il costo di un giro vero.
- Doc-cascade finale: run-kpi 3084→3085, somma nove suite 3.578→3.579,
  giro completo 4054→4056, banchi browser 311→313 esecuzioni / 135→136
  file distinti (contati dal sorgente di `tutti.mjs`, non importandolo).
  Verificato con **doppio giro isolato su worktree**: primo passaggio col
  solito scarto atteso su `numeri-nei-documenti.mjs` (i suoi 43 non
  entrano nel totale quando il comando fallisce sui numeri vecchi),
  secondo passaggio verde — 40/40 comandi, 4056 asserzioni, addendi
  verificati uno per uno.
- Commit `4b67df7c`, pushato.

## Stato roadmap
Terra ha chiuso **tutti e sei** i delta del tredicesimo giro di ricerca
continua (piano pluriennale, sequenza fra lotti, apertura fuori
programma, report per banco×anno). Nessun delta aperto su Terra da
questo giro.

## Prossimo passo atomico
1. Scegliere il prossimo lavoro fra: (a) una nuova ricerca continua su
   un'app con meno giri fatti in questa sessione (controllare la data
   più recente in ogni `docs/RICERCA_CONTINUA_<app>.md`: al momento di
   questo checkpoint, Assenza/Core/DeepworkID sono le più indietro fra i
   documenti trasversali, e fra le app verticali serve un nuovo giro
   perché tutte e sei hanno già avuto un giro il 16/09); (b) la
   decisione #28 lasciata in `DECISIONI_WEEKEND.md` (identità propria
   dello strumento in Sentinella) resta del fondatore, non implementarla
   di iniziativa; (c) seconda iterazione/rifinitura su un'app già
   toccata oggi.
2. Prima di aprire qualunque nuova unità: `git pull` per allinearsi
   (regola del ciclo automatico), poi leggere il checkpoint più recente
   con `node apps/deepwork-id/tests/date-checkpoint.mjs` per conferma.
3. Non fermarsi qui per la regola del fondatore (esaurimento crediti):
   proseguire immediatamente con l'unità successiva.

## Blocchi
Nessuno.
