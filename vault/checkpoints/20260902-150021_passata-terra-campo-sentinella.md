# Checkpoint — 2026-09-02T15:00:21Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
fc375fe4 — «Terra: il foglio per l'ente dichiara su quanto è stimata l'incertezza, e tre difetti minori»

## Completato
- **Terra** (cantiere parallelo, misurato: run-kpi 2431/0, stile 328/0,
  iniezioni 444/444, copertura 70/70, giro node 37/0, scatto guardato): quattro
  difetti veri corretti nel modulo — il foglio per l'ente che chiamava
  «complessiva» un'incertezza su un rilievo su quattro, il CSV dei rilievi con
  la colonna del fronte vuota, la scadenza senza data con la striscia verde,
  i puntini sui lotti. Tre cose scritte in roadmap.
- **Campo e Sentinella**: nove banchi verdi, undici schermate guardate, rete
  dei sospetti vuota (`2033372a`).
- **Core**: sette banchi lanciati a mano senza proxy, sei verdi;
  `core-date-illeggibili` esce 1 — DA LEGGERE (vedi sotto).

## Prossimo passo atomico
Leggere il registro di `core-date-illeggibili.mjs` (lanciato a mano con la
porta 8823: `scratchpad/ponte-conti/sent/core-date-illeggibili.log`) e capire
se il KO è del banco (fixture, porta, proxy) o del prodotto; se del prodotto,
riprodurlo con un caso in scratchpad e correggere nel core con la prova.
Poi la sei-app-più-core passata è completa per oggi: aggiornare la riga di
`docs/STATO_PRODOTTO.md` che racconta la settimana, e riprendere il binario
dei ponti dalla mappa (prossima famiglia: 3c, le persone — Scudo, Sentinella,
Campo — decidendo chi è la fonte).

## Blocchi
Nessuno. PR #345 verde, aperta (unire è del fondatore).
