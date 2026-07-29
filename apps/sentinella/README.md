# Sentinella

App ambiente / HSE. Buyer: responsabile HSE.

Sentinella **non misura**: registra i valori che arrivano dagli strumenti
(sismografi, fonometri, centraline) o inseriti a mano, li confronta con la
soglia impostata dall'azienda e li documenta. Ogni soglia resta un valore
scelto dall'utente, mai «un limite di legge».

## Schermate

| Schermata | Cosa c'è |
|---|---|
| **Quadro** | KPI, cartellone di conformità, il punto messo peggio in miniatura, allerte |
| **Monitoraggi** | punti di misura + serie storica, registrazione misure, **import letture da CSV**, **anagrafica ricettori**, distanza scalata |
| **Adempimenti** | scadenze ambientali con ente e giorni mancanti, import CSV |
| **Registri** | registri, registro volate, **registro reclami ed esposti**, export CSV |
| **Report** | **report di conformità stampabile** (periodo, ricettore, esito) |

## I quattro pezzi del blocco 2

### Import delle letture (CSV)
Gli strumenti esportano formati tutti diversi, quindi il file si legge
com'è e **le colonne le sceglie l'utente**. Il lettore CSV è scritto in
casa (`leggiCsv` in `sentinella-data.js`): nessuna libreria, nessun CDN,
tutto nel browser. Regge separatore `;` `,` e tabulazione, campi tra
virgolette (anche con a capo dentro), BOM, e la **virgola decimale**
(`4,8` → `4.8`, via `numIt` dello SDK). Le date si leggono in
**giorno/mese** (formato italiano): `12/07/2026`, `12-07-2026`,
`12.07.2026`, `2026-07-12`, anche con l'ora attaccata.

Prima di scrivere qualcosa compare l'**anteprima**: riga per riga si vede
cosa entra, cosa è un doppione e cosa viene scartato **con il motivo**.
I duplicati (stessa data+ora+valore) vengono saltati sia rispetto allo
storico già presente sia dentro lo stesso file, così reimportare due
volte lo stesso export non raddoppia la serie. Si tengono le ultime
`MAX_LETTURE` (500) letture per punto.

### Anagrafica ricettori
Il **ricettore** è il punto sensibile da proteggere: casa, scuola,
confine. Porta tipo, distanza dalla cava, classe acustica (DPCM
14/11/1997, solo descrittiva) e, se l'utente la imposta, la **soglia
propria** — quella scritta nell'autorizzazione per quella casa.

Regola applicata da `sogliaEfficace()`: se il punto di misura è collegato
a un ricettore che ha una soglia propria **e la stessa unità di misura**,
vince quella del ricettore. Se le unità non coincidono **non si converte
niente**: vale la soglia del punto e il conflitto viene scritto sia
nell'elenco sia nel report. Una conversione indovinata su un valore di
sicurezza sarebbe un errore grave.

### Report di conformità
È il documento che si consegna all'ente: periodo, ricettore, letture,
**soglia applicata e da dove viene**, superamenti, esito
(conforme / non conforme / senza dati), più reclami e volate del periodo
come contesto. Sullo schermo è una scheda Deepwork; con **Stampa** le
regole `@media print` lo trasformano in un A4 su carta bianca (barra,
menu e comandi spariscono, i grafici passano a inchiostri leggibili).
Nessuna libreria PDF: si usa la stampa del browser → «Salva come PDF».

### Registro reclami ed esposti
Giorno, ora, tipo, ricettore, chi ha segnalato, cosa è stato fatto,
aperto/chiuso. I reclami del periodo compaiono nel report accanto alle
misure di quei giorni.

## Regole rispettate

- **Soglie di sicurezza**: i preset normativi (`SOGLIE_PRESET`, DIN 4150-3 /
  USBM / PM10) sono **invariati**. La novità è solo la soglia per ricettore,
  impostata dall'utente.
- **Unità mai in maiuscolo**: `text-transform:uppercase` trasformerebbe
  `µg/m³` in `MG/M³` (milligrammi, mille volte tanto). Su un documento che
  va all'ente sarebbe un errore, quindi le unità escono dal maiuscolo
  (`.tab th .u`, `.graf-axlab`, override locale di `.dwg-axlab`).
- Niente `alert()`/`confirm()`/`prompt()`: toast e modale del core.
- I messaggi passati a `esito()`/`toast()` sono **testo semplice** (finiscono
  in `textContent`): l'HTML ci comparirebbe scritto.
- Grafici con `dwGrafici` (`shared/dw-grafici.js`), senza modificare
  `shared/`: un solo asse verticale, punti fuori soglia a rombo, etichette
  dei tempi corte (`GG/MM`) perché il motore non le dirada per larghezza.
- Ogni accesso dati passa dallo SDK (`orgCollection`): collezioni
  `monitoraggi`, `adempimenti`, `registri`, `volate`, `ricettori`, `reclami`.

## Verifiche

- Sintassi: script inline estratti e passati a `node --check` /
  `node --input-type=module --check`.
- Funzioni pure: 22 test su lettore CSV, date, mappatura colonne,
  duplicati, soglia efficace e report.
- Prova visiva: server statico + Chromium headless (telefono 360/390 px,
  desktop 1280 px) e **PDF A4 reale** generato con `page.pdf()` per
  controllare la stampa.
