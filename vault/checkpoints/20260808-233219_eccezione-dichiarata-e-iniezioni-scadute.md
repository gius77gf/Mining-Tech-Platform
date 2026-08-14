# Checkpoint — 2026-08-08T23:32:19Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`bfa4517`

## Task completato

**L'eccezione che il controllo dichiarava era il posto dove il difetto viveva.**

`iniezioni-fresche.mjs` teneva fuori **un** banco — `scudo-documenti`, «la
tabella si costruisce da variabili» — con la ragione scritta e l'elenco
sorvegliato. Eccezione onesta, e proprio lì dentro stavano **sei iniezioni
scadute su ventisei**.

Il banco stampava «✔ CONTROPROVA OK»: le venti rimaste bastavano a farlo
cadere, quindi il rosso c'era e il verdetto pure. La sola riga che lo diceva era
«**20/26 difetti rimessi**», che nessuno legge. È la forma peggiore — **un
controllo che passa avendo guardato meno di quello che crede.**

Le sei erano scadute per la ragione di sempre, e **buona**: il codice si è mosso
perché è migliorato — quattro export saliti nel modulo accanto alle funzioni che
decidono le stesse cose a schermo, un `LAV.find(...)` a mano diventato
`etichettaResponsabile`, e le parentesi dei parametri delle funzioni freccia.

Nella stessa unità, `scudo_azioni_copia.csv` — l'ultimo punto d'uscita che
nessun banco apriva — entra nel banco: **Scudo 5 su 5**.

## Le tre cose imparate

1. ⛔ **Un'eccezione dichiarata onestamente resta un posto in cui nessuno
   guarda.** Non basta sorvegliarla (l'elenco lo era, e infatti nessun elemento
   nuovo era comparso): si guarda **dentro** almeno una volta, e se si può si
   **toglie**. Qui si toglieva leggendo le costanti di stringa del banco e
   passandole all'`eval` come preambolo: da **174 iniezioni in 20 banchi con
   un'eccezione** a **212 in 23 con zero**.
2. ⚠️ **Il righello ha rifatto AL CONTRARIO l'errore già scritto in
   `CLAUDE.md`.** Imparata la forma `[file, cerca, sostituisci]` di
   `scudo-disegni`, leggeva così anche `scudo-documenti`, che scrive
   `[cerca, sostituisci, file]`: sei falsi allarmi, **tutti nello stesso
   banco** — il segno con cui in questa casa si riconosce di guardare il
   righello. La cura non è imparare la terza forma: è **non indovinare la
   posizione e chiedere ai dati** qual è il percorso di prodotto vero.
3. ⛔ **Un censimento che cerca UN nome risponde «non c'è» con la stessa faccia
   con cui direbbe la verità.** Avevo grepato `__usciti` in quel banco, trovato
   **zero**, e concluso «Scudo non ha nessun banco che apra un CSV». Il gancio
   lì si chiama `__scaricati` e vive **380 righe più in giù**; quattro dei
   cinque punti d'uscita erano già aperti. Avevo scritto **trecento righe** di
   banco nuovo con quella frase falsa nell'intestazione: **buttate**. Il costo
   vero non era il tempo — era che il duplicato sarebbe entrato con una misura
   sbagliata scritta sopra.

⚠️ **E una generalizzazione è stata provata e scartata per la seconda volta, ma
la decisione era già scritta accanto all'eccezione che stavo togliendo.** Il
banco nuovo accusava «Esportati 7 lavoratori e 26 scadenze, di cui 2 senza
nessuna scadenza» contro 28 righe (= 26 + 2), e stavo per allargare la regola
delle frasi in `giro.mjs` a una **somma parziale qualunque**: con `[6,3,1]`
anche 9 è una somma parziale, e l'iniezione di Flotta smetterebbe di essere
vista. **Una regola indebolita per far passare un caso vale meno di un caso
dichiarato** — e una decisione presa con la misura va **cercata prima di
rifarla**.

## Verifiche
- `iniezioni-fresche`: **212 sul bersaglio su 212**, 23 banchi, **0 eccezioni**
  (erano 174/174, 20 banchi, 1 eccezione); provata a fallire ri-scadendo
  un'ancora sul banco appena reso visibile — la nomina, e il ripristino è stato
  fatto **da una copia**, non con `git checkout`
- `scudo-documenti`: **86 ok, 0 KO** (erano 80); controprova **26/26 rimesse,
  41 prove cadute** (erano 20/26 e 34)
- `node giro-node.mjs`: **32 comandi a posto, 0 caduti**, rifatto sulla **copia
  di ciò che si committa**, identità della patch verificata

## Stato roadmap
Filone «i numeri che mentono con la faccia tranquilla».
Domanda *«chi decide i numeri di ciò che ESCE?»*: **chiusa su tutte le app** —
Campo 6/6, Sentinella 5/5, Terra 3/3, core 2/2, Flotta 9/9, Conti 12/12, Genesi,
e adesso **Scudo 5/5**. La terza gamba (la frase di riepilogo contro il file)
gira su Flotta, Conti, Scudo, Campo e Genesi.

## Prossimo passo atomico
**Leggere il giro del browser** (pid 32676, registro
`scratchpad/resp/giro/registro4.txt`) con
`node apps/deepwork-id/tests/browser/leggi-giro.mjs <registro>` **quando ha
finito** — e la prima domanda è «sta ancora scrivendo?», non «che cosa dice».
Attesta `7cddb59`, quindi la sezione 0 dirà di pochi commit: i suoi KO sono
leggibili come attuali, al contrario del giro precedente (30 commit indietro e
**tronco**, buttato).
Si legge in quest'ordine: **sezione 0** (età) → **righe «non ho guardato»** →
**KO veri**. Da questo giro in poi il conto dei KO non è più gonfiato dal
riepilogo finale (`bfa4517` e `cc8225e`): sul registro vecchio erano 47, ne
erano 10.

## Blocchi
Nessuno.

## Note
Il giro precedente (`registro3.txt`) è stato **buttato** per due ragioni
misurate: si era fermato a metà — `leggi-giro` lo dice, «nessuna riga USCITA: il
registro è tronco» — e attestava un commit da cui il branch era già avanti di
**30**.
