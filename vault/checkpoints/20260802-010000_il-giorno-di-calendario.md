# Checkpoint — il giorno di calendario si legge in ora locale, ovunque

- **Tipo**: unità grossa (**il terzo e il quarto difetto di prodotto** della
  giornata, più il cantiere che li conteneva)
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `8203350` (la regola in `shared/`), `bb8b881` (le 40 correzioni)

## Cosa è successo, in breve

Il contenitore è in **UTC**, le cave sono in **Italia**. `toISOString()` scrive
sempre l'istante in UTC: mezzanotte del 1° maggio a Roma è ancora **le 22:00 del
30 aprile** a Greenwich. Prendere il giorno (o il mese) da lì sposta il
calendario, e in questo progetto lo spostava in **40 punti** su 12 superfici.

## I tre che sbagliavano SEMPRE

1. **Il grafico «ultimi 6 mesi» del core.** La chiave con cui si raccolgono i
   dati era il mese UTC, l'etichetta che l'utente legge era quella locale: la
   barra scritta «mag» conteneva la produzione di **aprile**. Misurato in un
   browser vero con l'orologio di Roma, dentro la pagina del core:
   **6 barre su 6 col mese sbagliato**. In due schermate (scheda cava e gemello
   digitale), tutto l'anno, per tutti gli utenti italiani.
2. **Le scadenze delle fatture di Conti**, un giorno prima tutto l'anno: 01/07 a
   30 giorni proponeva il **30/07**. Su un documento fiscale, e su un conto che
   poi diventa «giorni di ritardo» nel sollecito.
3. **La finestra di `ritmoMedioAnnuo` in Terra**, che non vedeva il rilievo di
   oggi — ed è il conto che stima *quando finisce il volume concesso*.

## I sei della categoria B

«Fra mezzanotte e le due» in un ufficio è un caso di bordo. In una cava col
**turno di notte** è l'orario in cui si scrive il rapportino: il core lo datava
al giorno prima, Conti faceva lo stesso con la fattura, e Terra arrivava a
**rifiutare** un rilievo di oggi dicendo che era «nel futuro».

## Le due cose uscite solo perché il controllo è stato scritto

Questa è la parte che vale più delle correzioni.

- **La settima copia.** `oggiIso` esisteva anche in
  `apps/flotta/flotta-data.js`, e nel censimento fatto a mano non c'era: sei
  copie contate leggendo, **sette** contate dalla regola nuova.
- **Un difetto in più in `shared/dw-ponti.js`.**
  `avanzamentoDaUltimoRilievo` chiudeva la finestra col giorno **UTC** di un
  «oggi» locale: fra mezzanotte e le due l'estremo alto era ieri, e con un
  rilievo di ieri `dal > al` faceva tornare `null` — cioè il riquadro
  dell'avanzamento **spariva dalla pagina**.

## Quello che NON si è toccato

`piuGiorni` di Sentinella e i due intervalli di `dw-ponti.js` costruiscono la
data con `"T00:00:00Z"` e la spostano con `setUTCDate`: entrano ed escono in
UTC, e **sono giusti così**. Una sostituzione in blocco avrebbe introdotto il
difetto che si voleva togliere. La regola 15 lo sa: perdona la riga che porta un
segno esplicito di UTC nelle tre righe precedenti.

## Cosa resta a difendere il lavoro

- **`isoLocale` / `oggiISO` / `meseLocale` / `timbroLocale` in `shared/`**, e
  sette app che **ri-esportano**. Il test pretende l'**identità**
  (`campo.oggiISO === shell.oggiISO`), non il comportamento.
- **`orologio-cliente.mjs`**, in coda alla suite di CI: rilancia le tre suite
  `node` sensibili alla data con `TZ=Europe/Rome`. Non duplica prove — rilancia
  le stesse in un ambiente in cui possono fallire diversamente. Provato contro
  il difetto: rimesse le due righe di prima in Terra diventa rosso e nomina le
  due prove, mentre in UTC lo stesso difetto resta invisibile.
- **La regola 15 di `run-stile.mjs`**, che guarda 21 file e lo stampa.

## Verifica

- sei suite `node` verdi: KPI **610**, Stile **201**, Helper 43, pointcloud 23,
  manifest 9, demo 7
- `orologio-cliente`: 3 suite in ora italiana, 0 cadute
- 9 moduli delle pagine controllati per sintassi
- un giro del browser che apre **tutte e nove** le superfici: nessun errore di
  console, nessuna pagina morta

## Stato

- **610** KPI (433 all'inizio della giornata) → **893** prove `node`
- **177 prove nuove** in giornata, **4 difetti di prodotto** trovati e corretti,
  **1** ancora in coda, **1 prova vacua** corretta

## Prossimo passo atomico

Le due correzioni rimaste in coda, ognuna con la prova che nasce rossa:

1. `preparaLetture` di Sentinella — l'ora cercata **anche** nella cella della
   data quando la colonna scelta è vuota: senza, due misure dello stesso giorno
   con lo stesso valore diventano una sola, e l'interfaccia annuncia «1 doppione
   scartato» dicendo una cosa non vera;
2. `apps/flotta/index.html` ~1397/1401 — lo zero di comodo che scrive «X ha 0
   ore: il tagliando è proposto a 500» su un mezzo di cui non sappiamo le ore.

## Bloccanti

- Nessuno.
