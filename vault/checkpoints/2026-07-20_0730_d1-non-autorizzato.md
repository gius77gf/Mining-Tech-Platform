# Checkpoint — 2026-07-20 (dopo C6) — D1 pagina "non autorizzato" (fatto)

## Prima di D1, nello stesso blocco
- PR #33 cumulativa (C4 Conti + C5 Sentinella + C6 Terra) creata e
  FUSA su main (merge 8ddfb0d) → Netlify pubblica in automatico.
  ★ FASE C COMPLETA (C1-C6) ★
- CI: TUTTI i run (dal 29714796909 in poi, incluso quello della PR
  #33) risultano ancora "queued" — mai partiti. Il workflow usa
  ubuntu-latest, quindi non è un errore di configurazione: è la coda
  dei runner GitHub del piano gratuito. DA RICONTROLLARE al prossimo
  ciclo; se dopo ore restano in coda, indagare (Actions abilitate?
  limiti account?).

## Task completato — D1
- `apps/deepwork-id/non-autorizzato.html`: pagina dedicata allo stato
  "account registrato ma senza organizzazione". Spiega in linguaggio
  semplice l'isolamento tra aziende e il flusso di invito (14 giorni);
  azioni: ricontrolla inviti (redeemInvites → profilo), crea la
  propria organizzazione (createOrganization → profilo), tour, uscita.
  In mockup (backend placeholder) la pagina resta visibile con avviso.
- Redirect coerenti: login → non-autorizzato quando authState() è
  "unauthorized" (sia al caricamento sia dopo l'accesso); profilo →
  non-autorizzato per chi non è membro.
- CI: glob del check script inline allargato a tutti gli
  apps/*/*.html + apps/index.html (12 file, verificati tutti OK in
  locale).
- Verifica Playwright: pagina renderizzata (screenshot
  d1-non-autorizzato.png in scratchpad), azioni protette in mockup,
  nessun errore console.

## Commit
- dc82129 — Terra C6 (blocco precedente, ora su main via PR #33)
- 0f796af — Deepwork ID D1: dedicated 'account in attesa di invito' page

## Prossimo passo atomico
D2 — Logout coerente su tutte le pagine + griglia app del profilo da
entitlement reali (taglia S): pulsante/voce "Esci" dove manca (pagine
app con shell), griglia apps-grid di profilo.html generata da
hasEntitlement() per app invece dei tile statici (fallback mockup
attuale quando il backend non c'è). Poi D3 (verifica email + recupero
password). PR verso main a fine blocco D o a gruppi sensati.
