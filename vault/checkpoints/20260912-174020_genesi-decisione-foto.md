# Checkpoint — 2026-09-12T17:40:20Z

## Tipo
correzione di rotta (nessun codice toccato), app singola

## App
Genesi (direttiva del fondatore ancora in vigore: solo Genesi)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`188049a3`

## Completato

Il "prossimo passo atomico" del checkpoint 129 puntava a **P2.1 —
frammentazione da immagine del muckpile**, con l'istruzione di rileggere
`docs/GENESI_FRAMMENTAZIONE_DA_FOTO.md` prima di aprire il cantiere. Fatto:
il documento (già completo, con le fonti citate) chiude da solo con
**"serve la tua decisione"** — non propone un difetto da correggere, propone
una scelta su **come Genesi si presenta ai clienti** (misura assistita
onesta vs. il rischio di far sembrare una stima una misura vera, la
"gonfiatura" che le regole di questo repository vietano esplicitamente).

Per questo **non ho proceduto a scrivere codice**: CLAUDE.md riserva le
decisioni commerciali/di prodotto al fondatore ("si preparano, non si
prendono"), e questa lo è più di quanto sembri a prima vista — tocca la
percezione di affidabilità del prodotto, non solo una scelta tecnica.

Ho verificato che la decisione non fosse già stata presa altrove
(`grep` su `docs/DECISIONI_WEEKEND.md`: zero occorrenze) e l'ho
**registrata** come decisione #28 nella "porta d'ingresso" di
`docs/DECISIONI_WEEKEND.md`, con la mia raccomandazione già scritta per
permettere una risposta rapida (procedere con la "misura assistita",
tenere il modello ML opzionale fuori roadmap finché non richiesto).
Aggiornato il conto delle decisioni aperte (14→15) e verificato
`numeri-nei-documenti.mjs` (43/43, la porta d'ingresso torna).

## Stato roadmap

Nessuna voce di lavoro tecnico chiusa: questa unità **sposta** la palla al
fondatore su P2.1, e libera il ciclo per proseguire su un pezzo di lavoro
che NON richiede la sua decisione.

## Blocchi e limiti noti

- P2.1 (frammentazione da foto) resta bloccato in attesa della decisione
  #28. Non riprovare ad aprirlo finché la casella non è spuntata in
  `docs/DECISIONI_WEEKEND.md`.

## Prossimo passo atomico

Le quattro occorrenze residue della tabella `PENALITA_ACQUA`
(`{Nulla:0.70,Bassa:0.40,Media:0.18,Buona:0.05,Eccellente:0}`) duplicate
inline in `apps/genesi/genesi.html`, dichiarate fin dall'unità 126 e mai
più toccate — cerca con `grep -n "Nulla:0.70,Bassa:0.40,Media:0.18"
apps/genesi/genesi.html` per le posizioni esatte (erano ~1786, ~3212,
~5672, ~6007 all'unità 126, da riverificare perché il file si è mosso).
Sostituirle con `rwsEffettiva`/`PENALITA_ACQUA` di `genesi-data.js`, una
alla volta, verificando ogni sostituzione con lo stesso metodo già
provato nell'unità 126 (screenshot prima/dopo, nessun cambiamento
visivo atteso). È lavoro puramente tecnico: non richiede nessuna
decisione del fondatore.
