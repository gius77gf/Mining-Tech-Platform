# Checkpoint — 2026-08-07 10:15:00 UTC

## Tipo
unit-complete (tre unità: il canarino, Sentinella nei temi chiari, e la Parte 6
di `PALETTE_APP.md`)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`26c0a7a` — *PALETTE_APP: le sei palette erano verificate a contrasto in un tema
su tre*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|---|---|
| 130 | **canarino** (`b5791f8`) | ciclo vivo alle 09:44 UTC |
| 131 | **Sentinella nei temi chiari** (`24c4d89`) | chiaro **10 → 0**, sole **10 → 0**, scuro **0 → 0** |
| 132 | **`PALETTE_APP` Parte 6** (`26c0a7a`) | 54 nel chiaro, 54 nel sole, **0** nel buio |

## ⛔ Non era un difetto del sole: era un difetto di tutto ciò che non è buio
Ho rimisurato io, indipendentemente, `--tema=chiaro` su tutte le superfici:
**54 sotto soglia su 3.692 testi** — flotta 13, sentinella 10, campo 10, conti
10, scudo 9, terra 2. Lo **stesso identico numero** del tema `sole`. Il mandato
del cantiere parlava del solo `sole`; il cantiere ha guardato anche il chiaro e
ha trovato gli stessi dieci.
**La causa è una sola per tutte e sei**: `--success/--warn/--danger` sono
dichiarati **una volta sola, per il buio**. E non si risolve ridefinendo
`--warn`, che fa **due mestieri** — è anche il *pieno* di `.badge.warn`, che
sopra ci scrive un quasi nero: scurirla sposta il difetto.
⚠️ **E servono due livelli, non uno**: portando tutto a 4,9:1 la prova **passa**
e il numerone d'ambra diventa **marrone** accanto alla sua pastiglia. Le soglie
WCAG sono due davvero, e una cifra da 34 px non ha bisogno di stare al livello
di un'etichetta da 8 px. Si vede **solo affiancando gli scatti**.

## ⛔ E la prima cosa da correggere era quello che avevo scritto io
Avevo committato «le 29 del tema sole sono diventate **54 vere**», verificandone
due a mano. Il cantiere ne ha verificate dieci con uno strumento indipendente
(conto WCAG riscritto + lettura dei **pixel** dallo screenshot): il banco è stato
smentito **una volta su dieci** («µg/m³» dichiarato 2,92, vale **4,71** — cioè
passava) e altre quattro sono vere ma prudenti.
Il numero giusto è **54 segnalate**, non 54 vere. La causa è la **settima
trappola** di `contrasto.mjs`: `sfondiDi` accoppia il pixel d'inchiostro più
chiaro col pixel di fondo più scuro **anche quando stanno agli angoli opposti**
— fino a 1,8 di rapporto su un elemento all'estremità di un gradiente a 135°.

## Stato delle prove
Giro `node` **23 comandi, 0 caduti**. Prove **2.248** (`run-stile` 292 → 293),
copertura **677/677**, banchi **129**.

## Che cosa sta girando adesso
1. **Il giro completo pulito su `4643be7`**: quindici sezioni, **2 KO** in tutto,
   tutt'e due nel documento che esce dal core (la riga TOTALI somma anche i turni
   mai misurati: `46 · 419.0 · 3466.1` dove il banco si aspetta `34 · 317 ·
   2395.1`). ⚠️ Quel banco è poi **morto** con un `page.click` scaduto: prima di
   correggere il core va stabilito se il difetto è suo o del prodotto.
2. **Cinque cantieri**: Flotta, Conti, Scudo, Campo e Terra sui temi chiari (a
   tutti è vietato toccare `shared/`), più uno sul **core** per la domanda dei
   totali.

## Prossimo passo atomico
1. **Raccogliere i cinque cantieri dei temi chiari**, uno per uno, verificando
   ognuno sulla copia di quello che si committa. ⚠️ Se più d'uno dice che la
   costruzione a due livelli va in `shared/`, quella è **mia** e si fa una volta
   sola per tutte e sei.
2. **Raccogliere il cantiere del core** e, solo se il difetto è del prodotto,
   correggerlo dove la regola già vive.
3. **Registrare `--tema=chiaro` e `--tema=sole` in `tutti.mjs`** quando le sei
   app sono a zero — non prima: un banco registrato che fallisce rende rosso il
   giro di tutti.
4. **La settima trappola del righello** (accoppiamento delle fermate agli angoli
   opposti) resta aperta e dichiarata: è la ragione per cui le 54 sono
   «segnalate» e non «vere».
5. ⚠️ **Le 19 decisioni**: è venerdì 07/08, si applicano **a fine giornata** se
   non è arrivata risposta, dichiarandolo nel commit.

## Code aperte, dichiarate
- **I bordi di stato non sono testo e nessuno li misura** (WCAG 1.4.11 → 3:1):
  nei temi chiari `--warn` fa **1,92:1** su bianco, `--success` **2,35:1**.
  Sotto il sole quella striscia è come si distingue una scheda a posto da una in
  attenzione.
- **Nove selettori su ventidue** la dimostrazione non li fa mai comparire.
- Il secondo difetto della **regola 24** di `run-stile`, misurato e non corretto.
- Le 136 occorrenze di `body.outdoor-mode` nel core.

## Blocchi
Nessuno.
