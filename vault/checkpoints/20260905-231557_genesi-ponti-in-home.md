# Checkpoint — 2026-09-05T23:15:57Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
db61c35a — Genesi: i ponti in Home, calcolati

## Completato
`riepilogoPontiGenesi` in `genesi-data.js`, pannello «Ponti con le altre
app» in Home disegnato dal modulo (tre righe, stato vuoto che dice come si
produce, null = non leggibile). run-kpi 2749, copertura genesi-data 83,
giro `node` sulla copia: 40 comandi a posto. Scatto guardato.

## Stato roadmap
Voce `[x]` «GENESI — i ponti in Home, calcolati».

## Prossimo passo atomico
La passata in profondità su Genesi, una schermata alla volta con uno scatto
GUARDATO: (1) la scheda volata — la modale «per Sentinella» ora dice due
cose in più (organizzazione / stesso computer): rileggere il testo intero
della modale a 320 px e verificare che non ci siano numeri tranquilli
(«0 m» «0 kg» sono già difesi; guardare «Base della previsione» e le righe
con «—»); (2) la riconciliazione con il bottone nuovo «Leggi il consuntivo
da Campo»: in locale è nascosto — verificare che il testo intorno non prometta
una cosa che da soli non c'è; (3) la Home con una volata salvata SENZA data
(`gdata('')`: che cosa scrive?) — provare con `GDB.aggiungi('volate',
{nome:'x', design:{…}})` in scratchpad e leggere la riga.
Ogni difetto vero trovato è un'unità piccola con prova e scatto.

## Blocchi
Nessuno.
