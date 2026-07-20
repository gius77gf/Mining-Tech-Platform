# Checkpoint — 2026-07-21 — Test acceptInvites valido/scaduto (fatto)

## Task completato
run-fns.mjs: due nuovi test sul flusso inviti — invito VALIDO
riscattato (membership creata via redeemInvites→acceptInvites), invito
SCADUTO che NON dà membership ed è marcato 'expired'. Copertura di
correttezza e sicurezza del flusso di onboarding. Functions 10→12;
suite totale 52; verde sugli emulatori.

## Prossimo passo atomico
PR verso main e merge; CI verde col job a 52. Continuare fino a
esaurimento. Al SERALE: revisione COMPLETA. MAI fermarsi
volontariamente.
