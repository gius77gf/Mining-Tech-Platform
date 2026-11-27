# Checkpoint — 2026-09-14T04:11:44Z

## Tipo
unit-complete (prima fetta scomposta di G7, implementata)

## App
Genesi

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Completato

Implementata `curvaBurdenCarica` in `genesi-data.js` (blocco G38), la
prima fetta di G7 scomposta nel checkpoint precedente
(`20260914-034007`): dato un intervallo di burden, un rapporto S/B fisso,
diametro/profondità/roccia/esplosivo del progetto e una frammentazione
target, calcola per ogni burden della griglia la carica necessaria per
raggiungere QUELLA frammentazione — riusando `volumeForo` e
`caricaDaX50Target`, già pure e già in questo modulo, senza duplicare
nessuna formula.

**Zero soglie di sicurezza toccate, zero vibrazione, zero sequenza**: per
costruzione, la funzione non calcola PPV né MIC — esattamente il confine
dichiarato nella scomposizione, perché quella logica vive ancora nella
pagina (`computeSeq2D`) e costruirla qui sarebbe stata la terza copia
della stessa domanda.

**Verificato**:
- `run-kpi.mjs`: 4 nuove prove (griglia sana con B crescente → carica
  crescente; input illeggibili → griglia vuota, non una a caso; obiettivo
  fuori dominio dichiarato SENZA sparire dalla griglia; tetto di 200 righe
  contro un passo scritto a mano fuori misura). 2944 → **2948**, 0 falliti.
- **Difetto iniettato a mano, due volte, e ripristinato verificando il
  file identico byte per byte** (`diff -q` dopo il ripristino): tolta la
  guardia sul rapporto S/B (1 KO), tolto il tetto delle 200 righe (1 KO,
  e la seconda controprova mostra anche che senza tetto il banco NON
  entra in un loop infinito su un caso normale — solo su un caso
  patologico scritto apposta per provarlo).
- `copertura-funzioni.mjs`: `genesi-data.js` 145/145 → **146/146**.
- `funzioni-mai-usate.mjs`: la funzione, non ancora collegata a uno
  schermo, è dichiarata "DA COLLEGARE" con la ragione (non un'eccezione
  muta) — il banco lo stampa come avviso, non lo nasconde.
- Giro completo su `git worktree` isolata: **40/40 comandi, 0 caduti**
  (due passate per far convergere il totale delle asserzioni sui
  documenti, lo stesso quirk a due passate di `numeri-nei-documenti.mjs`
  già documentato in CLAUDE.md).

**Deliberatamente non fatto in questa unità**: nessun pulsante, nessuna
tabella a schermo. La funzione pura è verificata; collegarla è la
prossima unità, per la stessa ragione per cui B0-septies è stata
scomposta prima di essere scritta — vedere i numeri prima di costruire
l'interfaccia che li mostra.

## Stato roadmap

G7 resta aperta (contiene ancora l'ottimizzatore multi-obiettivo vero,
che aspetta l'estrazione di `computeSeq2D`), ma con un pezzo reale già
fatto e provato invece che solo scomposto.

## Blocchi e limiti noti

Nessuno nuovo.

## Prossimo passo atomico

1. Collegare `curvaBurdenCarica` a uno schermo: un pulsante nel pannello
   parametri di Genesi ("confronta burden"), una tabella che mostra le
   righe della griglia con la bandiera `fuoriDominio` colorata come le
   altre bandiere non-calcolabili della pagina (stesso linguaggio visivo
   di `nonCalcolabile` in `renderScheda2D`).
2. Verifica a schermo con Playwright dopo il collegamento (lo stesso
   pattern già usato per B0-septies: server proprio, contrassegno pid,
   iniezione nei dati, screenshot).
3. In alternativa/parallelo: continuare con un'altra voce dell'indice di
   `vault/ROADMAP_SETTIMANA.md`, o una nuova ricerca di fianco.

Nessuno stop volontario: si prosegue subito.
