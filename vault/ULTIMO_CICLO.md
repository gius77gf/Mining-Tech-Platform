# Ultimo ciclo — canarino

## Quando
2026-09-15T18:53:22Z (letto da `date -u`, non predetto)

## Commit di partenza
f17245f5 — chore(vault): checkpoint sanità finale del blocco

## Cosa sto per fare
Il ciclo precedente ha chiuso 46 unità: undici ricerche in background
riverificate di persona prima di essere scritte o tradotte in codice
(Genesi ×2 correzioni, Deepwork ID, Flotta ×2, Campo ×2, Conti, Scudo,
Sentinella, Terra), sette unità di codice su cinque app (Flotta:
`etaMezzo` + pagella col possesso; Campo: fermi documentati + causale/
minuti nella consegna di turno; Scudo: promemoria dell'azione
correttiva; Terra: `attesaRecupero`), quattro decisioni nuove scritte
in `docs/DECISIONI_WEEKEND.md` (#25-#27), doc-cascade mantenuta
coerente a ogni unità con cifre misurate da un giro isolato, e un giro
finale di sanità (`sonda-vuoto.mjs`, `nomi-doppi.mjs`, entrambi puliti).

Al momento del canarino c'è un dodicesimo giro di ricerca in corso in
background, il primo di oggi su un tema TRASVERSALE invece che su
un'app singola: il "mestiere della cava" — che cosa contiene davvero
un rapportino di fine turno italiano, confrontato con
`rapportoGiornata` di Campo. Appena torna: riverificarlo di persona
(grep sui comandi citati, mai sulla parola dell'agente) prima di
scriverlo nel documento di ricerca o tradurlo in codice — la stessa
disciplina già applicata alle undici ricerche precedenti oggi.

Se il giro non è ancora tornato: proseguire con seconda iterazione
UX/qualità su Deepwork ID o il core (non toccati da codice oggi),
oppure lanciare una nuova ricerca su un altro tema trasversale ancora
fermo al 04/09 (ASSENZA, PAROLE) o su Conti (l'app con la ricerca più
vecchia fra le sei verticali). Il ciclo non si ferma per scelta.

Working tree al momento del canarino: pulito, nessun file modificato
non committato — l'unità precedente (checkpoint di sanità) è già
committata e pushata (`01e83bad..f17245f5`).
