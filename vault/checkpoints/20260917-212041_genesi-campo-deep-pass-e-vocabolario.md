# Checkpoint — 2026-09-17T21:20:41Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
2b8c58fc

## Cosa è stato completato
Tre cantieri in background (ricerca PAROLE, deep-pass Genesi, deep-pass
Campo), tutti riverificati leggendo io stesso il codice prima di agire.

**Genesi (commit `3c63c252`)**: dalla ricerca continua sul vocabolario
(blocco 4), due glosse. «Confronta burden»/«Burden per foro» dicevano solo
«burden», mai «spalla» — corretto in «spalla (burden)», come fa sempre il
mestiere italiano (fonte: tesi Politecnico di Torino). Il badge del powder
factor cambiava nome da solo («Powder factor»/«carica specifica»/«PF») —
unificato su «Consumo specifico (powder factor)», il termine già
maggioritario nel resto dell'app (31 occorrenze). Nuovo banco browser con
controprova, verificato dal vivo.

L'agente di deep-pass su Genesi ha anche trovato **due difetti veri non
ancora corretti** (fuori da questo commit, da riprendere): (1) il file
`.volata.json` scrive `borraggio_m` ma non lo rilegge MAI in import — round
trip che perde silenziosamente un parametro di sicurezza; (2)
`caricaForoDaGeometria` tratta un borraggio di ESATTAMENTE ZERO come dato
mancante (`stem > 0` stretto), mentre `confinamentoColletto` nello stesso
modulo lo accetta come valido di proposito (commento G17) — con "carica
automatica" un borraggio a zero azzera l'intera scheda KPI invece di
rispettare una scelta di progetto reale.

**Campo (commit `2b8c58fc`)**: dal secondo giro di deep-pass, due difetti
veri, entrambi riprodotti dal vivo. (1) Il Quadro (`dash-hse`) leggeva solo
`q.scadute`, mai `q.nonIdonei` — un giudizio medico di inidoneità (che
"vince su tutto") restava invisibile sul primo schermo della giornata
finché la persona non aveva ANCHE un documento scaduto; la sezione Squadre
lo segnalava già. Corretto con la stessa priorità del widget gemello. (2)
«Consegna di turno (testo)» era l'unico dei ~18 punti di scrittura che non
passava da `bloccato()`: poteva riscrivere il testo della consegna su un
turno già firmato, senza traccia di riapertura. Corretto. Due banchi
browser nuovi con controprova, verificati dal vivo con Playwright
(riproducendo esattamente gli scenari dell'agente).

Verifica: worktree isolata + giro node completo, tre volte (una per ogni
incremento di banchi/test), risultato finale **41/41 comandi, 0 caduti,
4098 asserzioni**, cinque documenti aggiornati e verificati con
`numeri-nei-documenti.mjs` (43/0).

## Stato roadmap
Secondo giro di deep-pass ORA COMPLETO su tutte le sei app + core (Conti,
Scudo, Sentinella, Genesi, Core, Terra, Flotta, Campo). Ricerca continua:
Campo, Core, Norme, DeepworkID, Mestiere, Parole fatti in questa sessione.
Decisioni aperte in `docs/DECISIONI_WEEKEND.md`: **24**.

## Prossimo passo atomico
1. **Priorità**: i due difetti di Genesi trovati e non ancora corretti
   (borraggio mai riletto in import; borraggio zero trattato come dato
   mancante invece che scelta di progetto) — verificarli di persona
   leggendo `apps/genesi/genesi.html:3130,3166-3168` e
   `apps/genesi/genesi-data.js:2106-2129,3600-3604`, poi correggere con
   test + controprova, stessa disciplina di sempre.
2. Continuare la rotazione di ricerca continua sul prossimo file più stale
   (`git log -1 --format=%ci -- docs/RICERCA_CONTINUA_*.md`).
3. Aprire almeno altri due cantieri in parallelo (regola delle tre app),
   continuando a lavorare fino a esaurimento crediti senza fermarsi.

## Blocchi
Nessuno.
