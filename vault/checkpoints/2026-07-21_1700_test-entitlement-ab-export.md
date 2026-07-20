# Checkpoint — 2026-07-21 — Test entitlement scaduto + export A/B (fatti)

## Task completati (due unità)
1. run-sdk.mjs: nuovo test — entitlement con validUntil nel passato →
   hasEntitlement() false (percorso rilevante per la sicurezza degli
   abbonamenti). Suite SDK 13→14, verde sugli emulatori. CI job → 50.
2. Genesi: "Esporta confronto (CSV)" nel modale A/B — KPI dei due
   progetti affiancati per l'archiviazione. Verificato con download.

## Prossimo passo atomico
PR verso main e merge; verificare CI verde col job a 50. Continuare
fino a esaurimento (idee: altri casi limite test, rifiniture).
Al SERALE: revisione COMPLETA. MAI fermarsi volontariamente.
