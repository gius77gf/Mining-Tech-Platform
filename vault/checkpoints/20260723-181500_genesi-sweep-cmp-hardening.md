# Checkpoint — 2026-07-23T18:15:00Z

## Tipo
unit-complete (revisione sicurezza Genesi #5 — sweep pulito + hardening cmpRender/Export)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — apps/genesi/genesi.html)

## Completato
Fallback #5: dopo il fix XSS nel core, sweep di sicurezza analogo su genesi.html (il
#1 app, con import CSV/XML) via subagent, cercando lo stesso schema (dato importato
grezzo in innerHTML) e crash negli import.
- **ESITO: nessun XSS né crash di import.** L'escaper è `_rEsc`; gli unici campi di
  testo libero (nome/nota della riconciliazione) passano da `_rEsc`; tutti gli altri
  21 sink innerHTML sono numerici o da cataloghi statici/server (ESPL/ROCCE/INNESCHI);
  gli import (JSON volata, XML #321, CSV signature, mesh OBJ) hanno try/catch e
  null-guard; `D2.esplosivo/innesco/roccia` tengono solo ID validati (mai stringhe
  libere). Il bug del core (anteprima CSV grezza) NON ha analogo qui.
- **Hardening applicato** (unica nota del sweep): `cmpRender` e `cmpExport` facevano
  `JSON.parse(localStorage...)` SENZA try/catch (a differenza di `riconStorico` che lo
  guarda). Un localStorage corrotto avrebbe rotto il confronto A/B. Aggiunto helper
  `_cmpLoad(k)` con try/catch (ritorna null → si mostra lo stato vuoto "salva prima A
  e B"). Non era una vulnerabilità (non innescabile da input/import), ma è robustezza
  coerente col pattern già usato nel file.

## Verifica
Syntax genesi OK. `_cmpLoad` usato sia in cmpRender sia in cmpExport (2 occorrenze).

## Prossimo passo atomico
Never-stop: rotazione fallback. Core e Genesi rivisti per sicurezza (un fix nel core,
hardening in Genesi). Prossimo: altra iterazione / test / revisione, evitando churn.

## Blocchi
Nessuno per questa unità. Gated: passo 3 drone, #321 estetica.
