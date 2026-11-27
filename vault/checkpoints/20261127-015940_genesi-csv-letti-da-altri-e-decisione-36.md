# Checkpoint — Genesi: i CSV che escono, letti da un altro programma (misura) e decisione 36

## Tipo
unit-complete (solo documenti: nessuna modifica al prodotto)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit
Quello che contiene questo file («docs(genesi): i CSV che escono letti da un
altro programma…»). L'ultimo commit di prodotto è `81404558` (il piano XML
letto da un parser severo), confermato dal giro `node` completo: 47 comandi
a posto, 4522 asserzioni, uscita 0.

## Che cosa è stato fatto
- Premuti i bottoni veri di scheda volata, piano di carico, file per
  Sentinella e confronto A/B con nomi difficili; i file letti col modulo
  `csv` di Python (severo, separatore `;`).
- A posto: scheda (2 colonne su ogni riga), confronto (3), file per
  Sentinella (21) — `;` e virgolette dentro un nome protetti.
- ⛔ Trovato 1 — il piano di carico non protegge l'id del foro: 14 colonne
  invece di 13 con un `;`, riga spezzata con un a capo, formula nuda con un
  `=`. La funzione è `pianoCsvGenesi` in `shared/dw-ponti.js`, usata anche
  da Campo: FUORI MANDATO. Voce aperta in roadmap, con la misura.
- ⛔ Trovato 2 — i quattro file sono UTF-8 senza marca iniziale; letti come
  Windows-1252: «3Ã—3.5 m Â· Ã˜102». Non corretto di iniziativa: è la
  **decisione 36** in `docs/DECISIONI_WEEKEND.md`, che comincia chiedendo
  al fondatore di aprire un file con Excel (qui Excel non c'è: ciò che fa
  Excel è di seconda mano, e lo dico).
- Strumenti della misura: in scratchpad (`csvnostro/misura.mjs`,
  `leggi.py`), NON committati — se la decisione 36 porta a una modifica,
  diventano un banco in `tests/browser/` insieme a lei.

## Stato roadmap
Chiusa «i CSV che escono, letti da un altro programma» (misura). Aperte e
ferme: «Genesi → Campo — il piano di carico CSV non protegge l'id del foro»
(fuori mandato), «il piede che esce dalla faccia» (decisione 35).

## Prossimo passo atomico
**Seconda passata sugli scatti di Genesi coi valori per foro accesi.**
1. Banco di misura in scratchpad (stessa forma di `ponti/misura.mjs`): con
   tre fori con valori loro (un foro scarico, un borraggio corto, un foro a
   20°) fotografare a 430 e a 320 px: la scheda del foro aperta, la tabella
   dei fori aperta, la scheda volata, il pannello Parametri, la vista 3D con
   l'etichetta «foro tipo», il report (la finestra di stampa).
2. GUARDARE ogni scatto (fette da 1400 px con `clip`): testi tagliati,
   colonne a capo, etichette che si toccano, un numero tranquillo dove non è
   stato calcolato niente.
3. Per ogni sospetto una misura (`getBoundingClientRect`, `scrollWidth >
   clientWidth`, `getComputedStyle`) PRIMA di toccare il codice; poi la
   correzione nel banco `genesi-foro-per-foro.mjs` con la sua iniezione.
4. Dopo: `B3. Genesi continua a uscire dalla pagina` (le funzioni fra 3 e 10
   variabili legate, `node apps/deepwork-id/tests/genesi-estraibili.mjs
   --elenco`).

## Blocchi (del fondatore)
Decisioni 28, 33 (⚠ quale foro usa la gittata), 34 (lettore LAZ), 35 (spalla
al piede), **36 (accenti nei CSV: prima la prova con Excel)**; 32 rimandata.
