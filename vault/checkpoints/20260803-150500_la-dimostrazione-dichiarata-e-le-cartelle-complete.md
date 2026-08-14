# Checkpoint — 2026-08-03 15:05:00 UTC

## Tipo
unit-complete (due unità: Scudo · i documenti che escono; la dimostrazione
dichiarata sui fogli di Conti e Terra)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`3be554d` — *Un foglio di dimostrazione si portava a un controllo senza niente
che lo distinguesse*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|---|---|
| 56 | **Scudo · i documenti che escono** (`1857d83`) | **5 cartelle su 7** uscivano «complete» con dentro una visita medica scaduta |
| 57 | **la dimostrazione dichiarata** (`3be554d`) | Conti **3 fogli**, Terra **2**: nessuno diceva di essere d'esempio |

## ⛔ Il filo, e sono due domande in fila
La prima è quella del 03/08, ormai misurata su tutte e sei le app più il core:
*dove il documento si compone, chi decide i suoi numeri?* La seconda è nata
stamattina e non l'aveva ancora fatta nessuno: **un documento prodotto in
modalità dimostrazione dice di esserlo?**

Sulla prima, Scudo ha dato la variante nuova e vale per il futuro: **una
domanda sola non basta a giudicare un documento.** `completa` risponde a «ci
sono sezioni senza righe?» e rispondeva bene; il fascicolo però si legge con
una seconda domanda — «le righe che ci sono, sono in regola?» — che nessuno
faceva. Il segno era quello di sempre, un colore **tranquillo** (il grigio)
dove non era stato guardato niente. Non è un filtro storto da aggiustare: è la
**domanda affiancata** della regola già scritta in CLAUDE.md.

Sulla seconda: lo schermo dichiara la dimostrazione **due volte** — la fascia
in alto e la riga di stato — e la stampa le nasconde **tutt'e due**, perché
sono comandi e non documento. Quello che esce, però, è il DDT che viaggia sul
camion e che legge la Guardia di Finanza, il prospetto che si allega alla
comunicazione annuale, il verbale che rende un rilievo opponibile.
⚠️ E in Terra la stampa lo nasconde **ancora meglio**: quei due fogli non sono
la pagina stampata, sono un HTML costruito nella pagina e scritto in una
**finestra nuova**, dove il `@media print` della pagina non arriva mai. Chi
cerca questo difetto in un'altra app deve guardare tutt'e due i modi.

## ⚠️ Due trappole della raccolta, e la seconda ha morso
1. Il cantiere di Scudo aveva ricostruito `copertura-funzioni.mjs` da una base
   vecchia e il suo file **riportava `dw-shell.js` da 38 a 37**, cioè
   cancellava una modifica di `a2485ba`. Presa affiancando il file di `HEAD`:
   è la ragione per cui i file condivisi si costruiscono **da `HEAD`** e non si
   prendono dal disco.
2. `run-kpi.mjs` e `tutti.mjs` sul disco avevano **blocchi spostati** (188
   righe). Non era una perdita — provato confrontando gli **insiemi** invece
   delle righe in ordine: 3 righe tolte, tutt'e tre correzioni volute. Il
   controllo che lo dice in un comando:
   `diff <(sort HEAD) <(sort disco) | grep '^<'`.

## Stato delle prove
Prove **2.102** senza rete (run-kpi **1701**, stile 289), copertura **650/650**,
banchi 84. Giro `node` **21 comandi, 0 caduti** sulla copia di ciò che si
committa, per tutt'e due i commit. Banco `scudo-documenti` 58 ok · 0 KO
(controprova 18/18 iniezioni → 27 KO); banco `stampe-fs` 58 · 0
(controprova 8 iniezioni → 22 falliti, e **`--live` 35 · 0**: la dichiarazione
sa anche **tacere** quando i dati sono veri).
Scatti guardati: elenco Personale di Scudo, foglio della fattura di Conti in
`@media print`.

## Che cosa sta girando adesso
- **il giro completo del browser** (`capo/giro5.txt`) — da oltre quattro ore,
  non ha ancora scritto `USCITA=`;
- **tre cantieri**: **Scudo** (dichiarazione sui fogli + la tendina `#nm-chi`
  tagliata a 390 px), **Campo** (dichiarazione sul rapporto di fine turno),
  **i CSV** di conti/flotta/sentinella/terra/genesi;
- **una ricerca** sul *rapporto di fine turno in cava* — il mestiere, che
  CLAUDE.md dichiara come carenza di chi lavora qui.

## Prossimo passo atomico
1. Raccogliere i tre cantieri, **app per app**, con la solita procedura: indice
   costruito **da `HEAD`** tagliando la banda dell'app (mai dal disco, vedi la
   trappola 1 qui sopra), worktree **ricreata** ogni volta, numeri di `docs/`
   riletti **dalla copia**. Ogni cantiere ha un marcatore di banda concordato in
   `run-kpi.mjs`: `// ═══ SCUDO · la dimostrazione dichiarata`, `// ═══ CAMPO ·
   la dimostrazione dichiarata`, `// ═══ I CSV E LA DIMOSTRAZIONE DICHIARATA`.
2. ⚠️ Il cantiere dei CSV ha il **divieto** di toccare `shared/`: se conclude
   che serve una funzione condivisa, arriva come **proposta** e il trasloco lo
   faccio io.
3. Leggere `giro5.txt` alla fine (cerca `USCITA=`).
4. Poi: le tre proposte della ricerca su Scudo, **rimisurate una per una**.

## Code aperte, dichiarate
Immutate: `riconSave` che non registra la legge che ha prodotto la previsione,
il costo unitario che schermo e foglio raccontano diverso in Genesi, la riga
**DUVRI** da portare al fondatore col suo RSPP. Le **19 decisioni** procedono
**venerdì 07/08** se non arriva risposta, dichiarandolo nel commit.

## Blocchi
Nessuno.
