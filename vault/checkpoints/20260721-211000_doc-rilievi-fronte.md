# Checkpoint — 2026-07-21T21:10:00Z

## Tipo
unit-complete (documentazione — allineamento colonne import)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — ONBOARDING_DATI: colonna fronte nei rilievi)

## Completato
Cross-check dell'ordine colonne di OGNI import: parser (`const [...] =
parseCsvLine`) vs ONBOARDING_DATI.md (sezione + tabella riepilogo). Tutto
combacia TRANNE un caso:
- Terra — rilievi drone: la sezione documentava `data;volumeM3;metodo;gsd` e
  OMETTEVA la 5ª colonna opzionale `fronte`, che il parser supporta (collega il
  rilievo a un fronte per nome) e che la tabella riepilogo già elencava. Un
  fondatore che seguiva SOLO la sezione non sapeva di poter assegnare il fronte
  via CSV.

Correzione in ONBOARDING_DATI.md:
- Colonne → `data;volumeM3;metodo;gsd;fronte` (fronte facoltativo); esempio
  aggiornato con una riga che valorizza il fronte e una che lo lascia vuoto.
- Nota: `fronte` collega per nome, caricare prima i fronti; nome non
  riconosciuto → rilievo non assegnato (coerente con il comportamento reale).

Verificato a mano: tutti gli altri 12 import hanno ordine colonne coerente tra
parser, sezione e tabella. L'anagrafica Scudo usa parse inline `[nome,ruolo,tel]`
(= doc) e controlla l'header sul primo campo già parsato (comma-safe).

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART. Proseguire SENZA FERMARSI: nuova unità
UX/test/revisione (l'import è ora robusto e documentato in modo coerente).

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie esatte: gated.
