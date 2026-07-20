# Checkpoint — 2026-07-21 — Test anonimo non crea org (fatto)

## Task completato
Ultimo guardrail Functions in negativo: createOrganization rifiuta i
token anonimi (sign_in_provider === "anonymous") ma non era testato.
Aggiunto a run-fns.mjs: dopo loginTour (login anonimo), la chiamata a
createOrganization ritorna 'unauthenticated' → un visitatore in tour
non può creare organizzazioni. Suite 105 → 106 (Functions 17 → 18),
verde in locale sugli emulatori. Job CI a 106.

## Stato copertura sicurezza (fine giornata)
Guardrail Functions ora testati sia in positivo sia in NEGATIVO:
gestione ruoli (member/admin/owner, ultimo owner), inviti (member non
invita/revoca, isolamento per email), createOrganization (nome, owner,
anonimo). SDK: isolamento org (lettura/scrittura/switchOrg estranei),
entitlement (attivo/scaduto), tour sola-lettura. Rules: 26. Più helper
sicurezza, KPI e integrità demo. Totale 106, tutti verdi.

## Commit
- 1f70dcd  Test: un anonimo (tour) non puo creare un'organizzazione

## Prossimo passo atomico
Push + PR + merge a CI verde. Continuare fino a esaurimento. MAI
fermarsi volontariamente.
