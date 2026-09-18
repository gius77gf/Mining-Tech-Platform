# Checkpoint — 2026-09-18T12:21:02Z

## Tipo
unit-complete (correttivo)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
194ce202 — fix: ripristinato il test di calendarioScadenze cancellato per errore dal commit Conti

## Cosa è stato completato
Il commit dell'unità Conti (0645b781) ha staged `run-kpi.mjs` da una git
worktree (`/tmp/wt-conti-apertodi`) creata PRIMA che il fix di Scudo
(35c90a25) venisse pushato sul branch. Quella worktree conservava ancora la
vecchia versione del test `calendarioScadenze`, e staggiarla ha sovrascritto
in silenzio — senza toccare `apps/scudo/scudo-data.js`, rimasto corretto —
l'assertion e il caso `rDue` (con controprova) aggiunti dal commit Scudo.
Il test tornava a pretendere il comportamento SBAGLIATO
("SUMMARY:Visita medica · Mario Rossi" invece di "Visita medica periodica"),
e infatti falliva contro il codice reale (già corretto).

Scoperto ricostruendo la worktree di Sentinella dall'HEAD corrente (per lo
stesso motivo — evitare questo esatto difetto sulla PROSSIMA unità — copiando
solo il file di modulo, e riapplicando a mano le due modifiche al file di
test invece di sovrascriverlo per intero) e lanciando `run-kpi.mjs`: un
test lontano dalla mia area di lavoro è risultato rosso.

## Lezione di metodo (nuova, da tenere per il resto del ciclo)
**Una git worktree creata per un'unità non va MAI riusata per un'unità
successiva se nel frattempo un'altra unità è stata pushata sul branch** —
va rifatta dall'HEAD corrente, oppure, se contiene già un fix di modulo
valido (che nessun'altra unità ha toccato), si copia SOLO quel file sulla
worktree fresca e si riapplicano a mano le modifiche al file di test
condiviso (`run-kpi.mjs`), non si sovrascrive l'intero file. È la stessa
famiglia della regola già scritta in CLAUDE.md sulla worktree che va
ricreata, non resettata — qui il rischio non era un commit vecchio, era un
**file condiviso da tutte le unità** (il file di test unico) diventato
stale mentre altre unità avanzavano.

## Verifica
- `node apps/deepwork-id/tests/run-kpi.mjs` sul working tree principale:
  **3150 passati, 0 falliti** (KPI invariato: le righe ripristinate erano
  assertion dentro un test esistente, non un nuovo `test()`).
- Giro completo lanciato su worktree isolata (`/tmp/wt-fix-regressione`)
  per la stessa disciplina di ogni altra unità — commit fatto dopo aver
  già confermato `run-kpi.mjs` da solo, in attesa del giro completo come
  seconda conferma (nessun dato inventato: se il giro completo segnalasse
  qualcosa, verrà corretto in un'unità successiva).

## Stato roadmap
Vedi vault/ROADMAP_SETTIMANA.md.

## Coda di lavoro
Immutata rispetto al checkpoint precedente (`20260918-121704_conti-apertodi-propagato.md`):
1. Accessibilità toast (`/tmp/wt-toast-a11y`) — worktree STALE (creata prima
   di Scudo/Conti): da ricreare dall'HEAD corrente copiando solo i file di
   prodotto (index.html, admin.html, genesi.html) e riapplicando a mano le
   modifiche a `run-kpi.mjs`, non riusare la copia esistente del file di
   test.
2. Campo — CLASSE_HSE (`/tmp/wt-campo-hse`) — stessa cautela: worktree
   STALE, va ricreata allo stesso modo.
3. Sentinella — misureDelGiornoPerReclamo/rispostaReclamo
   (`/tmp/wt-sentinella-reclamo`) — questa È GIÀ stata ricreata
   correttamente dall'HEAD corrente (fatto insieme a questa scoperta): fix
   verificato con `run-kpi.mjs` da solo (3149/0, nessun nuovo `test()`).
   Manca ancora il giro completo su questa worktree.
4. La trappola del focus nella modale (`shared/dw-app-ui.js`) e il listener
   di Conti (`#modal-foot`) — non ancora iniziate.

## Prossimo passo atomico
Lanciare il giro completo su `/tmp/wt-sentinella-reclamo` (ricreata
correttamente). In parallelo, ricreare `/tmp/wt-campo-hse` e
`/tmp/wt-toast-a11y` dall'HEAD corrente (194ce202), copiando solo i file di
prodotto e riapplicando a mano le modifiche a `run-kpi.mjs`, poi verificarle
una per una con giro isolato (non in parallelo, per evitare il falso rosso
di `server-orfani.mjs` già misurato). Continuare "mai fermarsi".

## Blocchi
Nessuno.
