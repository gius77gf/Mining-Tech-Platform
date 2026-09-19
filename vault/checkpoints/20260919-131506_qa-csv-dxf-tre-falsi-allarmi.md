# Checkpoint — 2026-09-19T13:15:06Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
5dbca089 — docs(genesi): QA sui lettori CSV/DXF — tre "difetti" riportati, zero veri

## Cosa è stato completato
Quarto agente Haiku in background su Genesi (lettori CSV/DXF), e il primo
dei quattro dispatchati oggi le cui conclusioni si sono rivelate TUTTE e
tre sbagliate dopo la verifica indipendente — l'esempio più netto in
questa sessione del perché "niente entra sulla parola dell'agente" non è
una formalità.

- [x] ⛔ **"Difetto critico" (parseXYZ su CSV italiano senza spazi) È
      FALSO**: esiste già un test — `run-pointcloud.mjs`, scritto la
      stessa mattina da un ciclo di deep-pass QA precedente — con lo
      STESSO input esatto dell'esempio dell'agente (`parseXYZ("12,34,56")`
      → `[12,34,56]`), che afferma il verdetto OPPOSTO a quello che
      l'agente chiamava "atteso". La riga di codice contiene già il
      commento che spiega la scelta deliberata (formato ambiguo, comma
      come separatore quando non ci sono spazi). Applicare la correzione
      proposta avrebbe rotto un test esistente e riaperto un difetto già
      chiuso lo stesso giorno da un altro ciclo.
- [x] **Secondo "difetto" (LINE con coordinata illeggibile scartata) non è
      un difetto**: è la stessa regola già applicata a VERTEX e
      LWPOLYLINE nelle righe accanto (scartare un'entità illeggibile
      invece di disegnarla a metà — il principio del fondatore applicato
      al DXF).
- [x] **Terzo (POLYLINE senza SEQEND → 0 tratti) ha un fondamento più
      solido ma non azionato**: SEQEND non è opzionale nello standard
      DXF, un file che lo omette è quasi sempre troncato a metà
      scrittura, non un dialetto valido come lo era LWPOLYLINE (il
      precedente citato dall'agente a sostegno era un caso diverso: un
      tipo di entità intera mancante, non un terminatore). Leggere una
      geometria incompleta come completa rischierebbe l'errore opposto.
- [x] Verificato rilanciando `run-pointcloud.mjs` prima di scrivere la
      correzione: 36/36, incluso il test citato.

Nessuna modifica al codice: la correzione è scritta accanto al claim
originale nel documento di ricerca, non sovrascritta in silenzio.

## Verifica prima del commit
`run-pointcloud.mjs`: 36/36. `numeri-nei-documenti.mjs`: 43/43. Nessuna
suite di prodotto toccata (solo il documento di ricerca).

## Stato roadmap
Quattro ricerche/QA chiuse oggi su Genesi: editor 2D (→ un bug vero,
G56b), vibrazione/PPV (zero difetti, verificato), simulazione 3D (zero
difetti, verificato), lettori CSV/DXF (zero difetti VERI, tre falsi
allarmi corretti). Il tasso di falsi allarmi è salito bruscamente
sull'ultima ricerca rispetto alle prime tre — motivo in più per non
abbassare la guardia sulla verifica indipendente, non per fidarsi di più
con l'esperienza.

## Prossimi passi
- **Prossimo passo atomico**: controllare l'esito del giro completo del
  browser (PID 18070, oltre 3 ore e 20 minuti) con `leggi-giro.mjs`
  appena arriva in fondo.
- Con quattro fronti di ricerca/QA esauriti su Genesi in questo blocco
  (editor 2D, vibrazione, 3D, CSV/DXF) e un solo bug vero trovato e
  corretto (G56b), considerare se il prossimo passo produttivo sia una
  QUINTA ricerca (un'area ancora non toccata: il modulo economico/costi,
  o il Validatore) o se il rapporto costo/beneficio delle ricerche stia
  calando (tre "non c'è"/"difetto" falsi su tre nell'ultima) e convenga
  spostare lo sforzo su un lavoro di costruzione diretto invece che su
  altra ricerca.
- Il pattern che ha prodotto il falso allarme di oggi (cercare "cosa
  sarebbe successo con un altro input" senza prima cercare se un test
  esistente ha GIÀ deciso quel confine) è generalizzabile: prima di
  scrivere "atteso X", cercare nel repository se qualcuno ha già scritto
  un test con lo stesso input e un verdetto diverso.

## Blocchi
Nessuno.
