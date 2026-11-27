# Checkpoint — Genesi: il piano d'innesco XML letto da un altro parser

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit
Quello che contiene questo file («fix(genesi): il piano d'innesco XML, letto
da un parser severo…»). Il precedente, `aeac9d56` (il lettore PLY), è
confermato dal giro `node` completo: 45 comandi a posto, 4472 asserzioni,
uscita 0.

## Che cosa è stato fatto
- `xmlPianoInnesco` fatto leggere a expat (libreria standard di Python) su
  nove casi. Ben formato, UTF-8 dichiarato e vero, numeri giusti foro per
  foro, elementi vuoti con `status="non-calcolabile"` dove il valore manca.
  **Un difetto vero**: un carattere di controllo in un nome rendeva l'intero
  piano non ben formato (il parser si fermava alla riga dell'esplosivo). E
  un surrogato rimasto solo faceva crollare l'esportazione nel browser
  («URI malformed», misurato col modulo di prima).
- `_xmlEsc` (genesi-data.js): ciò che l'XML 1.0 non ammette → spazio; mezzo
  carattere → U+FFFD. Gli altri casi escono byte per byte com'erano.
- Suite `apps/deepwork-id/tests/xml-nostro-da-altri.mjs` (21 asserzioni;
  controprova 26 su 26: 6 difetti nel modulo + 20 letture guastate) e
  `campioni/xml-nostro/` (`casi.mjs`, `scrivi.mjs`, `leggi.py`, nove `.xml`,
  `letto-da-python.json`). In `npm test`: giro da 45 a 47 comandi.
- Numeri: prove senza rete 3.761 (invariato); giro `node` 4522 (per somma:
  4472 + 21 + 26 + 3 file contati da `import-esistenti` — da confermare).

## Che cosa NON dice questa unità
Non c'è uno schema pubblico contro cui validare: il file è una bozza «in
stile IREDES», dichiarata tale. Si è provato che un parser severo lo legge e
che dice i numeri giusti, non che un programma di terzi lo accetti.

## Come si rigenerano i campioni
    node apps/deepwork-id/tests/campioni/xml-nostro/scrivi.mjs
    python3 -I apps/deepwork-id/tests/campioni/xml-nostro/leggi.py apps/deepwork-id/tests/campioni/xml-nostro
(solo libreria standard: nessuna installazione.)

## Stato roadmap
Chiusa «il piano d'innesco XML letto da un altro parser». Ferma: «il piede
che esce dalla faccia» (decisione 35).

## Prossimo passo atomico
**I CSV che Genesi scrive, letti da un altro programma** (terzo e ultimo
file «per le macchine»; stesso metodo, stessa forma).
1. Elencare i CSV che escono da Genesi e la funzione che li compone
   (`grep -n "\.csv'" apps/genesi/genesi.html`): piano di carico
   (`pianoCsvGenesi`, in `shared/dw-ponti.js` — NON si tocca), scheda
   volata, confronto A/B, file per Sentinella, legge di sito, storico.
   ⚠️ Molti sono composti NELLA PAGINA: per quelli la prima cosa da fare è
   premere il bottone vero in un banco e salvare il file — non si può
   chiamarli da `node`.
2. Farli leggere al modulo `csv` di Python col separatore `;`: un nome con
   `;`, con virgolette, con un a capo; numero di colonne costante per riga;
   una cella che comincia con `=`.
3. ⚠️ La codifica: MISURARE come li apre un programma che presume
   Windows-1252 (`open(encoding='cp1252')`): se gli accenti arrivano
   storpiati (probabile: sono UTF-8 senza BOM), NON aggiungere il BOM di
   iniziativa — cambia il file per chi lo legge con un programma (anche
   Campo e Sentinella leggono questi file): scriverlo come decisione per il
   fondatore in `docs/DECISIONI_WEEKEND.md`, con la misura.
4. Poi: seconda passata sugli scatti di ogni schermata di Genesi a 320/430
   coi valori per foro accesi.

## Blocchi (del fondatore)
Decisioni 28, 33 (⚠ quale foro usa la gittata), 34 (lettore LAZ), 35 (spalla
al piede); 32 rimandata.
