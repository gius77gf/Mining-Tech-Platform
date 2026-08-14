# Checkpoint — nessuna regola di stile ha più solo la controprova finta

- **Tipo**: unità (controprove sui file veri per le regole 9 e 10)
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `eb41d87`

## Cosa chiude

Il giro cominciato stamattina con la scoperta sulla regola 1. Adesso **tutte**
le regole hanno una controprova che rimette il difetto **nei file veri**, e non
solo su tre righe inventate: 1, 5, 6, 7, 9, 10, 11, 12, 13, 14.

- **regola 9** (la guardia degli interi riscritta in casa): si rimette il codice
  vero che stava in Terra, quello per cui «1.500» diventava «500» — 10
  superfici, 61 punti.
- **regola 10** (stato vuoto col solo titolo): 10 superfici, 61 punti.

## Quella che poteva andare male

La 10 cerca la spiegazione in una **finestra di 500 caratteri**, e il difetto
viene iniettato dove il codice è più fitto. Se lì accanto fosse capitato
l'`empty-sub` di un altro stato vuoto, la regola avrebbe risposto «a posto» —
un falso negativo dovuto alla finestra, non al difetto. Su 61 punti non è
successo, e adesso è una cosa che si sa invece di una che si spera.

## La verifica

Regola 9 resa cieca apposta: **61 iniezioni su 61 non viste**, su dieci
superfici. Ripristinata subito dopo. Il difetto iniettato **dopo** il commit,
come dice la regola che mi ero scritto.

## Stato

- **177** prove di stile (149 stamattina), **433** KPI, 43 helper, 23
  pointcloud, 9 manifest, 7 demo — 692 prove `node`, tutte verdi
- 15 banchi del browser verdi (giro completo di stanotte)

## Prossimo passo atomico

Le regole sono coperte; il posto dove la stessa domanda non è ancora stata
fatta sono i **banchi del browser**. `note-stato.mjs`, `fuori-schermo.mjs`,
`interi-superfici.mjs` hanno la controprova; `contrasto.mjs` **no** — misura
3322 testi e dice «0 sotto soglia», ma non c'è niente che dimostri che saprebbe
vederne uno. È lo stesso identico rischio della regola 1, sul banco che fa il
maggior numero di misure.

## Bloccanti

- Nessuno.
