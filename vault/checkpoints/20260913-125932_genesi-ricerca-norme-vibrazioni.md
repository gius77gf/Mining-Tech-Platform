# Checkpoint — 2026-09-13T12:59:32Z

## Tipo
unit-complete (ricerca, nessun codice)

## App
Genesi

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`de07502a`

## Completato

Quinta ricerca di fianco: verifica di seconda mano dei numeri USBM RI
8507 / DIN 4150-3 già citati in `docs/GENESI_FONTI_SCIENTIFICHE.md`, più
la domanda se esiste uno standard italiano diverso (UNI 9916) per le
cave. Trovato: numeri confermati da fonti secondarie indipendenti
concordanti; UNI 9916 non ha soglie proprie, recepisce DIN 4150-3.
Nessun disaccordo fra fonti.

⚠️ **Due correzioni fatte QUI, dopo aver riletto il file scritto
dall'agente invece di fidarmi del solo riepilogo in chat** (lezione
della ricerca precedente, applicata subito):
1. Il timestamp della sezione era `2026-09-13T14:00:00Z` — un orario
   rotondo che non corrispondeva al vero istante (`date -u` reale:
   12:57:35Z). Stessa famiglia di difetto che CLAUDE.md documenta
   estensivamente per i checkpoint del vault (timestamp previsto invece
   che misurato), qui capitata in un documento di ricerca. Corretto al
   vero orario, con una nota che spiega perché.
2. La conclusione dell'agente ("non serve correggere i numeri di
   Genesi") rischiava di leggersi come in contraddizione con la sezione
   9 di `DECISIONI_WEEKEND.md`, che documenta un difetto REALE — non
   nei numeri di riferimento, ma nel modo in cui il codice li
   approssima (i gradini sotto ~4 Hz sono meno prudenti della curva
   USBM ufficiale, correzione in attesa del via libera del fondatore
   perché tocca soglie di sicurezza). Aggiunta una nota che distingue
   esplicitamente le due domande, per chi legge questa sezione in
   futuro senza il contesto di oggi.

Verificato con `numeri-nei-documenti.mjs` (43 passati, 0 falliti).
Nessun `giro-node.mjs`: solo `docs/`.

## Stato roadmap

Nessuna voce dedicata toccata.

## Blocchi e limiti noti

Nessuno nuovo. La sezione 9 di `DECISIONI_WEEKEND.md` resta in attesa
del fondatore, invariata da questa ricerca.

## Prossimo passo atomico

**Lezione consolidata da due ricerche di fila, da portare avanti in
automatico**: ogni volta che un agente di ricerca in background riporta
"fatto" o "scritto", il file va **riletto per davvero** (non solo
`git status` per l'esistenza della modifica, ma il CONTENUTO) prima di
committare — sia per verificare che l'istruzione "niente delta" sia
stata rispettata, sia per controllare dettagli come i timestamp, che un
agente può scrivere plausibili invece che misurati.

Cinque ricerche di fianco completate in questo blocco, coprendo quattro
argomenti diversi della regola 1 (mestiere della cava — rapporto di
volata; concorrenti — BlastLogic/JKSimBlast in dettaglio; parole del
mestiere — vocabolario confermato pulito; norme citate — USBM/DIN
4150-3/UNI 9916 confermati di seconda mano) più il tema di sicurezza
sull'import CAD/DXF. Le strade di codice sicure su Genesi restano in
gran parte esplorate (vedi checkpoint precedenti). Prossimo ciclo:
continuare con ricerca di fianco su un quinto argomento (rotazione), o
riprendere da una risposta del fondatore se arriva. Continuare senza
fermarsi (regola del fondatore).
