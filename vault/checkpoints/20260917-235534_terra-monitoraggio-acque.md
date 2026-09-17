# Checkpoint — 2026-09-17T23:55:34Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
b81b6774

## Cosa è stato completato
Chiusa l'unità Terra rimasta a metà da prima del blocco Genesi: nuova
voce "acque" (monitoraggio falda/piezometri) in `TIPI_SCADENZA_TERRA`,
dall'ottavo giro di ricerca mirata (riverificato con grep indipendente
prima di implementare). Proposta a costo medio (`letturaFalda`/
`francoFalda`) resta esplicitamente aperta per un'unità propria. Giro
isolato: 41/41, 4106 asserzioni, KPI 3119/3119.

Nota tecnica di processo: questa unità era rimasta "a cavallo" fra il
lavoro su Sentinella/Conti/Scudo/Genesi di oggi perché tutte condividono
`run-kpi.mjs`. Risolto separando gli hunk con `git hash-object -w` +
`git update-index --cacheinfo` invece di mescolare due unità in un
commit solo — tecnica utile da ricordare per la prossima volta che due
unità toccano lo stesso file condiviso in parallelo.

In parallelo (background, completati):
- Ricerca continua su Scudo (agente acc9f17fadd844d08): dodicesimo giro,
  angolo scelto l'Accordo Stato-Regioni 17/04/2025 sulla formazione
  (FAD sincrona/asincrona, mai trattato prima). Due proposte: (1)
  tracciare la modalità di erogazione dei corso (FAD/aula), oggi assente
  del tutto; (2) il preset `patentino-attr` cita ancora l'Accordo del
  2012 superato, senza dichiarare il limite di aggiornamento. Nessun
  codice toccato, solo append di ricerca.
- Terzo giro deep-pass su Terra (agente a82876ad086170520): dispatchato,
  esito non ancora arrivato.

## Stato roadmap
Terzo giro di deep-pass: Sentinella ✅, Conti ✅, Scudo ✅, Genesi ✅.
Flotta: due difetti trovati (agente aff43964bd31baec6), NON ANCORA
FIXATI — è il prossimo passo atomico. Terra: terzo giro in corso
(background).

## Prossimo passo atomico
**Fixare i due difetti Flotta** (agente aff43964bd31baec6, report già
ricevuto in questa sessione):
1. Il punto decimale inglese non tolto da 4-5 colonne/file: 
   `csvRegistroInterventi` (costo/ore_manodopera/costo_manodopera,
   `apps/flotta/flotta-data.js` righe ~937-939), `csvLibretto` (colonna
   `importo` del suo helper `R()`, riga ~1046, usata da più righe:
   possesso ~1055, rifornimento ~1089-1091, totale officina ~1104-1108),
   `csvRicambi` (riga ~1176), `csvListaDellaSpesa` (consumo_al_giorno,
   righe ~954-961), `csvCosti` (riga ~853). Tutte vanno formattate con
   la stessa convenzione italiana già usata nello stesso file
   (`mostra()`/`oreLavoroTesto()`), non interpolate grezze con
   `numeroDichiarato`/concatenazione diretta. La correzione di oggi
   (17/09) ha sistemato SOLO la riga del consumo/litri in `csvLibretto`:
   questa è la "metà mancante" della stessa famiglia di difetto.
2. `vitaComponenti` (`apps/flotta/flotta-data.js:2922-2932`) ignora la
   sostituzione del contatore: legge `m.ore` diretto invece di passare
   da `spezzaLetture`/`trattoCorrente`/`contatoreDelTagliando` come fanno
   già `consumoPerMezzo`/`ritmoOreMezzi`/i tagliandi a ore. Un contatore
   sostituito (rifornimento con `contatoreNuovo:true`, index.html:5150)
   produce un "vita" falsamente basso (es. "200 H" invece di ~6.070h) o,
   quando la sottrazione diventa negativa per caso, un "dato da
   controllare" con la spiegazione SBAGLIATA (sembra un errore
   dell'utente, è un contatore sostituito).
Per ognuno: fix + banco con controprova (iniettando nella risposta HTTP,
mai sul file), poi il solito ciclo giro isolato → commit → checkpoint.

Poi: riverificare l'esito del terzo giro deep-pass Terra quando arriva,
continuare a mantenere ≥3 cantieri paralleli, proseguire la rotazione di
ricerca continua (prossimo il più stale fra i rimanenti).

## Blocchi
Nessuno.
