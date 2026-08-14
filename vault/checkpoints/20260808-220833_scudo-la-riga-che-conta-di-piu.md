# Checkpoint — Scudo: la frase non nominava la riga che conta di più

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Task completato
Il confronto **frase↔file** portato su Scudo, e ha trovato un difetto vero.

### Il difetto
`scudo_personale_scadenze.csv` scrive una riga per ogni coppia (lavoratore,
scadenza) **più una riga per ogni lavoratore che non ha NESSUNA scadenza
registrata**. Quella riga è il motivo per cui questo export esiste: l'assenza di
un dato non è un dato favorevole, e un lavoratore senza scadenze è una **lacuna**
— non un foglio pulito.
Il messaggio diceva «Esportati 7 lavoratori e 29 scadenze» e il foglio ne aveva
**30**. Il trentesimo era proprio quello: **il file la dichiarava, la frase no.**
Adesso la frase li conta e li dice: *«…di cui 1 senza nessuna scadenza
registrata»*.

### Il righello, corretto due volte
1. **«ultimi 90 giorni» non è un conto, è un periodo.** Accusava il riepilogo
   near-miss, che è sano. `contiNellaFrase` adesso toglie periodi e durate
   (giorni, mesi, ore, e le unità di misura), e la domanda da farsi davanti a
   ogni numero di una frase è quella: **è un conto o è una misura?** Serve anche
   per le ore di Campo e le soglie di Sentinella.
2. **Un'eccezione dichiarata invece di una regola indebolita.** Le righe di quel
   file sono `scadenze + scoperti`, che non è né uno dei numeri della frase né
   la loro somma (conterebbe due volte i lavoratori).
   ⛔ La generalizzazione ovvia — «una qualunque somma parziale» — è stata
   **provata e SCARTATA con la misura**, perché distruggerebbe la prova: con
   `[6,3,1]` anche **9** è una somma parziale, e l'iniezione di Flotta (il file
   che perde un mezzo, righe 9) **smetterebbe di essere vista**. Una regola
   indebolita per far passare un caso vale meno di un caso dichiarato con la sua
   ragione.

## Verifiche
- Scudo: le tre frasi tornano
- **Rimisurati anche gli altri due banchi dopo aver toccato la regola
  condivisa** — Flotta **65/0**, Conti **80/0** — e la controprova di Flotta
  **distingue ancora** (13 KO voluti). Cambiare un attrezzo condiviso senza
  rimisurare chi lo usa è il modo di rompere in silenzio.
- `node giro-node.mjs` → **32 comandi a posto, 0 caduti**, rifatto su una copia
  di ciò che si committa (identità della patch verificata)

## Stato della domanda «chi decide i numeri di ciò che ESCE?»
- **CSV/file**: 51 su 51, otto difetti corretti
- **PDF/stampe**: censite, con il limite del core misurato e scritto
- **frasi di riepilogo**: **23** confrontate (Flotta 8, Conti 12, Scudo 3),
  **due difetti trovati e corretti** — i preventivi che dicevano 8 su 9 righe, e
  i lavoratori scoperti che il file dichiarava e la frase taceva

## Prossimo passo atomico
Gli ultimi tre banchi che aprono file — **Campo** (`campo-foglio-turno`),
**Genesi** (`genesi-documenti-che-escono`) e il **core**
(`core-documenti-che-escono`) — non hanno un `scarica` comune: ognuno scarica a
modo suo, quindi l'aggancio non è di tre righe come su Scudo e va scritto per
ciascuno. Si comincia da **Campo**, dove la frase della consegna di turno porta
**ore** («4 rapportini e 7,5 ore») e il filtro nuovo è già pronto a distinguerle.
E resta il **giro del browser** (pid 21084, oltre tre ore e mezza).

## Blocchi
Nessuno.
