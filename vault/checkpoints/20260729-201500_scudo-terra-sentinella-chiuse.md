# Checkpoint — 29/07/2026 20:15 UTC

## Task completati
**Tutti e sei i cantieri della seconda tornata sono chiusi.** In questo
checkpoint gli ultimi tre: Scudo, Terra e Sentinella, più una correzione nel
motore condiviso che riguarda tutte le app.

| Commit | Cosa |
|---|---|
| `2e4691b` | Scudo S4+S5 — matrice formazione e nomine, registro DPI |
| `048aaee` | Terra e Sentinella — verbale di rilievo, confronto rilievi, programma di monitoraggio |
| `ea5d4c9` | **shared/dw-grafici.js** — le note automatiche non si moltiplicano più |

### Scudo — la domanda giusta
La matrice non risponde a «quali corsi ho in archivio» ma a **«chi posso
mandare a fare quel lavoro domani mattina»**, col motivo scritto: «manca
fochino», «visita medica scaduta il 10/03/2026». Dentro ci sono le nomine
obbligatorie in cava, sorvegliante e preposto.

La distinzione che la rende utile: un corso mancante o scaduto **blocca**,
un DPI mai consegnato **avvisa**. Sono cose diverse e vengono trattate
diversamente invece di finire nello stesso mucchio.

Fra i quattro difetti che il cantiere ha trovato e corretto, quello che vale
la pena ricordare: il verbale stampava «non previsto» per un addestramento
che l'utente aveva registrato come fatto — buttava via un dato scritto a
mano. Ora stampa «fatto (non obbligatorio)».

### Terra e Sentinella
Verbale di rilievo stampabile, confronto fra due rilievi dello stesso
fronte, programma di monitoraggio con ciò che è in ritardo. Verificati a
mano i conti dei confronti (29 giorni e 19.400 m³ → 669 m³/giorno).

Corrette in Terra cinque unità di misura che il maiuscolo di stile
stravolgeva (`m³` → `M³`), con una sonda che confronta `textContent` e
`innerText` normalizzati — necessario, perché il micro `µ` sfugge al
confronto ingenuo — e con un autotest che deve accorgersi di un maiuscolo
iniettato apposta, per essere sicuri che la sonda funzioni.

## La correzione nel motore condiviso
Il cantiere di Sentinella ha trovato che, ridisegnando (rotazione dello
schermo, cambio larghezza, **anteprima di stampa**), la frase «la soglia è
fuori scala» compariva una volta in più ogni volta, e finiva ripetuta anche
nel documento che il cliente consegna all'ente. Aveva mitigato dentro
Sentinella con un osservatore locale, e ha fatto bene a non toccare
`shared/` dal suo perimetro — ma così restavano esposte tutte le altre app.

Causa: `ridisegna()` ripuliva disegno, legenda e tabella, ma non i nodi che
il disegno stesso aggiunge in fondo alla figura. Sistemato alla radice:
ciò che nasce dal disegno viene marcato e tolto al ridisegno; la nota
scritta da chi usa il grafico è messa una volta sola in costruzione e resta.

**Prova fatta come si deve**: dopo tre ridisegni la nota automatica resta
una, quella dell'utente resta una, la tabella resta una. E la stessa prova è
stata eseguita **contro la versione precedente**, per essere sicuri che il
difetto lo prendesse davvero: lì le note passavano da 2 a 5. Un test che non
fallisce sul codice rotto non dimostra niente.

## Verifica indipendente di Scudo
Otto asserzioni eseguite sulle funzioni, tutte passate: senza corsi non può
andare e la scheda elenca quali mancano; con corsi validi e DPI consegnati
può; col corso scaduto torna a non poter andare, con la data; il DPI mai
consegnato resta un avviso; chi non è in forza non può comunque; le
collezioni assenti non producono crash né NaN.

## Cose dichiarate, non nascoste
- Le icone ✕/✎ sono 30×30 sul tocco, sotto la soglia dei 44 px. È la
  convenzione di **tutta** l'app, non una regressione di queste schermate:
  cambiarla è una decisione da prendere, non una rifinitura da infilare in
  una verifica.
- Il percorso Firestore reale non è mai stato eseguito: in questa sandbox le
  app girano in modalità dimostrativa. È vero per tutte le verifiche del
  progetto, e resta il motivo per cui i 10 minuti di creazione del progetto
  Firebase valgono più di qualunque altra unità.
- L'override del maiuscolo sulle unità è per app: le etichette d'asse e le
  intestazioni di tabella di `shared/` restano maiuscole per le altre app.

## Prossimo passo atomico
**Blocco 4 — i ponti fra le app**, dove sta il valore dell'ecosistema: un
dato inserito una volta che serve in cinque posti. Il primo è
**Campo → Genesi**: il piano di carico esce già da Genesi e Campo lo
importa, ma la carica reale foro per foro che Campo registra **non torna
indietro** a Genesi per la riconciliazione — ed è proprio il dato che
farebbe funzionare la calibrazione, cioè la funzione su cui poggia tutto il
valore di Genesi.

Subito dopo, il ponte **Campo → Terra → Conti**: la produzione di Campo è
ora in numeri e unità, quindi può alimentare i volumi di Terra e le pesate
di Conti senza reinserimento.
