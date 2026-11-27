# Checkpoint — 2026-09-14T13:20:08Z

## Tipo
unit-complete (voce roadmap: candidato non preso) + autocorrezione di un errore proprio, presa prima del commit

## App
Genesi

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Completato

Prima di chiudere la revisione del backlog di ricerca, ho verificato che
il checkpoint `20260914-072536` (G44) lasciava esplicitamente da
raccogliere la ricerca del 14/09 "Come si misura davvero la
frammentazione: fotografia e image analysis"
(`docs/RICERCA_CONTINUA_GENESI.md`) — non ancora tradotta in una voce di
roadmap.

Letta e verificata (non sulla parola della ricerca): Genesi oggi accetta
solo un x50 **digitato a mano** in `#ric-x50`
(`riconciliazione.real.x50`), nessuna integrazione con software di
image analysis. Il mondo usa tre famiglie di suite (Split-Desktop,
WipFrag, PowerSieve/FragScan/GoldSize) con lo stesso principio (foto +
scala di calibrazione + segmentazione) e lo stesso formato di uscita
condiviso, P10/P50/P80/P100.

**Aggiunta la voce G46 (candidato, non preso)** in
`vault/ROADMAP_SETTIMANA.md`, non costruita: la ricerca lascia aperte
tre domande di prodotto (formato d'importazione, dove vive il dato,
quale accuratezza/software) e una delle strade possibili — upload foto
+ servizio cloud di segmentazione — tocca la regola vincolante SOLDI
(nessuna spesa prima della commercializzazione, decisione esplicita del
fondatore). Non è una decisione che spetta a questo ciclo.

## Un errore trovato PRIMA del commit, non dopo

Scrivendo la voce G46 con `Edit`, l'`old_string` includeva per errore
anche la prima riga della voce **Q1** successiva (serviva solo da
ancora di posizione) — e il `new_string` non la riportava. Risultato:
la riga `- [ ] **Q1.** Proposte di ...` è sparita, e il resto del
paragrafo di Q1 è rimasto attaccato in coda al paragrafo di G46, senza
più il proprio marcatore di lista.

**Preso da `numeri-nei-documenti.mjs`**, non da una rilettura a occhio:
il controllo sull'indice delle voci aperte ha dato «18 voci aperte, 19
righe d'indice» invece di 19/19 (avevo aggiunto un item nuovo ma il
conteggio delle `- [ ] **` era rimasto a 18 — segno che una voce
esistente aveva perso il suo marcatore). Confrontato con `git diff`,
trovata la riga Q1 mancante, e reinserita nel punto esatto in cui il
suo paragrafo riprendeva.

## Perché conta

È la stessa famiglia già raccolta in CLAUDE.md sulla verifica «misura la
copia di quello che si sta per committare»: qui l'errore non veniva da
un cantiere parallelo, ma da me — e la difesa che l'ha preso è la stessa,
un controllo automatico letto PRIMA del commit, non la fiducia che una
modifica piccola non possa aver rotto niente.

## Verificato

- `numeri-nei-documenti.mjs`: 43 passati, 0 falliti — 19 voci aperte, 19
  righe d'indice (corretto, dopo la riparazione).
- Giro completo su worktree isolata (ricreata da zero, non riusata):
  **40 comandi a posto, 0 caduti**, 3909 asserzioni, addendi verificati
  uno per uno.
- `git diff` riletto dopo la riparazione: la riga Q1 e il suo contenuto
  originale sono intatti, nessun'altra voce toccata.

## Stato roadmap

19 voci aperte (era 18): aggiunta G46. Nessuna voce chiusa in questo
blocco.

## Blocchi e limiti noti

Nessuno nuovo. Restano invariati: gate geometria/flyrock, soglie
USBM/DIN, domanda CAD ancora aperta col fondatore, regola SOLDI (motivo
per cui G46 non è stata costruita).

## Prossimo passo atomico

Con questo il backlog di ricerca continua su Genesi (dieci sezioni
rilette in questo blocco più il precedente) e i due candidati emersi
(G45 sintesi validatori, G46 frammentazione misurata) sono tutti
tracciati e non ancora costruiti per ragioni dichiarate — non per
dimenticanza. Il cantiere B3 (53 funzioni "una o due variabili") risulta,
alla lettura diretta dei suoi candidati residui, sostanzialmente
esaurito: quasi tutte sono già legami di una riga verso funzioni pure
già in `genesi-data.js`, o toccano DOM/canvas/THREE per costruzione.

Restano da controllare, se serve altro lavoro prima della risposta del
fondatore sul CAD: la sezione IREDES (13/09, ha già un confronto
struttura-Genesi scritto, andrebbe riletto per un delta residuo) e
un'eventuale seconda iterazione di verifica visiva/screenshot sulle
funzionalità nuove di questo blocco (G38/G44), già fatta ma solo una
volta — la regola dell'eccellenza chiede almeno tre iterazioni.

Nessuno stop volontario: si prosegue subito.
