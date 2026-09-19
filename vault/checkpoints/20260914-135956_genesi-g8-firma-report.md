# Checkpoint — 2026-09-14T13:59:56Z

## Tipo
unit-complete (G8, prima fetta piccola)

## App
Genesi

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Completato

Continuando lo schema "prima il mondo, poi la nostra app" già usato per
G7, ho confrontato il Report volata esistente di Genesi con la ricerca
del 13/09 (`docs/RICERCA_CONTINUA_GENESI.md`, "che cosa contiene davvero
un rapporto di volata") — mai raccolta prima in una voce di roadmap.

**Risultato del confronto, misurato leggendo la funzione, non a
memoria**: il foglio copre già geometria, carica/sequenza, roccia,
previsioni (frammentazione/MIC/PPV con verdetto e provenienza),
airblast, flyrock/sgombero, economia — **più sezioni in un solo
documento di quante ne copra ciascuno dei due software commerciali
citati dalla ricerca** (SHOTPlus, BlastLogic coprono "solo alcune"
sezioni ciascuno, per la ricerca stessa). Il solo gap reale, confrontato
coi due moduli statali citati (Pennsylvania "Blaster's Report", che
elenca esplicitamente "firma del blaster"; AS 2187-2): **nessuna riga
per nome e firma di chi risponde del tiro**.

**Aggiunta una sezione minima**: tre campi da riempire a penna dopo la
stampa (nome e cognome del responsabile del tiro, firma, data/ora dello
sparo), in fondo al report prima del disclaimer. Deliberatamente NON un
campo D2 nuovo — Genesi non tiene un'anagrafica di persone per progetto,
e il "responsabile del tiro" è già un ruolo citato in prosa in almeno
dieci punti della pagina (validatori, avvisi di sicurezza), mai un dato
salvato: introdurne uno solo per la firma sarebbe stata un'incoerenza,
non una funzionalità.

## Verificato

- `sintassi-pagine.mjs`: 34/34. `run-stile.mjs`: 328/328.
- **Browser vero**: report aperto in popup da Playwright (click reale su
  `#btn-report`), screenshot a pagina intera — geometria/carica/roccia/
  previsioni/economia invariate, sezione firma ben allineata allo stile
  esistente (stessa palette, stesso font, tre colonne con etichetta
  sopra e riga di sottolineatura sotto), nessun errore di pagina.
- `genesi-estraibili.mjs`: 147 totali, 61 estraibili — invariato (nessuna
  funzione nuova, solo stringhe HTML nel template esistente).
- `numeri-nei-documenti.mjs`: 43/0.
- Giro completo su worktree isolata: **40 comandi a posto, 0 caduti**,
  3910 asserzioni, addendi verificati — stesso numero di prima (nessun
  banco `node` tocca il template del report).

## Stato roadmap

G7-G9 aggiornata con la nota ✅ di questa fetta. **G8 resta aperto**:
dichiarato esplicitamente che un report più ricco (foto pre/post-sparo,
dossier per l'assicurazione) richiederebbe dati che Genesi oggi non
raccoglie — un cantiere diverso e più grande, non implicito in questa
fetta piccola.

## Blocchi e limiti noti

Nessuno nuovo.

## Prossimo passo atomico

Il giro completo del browser (`tutti.mjs`), lanciato alle 13:44Z su una
copia congelata di `477ac992`, è ancora in corso in background (dura
tipicamente una o due ore) — da raccogliere con `leggi-giro.mjs` quando
finisce, verificando quanti commit il ramo è andato avanti nel
frattempo (già cinque, contando questa unità) per non leggere eventuali
accuse come fresche se in realtà riguardano codice precedente a
`955bbdd4`.

Nel frattempo, altre unità piccole non legate al CAD: G8 potrebbe
continuare con la sezione "operatori presenti al momento del brillamento"
(citata da MSHA come requisito di registro, ma è un dato di ESECUZIONE
non di progetto — probabilmente appartiene a Campo/Sentinella più che a
Genesi, da verificare prima di costruire). Oppure tornare al fallback
generico se non emerge altro.

Nessuno stop volontario: si prosegue subito.
