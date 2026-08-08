# Checkpoint — la frase contro il file: venti frasi su venti

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Task completato
**La terza gamba della domanda di casa portata su Conti, e la regola messa in
un posto solo.**

- **Flotta**: 8 frasi confrontate col file, 1 senza numeri (dichiarata)
- **Conti**: **12 su 12** confrontate
- **Totale: venti frasi, e adesso tornano tutte.**

## La regola vive in `giro.mjs`, non in due copie
Serviva a due banchi, e in questa casa una regola usata due volte si scrive una
volta — `giro.mjs` è già *«l'attrezzo che tutti i banchi importano»*, e il suo
commento dice perché: *«se ogni banco se la riscrive, la seconda copia nasce
uguale e diverge al primo cambiamento»*. Ci sono andate `azzeraFrasi`,
`frasiVisibili`, `contiNellaFrase` e `righeDiDato`, col racconto dei tre errori
che le hanno formate. Flotta ha smesso di tenersene una copia locale.

## Il difetto trovato: «8 preventivi esportati», e il file ne mostra 9
`conti_preventivi.csv` scrive **una riga per ogni riga di preventivo**, non una
per preventivo. La frase non era falsa — otto preventivi erano davvero otto — ma
chi apre il foglio ne conta **nove** e rileggendo il messaggio non torna.
Un documento dice che cosa contiene: adesso la frase porta due numeri
(`8 preventivi esportati · 9 righe nel foglio`) e la domanda sparisce. Costa una
parola.
⚠️ **Ed è il confronto stesso ad averlo trovato**: nessuna delle prove
precedenti guardava la frase.

## ⚠️ E il conto onesto degli errori del righello: QUATTRO, tutti miei
Prima di reggere, questo controllo ha sbagliato quattro volte, e **nessuna era
un difetto del prodotto**:
1. leggeva frasi **vecchie** rimaste a schermo → otto KO falsi;
2. «il primo numero = le righe» → tre KO falsi su otto, e in tutt'e tre il
   prodotto aveva ragione;
3. la stessa frase contata **due volte** (nota + toast) → il conto raddoppiava;
4. su Conti, gli **importi in euro** entravano fra i conti: in Flotta
   l'inclusione li tollerava *per caso*, e un numero di troppo fa passare il
   confronto **per la ragione sbagliata** — che è peggio di un fallimento,
   perché non lo vedi. Adesso `contiNellaFrase` toglie `€`, `%` e i decimali.
È la ragione per cui in questa casa, davanti a una misura che non torna, la
prima domanda è *sto guardando il soggetto o lo strumento?*

## Le prove sanno fallire
Un'iniezione per banco, della stessa forma — **il file perde una riga in
silenzio e la frase continua a contare l'array sorgente**:
- Flotta: un mezzo sparisce dalla situazione → `numeri:[6,3,1]`, righe **9**;
- Conti: un cliente sparisce dall'anagrafica → «Esportato 1 cliente», righe **0**.

## Verifiche
- Flotta **65 passati, 0 falliti** (controprova 13 KO voluti, 6 difetti rimessi)
- Conti **80 passati, 0 falliti** (controprova 5 KO voluti, 5 difetti rimessi)
- `iniezioni-fresche` **185 su 185**, 22 banchi · `suite collegate` 118 file
- `node giro-node.mjs` → **32 comandi a posto, 0 caduti**, rifatto su una copia
  di ciò che si committa (identità della patch verificata)

## Stato della domanda «chi decide i numeri di ciò che ESCE?»
- **CSV/file**: 51 su 51, otto difetti corretti, 21 aperti col browser
- **PDF/stampe**: censite — quelle in HTML coperte ovunque, quelle del core con
  `jsPDF` **da CDN** fuori portata in questo ambiente, ragione già scritta
- **frasi di riepilogo**: **20 su 20** in Flotta e Conti, un difetto trovato e
  corretto

## Prossimo passo atomico
**Portare il confronto frase↔file sugli altri banchi che aprono file**: Campo
(`campo-foglio-turno`), Scudo (`scudo-documenti`), Genesi
(`genesi-documenti-che-escono`), core (`core-documenti-che-escono`). L'aggancio
è di tre righe — `azzeraFrasi` prima del click, `frasiVisibili` +
`contiNellaFrase` + `righeDiDato` dopo — perché la regola sta già in `giro.mjs`.
⚠️ Aspettarsi che il righello sbagli ancora su qualche app: le frasi di Campo
portano ore e minuti («7,5 ore»), quelle di Sentinella portano soglie in mm/s.
Il filtro oggi toglie `€`, `%` e i decimali; **prima di dichiarare un KO, si
guarda se il numero che accusa è un conto o una misura.**
E resta il **giro del browser** (pid 21084, oltre tre ore).

## Blocchi
Nessuno.
