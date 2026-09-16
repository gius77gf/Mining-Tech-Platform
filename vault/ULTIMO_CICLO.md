# Ultimo ciclo

## Ora UTC (letta da `date -u`, mai predetta)
2026-09-16T06:48:37Z

## Commit di partenza
bd9c241b (docs(terra): tredicesimo giro di ricerca continua, pianificazione escavazione)

## Cosa sto per fare
Fascicolo macchina in Scudo (tema segnalato tre volte — luglio, 09/08,
16/09 — mai colmato prima d'ora): entità `attrezzature/{id}`
(tipo/modello/matricola/costruttore/anno) collegata alla verifica
periodica tramite `attrezzaturaId`, con `attrezzaturaDiScadenza` a
distinguere «non ancora collegata» da «collegamento rotto» e
`descriviLegameAttrezzatura` a scriverne la frase nella nota viva della
finestra di verifica. Prima fetta: la verifica periodica già esistente si
arricchisce (tendina di collegamento + matricola/costruttore/anno),
un'anagrafica autonoma con form dedicato resta il passo successivo.
Test in run-kpi.mjs scritti e verdi (3065). Banco browser
`scudo-verifica-periodica.mjs` esteso (28/28) e controprovato (4/4
iniezioni rimesse, la controprova cade come atteso). `funzioni-mai-usate`
aveva preso `attrezzaturaDiScadenza` collegata a niente — corretto usando
il modulo dalla pagina invece di duplicare la logica a tre stati.
Verificato su worktree isolata: primo giro-node.mjs ha dato l'atteso
"far west" su `numeri-nei-documenti.mjs` (doc-cascade stale: 3.555→3.559,
1033/1033→1037/1037, giro completo 4027→3988); corretti i quattro
documenti con i numeri VERI misurati (non stimati); secondo giro isolato
in corso per il totale finale confermato. Dopo: commit, push, checkpoint
— poi proseguire subito con l'unità successiva (rotazione ricerca su
Sentinella, o anagrafica attrezzature vera e propria come cantiere a sé).
