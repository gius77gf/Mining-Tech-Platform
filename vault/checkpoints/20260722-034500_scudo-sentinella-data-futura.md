# Checkpoint — 2026-07-22T03:45:00Z

## Tipo
unit-complete (Scudo + Sentinella — blocco date future nei registri HSE/enti)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — blocco date future)

## Completato
"Non mettiamo da parte gli altri progetti": una revisione delle 6 app verticali
(agente Explore) le ha trovate molto curate (esc ovunque, parser robusti,
filtri/stati-vuoti presenti). Le uniche lacune vere erano di INTEGRITÀ DATO.
Corrette le due a più alto valore/rischio, identiche nel pattern:
- **Scudo** (`apps/scudo/index.html`): un infortunio/near-miss si poteva salvare
  con data NEL FUTURO. La data più recente pilota il cartellone "giorni senza
  infortuni" (giorniSenza = max(0, -giorniTra(ultimo, oggi))): un refuso con data
  futura azzerava il contatore e lo coloravadi allarme → cifra di sicurezza
  SBAGLIATA su un documento HSE. Aggiunto `max`=oggi sull'input + guardia
  nell'handler (`giorniTra(data) > 0` → rifiuto con messaggio).
- **Sentinella** (`apps/sentinella/index.html`): stessa cosa sul registro volate
  (brogliaccio di brillamento, documento verso gli enti); una volata futura
  sballava il conteggio "questo mese". Stessa guardia.
Riuso di `giorniTra` (helper condiviso, mezzanotte LOCALE) → coerente col calcolo
dei KPI, nessun off-by-one UTC. Additivo, nessuna regressione.

Verifica: syntax CI OK su entrambe; logica in Node (ieri/oggi accettati, domani/
+30gg rifiutati); smoke Playwright — entrambe le app si avviano senza errori
(l'import di `giorniTra` risolve) e `max` = 2026-07-22 impostato.

## Prossimo passo atomico
Restano dalla shortlist Explore: filtro Infortuni/Near-miss nella lista Scudo
(#inf-list, media, ~12 righe) e la nota minore sul campo `luogo` mezzo-cablato
(da chiarire: scelta voluta o input mancante). Poi altre seconde iterazioni UX
o i punti pesanti Genesi (con il fondatore).

## Blocchi
#321 estetica Genesi: attende il fondatore. Tutto sul branch unico #321 (ora
include anche questi fix app verticali — coerente con la regola "un solo branch
di sessione"; offerto lo split al fondatore).
