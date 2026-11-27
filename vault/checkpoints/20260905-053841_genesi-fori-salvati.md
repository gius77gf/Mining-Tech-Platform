# Checkpoint — 2026-09-05T05:38:41Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
22450f25 — Genesi: il progetto salvato porta i FORI — un foro tolto non ricompare, il ritardo a mano resta

## Completato
- `volSnapshot` scrive `holes` (id, mx, my, tMano); «Apri» li rimette con
  `foriDaDesign` (null → maglia rigenerata come prima; illeggibili contati nel
  toast; id mancanti assegnati DOPO quelli dichiarati, difetto misurato prima
  di scrivere) e ricalcola la sequenza.
- run-kpi +2 (2630/0); `genesi-documenti-che-escono` 83/0 con la sezione 6
  (salva → riapri) e due iniezioni; controprova 11/11 rimessi, 23 cadute.
- Giro `node` sulla copia verde, 3.542 asserzioni; documenti 3.111 prove,
  condivisi 214/214; roadmap: (4) ✅ nella voce GENESI↔CAMPO.

Il ciclo delle 03:47Z ha chiuso: Conti (b) TRN/CRO; il cantiere GENESI↔CAMPO
foro per foro in quattro pezzi (id stabile, Campo, accoppiamento, fori
salvati) con il difetto del ponte `fila_m/borraggio_prog_m/ritardo_ms`.

## Prossimo passo atomico
Rotazione: la passata in profondità è fatta su tutte le app e il ponte 3e
(Genesi→Sentinella via dati) è bloccato da §4/5b (Genesi fuori dal browser,
decisione del fondatore). Prossima unità a costo basso e valore vero:
**Sentinella letta da qualcuno** (la mappa dice «app che nessuno legge:
Sentinella»). Meccanismo, non nome: chi in Campo compone la consegna di turno
(`consegna_turno.txt`, sezione «SEGNALAZIONI DEL TURNO») potrebbe leggere da
Sentinella le volate del giorno con superamento (`conSoglia` decide il
verdetto; la collezione è `volate` + `monitoraggi` in `sentinella-data.js`).
Prima di scrivere: aprire `docs/MAPPA_ECOSISTEMA.md` §3e e la riga 32 della
tabella (Sentinella → Scudo «nessuno»), misurare con `grep -n "ponteScudo\|
sentinella" apps/campo/campo-data.js apps/scudo/scudo-data.js` che cosa
esiste già, e progettare in scratchpad la funzione pura
`superamentiDelGiorno(volate, monitoraggi, data)` in `shared/dw-ponti.js`
(serve a due app: Campo la legge, Sentinella la ri-esporta). Un'unità, poi
banco.

## Blocchi
Nessuno. Decisioni del fondatore aperte: 5b, 19-27, Q1, registro esplosivi,
TD24/IPA/split payment, registro dei terzi.
