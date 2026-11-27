# Checkpoint — Genesi: il lettore delle nuvole PLY contro file scritti da un altro programma

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit
Quello che contiene questo file («fix(genesi): il lettore PLY, provato con
file scritti da plyfile…»). Il precedente, `c84301e0` (il nostro DXF letto da
ezdxf), è confermato dal giro `node` completo: 45 comandi a posto, 4470
asserzioni, uscita 0.

## Che cosa è stato fatto
- `parsePLY` (apps/genesi/pointcloud.js, usato solo da nuvola-poc.html) era
  provato con buffer costruiti da chi l'aveva scritto. Fatti scrivere 21 PLY
  a `plyfile` 1.1: **7 su 21 si leggevano male, tutti in silenzio**.
  1. Un altro elemento PRIMA dei vertici (telecamera, facce scritte per
     prime): i punti si leggevano dai byte dell'altro elemento — coordinate
     come −1,7·10²⁹ — in binario e in testo.
  2. Colori a 16 bit divisi per 255 (fino a 257 su una scala 0…1).
  3. Colori in virgola mobile divisi per 255 (nuvola quasi nera).
- Correzione: l'intestazione si legge elemento per elemento, i vertici si
  cercano dove stanno (saltando anche gli elementi a lunghezza variabile);
  il tetto del colore viene dal TIPO; per la virgola mobile lo dice il
  massimo letto (sopra 1 → su 255), dichiarato come unica cosa dedotta.
  Due errori col loro nome: «PLY troncato: l'intestazione dichiara N punti,
  nel file ce ne sono M» e «PLY con un tipo di dato che non conosco».
- Prove: `run-pointcloud.mjs` 38 → 40. Le due prove nuove contro il lettore
  di prima cadono tutt'e due. Controprova a mano: 11 difetti su 11 visti
  (script in scratchpad, non committato).
- Campioni: `apps/deepwork-id/tests/campioni/ply-da-plyfile/` — 21 `.ply`
  (86 kB), `verita.json` scritto dal generatore, `genera.py`.
- Nel visore vero (Chromium): due campioni caricati dal bottone (90 punti,
  dimensioni sensate), uno troncato → il messaggio nuovo a schermo.
- Numeri: 3.761 prove senza rete (l'addendo della nuvola 38 → 40); giro
  `node` 4472 su 45 comandi (per somma: 4470 + 2 — da confermare).

## Lezioni di questa unità
- Un difetto della controprova non era visto perché IL CAMPIONE non lo
  metteva alla prova: la lunghezza delle liste era su un byte, che non ha
  ordine dei byte. Si è corretto il campione (4 byte, big endian), non
  l'asserzione. È la quinta causa di «non distingue» di CLAUDE.md.
- `rm -f $VAR/*.ply` viene fermato dal controllo di sicurezza (variabile che
  potrebbe essere vuota): non serve aggirarlo — `cp` sovrascrive gli stessi
  nomi. Quando serve davvero: `"${VAR:?}"/…` o un percorso scritto.

## Come si rigenerano i campioni
    <venv con plyfile==1.1 e numpy>/bin/python apps/deepwork-id/tests/campioni/ply-da-plyfile/genera.py apps/deepwork-id/tests/campioni/ply-da-plyfile

## Stato roadmap
Chiusa «il lettore delle nuvole PLY contro file scritti da un altro
programma». Del «metodo nuovo» sui file di scambio non resta aperto niente
che non dipenda dal fondatore (LAZ: decisione 34). Ferma: «il piede che esce
dalla faccia» (decisione 35).

## Prossimo passo atomico
**Lo stesso metodo sugli altri due file che Genesi SCRIVE e un altro
programma legge: il piano d'innesco XML e i CSV.**
1. XML (`xmlPianoInnesco` in genesi-data.js): farlo leggere a un parser XML
   severo che non sia il nostro — in Python `xml.etree.ElementTree` /
   `xml.dom.minidom` (libreria standard: nessuna installazione). Casi: nomi
   di fori ed esplosivi con `&`, `<`, `"`, accenti; valori `null`; un foro
   scarico. Domande: è XML ben formato? la dichiarazione di codifica c'è e
   corrisponde ai byte? ogni attributo/tag numerico si rilegge come numero?
2. CSV (piano di carico, scheda volata, confronto A/B, file per Sentinella):
   farli leggere al modulo `csv` di Python col dialetto `;` — un nome con
   `;`, virgolette, a capo; e controllare il BOM/la codifica (Excel in
   italiano apre un CSV UTF-8 senza BOM con gli accenti storpiati: da
   MISURARE con `open(encoding='cp1252')`, non da presumere — e se è così è
   una scelta da portare al fondatore, perché il BOM cambia il file per chi
   lo legge con un programma).
3. Stessa forma di `dxf-nostro-da-cad.mjs`: ingressi in `casi.mjs`, file e
   lettura committati, suite che pretende byte identici + lettura giusta.

## Blocchi (del fondatore)
Decisioni 28, 33 (⚠ quale foro usa la gittata), 34 (lettore LAZ), 35 (spalla
al piede); 32 rimandata.
