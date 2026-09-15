# Checkpoint — 2026-09-05T04:30:30Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
31f28ba9 — Genesi: l'id stabile del foro nasce col foro ed esce nel piano di carico

## Completato
Pezzo (1) del cantiere GENESI↔CAMPO «progettato contro reale, foro per foro»:
- `idForoMaglia(fila, colonna)` («f2-5») e `idForoNuovo(holes)` («m1…», primo
  numero libero) in `apps/genesi/genesi-data.js`; l'id nasce in `genMaglia2D`
  e nel tocco sulla tela; il piano di carico porta `id_foro` in coda; il
  `.volata.json` chiama i fori con lo stesso id quando la simulazione viene
  dal progetto 2D.
- run-kpi +2 (2620/0); `genesi-documenti-che-escono` 75/0 (preme «Simula»
  prima di esportare il JSON), due iniezioni nuove, controprova 9/9 → 19 cadute.
- Fondo di `genesi-data.js` a 80 (l'«alzalo» in coda alla riga rompeva la
  lettura della scomposizione). Giro `node` sulla copia: verde, 3.532 asserzioni.
- Roadmap: voce GENESI↔CAMPO nuova con (1) ✅ e (2)(3) aperti + riga d'indice;
  ricerca Genesi aggiornata; documenti 3.101 prove, 822/822, condivisi 210/210.
- Osservazione scritta in roadmap, NON toccata: il progetto salvato in Home non
  porta `D2.holes`, quindi fori a mano e ritardi a mano non sopravvivono a
  salva→riapri. Scelta di prodotto da decidere.

## Prossimo passo atomico
Pezzo (2), Campo: in `apps/campo/campo-data.js` aggiungere `id: ["id_foro",
"id"]` a `PIANO_COLONNE` come colonna FACOLTATIVA (non deve finire in
`mancanti`, se no ogni file vecchio apre la finestra «Non ho trovato la colonna
di: id»); `parsePianoCsv` restituisce `id` (stringa, "" se assente);
la pagina salva `idForo` in `pianocarico` (riga `db.aggiungi("pianocarico"`,
punto di scrittura 18) e lo mostra nel `.meta` della riga solo se c'è;
`CONSUNTIVO_COLONNE` + `id_foro` in coda e `pianoConsuntivoCsv` lo scrive;
censimento `campo.pianoConsuntivo` in `shared/deepwork-id-client/dw-shell.js`
(col + `;id_foro`) e `campo.piano` (col + `;id`); banco
`campo-numeri-tranquilli` riga «l'intestazione porta i nove nomi» → dieci;
prove in run-kpi (piano con e senza colonna id; consuntivo che la rimanda;
file vecchio senza avvisi su `mancanti`). Poi (3) in Genesi.

## Blocchi
Nessuno. Decisioni del fondatore ancora aperte: 5b, 19-27, Q1, registro
esplosivi, TD24/IPA/split payment, registro dei terzi, e ora anche «il
progetto salvato porta i fori?».
