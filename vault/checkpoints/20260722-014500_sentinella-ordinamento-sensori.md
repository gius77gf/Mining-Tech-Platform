# Checkpoint — 2026-07-22T01:45:00Z

## Tipo
unit-complete (UX app verticale — Sentinella, ordinamento sensori)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Sentinella ordinamento sensori)

## Completato
Fallback #1 (seconde iterazioni app — ordinamenti), quinta e ultima app della
serie: dopo Conti (#305), Flotta (#306), Scudo (#307), Terra (#308). La lista
sensori/monitoraggi di Sentinella era ordinata solo per criticità; ora c'è un
controllo "Ordina":
- `apps/sentinella/index.html`: select `#mon-ord` (criticità dal più critico /
  margine dal più tranquillo / nome A→Z); stato `ordMon` + comparatore `monCmp`
  (usa `st.ratio` — % sulla soglia — per criticità/margine); il render usa
  `.sort(monCmp)`. Rispetta il filtro attivo (tutti/conformi/attenzione/
  superamenti).
Utile per vedere prima i superamenti (criticità) o, al contrario, controllare
chi ha più margine prima di una soglia (margine).

Verifica: `node --check` del modulo Sentinella OK; Playwright — criticità
112%→92%→89%→36%→34% (decrescente) → margine 34%→36%→89%→92%→112% (crescente,
i più tranquilli in cima) → nome in ordine alfabetico; nessun errore.
Screenshot catturato.

Con questa unità TUTTE le app verticali con liste principali hanno un controllo
di ordinamento coerente (stesso pattern select + comparatore).

## Prossimo passo atomico
Aprire PR; dopo merge, valutare ordinamento su Campo attività (stato/titolo) —
ultima lista senza controllo — oppure spostarsi su altre seconde iterazioni
(stati vuoti, validazioni input) e test aggiuntivi. Burden-reale Genesi resta
rimandato.

## Blocchi
Burden-reale Genesi: conferma geometria. Core Fasi 3-4: gated (auth Firebase).
Dati default sensibili + mitigazione password: non toccare senza conferma.
