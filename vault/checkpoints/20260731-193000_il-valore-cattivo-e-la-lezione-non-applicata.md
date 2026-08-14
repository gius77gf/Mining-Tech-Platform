# Checkpoint — il valore cattivo, e una lezione scritta che non ho applicato

- **Tipo**: quattro unità (Campo, la controprova sistemata, l'unità di
  Sentinella, i documenti del fondatore)
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `e0ae0c9` (il foro ripetuto + iniezione della controprova),
  `cfa5e76` (i numeri delle prove ricontati), `84a125c` (l'indice),
  `56c318b` (l'unità del ricettore e le prove sui valori cattivi)

## 1. Il piano di carico è l'eccezione, ed è voluta

Ultimo import senza controllo doppioni, e qui la decisione è **l'opposta** di
tutte le altre. Due righe per lo stesso foro non sono un fastidio da ripulire:
sono un **errore nel progetto della volata**. Toglierne una in silenzio farebbe
sparire una carica e abbassare il totale dell'esplosivo senza che nessuno sappia
perché — la cosa peggiore che possa fare un'app in mano a un fochino.

Entrano **tutte e due**, e l'app lo dichiara **prima** di scrivere. Fra le
cinque prove nuove ce n'è una che difende proprio la decisione: se un domani
qualcuno applicasse qui la regola degli altri import, il test che pretende due
righe per il foro 7 **cade**.

## 2. La controprova che non arrivava dappertutto

La controprova del banco degli id iniettava il difetto con
`replace('</body>', …)`, che sostituisce la **prima** occorrenza — e in Terra ce
ne sono **tre**, in Genesi e Campo due, perché le prime stanno dentro le
stringhe dei modelli di stampa. Il difetto finiva lì dentro, e la controprova
diceva «pulito» su **tre superfici su nove**: per quelle tre non era mai stato
provato che il banco sapesse fallire.

Ora prende l'**ultima**, e la controprova fallisce su **tutte e nove**.
*Una controprova che non arriva dappertutto vale meno di quanto sembra.*

## 3. L'unità del ricettore si spezzava, e finiva nella nota

Chiedendosi se il giro di andata e ritorno reggesse ai valori che una persona
scrive **davvero**: nell'export dei ricettori di Sentinella il campo **unità**
non passava da `csvCell`. È un campo libero — chi scrive «mm/s; dB(A)» non fa
niente di assurdo — e il file, ri-caricato, tornava con unità «mm/s» e la
**nota del ricettore diventata «dB(A)»**. Nessun errore, nessun avviso, un dato
sbagliato in un documento che parla di soglie.

Quattro prove nuove (**KPI 396 → 400**): un nome con punto e virgola, uno che
sembra una formula (`=SOMMA(A1:A9)`, che Excel eseguirebbe senza l'apostrofo di
guardia), uno con le virgolette, e l'unità del ricettore.

## 4. I numeri che il fondatore mostra, ricontati

I due documenti dicevano «555 prove e 11 banchi». Lanciate tutte e sei le suite
e contato: **627** *(oggi 631)* prove senza rete e **13** banchi nel browser. Un
numero vecchio in un documento di vendita è il tipo di dettaglio che, se
qualcuno lo verifica, toglie fiducia a tutto il resto.

E l'indice del fondatore ora manda alle **due sezioni che contano** di
`ONBOARDING_DATI` — cosa non si carica, e cosa il backup copre davvero — non
solo ai modelli, che sono la parte facile.

## ⚠️ La lezione scritta e non applicata

Per la **terza volta in due giorni** `git checkout`, usato per togliere un
difetto iniettato a mano, si è portato via un blocco di prove **non ancora
committato**. La regola — *prima si committa, poi si inietta il difetto* — era
già scritta nel checkpoint di stamattina, da me, e non l'ho applicata.

Annotarlo serve a poco se resta un'annotazione. Il gesto va cambiato: **il
comando che inietta un difetto va scritto solo dopo che `git status` è pulito**,
e questo è l'unico modo in cui `git checkout` torna a essere sicuro.

## Prossimo passo atomico

Leggere il **RIEPILOGO del giro definitivo** della suite del browser (in corso:
tredici banchi, con i file di oggi) e sistemare quello che è rosso. È la prima
volta che gira dopo le modifiche a Campo, Conti, Flotta e Sentinella.

## Bloccanti

- Nessuno.
