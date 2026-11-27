# Checkpoint — Genesi: il nostro disegno DXF letto da un altro programma

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit
Quello che contiene questo file («fix(genesi): il disegno DXF che Genesi
scrive, letto da ezdxf…»). Il precedente, `654bc9b7` (la riga dello
storico), è confermato dal giro `node` completo: 43 comandi a posto, 4422
asserzioni, uscita 0.

## Che cosa è stato fatto
- Il «metodo nuovo» (un file di scambio si prova con un programma ALTRUI)
  applicato allo SCRITTORE: `dxfPianoFori` fatto leggere a `ezdxf` 1.4.5.
  Lo apre col lettore normale, come R12, zero errori alla verifica. Due
  difetti veri, che l'andata e ritorno di casa non poteva vedere (il nostro
  lettore i testi non li legge):
  1. un nome con un accento arrivava storpiato («Foro n°1 (àèì)» → «Foro
     nÂ°1 (Ã Ã¨Ã¬)»): file in UTF-8, letto come Windows-1252;
  2. un foro senza nome lasciava un TESTO VUOTO nel disegno.
- `_dxfTesto` (genesi-data.js): fuori dall'ASCII → `\U+XXXX`; circonflesso
  → come lo scrive il DXF; fuori dal piano di base → «?»; controllo →
  spazio; senza nome nessun testo. Neutralità misurata: coi nomi di Genesi
  il file è byte per byte quello di prima.
- Suite nuova `apps/deepwork-id/tests/dxf-nostro-da-cad.mjs` (22
  asserzioni; controprova 23 su 23: 7 difetti nel modulo + 16 letture
  guastate) e `campioni/dxf-nostro/`: `casi.mjs` (gli ingressi),
  `scrivi.mjs`, `leggi.py`, nove `.dxf`, `letto-da-ezdxf.json`. La suite
  pretende (1) che i file committati siano ANCORA quelli che Genesi scrive e
  (2) che la lettura di ezdxf sia ciò che gli ingressi dicono, con un conto
  suo. In `npm test` (giro: 43 → 45 comandi).
- Misura senza modifiche: i record per Sentinella e per Campo portano già
  le cariche vere foro per foro (696 → 638 kg, MIC 58, riga a 0 kg).
- Documenti: chiuse in `RICERCA_CONTINUA_GENESI.md` le righe che
  proponevano lavoro già fatto (blocchi, archi, LAS, DXF nostro): resta
  aperto solo `parsePLY` contro un file scritto da un altro.
- Numeri: prove senza rete 3.759 (invariato: la suite nuova non è fra le
  nove); giro `node` 4470 su 45 comandi (per somma: 4422 + 22 + 23 + 3 file
  in più contati da `import-esistenti` — da confermare col giro).

## Che cosa NON dice questa unità
ezdxf è la libreria di riferimento del formato, non AutoCAD: nessun CAD
commerciale è stato aperto. Un nome con due percento di fila seguiti da una
lettera in CAD diventa un simbolo: dichiarato, non curato.

## Come si rigenerano i campioni (se `dxfPianoFori` cambia di proposito)
    node apps/deepwork-id/tests/campioni/dxf-nostro/scrivi.mjs
    <venv con ezdxf==1.4.5>/bin/python apps/deepwork-id/tests/campioni/dxf-nostro/leggi.py apps/deepwork-id/tests/campioni/dxf-nostro
(il venv di questa sessione: `scratchpad/interop/venv`; in un contenitore
nuovo va ricreato con `python3 -m venv` + `pip install ezdxf==1.4.5`.)

## Stato roadmap
Chiuse: «il NOSTRO disegno DXF letto da un altro programma», «i due record
che escono verso le altre app» (misura). Ferma: «il piede che esce dalla
faccia» (decisione 35).

## Prossimo passo atomico
**`parsePLY` contro un file scritto da un altro** — l'ultima riga aperta del
metodo nuovo sui lettori.
1. `apps/genesi/pointcloud.js`: leggere `parsePLY` (che intestazioni e che
   formati accetta: ascii, binario little/big endian, proprietà, colori).
2. Nel venv: `pip install plyfile` (se la rete dei pacchetti lo consente;
   se no, scrivere i PLY con `numpy`/`struct` NON vale — sarebbe di nuovo
   scritto da noi: in quel caso annotare e passare al punto 4).
3. Come per `las-da-laspy`: campioni piccoli scritti da `plyfile` (ascii,
   binario LE, binario BE, con e senza colore, con proprietà in più, con
   una lista di facce, double invece di float), `verita.json` scritto dal
   generatore, suite `ply-da-altri.mjs` + controprova, in `npm test`.
4. Poi la seconda passata prosegue sugli scatti di ogni schermata di Genesi
   a 320/430 coi valori per foro accesi (tabella dei fori, scheda del foro,
   report), guardandoli uno per uno.

## Blocchi (del fondatore)
Decisioni 28, 33 (⚠ quale foro usa la gittata), 34 (lettore LAZ), 35 (spalla
al piede); 32 rimandata.
