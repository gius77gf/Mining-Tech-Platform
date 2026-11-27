# Checkpoint — 2026-09-02T19:05:22Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
f20b9668 — Ponte 3f, Campo→Conti: il prodotto dichiarato dai turni contro il pesato in uscita

## Completato
Il terzo lato del triangolo della produzione (mappa §3f): Campo→Conti,
tonnellate contro tonnellate, l'unico lato che non ha bisogno della densità.
- `confrontoProdottoVenduto` in `shared/dw-ponti.js` (stati, divario col
  segno, verso a parole, `fuori`, `parziale` anche per il turno senza
  quantità), ri-esportata da Conti per identità;
- Conti legge `rapportini` di Campo con un'istanza pigra (`null` se non
  risponde) e porta in dimostrazione una COPIA dei dieci rapportini di Campo
  con le stesse date relative — una prova la tiene uguale id per id;
- nel Report, sotto «Cavato contro venduto»: «Prodotto contro venduto», due
  colonne, verso a parole, coda con i fuori; Campo assente → nota warn e
  nessuna tonnellata attribuita; il lato Campo si disegna PRIMA delle uscite
  anticipate del lato Terra;
- misurato prima sulla cava sintetica (confrontabile 4/4 trimestri; il divario
  identico 83-86% è del generatore);
- run-kpi 2431 → **2438** (7 prove), banco `conti-ponte-campo.mjs` nei tre
  modi (15 / 10 / controprova che cade in 4), registrato in `tutti.mjs`
  (211 → **214** esecuzioni, 86 → **87** file); copertura dw-ponti 50 → 51;
  scatti guardati a 430 buio e 320 chiaro;
- giro node: 36/37 a posto, il 37° era il conto dei documenti, corretto
  (prove **2.919**, asserzioni **3.286**, condivisi **187/187**).

## Stato roadmap
Obiettivo «ponte 3f» spuntato; mappa §6: **11** ponti su 56, **1** famiglia
scoperta (la 3e, che passa da un file: Genesi→Sentinella e simili — è il
capitolo «Genesi fuori dal browser», `docs/GENESI_FUORI_DAL_BROWSER.md`).

## Prossimo passo atomico
Sul disco, NON committata, c'è la ricerca (metà sul mondo) appesa a
`docs/RICERCA_CONTINUA_conti.md` sulla riconciliazione prodotto / venduto /
scorte a piazzale. Va LETTA e poi va fatto il delta da chi ha il codice in
mano, partendo dal MECCANISMO: aprire `vendutoPeriodo`, `riconciliazione`,
`confrontoProdottoVenduto` e `renderProdottoVenduto` e rispondere alle
domande in fondo alla ricerca (chi distingue la densità in banco da quella
sciolta? chi tiene lo storico dei divari mese per mese?). Un «non c'è» entra
solo con il comando e la sua uscita. Poi si committa la ricerca col delta
scritto sotto.
Dopo: il binario 2 riparte (seconda passata in profondità, ricominciando da
Conti, la cui schermata Report è appena cresciuta), oppure il piano in 8 unità
di `docs/GENESI_FUORI_DAL_BROWSER.md` per l'ultima famiglia (3e).

## Blocchi
Nessuno. PR #345 aperta; il merge su main è del fondatore.
