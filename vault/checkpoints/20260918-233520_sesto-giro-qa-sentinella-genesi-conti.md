# Checkpoint — 2026-09-18T23:35:20Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
bafe439d — fix(conti): il sollecito su una fattura "come non emessa" non passava dalla guardia

## Cosa è stato completato
Dopo il quinto giro (Scudo/Terra/Flotta, checkpoint precedente), lanciati
altri tre agenti di QA in parallelo su Sentinella, Genesi (secondo giro,
famiglia già battuta) e Conti (secondo giro). Tutti e tre confermati e
corretti:

- [x] **Sentinella** (`ca97290a`): `superamentiAperti` scriveva
      `valore: +m.valore` invece del valore che `statoMisura` aveva usato
      per giudicare "Superamento" — con un campo dichiarato non sincrono
      con le letture, il testo scritto nella collezione `azioni` di Scudo
      diceva "misurato 0" su un superamento vero. `kpiFrom` giudicava con
      la sola soglia del punto, mai `sogliaEfficace` (soglia del
      ricettore) a differenza delle sue sorelle — oggi lo schermo resta
      corretto solo perché il chiamante pre-applica `conSoglia`, ma un
      test del repository la chiamava già nel modo sbagliato. Aggiunto un
      terzo parametro facoltativo `ricettori`, retrocompatibile.
- [x] **Genesi** (`ed36ea7d`): `muckShape()` rileggeva `D2.B`/`D2.S`
      grezzi invece dei valori misurati — stessa famiglia già chiusa oggi
      su S/B, H/B, Timing, Spalla/Ø. Con l'interasse illeggibile il
      baricentro del cumulo veniva stimato in **2,5×10³³ metri**, un
      numero finito scritto per intero invece di "—". Il pannello Decking
      calcolava `_kgDeck = Q/_N` senza guardia: con la carica illeggibile,
      "Ogni deck ≈ 0 kg" accanto a "Totale carica — kg".
- [x] **Conti** (`bafe439d`): la lista Fatture e il bottone "Segna come
      inviato" non passavano dalla guardia `statoSdi(f).nonEmessa`/
      `sollecitabile()` già propagata a undici funzioni pure lo stesso
      giorno — una fattura scartata dallo SdI usciva rossa "scaduta" con
      mora e bottone sollecito visibili, e "Segna come inviato" (l'unico
      dei tre bottoni senza la guardia) poteva salvare uno storico
      sollecito **persistente** su un documento che per il fisco non
      esiste. Corretto anche un arrotondamento prematuro in quattro
      grafici a barre (stessa famiglia della barra dei 12€ di stamattina,
      un piano più a monte: il valore va arrotondato nell'etichetta, non
      prima del motore condiviso).

Ogni fix verificato riga per riga contro il codice attuale prima di
correggere, con riproduzione concreta (script Node o browser) fornita
dall'agente e ri-verificata. Test: unit test per Sentinella, browser banco
con controprova per Genesi, prove sul sorgente per Conti (un banco
browser aggiungerebbe poca certezza in più su un calcolo di stato e su
una guardia di un click handler — motivato nel commento del test).

## Verifica prima dell'ultimo commit
`run-kpi.mjs` 3177/3177 · `sintassi-pagine.mjs` 34/34 ·
`run-stile.mjs` 330/330 · `suite-collegate.mjs` 3/3 ·
`iniezioni-fresche.mjs` 699/699 sul bersaglio (0 scadute). Tutto verde.

## Stato roadmap
Sei agenti di QA dispatchati in due giri paralleli (Scudo/Terra/Flotta,
poi Sentinella/Genesi/Conti) hanno tutti riportato almeno un finding
confermato e corretto. Nessun finding QA noto rimasto aperto in questo
momento — sesto giro chiuso.

## Prossimi passi
- **Prossimo passo atomico**: nessun finding specifico in coda. Procedere
  col fallback di CLAUDE.md — a questo punto TUTTE le sei app hanno avuto
  almeno un giro di deep-pass QA mirato oggi (18/09), alcune due. Prossima
  mossa naturale: un nuovo giro di ricerca-continua a rotazione (l'ultima
  fatta è stata su Flotta, reorder-point/safety-stock — già chiusa perché
  la soglia dei componenti era già implementata), su un'app diversa; e/o
  una seconda iterazione UX/estetica con screenshot su un'app verticale,
  come da fallback list punto 1.
- Il numero delle prove (`3.652`→`3.668` e gli altri tre numeri stantii)
  è già stato propagato con lo strumento (commit `2fecfe5b`, PRIMA di
  questo sesto giro): da ricontrollare con `numeri-nei-documenti.mjs`
  all'inizio del prossimo blocco, perché altri +5 test sono stati
  aggiunti da allora (run-kpi 3172→3177).
- Controllare lo stato del giro di convergenza lungo (PID 688): se ancora
  vivo dopo tutte queste ore, è ormai troppo vecchio per fidarsi di
  qualunque numero — va giudicato "troppo vecchio" e non riletto per
  propagare cifre, solo eventualmente per i suoi KO veri (se ce ne sono).

## Blocchi
Nessuno.
