# Checkpoint — 2026-07-20 — Registro progettato-vs-reale COMPLETO (2/2)

## Task completato
Ponte Genesi↔Campo chiuso (raccomandazione ricerca n.2, ispirata a
Maptek/Strayos): in Campo → Rapportini, sezione "Piano di carico (da
Genesi)": import del CSV esportato da Genesi, tocco sul foro →
carica REALE via prompt; scostamento per foro (≤10% verde, ≤25%
ambra, oltre rosso) e riepilogo (fori registrati, totale progettato
vs reale stimato, % scostamento). Fix nel demo data layer: aggiungi
crea le collezioni sconosciute al volo. Verifica Playwright: piano
test 3 fori, 75kg→ambra 25% (+8% totale), 55kg→verde. Zero errori.

## Prossimo passo atomico
PR verso main con le due parti del ponte (commit af81047 Genesi +
questo) e merge. Poi proseguire (MAI fermarsi volontariamente):
prossime unità in ordine = 1) estendere suite emulatore con test per
le nuove callable D4 (updateMemberRole/removeMember/revokeInvite non
hanno test dedicati — servono test con functions emulator o unit
logici); 2) approfondimenti secondo-passaggio schede ricerca; 3)
terze iterazioni app. Ciclo serale 21:40: PRIMA revisione giornata.
