# Checkpoint — Conti 5/12 aperti col browser: dal «letto» al «misurato»

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Task completato
**`conti_pesate_ddt.csv` e `conti_preventivi.csv` promossi dal livello «letto
riga per riga» al livello «aperto col browser».**

Tutt'e due li avevo già letti e risultavano curati — il DDT legge la bandiera
con `valoreDdt` («una cella di CSV DISEGNA un numero, non lo somma»), i
preventivi lasciano vuote la quantità e le due metà dello sconto. Li ho aperti
lo stesso, e la ragione è la sola che conta: **un negativo dedotto non vale
niente.** Su cinque app il censimento statico su questa stessa domanda aveva
dato **zero** mentre i difetti c'erano.
Esito: **puliti anche premendo il bottone.** Nessuna cella dice «undefined»,
«null» o «NaN» — le tre firme di un dato mancante scritto come se fosse un
valore — né dentro una frase composta.

Il banco di Conti passa a **5 punti d'uscita su 12** e a **33 asserzioni**.

## Verifiche
- banco: **33 passati, 0 falliti**; controprova **3 KO voluti** coi 4 difetti
  rimessi davvero (il quarto non discrimina, ed è dichiarato nel file con la
  misura che lo spiega)
- `node giro-node.mjs` → **32 comandi a posto, 0 caduti**, rifatto su una copia
  di ciò che si committa (identità della patch verificata)
- nessun numero dei documenti cambia: non sono state aggiunte prove `node`

## Stato del giro «chi decide i numeri di ciò che ESCE?»
51 punti d'uscita su 51 resi conto, **otto difetti veri** tutti corretti.
Profondità, dichiarata a due livelli:
- **aperti col browser (livello 1): 14** — Flotta 9, Conti 5;
- **letti riga per riga (livello 2): 37** — core 2, Conti 7, Campo 6,
  Sentinella 5, Terra 3, Scudo 5, Genesi 9.
Il livello 2 è un candidato forte, non una garanzia: è scritto perché nessuno
lo legga come «verificato».

## Prossimo passo atomico
1. **Quando il giro del browser finisce** (pid 21084, vivo da ~2h40):
   `leggi-giro.mjs` dalla **sezione 0** — attesta un commit ormai di sedici
   indietro, quindi i suoi KO vanno letti come vecchi di sedici commit e non
   come di adesso. Poi le righe «**non ho guardato**», poi i KO, separando il
   rosso VOLUTO coi marcatori `⚠️ CONTROPROVA` / `FINE CONTROPROVA`. La domanda
   da fargli: **quali controprove non sanno più fallire** sul codice di oggi.
2. Gli ultimi **sette** documenti di Conti da portare al livello 1 (situazione
   fatture, incassi_copia, clienti, clienti_copia, pesate_copia, listino, gare):
   sei di loro delegano a una funzione del modulo, quindi il valore aggiunto è
   minore — ma è misura, non deduzione.
3. La **domanda di prodotto** lasciata aperta: una voce di costo senza importo
   sparisce dal riepilogo e dal file **in silenzio** (`riepilogoCosti` la scarta
   a monte). Prima di toccare, misurare se il form permette di salvarne una
   senza importo.

## Blocchi
Nessuno.
