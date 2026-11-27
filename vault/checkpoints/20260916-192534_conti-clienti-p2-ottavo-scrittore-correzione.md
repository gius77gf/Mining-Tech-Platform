# Checkpoint — 2026-09-16T19:25:34Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
83af1807

## Cosa è stato completato
Ottavo scrittore migrato al vocabolario condiviso `STATO_CELLA_*` di P2
(`docs/RICERCA_CONTINUA_ASSENZA.md` §4): `csvClienti` di Conti — **e la
correzione di un errore di ricerca ripetuto per tre unità di fila.**

Aprendo la domanda lasciata esplicitamente in sospeso dal checkpoint
precedente (per i quattro CSV con `stato` proprio, quel vocabolario è
ortogonale a "misurato/non misurato" o lo copre già?), la prima
verifica indipendente ha smentito la premessa stessa: `csvClienti` **non
ha mai avuto nessuna colonna `stato`** (header a dodici colonne:
`id;ragioneSociale;piva;sdi;indirizzo;sconto;fido;note;cap;comune;provincia;codiceFiscale`)
né nessun `cliente.stato` altrove nel modulo. `csvGare`, invece, la
collisione ce l'ha davvero (`titolo;base;scadenza;stato`,
`g.stato || "aperta"`, vocabolario aperta/vinta/persa). Le due erano
state scartate **insieme**, nella stessa frase, nell'unità del quinto
scrittore — probabilmente controllate in coppia senza il `grep` separato
che questo stesso documento chiede altrove — e l'errore è stato ripetuto
nelle unità del sesto e del settimo scrittore senza che nessuno lo
riaprisse.

`csvClienti` migrato come ottavo scrittore: `fido` è il campo per cui D1
misurava «assente (ok)» — non una riga persa, `parseClientiCsv` scarta
solo per `ragioneSociale` mancante, mai per `fido` — stesso binario di
Ricettori/Tarature: `STATO_CELLA_MISURATO` quando `numeroDichiarato(c.fido)`
è un numero (zero dichiarato compreso), `STATO_CELLA_MAI_MISURATO`
altrimenti. Tredicesima colonna, prima fetta: solo lo scrittore,
`parseClientiCsv` resta posizionale a dodici campi.

Toccati, oltre a `csvClienti`:
- `apps/deepwork-id/tests/run-kpi.mjs`: nuovo test dedicato (misurato,
  mai-misurato, zero dichiarato, riga che non si perde, compatibilità
  all'indietro) più la correzione di un'asserzione esistente che
  ancorava la fine dell'intestazione (`endsWith` → `includes`, perché ora
  la colonna finale è `stato`, non `codiceFiscale`).
- `shared/deepwork-id-client/dw-shell.js`: `CSV_TABELLE` per
  `conti.clienti` (guardia B8 — ottavo colpo consecutivo).

Controprova sul codice vero: invertita la condizione, confermato che il
test dedicato cade, ripristinato via `cp` + `diff`.

Doc-cascade: run-kpi 3104→3105, somma nove suite 3.598→3.599, giro-totale
4083→4084. **Corrette anche le righe delle unità precedenti** in
`docs/DEVELOPMENT.md`, `docs/STATO_PRODOTTO.md`, `docs/DECISIONI_WEEKEND.md`
e `vault/ROADMAP_SETTIMANA.md` che ripetevano l'affermazione sbagliata su
`csvClienti` — non lasciate lì con una nota di correzione a parte, ma
riscritte nella stessa frase, perché sono documenti "vivi" (non
append-only come i checkpoint o `docs/RICERCA_CONTINUA_*`). Giro isolato
su worktree pulita: **41/41 comandi, 0 caduti, 4084 asserzioni — predetto
e confermato ESATTO al primo tentativo** (nona unità di fila con
predizione esatta).

## Stato roadmap
**Otto scrittori su undici migrati.** Il vero limite naturale di P2 sul
perimetro D1 è ora **tre**, non quattro: `csvGare` di Conti, `csvSquadre`
di Campo, `csvAzioni` di Scudo — ciascuno verificato SINGOLARMENTE con un
`grep` separato (non per contagio), tutti e tre con una colonna `stato`
propria di significato diverso (esito della gara, stato operativo della
squadra, stato del workflow dell'azione correttiva).

La domanda aperta dal checkpoint precedente resta in piedi per questi
tre soli: il loro vocabolario di `stato` è ortogonale alla domanda
"questa cella è mai stata misurata?", o la copre già in qualche forma?
Non ancora misurato per nessuno dei tre.

## Prossimo passo atomico
Tre strade legittime per la prossima unità:
1. **Chiudere la domanda sui tre CSV rimasti** (`csvGare`, `csvSquadre`,
   `csvAzioni`): leggere per ciascuno la funzione che decide il loro
   `stato` proprio (`statoAzione` di Scudo già letta parzialmente in
   questa unità; mancano l'equivalente per gare e squadre) e il campo
   D1 misurava assente (`scadenza` per Azioni e Gare, `persone` per
   Squadre) per stabilire se serve un nome DIVERSO da `stato` (es.
   `statoCella`) per applicare comunque P2, o se è un cantiere fuori
   scope (decisione di naming, non di dato).
2. **Passata di profondità (binario 2) su Terra**: rileggere
   `apps/terra/terra-data.js` (4238 righe) e `apps/terra/index.html`
   (4896 righe) cercando una funzione consegnata ma superficiale, non
   ancora coperta con questo metodo in questa sessione.
3. Se nessuna delle due produce un'unità pulita in tempi ragionevoli,
   tornare alla lista "SE LA ROADMAP SEMBRA FINITA" di CLAUDE.md.
La scelta è aperta al prossimo ciclo.

## Blocchi
Nessuno.
