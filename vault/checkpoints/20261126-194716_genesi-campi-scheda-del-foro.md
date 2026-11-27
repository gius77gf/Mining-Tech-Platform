# Checkpoint — 2026-11-26T19:47:16Z — i campi della scheda del foro

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit
quello che contiene questo file (il precedente è 953dbd66; giro node su
953dbd66 confermato: 43/43, 4343)

## Completato — Genesi: estetica della scheda del foro
- CSS soltanto (`apps/genesi/genesi.html`): `#d2-insp input[type=text]` con lo
  stesso campo di `.ft-r input` (fondo `#241d12`, bordo `#473a1f`, 16 px,
  `min-height:40px`, fuoco color rame); `#d2-insp .btn.sm{min-height:40px}`;
  sotto i 480 px `#d2-insp` in colonna con «Elimina» sotto, a destra.
- Misure prima/dopo (scratchpad, scatti guardati a 430 e 320 px): campi
  19 → 40 px; bottoni 21 → 40; scheda a 430 px 319 → 384 px, a 320 px
  441 → 527 px.
- Verifiche: `fuori-schermo.mjs --solo=genesi` 3 schermate pulite;
  `contrasto.mjs --solo=genesi` 338 testi, 0 sotto soglia (non apre la scheda
  del foro: dichiarato); sette banchi sulla scheda verdi;
  `genesi-foro-per-foro.mjs` 133 → 134, controprova 36/36.
- Nessuna prova `node` nuova: i numeri del giro restano 3.746 / 4343.

## Stato roadmap
F1–F5 ✅ · capienza ✅ · F6 aperta. Decisione 33 in attesa del fondatore.

## Prossimo passo atomico — F6, prima fetta: il DIAMETRO per foro
1. Limiti del campo di progetto: `D2.diam = valoreCampo(gvv('dD'), D2.diam,
   50, 160, true)` → intero, 50–160 mm.
2. Modulo: aggiungere `diam` a `_REGOLE_PER_FORO` (`v > 0`) e a
   `LIMITI_PER_FORO` (`{min:50, max:160, unita:'mm', nome:'il diametro del
   foro', intero:true}` — controllare che `_dentroLimitiForo` e `gEsito`
   rispettino `intero`), e quindi a `CAMPI_PER_FORO`. ⛔ Molte prove fissano
   `CAMPI_PER_FORO` a tre campi e `contaValoriPropri` a quattro chiavi:
   vanno aggiornate con la ragione, non allentate.
3. Chi deve leggere il diametro DEL FORO (conti): `capienzaFori` (oggi
   `p.diam`), il piano di carico CSV (colonna diametro, se c'è: guardare
   l'intestazione), l'XML (`HoleDiameter` per `<Hole>` solo se suo, come i
   `Design`), il `.volata.json` (`diam:P.diam` → `suoi.diam`), il DXF
   (`dxfPianoFori(D2.holes, D2.diam, …)`: leggere se il diametro finisce nel
   raggio del cerchio di ogni foro).
4. Chi resta sul foro tipo (previsioni): confinamento del colletto, flyrock,
   uniformità Kuz-Ram, validatori geometrici (`Spalla / Ø`), presplit, 3D.
5. Pagina: quarto campo nella scheda (`_VAL_FORO`) e quarta colonna
   scrivibile in tabella — ⚠️ a 320 px le colonne scrivibili diventano
   quattro: rimisurare, la tabella oggi ci sta al pixel (246 px).
6. Neutralità provata su ogni file che esce, poi banco e controprova.

## Blocchi
Nessuno. In attesa del fondatore: decisione 33; canarino su main (serve una PR).
