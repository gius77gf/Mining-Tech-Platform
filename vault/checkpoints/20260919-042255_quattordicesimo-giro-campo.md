# Checkpoint — 2026-09-19T04:22:55Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
5ad55b4a — fix(campo): rapportoGiornata/testoConsegnaTurno duplicavano una checklist

## Cosa è stato completato
Quattordicesimo giro: QA su Campo (dispatchata insieme a ricerca su Scudo
e seconda UX su Sentinella, direttiva 26/07). Entrambi i difetti trovati
verificati indipendentemente contro il codice attuale prima di
implementare, poi corretti in due commit separati:

- [x] **Campo, commit `232e9b5a`**: `csvAttivita` non portava mai
      squadra/operatore, pur essendo già mostrati a schermo
      (`etichettaAssegnazione`) e nel rapporto stampato. Aggiunte due
      colonne in coda. Aggiornato il censimento derivato delle
      intestazioni in `shared/deepwork-id-client/dw-shell.js`
      (`CSV_TABELLE`, regola B8 — il censimento è derivato dall'export
      vero, mai scritto a mano).
- [x] **Campo, commit `5ad55b4a`**: `rapportoGiornata`/`testoConsegnaTurno`
      filtravano `CHK` solo per data, senza applicare la regola "l'ultima
      vince" per (turno, squadra) che `checklistDi` già applica per lo
      schermo. Con due record per lo stesso slot (corsa TOCTOU in
      `salvaEsiti`, stessa famiglia di race già chiusa altrove) i
      documenti li elencavano ENTRAMBI mentre lo schermo ne mostra uno
      solo. Aggiunta `checklistUltimePerTurno(lista, data)`, un posto
      solo che applica la stessa regola di `checklistDi` su tutto
      l'elenco, usata da entrambi i documenti. Verificato anche nel
      browser: nuovo caso `--caso=chkdup` in `campo-foglio-turno.mjs`
      (già registrato in `tutti.mjs`, gira nel default), con controprova
      che riproduce la duplicazione identica su rapporto stampato e
      consegna .txt.

## Verifica prima di ogni commit
`run-kpi.mjs` 3181→3183/3183 · `sintassi-pagine.mjs` 34/34 ·
`run-stile.mjs` 330/330 · `suite-collegate.mjs` 3/3 ·
`iniezioni-fresche.mjs` 712/712 · `numeri-nei-documenti.mjs` 43/43
(423 banchi, copertura 1052→1053/1053) · `copertura-funzioni.mjs` 11/11 ·
`sonda-vuoto.mjs` 15/15 · `campo-foglio-turno.mjs` 54/54 normale, 19 KO
sotto `--controprova` (0 iniezioni mancate). Numeri propagati con lo
strumento a ogni passo (docs/DEVELOPMENT.md, docs/STATO_PRODOTTO.md,
docs/DECISIONI_WEEKEND.md, vault/ROADMAP_SETTIMANA.md).

## Stato roadmap
Campo ha ricevuto la sua prima QA approfondita di questa sessione (oltre
ai fix di inizio giornata). In parallelo la ricerca su Scudo (ciclo di
vita delle azioni correttive) e la seconda UX su Sentinella hanno
consegnato: due difetti CSS/tap-target condivisi in `shared/` e un bug
funzionale reale (eccezione non gestita in un modale di Sentinella su
"Collega la PPV misurata") dall'agente UX — ancora da verificare
indipendentemente e implementare; la ricerca su Scudo non ancora letta.

## Prossimi passi
- **Prossimo passo atomico**: verificare indipendentemente i due difetti
  riportati dall'agente UX su Sentinella (`abcf767091511907a`) contro il
  codice attuale — (1) `.dwg-tab > summary` in `shared/dw-grafici.css`
  sotto i 44/60px di tocco (51,7×30px misurato), correzione in
  `shared/` perché il componente è condiviso; (2) eccezione
  `Cannot read properties of null (reading 'appendChild')` nel modale
  PPV di Sentinella (`index.html` righe 2935-3025), causata da un
  `requestAnimationFrame` differito che sopravvive alla chiusura del
  modale — poi correggere, testare con controprova dove ha senso,
  propagare i numeri, committare.
- Leggere l'esito della ricerca su Scudo (ciclo di vita delle azioni
  correttive) quando disponibile, verificare e tradurre in unità o
  `docs/RICERCA_CONTINUA_SCUDO.md`.
- Leggere l'esito del giro completo del browser (`tutti.mjs` su worktree
  del commit `aade8904`) quando finisce, con `leggi-giro.mjs`,
  guardando prima la sezione 0 prima di fidarsi di eventuali KO —
  investigare in particolare l'errore di pagina
  `Cannot read properties of null (reading 'appendChild')` visto a metà
  registro su Sentinella: potrebbe essere lo stesso difetto appena
  trovato dall'agente UX, o un artefatto del giro su un commit vecchio.
- Aprire almeno tre nuovi cantieri paralleli su superfici non ancora
  fresche oggi (direttiva 26/07).

## Blocchi
Nessuno.
