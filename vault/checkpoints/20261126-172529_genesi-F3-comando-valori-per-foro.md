# Checkpoint — 2026-11-26T17:25:29Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit
quello che contiene questo file (il precedente è df3585ba, F2 chiusa)

## Completato — Genesi, foro per foro, F3: il comando per l'utente
- **Modulo** (`apps/genesi/genesi-data.js`, 188 → 193 esportazioni, tutte provate e
  usate dalla pagina): `LIMITI_PER_FORO`, `foriConValoreProprio`,
  `foriSenzaValoriPropri`, `valoreComuneDiFori`, `contaValoriPropri`.
  Regole: in alto i limiti del progetto (200 kg, 18 m, 6 m), in basso più
  larghi (0 kg = foro scarico, 0 m = non borrato); un valore uguale al progetto
  NON resta proprio; il borraggio mai più lungo del foro, guardato su ogni foro
  scelto col valore che avrebbe DOPO; tutto o niente; array e fori ricevuti non
  si toccano.
- **Pagina** (`genesi.html`, 139 → 141 funzioni): `valoriForoHtml` /
  `valoriForoCollega` — tre campi nella scheda del foro; con fori scelti con
  Maiusc+clic la scheda è quella della selezione (`renderInspector`, chiamato
  anche da `syncSelMultiUI`). Lettura con `gEsito` + `messaggioNumero` (niente
  type=number); `d2PushUndo` prima di scrivere; fori bloccati rispettati.
  Rombo sulla pianta per il foro con valori suoi. «foro tipo» accanto alla X50
  (`#x50-foro-tipo`) finché la frammentazione non legge le cariche per foro.
  A 320 px etichetta+campo+unità vanno a capo insieme (`_DI_GRUPPO`), anche
  per x e spalla.
- **Prove**: run-kpi 3241 → 3244 (tre prove F3); banco
  `browser/genesi-foro-per-foro.mjs` 42 → 69, controprova 15 iniezioni su 15
  (cadono in 34). Banchi vicini rilanciati e verdi: input-relativo,
  selezione-multipla, d2-undo, guida-allineamento, rifletti-selezione,
  drag-annulla, maglia-assente, csv-fori-disegnati. `iniezioni-fresche` 756/756.
- **Trovato dal prototipo in scratchpad, prima di scrivere nel modulo**: togliere
  il SOLO borraggio proprio a un foro di 2 m lo lasciava coi 2,2 m del progetto
  → «torna ai valori del progetto» è un'operazione sola, non tre.
- Giro node del commit precedente (df3585ba) confermato: 43/43, 4336.

## Numeri scritti nei documenti
3.742 prove senza rete (run-kpi 3244); giro node 4339 su 43 comandi (scritto
per somma: +3; da confermare col giro sul commit); condivisi 366/366,
`genesi-data.js` 193/193; funzioni nella pagina 141 (tabella del cantiere
23/37/17/19/45).

## Stato roadmap
F1 ✅ · F2 ✅ (conti) · F3 ✅ · F4–F6 aperte. Decisione 33 (quale carica usano
frammentazione e simulazione) in attesa del fondatore: il prodotto oggi usa il
foro tipo e lo DICE.

## Prossimo passo atomico — F4, la tabella dei fori
Una riga per foro (n°, id, x, spalla, ritardo, carica, profondità, borraggio),
dentro la schermata 2D sotto la scheda del foro, richiudibile. Celle di
carica/profondità/borraggio modificabili con le STESSE funzioni di F3
(`foriConValoreProprio(D2.holes,[i],campo,valore,D2)` + le frasi di
`valoriForoCollega`: se serve, portare fuori da `valoriForoCollega` la
funzione che applica e dice, e usarla in tutti e due i posti — non una copia).
Ordinabile per colonna (l'ordine è della VISTA, non di `D2.holes`). I valori
propri segnati col rombo ◆ come nella scheda. Riga cliccata = foro selezionato
sulla pianta (`D2.sel`). Struttura identica a una tabella del core; a 320 px
la tabella scorre DENTRO il suo riquadro (`overflow-x:auto` sul contenitore),
la pagina no — misurare `scrollWidth` del body. Banco: sezione 9 in
`genesi-foro-per-foro.mjs` con controprova; scatti guardati a 430 e 320 px.

## Blocchi
Nessuno. In attesa del fondatore, senza fermare il lavoro: decisione 33;
riattivare il canarino su main (serve una PR, non autorizzata).
