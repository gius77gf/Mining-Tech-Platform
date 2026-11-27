# Checkpoint — 2026-09-14T23:43:19Z

## Tipo
misura (nessun commit di codice in questa unità)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
9ac0f14e

## Cosa è stato misurato

Prima di toccare il prossimo candidato B3 (`selRoccia`/`selEsplosivo`/
`selInnesco`, indicato come prossimo passo nel checkpoint precedente),
per regola di questa casa ("MISURARE PRIMA DI IRRIGIDIRE" / il costo si
misura, non si teme) ho mappato TUTTI i punti che il cambio di firma
toccherebbe, prima di scrivere una riga.

**Misura**: `grep -c "selRoccia(\|selEsplosivo(\|selInnesco("
apps/genesi/genesi.html` → **46** occorrenze, sparse su decine di
funzioni non correlate fra loro: il rendering 3D (`lithoTint`,
`rockMat`), il calcolo dei KPI, l'export XML del piano di innesco, i
testi dei toast, la scheda volata stampabile, `rockFactorA`,
`ppvSite`, `deriveCharge`, il pannello diagnostico, la lettura dei
parametri dalla query string di sviluppo.

Il confronto con le nove unità già completate di B3 (`pfNominale`,
`pieDev`, `reliefCls`, `computeEnergia2D`, `isoPasso`,
`scatterMs`+`computeRelief2D`, `_spazTipico`+`innTaglioOk`,
`activeProf`+`d2HitTest`+`d2HitTestPt`, `_snapXY`): la più grande
finora (`_snapXY`) aveva **10** punti di chiamata, tutti dentro lo
stesso sottosistema (gli event handler del mouse dell'editor 2D). Le
tre funzioni sotto esame ne hanno **46**, sparsi su TUTTA la pagina —
quasi cinque volte il record precedente, e senza la coerenza di
dominio che aveva reso `_snapXY` gestibile con una sola sostituzione
globale sicura.

In più, `grep -n "selRoccia\|selEsplosivo\|selInnesco"
apps/deepwork-id/tests/run-kpi.mjs` mostra **10 righe di prove
pinnate** in almeno **5 blocchi di test indipendenti** (G21/G22,
G28-ish, il test di `deriveCharge`/`ppvSite`, un secondo test su
`CODICE_G` — il sorgente concatenato di tutti gli `<script>` della
pagina, usato da più controlli indipendenti che quindi si romperebbero
insieme). Ognuna di queste andrebbe letta e corretta separatamente,
perché pinna il testo sorgente esatto di un CHIAMANTE (`rockFactorA`,
`deriveCharge`, `ppvSite`), non solo delle tre funzioni da spostare.

## Decisione

**B3 si mette in pausa qui, non si chiude**: restano 48 funzioni nel
bucket "1-2 variabili", ma le uniche rimaste sono proprio queste tre,
accoppiate per forza (leggono tutte lo stesso schema
`scegliDaCatalogo(CATALOGO, D2.campo, ripiego)`) e con un raggio
d'azione sproporzionato rispetto a ogni unità precedente. Non è un
rifiuto di farla: è la misura che dice che va spezzata diversamente da
come si sono spezzate le altre otto — probabilmente per CHIAMANTE
(prima `rockFactorA`+`selRoccia`, poi `deriveCharge`+`selEsplosivo`,
poi `ppvSite`, poi il resto dei 30+ punti sparsi) invece che per le tre
funzioni intere in un colpo solo. Quel lavoro di scomposizione va fatto
con calma all'inizio della prossima unità che riprende B3, non ora a
metà di un ciclo lungo.

Nel frattempo, per non fermarsi (regola del fondatore: mai uno stop
volontario), è stato lanciato un agente di ricerca in background sulla
roadmap per trovare il prossimo elemento non bloccato dal fondatore, e
si prosegue con quello mentre si aspetta il suo risultato.

## Prossimo passo atomico

1. **Immediato**: attendere il risultato dell'agente Explore lanciato
   per trovare il prossimo item di roadmap non bloccato, e procedere
   con quello.
2. **Per riprendere B3 più avanti**: spezzare `selRoccia`/
   `selEsplosivo`/`selInnesco` per CHIAMANTE, non per le tre funzioni
   intere. Prima unità candidata più piccola: `rockFactorA` da sola
   (compone `fattoreRoccia` già pura + `selRoccia`) — ha un solo punto
   di chiamata diretto della propria firma esterna, anche se al suo
   interno chiama `selRoccia()` che a sua volta ha molti altri
   chiamanti indipendenti. Va deciso PRIMA se estrarre `selRoccia`
   isolatamente (46 siti, rischioso) o lasciarla come legame di pagina
   e portare fuori solo `rockFactorA` con `D2` esplicito (chiamando
   `fattoreRoccia(selRoccia(), D2)` ancora dalla pagina, dentro un
   corpo che resta lì) — quest'ultima opzione NON è un vero trasloco
   di `selRoccia`, va giudicata con la stessa onestà con cui si è
   giudicato il resto di questo file.

Nessuno stop volontario: si prosegue subito col prossimo elemento di
roadmap, in attesa del risultato dell'agente di ricerca.
