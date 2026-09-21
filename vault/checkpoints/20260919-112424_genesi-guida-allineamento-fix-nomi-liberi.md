# Checkpoint — 2026-09-19T11:24:24Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
ca00063e — feat(genesi): guida di allineamento sul trascinamento di un foro (G56) + fix nomi-liberi su get/set

## Cosa è stato completato
Nono cantiere Genesi del pivot, dal delta verificato di una ricerca in
background su snap magnetico/tracking dinamico (agente `a501f82f9fc14c82e`),
più una correzione a uno strumento di verifica trovata lanciando il giro
completo prima del commit — cosa che non veniva fatta da qualche unità.

- [x] Verificato indipendentemente col codice prima di implementare: G48
      aggancia solo il ramo "tratto" di `d2Move`; nessun banco esegue mai un
      trascinamento vero (down→move→up) su un foro.
- [x] `d2AlignGuide`: PURA anteprima visiva durante il trascinamento di un
      foro — non tocca lo snap effettivo. Compare quando un'altra fila è
      entro tolleranza (6 px/scala), sparisce al rilascio del mouse.
- [x] Banco `genesi-guida-allineamento.mjs`: prova prima il trascinamento
      nudo (mai provato), poi la guida — 8/8 normale, 1 KO voluto in
      controprova. Trovato e corretto un difetto nel banco stesso: senza
      `scrollIntoViewIfNeeded()` sul canvas, il trascinamento non partiva
      MAI su una pagina cresciuta (due file di fori), silenziosamente.
- [x] Chiusa la ricerca in `docs/RICERCA_CONTINUA_GENESI.md`; corretto un
      "non c'è" FALSO in `docs/RICERCA_GENESI_CAD.md` — l'export DXF esiste
      già (`dxfPianoFori`), la ricerca precedente aveva cercato i nomi
      sbagliati (`toDxf`/`exportDxf`/`writeDxf`).
- [x] ⛔ **Lanciato il giro completo (`giro-node.mjs`) prima del commit — non
      fatto dopo G54/G55 — e ha trovato un buco vero**: `nomi-liberi.mjs`
      falliva su `d2UndoLen()`/`d2RedoLen()` (getter del debug hook, da
      G54), latente perché `get`/`set` non erano fra i prefissi
      riconosciuti dal rilevatore di metodi abbreviati, e perché l'ancora
      di inizio riga non copriva una seconda getter dopo una virgola sulla
      stessa riga. Corretto (get/set come alternativa, virgola come terza
      ancora — mai un nuovo gruppo `\s*`, per non riaprire l'ambiguità
      esponenziale già pagata su questo file), con un nuovo test di
      regressione. Misurato: nessun rallentamento, nessun nuovo falso
      allarme.
- [x] Propagati i numeri in tutti e 4 i documenti tracciati: prove
      3.707→3.708, esecuzioni browser 447→449, file distinti 203→204,
      asserzioni del giro completo (stale)→4261. Corretta la tabella del
      cantiere di Genesi in DEVELOPMENT.md (estraibili 48→47).
- [x] Dispatchato un secondo agente di ricerca in background durante
      l'unità (Haiku, competitor Deswik.Blast vs Genesi, agente
      `a8f02100b3ca8dfff`): confermato con grep proprio che le due
      mancanze reali trovate (ventaglio parametrico, vista in sezione) sono
      scelte architetturali, non incompletezza — nessuna proposta
      azionabile, correttamente.

## Verifica prima del commit
`run-kpi.mjs`: 3210/3210. `numeri-nei-documenti.mjs`: 43/43.
`sintassi-pagine.mjs`: 34/34. `nomi-liberi.mjs`: 32/32 (0 falliti, era
31/32 prima della correzione). **Giro completo (`giro-node.mjs`): 41
comandi a posto, 0 caduti, 4261 asserzioni — i documenti dichiarano lo
stesso numero.** Banco `genesi-guida-allineamento.mjs`: 8/8 normale,
controprova 8 passati/1 KO voluto. Rilanciati `genesi-snap-estremo.mjs`
(8/8), `genesi-selezione-multipla.mjs` (14/14),
`genesi-rifletti-selezione.mjs` (7/7), `genesi-undo-limite.mjs` (6/6),
`genesi-input-relativo.mjs` (8/8): nessuna regressione.

## Stato roadmap
Tutte e quattro le priorità di `docs/RICERCA_GENESI_CAD.md` (snap a
oggetti, selezione multipla, trasformazioni, input relativo/polare) più lo
snap magnetico durante il drag sono ora costruite (G48-G56). Restano al
fondatore: i blocchi/simboli riusabili (Decisione #43). L'export DXF non è
più una lacuna nel censimento (era un falso "non c'è").

⚠️ Il giro completo del browser lanciato alle 09:51:33Z (PID 18070,
`giro-completo-19-0951.log` nello scratchpad) è ancora vivo alle 11:24Z
(93 minuti, ~23% delle passate fatte — 48 sezioni su circa 204 banchi). È
4 commit indietro rispetto a HEAD, con 25 righe di differenza su
`genesi.html` (questo commit): drift piccolo, non il livello che ha
giustificato un rilancio in passato (11 commit/240 righe). Lasciato
correre — il codice nuovo di G56 (il drag/la guida) non è comunque
verificabile da quel giro (nessun banco preesistente lo tocca), quindi non
sta producendo verdetti falsi sulla parte nuova. **Prossimo passo
atomico**: controllare l'esito con `leggi-giro.mjs` (partendo dalla
sezione 0) quando arriva in fondo o quando serve la macchina.

## Prossimi passi
- Controllare l'esito del giro completo del browser quando arriva in
  fondo o decidere di spegnerlo e rilanciarlo se il ramo si allontana
  ulteriormente.
- Aspettare l'esito del secondo agente di ricerca in background
  (competitor Deswik.Blast, chiuso senza azioni — verificato con grep
  proprio le due assenze dichiarate).
- Con le priorità del censimento CAD tutte costruite o dichiarate,
  valutare un nuovo fronte di ricerca Haiku in background su un aspetto
  diverso di Genesi (un altro concorrente, o una revisione di
  qualità/sicurezza mirata su G48-G56) per mantenere ≥3 fronti aperti.
- Continuare a verificare ogni pezzo di ricerca contro il codice PRIMA di
  implementare (l'export DXF ne è l'ultimo esempio).
- Lanciare il giro completo (`giro-node.mjs`) PRIMA di ogni commit da qui
  in avanti, non solo le suite mirate: è quello che ha trovato il buco su
  `nomi-liberi.mjs`, latente da G54.

## Blocchi
Nessuno.
