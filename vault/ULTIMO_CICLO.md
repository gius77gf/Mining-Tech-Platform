# Ultimo ciclo

## Ora UTC (letta da `date -u`, mai predetta)
2026-09-15T21:48:13Z

## Commit di partenza
42936c01 (checkpoint: righeCsvNumerate, secondo lotto migrato (Scudo/Sentinella))

## Cosa sto per fare
Terzo lotto della migrazione `righeCsvNumerate` (numero di riga fisico
nel file per i lettori `scarti*Csv`, dal delta della riverifica su
`docs/RICERCA_CONTINUA_PAROLE.md`) è già scritto e testato in locale
(Campo: `scartiSquadreCsv`, `scartiPianoCsv`; Flotta: `scartiRicambiCsv`,
`scartiMezziCsv`; nuovo test B13; controprova già fatta e ripristinata).
Sto verificando su una worktree isolata (`giro-node.mjs` già girato,
`numeri-nei-documenti.mjs` in corso su una seconda passata dopo la
correzione dei numeri nei quattro documenti — run-kpi 3036→3037, somma
nove suite 3.527→3.528, asserzioni giro 3.993→3.994). Dopo la verifica:
commit, push, checkpoint, poi si prosegue subito con il quarto lotto
(Conti, sei lettori) e con le tre forme non standard rimaste
(`scartiLavoratoriCsv`/`scartiAzioniCsv` di Scudo, `scartiTelemetriaCsv`
di Flotta), come da "prossimo passo atomico" del checkpoint precedente.

## Che cosa resta aperto
- Migrare i sei lettori di Conti a `righeCsvNumerate`.
- Estendere `righeCsvNumerate` per accettare un predicato (non solo una
  parola chiave) per `scartiLavoratoriCsv`, verificando che il
  contratto esistente (stringa) non cambi per i chiamanti già migrati.
- `scartiAzioniCsv` e `scartiTelemetriaCsv` restano fuori finché non si
  decide come dare a `leggiCsv`/al parser posizionale il numero di riga
  fisico: un cambiamento più grande, da scomporre a parte.
- Dopo i lettori CSV: rotazione della ricerca continua (Deepwork ID e
  il core non hanno ancora avuto una passata questo ciclo).
