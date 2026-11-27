# Checkpoint — 2026-09-16T20:13:01Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
b5eec5f4

## Cosa è stato completato
Censimento a doppio punto di chiamata ripetuto su Conti (dopo Campo e
Terra nello stesso giorno): **terzo difetto vero trovato con lo stesso
metodo**, delegato a un agente Explore in background e verificato
personalmente prima di agire.

Trovato: il salvataggio manuale del cliente (`index.html:6971`) scrive
`listinoId: $("cl-listino").value || null`, ma `csvClienti`/`parseClientiCsv`
— la copia di sicurezza dell'anagrafica, lo stesso scrittore/lettore appena
migrato a P2 in questa sessione per la colonna `stato` — non lo portavano
da nessuna parte: né nell'intestazione, né nel corpo, né nel lettore.

Effetto verificato: un cliente con un listino personalizzato, ri-esportato
e ri-caricato dal backup, tornava silenziosamente al listino base
(`listinoDelCliente`/`prodottoPerCliente`, conti-data.js:2976, leggono
`null` come «base», senza nessun errore) — prezzi sbagliati su tutte le
pesate successive di quel cliente. Il dato demo (`conti-data.js:176`,
cliente "c2"/Stradesud, `listinoId: "l1"`) conferma che è un campo reale
già popolato, non teorico.

Corretto: `listinoId` aggiunto come quattordicesima colonna (dopo `stato`),
scrittore e lettore insieme — a differenza delle otto unità P2 di questa
sessione (dove la prima fetta scrive solo), qui il campo esisteva già su
entrambi i lati dello schermo: mancava solo il transito nel file, quindi
niente ragione di fare una prima fetta a metà.

Toccati:
- `apps/conti/conti-data.js`: `CSV_CLIENTI_INTESTAZIONE`, `csvClienti`,
  `parseClientiCsv`.
- `shared/deepwork-id-client/dw-shell.js`: `CSV_TABELLE` per `conti.clienti`
  (guardia B8).
- `apps/deepwork-id/tests/run-kpi.mjs`: due asserzioni esistenti che
  ancoravano la fine della riga su `stato` (ora non più l'ultima colonna,
  `endsWith` → regex) più un nuovo test dedicato con controprova.
- `docs/RICERCA_CONTINUA_CONTI.md`: nota di chiusura.

Controprova sul codice vero: rimessa l'omissione nello scrittore,
confermato che due asserzioni cadono, ripristinato via `cp` + `diff`.

Doc-cascade: run-kpi 3106→3107, somma nove suite 3.600→3.601, giro-totale
4085→4086. Giro isolato su worktree pulita: **41/41 comandi, 0 caduti,
4086 asserzioni — predetto e confermato ESATTO al primo tentativo**
(undicesima unità di fila con predizione esatta).

## Stato roadmap
Il censimento a doppio punto di chiamata ha trovato **tre difetti veri su
tre app diverse nello stesso giorno** (Campo, Terra, Conti) — un tasso di
successo che giustifica continuare a ripeterlo su altre app prima di
considerarlo esaurito. Restano non ancora coperte con questo metodo in
questa sessione: Flotta, Sentinella, Scudo (Scudo ha avuto una passata di
profondità nel ciclo precedente, ma non specificamente con questo metodo
del censimento a doppio punto di chiamata — da verificare se è lo stesso
o un metodo diverso prima di riprovarlo lì).

## Prossimo passo atomico
1. **Ripetere il censimento a doppio punto di chiamata su Flotta o
   Sentinella** (non ancora provato con questo identico metodo in questa
   sessione) — delegare a un agente Explore in background con lo stesso
   mandato usato per Terra e Conti, poi verificare personalmente prima di
   agire.
2. Se il metodo smette di produrre difetti veri (tre successi su tre
   tentativi finora, ma la legge dei rendimenti decrescenti si applica),
   tornare alla lista "SE LA ROADMAP SEMBRA FINITA" di CLAUDE.md.
La scelta è aperta al prossimo ciclo.

## Blocchi
Nessuno.
