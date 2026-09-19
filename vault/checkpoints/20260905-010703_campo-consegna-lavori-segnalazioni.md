# Checkpoint — 2026-09-05T01:07Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
149b8b35

## Completato
- Ricerca Campo sul passaggio di consegne (metà sul mondo + delta dal
  meccanismo, commit d35278a9) e i due candidati fatti: la consegna di turno
  porta «LAVORI NON CONCLUSI» (`lavoriNonConclusi`, `ETICHETTA_STATO_ATTIVITA`)
  e «SEGNALAZIONI DEL TURNO» (`testoSegnalazioniTurno`, la frase dello
  schermo). run-kpi 2610; banco `campo-foglio-turno --caso=consegna` 19/0 con
  la controprova (6 su 19); giro node sulla copia 38/0.
- Documenti: prove 3.091, asserzioni 3.521, copertura 819/819.

## Prossimo passo atomico
Tutte e sei le app hanno avuto stanotte una ricerca o un'unità di prodotto
(Flotta e Sentinella raccolte dalle patch; Terra tre unità; Conti il taglio;
Scudo tre; Campo due). Il prossimo tema per rotazione è Genesi: aprire
`docs/RICERCA_CONTINUA_GENESI.md`, rileggere i candidati (a) «id stabile del
foro» e (b) «registro progettato contro perforato» — che vanno fatti INSIEME —
e prima di tutto misurare dal meccanismo come un foro si identifica oggi
(`grep -n "fori\[\|f.id\|idx" apps/genesi/genesi-data.js` e la pagina) e che
cosa Campo riceve dal ponte Genesi→Campo. Se il tema è troppo grande per un
blocco, in alternativa: la ricerca a rotazione su Conti (tema non fatto: la
riconciliazione bancaria del CSV della banca con le fatture — aprire
`leggiCsv`/`parseMovimentiCsv` prima di proporre).

## Blocchi
Nessuno tecnico. Decisioni del fondatore aperte: 5b, 19-27, Q1; registro
esplosivi; TD24 / IPA / split payment; registro dei terzi.
