# Checkpoint — 2026-08-09T11:45:00Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`6b6e271`

## Task completato

**Le tre righe «⏱️ SCADUTA» di Campo rimisurate una per una** — e una portava
una **prova invecchiata** sotto un verdetto giusto. È la terza forma
d'invecchiamento di `CLAUDE.md`, presa sul fatto.

| riga | verdetto | prova |
|---|---|---|
| Fatigue monitoring | ✅ regge | ✅ tutti e sette i nomi esistono (`RIPOSO_MINIMO_ORE`, `riposoPrimaDelTurno`, `riposoDiTurno`, `STATI_RIPOSO`, `orariPresenza`, `orariDiTurno`, `minutiOrario`) |
| Contractor induction | ✅ regge | ✅ `appaltatori`, `TIPI_DOC_APPALTATORE`, `docDiAppa…` in Scudo |
| Anomalie → azioni correttive | ✅ regge | ⛔ **falsa in due punti** |

## Le due cose imparate

1. ⛔ **UNA PROVA CHE INVECCHIA NON RENDE LA RIGA SBAGLIATA: LA RENDE NON
   CREDIBILE.** La riga del ponte diceva «`ORIGINE_FERMO`, `azioniDelFermo`,
   `statoPonte` in `shared/dw-ponti.js`, 12 punti nella pagina». Misurato:
   · `azioniDiOrigine` (1091) e `statoPonte` (1102) stanno davvero in
     `shared/` — ma sono la regola **generale**, e la riga citava un nome che lì
     non c'è;
   · `ORIGINE_FERMO` (2513) e `azioniDelFermo` (2584) vivono nel **modulo di
     Campo**, che è il caso **particolare**. Cioè il disegno giusto — la regola
     condivisa e il caso specifico — raccontato male;
   · i «12 punti» non sono più riproducibili: il ponte è **cresciuto** e ha
     altri nomi.
   Chi riapre quella riga fra un mese verifica la prova, la trova falsa, e
   butta via **tutta la riga** — insieme al verdetto, che era giusto.
2. ⛔ **UN NUMERO IN UNA PROVA VA SOSTITUITO CON UN ELENCO.** «12 punti nella
   pagina» invecchia a ogni commit e non si può verificare senza rifare il
   conto con gli stessi nomi di allora — che nessuno conosce più. Adesso la
   prova dice **quali**: `azioniDelFermo`, `statoRisposta`, `bozzaAzioneFermo`,
   `fermiEAzioni`, `coperturaFermi`, `anomalieAperte` (11 usi). Un elenco si
   verifica in tre secondi e, quando cresce, cresce **visibilmente**.
   ⚠️ È lo stesso principio del «derivare invece di scrivere» applicato alla
   prosa di un documento.

## Verifiche
- ogni nome citato dalle tre righe cercato **col comando**, non a memoria
- `documenti-invecchiati`: arretrato **13 → 10 commit**, 0 che mordono
- `giro-node` **34 comandi a posto, 0 caduti** sulla copia del committato

## Il giro del browser
Ancora vivo dalle 07:55Z su una copia di `494863f`.

## Prossimo passo atomico
⛔ **Il giro, appena finisce, ha la precedenza**: `leggi-giro.mjs` nell'ordine
**età → righe «non ho guardato» → KO veri**; nessun KO diventa cantiere prima
di essere riprodotto **con la sua passata** e **con l'iniezione viva**.
Se non è ancora finito: le **10 righe «SCADUTA» rimaste** (conti 3, scudo 2,
sentinella 3, terra 2), con lo stesso metodo — si cerca col comando ogni nome
che la prova cita, e dove la prova porta un **numero** lo si sostituisce con un
**elenco**. Campo è fatta.

## Blocchi
Nessuno di tecnico. In attesa del fondatore: le **7 tendine tagliate**
(Scudo 5 + Sentinella 2) e **`#vf-ente`** (termine dell'art. 71 c.11).
