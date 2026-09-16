# Ultimo ciclo

## Ora UTC (letta da `date -u`, mai predetta)
2026-09-16T03:48:08Z

## Commit di partenza
5d15f4c7 (chore(vault): checkpoint unità flotta componenti a vita propria)

## Cosa sto per fare
Storico dei solleciti in Conti (decimo giro di ricerca continua):
`statoRecupero` in `conti-data.js` (confronta il livello DAVVERO segnato
come inviato con quello che il ritardo attuale implicherebbe — "mai
comunicato" dichiarato come stato a sé, non un livello zero), bottone
"Segna come inviato" accanto a "Sollecito" nella pagina, con una modale
che mostra lo storico e permette di correggere un errore. Test in
run-kpi.mjs scritti e verdi (3057). Nuovo banco browser
`conti-solleciti-storico.mjs` scritto, verificato (12/12) e controprovato
(la controprova cade come atteso, difetto simulato: bottone collegato al
NUMERO della fattura invece che all'ID). Registrato in `tutti.mjs`.
Sto verificando su una worktree isolata: `giro-node.mjs` in corso
(node-only già verde: KPI 3057, Stile 330, Helper 83, ecc. — manca la
sezione browser e `numeri-nei-documenti.mjs`, atteso far west sui quattro
documenti di doc-cascade da correggere con i numeri VERI misurati, non
stimati). In parallelo gira in background un agente di ricerca (haiku)
sulla denuncia INAIL in Scudo (decimo/undicesimo tema). Dopo la verifica:
correggere doc-cascade, ricommittare la worktree e rilanciare il giro per
il totale vero, poi commit, push, checkpoint — quindi proseguire subito
con l'unità successiva (rotazione ricerca o un altro tema aperto).
