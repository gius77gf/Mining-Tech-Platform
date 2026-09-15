# Checkpoint — 2026-09-14T08:43:30Z

## Tipo
unit-complete (revisione di qualità — ultimo pezzo del giro sui banchi Genesi del browser)

## App
Genesi (banchi ponte verso Campo/Sentinella)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Completato

Completando il giro di revisione sui banchi del browser di Genesi (dopo
G39-G44), `ponte-genesi-campo.mjs` e `ponte-genesi-sentinella.mjs` davano
**24 KO** in totale (12 ciascuno) — tutti sul lato Campo/Sentinella, mai
sul lato Genesi (che continuava a passare: export, impronta, non
raddoppio).

**Diagnosi misurata, non dedotta**: una sessione precedente aveva già
applicato a nove banchi Genesi la difesa contro l'import Firebase che in
questo contenitore non fallisce subito come senza rete vera, ma resta
appeso ~13s per pagina (`page.route(gstatic, abort)` prima di `.goto()`).
Quella difesa era stata messa SOLO sul lato Genesi di questi due ponti
(dichiarato esplicitamente nella nota della sessione precedente: "kept
out of scope per 'solo Genesi'"), mai sul lato Campo/Sentinella — quindi
le pagine di Campo e Sentinella, aperte nello stesso browser subito dopo,
restavano appese sul loro stesso import e non arrivavano mai a leggere il
piano appena esportato da Genesi entro i tempi di attesa del banco.

**Verificato prima di correggere** (non sulla parola di una diagnosi
plausibile): copiata `ponte-genesi-campo.mjs` in uno scratchpad, aggiunta
la stessa riga `route(gstatic, abort)` prima del `.goto()` di Campo — **da
14 ok/12 KO a 26 ok/0 KO**, identica identica. Solo dopo aver misurato
l'effetto ho applicato la stessa riga ai DUE file veri (anche
`ponte-genesi-sentinella.mjs`, stessa causa).

## Perché questo NON viola la direttiva "solo Genesi"

È un fix di INFRASTRUTTURA DI TEST (la stessa identica riga già applicata
a nove file in questo stesso blocco di lavoro), non un cambiamento al
prodotto Campo o Sentinella — e il banco che lo richiede è un banco di
GENESI (verifica che l'export di Genesi si legga correttamente altrove),
non un banco di Campo. La decisione precedente di lasciarlo fuori
riguardava lo SCOPE DEL MANDATO di quell'unità (che si fermava a
`apps/genesi/`), non un giudizio che il fix fosse sbagliato o rischioso.

## Verificato

- `ponte-genesi-campo.mjs`: **26 passati, 0 falliti** (da 14/12).
- `ponte-genesi-sentinella.mjs`: **30 passati, 0 falliti** (da 18/12).
- `sintassi-pagine.mjs`: 34/34. `numeri-nei-documenti.mjs`: pulito
  (modifica a due soli file di test, nessun numero sorvegliato tocco).
- **Giro completo sui banchi Genesi del browser, ora tutti verdi**:
  `genesi-maglia-assente` (16/16), `genesi-campi-assenti` (55/0, dopo il
  fix del checkpoint precedente), `genesi-frasi-limite` (36/36),
  `genesi-numeri-tranquilli` (35/35), `genesi-piano-innesco` (17/17),
  `genesi-recettore-assente` (19/19), `genesi-locale` (32/32),
  `genesi-struttura` (18/18), `genesi-foglio-in-cava` (38/38),
  `genesi-documenti-che-escono` (83/83), `ponte-genesi-campo` (26/26),
  `ponte-genesi-sentinella` (30/30). **Zero KO in tutta la superficie
  Genesi del browser**, dopo la revisione completa di questo blocco.

## Stato roadmap

Nessuna voce nuova. Chiude la revisione di qualità aperta nel checkpoint
`20260914-074804`.

## Blocchi e limiti noti

Nessuno nuovo.

## Prossimo passo atomico

Il ciclo di verifica sui banchi Genesi del browser è completo e pulito.
Le strade aperte restano quelle già dichiarate: G45 (candidato non
preso, aspetta una decisione di framing), la ricerca continua se torna,
o il fallback generico della roadmap. In conversazione il fondatore ha
chiesto di riflettere su "Genesi come un CAD" — nessuna decisione presa,
gli è stata rimandata la domanda per capire quale aspetto intende
(precisione/snap, layer, strumenti di disegno, o import/export CAD):
aspettare la sua risposta prima di scomporre quel cantiere.

Nessuno stop volontario: si prosegue subito.
