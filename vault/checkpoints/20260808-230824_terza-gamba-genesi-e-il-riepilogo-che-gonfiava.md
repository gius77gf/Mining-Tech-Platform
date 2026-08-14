# Checkpoint — 2026-08-08T23:08:24Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Task completato

**Due unità, e tutt'e due sono nate dal righello che si accusava da solo.**

### 1 · Genesi: la TERZA gamba della domanda di casa (`fe55bb6`)

La domanda di `CLAUDE.md` nomina tre cose che escono — «un CSV, un PDF, **una
frase di riepilogo**». Su Genesi la terza non era mai stata chiesta. Misurata:
dei **sette** file CSV che il banco apre, **sette uscivano in silenzio**,
mentre Flotta, Conti, Scudo e Campo annunciano tutti quanto ne esce. Non un
numero che mente: **un numero che non c'è**.

Adesso i **sei** export CSV di Genesi dicono quanto ne è uscito, col conto
preso dalle righe VERE del file.

⛔ E il conto non è un ornamento: `sitoExport` **filtra**
(`d>0 && w>0 && ppv>0`). Oggi lo schermo filtra allo stesso modo — verificato
leggendo `sitoRender`, che usa la **stessa** `P` — ma niente tiene in passo due
filtri scritti in due punti, ed è la forma esatta in cui questa famiglia si
presenta: la frase conta l'array SORGENTE mentre il ciclo che scrive filtra.

### 2 · Il riepilogo finale di un giro è una RIPETIZIONE (`cc8225e`)

Leggendo il registro del giro con `leggi-giro.mjs` — **lo strumento scritto
apposta per non sbagliare questo** — il denominatore diceva «KO veri: **47**».
Erano **10**. Le altre **37** erano le righe di `════ RIEPILOGO ════`: un rigo
per passata, cioè lo **stesso rosso già stampato più su**. E fra quelle 37
c'erano tutte le controprove, il cui rosso è VOLUTO — la loro dichiarazione
vale nell'**intervallo della passata**, e il riepilogo sta in fondo, fuori da
ogni intervallo, quindi rientravano dalla finestra tutte insieme.

## Le tre cose imparate

1. ⛔ **«La frase è vuota» ha due cause OPPOSTE, e contarle insieme fa passare
   quella del righello per quella del prodotto.** Il primo conteggio su Genesi
   diceva «non viste dal selettore: 7» e stavo per allargare il selettore:
   `#toast` in Genesi **c'è**, alla riga 972. Separate le due domande
   (`postiDaFrase`, che **riusa** il selettore invece di riscriverlo): **7
   muti, 0 senza posto** — cioè il prodotto, non la misura. Portata anche nei
   banchi di Flotta e Conti, dove l'«1» ambiguo di Flotta si legge adesso per
   quello che è: **una frase mostrata senza un conto**.
2. ⛔ **Quando scrivi uno strumento per non farti ingannare da un registro,
   chiediti subito CHI ALTRO scrive in quel registro.** È la quarta volta per
   questa famiglia; le prime tre volte era un banco che si intestava da sé,
   questa è **il runner stesso**, che ricapitola. Il posto in cui il difetto si
   nasconde è sempre quello che non si guarda perché «quello lo scriviamo noi».
3. ⚠️ **Il ripiego dichiarato vale più della regola pura.** La dichiarazione
   nuova la stampa `tutti.mjs` da adesso; i registri **già scritti** non ce
   l'hanno, e sono esattamente quelli che si riaprono per capire com'è andata.
   Il riconoscimento per nome resta, **con la ragione scritta accanto**. E le
   37 righe non spariscono: si stampano a parte — un numero tolto in silenzio è
   un numero che qualcuno rimetterà.

## Verifiche
- banco Genesi: **66 → 73 prove, 0 falliti**; `7 muti → 7 confrontate`
- iniezione nuova (un foro in più annunciato di quanti ne escono), ancora
  **corta** di proposito: **6/6 rimesse**, **23** prove cadute in controprova
- `leggi-giro` sul registro vero: **47 → 10** KO, con le 37 dichiarate a parte;
  controprova estesa e **provata a fallire** (disattivando i due riconoscitori
  su una copia cadono 4 asserzioni, KO veri 2 → 5)
- `node giro-node.mjs`: **32 comandi a posto, 0 caduti**, rifatto sulla **copia
  di ciò che si committa**, identità della patch verificata
- dopo il cambio dello strumento condiviso, i suoi quattro utenti rimisurati e
  **invariati**: Flotta 65/0, Conti 80/0, Scudo 80/0, Campo 53/0

## Stato roadmap
Filone «i numeri che mentono con la faccia tranquilla».
Domanda *«chi decide i numeri di ciò che ESCE?»*: Campo 6/6, Sentinella 5/5,
Terra 3/3, core 2/2, Flotta 9/9, Conti 12/12 **e adesso Genesi**, con la terza
gamba (la frase) chiusa su Flotta, Conti, Scudo, Campo e Genesi.
Resta **Scudo (5 punti d'uscita)**, che nessun banco apre.

## Prossimo passo atomico
**Scrivere `apps/deepwork-id/tests/browser/scudo-documenti-che-escono.mjs`**,
sul modello di quello di Conti. Cinque bottoni, tutti in `apps/scudo/index.html`
e tutti già **misurati** (numero di riga del bottone, non dedotto):
`btn-inf-export` (4807 → `scudo_registro_infortuni.csv`), `btn-export-csv`
(4849 → `scudo_personale_scadenze.csv`), `btn-azi-backup` (5006 →
`scudo_azioni_copia.csv`), `btn-azi-export` (5031 →
`scudo_azioni_correttive.csv`), `btn-nm-export` (6106 →
`scudo_riepilogo_near_miss.csv`).
Tre cose già misurate, da non riscoprire:
1. `scudo-documenti.mjs` esiste ma **non apre nessun CSV** (zero occorrenze di
   `__usciti`): guarda le stampe, non i file. Il banco nuovo non lo duplica;
2. Scudo **parla già**: tutti e cinque chiamano `esito(...)` con un conto
   (`conta(INF.length, …)`), e l'elemento è `.esito` — cioè il selettore
   condiviso lo vede. La terza gamba qui misura l'ACCORDO, non il silenzio;
3. tutti i file escono come `data:` URL e passano da `marchiaCsv`, che
   aggiunge al nome il marchio della dimostrazione.

## Blocchi
Nessuno.

## Note
⛔ Il giro del browser precedente (registro3.txt) va **buttato**, per due
ragioni misurate e non per impressione: si è fermato a metà — `leggi-giro` lo
dice, «nessuna riga USCITA: il registro è tronco» — e attestava un commit da
cui il branch era già avanti di **30**. Va rilanciato su questo commit.
