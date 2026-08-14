# Checkpoint — il contagio che non c'era

**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`

## Il fatto

Il piano dell'unità B di Genesi poggiava su due misure. Una regge, l'altra
**no**, e l'ho scoperto rimisurandola prima di decidere:

| | dichiarato il 03/08 | misurato il 04/08 |
|---|---|---|
| variabili che il foglio pronuncia / Genesi definisce | 76 / 12 | **76 / 12** ✅ |
| selettori del foglio che cadono su markup di Genesi | 22 | **8** |
| di cui **fuori** dalla famiglia modale/toast | 7, nominati | **0** |

In Genesi **non esiste nessuna** delle classi che il documento nominava:

- `kpi` compare **81 volte**, sempre come **proprietà JavaScript** (`A.kpi.nf`,
  `snap.kpi`);
- `badge` compare **14 volte**, sempre **in prosa** dentro commenti e testi
  («la riga arriva col badge *Prevista*»);
- `dw-btn` **non compare mai**.

Censite tutte e **365** le `class="…"` della pagina — **141 classi distinte**, e
**zero** `class='…'` con apici singoli che potessero sfuggire al censimento.

## Perché è successo: si è contata una PAROLA invece della COSA

È la stessa forma di errore che questo repository ha già trovato quattro volte.
Cercare `kpi` in un file trova i nomi di proprietà e i commenti; cercare
`class="… kpi …"` trova le schede. La differenza non si vede nel numero: si vede
solo andando a guardare **dove** sono le occorrenze.

## E cambia il ragionamento, non solo una cifra

Il «contagio» era **l'argomento più forte** per tenere il foglio condiviso fuori
da Genesi: *ti ridipinge le schede della schermata di progetto*. Quell'argomento
non regge.

Resta l'altro, che è vero e misurato due volte in modo indipendente: **72
variabili scoperte**, e una variabile CSS che non esiste **non fallisce** — la
dichiarazione decade e la proprietà ricade sull'ereditato. Gli **8** selettori
che cadono sono proprio quelli della modale e del toast, cioè quelli che Genesi
si veste già da sé: caricare il foglio oggi vorrebbe dire **sostituire un
vestito che funziona con uno senza colori**.

> Un **rischio** gonfiato blocca una decisione quanto un **risultato** gonfiato
> la giustifica. La direttiva 5 vieta di gonfiare i risultati; vale identica
> all'incontrario.

## Adesso il numero è controllato, non scritto

`numeri-nei-documenti.mjs` lo **ricalcola** e lo confronta con la riga del
documento (15 prove, era 14). Con due guardie sul censimento — *ho letto più di
100 classi? più di 200 selettori?* — perché un errore di lettura darebbe «zero
collisioni», che sembra una buona notizia.

**Controprovata** su una Genesi **finta** con dentro le classi che il documento
immaginava: da **8 a 33** selettori, e **25** fuori dalla famiglia. La regola
distingue. *(Fatta su una copia in memoria e non sul file: `genesi.html` è una
pagina e in questo momento gira un giro del browser.)*

## ⚠️ E il controllo nuovo era sporco a sua volta

Prima versione: estraeva i selettori dal foglio **senza togliere i commenti**, e
**68 dei 302** «selettori» letti contenevano un `/*` o un ritorno a capo. Un
selettore incollato al commento che lo precede porta dentro le classi nominate
**nel testo** — e allora un selettore vero può risultare «non cade» perché il
commento accanto nomina una classe che Genesi non ha. Cioè il controllo
**sottostima**, nella direzione che rassicura.

Puliti prima: **242 selettori, zero sporchi**, e una prova in più che lo
pretende. *(Nel CSS non esistono stringhe che contengano `/*`, quindi lì la
sottrazione dei commenti è sicura — nel JavaScript non lo sarebbe, ed è il
difetto che il 01/08 ha cancellato 400.000 caratteri di codice vivo.)*

## Nella stessa finestra: quanto costa oggi la nota di credito mancante

Misurato sulle funzioni vere: una sola fattura annullata col finto incasso —
l'unico modo che l'app permette oggi senza cancellarla — porta il **tempo medio
di pagamento da 30 a 101 giorni** e il ritardo medio da 0 a 71. E la direzione
dell'errore dipende dalla data che si scrive nel finto incasso: chi la mette
uguale alla scadenza fa comparire un pagamento **puntuale mai avvenuto**.

*(La prima stesura di quella misura sbagliava tre nomi di campo e dava un totale
di **0 €** — una misura che sembrava fatta e non misurava niente. I nomi sono
stati letti da `importiFattura` e `statoIncasso`, non indovinati.)*

## Stato

Suite `node` tutte verdi. Il **giro del browser a 27 esecuzioni** è in corso —
il primo che sa dichiararsi non valido da solo. Finché gira: `docs/`, `vault/` e
i file di test.

## Prossimo passo atomico

1. **leggere l'esito del giro** (e verificare che non si sia dichiarato non
   valido: in questa finestra ho toccato solo test e documenti);
2. **Conti — nota di credito**, unità 1: `CAUSALI_NOTA`, `prossimoNumero` col
   prefisso, `stornatoDi`, `statoFattura` a tre vie — e il primo test è che una
   fattura stornata al 100% **non** entri in `tempoMedioPagamento`;
3. **Terra/Genesi — tracciabilità del volume**, unità 1 e 2;
4. **Genesi unità B** — adesso con il piano corretto: non è il contagio, sono le
   72 variabili.

## Nessun blocco

Decisioni del fondatore ferme in `DECISIONI_WEEKEND.md` (5a/5b, 10-15) più
**Firebase Storage** per le foto di Scudo.
