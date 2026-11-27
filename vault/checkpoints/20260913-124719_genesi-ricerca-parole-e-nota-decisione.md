# Checkpoint — 2026-09-13T12:47:19Z

## Tipo
unit-complete (ricerca + nota di contesto, nessun codice)

## App
Genesi

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`37fabf99`

## Completato

**1. Terza ricerca di fianco (commit `f8bda54b`, già pushato)**: argomento
diverso per rotazione — "le parole del mestiere" applicato al
vocabolario tecnico-minerario di Genesi (spalla, interasse, borraggio,
sottoperforazione, ritardo/microritardo). Trovato (manuali fochino,
tesi del Politecnico di Torino, procedure regionali, norme UNMIG, siti
di aziende esplosivistiche italiane): **tutti i termini principali di
Genesi sono confermati come vocabolario tecnico-minerario italiano
reale**, non traduzioni letterarie né anglicismi non tradotti. Nessun
rischio di "suonare tradotto" trovato. Scritto in coda a
`docs/RICERCA_CONTINUA_GENESI.md` (ora 13 sezioni), nessun delta
proposto dall'agente (rispettata l'istruzione — qui peraltro non
c'era nulla da correggere).

**2. Nota di contesto nella sezione 6 di `DECISIONI_WEEKEND.md`
(commit `37fabf99`)**: letta con attenzione la sezione 6 per intero
prima di scrivere qualunque cosa (lezione della violazione del 12/09,
già nota da questa sessione) — confermato che la regola di
auto-decisione del ciclo (introdotta il 01/08, usata il 07/08 per
"RESTA COM'È") **non vale più su questo punto specifico**: la sezione
dichiara esplicitamente che la prossima decisione serve "davvero dal
fondatore, non dal ciclo questa volta". Aggiunta quindi SOLO una riga
di riferimento alla prima ricerca di questo blocco (import CAD/DXF e
convenzione degli assi), marcata chiaramente come "materiale extra per
QUANDO deciderai, non una proposta di soluzione" — nessuna decisione
presa, nessuna riapertura della regola di auto-decisione, nessun
codice toccato.

Verificato con `numeri-nei-documenti.mjs` (43 passati, 0 falliti,
l'indice delle decisioni aperte in `DECISIONI_WEEKEND.md` ancora
corretto: 15 aperte, 21 sezioni, 22 indicizzate) e `run-stile.mjs`
(328/0). Nessun `giro-node.mjs` completo lanciato per queste due unità:
sono modifiche solo a `docs/`, non a codice prodotto — coerente con
come sono state trattate le due ricerche precedenti in questo blocco.

## Stato roadmap

Nessuna voce dedicata toccata.

## Blocchi e limiti noti

Blocco di sicurezza su geometria/flyrock/burden **invariato e
esplicitamente rispettato**: nessuna decisione presa al posto del
fondatore, nessuna funzione sbloccata, nessuna riga di calcolo toccata.

## Prossimo passo atomico

Il blocco di lavoro su Genesi di questo ciclo (dalla ripresa dopo
compattazione) ha coperto: export DXF (G33), l'intera famiglia del
disegno di precisione (G34→G34quinquies), due estrazioni del filone B3
(`misuraGeom2D`, `_puntiNuvola`), e tre ricerche di fianco (import
CAD/DXF e sicurezza assi, contenuto di un rapporto di volata, vocabolario
tecnico-minerario). Tutto verificato e pushato.

Le strade sicure e non-decisionali su Genesi sono in gran parte
esaurite per ora:
- estrazioni B3 rimaste: safety-adjacent o I/O-bound (da evitare senza
  indicazione esplicita);
- disegno di precisione: completo per questo blocco;
- aspetto "CAD" (terzo pezzo di "tutte e tre"): bloccato sulla tensione
  con "struttura identica al core" (item E7, preesistente);
- segnalazione di sicurezza boretrack (sezione 6): in attesa genuina
  del fondatore, non del ciclo.

Prossimo ciclo: continuare con ricerca di fianco su argomenti ancora
scoperti (regola 1: i concorrenti di Genesi non ancora studiati a
fondo — Maptek BlastLogic e JKSimBlast in dettaglio, non solo O-Pitblast)
mentre si attende una risposta del fondatore; oppure, se arriva una
risposta su uno dei due punti aperti, riprendere da lì. Continuare
senza fermarsi (regola del fondatore).
