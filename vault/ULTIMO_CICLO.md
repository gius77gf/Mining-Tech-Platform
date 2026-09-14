# Ultimo ciclo di lavoro automatico

- **Quando**: 2026-09-14, 21:45 UTC
- **Commit di partenza**: `5a438a2e`
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`

## Che cosa sta per succedere

Nuova accensione della routine "Weekly Dev Session" (fuoco delle
21:45:15 UTC), sessione ancora nella stessa conversazione col
fondatore aperta dal mattino. Repository raggiungibile, `HEAD`
allineato al remoto (`git fetch` senza divergenza).

✅ **LA DOMANDA CAD HA AVUTO RISPOSTA — il canarino precedente diceva
"non ha ancora risposto": ora sì, e con una parola sola: "Tutto".**
Chiedendo quale dei quattro assi intendesse (precisione/snap, layer,
strumenti di disegno, import/export CAD — la domanda del checkpoint
`20260914-100055`), il fondatore ha risposto in conversazione che li
vuole tutti e quattro. **G47 "Genesi simile a un CAD" è stato
scomposto in quattro fette e TUTTE E QUATTRO SONO STATE COSTRUITE,
VERIFICATE E COMMESSE in questo blocco**:
- G47a — coordinate esatte (x/spalla) + vincolo di allineamento (`bc8544f6`)
- G47c-1 — annulla/ripristina per l'editor 2D (`69cc8f85`)
- G47c-2 — tratti liberi, entità 2D senza semantica di prodotto (`43ed5e9a`)
- G47b — livelli veri (mostra/nascondi/blocca per entità) (`cba3a0a0`)
- G47d — import DXF in sola lettura, come tratti (`a8be6d8d`)

Ogni fetta verificata con screenshot Playwright + banco browser
committato (con controprova che rimette un difetto reale) + giro
completo su worktree isolata prima di dichiararla fatta — mai una
sola.

⛔ **SEGNALAZIONE DI SICUREZZA APERTA, INVARIATA — DA LEGGERE PRIMA DI
TOCCARE GEOMETRIA/FLYROCK/BURDEN.** Il gate su
`deviazioneForiDaCsv`/`burdenVeroDaRilievo` resta bloccato sul fondatore
(`docs/DECISIONI_WEEKEND.md`, sezione 6). Le soglie USBM/DIN restano
un'altra decisione aperta (sezione 9), invariata. **G47d (import DXF)
non tocca questo gate**: la scelta di sicurezza lì è diversa — un file
importato entra SOLO come tratto libero, mai come dato che alimenta un
calcolo di burden/sicurezza, quindi il rischio di convenzione degli
assi (segnalato dalla ricerca del 13/09) è tolto alla radice invece
che validato caso per caso.

## Cosa è successo nel blocco in corso (14/09, dal canarino delle 00:47)

Riepilogo cumulativo (vedi i checkpoint per il dettaglio di ognuna):
G7 consegnato (obiettivo x50, confronta burden con MIC/PPV), G8
costruito (firma nel report volata), G45 costruito (verdetto di
sintesi validatori), ricerca continua esaurita, censimento per-bottone
completo, un giro completo del browser raccolto e il suo difetto
corretto. **Poi, dopo la risposta "Tutto" del fondatore: tutta G47
(cinque commit sopra).** Chiuso G47, ripreso il cantiere **B3**
("Genesi continua a uscire dalla pagina" — nessuna app pronta con voce
aperta bloccata sul fondatore trovata più urgente, verificato con un
agente Explore sulla roadmap): due fette con cambio di firma,
`pfNominale(D2)` (`c45452b5`) e `pieDev(D2, x)` (in corso di
commit in questo momento, verifica sul giro isolato in volo).

**Ventisette unità di lavoro + dieci canarini** in questo blocco,
tutte committate e pushate, ognuna verificata prima del commit
(worktree isolata per le unità di codice).

## Prossimo passo atomico

1. **Immediato**: finire di committare `pieDev` (il giro isolato sta
   girando in background su una worktree separata mentre questo
   canarino si scrive — nessun conflitto, sono cartelle diverse).
2. Continuare B3: restano **58 funzioni** nel bucket "una o due
   variabili" di `genesi-estraibili.mjs --elenco` da estrarre con lo
   stesso schema (cambio di firma, `D2` come parametro esplicito).
   Prima di spostare ciascuna: `grep` il suo nome in `run-kpi.mjs` per
   trovare eventuali prove che pinnano il vecchio testo sorgente
   (lezione presa su `pfNominale` — due prove storiche erano diventate
   stale dal trasloco stesso e sarebbero state perse se non cercate
   PRIMA).
3. Quando B3 rallenta (i candidati restanti richiedono più cautela,
   con dipendenze da altre funzioni di pagina non ancora estratte),
   passare al fallback generico della roadmap: il prossimo ponte della
   mappa ecosistema, o una passata in profondità su un'altra app.

Nessuno stop volontario: si prosegue subito.
