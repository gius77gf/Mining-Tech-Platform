# Ultimo ciclo di lavoro automatico

- **Quando**: 2026-09-14, 04:32 UTC
- **Commit di partenza**: `d8d7953d`
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`

## Che cosa sta per succedere

Questa non è una ripresa da fermo: la routine "Weekly Dev Session" ha
sparato una nuova accensione (fuoco delle 03:45 UTC, recapitato in coda)
mentre questa stessa sessione stava già lavorando senza interruzioni dal
canarino precedente (00:47 UTC). Repository raggiungibile, `HEAD` combacia
col remoto, working tree pulita (`git pull` senza cambiamenti). Questo
aggiornamento del canarino documenta lo stato reale, non un riavvio.

⚠️ **Direttiva del fondatore in conversazione, più recente e più specifica
del prompt fisso di questa routine — CONFERMATA ANCORA VALIDA**: concentrarsi
SOLO sull'app Genesi. Il prompt fisso di questa accensione (ponti fra le
app, lavoro multi-app in parallelo, "Genesi NON esce dal browser") resta
un template generico non personalizzato — la seconda parte è anche
**scaduta**, verificato e documentato nel checkpoint `20260914-005111`: il
gap "Genesi non esce dal browser" è stato chiuso il 02/09, non c'è lavoro
da fare lì.

⛔ **SEGNALAZIONE DI SICUREZZA APERTA, INVARIATA — DA LEGGERE PRIMA DI
TOCCARE GEOMETRIA/FLYROCK/BURDEN.** Il gate su
`deviazioneForiDaCsv`/`burdenVeroDaRilievo` (import del rilievo boretrack)
resta bloccato sul fondatore (`docs/DECISIONI_WEEKEND.md`, sezione 6).
Le soglie di sicurezza USBM/DIN restano un'altra decisione aperta (sezione
9), anch'essa invariata. Nessuna delle due è stata toccata in questo blocco.

## Cosa è successo nel blocco in corso (14/09, dal canarino delle 00:47)

**B0-septies decisa e chiusa** (`vault/checkpoints/20260914-015629` e
seguenti): la decisione roadmap del 04/09 su "che cosa disegna una pianta
senza maglia" era scaduta di dieci giorni senza risposta, auto-decide non
revocato per questa voce (a differenza della segnalazione boretrack sopra).
Misurato con Node (non dedotto) che con burden/interasse assenti la maglia
collassava tutti i fori sullo stesso punto — non "3,5×4" come lasciava
intendere una riga di `DECISIONI_WEEKEND.md`, corretta sul posto. Curata
alla radice (`magliaAssenteMotivo` in `genesi-data.js`, blocco G37):
`genMaglia2D` non genera più coordinate quando la maglia non è
posizionabile, e i cinque consumatori a valle non vengono mai chiamati su
una maglia vuota (avevano già la guardia). Verificato nel browser vero.

**Un difetto ambientale reale trovato e corretto in nove banchi**: in
questo contenitore l'import Firebase da `gstatic.com` non fallisce subito
come in un contenitore senza rete — resta appeso fino al taglio del proxy
(~13s per pagina). La cura era già scritta in `genesi-locale.mjs` e non
applicata altrove: estesa a tutti i banchi `genesi-*.mjs`/`ponte-genesi-
*.mjs` che ne erano privi. Un banco è passato da "non apre nemmeno la prima
pagina in 90s" a passare per intero in minuti; un altro da un crash a
funzionare; un terzo (`genesi-struttura.mjs`) da 29,2s a 17,0s, smentendo
una diagnosi di un mese fa che dava tutta la colpa alla scena 3D "senza
GPU" — era una causa vera ma incompleta.

**G7 (ottimizzatore di volata) scomposto e la prima fetta consegnata**:
verificato che l'ottimizzatore vero (multi-obiettivo, con la vibrazione)
non è una fetta piccola — la sequenza che decide la MIC vive nella pagina,
non nel modulo dati. La prima fetta onesta (`curvaBurdenCarica`: burden
variabile, stessa frammentazione target, quanta carica serve) è stata
implementata come funzione pura, provata con iniezione del difetto, e
**collegata a schermo** (bottone "Confronta burden per lo stesso
obiettivo"), verificata nel browser vero con screenshot.

**Nove unità committate e pushate**, ognuna verificata su `git worktree`
isolata con `giro-node.mjs` (40 comandi, 0 caduti) prima del commit, con
la cascata di numeri nei documenti (`numeri-nei-documenti.mjs`) corretta
ogni volta che una nuova funzione o un nuovo banco la faceva scadere.

**Ricerca di fianco**: una sezione su G7 (ottimizzazione — con un
autocorreggersi di una prova sbagliata, due volte di fila, prima di
committarla), una su come si misura davvero la frammentazione (fotografia/
image analysis) lanciata in background, non ancora raccolta.

## Prossimo passo atomico

1. Raccogliere e verificare (non fidarsi sulla parola) la ricerca sulla
   misura fotografica della frammentazione, appena pronta.
2. Rileggere l'indice `## 🧭 Le voci APERTE, per nome` in
   `vault/ROADMAP_SETTIMANA.md` per la prossima voce Genesi ancora aperta
   (B3 è agli sgoccioli per le estrazioni meccaniche: i bucket "0" e "1-2"
   variabili sono confermati esauriti — quello che resta è un rifacimento,
   non un trasloco).
3. In alternativa: valutare se scomporre l'estrazione di `computeSeq2D`
   (sbloccherebbe la parte vibrazione/sequenza di G7) come cantiere B3 a
   sé, con la stessa disciplina di scomposizione-prima-del-codice.

Nessuno stop volontario: si prosegue subito.
