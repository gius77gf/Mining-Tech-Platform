# Checkpoint — Genesi: il lettore DXF legge le ellissi

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit
Quello che contiene questo file («feat(genesi): il lettore DXF legge le
ellissi…»). Prima di lui: `9b2ee1ad` (blocchi inseriti) e `86120570` (la
correzione delle sue prove e del totale del giro).

## Che cosa è successo sul commit dei blocchi, e la lezione
Il giro completo su `9b2ee1ad` ha dato 42 comandi su 43: è caduta
`iniezioni-fresche` (tre prove nuove ricavavano una variante del DXF con
`.replace()` su un testo composto per pezzi), e il totale scritto nei
documenti era 4369 contro i 4387 eseguiti (dimenticate le 18 righe in più
della controprova). Corretto in `86120570`.
⛔ Perché non l'avevo visto: prima del commit avevo lanciato
`iniezioni-fresche` e letto la sola riga «Risultato», che conta le
iniezioni sul bersaglio e non cambia quando una prova cade. Da adesso ogni
controllo si legge dal CODICE D'USCITA (`echo $?`) e dal conto delle righe
rosse, non da una riga scelta con grep.

## Che cosa è stato fatto in questa unità
- `apps/genesi/genesi-data.js`: `_dxfOpz(campi, codice, predefinito)` (un
  codice assente vale il predefinito, uno illeggibile no — lo usa anche
  l'INSERT), `_dxfEllisse(campi, scala)` e il ramo `ELLIPSE` di `dxfLeggi`.
  Coordinate MONDO; semiasse minore = estrusione × maggiore × rapporto; lati
  da `_dxfLati(semiasse più lungo, ampiezza, scala)` a passi uguali di
  parametro; intera = chiusa esatta. Non è un'ellisse (→ non letta): senza
  rapporto, rapporto ≤ 0, semiasse nullo, parametro illeggibile.
- `apps/genesi/genesi.html`: «N curve (archi, cerchi, ellissi) sono entrate
  come spezzate: dalla curva vera non si scostano più di 2 cm».
- Prove: 45 campioni (5 nuovi), `dxf-da-cad.mjs` 43 → 48, controprova
  31 → 38; `run-kpi.mjs` 3250 → 3251 (casi limite controprovati 5 su 5 con
  `scratchpad/contro_gen.mjs`); banco `genesi-dxf-import.mjs` 32 → 34.
- Numeri: 3.751 prove senza rete; giro `node` 4400 su 43 comandi (per
  somma: 4387 + 1 + 5 + 7 — da confermare col giro dopo le spline).

## Stato roadmap
Chiusa la metà «ellissi»; aperta `Genesi — DXF: le spline`. Le altre aperte
di Genesi: `F6b: l'INCLINAZIONE per foro`, l'ombrello `FORO PER FORO`. In
attesa del fondatore: decisioni 33, 34 (e 32 rimandata).

## Prossimo passo atomico — DXF: le spline
Il prototipo è misurato e sta in `scratchpad/spl/` (se lo scratchpad è
sparito, questo basta a rifarlo):
1. `_dxfStruttura`: per `SPLINE` i codici ripetuti 10/20 → `cur.verts`,
   40 → `cur.nodi`, 41 → `cur.pesi`, 11 → `cur.passaggi` (solo contati).
2. `_dxfSpline(e, scala)`: grado (71, predefinito 3), n+1 punti di
   controllo, nodi = n + grado + 2, non decrescenti; pesi tutti > 0 e
   quanti i punti, se ci sono; dominio da `U[grado]` a `U[n+1]`; punto con
   de Boor in coordinate omogenee; ogni tratto fra due nodi si dimezza
   finché la curva a 1/4, 1/2 e 3/4 sta entro `0.5·freccia/scala` dalla
   corda (profondità massima 18, tetto 20.000 punti); 70 & 1 → chiusa
   esatta se gli estremi coincidono. Altrimenti `null` → `nonLetta('SPLINE')`
   (è il caso della spline di soli punti di passaggio).
3. Verità in `genera.py`: `_spline(e)` scrive grado, nodi, punti di
   controllo, pesi e 41 punti di ezdxf (`prove`); `dxf-da-cad.mjs` calcola la
   curva con le funzioni di base di Cox–de Boor (altra strada), la controlla
   contro `prove`, poi misura. Sei campioni: aperta + razionale, a S
   simmetrica (la metà sta SULLA corda), chiusa periodica, come la scrive un
   CAD (controllo + passaggio, e grado 5), soli punti di passaggio, dentro
   un blocco stirato 6× PER TRAVERSO alla curva.
4. ⚠️ Già visto in scratchpad: l'iniezione «una spline chiusa non si
   chiude» la suite NON la distingue (la differenza è 1e-16): va provata in
   `run-kpi` con un confronto esatto, come per l'ellisse. E le iniezioni
   multi-riga ancorate a `} else if(e.tipo==='INSERT'){` colpiscono il ramo
   sbagliato appena se ne aggiunge uno: ancorarle a un nome proprio (`ell`,
   `spl`).
5. Pagina: aggiungere «spline» alla frase delle curve; banco: un campione.

## Blocchi
Nessuno tecnico.
