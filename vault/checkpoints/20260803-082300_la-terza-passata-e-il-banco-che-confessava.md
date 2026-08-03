# Checkpoint — 2026-08-03 08:23:00 UTC

## Tipo
unit-complete (tre unità: firma di chiusura, la regola del banco cieco, la
consegna di turno)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`a6185f9` — *La consegna di turno elencava le causali dei fermi e non quanto
sono durati*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|---|---|
| 31 | **la firma di chiusura** (`2fa4c90`) | l'unica delle tre mancanze proposte dalla ricerca che ha **retto** alla riverifica |
| 32 | **la regola del banco che confessa** (`7a5e6ba`) | «68 da aprire, **0** aperte» stampato da mesi in fondo a una pagina di verde |
| 33 | **la consegna di turno** (`a6185f9`) | elencava «Guasto meccanico: 3» — quante volte, non quanto tempo |

⛔ **Il difetto sotto la consegna era vero e non si vedeva**: `paretoFermi`
sommava con `+a.fermoMin || 0`, quindi un guasto **mai misurato** entrava nel
Pareto valendo zero e il totale scendeva in silenzio. E **due prove esistenti
lo blindavano** — una pretendeva letteralmente `minuti: 0` su un fermo che i
minuti non li ha. Riscritte più giuste, non più permissive.

## Il seguito della cecità sul core, con la seconda causa trovata
Il rilevatore dei candidati da cliccare era scritto sulla forma delle **app**
(`.item[onclick]`); il core usa `.sitem`. Il banco provava **6.800 comandi** e
apriva **zero modali su 68**, perché i bottoni veri navigano e tutto quello che
apre una scheda nel core è una riga di lista. Aggiunto `.sitem[onclick]`.
⏳ **La misura è ancora in corso** (`scratchpad/capo/modali-core2.txt`): il
banco sul solo core gira da oltre venticinque minuti, che è già un segno —
prima finiva in pochi minuti perché non apriva niente. Il numero va letto prima
di committare la riga.

## Stato delle prove
run-kpi **1609**, stile 284, helpers 63, pointcloud 32, manifest 9, demo 8 →
**2.005** senza rete; **67** banchi del browser; copertura 642/642; giro `node`
**20 su 20**; albero pulito.

## Prossimo passo atomico
1. Leggere `scratchpad/capo/modali-core2.txt` (cerca `aperte e guardate`): se
   il core adesso apre le sue modali, committare `modali-dentro.mjs` con il
   numero prima/dopo; se apre ancora zero, la terza causa va cercata sul
   **click** (il rilevatore vuole `#modal.show` + `.modal-box` + `#modal-title`,
   e il core li ha tutti e tre).
2. **Rilanciare il giro completo del browser** su un commit fresco: è il primo
   giro in cui il core è davvero visibile, e va fatto quando la macchina è
   libera — con tre cantieri e due banchi insieme si è già visto un banco morire
   con «Target page has been closed».
3. Poi: gli altri due punti dichiarati scoperti dai cantieri —
   `_sitoParseCsv` di Genesi che resta a metà fuori da `shared/`, e gli id
   orfani nelle mansioni di Scudo (decisione di prodotto, non da prendere da
   soli).

## Code aperte, dichiarate
Immutate: il salvataggio del rapportino (procede **venerdì 07/08** se il
fondatore non risponde), `riepilogoCosti` di Conti, `+null` nelle letture di
Sentinella, `riepilogoControllo.gravita` di Flotta, la scorciatoia ES6 per la
regola 20, `ppvPrevFonte` e `airblastDb` di Genesi.

## Blocchi
Nessuno. Al fondatore restano **19** decisioni.
