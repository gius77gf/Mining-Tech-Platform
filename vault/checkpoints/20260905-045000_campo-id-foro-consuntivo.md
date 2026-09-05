# Checkpoint — 2026-09-05T04:50:00Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
ca06223b — Campo: l'id del foro attraversa il piano e torna nel consuntivo — e il piano di Genesi entrava a metà

## Completato
Pezzo (2) del cantiere GENESI↔CAMPO:
- `PIANO_COLONNE.idForo` facoltativa, `parsePianoCsv` → `idForo`, salvato in
  `pianocarico`, mostrato nel `.meta` solo se c'è, rimandato in coda al
  consuntivo (`CONSUNTIVO_COLONNE` + `id_foro`); censimento dw-shell aggiornato.
- ⛔ Difetto del ponte trovato scrivendo la prova con l'intestazione vera di
  Genesi: Campo non riconosceva `fila_m`, `borraggio_prog_m`, `ritardo_ms`
  (fila, borraggio e ritardo entravano VUOTI + finestra «Non ho trovato la
  colonna di…» a ogni import). Corretto; prova derivata dal sorgente di Genesi.
- run-kpi +3 (2623/0); `campo-numeri-tranquilli` 94/0, controprova 41 cadute;
  scatto end-to-end a 390 (piano vero di Genesi → Campo) guardato: «id f1-1 ·
  x 0 m · prof. 12 m · borr. 3 m · rit. 0 ms». Giro `node` sulla copia verde,
  3.535 asserzioni; documenti 3.104 prove.

## Prossimo passo atomico
Pezzo (3), Genesi — l'accoppiamento per foro. In `apps/genesi/genesi-data.js`:
`_riconParseCampo` legge anche la colonna `id_foro` (→ `idForo`, "" se
assente); funzione pura nuova `confrontoPerForo(holes, righe, kgProgetto)` che
per ogni foro di `D2.holes` cerca la riga del consuntivo per `idForo` quando
TUTTE le righe ne hanno uno e i fori pure, altrimenti per numero di sequenza
(`seq+1`), DICHIARANDO `chiave: "id"|"numero"`; ritorna `{ righe:[{id, numero,
mx, my, prog, reale, scartoKg, scartoPct, stato}], senzaRiga:[…fori], orfane:[…
righe], chiave, misurabile }` con stato «da registrare» quando `reale` è
null (mai zero tranquillo). Nella pagina: sotto `_riconCampoHtml` una tabella
per foro con badge, e le due righe «N fori del progetto senza riga nel
consuntivo» / «N righe del consuntivo senza foro nel progetto» quando > 0.
Prove in run-kpi (accoppiamento per id con un foro tolto in mezzo; per numero
con la dichiarazione; orfane; nessuna carica reale → non misurabile). Banco:
`genesi-frasi-limite` o nuovo `genesi-confronto-fori` con un consuntivo che
porta gli id.

## Blocchi
Nessuno. Decisioni del fondatore aperte: 5b, 19-27, Q1, registro esplosivi,
TD24/IPA/split payment, registro dei terzi, «il progetto salvato porta i fori?».
