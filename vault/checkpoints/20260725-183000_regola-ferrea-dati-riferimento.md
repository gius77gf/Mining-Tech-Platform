# Checkpoint — 2026-07-25T18:30:00Z

## Tipo
unit-complete (revisione del fondatore 25/07 — regola ferrea + rinomine)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Completato
1. **REGOLA FERREA scritta in `CLAUDE.md`** (permanente, non va più ripetuta):
   i dati di riferimento del fondatore (archivio 190 video, 6/23 volate
   misurate, maglia 4,5×3,5, Nonel 25 ms, 15-20 fori, calcare come "dominio di
   validità") erano ORIENTATIVI: si possono usare internamente per i calcoli,
   MAI mostrare né citare in interfaccia, testi, export o documenti.
2. **Rimosse TUTTE le citazioni** trovate con sweep sull'intero repo:
   - `genesi.html`: card home "Simulazione 3D" (tag «Nonel 25 ms»), card home
     "Progetto 2D" (tag «Maglia 4.5 × 3.5»), riga informativa del pannello 3D,
     testo del modale d'ingresso ("archivio aziendale di 190 video… dominio di
     validità…"), `<title>`, descrizione del manifest PWA, chip "calibrato su
     volate vere", blocco `calibrazione` nell'export JSON del piano;
   - `calibrazione.json`: campo `_meta.fonte` neutralizzato ("calibrazione
     interna") — i NUMERI di calibrazione restano, servono ai calcoli;
   - `PIANO_3D.md`: citazione dei 190 video.
   Verifica: sweep finale su tutto il repo → zero residui (fuori dai checkpoint
   storici, che sono archivio e non interfaccia).
3. **Rinomine richieste**: menu «Progetto» → **2D**, «Simulazione» → **3D**,
   sezione «Geometria maglia» → **Geometria volata**.
4. **`docs/REVISIONE_FONDATORE_25-07.md`**: tutta la revisione del fondatore
   tradotta in unità di lavoro tracciabili (Genesi G1-G6 + app verticali),
   con l'ordine di lavoro proposto.

Verifica: sintassi degli script inline OK; Genesi caricata in browser reale
(home → 2D) senza errori JavaScript; screenshot di controllo.

## Ultimo commit
(questo commit)

## Prossimo passo atomico
Unità 3 dell'ordine di lavoro: **scheda volata compatta** — nei riquadri in
basso restano nome e valore, la descrizione compare solo al clic
(approfondimento). Poi: esplosivo dentro la progettazione con solo la dicitura
(+ approfondimento su richiesta) e rimozione della sezione «Indice».

## Note aperte per il fondatore
I VALORI di partenza del 2D (spalla 4,5 · interasse 3,5 · 18 fori · 25 ms)
sono ancora quelli dei suoi dati orientativi: vanno sostituiti con valori di
partenza generici. Fa parte dell'unità "3D da fronte vergine + parametri
standard" (G4) e verrà proposto con numeri neutri da confermare.
