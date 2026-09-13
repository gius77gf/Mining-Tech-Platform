# Checkpoint — 2026-09-13T11:31:28Z

## Tipo
unit-complete

## App
Genesi

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`3aa0e2cd`

## Completato

Ripreso il filone "B3. Genesi continua a uscire dalla pagina" (roadmap),
dopo la pausa per il lavoro su richiesta diretta del fondatore (export
DXF G33, disegno di precisione G34/G34bis/G34ter). Estratta
`measureGeom2D` da `genesi.html` a `genesi-data.js` come `misuraGeom2D`:

- Stessa logica (burden minimo, interasse fra vicini di fila, estensione
  della pianta), firma a tre parametri (`holes, Sprog, Bprog`) invece di
  leggere `D2` a mano — la pagina resta un chiamante come un altro
  (`return misuraGeom2D(D2.holes, D2.S, D2.B);`).
- Portato con la funzione il commento storico sul TypeError del 09/08
  (`.toFixed` su un dato di progetto grezzo quando l'interasse manca) e
  la sua controprova strutturale (test "B0-nonies"), spostata a leggere
  `genesi-data.js` invece della pagina — e resa PIÙ severa: verifica ora
  che la funzione pura non legga `D2` per niente, non solo che lo legga
  "in un posto solo" (garanzia più forte del test originale).
- 3 nuove prove in `run-kpi.mjs`, verificate contro il difetto (rimesso
  il vecchio contratto `S:+Sm.toFixed(2)` senza il ripiego su `null`: la
  prova strutturale e due prove di comportamento cadono tutte e tre,
  poi ripristinato e verificato `diff` vuoto).
- Fondo di copertura di `genesi-data.js` alzato 142→143.

Effetto collaterale sul censimento `genesi-estraibili.mjs` (un falso
positivo del tokenizzatore, già noto da altre estrazioni: due variabili
LOCALI, `o` e `minx`, prese per variabili del modulo dall'euristica
sull'indentazione): il wrapper ridotto a una riga sposta il conteggio
dal bucket "3-5" al bucket "una o due" (17→16, 48→49), e poiché il
wrapper è ormai un legame di una riga sale anche il totale estraibile
(56→57 su 148).

Documenti corretti di conseguenza (misura, non stima): `DEVELOPMENT.md`,
`STATO_PRODOTTO.md`, `DECISIONI_WEEKEND.md`, `ROADMAP_SETTIMANA.md` —
3.416→3.419 prove senza rete, 306/306→307/307 funzioni condivise,
genesi-data.js 142/142→143/143, e l'asserzioni-totali-del-giro
3.874→3.877 (verificato in due passate, la prima con `numeri-nei-
documenti.mjs` ancora rosso sul numero, che escludeva il suo comando
dalla somma — stessa dinamica già vista nelle unità precedenti).

Verificato sulla **copia** (git worktree) di quello che si sta
committando, due volte: `giro-node.mjs` → **40 comandi a posto,
0 caduti**.

## Stato roadmap

Aggiunta una nuova voce in coda al filone B3 in
`vault/ROADMAP_SETTIMANA.md`, con lo stesso stile delle precedenti
(numeri prima/dopo, ragione del cambiamento).

## Blocchi e limiti noti

Blocco di sicurezza su geometria/flyrock/burden invariato: pura
riorganizzazione del codice, nessun numero calcolato diversamente.

Resta aperta la domanda posta al fondatore su "aspetto più
professionale in stile CAD" vs. "struttura identica al core" — nessuna
risposta ancora arrivata.

## Prossimo passo atomico

Il filone B3 resta aperto: la prossima fetta interessante sta nei
bucket "3-5" (ora 16 funzioni) e "6-10" (23 funzioni) del censimento
`genesi-estraibili.mjs --elenco`, scartando quelle marcate "ambiente"
(toccano DOM/THREE/canvas — restano in pagina per costruzione). Un
candidato già identificato e non ancora aperto: `scatterMs` (legge
`lo, e, data, D2`, chiama `computeMIC`) — da valutare con CAUTELA
perché `computeMIC` è vicino al dominio vibrazioni/sicurezza: leggere
il corpo con attenzione prima di toccarlo, e se tocca soglie di
sicurezza lasciarlo stare (il blocco vale anche per i traslochi, non
solo per le modifiche di calcolo).

In alternativa: attendere la risposta del fondatore sul terzo pezzo di
"tutte e tre" (aspetto CAD), o tornare al giro di ricerca continua
(prossima app in rotazione). Continuare senza fermarsi (regola del
fondatore).
