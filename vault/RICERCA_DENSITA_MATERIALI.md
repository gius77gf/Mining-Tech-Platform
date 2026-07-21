# Ricerca — densità (peso di volume) dei materiali di cava, per Terra

Data: 2026-07-21 · Ricerca di prodotto per **Terra** (volumi → valore).
Obiettivo: dare a `valoreMateriale(m³, densità, prezzo)` una **libreria di
densità di riferimento** per litotipo, così un utente non tecnico non deve
indovinare la densità quando converte i m³ estratti (dai rilievi drone) in
tonnellate e in euro.

⚠️ **Onestà**: sono valori TIPICI di riferimento (peso di volume "in banco"),
non una misura del materiale specifico. La densità reale varia con porosità,
fratturazione, umidità e litotipo locale: va **confermata col laboratorio /
prova di densità** prima di usarla per numeri contrattuali. Per questo ogni
preset porterà l'avviso `daVerificare`, come già le soglie di Sentinella.

## Dato tecnico
La conversione è: tonnellate = volume (m³ in banco) × densità (t/m³);
valore = tonnellate × prezzo (€/t). Terra misura il volume ESTRATTO (il vuoto
di scavo) dai rilievi drone, quindi serve la densità **in situ / peso di
volume della roccia in banco**, non quella del materiale sciolto in mucchio
(che è più bassa per via dei vuoti — fattore di rigonfiamento/swell).

## Densità in situ tipiche (t/m³) — fonti secondarie concordanti
- **Calcare compatto**: ~2,6 (range 2,5–2,7)
- **Calcare tenero**: ~2,2
- **Dolomia**: ~2,8
- **Basalto**: ~2,9
- **Granito**: ~2,7
- **Arenaria**: ~2,3 (range 2,2–2,6)
- **Marmo**: ~2,7
- **Gesso**: ~2,3
- **Argilla compatta**: ~2,1
- **Sabbia e ghiaia (deposito naturale, in banco)**: ~1,9 (più sciolta se in
  cumulo)

Nota: le rocce da costruzione tipiche stanno tra ~2,4 e ~3,2 t/m³; le
variazioni dipendono da compattezza e porosità del banco.

## Come diventa lavoro in Terra (backlog, non gated)
1. `DENSITA_PRESET` (array {chiave, etichetta, densita, fonte}) + `presetDensita`
   (ritorna il preset con `daVerificare: true`, o null) — stesso schema di
   `SOGLIE_PRESET`/`presetSoglia` di Sentinella. Puri e testabili.
2. Nel calcolo del valore: un menù "materiale" che, scelto, riempie il campo
   densità col valore tipico (l'utente può poi correggerlo), con nota "valore
   tipico, da confermare col laboratorio".

## Fonti (secondarie, concordanti)
- Geostru — Pesi/volume terreni e rocce (valori indicativi):
  https://help.geostru.eu/properties-specific-weights-materials/it/valori-indicativi-del-peso-specifico-rocce.html
- Testo Unico Sicurezza — Tabella valori terreni e rocce:
  https://www.testo-unico-sicurezza.com/tabella-valori-terreni-e-rocce.html
