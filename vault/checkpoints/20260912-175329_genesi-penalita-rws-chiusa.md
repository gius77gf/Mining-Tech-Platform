# Checkpoint — 2026-09-12T17:53:29Z

## Tipo
refactor (nessun cambiamento di comportamento), app singola

## App
Genesi (direttiva del fondatore ancora in vigore: solo Genesi)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`0df8d731`

## Completato

Chiuso il "prossimo passo atomico" del checkpoint 130 (il pezzo di lavoro
puramente tecnico, senza bisogno della decisione #28): le quattro copie
residue della tabella `{Nulla:0.70,Bassa:0.40,Media:0.18,Buona:0.05,
Eccellente:0}` (penalità RWS per fori bagnati), dichiarate ma non toccate
fin dall'unità 126, sono state sostituite con l'unica costante esportata
`PENALITA_ACQUA` (già presente in `genesi-data.js` dall'unità 126).

Verificato che `PENALITA_ACQUA` sia value-identica alla tabella rimossa
(confronto diretto via `JSON.stringify`, non solo a occhio) e che il
comportamento della pagina non cambi (browser: lo stesso identico
risultato di prima per "carica per un obiettivo di pezzatura", 155,3
kg/foro per x50=15cm — stesso numero delle unità 126/127). Aggiunto
`PENALITA_ACQUA` alla lista degli import da `genesi-data.js`.

Nessun test nuovo o modificato: nessuna funzione nuova, solo un import in
più e quattro letterali in meno da tenere sincronizzati a mano. Il test
`⏱️ Genesi · le copie ancora aperte sono CONTATE, non dimenticate` (che
traccia TRE duplicazioni diverse — `rws_pct||100`, `densita_gcc||0.82`,
`vod_ms||3800` — non questa) resta invariato, correttamente: non aveva mai
tracciato la penalità di bagnatura.

## Stato roadmap

Chiuso l'ultimo pezzo tecnico rimasto dall'unità 126. Nessuna voce nuova
in roadmap: questa unità chiude un lavoro già dichiarato, non ne apre uno.

## Verifica prima del commit

`git worktree` da HEAD + diff staged + `giro-node.mjs`, cattura diretta
del vero codice di uscita: **`ESITO_VERO=0`, 40/40 comandi a posto al
primo giro** — nessun numero di documento toccato da questo cambiamento
(nessuna prova nuova, nessuna funzione nuova).

## Blocchi e limiti noti

Nessuno nuovo.

## Prossimo passo atomico

Con la decisione #28 (frammentazione da foto) in attesa del fondatore e il
lavoro tecnico dichiarato ormai chiuso, il prossimo passo va cercato
scorrendo di nuovo `docs/GENESI_ROADMAP_COMPETITOR.md` (ormai corretto,
unità 128) e il cantiere B3 (`genesi-estraibili.mjs --elenco`) per
funzioni ancora estraibili da `genesi.html` a `genesi-data.js` — oppure,
seguendo la regola della "ricerca che gira di fianco", leggere
`docs/RICERCA_CONTINUA_GENESI.md` per proposte già raccolte e non ancora
tradotte in unità (con la disciplina delle unità 128/129: verificare nel
codice PRIMA di credere che manchino davvero).
