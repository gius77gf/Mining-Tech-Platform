# Checkpoint — 2026-11-26T19:31:54Z — la carica che non entra nel foro

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit
quello che contiene questo file (il precedente è 2e4d0fa1, F5b; giro node su
2e4d0fa1 confermato: 43/43, 4342)

## Completato — Genesi: «la carica entra nel foro?», foro per foro
- **Da dove viene**: censimento per F6 (25 letture di `D2.diam`, 14 di
  `D2.incl`). Nessuna riga della scheda volata controllava che la carica
  stesse nella colonna del foro; con F3/F4 si poteva scrivere un foro
  impossibile — soprattutto ACCORCIANDOLO senza toccare la carica.
- **Modulo** (`genesi-data.js`, 196 → 198): `capienzaFori(holes, progetto)` →
  `{fori, verificati, nonVerificabili, alLimite[], nonEntra[], piuPieno}` e
  `MARGINE_CAPIENZA_FORO = 1.10`. Capienza = `caricaForoDaGeometria` (quella
  che il prodotto usa già) coi valori di QUEL foro; diametro, sottoperforazione
  e densità dal progetto. Avviso, non rifiuto.
- **Pagina** (`genesi.html`, 148 → 150): `capienzaD2()`, `capienzaFrase()`.
  Quattro posti, un conto: messaggio dopo aver scritto (rosso), riga `#diCap`
  nella scheda del foro, tabella (`input.oltre`, `i.ft-no`, `#ft-cap`), riga
  «Carica nel foro» nella scheda volata (rossa = indicatore grave, quindi
  entra negli avvisi dei file che escono).
- **Prove**: run-kpi 3247 → 3248; banco `genesi-foro-per-foro.mjs` 121 → 133,
  controprova 35 iniezioni su 35. Riancorata un'iniezione di F4 scaduta per la
  cella riscritta (presa da `iniezioni-fresche`). Banchi vicini verdi;
  `genesi-campi-assenti` 55/0 con i suoi 2 «non misurati» di sempre.
- **Dallo scatto a 320 px**: rombo e avviso insieme uscivano dalla colonna del
  numero → colonne `40 40 42 54 3×≥50` (430) e `40 46 3×≥48` (≤380), con la
  misura nel banco a tutt'e due le larghezze.

## Numeri scritti nei documenti
3.746 prove senza rete (run-kpi 3248); giro node 4343 (per somma: +1; da
confermare); condivisi 371/371, `genesi-data.js` 198/198; funzioni nella
pagina 150 (24/42/19/18/47, 50 su 150).

## Stato roadmap
F1–F5 ✅ · F6 aperta. Decisione 33 in attesa del fondatore.

## Prossimo passo atomico
Due candidati, in quest'ordine:
1. **Estetica della scheda del foro** (piccola, sicura): i campi di
   `#d2-insp` (`diX`, `diY`, `diRit`, `diKg`, `diProf`, `diStem`) sono campi
   bianchi del browser alti 19 px; quelli della tabella (`.ft-r input`) e dei
   parametri (`.dc-f input`) sono scuri, alti 40. Dare a `#d2-insp input` lo
   stesso stile (fondo `#241d12`, bordo `#473a1f`, testo `var(--tx)`, 16 px,
   `min-height:40px`, fuoco color rame), togliendo le larghezze in linea che
   non servono più; confronto affiancato con la tabella, scatti a 430 e 320 px,
   banco del contrasto con `--solo=genesi`; il bordo giallo dei valori propri
   deve restare visibile.
2. **F6, prima fetta: il diametro per foro** — come scritto nel checkpoint
   precedente (`…_genesi-F5b-volata-json-per-foro.md`), con in più: la
   capienza (`capienzaFori`) è il primo conto che deve leggere il diametro del
   foro, e il piano d'innesco XML ha `HoleDiameter` solo in `PlanData`.

## Blocchi
Nessuno. In attesa del fondatore: decisione 33; canarino su main (serve una PR).
