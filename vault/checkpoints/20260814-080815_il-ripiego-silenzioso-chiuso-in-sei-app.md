# Checkpoint — 2026-08-14 08:08 UTC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit di questo tratto
- `f1ae57ee` — il censimento del ripiego silenzioso diventa uno strumento
- `808d91c3` — ricerca: il rapporto di fine turno, e la mancanza principale FALSA
- `dc3f1749` — una decisione presa con la misura rinata da un COMMENTO
- `eab041d4` — Terra: «Riserva residua 0 m³ · ~0 anni» dove nessuno aveva scritto
- `39ab7699` — shared: il rilievo che non ha misurato niente contava come rilievo

## Che cosa è stato completato

**Il ripiego silenzioso è chiuso su sei app più `shared/`.** Terra:
`riservaResidua` accettava `""`, `"  "`, `"abc"` e rispondeva **«Riserva residua
stimata: 0 m³ · durata ~0 anni»** — dice che la cava è finita dove nessuno ha
scritto quanto resta. `shared/dw-ponti.js`: un rilievo **elaborato senza
volume** contava come rilievo e **spostava avanti la data dell'ultima misura**,
da cui passano il grafico di Terra e **la base del canone di Conti**.
⛔ **Due assenze, due comportamenti**: `"abc"` veniva scartato, `null` e `""` no.

**Il censimento è diventato uno strumento** — era stato riscritto da zero
**quattro volte in due notti**. `tests/ripieghi-silenziosi.mjs`, misura
dichiarata, con `--solo=`. Il quadro su 15 superfici: **2.510 candidati, 1.743
segnaposto di stampa, 495 zeri su contatori, 272 di MESTIERE**, più 45
`Number.isFinite(+x)` e 165 `Math.max(0, …)`. ⛔ E **Genesi · pagina ne ha 119**,
tre volte il core: è lì che la domanda va fatta per prima.

## ⛔ Le tre lezioni
1. **Una decisione presa con la misura è rinata da un COMMENTO scritto al
   futuro.** «⚠️ VIVREBBE in `shared/`» era una **previsione** onesta; dodici
   minuti dopo un checkpoint decideva il contrario **con la misura**. Cinque
   giorni dopo un cantiere l'ha letta come un fatto, io l'ho messa in roadmap, e
   un secondo cantiere è partito — e si è fermato **prima di spostare qualcosa**,
   perché il mandato gli chiedeva di provare il «serve a due app»: **3 chiamate,
   tutte in Sentinella**, e l'unica riga in Scudo è un commento che dice
   l'opposto. *Un commento si legge mentre si lavora, un checkpoint no: la
   previsione vince per posizione.*
2. **Una frase letteralmente vera con un verdetto falso.** La ricerca su Campo
   proponeva «va aggiunta una raccolta di near-miss»: il near-miss è un **tipo
   dentro la collezione infortuni**, con i suoi campi, e Campo ha un **ponte
   dedicato** perché «o lo si segnala nei trenta secondi dopo o non lo si segnala
   più». 16+23 occorrenze in Campo, 69+75 in Scudo. Un `grep` che cerchi *la
   parola dell'agente* **conferma**.
3. **Il limite dello strumento, misurato**: `WebSearch` **funziona**, `WebFetch`
   su un dominio qualunque risponde **EGRESS_BLOCKED** (provato su due). Quindi
   una ricerca sa **che cosa esiste**, non può **leggere il testo primario** — e
   ogni articolo o scadenza attribuita a una norma va marcata come di seconda
   mano.

## Le misure
`run-kpi` 2270 → **2277**, prove **2.733**, giro `node` **35 comandi a posto, 0
caduti**, **3.104** asserzioni. Ogni unità sulla **copia di quello che si
committa**, indice da HEAD più il solo blocco: dentro `run-kpi.mjs` scrivevano
fino a tre cantieri.
**Il secondo giro mirato è arrivato in fondo**: 36 passate in **36 minuti**, **2
KO veri** (tutti e due su Scudo), 32 banchi a posto.

## Che cos'è vivo
- **Terzo giro mirato** dalle 08:07 su `39ab7699`: 19 passate (Terra, Campo,
  pagine vive, scale dei grafici). ⚠️ Dichiara **4 file non committati fuori** —
  sono dei due cantieri aperti.
- **Due cantieri**: Genesi (i 119 ripieghi della sua pagina, classificati; niente
  browser) e Scudo (i due KO veri del giro, da riverificare prima di correggere).

## Prossimo passo atomico
Raccogliere i due cantieri uno per volta — indice da HEAD più il solo blocco di
ciascuno — e leggere il **terzo giro** con `browser/leggi-giro.mjs`. Poi **B6**
(la finestra di caricamento: «sto caricando» non è «non c'è»), che vuole il
browser: si fa **quando nessun giro sta girando**, e adesso che i giri finiscono
in mezz'ora la finestra c'è.

## Blocchi
- **Force-with-lease sul ramo**: fermo al fondatore; CI verde con l'eccezione
  dichiarata e sorvegliata.
- **B0-septies**, le **soglie di sicurezza** e **`dRecFreq` intero all'ingresso**
  (porterebbe la soglia DIN da 5 a 15 mm/s): fermi al fondatore.
