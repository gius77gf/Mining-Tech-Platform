# Checkpoint — 2026-09-14T03:36:12Z

## Tipo
unit-complete (correzione ambientale, in serie su tutti i banchi di Genesi)

## App
Genesi

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Completato

Estesa a TUTTI i banchi del browser di Genesi la guardia scoperta e
applicata nelle due unità precedenti: `pg.route("https://www.gstatic.com/
**", r=>r.abort())` prima di ogni apertura di `genesi.html`. Censito con
`grep -c "genesi.html" / "gstatic"` su tutti i file `genesi-*.mjs` e
`ponte-genesi-*.mjs`: **otto** ne erano privi, uno (`genesi-struttura.mjs`)
aveva un'attesa adattiva che compensava il sintomo senza saperne la causa.

**File corretti**: `genesi-documenti-che-escono.mjs`, `genesi-foglio-in-
cava.mjs`, `genesi-frasi-limite.mjs`, `genesi-numeri-tranquilli.mjs`,
`genesi-piano-innesco.mjs`, `genesi-recettore-assente.mjs` (quindici
aperture di pagina — il più esposto), `genesi-struttura.mjs`,
`ponte-genesi-campo.mjs` e `ponte-genesi-sentinella.mjs` (solo la metà
Genesi: la metà Campo/Sentinella resta fuori dal perimetro "solo Genesi").

**Una riga di commento era sbagliata, e l'ho misurata prima di correggerla**
(regola di CLAUDE.md: "niente entra sulla parola dell'agente", qui applicata
a un commento scritto in una sessione precedente). `genesi-struttura.mjs`
diceva: *"Genesi NON importa Firebase (misurato: zero riferimenti a
gstatic)"* — vero **alla lettera** (`grep gstatic apps/genesi/genesi.html`
dà zero), falso **nella sostanza**: `genesiData()` chiama
`DeepworkID.init()`, che importa Firebase da gstatic un salto più in là. Lo
stesso file aveva già un indizio non collegato: un commento del 12/09
attribuiva 13-20 secondi di lentezza interamente alla "scena 3D senza GPU".
**Misurato prima/dopo** (non dedotto): con la guardia, lo stesso banco
(18 prove) passa da **29,2s a 17,0s** — la diagnosi "senza GPU" non era
sbagliata, era **incompleta**: due cause si sommavano e la seconda non era
mai stata cercata. Corrette entrambe le righe, senza cancellarle (si vede
da dove si partiva).

**Verificato uno per uno, non in blocco**: tutti e nove i file rilanciati
per intero dopo la correzione.
- `genesi-numeri-tranquilli.mjs`: 35/35.
- `genesi-piano-innesco.mjs`: 17/17 (5 file aperti, 29 campi confrontati).
- `genesi-documenti-che-escono.mjs`: 83/83 (9 file salvati e riaperti, 2119
  numeri passati al setaccio dei decimali) — prima del fix si fermava
  oltre i 90s senza finire di aprire nemmeno il primo file.
- `genesi-foglio-in-cava.mjs`: 38/38.
- `genesi-frasi-limite.mjs`: 36/36 (20 frasi messe alla prova).
- `genesi-struttura.mjs`: 18/18, **29,2s → 17,0s** (misura sopra).
- `genesi-recettore-assente.mjs`: 19/19 — il più esposto (15 pagine), e
  quello con più da guadagnare.
- `ponte-genesi-campo.mjs`: **4→14 passati su 26** (miglioramento reale, non
  un fix completo: la pagina di Campo, non toccata per restare nel
  perimetro "solo Genesi", soffre probabilmente della stessa causa).
- `ponte-genesi-sentinella.mjs`: prima **si schiantava** con un'eccezione
  non gestita; dopo, **18→30 passati** senza schiantarsi — stesso limite
  dichiarato (la pagina di Sentinella resta fuori dal perimetro).

⚠️ **I due banchi-ponte restano parzialmente KO, ed è dichiarato, non
nascosto**: la metà che ho corretto (Genesi) funziona; l'altra metà (Campo,
Sentinella) probabilmente ha lo stesso difetto e non l'ho toccata perché la
direttiva di questo ciclo è "concentrati solo su Genesi". Non è
un'accusa alle due app: è la stessa causa ambientale già misurata due volte,
non ancora applicata dove non mi competeva.

`iniezioni-fresche.mjs` (560/560, invariato — nessuna tabella `DIFETTI`
toccata) e il giro completo su `git worktree` isolata (**40/40 comandi, 0
caduti**, 3.884 asserzioni, nessun documento diventato stale: questi
banchi non li conta `giro-node.mjs`, li conta `tutti.mjs`, un giro diverso)
confermano che nient'altro è cambiato.

## Stato roadmap

Nessuna voce toccata: correzione ambientale trasversale, non una decisione
di prodotto.

## Blocchi e limiti noti

`ponte-genesi-campo.mjs` e `ponte-genesi-sentinella.mjs` restano
parzialmente falliti in questo contenitore per la metà non-Genesi (Campo,
Sentinella), verosimilmente per lo stesso identico difetto ambientale
(l'import Firebase via `gstatic.com` che resta appeso invece di fallire
subito). Chi lavora su Campo o Sentinella può applicare la stessa riga
(`pg.route("https://www.gstatic.com/**", r=>r.abort())`) ai loro banchi.

## Prossimo passo atomico

Tornare a un'unità di prodotto: rileggere l'indice di
`vault/ROADMAP_SETTIMANA.md` per la prossima voce Genesi ancora aperta, o
sviluppare un primo pezzo scomposto della ricerca G7 (ottimizzatore di
volata) già raccolta. Nessuno stop volontario.
