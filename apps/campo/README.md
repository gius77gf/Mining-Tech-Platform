# Campo

App operativo campo. Buyer: capocantiere.
Si usa in cava, spesso dal telefono e con i guanti: bersagli grandi, poche
digitazioni, tutto a pochi tocchi.

Schermate (barra in basso): **Quadro** · **Attività** · **Squadre** ·
**Turno** · **Storico**.

## Cosa fa

**Quadro** — i quattro numeri della giornata, l'avanzamento delle attività,
l'obiettivo del turno con quanto manca, e **Cosa tocca a me**: si dice una
volta qual è la propria squadra (e, se si vuole, il proprio nome) e restano
solo le attività che tocca a chi guarda. La scelta resta sul telefono di chi
la fa (localStorage), non è un dato dell'organizzazione.

**Attività** — le attività della giornata con giorno di lavoro e turno, stato
che avanza toccando la riga (pianificata → in corso → conclusa), causale e
minuti di fermo sull'anomalia, Pareto dei fermi e fermi giorno per giorno.
Ogni attività si **assegna a una squadra** e, se serve, a una **persona**; il
filtro *Senza squadra* mostra ciò che non sta facendo nessuno.
Su un'anomalia si può allegare una **foto**: si sceglie dal telefono, il
browser la **rimpicciolisce da solo** con il canvas (lato lungo max 1280 px,
sotto i 280 kB) e salva solo la versione piccola — così entra anche con la
rete della cava. Si guarda in grande con un tocco e si può togliere. Nessun
servizio esterno: tutto in locale.

**Squadre** — le squadre (con il carico di lavoro di oggi: aperte e concluse)
e l'anagrafica minima delle persone: nome, ruolo, squadra, disponibilità.
Chi è segnato non disponibile non compare fra le persone assegnabili.
Import/export CSV delle squadre.

**Turno** — nell'ordine in cui si lavora davvero. Squadra e turno si scelgono
una volta in cima alla pagina e valgono per checklist, appello e chiusura.
1. **Checklist di inizio turno**: nove controlli (persone, mezzi, area,
   emergenza), tre risposte grandi per voce (a posto / non a posto / N.A.),
   salvataggio immediato a ogni tocco, chiusura con l'ora. Cambiare una
   risposta dopo la chiusura la riapre.
2. **Chi c'è oggi** — l'appello: due risposte per persona (c'è / non c'è) con
   l'ora. Chi non è ancora spuntato resta *da spuntare*: «non lo so» non è
   «non c'è», e su un appello di emergenza la differenza è tutto. Elenco
   esportabile in CSV per il punto di raccolta.
3. **Meteo e condizioni del sito**: cielo, piste, visibilità a scelte rapide
   (un tocco per voce, si salva da sé) più le note sul sito. Spiega i fermi e
   la produzione di una giornata storta, e in caso di contestazione dice
   com'era la cava quel giorno. Registrato a mano: nessun servizio meteo,
   nessun abbonamento.
4. **Obiettivo del turno**: si punta solo a ciò che l'app misura davvero —
   produzione dei rapportini (t, m³, viaggi) o attività concluse. Un obiettivo
   per turno; barra di avanzamento e scostamento a colpo d'occhio.
5. **Rapportini di turno**, copertura per squadra, totali di produzione,
   consegna di turno in testo e **rapporto di fine turno stampabile**.
6. **Chiusura del turno**: la firma della consegna — chi consegna, chi riceve,
   l'ora, le note. Senza firma il rapporto stampato porta le righe vuote da
   compilare a penna.
7. **Piano di carico** importato da Genesi, con la carica reale per foro e lo
   scostamento dal progetto.

### Il turno chiuso non si tocca più

Una firma vale qualcosa solo se, dopo la firma, il turno non cambia più.
Quando un turno (giorno + turno) è chiuso, **tutti** i punti di salvataggio
che lo riguardano rifiutano la scrittura e dicono perché: stato, causale,
minuti e foto delle attività, modifica e creazione di attività, rapportini
(creazione, invio, richiamo in bozza, eliminazione) e con essi la produzione,
checklist, appello, meteo, obiettivo del turno, import del piano di carico e
carica reale dei fori. I comandi si vedono spenti, le righe portano la
pillola **turno chiuso**.

Non è il divieto di correggere: è il divieto di correggere **di nascosto**.
Il turno si **riapre**, ma la riapertura chiede **chi** e **perché**, e resta
scritta per sempre — sotto la chiusura e dentro il rapporto di fine turno,
anche dopo che il turno è stato rifirmato.

**Compatibilità**: le registrazioni salvate prima che esistessero giorno e
turno (senza `data` o senza `turno`) non appartengono a nessun turno chiuso e
restano modificabili come sempre. Anagrafica di squadre e persone: sempre
modificabile, non è un dato di turno.

Il **rapporto di fine turno stampabile** raccoglie tutto: quadro, checklist,
meteo e condizioni del sito, personale presente, obiettivo e scostamento,
attività con chi era assegnato a cosa, fermi per causale, **foto delle
anomalie**, produzione, rapportini, firme di chiusura ed eventuali
**riaperture** (chi, quando, perché).

**Storico** — la settimana in cava: 7, 14 o 30 giorni, giornata per giornata
(prodotto, minuti di fermo, attività concluse, rapportini), grafico della
produzione per giornata ed export CSV. Toccando una giornata la si **apre**:
attività e rapportini si spostano su quel giorno.

## Come è fatto

- `index.html` — pagina autoconsistente: nessuna libreria, nessun CDN.
  Struttura estetica identica al core Deepwork (`index.html` alla radice);
  palette propria di Campo (cotto/terracotta, `docs/PALETTE_APP.md` §3.2).
  Niente `alert()`/`confirm()`/`prompt()`: si usano il toast e la modale del
  core. Grafici dal motore condiviso `shared/dw-grafici.js`.
- `campo-data.js` — accesso ai dati e **funzioni pure** (calcoli testabili
  senza browser). Ogni accesso passa da `orgCollection` dell'SDK Deepwork ID:
  isolamento totale fra organizzazioni, mai percorsi Firestore a mano.
  Senza backend l'app parte in modalità demo/tour con dati d'esempio.

Collezioni (sotto `organizations/{org}/apps/campo/`): `attivita`, `squadre`,
`operatori`, `rapportini`, `obiettivi`, `checklist`, `presenze`, `chiusure`,
`meteo`, `pianocarico`.
Il blocco delle scritture passa da **una sola** funzione pura
(`turnoChiuso(chiusure, data, turno)`): se un punto di salvataggio non passa
di lì, il blocco non serve a niente.
Il **giorno di lavoro** (`data`, formato aaaa-mm-gg) è la chiave di tutto:
senza di esso non esistono storico né conteggi veri.

## Verifiche

- Sintassi: estrarre gli script inline e passarli a
  `node --input-type=module --check`.
- Vista: server statico locale + Chromium headless, schermate a **1280px e
  390px** (in cava si guarda dal telefono), tema scuro, chiaro e sole.
- Blocco del turno chiuso: chiudere un turno e poi provare **uno per uno**
  tutti i punti di salvataggio, forzando anche i comandi disabilitati (il
  blocco deve stare nel salvataggio, non solo nell'interfaccia); poi riaprire
  e verificare che tornino modificabili e che la riapertura resti scritta.
- Compatibilità: servire alla pagina dati vecchi **senza data e senza turno**
  e verificare che restino modificabili anche a turno di oggi chiuso.
