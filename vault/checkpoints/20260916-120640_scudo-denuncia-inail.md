# Checkpoint — 2026-09-16T12:06:40Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
ad432b2b

## Cosa completato
- Dal delta della ricerca continua su Scudo (letto e riverificato
  indipendentemente prima di scrivere: `grep -ciE
  "scadenzaDenunciaInail|denunciaData|denunciaNumero|dataCertificato"` →
  0 su entrambi i file): **la scadenza della denuncia INAIL di un
  infortunio** (D.P.R. 1124/1965, art. 53) — la norma col termine più
  stretto di tutto lo scadenzario, e nessuna traccia nel prodotto.
- **Verifica primaria fatta con lo strumento giusto**: WebSearch (non
  WebFetch, bloccato in questo ambiente) ha trovato il TESTO
  dell'articolo citato da brocardi.it: «la denuncia... entro due giorni
  da quello in cui il datore di lavoro ne ha avuto notizia... Se si
  tratta di infortunio che abbia prodotto la morte... entro
  ventiquattro ore dall'infortunio». Di seconda mano (nessuna pagina
  primaria letta), ma corroborato da tre ricerche indipendenti con lo
  stesso numero.
- `scadenzaDenunciaInail(infortunio, oggi)` in `scudo-data.js`: due
  termini, due basi. **Ordinario** (oltre 3 giorni di assenza): 2 giorni
  dalla ricezione del certificato medico (`dataCertificato`, campo
  nuovo). **Mortale**: 24 ore dall'evento — dichiarato come **MASSIMO,
  non preciso**, perché Scudo registra solo il GIORNO dell'infortunio,
  non l'ora: un conto in ore non si può fare con precisione, quindi si
  tiene il caso peggiore (il giorno dopo) e lo si dice esplicitamente
  nel `motivo`, mai un numero tranquillo su un'incertezza vera.
- **Applica la decisione 17 (l'assenza non è un dato favorevole) a un
  obbligo legale**: trovato e corretto DURANTE la stesura, prima di
  committare — la mia prima versione trattava `giorniAssenza: null`
  (prognosi ancora aperta) come "non pertinente" (stesso esito di sotto
  i 3 giorni), che è esattamente il difetto che la decisione 17 esiste
  per correggere altrove nello stesso modulo. Corretto: `null` è
  "pertinente ma non calcolabile — non si sa ancora", un `motivo`
  diverso da "manca il certificato". Verificato con controprova.
- Una denuncia già presentata (`denunciaData`/`denunciaNumero`) chiude
  la domanda invece di inseguire una scadenza.
- Wired: tre campi nuovi nel form "Registra evento" (rilevanti solo per
  un infortunio), nota testuale nel registro degli eventi e nel modale
  di analisi. **Limite dichiarato**: il registro è di sola aggiunta,
  quindi non c'è modo di scrivere queste date DOPO la registrazione
  iniziale — non diverso da come funziona il resto del registro oggi,
  ma va detto per chi riprenderà il lavoro.
- Test completi in `run-kpi.mjs` (near-miss/sotto-soglia non pertinenti,
  prognosi aperta vs manca-certificato, termine ordinario mai dedotto
  dalla data dell'evento, termine mortale col caso peggiore dichiarato,
  denuncia già presentata, verifica sulla dimostrazione).
- Banco browser nuovo `scudo-denuncia-inail.mjs` + `tutti.mjs`: i casi
  reali della dimostrazione (i2/i7/i9 "manca il certificato", i8
  "prognosi aperta") non si scambiano mai la ragione — 10/10 normale,
  controprova 3/3.
- `copertura-funzioni.mjs`: FONDO scudo 232→233.
- Doc-cascade: run-kpi 3088→3094, nove suite 3.582→3.588, copertura sei
  app 1042/1042→1043/1043, giro completo 4059→4066, banchi browser
  313→315 esecuzioni / 136→137 file distinti. **Doppio giro isolato**:
  il primo ha corretto uno scarto di un'unità sul totale previsto (4065
  stimato, 4066 vero — un'altra suite di conteggio-file è salita di uno
  nello stesso passaggio, non ricontrollato nel dettaglio), il secondo
  confermato pulito: 40/40 comandi, 4066 asserzioni, 0 caduti.
- Commit `ad432b2b`, pushato.

## Nota collaterale (non ancora committata)
Durante l'attesa di questa unità ho anche riverificato indipendentemente
la ricerca continua su Conti (decimo giro): **tutte e quattro le sue
mancanze erano già implementate** prima che il documento finisse di
scrivere il proprio riepilogo (`statoPianoRientro`, `concentrazionePortafoglio`,
`scontoCassaMaturato`, `statoRecupero` — commit verificati con `git log
-S`). Nota di chiusura già scritta in `docs/RICERCA_CONTINUA_CONTI.md`
ma **non ancora committata** — resta come lavoro sul disco.

## Stato roadmap
Scudo: chiuso un delta reale della ricerca continua con verifica primaria
del testo di legge. Conti: documento di ricerca corretto (nota scritta,
da committare). Assenza: D2 e P4 chiuse in unità precedenti.

## Prossimo passo atomico
1. Committare la nota di chiusura di `docs/RICERCA_CONTINUA_CONTI.md`
   (già scritta sul disco) insieme a un eventuale checkpoint dedicato, o
   in coda alla prossima unità.
2. Aggiornare `docs/RICERCA_CONTINUA_SCUDO.md` con la nota di chiusura
   per la denuncia INAIL (non ancora fatto — pendente, va fatto prima di
   aprire una nuova unità su Scudo per non farlo invecchiare).
3. Scegliere fra: nuova ricerca continua su Core/DeepworkID (ferme al
   03/09, le più indietro), oppure proseguire con P2/P3 di ASSENZA
   (richiedono una decisione di design prima di scomporle).
4. Non fermarsi qui per la regola del fondatore (esaurimento crediti):
   proseguire immediatamente con l'unità successiva.

## Blocchi
Nessuno.
