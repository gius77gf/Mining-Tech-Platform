# Checkpoint — 2026-09-19T13:54:05Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
265294de — docs(genesi): JKSimBlast — 3 "non c'è" su 6 falsi, uno parziale

## Cosa è stato completato
Sesta ricerca in background su Genesi (JKSimBlast, terzo concorrente),
verificata indipendentemente prima di accettarne le conclusioni.

- [x] ⛔ **Tre "non c'è" su sei erano falsi**, e uno parziale:
  - Rosin-Rammler (`rosinRammler()`, genesi-data.js:1962, 12 occorrenze)
    — era già scritto CORRETTO poche centinaia di righe più su in
    QUESTO STESSO documento (ricerca del 04/09), che il mandato
    dell'agente chiedeva esplicitamente di leggere prima di scrivere.
  - Swebrec (il modello "KCO/Swebrec", 10 occorrenze, con confronto
    frazione fine contro Kuz-Ram).
  - Timing contour plots (le isocrone dei tempi di sparo,
    `drawIsocrone2D`/"G1", 9 occorrenze).
  - 3D energy visualization: parziale — esiste in 2D
    (`computeEnergia2D`/`drawEnergiaLegenda`), non in 3D.
- [x] Corretto il documento di ricerca accanto al claim originale.

## Verifica prima del commit
`numeri-nei-documenti.mjs`: 43/43. Nessuna suite di prodotto toccata.

## Lezione di metodo, più importante del singolo errore
**Le ultime due ricerche di confronto/QA su Genesi (lettori CSV/DXF e
JKSimBlast) hanno prodotto un tasso di falsi allarmi molto più alto delle
tre precedenti (vibrazione, simulazione 3D, economia — tutte pulite).**
Le prime tre erano QA interne (leggere UN codice con attenzione); le
ultime due erano confronti con l'esterno (tenere a mente cosa fa un
prodotto terzo E cercarlo correttamente nel codice italiano). Nominare
esplicitamente nel mandato l'errore della ricerca precedente non è
bastato: l'agente ha ripetuto lo stesso errore su un nome che compariva,
con tanto di numero di riga, poche centinaia di righe più su nello stesso
file che gli era stato chiesto di leggere.

**Decisione per i prossimi cicli**: sospendere la ricerca di nuovi
confronti con la concorrenza in questo blocco (rendimento negativo: più
tempo a correggere che a trovare qualcosa di vero) e spostare lo sforzo
su lavoro di costruzione/verifica diretta, dove il tasso di errore è
stato zero finora in questa sessione.

## Stato roadmap
Tre concorrenti confrontati (Deswik.Blast, O-Pitblast, JKSimBlast), tutti
verificati e corretti dove necessario. Cinque QA interne chiuse (un bug
vero in G56b, resto pulito). Due verifiche visive personali fatte (G56,
Report volata).

## Prossimi passi
- **Prossimo passo atomico**: controllare l'esito del giro completo del
  browser (PID 18070, oltre 4 ore) con `leggi-giro.mjs` appena finisce.
- Passare a verifiche dirette (io, non un agente) sugli altri export di
  Genesi non ancora aperti con gli occhi: CSV Piano fori, DXF Piano fori,
  XML innesco — premere il bottone, aprire il file vero, cercare numeri
  tranquilli.
- Non lanciare altre ricerche di confronto concorrenza per ora; se se ne
  lancia un'altra in futuro, il mandato deve chiedere ESPLICITAMENTE di
  incollare l'output REALE del comando grep nel documento (non solo
  descriverlo), così la verifica successiva può confrontare l'output
  incollato con quello vero invece di fidarsi della sintesi.

## Blocchi
Nessuno.
