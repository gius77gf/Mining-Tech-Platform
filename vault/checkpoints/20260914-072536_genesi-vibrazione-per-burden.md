# Checkpoint — 2026-09-14T07:25:36Z

## Tipo
unit-complete (G7 — seconda fetta dell'ottimizzatore di volata, cantiere di prodotto)

## App
Genesi

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Completato

**`vibrazionePerBurden` (G44), nuova funzione pura in `genesi-data.js`.**
Chiude la seconda metà di G7 che il bottone "Confronta burden" (G38)
dichiarava esplicitamente fuori perimetro: *"Non ricalcola vibrazione né
sequenza... farla qui sarebbe una terza copia della stessa domanda"*.
Questo era vero finché `computeSeq2D`/`computeInnesco2D`/`genMaglia2D`
vivevano solo nella pagina — G39-G43 (chiusi in questo stesso blocco di
lavoro) li hanno resi puri, rendendo questa fetta possibile senza
duplicare niente.

**Che cosa fa**: per ogni burden candidato già uscito da
`curvaBurdenCarica` (stessa pezzatura obiettivo, stesso rapporto
spalla/interasse), genera una maglia di PROVA con la stessa forma del
progetto disegnato (file, fori per fila, sfalsamento — `generaMaglia`), la
sequenzia con le impostazioni di oggi (ritardo, direzione, schema —
`sequenzaSuMaglia`), e stima MIC e PPV al recettore con le STESSE funzioni
pure che la Scheda volata usa per il progetto reale (`micFinestra`,
`ppvDaSd`, `esitoPpv`) — non una terza copia della formula, la stessa, con
input diversi. I parametri di sito (K, β) vengono da `ppvSite()`, la
stessa fonte (legge di sito o litologia) che decide la PPV di oggi.

**Decisioni di design, dichiarate nel codice**:
- Il burden fra file della maglia di prova è sempre `bf=B` (il burden
  candidato), la stessa convenzione di `genMaglia2D` (`D2.bf=D2.B`): si
  genera una maglia NUOVA, non si tocca quella disegnata.
- La carica per foro è quella che la riga già dichiara (uniforme su tutti
  i fori), la stessa assunzione di `computeMIC`/`micFinestra` sul progetto
  reale.
- Righe non calcolabili (`kg===null`) restano tali — non si inventa una
  vibrazione su una carica che non si conosce; e i "non lo so" di carica e
  distanza restano SEPARATI (principio del fondatore: MIC leggibile con
  distanza assente resta leggibile, solo la PPV diventa "non calcolabile").

**Verificato, con la scoperta di un limite della prima stesura**:
1. Prima versione dei test di iniezione: ho provato a rompere `bf`
   (sostituendo `r.B` con `r.S`) e la prova NON l'ha presa — scoperto
   (misurando, non deducendo) che le formule di sequenza dipendono solo da
   `mx` e dall'INDICE di riga, non dalla distanza reale fra file: `bf` è
   inerte per questo calcolo specifico. Non un difetto — un parametro
   dichiaratamente corretto ma non esercitato da QUESTA funzione. Trovata
   un'iniezione realmente significativa: la formula della distanza
   scalata senza la radice quadrata (`recDist/mic` invece di
   `recDist/√mic`) — quella sì presa, su due prove diverse.
2. `run-kpi.mjs`: 6 nuove prove (sequenza diagonale con un foro per
   finestra, sequenza "riga" con raggruppamento MIC su tutta la maglia,
   riga non calcolabile, geometria di prova senza fori, senza distanza del
   recettore, array vuoto). 2963 → **2969**, 0 falliti. I valori attesi
   sono stati letti eseguendo la funzione (non calcolati a mano), poi
   fissati come asserzioni — la stessa disciplina di `curvaBurdenCarica`.
3. `copertura-funzioni.mjs`: `genesi-data.js` 151/151 → **152/152**.
4. **Wiring alla UI**: il bottone "Confronta burden" ora chiama
   `vibrazionePerBurden` e la tabella guadagna due colonne (MIC, PPV
   stimata), colorate con le classi CSS già esistenti nel core
   (`sv-ok`/`sv-warn`/`sv-bad`/`sv-info`, lo stesso vocabolario di
   `esitoPpv`). Aggiunta una riga di provenienza (`provenienzaPpv().breve`)
   che dichiara da dove vengono K/β (legge di sito o litologia).
5. **Verifica nel browser vero** (Playwright, volata 18 fori, bottone
   premuto, obiettivo x50=15cm inserito): la tabella esce con 9 righe di
   confronto, MIC crescente con la carica (111,5→642,6 kg), PPV crescente
   di conseguenza (10,7→41,4 mm/s), colorata correttamente (arancione
   sotto la soglia di 15 mm/s vicino al limite, rosso sopra) — verificato
   con screenshot, zero errori di pagina.
6. Giro completo su `git worktree` isolata, **due passate** per la
   convergenza del totale asserzioni sui documenti: **40/40 comandi, 0
   caduti** su entrambe, seconda passata con `numeri-nei-documenti.mjs`
   43/43 e i quattro documenti allineati.

**Corretto a cascata nei quattro documenti sorvegliati**:
- `docs/DEVELOPMENT.md`: 3.444→**3.450** prove, `2963`→**2969** nell'addendo
  `run-kpi`, moduli condivisi 315/315→**316/316**, `genesi-data.js`
  151/151→**152/152**, giro completo 3.903→**3.909**.
- `docs/STATO_PRODOTTO.md`: stessa cascata, «G43»→**G44**,
  «generaMaglia»→**vibrazionePerBurden**, `2963`→**2969**, giro completo
  3.903→**3.909**.
- `docs/DECISIONI_WEEKEND.md`: «3.444, dopo `generaMaglia` — G43»→
  **«3.450, dopo `vibrazionePerBurden` — G44»**.
- `vault/ROADMAP_SETTIMANA.md`: stessa cascata, e **la voce G7 aggiornata**
  con una nota ✅ che dichiara chiusa la seconda fetta (MIC/PPV nel
  confronto burden), lasciando esplicitamente aperto il multi-obiettivo
  vero (fronte di Pareto, pesi soggettivi) come domanda del mondo ancora
  da decidere.

## Stato roadmap

**G7 ha ora due fette consegnate e verificate**: la carica per obiettivo di
frammentazione (G38) e MIC/PPV per lo stesso confronto (G44). Il
multi-obiettivo vero (Pareto front o vincoli con pesi) resta una domanda
di prodotto aperta, non tecnica: gli ingredienti pure ci sono tutti.

## Blocchi e limiti noti

Nessuno nuovo. Da tenere presente: `vibrazionePerBurden` assume che la
maglia di prova abbia la STESSA forma (file/perRow/stagger) del progetto
disegnato — non esplora variazioni di quella forma, solo del burden entro
il rapporto S/B fissato. Un ottimizzatore che varii anche file/perRow
sarebbe un cantiere ulteriore, non implicito in questa unità.

## Prossimo passo atomico

1. Con G7 sostanzialmente avanzato, valutare se il multi-obiettivo vero
   (mostrare al progettista il trade-off costo/frammentazione/vibrazione,
   non solo un vincolo per riga) è la prossima fetta onesta, o se conviene
   raccogliere la ricerca in sospeso su "come si misura davvero la
   frammentazione" (fotografia/image analysis, lanciata in background in
   un blocco precedente, mai raccolta).
2. In alternativa, tornare al censimento `genesi-estraibili.mjs` per
   eventuali candidati residui, oppure alla lista "SE LA ROADMAP SEMBRA
   FINITA" del prompt fisso della routine (seconde iterazioni delle app
   verticali, rimandati del censimento, revisione qualità/sicurezza).

Nessuno stop volontario: si prosegue subito.
