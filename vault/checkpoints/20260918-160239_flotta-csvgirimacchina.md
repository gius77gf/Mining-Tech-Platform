# Checkpoint — 2026-09-18T16:02:39Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
ebda5bd6 — fix(flotta): csvGiriMacchina scriveva le ore col punto inglese

## Cosa è stato completato
Chiusa l'unità pendente dalla sessione precedente (prima della
compattazione): `csvGiriMacchina` di Flotta scriveva la colonna `ore` col
punto inglese invece della virgola italiana — sesta ricorrenza della
stessa famiglia già chiusa in cinque export gemelli il 17-18/09. Corretto
con `mostra(c.ore, 1)`.

Il worktree originale (`/tmp/wt-flotta-csvgiri`, creato prima di quattro
unità intermedie) era **stale**: il suo `run-kpi.mjs` non conteneva le
prove aggiunte da allora. Seguita la regola stabilita in questa sessione
per i worktree stale: ricostruito da HEAD corrente
(`/tmp/wt-flotta-csvgiri2`) e riapplicata a mano solo la piccola modifica
(la funzione + il test), non il diff completo del worktree vecchio.

## Verifica
- KPI: 3154/0 (invariato: assert aggiunti dentro un test esistente).
- Controprova inline verificata (col vecchio `c.ore || ""` il nuovo assert
  cade, mostrando "4100.5" invece di "4.100,5").
- `sintassi-pagine.mjs`: 34/34. `suite-collegate.mjs`: invariato (nessun
  file nuovo).
- Giro completo `giro-node.mjs` (rilanciato due volte per far convergere
  il numero): 41/41 comandi. Asserzioni eseguite dal giro: 4155→**4156**,
  propagato in DEVELOPMENT.md e STATO_PRODOTTO.md.

## Stato roadmap
In coda dai deep-pass QA di background, tutti verificati dal vivo (non
sulla parola sola), in ordine di implementazione:
1. **Scudo** — `statoAppalto` non segnala una qualifica "in-scadenza".
2. **Campo** — banner Squadre ignora `hse.senzaScadenze`.
3. **Flotta** — fascia colore della riga componenti a vita propria fissa.
4. **Conti** — `emessoIncassato` (conti-data.js ~2645-2682) non applica
   `!statoSdi(f,oggi).nonEmessa`: una fattura scartata dallo SdI (f4 della
   demo, € 5.900) viene contata come "emesso" nel Report, gonfiando
   "Emesso e non ancora incassato (6 mesi)" di € 5.900 e la linea del
   grafico. Verificato dal vivo (Playwright + chiamata diretta del modulo).
Da investigare (non ancora un difetto confermato): il crash di
`flotta-contatore.mjs --controprova` incontrato per caso durante il giro
dell'unità precedente (bottone "Riscrivi sul contatore nuovo" alto 0px).

Tre nuovi agenti di deep-pass QA dispatchati in questo blocco: Campo,
Flotta, Conti — tutti tornati con un difetto verificato. Sentinella
(angolo nuovo) è tornato onestamente negativo. Nessun agente attualmente
in corso: da rilanciare per mantenere ≥3 cantieri (candidati non ancora
battuti oggi: Genesi secondo giro, Terra secondo giro, i ponti in
docs/MAPPA_ECOSISTEMA.md per una sovrapposizione nuova — priorità
indicata dalla routine di questo ciclo).

## Prossimo passo atomico
Implementare il fix Scudo `statoAppalto` (task #3, il primo della coda):
in `apps/scudo/scudo-data.js:6139-6151`, la riga 6145 esclude
esplicitamente `qualifica.esito==="in-scadenza"` sia da `problemi` sia da
`ignoti`. Instradarlo in un nuovo elenco `avvisi` (parallelo, non
sostitutivo), letto sia dalla riga dell'appalto in `index.html` (la
`dire` a riga ~3054, `[...r.problemi, ...r.ignoti]` — va estesa) sia da
`riepilogoAppalti` (righe 6168-6188, che oggi conta un appalto così in
`aPosto`). Isolare in una worktree fresca da HEAD, verificare con
Playwright (il caso già esiste nella demo: impresa "Autotrasporti Valle
srl", DURC in scadenza) + controprova prima di committare. In parallelo,
dispatchare 2-3 nuovi agenti di deep-pass QA per mantenere ≥3 cantieri.
Poi proseguire con Campo (#4), Flotta fascia colore (#5), Conti
emessoIncassato (#7), l'investigazione flotta-contatore (#6). Continuare
"mai fermarsi".

## Blocchi
Nessuno.
