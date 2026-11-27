# Checkpoint — Genesi: gli ultimi comandi del Progetto 2D andavano da bordo a bordo

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit
Quello che contiene questo file («fix(genesi): gli ultimi comandi del
Progetto 2D stanno nella colonna…»). Il precedente, `c0b9b973` (i CSV letti
da un altro programma, decisione 36 — solo documenti), è confermato dal giro
`node` completo: 47 comandi a posto, 4522 asserzioni, uscita 0.

## Che cosa è stato fatto
- Passata sugli scatti del Progetto 2D coi valori per foro accesi (13 scatti
  a 430 e 320 px, guardati uno per uno). Sul contenuto: i numeri seguono i
  fori (esplosivo totale 638 kg, «foro tipo» accanto a gittata e X50, «5 con
  valori loro» nel titolo della tabella). Sulla forma: UN difetto visibile,
  in fondo alla schermata.
- I due scatti A/B col confronto e i quattro comandi sotto (riconciliazione,
  signature-hole, legge di sito, Sentinella) erano figli diretti di
  `#scr-design` (colonna flessibile): margini 0 e 0 a ogni larghezza, e a
  1280 px bottoni larghi 1280 px sotto una colonna di 560. E a 320 px
  «Confronta spalla (burden) per lo stesso obiettivo» stava a 4 px dai bordi.
- Pagina: contenitore `#d2-altri` nella stessa colonna (560 px, margine 14),
  riga `.d2-ab` centrata che va a capo, tetto ai comandi centrati
  (`#scr-design>.btn`). Nessuna funzione toccata.
- Banco nuovo `apps/deepwork-id/tests/browser/genesi-colonna-progetto.mjs`
  (porta 8701): a 320, 430, 768 e 1280 px, 71 comandi misurati, nessuno a
  meno di 12 px dai bordi né più largo di 560. 15 controlli; controprova: 3
  difetti rimessi su 3, cadono 8. Registrato in `tutti.mjs`.
- Rigirati i banchi che premono quei comandi: `genesi-foro-per-foro` e
  `genesi-foglio-in-cava` (esito nel messaggio del commit).
- Numeri: 465 esecuzioni nel browser da 214 file di banco; giro `node` 4523
  (per somma: 4522 + 1 file contato da `import-esistenti` — da confermare).

## Lezioni di questa unità
- `fuori-schermo` chiede «esce dallo schermo?»: un comando largo ESATTAMENTE
  quanto lo schermo non esce, e passa. La seconda domanda è «tocca il
  bordo?» — ed è quella che ha trovato anche il caso a 320 px che lo scatto
  a 430 non mostrava.
- La mia prima misura sottraeva il padding dell'elemento e diceva «sx 9» per
  un bottone col bordo a 0: il righello misurava il testo, non il bottone.

## Stato roadmap
Chiusa «gli ultimi comandi del Progetto 2D andavano da bordo a bordo».
Aperte e ferme: «Genesi → Campo — il piano di carico CSV non protegge l'id
del foro» (fuori mandato), «il piede che esce dalla faccia» (decisione 35).

## Prossimo passo atomico
**I comandi del Progetto 2D sono alti quanto un dito?** (misurato di
passaggio: i `.btn.sm` in fondo sono 26-27 px, gli altri `.btn` ~32 px.)
1. Misura in scratchpad, stessa forma di `scatti/domanda.mjs`: per ogni
   comando visibile di `#scr-design` a 430 e 320 px, altezza e larghezza del
   bersaglio VERO (l'elemento, o l'etichetta che lo avvolge) — quanti sotto
   44×44, raggruppati per classe. Leggere prima `promesse-tocco.mjs` e
   `dwg-tab-min-tocco.mjs` per come il resto della casa misura il tocco, e
   cercare in `shared/deepwork-style.css` come il core porta i suoi bottoni
   a 44 px (la struttura si copia dal core, non si inventa).
2. ⚠️ Prima di alzare tutto: guardare lo scatto. Dodici bottoni alti 44 px
   in fila allungano la pagina di ~150 px; la via del core può essere
   un'area di tocco più alta del disegno (padding/min-height) — si misura
   che cosa fa il core e si copia quello.
3. Correzione nella pagina di Genesi, banco che lo tiene chiuso (nello
   stesso `genesi-colonna-progetto.mjs`: una domanda in più, non un banco in
   più), scatti a 430 e 320 guardati.

## Blocchi (del fondatore)
Decisioni 28, 33 (⚠ quale foro usa la gittata), 34 (lettore LAZ), 35 (spalla
al piede), 36 (accenti nei CSV: prima la prova con Excel); 32 rimandata.
