# Checkpoint — il giro che resta verde anche se sbagliano tutt'e due

- **Tipo**: unità (12 prove sul CSV del registro volate) + una lezione di metodo
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `b7f6ccd`

## L'unità

Il CSV è il modo in cui i dati **escono** dall'app e **rientrano**: nel backup
dell'azienda, nel file che Genesi manda a Sentinella, nel foglio che qualcuno
apre per controllare. Una colonna spostata è il modo più **silenzioso** di
perdere un registro: nessun errore, solo righe che rientrano diverse da come
sono uscite.

La prima prova è quella che conta: **si scrive, si rilegge, e si pretende che
torni identico** su 19 campi — con un fronte che contiene sia le virgolette sia
il punto e virgola separatore (`Fronte "A"; nord`), cioè esattamente il testo
che spaccherebbe un lettore ingenuo.

Le altre bloccano:

- una cella che comincia per `=` **non diventa una formula** quando il file si
  apre in Excel: è la strada con cui un file di dati diventa un programma;
- **lo stato attraversa il giro**, così progetto ed evento restano distinti;
- la **PPV prevista** non rientra nelle colonne della misurata;
- **l'id del punto di misura non viaggia nel file**: un id è vero solo dentro
  l'organizzazione che l'ha scritto, nel file resta il **nome**;
- un file **vecchio**, senza le undici colonne nate dopo, si importa come prima;
- un registro **vuoto** è l'intestazione da sola, non un file di zero byte che
  sembra un export fallito.

## ⚠️ La lezione, uscita dalla controprova

Ho provato a rimettere il difetto «i numeri scritti all'italiana in un file per
macchine» — virgola invece del punto. La controprova ha risposto **«non
distingue»**.

E non era né una prova vacua né difesa in profondità: era una **terza** ragione.
Il giro resta identico perché il **lettore usa `numIt`**, che la virgola la
legge benissimo. Scrittore e lettore vanno d'accordo **fra loro**, e il giro non
può accorgersi di niente: misura la loro coerenza reciproca, non la correttezza
del formato per **chi il file lo apre con un altro programma**.

La difesa è un'asserzione sul **testo** del file (`;3.2;`), che infatti esisteva
già fra le dodici — ed è quella che cade. Ora la ragione è scritta sia nel file
di prova sia in `CLAUDE.md`, perché vale per qualunque coppia scrivi/leggi,
cifra/decifra, serializza/deserializza: **una prova di andata e ritorno resta
verde se le due metà sbagliano insieme.**

Controprova finale: **8 difetti rimessi, 8 visti, 0 non visti.** Uno si è
fermato da solo perché l'ancora compariva due volte nel file — la difesa
scritta stamattina che continua a lavorare.

## Stato

- **646** KPI (433 all'inizio della giornata) → **929** prove `node`, verdi in
  UTC **e** in ora italiana
- **213 prove nuove** in giornata, **6 difetti di prodotto** corretti
- `CLAUDE.md` ha quattro lezioni nuove in giornata, tutte nate da una
  controprova che ha detto qualcosa che non ci si aspettava

## Prossimo passo atomico

Restano scoperti in Sentinella i **reclami** (`riepilogoReclami`,
`etichettaReclamo`, `TIPI_RECLAMO`, `bozzaAzioneReclamo`) e `serieStorica` /
`leggiCsv`. Il reclamo di un residente è l'altro ingresso del ponte verso Scudo,
e `bozzaAzioneReclamo` è l'unica delle due bozze ancora senza prove.

## Bloccanti

- Nessuno.
