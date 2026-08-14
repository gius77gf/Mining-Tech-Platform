# Checkpoint — 2026-08-09T16:42:42Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`6188cdf`

## Task completato

**La MIC che non si può contare adesso dice «non calcolabile» — e la misura che
conta non era quella da cui il cantiere era partito.**

| | |
|---|---|
| il difetto di partenza (MIC 60 invece di 720) | **7,3×** |
| un `null` **non letto** dai lettori | **199×** (0,12 contro 23,95 mm/s) |
| lettori sistemati | **7**, aperti premendo i bottoni |
| `run-kpi` | 1984 → **1993** |

## Le tre cose imparate

1. ⛔ **METÀ DEL LAVORO STA NEI LETTORI, E LA MISURA LO DICE.** Far rispondere
   `null` al modulo è la parte facile. Se poi la pagina disegna lo stesso un
   numero, il difetto non è chiuso: è **spostato e peggiorato**. Il conto:
   il difetto di partenza valeva 7,3×, un `null` non letto ne vale **199**, e
   l'airblast scende da 135,4 a 104,5 dB(L). È la **regola 20** — una bandiera
   che non legge nessuno non protegge niente — e con il flag importato e non
   letto `run-stile` cade da 318 a 316.
2. ⛔ **`Number.isFinite` NON BASTA A DIRE «C'È UN NUMERO»**, e le due stesure
   bocciate in scratchpad valgono più del codice scritto: `if(!H.length)` lascia
   in piedi il **secondo** numero tranquillo — quello nel ramo dei fori
   **pieni**, dove `n * null` fa **0** — e `Number.isFinite(+kg)` lo lascia
   passare perché **`+null` fa 0**, che è finito. Il `null` va **nominato per
   nome**, come fanno già `esitoPpv` e `_sentNum`.
   ⚠️ E uno zero **misurato** resta `0`: è un fatto, non un'assenza. Le due cose
   si scrivono uguali e non lo sono.
3. ⛔ **UN'INIEZIONE CHE CITA CINQUE RIGHE CONTIGUE SCADE NELLO STESSO COMMIT
   CHE MIGLIORA IL CODICE.** `genesi-documenti-che-escono` citava cinque righe
   del CSV, e fra quelle è entrata la cella vuota del MIC con la sua ragione
   accanto: `iniezioni-fresche` è passata a **306 su 307** nel commit che
   costruiva la difesa. Portata a **tre** righe: stesso difetto rimesso, tre
   appigli invece di cinque. Adesso **307/307**.

## Verifiche
- `giro-node` **34 comandi a posto, 0 caduti** sulla copia del committato, e le
  asserzioni del giro salgono **2757 → 2766**
- contratto **rimisurato da me**, non riferito: nessun foro → `null`; `kg`
  illeggibile → `null`; `kg` = 0 misurato → **0**; caso sano 12×60 → **720**,
  PPV **23,95 mm/s**, invariato alla cifra
- `run-kpi` 1993/0 · `run-stile` **318/0** · `sintassi-pagine` 34/0 ·
  `copertura` 11 soggetti a posto, `genesi-data` **44/44**
- sei controprove del cantiere, ripristino **da copia** con `diff -q` pulito
- ⛔ **nessuna soglia toccata**: 133 dB(L), curve USBM/DIN, K e β dove stavano

## Ancora aperto, dichiarato
⏱️ **`k.qtot` porta lo stesso zero**: col `kg` illeggibile la scheda CSV scrive
«Carica totale (kg);0». Alimenta **costi, margine e €/m³**, quindi è un cantiere
suo e non si chiude di straforo dentro questo.

## Il giro del browser
Vivo dalle **13:03:34Z**, oltre **3h30**, **150 passate su 161**, con un figlio
il cui tempo di CPU sale. ⚠️ Attesta `c6694e7`: non contiene né `--modali` né
`--forzate` né i banchi nati oggi.

## Cantieri paralleli aperti
Due: **contrasto delle finestre a 390 e 320 px** (ha già registrato le sue
passate in `tutti.mjs`: i banchi salgono da 167 a **173**, e per questo i quattro
documenti sorvegliati **non** sono stati aggiornati su quel numero — si aggiorna
quando quel cantiere chiude) e **Scudo** (il banco nuovo
`tendine-nelle-finestre.mjs`, ancora non registrato, più `#vf-ente`).

## Prossimo passo atomico
1. Raccogliere i due cantieri, **rimisurare**, registrare il banco di Scudo in
   `tutti.mjs` e portare i documenti al conto dei banchi vero.
2. Leggere il giro quando finisce: `leggi-giro.mjs`, ordine **età → righe «non
   ho guardato» → KO veri**.

## Blocchi
In attesa del fondatore: **`#vf-ente`** (art. 71 c.11 — la voce di legge);
**quali** delle 47 mancanze confermate diventino lavoro; e se
`disponibilitaTurno` debba restare **100%** su un turno chiuso senza fermi.
