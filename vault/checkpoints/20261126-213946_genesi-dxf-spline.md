# Checkpoint — Genesi: il lettore DXF legge le spline (e con loro tutte le curve)

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit
Quello che contiene questo file («feat(genesi): il lettore DXF legge le
spline…»). Prima di lui, nello stesso blocco: `9b2ee1ad` (blocchi inseriti),
`86120570` (correzione delle sue prove), `c2086c51` (ellissi).

## Che cosa è stato fatto
- `apps/genesi/genesi-data.js`
  - `_dxfStruttura`: per `SPLINE` i codici ripetuti 10/20 → `verts`, 40 →
    `nodi`, 41 → `pesi`, 11 → `passaggi` (contati).
  - `_dxfSpline(e, scala)`: de Boor in coordinate omogenee, dominio
    `U[grado]..U[n+1]`, tratti dimezzati finché la curva a 1/4, 1/2, 3/4 sta
    entro `0.5·DXF_FRECCIA_ARCO_M/scala` dalla corda (profondità 18, tetto
    `_DXF_SPLINE_MAX_PUNTI` = 20.000), chiusa esatta con 70 & 1. `null` se
    la curva non è nel file o i conti non tornano.
  - `dxfLeggi`: ramo `SPLINE`; non letta = `SPLINE`, oppure
    `SPLINE (punti di adattamento)` quando ci sono solo quelli.
  - Tolta la guardia doppia sul dominio vuoto (bastava `pts.length<2`).
- `apps/genesi/genesi.html`: la frase delle curve nomina le spline; riga
  nuova che dice come far entrare una spline di soli punti di adattamento
  (convertirla in polilinea nel CAD).
- Prove: 51 campioni (6 nuovi); `dxf-da-cad.mjs` 48 → 54 e controprova
  38 → 46; `run-kpi.mjs` 3251 → 3252 (controprova 12 su 12 con
  `scratchpad/contro_gen.mjs` + `spl/difetti.json`); banco
  `genesi-dxf-import.mjs` 34 → 37 (3 iniezioni → 4).
- La suite misura le spline con un calcolo SUO (Cox–de Boor), controllato
  contro 41 punti di ezdxf per spline (`prove` in `verita.json`).
- Numeri: 3.752 prove senza rete; giro `node` 4415 su 43 comandi (per
  somma: 4400 + 1 + 6 + 8 — il giro lanciato dopo questo commit lo conferma
  o lo corregge).

## Dichiarato
- ⚠️ «AutoCAD scrive sempre nodi e punti di controllo» è ciò che dice il
  formato e ciò che si legge in giro, NON una cosa misurata qui: non c'è un
  file di AutoCAD in questo repository (il fondatore ha detto che non ne ha
  da dare). I campioni li scrive ezdxf. La pagina infatti non lo afferma:
  dice solo che cosa fare se la spline non entra.
- Il lettore DXF lascia fuori, contandoli: testi (anche attributi), retini,
  quote, punti, superfici a maglia, riferimenti esterni, e le spline di soli
  punti di adattamento. Nessuna LINEA del disegno resta fuori.

## Stato roadmap
Chiuse oggi per il DXF: archi, blocchi inseriti, ellissi, spline. Aperte
per Genesi: `F6b: l'INCLINAZIONE per foro` e l'ombrello `FORO PER FORO`. In
attesa del fondatore: decisioni 33, 34 (e 32 rimandata).

## Prossimo passo atomico — F6b: l'inclinazione per foro, cominciando dal censimento
1. SOLA LETTURA: `grep -n "D2\.incl" apps/genesi/genesi.html` (erano 14
   letture) e, nel modulo, chi prende l'inclinazione come argomento
   (`grep -n "incl" apps/genesi/genesi-data.js | head -60`). Per ogni
   lettura scrivere in scratchpad: è GEOMETRIA del foro (dove sta il piede,
   quanto è lungo il foro, la spalla al piede) o è una PREVISIONE sul foro
   tipo (pezzatura, vibrazioni, gittata)? La decisione 33 tiene ferme le
   seconde: F6b tocca solo le prime.
2. Aggiungere `incl` a `LIMITI_PER_FORO` (gradi dalla verticale, limiti da
   leggere dal campo di progetto esistente), a `_REGOLE_PER_FORO` e a
   `CAMPI_PER_FORO`: scheda del foro, tabella, rombo sulla pianta e file
   (XML e `.volata.json`) li ereditano dal meccanismo di F3–F6a — verificare
   uno per uno, non darlo per scontato.
3. Regola di neutralità: senza valori propri, uscita identica byte per byte
   (XML, `.volata.json`, DXF, CSV).
4. Prova in `run-kpi` prima del blocco di riepilogo; banco
   `browser/genesi-foro-per-foro.mjs` (146 prove) con una sezione nuova e
   le iniezioni riancorate (`iniezioni-fresche` letta dal codice d'uscita).

## Blocchi
Nessuno tecnico.
