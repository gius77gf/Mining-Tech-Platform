# Checkpoint — 2026-09-15T02:05:39Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
da434625 (pushato)

## Cosa è stato completato

Estratta `interpFronte(mx)` da `apps/genesi/genesi.html`: componeva
SOLO `interpProf(D2.profilo, mx)`, già pura dal blocco G9 (09/08).
Nessuna funzione nuova nel modulo. Sedici punti di chiamata — il
legame più grande chiuso finora per numero di chiamanti — sparsi su
funzioni di rendering non correlate fra loro (il disegno 2D, la mappa
dell'energia, la rete di collegamento dell'innesco, l'editor del
piede modellato). Sostituzione con uno script Python di replace
globale (`interpFronte(` → `interpProf(D2.profilo, `), sicuro perché
la sottostringa non compare in nessun altro contesto — confermato con
`grep -c` prima e dopo.

⚠️ **Un effetto collaterale del replace globale da correggere a mano**:
la sostituzione ha toccato anche una riga di COMMENTO che citava
`interpFronte(mx)` in prosa per descrivere il suo stesso trasloco
storico (blocco G41, 14/09) — trasformandola in una frase che diceva
letteralmente "X è diventata X", priva di senso. Corretto a mano,
riportando il nome storico `interpFronte(mx)` nella prima metà della
frase. Stesso principio dei difetti già presi su commenti che citano
il codice testualmente (i template annidati, i delimitatori di
commento dentro le stringhe): un replace globale su un pattern che
compare ANCHE in prosa esplicativa va sempre riletto, non solo
contato.

Verifica standard rispettata:
- Cercato "interpFronte" in `run-kpi.mjs` PRIMA di toccare nulla:
  nessun pinned test lo blindava direttamente (solo una menzione in
  un commento di un test su `computeMIC`, come analogia — corretta
  anche quella, perché non è più un'analogia valida: `interpFronte` è
  uscita, `computeMIC` resta deliberatamente).
- `run-kpi.mjs`: 2983 passati, 0 falliti (nessuna prova nuova: era un
  alias senza logica propria oltre a `interpProf`, già ampiamente
  provata).
- Nessun fondo di copertura da alzare.
- Bucket-shift misurato con `git stash`/`stash pop` +
  `genesi-estraibili.mjs --elenco`: 137→136 funzioni, "1-2" 40→39,
  estraibili 48→47. Nessuno spostamento collaterale nonostante i
  sedici chiamanti: erano già tutti in buckets più alti (funzioni di
  rendering con molte altre letture di modulo).
- Cascata documenti: solo `docs/DEVELOPMENT.md`.
- `numeri-nei-documenti.mjs`: 43 passati, 0 falliti.
- `sintassi-pagine.mjs`: 34/34.
- Giro isolato su worktree dedicata (`/tmp/wt-b3-interpfronte`,
  `run_in_background: true` + `TaskOutput`): **40 comandi a posto, 0
  caduti**, 3.929 asserzioni (invariate: nessuna prova nuova).

## Stato roadmap

B3 in corso. Storia append-only aggiornata in `docs/DEVELOPMENT.md`.

## Prossimo passo atomico

Con `computeInnesco2D`, `_sigDetTimes`, `mdlProfSnap`, `crestZ`,
`measureGeom2D` e `interpFronte` tutti chiusi (6 unità in questo
ciclo), il bucket "1-2" (39 funzioni) è composto quasi interamente da
funzioni DOM/ambiente (escluse per costruzione) più:

- `riconStorico`, `d2Up`, `sitoStore`: verificati e scartati come
  candidati (alias I/O senza logica propria o setter di stato locale,
  non veri "legami" — vedi checkpoint `measureGeom2D`).
- ⛔ `computeMIC`: **NON toccare** (legame di sicurezza deliberato).
- `selRoccia`/`selEsplosivo`/`selInnesco`/`rockFactorA`: 46 punti di
  chiamata, 10 pinned test in 5 blocchi indipendenti — deferred per
  costo. `interpFronte` (appena chiuso, 16 siti) dimostra che un
  numero alto di chiamanti da solo NON basta a fermarsi (era gestibile
  con un replace sicuro); il vero ostacolo di quel gruppo è che i suoi
  chiamanti sono SPARSI su funzioni GIÀ pinnate da altri G-cantieri
  con il testo sorgente esatto (`deriveCharge`, `rockFactorA` stesso,
  `ppvSite`), quindi ogni sito toccato rischia di rompere un pinned
  test scritto altrove — un problema diverso, non solo di quantità.

**Con i candidati piccoli e medi ormai esauriti**, il prossimo passo
sensato è uno dei due:
1. Riprovare il gruppo `selRoccia`/`selEsplosivo`/`selInnesco`
   spezzandolo per singolo chiamante pinnato (come raccomandato nei
   checkpoint precedenti), partendo da quello con meno pinned test
   collegati — misurare quali dei 10 pinned test toccano quale dei
   tre nomi, uno per uno, prima di scrivere una riga.
2. Il fallback generico della roadmap: il prossimo ponte in
   `docs/MAPPA_ECOSISTEMA.md`, o una passata in profondità su
   un'altra app verticale (Scudo, Campo, Flotta, Conti, Sentinella,
   Terra) — guardando ogni schermata, premendo ogni bottone che
   produce un file, cercando numeri tranquilli dove non è stato
   misurato niente (fase aperta dal fondatore il 26/08, ancora attiva).

Nessuno stop volontario: si prosegue subito.
