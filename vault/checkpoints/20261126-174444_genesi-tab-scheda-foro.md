# Checkpoint — 2026-11-26T17:44:44Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit
quello che contiene questo file (il precedente è 780a2d35, F3)

## Completato — Genesi: il tasto Tab perdeva il campo successivo nella scheda del foro
- **Misurato con la tastiera vera** preparando F4: scritto un valore e premuto
  Tab, il `change` ridisegnava la scheda (`innerHTML`) prima che il fuoco
  arrivasse al campo dopo → fuoco su BODY, numero successivo perso. Da sempre
  per x / spalla / ritardo; anche per i tre campi di F3.
- **Correzione**: `renderInspectorDopo()` in `genesi.html` — conti e tela
  subito, la scheda un istante dopo (`setTimeout 0`), e ridà il fuoco al campo
  con lo stesso id. Usata dai sette gestori `change` della scheda.
- **Prova**: `browser/genesi-foro-per-foro.mjs` 69 → 72, coi tasti premuti
  davvero; controprova 16 iniezioni su 16 (letto «BODY» col difetto rimesso).
  Riancorate due iniezioni di `genesi-input-relativo.mjs` (trovate da
  `iniezioni-fresche` prima del commit: 757 su 757).
- Giro node su 780a2d35: 43/43, **4339** — confermato; corretto il «4336»
  rimasto in `docs/STATO_PRODOTTO.md`.
- Funzioni nella pagina 141 → 142 (tabella del cantiere 23/38/17/19/45, 46 su 142).

## Stato roadmap
F1 ✅ · F2 ✅ · F3 ✅ · F4–F6 aperte. Decisione 33 in attesa del fondatore.

## Prossimo passo atomico — F4, la tabella dei fori
Come nel checkpoint precedente (`…_genesi-F3-comando-valori-per-foro.md`), con
tre precisazioni nate da questa unità:
1. modello di struttura: la tabella del core è `.tbl` > `.thead` (griglia,
   maiuscoletto 9px) > `.trow` con `.tnum` e `.cinput` — copiare QUELLA
   struttura con classi di Genesi, unità dentro `<u class="uni">`;
2. sezione richiudibile col modello `.dc-sec` / `.dc-sec-h` che Genesi ha già
   (chiusa alla nascita), in un `<div id="d2-tabella">` dopo `#d2-insp`;
3. ⛔ il fuoco: la tabella NON si ridisegna dentro il `change` — stessa cura di
   `renderInspectorDopo` (o aggiornare la sola riga), e la prova si fa coi
   tasti (Tab fra le celle), non con `dispatchEvent`.
Funzione pura nuova nel modulo: `tabellaFori(holes, progetto, ordine)` → righe
`{i, n, id, x, spalla, tDet, aMano, kg, prof, stem, propri}` ordinate (nulli in
fondo, ordinamento stabile, l'ordine è della VISTA). Portare fuori da
`valoriForoCollega` la funzione che applica un valore e dice la frase, e usarla
in scheda e tabella.
Candidato estetico visto negli scatti (non fatto): i campi della scheda del
foro sono campi bianchi del browser, quelli dei parametri (`.dc-f input`) sono
scuri e alti 40 px — allinearli è una unità a sé, col banco del contrasto.

## Blocchi
Nessuno.
