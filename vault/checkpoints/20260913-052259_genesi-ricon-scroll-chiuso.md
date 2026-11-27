# Checkpoint — 2026-09-13T05:22:59Z

## Tipo
correzione di prodotto (chiude il difetto dichiarato nel checkpoint precedente)

## App
Genesi (direttiva del fondatore ancora in vigore: solo Genesi)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`7d3d2764`

## Completato

Chiude il difetto dichiarato nel checkpoint `20260913-045428` (griglia
della riconciliazione che chiedeva di scorrere dentro il riquadro a
320-390px). Corretto in tre passi, ciascuno rimisurato prima di passare
al successivo:

1. `grid-template-columns` da `fr` semplice a `minmax(0,…fr)`, perché le
   colonne potessero restringersi davvero sotto il loro contenuto
   minimo (altrimenti la griglia si allarga e scorre, invece di
   restringersi e stare).
2. Il campo numerico di ogni riga (`width:70px` inline) spostato in una
   classe `.ric-in`, con un `@media(max-width:760px){ .ric-in{width:54px} }`
   — uno stile inline non si può sovrascrivere da un media query, quindi
   serviva la classe.
3. **Trovato un secondo difetto mentre verificavo il primo**: dopo i
   punti 1-2 la griglia stava nella larghezza giusta, ma l'intestazione
   "Previsto" restava più larga della propria colonna e usciva
   clippata — misurato con `scrollWidth > clientWidth` sulla singola
   cella header, non dedotto dallo screenshot. Corretto abbreviando
   "Previsto"→"Prev." (con `title="Previsto"` per chi passa il mouse) e
   "Scostamento"→"Scarto" (termine già usato altrove in Genesi per lo
   stesso concetto, es. il pannello del rilievo boretrack).
4. **E un terzo, introdotto da me stesso nel banco di misura**: avevo
   aggiunto `class="ric-grid"` al contenitore per potermelo selezionare
   nello script di verifica — una classe che il prodotto non dipinge e
   non cerca mai, presa da `classi-orfane.mjs` nel primo giro di
   verifica (1 fallito su 40). Tolta: il banco usa un selettore
   strutturale (`#riconBody > div[style*="grid-template-columns"]`)
   invece di inquinare il markup di produzione per comodità di misura.

**Verificato**: `scrollWidth`/`clientWidth` sul contenitore e su ogni
header a 320/360/390/430px → zero scorrimento richiesto, zero testo
clippato, ovunque. Screenshot guardati alle stesse larghezze. Su
worktree della copia di ciò che si committa: `giro-node.mjs` → **40
comandi a posto, 0 caduti** (il primo giro, con `class="ric-grid"`
ancora presente, aveva preso l'errore: corretto e riverificato prima di
committare — la verifica ha fatto esattamente il suo lavoro).

**Non tocca la segnalazione di sicurezza aperta**: layout di un modale
di riconciliazione dati, non geometria del fronte/flyrock/burden.

## Stato roadmap

Nessuna voce di `vault/ROADMAP_SETTIMANA.md` toccata.

## Blocchi e limiti noti

Nessuno nuovo. Blocco di sicurezza su geometria/flyrock/burden invariato
(`docs/DECISIONI_WEEKEND.md` §6, ancora senza risposta del fondatore).

## Prossimo passo atomico

Con questo, la verifica visiva di routine su Genesi ha coperto: Home,
3D (un difetto trovato e chiuso), Progetto 2D con pannello parametri e
con tutte le sezioni aperte (pulito), il modale di riconciliazione (un
secondo difetto trovato e chiuso, con due difetti collaterali trovati e
chiusi durante la correzione stessa). Le strade aperte:
1. Attendere la risposta del fondatore sulla segnalazione di sicurezza
   principale.
2. Proseguire la verifica visiva su schermate ancora non coperte (la
   scheda signature-hole con un'onda importata, il pannello presplit
   con "Presplit: Sì" selezionato — diverso da "chiuso" come visto
   finora).
3. Una nuova ricerca di fianco su un angolo Genesi non ancora coperto.
