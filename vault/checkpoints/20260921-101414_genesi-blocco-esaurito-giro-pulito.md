# Checkpoint — 2026-09-21T10:14:14Z

## Tipo
verifica (nessun codice di prodotto toccato in questa unità)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
fc8bb528 (chore(vault): propaga il numero vero di asserzioni (4284), giro-node pulito)

## Cosa è stato completato
Controllato un'ultima area per il metodo "verifica dal vivo" di questo
blocco: i toggle dei layer del Progetto 2D (`dlIso`/`dlEne`/`dlInn`/
`dlSnap`, solo `dlRel` ha copertura). Letto `drawIsocrone2D`: le
funzioni di calcolo (`spaziaturaTipica`, `tempoInPunto`, `passoIsocrone`,
`isoColore`) sono già estratte in `genesi-data.js` e testate lì; il
rendering (marching squares su canvas) ha già le guardie NaN sui punti
fuori dalla nuvola dei fori o davanti alla faccia libera. Nessun segno
di un difetto storico mai chiuso, a differenza dei due casi trovati
prima in questo blocco (Ruota/Scala tratti, innesco XML) — **non
scritto un banco**: senza un difetto noto da riprodurre, testare il
disegno pixel-per-pixel di un contour plot sarebbe uno sforzo alto per
un rischio non misurato, la stessa cautela già usata altrove in questa
sessione per il "burden map".

## Bilancio del blocco (dal checkpoint `20260921-035156`, audit
costoVolata, fino a qui)
- 2 documenti stale chiusi con la prova (G53/export già fatto;
  convenzione assi DXF già difesa più del mondo).
- 2 candidati di sicurezza portati in `docs/DECISIONI_WEEKEND.md`
  (MIC/scatter innesco elettrico), non costruiti di iniziativa.
- 1 domanda di governo posta esplicitamente (scadenza dei sette giorni
  sulla decisione 28), non risolta per inferenza.
- 1 documento di piano vecchio di due mesi (`PIANO_3D.md`) riportato
  allo stato vero.
- 2 banchi nuovi per due difetti storici già corretti a mano ma mai
  diventati una prova permanente (Ruota/Scala tratti G57/G58, giro di
  andata e ritorno del piano di innesco XML) — entrambi verificati con
  `--controprova`.
- 3 checkpoint di questo stesso blocco corretti per data mal scritta
  (rinominati con `git mv`, mai riscrivendo la storia; registrati in
  `SCUSATI` di `date-checkpoint.mjs`, che ora conta **9** voci).
- **Stato finale misurato, non dichiarato**: `giro-node.mjs` completo,
  41 comandi, **0 caduti**, **4284** asserzioni — numero confermato da
  un run pulito e propagato nei documenti tracciati.
  `numeri-nei-documenti.mjs` 43/0, `documenti-invecchiati.mjs` 15/0,
  `date-checkpoint.mjs` 10/0, `porte-banchi.mjs` 3/0 (182 banchi).

## Verifica prima del commit
Solo lettura in questa unità; nessun file toccato.

## Stato roadmap
Blocco chiuso su un punto stabile e misurato. Nessun candidato di
codice ad alto rendimento rimasto individuato con questo metodo in
quest'area; il prossimo blocco cambia bersaglio.

## Prossimi passi
- **Prossimo passo atomico**: con il metodo "bottoni/funzioni senza
  banco" esaurito per l'area 2D/export, il prossimo blocco dovrebbe
  guardare la scena 3D (`buildSim`/`renderSim`) e la timeline dello
  sparo con lo stesso approccio — cercare azioni utente (play/pausa/
  scrub, cambio qualità, cambio look) senza copertura browser, invece
  di continuare a scorrere `RICERCA_CONTINUA_GENESI.md` (già
  ampiamente esaurita in questo blocco) o gli export 2D (già coperti
  al 100%).
- Mandato del fondatore invariato: solo Genesi, massimo sforzo.

## Blocchi
Nessuno.
