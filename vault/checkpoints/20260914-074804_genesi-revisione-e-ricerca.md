# Checkpoint — 2026-09-14T07:48:04Z

## Tipo
unit-complete (revisione di qualità + ricerca continua verificata, non implementazione)

## App
Genesi

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Completato

**Revisione di qualità sul blocco G39-G44** (fallback 5 della routine).
Rileggendo il wiring del bottone "Confronta burden" dopo G44, il suo
`title` (tooltip) diceva ancora *"Non ricalcola vibrazione né
sequenza"* — vero prima di G44, **falso** adesso che
`vibrazionePerBurden` ricalcola entrambe. Corretto per riflettere il
comportamento reale. Verificato: nessun'altra riga viva (pagina, roadmap,
doc di stato) ripeteva la stessa affermazione stale.

**Ricerca in background lanciata e VERIFICATA prima di fidarsene**
(regola "niente entra sulla parola dell'agente"): un agente ha cercato
quali controlli automatici di validazione applicano i software
commerciali di blast design (Maptek BlastLogic, Orica SHOTPlus,
JKSimBlast, Maxam RIOBLAST) prima che un piano sia pronto per l'esecuzione.

⛔ **Una delle sue conclusioni era FALSA, e l'ho presa rileggendo il
codice invece di fidarmi**: la ricerca diceva "manca un vincolo sul
rapporto S/B" — ma la "Rapporto S/B" è la **prima riga** della scheda
validatori di Genesi (`renderScheda2D`), un badge su `sb=S/B` con fascia
tipica 1,0–1,4, avviso 0,85–1,6, e testo dedicato per "maglia stretta in
larghezza" o "interasse molto > spalla". Il grep del mondo (pattern
inglesi come `spacing.*minimum`) non l'ha trovata perché il meccanismo ha
un nome italiano — esattamente la famiglia di errore che CLAUDE.md
documenta ripetutamente ("cercare la nostra parola nel mondo, non il suo
meccanismo in casa nostra"). Corretto nel documento di ricerca con la
causa, non solo il verdetto.

**Il gap genuinamente verificato**: nessuna riga della scheda validatori
sintetizza i singoli badge (S/B, H/B, spalla/Ø, powder factor,
confinamento colletto/SDOB, gittata flyrock, timing…) in un giudizio
unico — un progettista deve scorrere N righe per sapere se qualcosa è
fuori fascia, mentre i software commerciali citati hanno un QA/QC di
sintesi.

**Perché NON l'ho implementato**: tecnicamente banale (un `reduce` sui
`cls` già calcolati, nessuna formula nuova), ma la scheda validatori
copre solo geometria/esplosivo — MIC/PPV/airblast (le soglie di legge
verso il recettore) vivono in un pannello KPI separato. Un badge "🟢
pronto" che non include quelle tre soglie sarebbe un caso da manuale del
principio "l'assenza di un dato non è un dato favorevole": inviterebbe a
smettere di guardare le altre righe. È la stessa famiglia delle due
decisioni di sicurezza che questo ciclo non prende da solo. Loggato come
candidato **G45** in `vault/ROADMAP_SETTIMANA.md` (indice aggiornato),
non costruito, con le due strade dichiarate: (a) sintesi esplicitamente
parziale, costruibile subito; (b) unire i due pannelli in un verdetto
vero, un cantiere di struttura.

## Verificato

- `sintassi-pagine.mjs`: 34/34.
- `run-kpi.mjs`: 2969/2969 (invariato, nessuna funzione nuova in questa
  unità).
- `numeri-nei-documenti.mjs`: pulito (nessun numero cambiato dalla
  correzione di prosa e dal tooltip).
- Giro completo su worktree isolata (in realtà lanciato direttamente,
  working tree pulita tranne il file in oggetto, nessun cantiere
  parallelo in corso): **40/40 comandi, 0 caduti**.

## Stato roadmap

G45 aggiunto come candidato non preso, con la ragione della cautela
dichiarata esplicitamente (non un "non fatto per mancanza di tempo").

## Blocchi e limiti noti

Nessuno nuovo.

## Prossimo passo atomico

Nessun'azione obbligata su G45 (aspetta una decisione di framing, non un
"non c'è" da colmare). Le strade aperte restano quelle del checkpoint
precedente: raccogliere ulteriore ricerca continua se torna, o tornare al
censimento `genesi-estraibili.mjs`/alla lista "SE LA ROADMAP SEMBRA
FINITA" del prompt fisso della routine.

Nessuno stop volontario: si prosegue subito.
