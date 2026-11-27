# Checkpoint — Genesi: il lettore DXF esplode i blocchi inseriti

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit
Quello che contiene questo file (messaggio: «feat(genesi): il lettore DXF
esplode i blocchi inseriti…»). Il precedente, `598695f0` (gli archi), è
confermato dal giro `node` completo: 43 comandi a posto, 4357 asserzioni.

## Che cosa è stato fatto
- `apps/genesi/genesi-data.js`
  - `_dxfStruttura` mette da parte le DEFINIZIONI dei blocchi (sezione
    BLOCKS, fra BLOCK ed ENDBLK) in `st.blocchi[NOME]` = `{bx, by, esterno,
    entita}`. Nomi senza distinzione fra maiuscole e minuscole; di due
    definizioni omonime vale la prima; `esterno` = 70 con 4 o 8 (xref).
  - `dxfLeggi`: il ciclo sulle entità è diventato `leggi(lista, T, scala,
    catena)` e si richiama sui blocchi. Davanti a un INSERT:
    `mondo = inserimento + Rot · (Scala · (p − base) + passo di schiera)`,
    poi l'estrusione dell'INSERT, poi la trasformazione del blocco che lo
    contiene. Non si esplode (e resta fra le non lette come `INSERT`): blocco
    sconosciuto, scala nulla o illeggibile, blocco che richiama sé stesso,
    oltre `_DXF_PROFONDITA_BLOCCHI` = 8 livelli, oltre `_DXF_MAX_ESPANSIONI`
    = 20.000 copie. Un xref è `INSERT (riferimento esterno)`.
  - Attributi: l'ATTRIB visibile di un blocco esploso si conta come testo;
    quello invisibile no; quelli di un blocco non esploso restano con lui;
    l'ATTDEF dentro un blocco si conta solo se costante (70 = 2).
  - La freccia degli archi vale nel mondo: `_dxfLati(r, ampiezza, scala)`.
  - `esito.blocchiEspansi` conta gli INSERT del DISEGNO esplosi (non quelli
    annidati, non le copie di una schiera).
- `apps/genesi/genesi.html`: `_dxfBilancioHtml` dice «N blocchi inseriti
  sono stati esplosi: il loro contenuto è entrato dove il disegno li mette».
- Prove
  - `tests/campioni/dxf-da-cad/`: 40 campioni (11 nuovi, scritti da ezdxf:
    ruotato e scalato con punto base, specchiato, scale diverse, annidato,
    schiera, estrusione specchiata, riferimento esterno, con testo, R12,
    arco ingrandito, nome in minuscolo). Verità: `espanso()` in `genera.py`
    (ezdxf `recursive_decompose`), con la primitiva nuova `ellisse`.
  - `dxf-da-cad.mjs` 32 → 43; controprova 13 → 31 difetti, tutti distinti.
  - `run-kpi.mjs` 3249 → 3250 (i casi che un CAD sano non scrive), ognuno
    controprovato rimettendo il difetto su una copia: 9 su 9.
  - `browser/genesi-dxf-import.mjs` 25 → 32, controprova con 3 iniezioni.
- Numeri nei documenti: 3.750 prove senza rete; giro `node` 4369 su 43
  comandi (scritto per somma: 4357 + 1 + 11 — lo conferma il giro lanciato
  dopo questo commit).

## Che cosa NON è stato fatto, dichiarato
- I campioni vecchi non sono stati riscritti: ezdxf cambia contrassegni e
  date a ogni giro, quindi rigenerarli cambierebbe 29 file senza cambiarne
  il disegno. Sono entrati solo gli 11 nuovi e `verita.json`.
- La quota Z dentro i blocchi si ignora (lettore 2D), come per il resto.
- La pianta non distingue i tratti venuti da un blocco dagli altri.

## Stato roadmap
Chiusa `Genesi — DXF: i blocchi inseriti (INSERT)`. Aperte per Genesi:
`Genesi — DXF: ellissi e spline` (nuova), `F6b: l'INCLINAZIONE per foro`,
l'ombrello `il progetto FORO PER FORO`. In attesa del fondatore: decisione
33 (quale carica usano le previsioni), decisione 34 (decodificatore LAZ di
terzi), decisione 32 (aggancio al cantiere, rimandata).

## Prossimo passo atomico — DXF: l'ELLISSE (poi la spline)
1. In `dxfLeggi`, ramo nuovo `e.tipo==='ELLIPSE'`: centro 10/20, estremo del
   semiasse maggiore RELATIVO al centro 11/21, rapporto 40, parametri 41/42
   (radianti, antiorario; ellisse intera = 0 e 2π), estrusione 210..230 —
   ⚠️ l'ELLIPSE è scritta in coordinate MONDO, non nel sistema dell'oggetto:
   l'estrusione dà solo il verso del semiasse minore (minore = estrusione ×
   maggiore × rapporto). Punto: `c + M·cos t + m·sin t`.
2. I lati dalla freccia: il raggio di curvatura più piccolo è `b²/a`, il più
   grande `a²/b`; passo prudente = quello di un cerchio di raggio `a²/b`
   (la freccia è massima dove la curva è più piatta e i lati più lunghi) —
   da MISURARE in scratchpad prima di scriverlo, contro una curva fitta.
3. Verità: in `genera.py` la primitiva `ellisse` c'è già (`_ellisse`), e
   `dxf-da-cad.mjs` sa misurarci sopra (`distEllisse`). Campioni: ellisse
   intera, arco d'ellisse, molto schiacciata (rapporto 0,05), specchiata,
   dentro un blocco scalato. `curve_miste` oggi dichiara 1 spline e 1 punto:
   non cambia.
4. Poi la SPLINE, in un'unità sua: valutazione B-spline dai nodi (40), punti
   di controllo (10/20 ripetuti, come i vertici della LWPOLYLINE: servono in
   `_dxfStruttura`), pesi (41), grado (71); verità da
   `Spline.construction_tool().approximate()` di ezdxf — fitta, e misurata.

## Blocchi
Nessuno tecnico.
