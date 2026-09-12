# Checkpoint — 2026-09-12T12:27:23Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
638a4c55

## Cosa è stato completato (unità 124)

Terza e quarta funzione traslocate dalla fascia di mezzo di B3:
`esplCardHtml` e `innCardHtml`. Il censimento le marcava legate a dieci o
più variabili del modulo, ma questa volta la causa era una VESTE NUOVA
dello stesso falso positivo già chiuso su `_sitoParseCsv`/`_sentCell`:
non lettere dentro una regex, ma lettere dentro le STRINGHE della
funzione (`'ritardi '`, `"es-nome"`), spezzate dal tokenizzatore sui
trattini e sugli apici. Lette a mano sono pure: costruiscono solo HTML
dall'oggetto di catalogo che ricevono.

Traslocate in `genesi-data.js` accanto a `scegliDaCatalogo` (che produce
l'oggetto che entrambe consumano); 2 nuove prove in `run-kpi.mjs`
(comportamento — coi casi limite di densità/VOD/RWS/RBS assenti che non
devono inventare uno zero — e verifica "uscite dalla pagina").

**Trovato e corretto un effetto collaterale reale, non un semplice
pin stale**: il conto del "contagio" in
`docs/LA_STRUTTURA_DEL_CORE_SCRITTA_SEI_VOLTE.md` (quante classi del
foglio condiviso Genesi ha già nel suo markup) leggeva solo
`genesi.html`. Spostando le due funzioni il numero scendeva di 4 senza
che una sola classe sparisse dalla pagina RESA — solo il testo che la
dichiara si è spostato in un altro file. `numeri-nei-documenti.mjs` ora
legge anche `genesi-data.js` per quel conto specifico (non il resto del
file, per non allargare lo scope di altri controlli che devono restare
sulla sola pagina). Verificato che nessuna iniezione di controprova cita
le due funzioni (`iniezioni-fresche.mjs`, 559/559, invariato).

Effetti a cascata sui documenti, tutti verificati: fondo di
`genesi-data.js` 129→131; tabella del cantiere di Genesi 149→147
funzioni; scomposizione del codice condiviso 293/293→295/295,
`genesi-data.js` 129/129→131/131; totale prove locali 3.397→3.399
(`run-kpi` 2916→2918) in quattro documenti; giro completo
3.855→3.857 asserzioni.

Verificato con `giro-node.mjs` su worktree pulita: **40 comandi a posto,
0 caduti, exit 0**.

## Stato roadmap

Aggiunta nota datata 12/09 dentro l'entry B3 in
`vault/ROADMAP_SETTIMANA.md` (unità 124, terza e quarta della fascia).
Resta `[ ]`: restano 13 funzioni nel bucket 3-5 e 23 nel 6-10 (misurabili
con `genesi-estraibili.mjs --elenco`, ora che stampa anche quelle due
colonne).

## Blocchi
Nessuno.

## Prossimo passo atomico

Il giro del browser mirato lanciato dopo l'unità 123
(`--solo=unita-maiuscole,modali-dentro,pagine-vive,csv-dimostrazione,
disegni,contrasto`, log in `$SCRATCHPAD/giri/ultimo-log.txt`) era ancora
in corso alla scrittura di questo checkpoint: leggerlo con
`leggi-giro.mjs` quando finisce (attesta un commit precedente alle unità
121-124, quindi ogni KO va riverificato contro il codice attuale prima
di aprire un cantiere, come sempre). Poi continuare con la prossima
unità piccola: altre funzioni della fascia 3-5/6-10 di Genesi, o altre
voci `[ ]` della roadmap (B12, B4, B0-bis, B0, C2, E-serie, Q1). Mai
fermarsi.
