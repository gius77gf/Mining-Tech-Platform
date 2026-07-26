# Checkpoint — 2026-07-22T03:20:00Z

## Tipo
unit-complete (Genesi punto 2/6 — import piano di innesco XML, round-trip)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Genesi import XML IREDES-like)

## Completato
Punto previsto #2 (con via libera "completa tutti i punti"): l'export XML in
stile IREDES (#311) ora ha il suo IMPORT → il piano diventa un formato
PORTABILE, non solo un'uscita a senso unico. Un utente che riceve solo l'XML
(dal collega o dal software dei detonatori elettronici) può ricaricarlo in
Genesi e visualizzarlo/simularlo.
- `apps/genesi/genesi.html`:
  - UI: bottone "📥 Importa piano di innesco (XML)" + input file nascosto
    (`#btn-innesco-xml-in`, `#fileXmlIn`) nel modulo Progetto 2D.
  - Handler `onchange`: `DOMParser` → legge `BlastPlan` (schema draft di
    Genesi). Rilegge in D2 geometria (B, S, diametro), esplosivo, sequenza,
    ritardo foro/fila; scalari uniformi (prof, carica, borraggio) dal 1° foro;
    file/perRow dalle posizioni; direzione dallo `Delay` minore (lato sx/dx).
    Poi `syncDesignInputs()` + rigenera maglia/scheda.
  - Usa `getElementsByTagName` (robusto al namespace di default dell'XML — i
    selettori CSS di tipo NON matchano elementi in un namespace di default).
    Onesto nel commento: NON è import IREDES certificato, legge il nostro
    schema draft.

Verifica: syntax inline OK (check python CI); parsing testato in un DOM di
browser REALE (Playwright): l'XML con namespace di default viene letto
correttamente, tutti i campi tornano (B 4.5 · S 3.8 · diam 89 · anfo-standard
· diagonale · hd 25 · rd 42 · 3 fori · prof 13 · carica 50 · borraggio 2.5),
direzione dedotta 'sx' (primo a detonare a sinistra). Round-trip export→import
coerente.

## Prossimo passo atomico
Restano i punti PESANTI (rischio numeri fuorvianti se fatti male, da valutare
CON il fondatore): #4 auto-pezzatura-da-foto (watershed/ML), #5 viewer
point-cloud (Potree/deck.gl), #6 ML frammentazione (serve modello
pre-addestrato → documentare). Alternativa onesta: seconda iterazione su
un'altra app ("non mettiamo da parte gli altri progetti").

## Blocchi
#321 estetica: attende il giudizio del fondatore (promessa). Motore fisico
diretto: non toccare. Tutto sul branch unico #321.
