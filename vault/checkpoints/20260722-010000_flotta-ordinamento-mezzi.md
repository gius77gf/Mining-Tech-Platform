# Checkpoint — 2026-07-22T01:00:00Z

## Tipo
unit-complete (UX app verticale — Flotta, ordinamento mezzi)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Flotta ordinamento mezzi)

## Completato
Fallback #1 (seconde iterazioni app — ordinamenti), dopo Conti (#305 mergiato).
La lista mezzi di Flotta era ordinata solo per stato; ora c'è un controllo
"Ordina":
- `apps/flotta/index.html`: select `#mez-ord` (stato prima i fermi / ore motore
  dal più alto / nome A→Z); stato `ordMez` + comparatore `mezCmp`; il render usa
  `.sort(mezCmp)`. Rispetta il filtro attivo (tutti/operativo/verifica/fermo).
Utile per la manutenzione (ordinare per ore motore → chi è più vicino al
tagliando) e per il colpo d'occhio sui fermi (default).

Verifica: `node --check` del modulo Flotta OK; Playwright — default stato
(fermi/verifica prima) → ore riordina 9.105→8.420→6.540→5.870 h (decrescente)
→ nome in ordine alfabetico (D1, D3, E1, E2, Pala, Perforatrice); nessun errore
di pagina. Screenshot catturato.

## Prossimo passo atomico
Aprire PR; dopo merge, proseguire con altre seconde iterazioni UX (ordinamenti/
filtri dove mancano: Campo/Terra/Scudo/Sentinella) o test aggiuntivi.
Burden-reale Genesi resta rimandato (segno geometrico da chiarire col fondatore).

## Blocchi
Burden-reale Genesi: conferma geometria. Core Fasi 3-4: gated (auth Firebase).
Dati default sensibili + mitigazione password: non toccare senza conferma.
