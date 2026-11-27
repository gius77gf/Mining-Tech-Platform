# Checkpoint — 2026-09-17T23:44:46Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
65ba4499

## Cosa è stato completato
Fix dei tre difetti trovati dal terzo giro di deep-pass su Genesi (agente
a200d8450deefcbef): clipping della Home (`#hgPonti`), il CSV "Esporta
scheda volata" che contava sulla griglia di progetto invece che sui fori
disegnati, e "Carica per un obiettivo di pezzatura" che poteva proporre
una carica fisicamente impossibile da entrare nel foro. Dettagli completi
nel messaggio di commit `65ba4499`. Giro isolato: 41/41, 4105
asserzioni, KPI 3118/3118. Nota tecnica: durante questa unità ho scoperto
che `apps/deepwork-id/tests/run-kpi.mjs` aveva ricevuto ANCHE il test per
la voce "acque" di Terra (unità precedente, non ancora committata):
separati i due con `git hash-object -w` + `git update-index --cacheinfo`
per staged content diverso dal working tree, senza toccare il working
tree (la tecnica già descritta in CLAUDE.md per i file che un cantiere
parallelo sta modificando — qui il "cantiere parallelo" ero io stesso in
un'unità precedente non ancora chiusa).

## Stato roadmap
Terzo giro di deep-pass: Sentinella ✅, Conti ✅, Scudo ✅, Genesi ✅
(questo commit). Flotta: due difetti trovati (agente aff43964bd31baec6),
non ancora fixati. Restano da fare un terzo giro su: Terra, Campo, Core.

## Prossimo passo atomico
1. **Chiudere l'unità Terra**, rimasta a metà da prima di questa: in
   working tree ci sono ancora `apps/terra/terra-data.js` (voce "acque"
   in `TIPI_SCADENZA_TERRA`, invariata) e `docs/RICERCA_CONTINUA_TERRA.md`
   (ricerca + nota di chiusura, invariata) — NON staged. Il test
   corrispondente in `run-kpi.mjs` ("il monitoraggio acque ha una voce
   sua") va RIAGGIUNTO al file (è stato tolto dalla versione staged/
   committata di Genesi con la tecnica hash-object, ma il working tree
   di `run-kpi.mjs` lo ha ancora — verificare con
   `grep -n "il monitoraggio acque" apps/deepwork-id/tests/run-kpi.mjs`
   prima di procedere). Poi: stage terra-data.js + run-kpi.mjs (working
   tree, che ora ha SOLO l'aggiunta Terra dato che Genesi è già committato)
   + RICERCA_CONTINUA_TERRA.md, aggiornare i numeri nei documenti (KPI
   3118→3119, ricalcolare il totale del giro con una worktree isolata,
   NON dedurlo), giro isolato `--solo=terra` per un check rapido POI un
   giro COMPLETO prima del commit finale (dato che tocca `run-kpi.mjs`
   condiviso), commit, checkpoint, push.
2. **Fixare i due difetti Flotta** (agente aff43964bd31baec6):
   - Il punto decimale inglese non tolto da 4-5 colonne in
     `csvRegistroInterventi` (costo/ore_manodopera/costo_manodopera,
     righe ~937-939), `csvLibretto` (colonna importo del suo helper `R()`,
     riga ~1046, usata da più righe), `csvRicambi` (riga ~1176),
     `csvListaDellaSpesa` (consumo_al_giorno, righe ~954-961), `csvCosti`
     (riga ~853): tutte vanno formattate con la stessa convenzione
     italiana già usata altrove nello stesso file (`mostra`/`oreLavoroTesto`),
     non interpolate grezze.
   - `vitaComponenti` (flotta-data.js:2922-2932) ignora la sostituzione
     del contatore (`m.ore` letto diretto, non tramite
     `spezzaLetture`/`trattoCorrente`/`contatoreDelTagliando` come fanno
     `consumoPerMezzo`/`ritmoOreMezzi`/i tagliandi a ore): un contatore
     sostituito produce un "vita" falsamente basso o un "dato da
     controllare" con la spiegazione sbagliata (sembra un errore
     dell'utente, è un contatore sostituito).
3. Riverificare l'esito del terzo giro Flotta prima di committare (già
   arrivato, agente aff43964bd31baec6).
4. Dispatchare nuovi cantieri in background (research + deep-pass) per
   mantenere ≥3 concorrenti — attualmente probabilmente sotto soglia.
5. Continuare la rotazione ricerca continua (Sentinella appena fatta;
   prossimo il più vecchio non ancora aggiornato).

## Blocchi
Nessuno.
