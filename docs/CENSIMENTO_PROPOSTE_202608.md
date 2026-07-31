# Che cosa resta davvero da fare, app per app

*Censito il 03/08 confrontando ogni scheda di ricerca col codice vero, non con
la memoria. Sei letture indipendenti, una per app, con l'obbligo di portare la
**prova concreta** (file e riga) di ogni «fatta».*

> **Perché è servito.** Le schede `docs/RICERCA_*_202607.md` sono state scritte
> il 27/07, quando le app erano molto più piccole — Conti aveva «~460 righe»,
> oggi 3.679; Sentinella 509, oggi 3.818. Gran parte delle proposte è stata
> costruita **dopo**, e leggere le schede come se fossero ancora attuali porta
> a rifare cose fatte e a non vedere quelle rimaste.

## Il bilancio, in una tabella

| app | fatte | parziali | da fare | su |
|---|---|---|---|---|
| **Campo** | 14 | 2 | 4 | 20 |
| **Conti** | 11 | 3 | 6 | 20 |
| **Flotta** | 8 | 2 | 2 | 12 |
| **Scudo** | 7 | 6 | 5 | 18 |
| **Sentinella** | 8 | 4 | 3 | 15 |
| **Terra** | 8 | 4 | 4 | 16 |

*(I numeri sono quelli del censimento, aggiornati con le unità chiuse il 03/08:
Campo #7 disponibilità, Sentinella #5 report, Flotta #8 segnalazione guasto,
Conti #1 sconto cliente, Terra/Conti #7 oneri.)*

---

## Le tre cose che valgono più di una tabella

### 1. Conti — lo sconto del cliente non veniva applicato *(chiuso il 03/08)*

La scheda cliente diceva «sconto 5%», l'app lo salvava, lo mostrava, lo
esportava — e ogni DDT usciva al **prezzo pieno**. Su una differita vera:
**1.375,91 €** in più su un mese. Non era una funzione mancante, era una
**promessa scritta nell'interfaccia che il documento non manteneva**.

### 2. Scudo — le due proposte rimaste in cima sono bloccate dalla stessa cosa

`#2` (foto nella segnalazione near-miss) e `#4` (foto per voce di checklist)
sono entrambe **parziali per un solo motivo: la foto**. E più immagini dentro
un solo documento Firestore sfondano il limite. Chiuderle bene vuol dire prima
decidere su **Firebase Storage**, che è un piano a pagamento — quindi una
**decisione del fondatore**, non una scelta tecnica.

### 3. Terra — le due voci che valgono di più non sono le più facili

`#8` (piano di coltivazione a **lotti**) e `#9` (**ripristino ambientale**)
sono le uniche completamente da fare in priorità 2, e sono **legate**: il
ripristino si misura per lotto. Se il metro è il valore per il cliente e non il
numero di caselle chiuse, valgono più delle rifiniture che le precedono in
elenco.

---

## Campo — 14 fatte, 2 parziali, 4 da fare

**Fatte:** data e turno su ogni registrazione · produzione in numeri ·
salvataggio del piano di carico · chi fa cosa · obiettivo di turno e scostamento ·
archivio dei giorni e storico settimana · **disponibilità di turno** *(03/08)* ·
checklist di inizio turno · presenze del turno · foto sull'anomalia · meteo e
condizioni · firma e chiusura del turno.

**Parziali:**
- **offline vero** — è il buco più serio: chi apre `/apps/campo/` senza passare
  dalla radice non ha **nessun service worker**, e Firestore gira senza cache
  persistente. Tocca anche un file condiviso: da fare con cautela;
- **rapporto di turno più ricco** — manca il piano di carico.

**Da fare:** evento di sicurezza dal campo → Scudo.
⚠️ **Correzione al censimento, dalla ricerca del 04/08**
(`docs/RICERCA_EVENTO_SICUREZZA_DAL_CAMPO_202608.md`): qui c'era scritto «con le
domande sui permessi Firestore che si porta dietro». **Quelle domande non ci
sono**: Sentinella scrive già dentro Scudo (`ponteScudo`), e le regole
permettono a **qualunque membro dell'organizzazione** di scrivere sotto
qualunque `appId` — nessuna regola nuova. E la ricerca ha trovato una cosa che
il censimento non poteva sapere: dal **29/12/2025** (art. 15 D.L. 159/2025,
convertito con L. 198/2025) le imprese con **più di quindici dipendenti** devono
**comunicare i dati aggregati dei mancati infortuni** e le azioni correttive.
Scudo ha già near-miss e CAPA: **manca il foglio da consegnare**. La voce sale
di priorità e va pensata insieme al prospetto · anomalia mezzo → Flotta · giro del sorvegliante · causali di
fermo a due livelli · piano squadre settimanale · controllo di metà turno.

## Conti — 11 fatte, 3 parziali, 6 da fare

**Fatte:** listino prodotti · registro pesate/DDT · fattura differita dai DDT ·
fattura con imponibile e IVA · fido e rischio cliente · incassi parziali e
acconti · canone di escavazione *(con le due basi, 03/08)* · ponte Terra → Conti ·
export commercialista · **anagrafica clienti** *(chiusa il 03/08 con lo sconto)*.

**Parziali:** statistiche di vendita (solo per prodotto e solo sull'anno
corrente, cablato) · stampa PDF di cortesia (l'estratto conto non è stampabile) ·
termini di pagamento per cliente.

**Da fare, in ordine di peso:**
1. **note di credito** — oggi l'unico modo di annullare una fattura emessa è
   **eliminarla**, e l'app stessa scrive che è sbagliato. Serve un documento di
   storno con numerazione propria, che riduca l'esposizione senza cancellare
   niente. Tocca `statoIncasso`, `apertoDi`, `esposizioneClienti`.
   → **ricercata il 03/08**: `docs/RICERCA_NOTE_DI_CREDITO_202608.md`;
2. **registro costi / uscite** — è la porta d'ingresso obbligata: senza costi,
   marginalità e pareggio non possono nemmeno cominciare, e Conti resta capace
   di dire quanto incassi, mai se **guadagni**.
   ⚠️ **Correzione al censimento, dalla ricerca del 03/08**
   (`docs/RICERCA_REGISTRO_COSTI_202608.md`): questa voce era scritta come se si
   partisse da zero, e **non è vero** — un registro costi nell'ecosistema **c'è
   già, in Flotta** (`costi/{voce, importo, nota, data|null}`, con
   `ripartizioneCosti` e `costiPerMese`). Il lavoro non è quindi «scriverne
   uno», che sarebbe la duplicazione vietata: è **estenderlo** a ciò che quello
   di Flotta non può tenere (personale, energia, esplosivo, canone, ripristino)
   e collegarlo alla produzione, con la classificazione in `shared/`;
3. costo/t e marginalità per prodotto · break-even mensile · XML FatturaPA ·
   trasporto a fasce di km · storico solleciti · backup completo.

## Flotta — 8 fatte, 2 parziali, 2 da fare

**Fatte:** scadenze di legge · controllo pre-uso (giro macchina) · piani
ricorrenti · scheda del mezzo · ordine di lavoro completo · riordino ricambi ·
fermi macchina e affidabilità · **segnalazione guasto rapida** *(03/08)*.

**Parziali:** carburante per mezzo (manca il confronto di ogni macchina con la
**propria** media storica, non con le altre) · costo totale e costo orario per
mezzo (i pezzi ci sono e sono sparsi: officina in un grafico, gasolio nella
scheda, e un `speso` calcolato che **non è mostrato da nessuna parte**).

**Da fare:** chi può usare cosa (ponte con Scudo) · import telemetria più
tollerante (oggi tre colonne posizionali fisse, e il campo `carburante` viene
letto e **buttato**).

## Scudo — 7 fatte, 6 parziali, 5 da fare

**Fatte:** azioni correttive (CAPA) · riepilogo near-miss aggregato · matrice
formazione per mansione · registro DPI · nomine e organigramma · adempimenti
cava nello scadenzario.

**Parziali:** near-miss rapido e checklist periodiche (**la foto**, vedi sopra) ·
registro esposti · verbali riunione ed emergenze · cartella lavoratore
stampabile (oggi stampa **solo i DPI**) · attrezzature e verifiche periodiche.

**Da fare:** analisi causa-radice (5 Perché) · indici infortunistici
(IF, IG, LTIFR) · anagrafica appaltatori · briefing/toolbox talk · permessi di
lavoro · funzionamento offline.

## Sentinella — 8 fatte, 4 parziali, 3 da fare

**Fatte:** serie storica con grafico · import CSV delle letture · anagrafica
ricettori · ponte Genesi → Sentinella · registro reclami/esposti · taratura del
sito (K e β) · **report di conformità** *(chiuso il 03/08 con previsto,
misurato, scarto e norma citata)*.

**Parziali:** regole di allarme (le primitive di calcolo esistono e sono pure,
ma nessuna produce un **allarme**) · scadenze ricorrenti (la periodicità esiste
solo per il programma di monitoraggio; gli adempimenti si **cancellano** e si
riaggiungono a mano — ed è la più economica del gruppo, perché `PERIODICITA` e
`piuGiorni` sono già scritte e collaudate) · registro azioni di mitigazione ·
scheda «le mie soglie».

**Da fare:** fascicolo campionamenti acque · meteo dell'evento · deroghe rumore.

⛔ **Limite per frequenza (curva DIN/USBM)** — segnalato e basta. Riprogetterebbe
le **soglie di sicurezza** e i valori di default sensibili: va deciso dal
fondatore, con i valori confermati a monte.

## Terra — 8 fatte, 4 parziali, 4 da fare

**Fatte:** scheda autorizzazione · contatore vita cava · scadenzario ·
riepilogo annuale volumi · verbale di rilievo stampabile · confronto fra due
rilievi.

**Parziali:** provenienza del volume dal visore (la domanda scavo/cumulo c'è ed
è fatta bene, ma **nessun metadato di provenienza viene salvato**: né lato
cella, né quota di base, né punti del ritaglio — **ricercata il 03/08**,
`docs/RICERCA_TRACCIABILITA_VOLUME_202608.md`: quei parametri sono **già
calcolati** da `volumeCumulo` e buttati una riga dopo, e il lato cella da solo
sposta il volume del **22%**) · riconciliazione con Conti (in
Terra **non c'è**: vive solo dentro Conti, e il direttore di cava che apre Terra
non la vede) · **oneri di escavazione** *(la base ora esiste davvero, 03/08)* ·
timeline dell'avanzamento (`serieAnnuale` produce già il cumulato, ma è
renderizzato come lista invece che come curva).

**Da fare:** piano di coltivazione a lotti · ripristino ambientale · quote di
progetto per banco · curve di livello del ritaglio · mappa cut/fill.

---

## Come è stato fatto questo censimento

Sei letture **indipendenti e in sola lettura**, una per app, ognuna con
l'obbligo di portare la prova concreta di ogni «fatta» — file e riga, o nome di
funzione — e con l'istruzione esplicita di **non arrotondare a FATTA** ciò che
è a metà.

Il metodo ha già pagato: tutte e sei le letture hanno aperto dicendo che la
scheda era **superata dai fatti**, e due hanno trovato difetti che nessuno
cercava (lo sconto mai applicato in Conti, i metadati mai salvati in Terra).
Un censimento fatto a memoria non li avrebbe visti.
