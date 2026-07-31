# Gli otto difetti trovati il 31 luglio, e che cosa dicevano all'utente

Questo documento è per Giuseppe. Non parla di codice: parla di **che cosa
avrebbe visto una persona che usa il programma**, e di che cosa quella frase
sarebbe costata.

Tutti e otto sono stati trovati **scrivendo prove**, non leggendo il codice.
Nessuno di loro dava errore: il programma non si fermava, non lampeggiava
niente. Dicevano semplicemente una cosa **non vera**, con la stessa faccia con
cui dicono le cose vere. È la categoria peggiore, ed è la ragione per cui la
giornata è andata tutta lì.

## Il filo che li unisce

Sette su otto hanno la stessa forma: **un numero o un colore tranquillo dove non
è stato misurato niente.** Il programma non sapeva una cosa, e invece di dirlo
metteva uno zero, un verde, un «conforme».

Da qui è nata una regola che adesso è scritta e vale per tutto quello che si
farà:

> **L'assenza di un dato non è un dato favorevole.**

## 1. Il contatore che segnava zero ore *(Flotta)*

**Cosa diceva:** «Il contatore segna adesso **0 ore**: il prossimo tagliando
cade a 500».

**Su che cosa:** un mezzo **senza contaore registrato** — che poteva essere a
seimila ore.

**Perché conta:** non è un numero impreciso, è un numero **mai dato da quel
contatore**. E da lì esce il piano di manutenzione: una macchina che avrebbe
dovuto fare il tagliando duemila ore fa risultava nuova.

## 2. L'anomalia del secondo turno che spariva *(Flotta)*

**Cosa faceva:** il conto delle anomalie del giro macchina teneva **un turno
solo**. Se lo stesso mezzo veniva controllato al mattino e al pomeriggio, e
l'anomalia la trovava il pomeriggio, il conto restava a zero.

**Perché conta:** il giro macchina esiste per far emergere i problemi prima che
diventino fermi. Un'anomalia contata zero è un'anomalia che nessuno va a
guardare.

## 3. Il grafico che mostrava il mese sbagliato *(il programma principale)*

**Cosa mostrava:** nel grafico «ultimi 6 mesi» della scheda cava (e in quello
del gemello digitale), la barra scritta **«mag»** conteneva la produzione di
**aprile**. Tutte e sei le barre, spostate di un mese.

**Quando:** **sempre**, tutto l'anno, per tutti gli utenti italiani.

**Perché succedeva:** il programma raccoglieva i dati usando l'orologio di
**Greenwich** e scriveva l'etichetta usando quello **italiano**. Mezzanotte del
primo maggio a Roma è ancora il 30 aprile a Londra.

**Perché conta:** è il grafico su cui si guarda l'andamento della cava. Uno
spostamento di un mese non si nota — e quindi non si corregge.

## 4. Le scadenze delle fatture, un giorno prima *(Conti)*

**Cosa proponeva:** fattura del 1° luglio a 30 giorni → scadenza **30 luglio**.
Sono 29 giorni, non 30.

**Quando:** sempre, tutto l'anno. Stessa causa del difetto n. 3.

**Perché conta:** è una data su un documento fiscale, e diventa i «giorni di
ritardo» con cui si scrive un sollecito.

## 5. Il rapportino del turno di notte, datato al giorno prima

**Cosa faceva:** fra mezzanotte e le due — cioè **durante il turno di notte** —
un rapportino, una fattura o una lettura registrata prendevano la data del
**giorno prima**. E Terra arrivava a **rifiutare** un rilievo di oggi dicendo
che era «nel futuro».

**Perché conta:** in un ufficio «fra mezzanotte e le due» è un caso raro. In una
cava con il turno di notte è **l'orario in cui si scrive**.

## 6. La misura del sismografo che spariva dal report *(Sentinella)*

**Cosa faceva:** importando le letture da un file, se il file scriveva
«12/07/2026 08:00» nella casella della data **e** aveva una colonna «Ora» vuota,
l'ora veniva buttata. Due misure dello stesso giorno con lo stesso valore
diventavano allora **la stessa misura**, e la seconda veniva scartata.

**Cosa diceva all'utente:** «**1 doppione scartato**».

**Perché conta:** quel report va all'ente. Una misura in meno è una misura che
non esiste più, e il programma lo annunciava con la sicurezza di chi dice una
cosa vera.

## 7. Il ruolo di sicurezza verde su una sedia vuota *(Scudo)*

**Cosa mostrava:** l'organigramma della sicurezza diceva che il ruolo di **RSPP**
(o sorvegliante, o medico competente…) era **coperto**, in verde, anche quando
la persona nominata **non era più in azienda** o era stata cancellata
dall'anagrafica.

**Perché conta:** sono **otto ruoli che la legge impone**, e sono fra le prime
cose che un ispettore chiede. Il programma aveva perfino la frase giusta
(«persona non più in anagrafica») scritta e pronta: non la mostrava mai, perché
quel ruolo non arrivava nemmeno all'elenco delle cose da sistemare.

## 8. Il tagliando lontano su un mezzo di cui non sappiamo le ore *(Flotta)*

**Cosa mostrava:** nella lista delle manutenzioni, un badge **verde** con scritto
«**tra 500 h**» su un mezzo di cui il contaore non è mai stato registrato.

**Perché conta:** è lo stesso errore del n. 1, in un altro punto. Il verde dice
«stai tranquillo» su una cosa che non è stata misurata.

Questo l'ha trovato un controllo nato **dopo** gli altri sette: una volta capito
che il filo comune era «un colore tranquillo dove non si è misurato», ho fatto
chiamare **ogni funzione delle sei app con i dati vuoti** per vedere chi
rispondeva qualcosa di rassicurante. Duemila chiamate, trentanove candidati,
letti uno per uno: uno era questo.

## Che cosa resta, adesso

- Tutti e otto **corretti**, ognuno con una prova che **prima falliva e adesso
  passa** — così se domani qualcuno li rifà, se ne accorge il programma e non il
  cliente.
- Le prove sulle funzioni delle app sono passate da **433 a 927 in una
  giornata**.
- Le prove si rilanciano anche con l'**orologio italiano**: il computer su cui
  gira il controllo è a Greenwich, e i difetti 3, 4 e 5 lì erano **invisibili**.
- Una domanda è rimasta aperta ed è **tua**, non mia: sta in
  `DECISIONI_WEEKEND.md` al punto 13 (una mansione senza requisiti deve dire
  «può andare» o «nessuno ha ancora detto che cosa serve»?).
