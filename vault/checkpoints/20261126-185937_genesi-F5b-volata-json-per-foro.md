# Checkpoint — 2026-11-26T18:59:37Z — F5b, il .volata.json foro per foro

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit
quello che contiene questo file (il precedente è 455810f7, F5a; giro node su
455810f7 confermato: 43/43, 4342)

## Completato — Genesi, foro per foro, F5b
- **Misurato prima nel browser** (2D → «simula» → «Esporta»): un foro da
  35 kg / 8,5 m e uno lasciato scarico uscivano nel `.volata.json` con 58 kg
  e 10 m — `kg:P.kg` per tutti.
- **Correzione** (`apps/genesi/genesi.html`, nessuna funzione nuova):
  `simulaVolata2D` fotografa in `P.holes[].suoi` i valori propri di ogni foro
  (`valoriPropriDiForo`); `buildSim` li porta in `SIM.fori[].suoi`; l'export
  scrive `kg`, `prof` e — solo se suo — `borraggio_m` da lì. Senza valori per
  foro il file esce identico chiave per chiave.
- ⛔ **La simulazione NON li usa** (`SIM.fori[].kg` resta `P.kg`): è la
  decisione 33. Una prova lo sorveglia (iniezione del difetto opposto: la
  scena che prende la carica del foro → KO).
- **La scena lo dichiara**: riga del pannello Parametri (`#sim-foro-tipo`) e —
  perché quel pannello nasce chiuso, riquadro 0×0 misurato nello scatto —
  l'etichetta `#tfori` «◆ foro tipo» accanto ai comandi dello sparo, che
  toccata dice la frase intera.
- **Prove**: banco `browser/genesi-foro-per-foro.mjs` 110 → 121, controprova
  30 iniezioni su 30. Nessuna prova `node` nuova: i numeri del giro restano
  3.745 / 4342.
- `docs/DECISIONI_WEEKEND.md`, decisione 33: aggiornato «Come stiamo» (diceva
  che il comando non esisteva ancora).

## Stato roadmap
F1 ✅ · F2 ✅ · F3 ✅ · F4 ✅ · F5 ✅ (i tre file) · F6 aperta. Decisione 33 in
attesa del fondatore: simulazione e frammentazione sul foro tipo, dichiarato.

## Prossimo passo atomico — F6, diametro e inclinazione per foro: PRIMA IL CENSIMENTO
Non scrivere codice prima di aver contato. Comandi:
`grep -n "D2\.diam" apps/genesi/genesi.html | wc -l` e lo stesso per
`D2\.incl`; e nel modulo `grep -n "\bdiam\b\|\bincl\b" apps/genesi/genesi-data.js`.
Per ogni lettura dire se è (a) un CONTO per foro (capacità del foro, carica
lineare, consumo specifico del foro, piano di carico, file che escono) —
candidato a `valoreDiForo`; (b) una PREVISIONE sulla volata (frammentazione,
vibrazioni, flyrock, simulazione) — resta sul foro tipo e lo dichiara;
(c) GEOMETRIA 3D (disegno del foro). Scrivere il censimento in
`docs/GENESI_ROADMAP_COMPETITOR.md` sotto la tabella delle fette, con i
numeri. Poi la prima fetta di F6 è la più piccola che abbia senso da sola:
`_REGOLE_PER_FORO` + `LIMITI_PER_FORO` per `diam` (limiti del campo di
progetto: leggere `applyDesign`), la colonna nella tabella dei fori e nel
piano di carico — con la prova di neutralità. L'inclinazione dopo.
Alternativa se il censimento dice che F6 è grossa: il candidato estetico
rimasto (i campi bianchi della scheda del foro → stile dei campi della
tabella) è un'unità piccola e sicura.

## Blocchi
Nessuno. In attesa del fondatore: decisione 33; canarino su main (serve una PR).
