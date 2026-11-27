# Checkpoint — 2026-09-12T11:06:36Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
d62289c3

## Cosa è stato completato (unità 121)

Continuando il cantiere B3 (Genesi fuori dal browser, la parte che vive in
`genesi.html`): la roadmap indicava come prossimo passo la "fetta di
mezzo" del censimento (funzioni che leggono da 3 a 10 variabili del
modulo), ma `genesi-estraibili.mjs --elenco` non le elencava per nome —
solo i totali. Aggiunta la stampa delle due colonne mancanti (3-5, 6-10),
nello stesso stile delle altre due già presenti.

Aperta a mano la prima candidata della fascia 3-5 (`_sitoParseCsv`, la
più grossa): il censimento la marcava legata a quattro variabili del
modulo ("n, t, d, g"). Letta a mano, la funzione non legge nessuno stato:
prende `testo`, chiama `leggiCsv` di `shared/`, torna righe pulite — le
lettere che il censimento leggeva sono un falso positivo del suo
tokenizzatore, che scansiona il testo grezzo della funzione senza
mascherare le regex letterali al suo interno (`/\r?\n/`, `/[;\t]|,(?=\s*
[^\d\s])/`) né distinguere variabili locali di ALTRE funzioni della
pagina dichiarate a poca indentazione da vere variabili di modulo — un
limite già dichiarato e accettato dallo strumento stesso ("sbaglia nel
verso prudente").

Trasloco in `apps/genesi/genesi-data.js`, parola per parola, nessun
cambio di firma (era già `(testo) => risultato`, senza stato condiviso).
Nella pagina resta solo l'import e il punto di chiamata
(`sitoImportaCsv`). Due nuove prove in `run-kpi.mjs`: comportamento
(intestazione riconosciuta, TAB, l'ambiguità della virgola italiana
sempre rifiutata su dati numerici, BOM, casi vuoti) e la verifica
"uscita dalla pagina, non copiata" (nessuna seconda definizione locale,
la pagina la importa da `genesi-data.js`).

Effetti a cascata, tutti verificati e corretti (la cascata era già
documentata nei commenti di `copertura-funzioni.mjs` — "il fondo va
alzato SUBITO, se no... `numeri-nei-documenti` smette di leggerla"):
- `copertura-funzioni.mjs`: fondo di `genesi-data.js` 127→128;
- `docs/DEVELOPMENT.md`: tabella del cantiere di Genesi 151→150
  funzioni, bucket "da tre a cinque" 20→19; scomposizione del codice
  condiviso 291/291→292/292, `genesi-data.js` 127/127→128/128; totale
  giro completo 3.852→3.854;
- `docs/STATO_PRODOTTO.md`, `docs/DECISIONI_WEEKEND.md`,
  `vault/ROADMAP_SETTIMANA.md`: totale prove locali 3.394→3.396
  (`run-kpi` 2913→2915);
- `docs/DEVELOPMENT.md`, `docs/STATO_PRODOTTO.md`: giro completo
  3.852/3.811→3.854 asserzioni (misurato, non ricopiato).

Verificato con `giro-node.mjs` su worktree pulita, tre volte (una per
ogni tornata di correzioni a cascata): l'ultima dà **40 comandi a posto,
0 caduti, exit 0**, addendi e giro completo verificati dai due documenti
che li dichiarano.

## Stato roadmap

Aggiunta una nota datata 12/09 dentro l'entry B3 (Genesi continua a
uscire dalla pagina) in `vault/ROADMAP_SETTIMANA.md`, senza chiuderla:
resta `[ ]` perché il cantiere non è finito (150 funzioni nella pagina,
55 ancora "il numero che conta", 95 sono decisione di architettura).

## Blocchi
Nessuno.

## Prossimo passo atomico

Il giro del browser lanciato sul commit `a820c6d2` (unità 118) è ancora
in corso alla scrittura di questo checkpoint (fase `fuori-schermo`, dopo
aver finito `contrasto`): leggerlo con
`apps/deepwork-id/tests/browser/leggi-giro.mjs` quando finisce, e
valutare se serve un giro nuovo sul commit corrente (`d62289c3`) — questo
commit tocca `apps/genesi/genesi.html` e `apps/genesi/genesi-data.js`
(pagine/codice, non solo prosa), quindi la regola di questo repository
("le iniezioni/i giri riguardano codice, non prosa") dice che SERVE un
giro nuovo prima di considerare il lavoro sul browser verificato,
almeno mirato a Genesi (`--solo=` con i banchi che aprono genesi:
`pagine-vive`, `csv-dimostrazione`, `disegni`, `contrasto`).
Dopo di che: continuare con la prossima unità piccola. Candidati aperti
nella roadmap: altre funzioni della fascia 3-5/6-10 di Genesi (ora
elencabili con `genesi-estraibili.mjs --elenco`), oppure altre voci
`[ ]` della roadmap (B12, B4, B0-bis, B0, C2, E-serie, Q1). Mai fermarsi:
se la roadmap sembra esaurita, si prosegue con seconde iterazioni,
ricerca a rotazione o revisione qualità, come da procedura.
