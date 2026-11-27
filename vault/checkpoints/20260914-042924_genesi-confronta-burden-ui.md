# Checkpoint — 2026-09-14T04:29:24Z

## Tipo
unit-complete (collegamento a schermo di `curvaBurdenCarica`, G38/G7)

## App
Genesi

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Completato

Collegata a schermo `curvaBurdenCarica` (unità precedente), completando il
"prossimo passo atomico" del suo stesso checkpoint. Trovato il posto giusto
cercando prima nel codice esistente invece di inventare un componente
nuovo: il bottone **"🎯 Carica per un obiettivo di pezzatura"**
(`btn-obiettivo-x50`) fa già la stessa domanda per UN burden solo (quello
disegnato); il nuovo bottone **"📊 Confronta burden per lo stesso
obiettivo"** (`btn-confronta-burden`) la ripete su un piccolo intorno
(±1 m attorno al burden di oggi, passo 0,25 m, stesso rapporto
spalla/interasse), riusando la stessa modale (`chiediValore`, un solo
campo: l'obiettivo x50) e lo stesso linguaggio visivo (bandiera
`fuoriDominio` con lo stesso colore/testo delle altre righe "non
calcolabile" della pagina).

**Zero soglie di sicurezza toccate**: nessuna vibrazione, nessuna
sequenza — dichiarato esplicitamente nel testo del bottone (title) e nel
messaggio sotto la tabella, per la stessa ragione per cui la funzione pura
non le calcola (vedi il checkpoint di scomposizione, `20260914-034007`).

**Verificato**:
1. Le due prove di CENSIMENTO che questo file ha (contano quante volte
   `rockFactorA()` e il ripiego `rws_pct||100` compaiono nella pagina)
   sono cadute correttamente: il nuovo bottone aggiunge un'ottava/settima
   chiamata legittima. Aggiornate da 8→9 e 6→7, con la data e la ragione
   scritte accanto (non un numero cambiato in silenzio) — è la stessa
   disciplina di "un numero dichiarato scende solo quando la copia si
   chiude, sale quando se ne apre una in più".
2. `funzioni-mai-usate.mjs`: tolta l'eccezione "DA COLLEGARE" dell'unità
   precedente (la funzione ora è chiamata dal prodotto) — il banco
   avrebbe accusato un'eccezione invecchiata se l'avessi lasciata.
3. **Verifica nel browser vero** (Playwright, server proprio con
   contrassegno pid, `?go=design`): bottone presente, click apre la
   modale `chiediValore` con un solo campo, digitato "15" e confermato,
   la tabella appare con **8 righe** (una per burden nella griglia) più
   l'intestazione, la riga di oggi (3,00 m) è evidenziata e riporta
   **155,3 kg/foro · 1,48 kg/m³** — coerente con la carica vera di
   progetto (58 kg/foro con powder factor circa 0,55, per un target di
   28 cm; qui il target chiesto era più fine, 15 cm, quindi la carica
   necessaria è più alta: il verso è quello giusto). **0 errori di
   pagina.** Screenshot in `scratchpad/screenshot-confronta-burden/`.
4. `run-kpi.mjs`: 2948/2948 (nessuna prova nuova qui: le due modifiche
   erano numeri di censimento, non funzioni nuove — la funzione pura è
   già provata dall'unità precedente).
5. Giro completo su `git worktree` isolata: **40/40 comandi, 0 caduti**,
   nessun documento diventato stale (nessuna funzione nuova nel modulo,
   nessun bank nuovo in `tutti.mjs`).

## Stato roadmap

G7 ha ora un pezzo reale, provato e VISIBILE a schermo, non solo una
funzione pura isolata. Resta aperta per la parte che tocca vibrazione e
sequenza (vedi la scomposizione).

## Blocchi e limiti noti

Nessuno nuovo.

## Prossimo passo atomico

Nessun passo obbligato su G7: la fetta scomposta è chiusa (funzione pura
+ collegamento + verifica a schermo). Prossimo cantiere a scelta:
rileggere l'indice di `vault/ROADMAP_SETTIMANA.md` per un'altra voce
Genesi aperta, o considerare se estrarre `computeSeq2D` (il passo che
sbloccherebbe la parte vibrazione/sequenza di G7) come un cantiere B3 a
sé — probabilmente nel bucket "11+" del censimento, quindi un
rifacimento, non un trasloco: da scomporre a sua volta prima di
cominciare.

Nessuno stop volontario: si prosegue subito.
