# Checkpoint — 2026-07-22 — Test rules tamper inviti (fatto)

## Task completato
Verifica end-to-end: l'INTERA suite gira verde sulla main integrata
dopo tutti i merge del giorno (109→111 ora). Completato il quadro
delle regole su /invites: oltre a create (già aggiunto), un membro NON
puo MODIFICARE (es. alzare il proprio ruolo a owner in un invito) né
CANCELLARE un invito con scrittura Firestore diretta — solo admin/
Function. Chiude ogni via di tampering/escalation lato inviti dal
client.

Suite 109 → 111 (rules 29 → 31), verde in locale sugli emulatori.
Job CI a 111.

## Stato dei rimandati (censimento core)
Tutti gli item residui sono vincolati al fondatore o rischiosi:
- dati default DEFAULT_USERS/CLIENTI → decisione fondatore (weekend);
- meteo proxy + VAPID push → richiedono il progetto Firebase (weekend);
- allineamento versioni three.js → rischio regressione sulla vista 3D,
  motore Genesi da NON toccare senza verifica visiva dedicata;
- "Editor metodi v4.1" → decisione di prodotto del fondatore;
- gestione errori scritture live → scelta di STILE, ok del fondatore
  (AUDIT punto 12).

## Commit
- 6f2b05a  Test rules: no tampering inviti (modifica/cancellazione da membro)

## Prossimo passo atomico
Push + PR + merge a CI verde. Il lavoro autonomo SICURO e verificabile
è a copertura piena; i passi successivi sono elencati sopra e
richiedono il fondatore. Continuare con test/revisioni finché emerge
valore reale. MAI fermarsi volontariamente.
