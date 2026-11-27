# Checkpoint — 2026-11-26T18:05:08Z — F4, la tabella dei fori

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit
quello che contiene questo file (il precedente è 352c29d7, il tasto Tab)

## Completato — Genesi, foro per foro, F4: la tabella dei fori
- **Modulo** (`apps/genesi/genesi-data.js`, 193 → 195 esportazioni):
  `tabellaFori(holes, progetto, ordine)` e `COLONNE_TABELLA_FORI`. Ogni riga
  porta `i` (indice del foro: l'ordine è della VISTA), i valori che valgono
  per quel foro e `propri`; ordinamento stabile, i `null` in fondo in tutti e
  due i versi; colonna sconosciuta = per numero del foro.
- **Pagina** (`genesi.html`, 142 → 148 funzioni): `#d2-tabella` dopo
  `#d2-insp`, sezione `.dc-sec closed`; `renderTabellaFori`,
  `tabellaForiDaRifare` (chiamata in cima a `renderScheda2D`: ridisegna un
  istante dopo e ridà il fuoco alla cella con lo stesso id);
  `applicaValoreForo(indici, campo, testo)` — la regola di scrittura portata
  fuori da `valoriForoCollega`, usata da scheda e tabella. Un ascoltatore solo
  sul contenitore per scrivere, ordinare, selezionare.
- **Aspetto**, tre passate sugli scatti a 430 e 320 px: intestazioni su due
  righe (nome / unità + freccia), colonne `34 42 46 54 3×≥50` che a 430 px
  stanno intere, numero del foro fermo a sinistra, sotto i 380 px escono x e
  spalla e restano le tre colonne che si scrivono.
- **Prove**: run-kpi 3244 → 3245; `browser/genesi-foro-per-foro.mjs` 72 → 97
  (tastiera vera, Tab fra le celle), controprova 23 iniezioni su 23 (cadono in
  49). Le attese sull'ordinamento si ricavano dai valori letti: nella passata
  di controprova la carica del progetto è un'altra, e un'attesa a memoria
  passava per la ragione sbagliata.
- **Tre cose imparate facendola**:
  1. una variabile CSS locale (`--ft-bg`) faceva salire il conto delle
     variabili «definite da Genesi» sorvegliato da
     `docs/LA_STRUTTURA_DEL_CORE_SCRITTA_SEI_VOLTE.md`: tolta, fondi scritti
     per esteso e cella ferma con `background-color:inherit`;
  2. un heredoc NON fra apici ha eseguito gli apici inversi dentro il testo di
     una prova (la parola fra apici inversi sparita dalla frase): presa
     rileggendo l'uscita, non dal totale. Gli script che contengono codice si
     scrivono con l'heredoc fra apici;
  3. due iniezioni della controprova non distinguevano il loro difetto perché
     lo stato della passata di controprova è diverso (carica del progetto 5
     invece di 50): riscritte le asserzioni perché non dipendano dal numero.

## Numeri scritti nei documenti
3.743 prove senza rete (run-kpi 3245); giro node 4340 su 43 comandi (scritto
per somma: +1; da confermare col giro su questo commit); condivisi 368/368,
`genesi-data.js` 195/195; funzioni nella pagina 148 (24/40/19/19/46, 48 su 148).

## Stato roadmap
F1 ✅ · F2 ✅ · F3 ✅ · F4 ✅ · F5–F6 aperte. Decisione 33 in attesa del fondatore.

## Prossimo passo atomico — F5, i file che escono e la scena 3D
PRIMA SI MISURA, poi si corregge. Nel browser (banco nuovo o sezione 10 di
`genesi-foro-per-foro.mjs`, col gancio `window.__usciti` che c'è già): dare a
un foro carica 35 kg, profondità 8,5 m, borraggio 1,5 m e premere OGNI bottone
che produce un file — cercarli con
`grep -n "a.download\|\.download=" apps/genesi/genesi.html` e con
`grep -n "id=\"btn-.*\(csv\|xml\|dxf\|json\|pdf\)" apps/genesi/genesi.html` —
aprire ogni file e guardare se la riga di quel foro porta 35 / 8,5 / 1,5 o i
valori del progetto. Per ogni file che porta il progetto: trovare la funzione
che lo compone (quasi sempre nel modulo: `dxfPianoFori`, l'XML del piano di
tiro, la scheda volata) e passarle `valoreDiForo(h, campo, D2)` al posto di
`D2.campo`, con la prova di neutralità (senza valori per foro il file esce
identico byte per byte). La scena 3D (`rebuild`, `SIM`, `P`) per ultima: lì i
fori nascono da `P.fori`, non da `D2.holes` — leggere prima come passa da
`D2` a `P`, senza toccare le FORMULE del motore fisico.
Candidato estetico ancora aperto: i campi della scheda del foro (bianchi del
browser) vanno portati allo stile dei campi della tabella (`.ft-r input`).

## Blocchi
Nessuno. In attesa del fondatore, senza fermare il lavoro: decisione 33;
riattivare il canarino su main (serve una PR, non autorizzata).
