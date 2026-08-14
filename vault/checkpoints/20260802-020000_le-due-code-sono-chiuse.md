# Checkpoint — le due correzioni in coda sono chiuse (5° e 6° difetto)

- **Tipo**: due unità (una correzione ciascuna, ognuna con la prova nata rossa)
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `933cfc9` (l'ora persa in Sentinella), `484d2ac` (lo zero in Flotta)

## 1. L'ora persa nell'import del sismografo

`preparaLetture` cercava l'ora **solo** nella colonna scelta dall'utente. Ma i
file veri scrivono spessissimo «12/07/2026 08:00» nella cella della **data** e
hanno **anche** una colonna Ora che per quelle righe è vuota: in quel caso
l'ora c'era, sotto gli occhi, e veniva buttata.

Non finiva con un'etichetta più povera. Misurato:

```
file: 12/07/2026 08:00 · 0,5   e   12/07/2026 14:00 · 0,5
con la colonna Ora scelta e vuota → ore lette: ["",""]
  unisciLetture → aggiunte: 1, duplicati: 1, letture: 1
senza colonna Ora                 → ore lette: ["08:00","14:00"]
  unisciLetture → aggiunte: 2, duplicati: 0, letture: 2
```

Perse l'ora, le due misure hanno la stessa **firma** (data + ora + valore) e la
seconda viene scartata come doppione: **una misura sparisce dal report che va
all'ente**, e l'interfaccia lo annuncia pure — «1 doppione scartato» — con la
sicurezza di chi dice una cosa vera.

Una riga di correzione, e la colonna scelta **vince** comunque: è un ripiego,
non una sovrascrittura, e una seconda prova lo blocca.

## 2. «X ha 0 ore» era una frase falsa anche nel form

Il gemello di quello corretto stamattina nella finestra del prossimo tagliando:
stessa causa, stesso `+null === 0`, altro punto. Scegliendo un piano, la pagina
scriveva **«CAT 320 ha 0 ore: il tagliando è proposto a 500»** su un mezzo senza
contaore.

La correzione **non** è una toppa nella pagina: la proposta e la frase diventano
`propostaTagliando` in `flotta-data.js`, pura e provata. Senza le ore non si
propone niente, si dichiara di non saperle e si offre la via d'uscita vera
(«scrivile tu, oppure programma il tagliando per data»).

## Due asserzioni corrette perché sbagliavano LE PROVE, non il codice

- **«6.375» non esiste in italiano.** La lingua raggruppa solo da cinque cifre
  in su (`minimumGroupingDigits: 2`): 6375 si scrive **6375**, 1234567 si scrive
  1.234.567. La prima stesura pretendeva il punto e cadeva.
- **Cercare «0 ore» trovava «+500 ore»** nella coda della frase. Quello che non
  deve esistere è l'**asserzione** «X ha 0 ore», ed è quella che ora si cerca.

## E una nota di metodo che si è ripagata in giornata

La terza sonda della controprova su Flotta **si è fermata invece di girare**,
perché il testo da sostituire non c'era (era andato a capo). È esattamente la
difesa scritta stamattina in `CLAUDE.md` dopo la controprova mai partita: uno
script che non trova quello che cerca deve **gridare**, non passare. E ha
lasciato indietro la copia `_tmp-cp.js`, che è stata tolta a mano — anche quello
si vede solo se si guarda.

## Stato

- **618** KPI (433 all'inizio della giornata) → **901** prove `node`, verdi in
  UTC **e** in ora italiana
- **185 prove nuove** in giornata, **6 difetti di prodotto** trovati e corretti,
  **1 prova vacua** corretta, **2 asserzioni** rimesse a posto
- Stile **201**, `orologio-cliente` verde, 9 superfici aperte nel browser senza
  un errore di console
- **la coda è vuota**: non resta nessuna correzione isolata in attesa

## Prossimo passo atomico

Riprendere dalle funzioni ancora scoperte, con lo stesso metodo. In Sentinella
restano i gruppi delle **volate previste** (`confermaVolataEseguita`,
`scartoPpvVolata`, `riepilogoPreviste`, `volateOrdinate`, `firmaVolata`), già
letti e con le regole individuate:

- la data di una volata eseguita non può essere nel futuro;
- confermando si possono correggere i dati del progetto, ma **la previsione non
  si tocca** — altrimenti il confronto previsto→misurato sarebbe un confronto
  con un numero aggiustato dopo;
- `firmaVolata` col codice di Genesi **sopravvive alla conferma**, così
  reimportare il file del progetto non crea una riga fantasma.

## Bloccanti

- Nessuno.
