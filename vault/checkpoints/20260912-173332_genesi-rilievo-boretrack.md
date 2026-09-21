# Checkpoint — 2026-09-12T17:33:32Z

## Tipo
unità completata (feature + refactor), app singola

## App
Genesi (direttiva del fondatore ancora in vigore: solo Genesi)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`0ddaa471`

## Completato

1. Chiuso il "prossimo passo atomico" del checkpoint 128: **P1.1 residuo —
   import deviazione fori "as-drilled" (boretrack)**. Genesi simulava già la
   banda d'incertezza della perforazione (Monte-Carlo, `simulaPerforazione`)
   ma non aveva modo di leggere una deviazione **misurata per davvero**.
2. `deviazioneForiDaCsv(testo)`: legge un CSV `foro/id_foro;dx_m;dy_m`
   (deviazione del piede rispetto al progetto), stessa convenzione di
   `_riconParseCampo` (intestazione per nome o ordine posizionale, `numIt`
   per il punto/virgola italiana, righe illeggibili scartate e contate,
   mai un'eccezione che rompe la pagina).
3. `burdenVeroDaRilievo(holes, profilo, faccia, righe)`: ricalcola il
   burden vero — stessa geometria fila-per-fila di `simulaPerforazione`
   (la fila davanti nelle sue posizioni vere, non nominali) ma su **una
   sola realizzazione**, quella misurata, non centinaia di sorteggi.
4. **Prima di scrivere il codice**: l'abbinamento foro↔riga era già dentro
   `confrontoPerForo` (riconciliazione carica, unità precedenti). Estratto
   in `abbinaForiRighe(holes, righe, leggiId, leggiNumero)` invece di
   essere ricopiato — regola "una copia nasce da una firma troppo
   stretta". Le **tre prove esistenti** di `confrontoPerForo` restano
   verdi INVARIATE dopo l'estrazione: verificato esplicitamente, è la
   controprova che il comportamento non è cambiato (non solo che il
   codice compila).
5. Bottone "📡 Importa rilievo deviazione fori (CSV)" + pannello nella
   scheda 2D, riusando la faccia libera calcolata con la stessa formula
   di `computeEnergia2D` (nessuna variabile nuova della pagina).
6. Verificato col browser (Playwright): import di un CSV reale via
   file-chooser, nessun errore di pagina, 3 fori su 12 misurati, burden
   progetto→vero e scarto mostrati correttamente (screenshot guardato).
7. Test: +4 netti (`abbinaForiRighe` chiamata direttamente,
   `deviazioneForiDaCsv` con casi validi/invalidi/virgola italiana,
   `burdenVeroDaRilievo` su due file di fori con caso a mano verificato
   fuori dal test — 3,1 m calcolato manualmente e confermato — e il caso
   "foro senza rilievo": dichiarato non misurato, MAI un burden dedotto
   dalla posizione di progetto).
8. Documenti rimisurati: fondo di `genesi-data.js` 137→140, scomposizione
   condivisa 301/301→304/304, prove senza rete/browser 3.407→3.410, giro
   completo 3.865→3.868.

## Stato roadmap

Unità 129 (Genesi — rilievo boretrack) → **completata**, voce aggiunta in
`vault/ROADMAP_SETTIMANA.md` dopo quella dell'unità 128. Con questa, il
punto P1.1 di `docs/GENESI_ROADMAP_COMPETITOR.md` è chiuso: l'unico gap
importante rimasto è **P2.1 — pezzatura misurata da una foto del cumulo**.

## Verifica prima del commit

`git worktree` da HEAD + diff staged + `giro-node.mjs`, cattura diretta
del vero codice di uscita. Due giri: il primo ha trovato il
disallineamento 3.865→3.868 (in DEVELOPMENT.md — STATO_PRODOTTO.md
l'avevo già aggiornato correttamente con un conto derivato, non
indovinato: solo `run-kpi` cresceva di 3, quindi 3865+3=3868, verificato
poi dal giro stesso); il secondo, dopo la correzione,
**`ESITO_VERO=0`, 40/40 comandi a posto**.

## Blocchi e limiti noti

- Nessun nuovo blocco aperto da questa unità.
- Il pannello del rilievo elenca TUTTI i fori del progetto (misurati e
  non): per una volata molto grande (100+ fori) la lista potrebbe
  allungarsi troppo — non misurato su un caso reale così grande, quindi
  dichiarato come rischio, non come difetto confermato.
- L'integrazione visiva nel 3D (chiesta esplicitamente dal testo P1.1 del
  documento competitor: "mostralo nel 3D") NON è stata fatta: questa
  unità copre solo il calcolo e un pannello testuale nella scheda 2D.
  Resta un'estensione a sé se servirà.

## Prossimo passo atomico

Il gap vero rimasto in Genesi è **P2.1 — frammentazione da immagine del
muckpile** (`docs/GENESI_ROADMAP_COMPETITOR.md`, confermato "pesante").
Prima di aprirlo: leggere `docs/GENESI_FRAMMENTAZIONE_DA_FOTO.md` con lo
stesso metodo appena rodato nell'unità 128 (grep nel codice prima di
fidarsi delle sue conclusioni — potrebbe essere già parzialmente fatto,
o le sue conclusioni potrebbero essere invecchiate), poi valutare se
esiste una versione base (watershed/soglia su bordi, senza ML) fattibile
nel browser prima di scartare l'idea per pesantezza. In alternativa, più
piccolo: le quattro occorrenze residue di `PENALITA_ACQUA` duplicate in
`genesi.html` (dichiarate fin dall'unità 126, mai più toccate).
