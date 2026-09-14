# Ultimo ciclo di lavoro automatico

- **Quando**: 2026-09-14, 06:46 UTC
- **Commit di partenza**: `e27b11a3`
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`

## Che cosa sta per succedere

Questa non è una ripresa da fermo: la routine "Weekly Dev Session" ha
sparato una nuova accensione (fuoco delle 06:45:50 UTC, recapitato in coda)
mentre questa stessa sessione stava già lavorando senza interruzioni dai
canarini precedenti (00:47 e 04:32 UTC). Repository raggiungibile, `HEAD`
combacia col remoto, `git pull` senza cambiamenti. Questo aggiornamento
documenta lo stato reale, non un riavvio — l'unità in corso (vedi sotto)
resta aperta e riprende subito dopo questo commit.

⚠️ **Direttiva del fondatore in conversazione, più recente e più specifica
del prompt fisso di questa routine — CONFERMATA ANCORA VALIDA per la terza
volta**: concentrarsi SOLO sull'app Genesi. Il prompt fisso di questa
accensione (ponti fra le app, lavoro multi-app in parallelo, "Genesi NON
esce dal browser") resta un template generico non personalizzato — la
seconda parte è anche **scaduta**, verificato e documentato nel checkpoint
`20260914-005111`: il gap "Genesi non esce dal browser" è stato chiuso il
02/09, non c'è lavoro da fare lì.

⛔ **SEGNALAZIONE DI SICUREZZA APERTA, INVARIATA — DA LEGGERE PRIMA DI
TOCCARE GEOMETRIA/FLYROCK/BURDEN.** Il gate su
`deviazioneForiDaCsv`/`burdenVeroDaRilievo` (import del rilievo boretrack)
resta bloccato sul fondatore (`docs/DECISIONI_WEEKEND.md`, sezione 6).
Le soglie di sicurezza USBM/DIN restano un'altra decisione aperta (sezione
9), anch'essa invariata. Nessuna delle due è stata toccata in questo blocco.

## Cosa è successo nel blocco in corso (14/09, dal canarino delle 00:47)

**Il gruppo B3 diagnosticato in una sessione precedente è chiuso**: le
quattro funzioni che il censimento statico (`genesi-estraibili.mjs`)
marcava «più di dieci variabili del modulo» per un falso positivo del
tokenizzatore (parole interne confuse con `const` omonimi dichiarati
altrove nel file a bassa indentazione) sono ora tutte pure in
`genesi-data.js`, ognuna verificata con lo stesso rigore — confronto
byte-per-byte con la vecchia forma inline, iniezione del difetto storico,
verifica nel browser vero, cascata sui quattro documenti sorvegliati:
- `innescoSuMaglia` (G39, da `computeInnesco2D`)
- `reliefSuMaglia` (G40, da `computeRelief2D`)
- `energiaSuMaglia` (G41, da `computeEnergia2D`)
- `sequenzaSuMaglia` (G42, da `computeSeq2D` — ULTIMA del gruppo)

Con questo, **la barriera che il documento di scomposizione di G7
segnalava è caduta**: "la sequenza vive nella pagina, non nel modulo dati"
non è più vero, e un ottimizzatore che voglia includere MIC/PPV nel
confronto burden può riusare direttamente `sequenzaSuMaglia` e
`innescoSuMaglia`. Nota aggiornata in `vault/ROADMAP_SETTIMANA.md`.

**Unità aggiuntiva, non un falso positivo**: `generaMaglia` (G43, da
`genMaglia2D`) — quella funzione muta davvero `D2` ed è per questo
genuinamente nel bucket "11+"; è uscito solo il calcolo delle coordinate
(righe/colonne, sfalsamento), riusabile da un futuro ottimizzatore che
deve provare un burden diverso senza toccare il progetto disegnato a
schermo.

⏱️ **Unità in corso al momento di questo canarino**: G43 (`generaMaglia`)
ha superato la prima passata di verifica su worktree isolata (40/40
comandi, 0 caduti) e la correzione a cascata dei quattro documenti
sorvegliati; la seconda passata di convergenza (necessaria per il
totale-asserzioni, quirk già documentato in CLAUDE.md) sta girando in
background mentre questo canarino viene scritto. Il lavoro NON è stato
interrotto: le modifiche restano sul disco, non ancora committate.

**Tre unità in più committate e pushate** rispetto al canarino delle
04:32 (G40, G41, G42), ognuna verificata su `git worktree` isolata con
`giro-node.mjs` (40 comandi, 0 caduti, due passate per la convergenza del
totale) prima del commit.

## Prossimo passo atomico

1. **Immediato**: raccogliere l'esito della seconda passata di verifica di
   G43 (in corso), scrivere il checkpoint, committare con `git commit -F`
   e pushare — esattamente come fatto per G39/G40/G41/G42.
2. Con la barriera di G7 caduta, valutare la **seconda fetta**
   dell'ottimizzatore di volata: includere MIC/PPV nel confronto burden
   (riusando `sequenzaSuMaglia`/`innescoSuMaglia`/`micFinestra`/`ppvDaSd`)
   — un cantiere di prodotto che richiede la stessa disciplina di
   scomposizione-prima-del-codice di G7 (decisioni di UX da chiarire
   leggendo `docs/RICERCA_CONTINUA_GENESI.md`, sezione 14/09).
3. In alternativa: continuare il censimento `genesi-estraibili.mjs` per
   altri candidati genuini (non falsi positivi) nel bucket "3-5" o
   rivedere se restano candidati non ancora esaminati nel bucket "1-2".

Nessuno stop volontario: si prosegue subito.
