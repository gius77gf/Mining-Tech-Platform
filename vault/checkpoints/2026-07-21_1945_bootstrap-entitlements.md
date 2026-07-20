# Checkpoint — 2026-07-21 — Bootstrap semina entitlement (fatto)

## Task completato
Rivisto il percorso "vai in live gratis" del weekend
(scripts/bootstrap-owner.mjs) confrontandolo con la Cloud Function
createOrganization e con l'SDK:
- org doc, member doc e forma dei claim `{orgs:{orgId:role}}`
  combaciano ESATTAMENTE con createOrganization + rebuildClaims → OK.
- Scoperta: le app verticali vanno live sulla sola membership
  (`authState()==="member"`), NON su hasEntitlement → il bootstrap
  bastava per farle funzionare. MA la griglia abbonamento del profilo
  (profilo.html) legge organizations/<org>/entitlements/<app> e senza
  quei documenti avrebbe mostrato tutto "Non inclusa", confondendo il
  fondatore.
- Fix: lo script ora semina gli 8 entitlement (deepwork/genesi/scudo/
  campo/flotta/conti/sentinella/terra) con {active:true, tier:"full"}
  → griglia profilo mostra "Attiva". Chiavi = appId di init delle app,
  forma verificata contro profilo.html `ok()` e SDK hasEntitlement.
- Nessuna spesa: è l'accesso pieno del fondatore alla PROPRIA org; gli
  abbonamenti a pagamento dei clienti verranno col flusso fatturazione.
- GUIDA_FIREBASE.md aggiornata.

## Commit
- 5636061  Bootstrap owner: semina gli entitlement delle 8 app

## Prossimo passo atomico
Push (force-with-lease) + nuova PR + merge a CI verde. Poi continuare
fino a esaurimento; ciclo SERALE (~21:40 UTC) = revisione COMPLETA
prima di nuovi task. MAI fermarsi volontariamente.
