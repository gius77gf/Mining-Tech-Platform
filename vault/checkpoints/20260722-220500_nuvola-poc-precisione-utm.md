# Checkpoint — 2026-07-22T22:05:00Z

## Tipo
unit-complete (POC nuvola — fix precisione coordinate georeferenziate UTM)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — precisione UTM)

## Completato
Secondo bug REALE trovato nella revisione serale, pensando al dato reale del
weekend: le nuvole georeferenziate ODM hanno coordinate enormi (UTM ~500.000 /
5.000.000). Il codice faceva `new Float32Array(p.pos)` PRIMA di centrare → a quella
scala Float32 ha precisione ~0,3 m, quindi i punti si "incollavano" a una griglia
e il dettaglio fine del fronte si perdeva.
- `apps/genesi/nuvola-poc.html`: `placeCloud` ora **centra in DOPPIA precisione**
  (calcola baricentro e sottrae sui double `p.pos`) e SOLO DOPO passa a Float32
  (valori piccoli, nessuna perdita). Rimosso il vecchio `centerInPlace` (morto).

Verifica: syntax OK; nessun riferimento residuo a centerInPlace; Playwright con
nuvola a coord UTM (~500k/5M) e dettaglio z di 0,1 m → dimensioni "19.6 × 0.1 ×
15.6", il dettaglio 0,1 m è PRESERVATO (prima sarebbe stato cancellato dai ~0,3 m
di quantizzazione Float32), nessun errore.

## Prossimo passo atomico
Revisione serale conclusa con 2 fix reali sul POC (downsample XYZ + precisione UTM)
→ il visualizzatore è ora robusto per il test del fondatore col dato ODM reale.
Proseguo coi fallback. Passo 3 drone (aggancio fronte→volata) gated sul test weekend.

## Blocchi
Passo 3 drone: gated sul fondatore. #321 estetica: gated. #321 unico branch.
