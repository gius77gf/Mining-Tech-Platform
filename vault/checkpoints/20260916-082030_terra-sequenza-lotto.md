# Checkpoint — 2026-09-16T08:20:30Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
e18dc938

## Cosa completato
- Chiuso il secondo dei sei delta del tredicesimo giro di ricerca continua
  su Terra (dopo il piano pluriennale): **la validazione di sequenza fra
  lotti**. `lotto.ordine` esiste da sempre (verificato: unico uso prima
  d'oggi era di visualizzazione, riga 3255, "1° del progetto") e non era
  mai letto da nessun controllo.
- Campo opzionale e additivo `lotto.dipendeDa: {lottoId, percentuale}`
  (stessa forma di `volumiAnnuali`). Funzione pura `sequenzaLotto(lotto,
  tuttiLotti, rilievi)`: riusa `volumeMisuratoDiLotto` + `avanzamentoLotto`
  (non ricalcola l'avanzamento una seconda volta), stessa forma
  `{pertinente, frase}` già usata da `attesaCollaudo`/`attesaRecupero`.
- **Deliberatamente NON bloccante**: Terra non ha un bottone "apri"
  distinto dal form generico di modifica del lotto, quindi un divieto
  costruito qui fermerebbe anche la correzione di un errore di battitura
  su un lotto aperto da mesi. Si limita a dirlo — badge "fuori sequenza"
  + frase nel `form-hint` della riga.
- Due stati nella dimostrazione, di proposito: Lotto 5 fuori sequenza
  (aperto dal 2025 mentre dipende dal Lotto 4 all'80%, oggi al 34,8%);
  Lotto 6 dipende dal Lotto 5 al 20%, misurato al 27,6%: rispettata,
  anche se il Lotto 6 stesso è ancora "previsto" — la validità della
  sequenza non dipende dallo stato del lotto che guarda.
- Test in `run-kpi.mjs`: non pertinente senza `dipendeDa`; rispettata vs
  violata; l'uguaglianza esatta alla soglia (>=, non >); soglia di
  default 100% quando `percentuale` non è dichiarata; due assenze
  diverse (lotto sparito dal progetto vs avanzamento non misurabile);
  la prova sulla dimostrazione.
- Banco browser nuovo `tests/browser/terra-sequenza-lotto.mjs`: il badge
  "fuori sequenza" e la frase devono riportare ESATTAMENTE la percentuale
  calcolata dal modulo. 8/8 normale, controprova 1/1.
- ⚠️ Trovato e corretto durante la verifica: la mia prima stesura di
  `un1` (formattatore percentuale locale dentro `sequenzaLotto`) non
  dichiarava `useGrouping` — regola 16 di `run-stile.mjs` (Node e
  Chromium raggruppano le migliaia in modo diverso, e un `toLocaleString`
  senza quella dichiarazione esplicita blinda una verità che l'utente
  potrebbe non vedere mai). Corretto aggiungendo `{ useGrouping: true }`,
  come il gemello già in uso nella pagina.
- Verifica: doppio giro isolato, stesso "far west" atteso su
  `numeri-nei-documenti.mjs` al primo passaggio, secondo verde: 40/40
  comandi, 4041 asserzioni confermate.
- Doc-cascade finale: run-kpi 3068→3073, somma nove suite 3.562→3.567,
  copertura 1039/1039→1040/1040, giro completo 4035→4041, banchi
  browser 305→307 esecuzioni / 132→133 file distinti.
- `copertura-funzioni.mjs`: FONDO terra 101→102.
- Commit `e18dc938`, pushato.

## Unità collaterale (stesso blocco)
Ricerca in background (haiku) su Sentinella — nono giro: catena di
custodia dello STRUMENTO (matricola/numero di serie, distinto dal punto
di misura) ed escalation automatica sui superamenti RIPETUTI. L'agente ha
letto prima le ricerche precedenti ed evitato di riproporre la catena di
custodia sulle LETTURE (già decisione aperta #24). Due mancanze proposte,
entrambe con grep vero rilanciato due volte — NON ANCORA riverificate
indipendentemente da me prima di tradurle in codice. Commit `9dc95d54`,
già pushato.

## Stato roadmap
Terra ha chiuso due dei sei delta del tredicesimo giro (piano
pluriennale, sequenza fra lotti). Restano: allerta apertura fuori
programma (parente stretto di `sequenzaLotto`, forse assorbibile nella
stessa unità futura), report per banco×anno con stato progettuale.

## Prossimo passo atomico
1. Riverificare indipendentemente (grep sul codice vero) le due
   mancanze del nono giro di ricerca su Sentinella prima di tradurne
   una in codice — regola "niente entra sulla parola dell'agente".
2. Se confermata, la più pronta delle due sembra l'identità dello
   strumento (matricola/numero di serie): campo aggiuntivo, additivo,
   nello stesso schema del `punto` — scomporre prima di scrivere codice
   se tocca il modello dati della taratura.
3. Non fermarsi qui per la regola del fondatore (esaurimento crediti):
   proseguire immediatamente con l'unità successiva.

## Blocchi
Nessuno.
