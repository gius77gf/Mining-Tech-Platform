# Checkpoint — 2026-07-22T03:00:00Z

## Tipo
unit-complete (Genesi — riconciliazione previsto-vs-reale da misure reali)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Genesi riconciliazione misure)

## Completato
Task #6 (riconciliazione previsto-vs-reale) — primo passo ONESTO, senza ML.
Nel pannello params, sotto il calcolo inverso, un campo "📏 Confronto con
misure reali": l'utente inserisce le dimensioni misurate sul muckpile (cm,
separate da spazi/virgole). Genesi costruisce la curva granulometrica
EMPIRICA pesata per volume (d³, coerente con la base a massa della curva
prevista), la sovrappone in azzurro alla curva Kuz-Ram prevista e mostra
"x50 misurato vs previsto · scarto %".
- `apps/genesi/genesi.html`:
  - `_fragCurveSVG(fr, sw, meas)`: 3° argomento opzionale → disegna la
    polilinea misurata (#4fc3f7) + marker + voce di legenda "Misurato".
    Retro-compatibile (senza `meas` nulla cambia).
  - `_measFromSizes(arr)`: ordina, CDF cumulata pesata per volume, x50
    interpolato a P=0.5.
  - `_measUpdate()` + UI `#meastool` (input `#meas-in`, `#meas-res`):
    parsing robusto (virgola decimale, ignora non-numeri), confronto
    x50 misurato/previsto con scarto e AVVERTENZA (confronto qualitativo
    su campione, non analisi strumentale). Refresh anche alla rigenera
    volata (`_measUpdate()` accanto a `_invUpdate()`).

Onestà: NON è auto-segmentazione da foto (che darebbe numeri fuorvianti su
muckpile reali). Le misure le fornisce l'operatore → il dato è reale, il
confronto trasparente. Emula la "validazione da immagine" dei competitor
senza fingere un ML che non abbiamo.

Verifica: syntax inline OK (check python CI); logica in Node — CDF monotona
e termina a 1.0; x50 pesato-volume alto per campione sbilanciato sui blocchi
(47.6 su 12–60); tutti-uguali → x50 = quel valore; <2 misure → null; parsing
"12,5 18 25.0 x 40" → [12.5,18,25,40]. SVG: overlay + legenda presenti con
`meas`, assenti senza (retro-compatibile).

## Prossimo passo atomico
Restano i punti pesanti: #4 auto-pezzatura-da-foto (watershed/OpenCV.js — da
valutare, rischio numeri fuorvianti), #5 viewer point-cloud (Potree/deck.gl),
#6 ML frammentazione (serve modello pre-addestrato → documentare). Oppure
sintetizzare la ricerca Scudo (Agent WebSearch) in doc.

## Blocchi
#321 estetica: attende il giudizio del fondatore (promessa). Motore fisico
diretto: non toccare. Tutto sul branch unico #321.
