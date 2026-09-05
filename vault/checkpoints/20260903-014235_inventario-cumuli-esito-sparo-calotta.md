# Checkpoint — 2026-09-03T01:42:35Z

## Tipo
unit-complete (quattro unità in un commit: tre cantieri paralleli + coordinatore)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
b110e3e1

## Completato
1. **Inventario dei cumuli, Terra → Conti** (candidato 3 della ricerca di Conti,
   «il più grosso»): regole in `shared/dw-ponti.js` (7 funzioni + soglie),
   Terra registra (`inventari/{id}`, lista/dettaglio/modale/cancellazione,
   `inventariOrdinati`, `riepilogoInventario`), Conti legge (`api.inventariTerra`
   pigro, `densitaDalListino`, `triangolo` con sette stati) e chiude
   cavato − venduto − Δscorte in tonnellate, ognuno con la sua densità.
   ⚠️ Lezione: la dimostrazione di Conti è la SUA cava (decine di m³), non una
   copia di Terra (ventimila): alla scala di Terra il triangolo chiudeva
   «implausibile» per costruzione. Riscalata prima di committare.
   ⚠️ Lezione: il prototipo in scratchpad ha bocciato la prima stesura di
   `variazioneScorte` — un materiale in un solo inventario contato −880 m³.
2. **Esito dello sparo nel core** (dal delta sul rapporto di volata): colpi
   esplosi contati + colpi mancati con nota; `esitoSparo` in dw-shell decide
   elenco, scheda, PDF; assenti = non contato.
3. **La calotta a zero** (B12, fronte): `calotta_m||1` leggeva lo zero scritto
   come assente; `calottaDetta`/`calottaDisegno`; B12 aggiornato in roadmap.
4. **Sei documenti di ricerca doppi** (maiuscole/minuscole) uniti;
   `tests/omonimi-a-maiuscole.mjs` in npm test.
Ricerca Genesi (rapporto di volata, metà sul mondo + delta dal meccanismo) in
`docs/RICERCA_CONTINUA_GENESI.md`.

## Numeri
run-kpi 2487 · prove senza rete 2.968 · asserzioni del giro 3.389 su 38
comandi · copertura 778/778 (dw-ponti 61, dw-shell 55) · banchi 227
esecuzioni su 93 file. Giro node verde sulla copia del committato.

## Giro del browser
Lanciato alle 00:50Z sulla copia di `2a8c4152` (pid 2052, registro
`scratchpad/giro-browser-0903.log`): vivo, lento per i cantieri paralleli.
Va letto con `leggi-giro.mjs` — e ogni KO riverificato sul commit di adesso,
che è avanti di due commit sulle superfici misurate.

## Prossimo passo atomico
Tre cantieri in parallelo, poi commit unico verificato sulla copia:
(a) core — il colpo mancato come mancato infortunio: dal rapportino con
    mancati > 0 una bozza verso Scudo con la categoria «Volata e proiezioni»
    già in shared (`bozzaNearMiss`, `NEARMISS_CATEGORIE`); la somma dei kg
    per TIPO di esplosivo (delta punto 0) nel PDF fochino; il badge nella
    timeline della home (dubbio 3 del cantiere);
(b) Conti — il verbale di riconciliazione registra anche il terzo lato
    (scorte misurate, scarto del triangolo) quando c'è; «questo mese» fra le
    scorciatoie del periodo (metà del candidato 6);
(c) ricerca a rotazione: Deepwork ID, i ruoli reali in una cava (Q1), metà
    sul mondo con WebSearch.
Poi: leggere il giro del browser quando finisce.

## Blocchi
Nessuno. Decisioni del fondatore ancora aperte: 5b, 19, 20, 21.
