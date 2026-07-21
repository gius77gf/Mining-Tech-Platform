# Checkpoint — 2026-07-22T02:45:00Z

## Tipo
unit-complete (rifinitura UX — memoria dell'ordinamento, tutte le app)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — persistenza ordinamenti)

## Completato
Rifinitura della serie ordinamenti (#305-310): ora la scelta "Ordina" viene
RICORDATA tra una visita e l'altra, in tutte e 6 le app.
- `apps/{conti,flotta,scudo,terra,sentinella,campo}/index.html`: all'avvio si
  legge `localStorage.dwSort_<lista>` e si ripristina stato + valore della
  select; al cambio si salva. Tutto in `try/catch` (se localStorage è bloccato o
  il valore è invalido, si resta sul default: nessun crash).
Chiavi: dwSort_fat / dwSort_mez / dwSort_scad / dwSort_ril / dwSort_mon /
dwSort_att. È preferenza UI locale (non dato sensibile), quindi localStorage va
bene e non tocca l'isolamento multi-tenant.

Verifica: `node --check` dei 6 moduli OK; Playwright — Conti (importo),
Sentinella (margine), Campo (titolo): scelta salvata e RIPRISTINATA dopo reload;
nessun errore. Gli altri 3 usano lo stesso identico pattern (syntax OK).

## Prossimo passo atomico
Aprire PR. Poi proseguire con altre rifiniture sicure o, se il fondatore dà i
due via libera, sbloccare il lavoro gated (Genesi burden/boretrack con conferma
geometria; core Fasi 3-4 con via libera Firebase).

## Blocchi
Genesi burden-reale/boretrack (P1.1/P1.2): conferma geometria del fronte
(rischio sicurezza fochino → non si spedisce senza ok). Core Fasi 3-4: via
libera Firebase. Dati default sensibili + mitigazione password: non toccare
senza conferma.
