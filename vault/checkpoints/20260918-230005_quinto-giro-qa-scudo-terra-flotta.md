# Checkpoint — 2026-09-18T23:00:05Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
401f1946 — fix(flotta): il contatore sostituito o azzerato aveva quattro regole diverse

## Cosa è stato completato
Dopo aver chiuso il finding di Campo (checklist/meteo, checkpoint
precedente), lanciati in parallelo tre agenti di QA in background su
Scudo, Terra e Flotta (regola dei ≥3 cantieri aperti insieme su app
diverse) più un agente di ricerca continua (haiku) su Flotta. Tutti e
tre gli agenti QA hanno riportato un finding confermato e verificato riga
per riga contro il codice attuale prima di correggere:

- [x] **Scudo** (`65e293ca`): `prognosiAperta` guardava solo il campo
      grezzo `giorniAssenza`, mai vero per un mortale (non ha "giorni di
      assenza" nel senso ordinario) né sempre scritto per una permanente
      — anche se `giornateConvenzionali` dà già la risposta definitiva
      (UNI 7249: 7500/75 giorni). Un decesso restava "da quantificare"
      per sempre: l'avviso "MINIMO" sulla scheda indici non sarebbe mai
      sceso, `riepilogoInfortuni` sommava ZERO giornate perse per il caso
      più grave possibile (stessa bugia già corretta il 15/09 in
      `indiciInfortunistici` ma mai propagata a `riepilogoInfortuni`), e
      il CSV del registro scriveva "prognosi ancora aperta" per un
      decesso. `prognosiAperta` torna `false` per mortale/permanente;
      `eventiSenzaAnalisi` aggiunge `infortunioGrave` accanto (non al
      posto di) `prognosiAperta` per non regredire la priorità del caso
      originale della decisione 17.
- [x] **Terra** (`64a211d2`): il quarto asse di conformità (distanza dal
      confine, aggiunto lo stesso 18/09) calcolava il verdetto per ogni
      fronte ma `conformitaProgetto` non lo aggregava mai — a differenza
      di volume e geometria. Un fronte "oltre" restava silenzio totale
      sul cartellone, non nemmeno "non misurato". Aggiunto l'aggregato
      `confine` (stessa forma di `geometria`) più la riga corrispondente
      in `cardConformita`.
- [x] **Flotta** (`401f1946`): il contatore sostituito o azzerato aveva
      quattro regole diverse in quattro punti. "Registra ore" era troppo
      rigido (nessuna via per dichiarare un contatore sostituito, a
      differenza del Rifornimento); "Modifica mezzo" era troppo
      permissivo (scriveva qualunque discesa senza dichiararla, scollegando
      `mezzi.ore` dalle letture storiche che `azzeramentiDelMezzo` legge).
      "Registra ore" guadagna la stessa checkbox del Rifornimento (e
      scrive un rifornimento a zero litri con `contatoreNuovo` quando
      dichiarato); "Modifica mezzo" blocca la discesa e rimanda a
      "Registra ore".
- [x] **Flotta, ricerca continua (tredicesimo giro)**: verificato che la
      soglia di vita dei componenti (proposta della stessa ricerca del
      18/09) era già stata implementata (`917c9b22`) prima di questa
      unità — chiusa la riga in `docs/RICERCA_CONTINUA_FLOTTA.md` che la
      dichiarava ancora da fare ("il non c'è scaduto").

Ogni fix coperto da test: unit test in `run-kpi.mjs` per Scudo e Terra
(pure functions, browser non aggiungeva certezza); banco browser con
controprova funzionante per Flotta (`flotta-contatore-sceso.mjs`,
registrato in `tutti.mjs`). Verifica completa dopo ogni commit.

## Verifica prima dell'ultimo commit
`run-kpi.mjs` 3172/3172 · `sintassi-pagine.mjs` 34/34 ·
`run-stile.mjs` 330/330 · `suite-collegate.mjs` 3/3 ·
`iniezioni-fresche.mjs` 694/694 sul bersaglio (0 scadute). Tutto verde.

## Stato roadmap
Backlog QA di questo blocco (Campo, Scudo, Terra, Flotta) e ricerca
continua (Flotta) chiusi. Nessun finding noto rimasto aperto in questo
momento.

## Prossimi passi
- **Prossimo passo atomico**: nessun finding specifico in coda. Procedere
  con il fallback di CLAUDE.md — nuovo giro di ricerca-continua a
  rotazione (app non ancora coperte in questo giro: Sentinella, Conti,
  Deepwork ID, Genesi, Campo hanno già avuto ricerca o QA recente) e in
  parallelo aprire almeno altri due cantieri QA/miglioria su app diverse.
- Controllare lo stato del giro di convergenza lungo (PID 688, attestava
  `c50d652d` con 0 KO veri all'ultimo controllo, ~144/183+ passate lette,
  il branch già avanti di molti commit da allora): se ancora vivo,
  valutare se è ormai troppo vecchio per fidarsi dei suoi numeri; se
  concluso, ripetere `numeri-nei-documenti.mjs` fresco su HEAD prima di
  propagare qualunque cifra nei quattro documenti tracciati.
- `numeri-nei-documenti.mjs` segnalava PRIMA di questo blocco alcuni
  numeri stantii in `docs/DEVELOPMENT.md`, `docs/STATO_PRODOTTO.md`,
  `docs/DECISIONI_WEEKEND.md`, `vault/ROADMAP_SETTIMANA.md` (totale prove
  3.652→3.667 già solo per `run-kpi.mjs` cresciuto, banchi browser
  365→409, funzioni coperte 1046→1049, file di banco distinti 162→184,
  più uno scarto nella tabella del cantiere Genesi) — non ancora
  propagati: farlo con lo strumento, non a mente, e solo su un conteggio
  fresco perché il numero cambia a ogni nuova unità.

## Blocchi
Nessuno.
