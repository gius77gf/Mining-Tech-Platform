# Checkpoint — Genesi: il CSV della scheda volata dice chi forma la MIC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit
Quello che contiene questo file («feat(genesi): il CSV della scheda volata
dice chi forma la MIC»). Dei precedenti: `2a0714a2` (la MIC dice quali fori)
è confermato dal giro `node` (47 comandi, 4536) e dal giro completo dei 56
banchi di Genesi su una copia del committato, 56 su 56 a uscita 0.
⚠️ `0bc3efe8` (cariche nel tempo) ha il giro di conferma ANCORA IN CORSO
(`scratchpad/giro48.log`, `giro48-banchi.txt`): va letto.

## Che cosa è stato fatto
- `apps/genesi/genesi.html`: `micChi` in `computeKPI`; riga «Fori che
  formano la MIC» nel CSV della scheda volata.
- `run-kpi`: un'asserzione in più nella prova della MIC (totale invariato,
  3271).
- `genesi-foglio-pianta.mjs`: gancio sui file `data:` scaricati, 82 → 84
  controlli, controprova 20 → 21 difetti.

## Verifiche (lette dai registri)
- Giro `node` sullo stato in indice: 47 comandi a posto, 0 caduti, 4537.
- Sull'albero vero: `genesi-foglio-pianta` 84/84 e controprova «✔» (21
  difetti su 21); `genesi-documenti-che-escono` 101/101 e controprova (16
  iniezioni su 16, uscita 0); foro-per-foro 214/214; maglia-assente 40/40.
- ⚠️ NON rigirati su questo stato: gli altri banchi di Genesi.

## Numeri dichiarati nei documenti
Invariati: 3.773 prove senza rete · giro 4537 su 47 comandi · condivisi 401
su 401 · `genesi-data.js` 227/227 · pagina 162 funzioni · 471 esecuzioni nel
browser da 216 file.

## Prossimo passo atomico
**Sulla pianta del foglio, il fondo arancio ai fori dei gruppi che arrivano
alla MIC** (lo stesso arancio delle barre di «Cariche nel tempo»). Già
provato su una copia in `scratchpad/fondo/` (`patch_modulo.py`,
`patch_kpi.py` con `kpi-blocco.txt`, `patch_banco.py`): `run-kpi` 3272 sulla
copia, 7 difetti rimessi uno per volta e ognuno cade sulla SUA asserzione.
Manca: il banco fatto girare (87 controlli attesi, 23 difetti), lo scatto
guardato, i numeri nei documenti (run-kpi 3271 → 3272, quindi 3.774 e giro
4538; il modulo NON cambia conto: la funzione nuova è interna), la roadmap.
Se lo scratchpad è sparito:
1. Modulo: `_indiciNellaMic(H, kg)` (interna) → indici dei fori in una
   finestra che arriva alla MIC, tutti i gruppi alla pari; vuoto se la MIC
   non si conta o è zero, se ogni foro parte da solo, o se un foro di quei
   gruppi non ha un ritardo leggibile. In `piantaPerFoglio`: fondo
   `#ffd9b8` per quegli indici (per INDICE, non per numero) e voce di
   legenda «fondo arancio: nei gruppi che fanno la MIC».
2. `run-kpi`: tre liste di legenda attese guadagnano la voce; il conto dei
   chiamanti di `_finestreDiCarica` passa a 5; prova nuova (11 asserzioni).
3. Banco: `fondo` letto dai cerchi; tre controlli nella sezione MIC contro
   la tabella dello stesso foglio; due difetti in più.

## Blocchi (del fondatore)
Decisioni 28, 33 (⚠ quale foro usa la gittata), 34 (lettore LAZ), 35 (spalla
al piede), 36 (accenti nei CSV: prima la prova con Excel), 37 (sul telefono:
trascinare un foro subito o dopo averlo scelto); 32 rimandata.
