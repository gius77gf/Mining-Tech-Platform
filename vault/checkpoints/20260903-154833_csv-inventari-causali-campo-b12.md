# Checkpoint — 2026-09-03T15:48:33Z

## Tipo
unit-complete (tre unità: B12 residui nel core; Terra CSV inventari; Campo causali)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
c36b84aa

## Completato
1. **Core, i residui di B12** (286ecf22): un campo SVUOTATO non vale 0 in
   `aggiornaVolata` (radice di tre candidati), `fileDetti` per barra e
   generatore («0 file»/«null» spariti), `caricaMaxDetta` («—» senza chili,
   «≥» a metà: il NUMERO della soglia non cambia), i due clamp sulla lunghezza.
   Prove sul sorgente; la prova ⏱️ che inchiodava «0,0 kg» è diventata ✅.
2. **Terra, il CSV degli inventari** (c36b84aa): `csvInventari`,
   `parseInventariCsv`, `rientroInventari`, bottoni carica/scarica, voce in
   `CSV_TABELLE`; banco `terra-inventario-csv` (29, 3 difetti in controprova).
3. **Campo, le causali con chiave** (c36b84aa): `{chiave, etichetta}`,
   `chiaveCausale`/`etichettaCausale`/`descriviCausale`, le non riconosciute
   contate e nominate; «Mancanza materiale» dichiarata nella sonda del vuoto
   (causale di fermo, non dato assente); `nomi-doppi` con la ragione.
⚠️ Due interruzioni per limite di crediti nella giornata (01:46Z e ~08:00Z):
ogni volta morti i cantieri appena aperti e il giro del browser (11-15
passate). Le due passate in profondità (Terra, Genesi) sono da rifare.

## Numeri
run-kpi 2515 · prove senza rete 2.996 · asserzioni del giro 3.418 su 38
comandi · copertura 789/789 · banchi 229 esecuzioni su 94 file.

## Prossimo passo atomico
(a) le due passate in profondità, Terra e Genesi (banchi lanciati, ogni
    schermata guardata a 390/320 nei temi, ogni file aperto, i numeri
    tranquilli con la demo svuotata), con i difetti veri corretti;
(b) il giro del browser rilanciato su `c36b84aa` e LETTO (`leggi-giro.mjs`)
    — riverificando ogni KO sul commit corrente;
(c) poi: passata su Campo con le causali nuove, e il candidato «registro di
    carico e scarico degli esplosivi» solo dopo il testo primario.

## Blocchi
Nessuno. Decisioni del fondatore aperte: 5b, 19, 20, 21, Q1.
