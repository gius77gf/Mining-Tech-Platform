# Checkpoint — %Y-%m-%dT%H:%M:%SZ

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
c5011098

## Completato
Unità 85 — ricerca a rotazione, secondo giro, su Conti («che cosa chiede il
commercialista a una cava»), solo documenti. Mondo di seconda mano (8 fonti),
cinque domande sul meccanismo, delta contro `c1808b17`. Due voci aperte nuove
in roadmap: rimanenze anche al costo (OIC 13) e tariffa del canone per
prodotto; due mancanze dichiarate che chiedono una decisione (fondo di
ripristino, margine per prodotto).

## Imparato
- `grep -c` senza `-F` su una stringa con un asterisco risponde 0 su una riga
  che esiste: la prova si rilancia su un caso che DEVE trovare, e il comando
  giusto si scrive accanto al numero.
- Il secondo giro della ricerca rende di più se la domanda è «che cosa chiede
  una persona precisa» (il commercialista) invece di «che cosa manca all'app».

## Prossimo passo atomico
Leggere il giro del browser lanciato alle 09:13Z su `184781db`
(`scratchpad/giri/giro-browser-20260911-0913.log`, `leggi-giro.mjs`) quando
`ultimo-exit.txt` compare, e chiudere i KO veri. Poi la voce aperta «CONTI —
LE RIMANENZE ANCHE AL COSTO»: in `conti-data.js` `prospettoRimanenze` (o una
sorella `valoreRimanenzeBilancio`) che affianca al valore di listino il
valore al costo (`costoPerMetroCubo` del periodo × m³ del cumulo), dichiara
il minore come valore di bilancio e `null` con la ragione quando il costo
non si calcola; `csvRimanenze` con le due colonne; pagina e scatto; prove in
run-kpi. Oppure la voce «tariffa del canone per prodotto».

## Blocchi
Nessuno.
