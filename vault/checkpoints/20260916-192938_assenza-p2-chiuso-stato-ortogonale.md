# Checkpoint — 2026-09-16T19:29:38Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
47ffa6ae

## Cosa è stato completato
Chiusa la domanda lasciata esplicitamente aperta dal checkpoint dell'ottavo
scrittore: per i tre CSV di D1 con un `stato` proprio (`csvGare` di Conti,
`csvSquadre` di Campo, `csvAzioni` di Scudo), quel vocabolario è ortogonale
alla distinzione misurato/mai-misurato di P2, non la copre già.

Verificato leggendo il codice, non deducendo dal nome:
- `statoAzione` (scudo-data.js:1182) — il workflow (`a.stato`:
  aperta/in-corso/chiusa) decide solo se l'azione è chiusa; se no delega
  a `statoScadenza` (shared/dw-ponti.js) che per una data mancante
  risponde già "senza data" — ortogonale, e con un marcatore proprio.
- `baseGara` (conti-data.js:1973) — non legge mai `gara.stato`
  (aperta/vinta/persa): una gara persa può avere `base` dichiarata o no.
- `squadreAttive`/il filtro su `q.stato === "operativa"` (campo-data.js:2672)
  — mai riferito a `persone`, che ha già una convenzione propria (vuoto =
  non lo so, zero = svuotata apposta) indipendente dallo stato operativo.

Trovato che il gap ha peso diverso per tipo di campo: `scadenza` (Azioni)
è una DATA, dove l'assenza è già inequivocabile via `statoScadenza`
("senza data") — nessuna vera ambiguità zero-vs-assente. `persone`
(Squadre) e `base` (Gare) sono NUMERI, dove l'ambiguità che ha motivato
tutta la ricerca ASSENZA esiste davvero e oggi non ha nessun marcatore.

**Deliberatamente non implementato**: applicare P2 a questi tre
richiederebbe un nome diverso da `stato` (es. `statoCella`) per non
collidere, il che romperebbe l'uniformità del vocabolario su undici file
per soli tre. È una decisione di naming/prodotto, non una scoperta di
ricerca da tradurre in codice sulla propria parola — CLAUDE.md lo dice
esplicitamente per casi come questo ("decisione architetturale non presa
qui, di proposito, per non scriverla di sfuggita").

Unità documentale, nessun codice toccato: `docs/prove-grep-scadute.mjs` e
`docs/numeri-nei-documenti.mjs` confermati puliti (nessun numero di
cascade toccato, nessun blocco `grep -c` nuovo). Non serviva il giro
isolato su worktree (nessun file di codice o test modificato).

## Stato roadmap
**P2 della ricerca ASSENZA è ora DEFINITIVAMENTE chiuso a otto scrittori
su undici**, con la ragione del limite scritta e misurata per ciascuno
dei tre esclusi. Non c'è più lavoro aperto su P2 che non richieda prima
una decisione del fondatore sul naming.

## Prossimo passo atomico
Nessuna strada di ricerca ASSENZA resta aperta senza una decisione
esterna. Il prossimo lavoro naturale è la **passata di profondità
(binario 2) su Terra**: rileggere `apps/terra/terra-data.js` (4238 righe)
e `apps/terra/index.html` (4896 righe) — non ancora coperta con questo
metodo in questa sessione (a differenza di Scudo, coperta nel ciclo
precedente) — cercando una funzione consegnata ma superficiale da portare
a eccellenza col metodo del confronto affiancato (CLAUDE.md, "l'eccellenza
è lo standard": ricerca prima, poi il delta sul nostro file, poi almeno
tre iterazioni). Se in tempi ragionevoli non emerge un candidato pulito,
passare alla lista "SE LA ROADMAP SEMBRA FINITA" di CLAUDE.md (seconde
iterazioni sulle app verticali, revisione qualità/sicurezza, nuova
deep-research a rotazione partendo da un'app diversa da Terra/Scudo/Conti/
Sentinella/Campo, già ampiamente toccate oggi).

## Blocchi
Nessuno.
