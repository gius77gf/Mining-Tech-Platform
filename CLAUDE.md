# Mining-Tech-Platform — istruzioni per Claude

Monorepo dell'ecosistema Deepwork: software per cave/attività
estrattive, venduto ad aziende spesso CONCORRENTI tra loro.
Fondatore: Giuseppe (non tecnico — spiegare le cose in modo semplice,
in italiano, senza dare conoscenze per scontate).

## Struttura
- Radice: Deepwork core (index.html monolite ~8k righe, PWA su
  Netlify — deploy automatico ad ogni merge su main)
- `apps/<nome>/` — le app dell'ecosistema (deepwork-id, genesi, scudo,
  campo, flotta, conti, sentinella, terra). Ognuna raggiungibile
  online come /apps/<nome>/ sul sito esistente (vedi apps/DEPLOY.md)
- `shared/` — stile deepwork vincolante (deepwork-style.css,
  dw-app-shell.css) e SDK identità (deepwork-id-client/)
- `vault/` — memoria di lavoro: ROADMAP_SETTIMANA.md + checkpoints/
- `docs/` — audit e piani (AUDIT_SICUREZZA.md, MITIGAZIONE_PASSWORD.md)

## Procedura dei cicli di lavoro automatici
1. `git pull` per allinearsi, poi leggere vault/ROADMAP_SETTIMANA.md
   e il checkpoint PIÙ RECENTE in vault/checkpoints/: riprendere dal
   suo "Prossimo passo atomico".
   ⛔ **QUAL È IL PIÙ RECENTE LO DICE GIT, NON IL NOME DEL FILE.** Questa riga
   diceva «timestamp più alto nel nome», e il 01/08 si è misurato che il nome
   **non è un'ora: è una stringa che le somiglia**. Confrontando ogni nome col
   giorno in cui il file è entrato in git: `20260722-*` entrato il 21/07,
   `20260805-*` entrato il **31/07**. Un solo giorno di lavoro si era dato
   **cinque date diverse**, una per blocco, e in tutto **184 checkpoint su 640
   sono datati avanti di GIORNI** — ⚠️ e **506 se si contano anche le ore**,
   misurato il 09/08: vedi il blocco qui sotto, perché il 184 non era
   l'arretrato, era la parte che un righello a giorni sapeva vedere. Effetto:
   chi ordinava per nome
   apriva un file **più vecchio** di quello vero credendolo il più fresco, e non
   se ne accorgeva — perché una risposta la regola la dà sempre.
   Il comando che risponde giusto, e che stampa anche i due candidati a
   confronto: `node apps/deepwork-id/tests/date-checkpoint.mjs`.
   La stessa suite impedisce che il difetto si riformi: un checkpoint **nuovo**
   non può essere datato dopo il giorno in cui entra in git — **né dopo l'ORA**,
   dal 09/08.
   ⛔ **E QUELLA PAROLA, «GIORNO», ERA IL BUCO: il numero dichiarato non
   misurava il difetto, misurava la GRANULARITÀ DEL RIGHELLO.** Trovato
   scrivendo il canarino di un ciclo: l'ora vera erano le 10:15Z e il
   checkpoint più recente si chiamava `20260809-143000_…`, scritto alle 10:13
   — **quattro ore e diciassette minuti avanti**. Il controllo diceva ✓, perché
   il giorno era lo stesso; e lo diceva leggendo `--date=short`, cioè su dati
   che **l'ora non ce l'avevano**.
   Il conto vero: i checkpoint datati avanti sono **506**, non 184. I 184 sono
   quelli avanti di **giorni**; gli altri **322 sono avanti di ORE nello stesso
   giorno**, fino a **1112 minuti**, e nessun controllo li aveva mai visti.
   ⚠️ Perché conta: il nome del file è ciò che questo repository usa per dire
   «riprendi da qui». Un checkpoint che si dichiara delle 14:30 quando è stato
   scritto alle 10:13 sposta il punto di ripresa **avanti di quattro ore**
   rispetto al lavoro vero.
   ⚠️ E la lezione generale, che vale per ogni soglia: **quando un controllo
   dichiara un arretrato, si guarda con che UNITÀ lo misura.** Un guardiano che
   confronta i giorni non può che trovare difetti da giorni — e chi legge il
   suo numero crede che sia l'arretrato, non la parte di arretrato che quel
   righello sa vedere. Il lascito è
   dichiarato per data (non a elenco) e **misurato**, così il giorno in cui
   qualcuno lo sistemasse il numero scenderebbe e si vedrebbe.
2. Unità piccole, commit frequenti. Al completamento di OGNI unità:
   nuovo file checkpoint (MAI sovrascrivere i precedenti) con task
   completato, hash commit, prossimo passo atomico preciso; aggiornare
   lo stato del task in ROADMAP_SETTIMANA.md.
3. OGNI ciclo lavora FINO AD ESAURIMENTO DEI CREDITI, senza eccezioni
   (regola del fondatore, ribadita due volte): finita un'unità se ne
   inizia SUBITO un'altra; se la roadmap sembra finita si prosegue con
   seconde iterazioni, rimandati, test, revisioni — il lavoro non
   finisce mai da solo. VIETATO "chiudere il blocco" o fermarsi per
   scelta: l'unico stop legittimo è il limite tecnico della
   piattaforma. Il "punto stabile" (commit pulito + checkpoint
   completo dopo ogni unità) serve SOLO a rendere sicura
   l'interruzione forzata, mai a giustificare una fermata volontaria.
4. Ciclo serale: NON più un blocco fisso di revisione (direttiva
   fondatore 26/07). Al suo posto si prosegue con ricerca e sviluppo; la
   qualità si tiene con verifiche dentro OGNI unità (screenshot, test,
   controllo sintassi).
5. LAVORO IN CONTEMPORANEA su tutte e sei le app (direttiva 26/07): in
   ogni ciclo più cantieri aperti insieme, un agente per app (i file
   sono separati in apps/<nome>/, nessun conflitto). Si serializza solo
   ciò che tocca shared/, docs/, vault/.
   ⛔ **E NON È UN CONSIGLIO: È IL PRIMO MOLTIPLICATORE, MISURATO.** Il 30 e
   il 31/07, lavorando a cantieri paralleli, sono uscite **241 e 258**
   modifiche in un giorno; il 01/08, lavorando **tutto in fila**, ne sono
   uscite **92** — e non perché il lavoro fosse più difficile. La regola era
   scritta al modo gentile e quindi si è saltata. Nella forma vincolante:
   **ogni blocco apre almeno TRE cantieri insieme su app diverse.** Quando
   un'unità tocca una sola app non c'è ragione di aspettarla prima di
   aprirne un'altra: si serializza solo il commit e ciò che tocca `shared/`.

## Come si spende il tempo di un ciclo *(01/08, misurato su una giornata storta)*

⛔ **E LA VERIFICA VALE PER LO STATO CHE SI COMMITTA, NON PER QUELLO CHE SI ERA
MISURATO.** Variante della regola qui sotto, e il 01/08 è successa un'ora dopo
averla scritta: ho lanciato quattro suite sul disco, le ho viste verdi, e ho
committato — ma nel frattempo due cantieri avevano scritto altre funzioni, e il
commit conteneva **nove funzioni senza prova** che la mia misura non poteva
contenere. La CI l'ha detto, io no. Fra la misura e il `git commit` un albero
con cantieri aperti **cambia**, quindi o si misura la **copia di quello che si
sta per committare** (worktree + `git diff --cached | git apply`), oppure si
aspetta che i cantieri chiudano. Le due cose che si muovono di più sono il
**conto delle prove** e la **copertura**: sono anche le due che finiscono nei
documenti, e quindi le due che fanno cadere la CI.

⛔ **NON SI METTE NELL'INDICE UN FILE CHE UN CANTIERE STA MODIFICANDO**, e il
01/08 questa regola è costata la pagina di Scudo per cinque commit. Committando
il lavoro sugli allegati ho fatto `git add apps/scudo/index.html` credendolo
libero — il cantiere di Scudo era finito. Ma quello di **Campo** l'aveva toccato
(a ragione: senza quelle righe il suo ponte consegnava una falsità), e mi sono
portato dietro l'`import { daCampo }` **senza** il modulo che lo esporta, rimasto
su disco. Un import ESM di un nome inesistente è un errore **duro**: la pagina
non parte, e le suite `node` non se ne accorgono perché non importano le pagine.
Misurato affiancando due copie: `HEAD` dava elenco vuoto e KPI tutti «—», il
disco funzionava.
La difesa esiste già ed è quella che uso per i file di test: si costruisce il
contenuto **da `HEAD`** e lo si mette nell'indice con `hash-object -w` +
`update-index --cacheinfo`, senza toccare il working tree. Va usata per
**qualunque** file che un agente possa aver toccato — cioè, mentre girano
cantieri paralleli, per tutti tranne i propri. E il controllo che l'avrebbe
presa non c'è: nessuna suite apre le pagine partendo dal committato prima del
push.

⛔ **IL GIRO `node` PRIMA DEL COMMIT È UN COMANDO SOLO, E NON SI SCEGLIE A
MEMORIA:** `node apps/deepwork-id/tests/giro-node.mjs` (con `--tz` rifà tutto
anche in ora italiana). Il 01/08 la CI è caduta su `suite-collegate.mjs`, e il
controllo aveva ragione; quello che era sbagliato è che il giro fatto a mano ne
lanciava **undici su diciannove**. Le quattro rimaste fuori non erano difficili,
erano **dimenticate**. Una lista tenuta a mente si accorcia da sola, e ogni
volta che si accorcia il verde che stampa vale un po' meno. Il lanciatore legge
`scripts.test` di `tests/package.json` — la stessa verità che gira in CI — e ne
toglie solo le quattro suite che vogliono gli emulatori, dichiarate con la
ragione: elenco **derivato**, non gemello.

⛔ **UN CONTROLLO CHE GIRA SOLO IN CI È UN CONTROLLO CHE SI SCOPRE DOPO IL
PUSH**, e il 02/08 è costato un commit rosso in cima al branch. La CI compilava
i blocchi `<script>` di tutte le pagine da settimane; il giro di casa no. Così
`apps/sentinella/index.html` è stato committato con un `${...}` in mezzo a una
catena di `+` — errore di sintassi **duro**, la pagina non parte — mentre
1.901 prove, la copertura 602/602 e la verifica sulla copia di quello che si
committava erano **tutte verdi**: nessuna suite `node` importa le pagine. È la
terza volta che questa famiglia passa (l'`import { daCampo }` senza il modulo,
il `<script>` dimenticato, e questo).
La regola generale: **se la CI sa fare una cosa in tre secondi, quella cosa sta
anche nel giro di casa.** Se no la verifica «sulla copia» dà verde su un commit
rosso — la difesa che si crede di avere. Adesso c'è
`apps/deepwork-id/tests/sintassi-pagine.mjs` (15 pagine, 16 blocchi, elenco
**derivato** dalla cartella così un'app nuova entra da sola, controprova a
tappeto su 14 pagine su 14, iniezione **in memoria** perché le pagine le carica
il browser).
⚠️ Scrivendo quel file l'errore è stato rifatto: il commento d'intestazione
conteneva i delimitatori veri e chiudeva il commento a metà. Un esempio di
codice dentro un commento va scritto **senza i suoi delimitatori**.
⚠️ **E LA VESTE NUOVA, 07/08: UN COMMENTO DENTRO UNA STRINGA NON VA SCRITTO
AFFATTO.** Correggendo una riga del pannello diagnostico del core ho messo la
spiegazione in un `<!-- … -->` accanto alla riga — ma quella riga vive dentro un
**template literal**, dove `<!-- -->` non è un commento, è **testo**: i suoi
apostrofi («l'app», «c'era») hanno chiuso la stringa e `sintassi-pagine` è
passata da 15 a **14**. La regola pratica: se il testo che stai commentando è
dentro una `` ` ``, il commento va **fuori**, sopra la funzione che compone la
stringa. E la prova che lo dice in tre secondi esiste già ed è quella —
lanciarla prima di committare costa niente.

⛔ **IL COSTO DELLA VERIFICA VA A SCAGLIONI.** Rilanciare tutto a ogni unità è
il modo più sicuro di lavorare piano: il giro completo dei banchi dura **una o
due ore** e, mentre gira, rallenta di cinque-dieci volte ogni altra misura.
  - suite `node` → **sempre** (secondi);
  - banco mirato sulla superficie toccata, con `--solo=` → **sempre** (secondi);
  - **giro completo → una volta per blocco, alla fine.** Mai mentre si lavora.
  Un banco senza `--solo=` costringe ad aprire tutte e quattordici le superfici
  per controllarne una: aggiungerglielo è mezz'ora che restituisce ore, e va
  fatto la prima volta che serve.

⛔ **IL GIRO COMPLETO SI LANCIA DOPO IL COMMIT.** Gira su una **copia del
committato**: lanciato prima, prova codice vecchio e lo dichiara pure («N file
NON committati restano FUORI»). Il 01/08 ne sono stati buttati due — uno per
questo, uno perché la porta del server precedente era ancora occupata.
⛔ E la forma **silenziosa** di quella trappola è peggiore, misurata il 01/08:
un banco che, trovando la porta già occupata, la **riusa** non fallisce — misura
la copia di **qualcun altro**. Per un'ora la controprova di `pagine-vive` ha
detto «non so fallire» mentre iniettava il difetto in una cartella che nessuno
stava guardando: è l'iniezione che non inietta, la terza delle cinque cause,
nella sua veste più difficile da vedere. La difesa costa tre righe e va messa in
ogni banco che alza un server: si scrive un **contrassegno col proprio pid**
nella cartella servita e lo si **rilegge dal server**; se non torna, ci si ferma.
⛔ **E IL 07/08 QUELLA REGOLA È COSTATA UN GIRO INTERO PROPRIO PERCHÉ IL FILE DA
CUI DIPENDONO TUTTI GLI ALTRI NON LA RISPETTAVA.** `tutti.mjs` faceva
`if (!(await rispondePorta(PORTA))) { lo alzo io }`: se qualcuno rispondeva, lo
**riusava**. Lanciato un giro nuovo mentre il vecchio era ancora vivo, il nuovo
ha misurato per venti minuti la copia dell'altro — un commit diverso — e poi,
fermato il vecchio, ha letto **zero caratteri per schermata**: ventidue KO su
Scudo del tipo «la barra di navigazione ha una voce», «nessuna schermata
aperta», «0 caratteri letti», cioè un banco che accusa il prodotto di **non
esistere**. Chi legge quel registro senza sapere la storia apre un cantiere su
ventidue difetti immaginari.
La lezione non è sul contrassegno, che era già scritto qui: è che **una regola
scritta in questo file va cercata per prima cosa nel codice che la deve
applicare più di tutti** — e il codice che tutti gli altri usano è l'ultimo
posto in cui si pensa di guardare. Adesso il runner lo fa, e la controprova sta
in `impronta-giro.mjs`, nei **due versi**: con un server estraneo si ferma
(uscita 2, prima ancora di stampare l'impronta di partenza), col proprio riparte
— perché una guardia che si ferma **sempre** passerebbe il primo verso e
renderebbe il giro impossibile da lanciare.
⚠️ E il corollario pratico, misurato lo stesso giorno: un server rimasto vivo
dopo un giro ucciso **continua a rispondere sulla porta con una cartella che non
esiste più** (404 su tutto). Prima di lanciare un giro si guarda chi tiene la
porta, non solo se è occupata.

⛔ **MAI ASPETTARE GUARDANDO.** Un processo lungo si lancia **insieme alla
condizione che dice quando è finito**, e nel frattempo si lavora su altro. Se
non c'è altro da fare, quel processo è troppo lungo per essere lanciato adesso.
Il 01/08 sono stati bruciati decine di scambi a rileggere file vuoti.
⚠️ E l'attesa scritta male non finisce mai: `while pgrep -f "prova.mjs"` trova
**sé stessa** nella riga di comando dell'attesa. Si aspetta un **PID**.

⛔ **GLI STRUMENTI DI MISURA VIVONO NEI TEST, NON NELLO SCRATCHPAD.** Il 01/08
ne sono stati riscritti da zero quattro e **tutti e quattro erano sbagliati**:
la navigazione chiamata con due argomenti invece di tre (misurava otto volte la
stessa schermata), il rilevatore che diceva «tutte le etichette vanno a capo»,
quello che non sapeva che una `<label>` e un `<a href>` sono cliccabili per
natura, e il conto dei pixel diversi che rispondeva «da riga 181 a 894» quando
il 97% stava in settanta righe. Tre domande tornano in ogni misura e vanno
scritte **una volta sola**, dove si riusano: *questo esce dal suo spazio?
questa riga fa qualcosa se la tocchi? dove stanno davvero le differenze?*
⚠️ Il difetto comune a tutti e quattro: **calcolare una cosa che il browser sa
dire**. `scrollWidth > clientWidth` è la sua risposta a «esce?»; l'altezza
divisa per il corpo del carattere non lo è.

⛔ **E QUANDO IL RIGHELLO SBAGLIA E NON LO PUOI CORREGGERE ADESSO, FAGLI
DICHIARARE L'AMPIEZZA DEL SUO DUBBIO — non correggerlo a metà.** Misurato il
07/08 su `contrasto.mjs`, e in un momento in cui **cinque cantieri stavano
scegliendo colori guardando quei numeri**. Sopra un fondo a gradiente il banco
accoppiava il pixel d'inchiostro più chiaro col pixel di fondo più scuro **anche
quando stanno agli angoli opposti**, dove non si incontrano mai: dichiarava
2,92 dove il renderizzato faceva **4,71**, cioè accusava un colore che passava.
La correzione giusta è geometrica (proiettare il rettangolo del testo sull'asse
del gradiente) ed è un cantiere a sé; farla a metà è **peggio di non farla**,
perché un accoppiamento «un po' meno sbagliato» non si sa più di quanto sbagli.
La via che regge: **tenere il caso peggiore** — la direzione prudente — e
stampare accanto **la forbice** fra il peggiore e il migliore. La prova che
punta dove serve: sui numeroni dentro un gradiente la forbice è **4,05** ed è lì
che il conto a mano smentiva il banco; sui testi su fondo pieno è **zero**, ed è
lì che il banco aveva ragione alla cifra. Cioè l'avviso **separa le due
famiglie** invece di spargere dubbio su tutto.
È lo stesso principio del fondatore applicato allo strumento: come un colore
illeggibile risponde `null` invece di zero, **una misura incerta si dichiara
incerta**. Un righello che non sa quanto sbaglia manda a rovinare cose sane, e
quel danno non lo vede nessuno.
✅ **E IL CANTIERE È STATO FATTO IL GIORNO DOPO — questa riga resta per il
METODO, non come lavoro da fare.** L'08/08 inchiostro e fondo si leggono
**nello stesso punto fisico** e il peggiore si prende su quei punti. Sei
cantieri hanno rimisurato a mano tutti e **32** i KO delle sei app leggendo i
pixel veri: **quattro erano accuse false**, tutte fra i casi a forbice larga
(Flotta `.n` 3,01 contro 2,93; Campo `.n` 3,15 contro 2,86; due `.avatar.sup`
di Scudo 4,92 e 4,78 contro 3,77), e sui casi senza forbice i righelli
indipendenti davano lo stesso numero **alla cifra**.
⚠️ E la forbice larga da sola **non bastava** a saperlo: il «759k» di Terra
aveva forbice 3,85 ed era vero lo stesso, di 0,02. A dirlo è solo la geometria
— che è esattamente perché la correzione non si poteva fare a metà.
⛔ Il paragrafo qui sopra è rimasto scritto al presente per un giorno dopo che
il cantiere era chiuso, ed è la **terza forma d'invecchiamento** applicata a
questo file: una riga che propone un lavoro già fatto lo fa **rinascere**. Chi
chiude un cantiere descritto qui dentro chiude anche la riga che lo proponeva.

## La ricerca che gira di fianco *(direttiva fondatore 01/08)*

I crediti di una sessione restano in parte inutilizzati mentre si lavora in
serie. Si impiegano in una **ricerca continua**, con agenti `haiku` lanciati
**in background all'inizio di ogni blocco**. Non è una fonte di verità: è una
fonte di **candidati**.

⛔ **MIRATA, NON A CASO — e a indirizzarla è chi lavora** (direttiva fondatore,
01/08, dopo la prima tornata). «Cerca miglioramenti per l'app X» produce
dettagli d'interfaccia: utili, ma non è lì che sta il salto di qualità. La
ricerca si punta su **una domanda precisa con una risposta verificabile**, e le
domande escono da due posti soli:
  1. **dove chi lavora è carente** — e va detto per nome invece che aggirato.
     Al 01/08: **il mestiere della cava** (che cosa contiene davvero un rapporto
     di fine turno, che cosa chiede un ispettore, che cosa vuole la denuncia
     annuale — oggi lo si DEDUCE, e il codice solido poggia su inferenze);
     **i concorrenti di cinque app su sei** (per Genesi lo studio c'è, per le
     altre si è progettato da principi primi, che è il modo elegante di
     reinventare una ruota peggiore); **le norme citate ma non lette una per
     una**; **le parole del mestiere**, perché i testi devono suonare come li
     scriverebbe chi lavora in cava;
  2. **dove si è già lavorato ma in superficie** — una funzione consegnata che
     merita il dettaglio che la rende eccellente invece che sufficiente.
La forma della domanda è sempre questa: *«prima il mondo, poi la nostra app»* —
l'agente descrive come si fa fuori, POI apre il nostro file e dice **il
delta**. Un trattato senza delta non serve; un delta senza il mondo è una
lista della spesa.
⚠️ **Le fonti si citano, e la deduzione si dichiara deduzione.** Costruire su
un'invenzione di un agente è il modo peggiore di sbagliare, perché sembra
fondato. Un argomento diverso per blocco, a rotazione.

⛔ **E IL 14/08 TRE RICERCHE SU TRE HANNO DICHIARATO UNA MANCANZA FALSA, SEMPRE
PER LA STESSA RAGIONE: HANNO CERCATO LA PAROLA DEL MONDO DENTRO IL NOSTRO
CODICE.** «near-miss» dove il campo si chiama `tipo: infortunio|near-miss` ed
esiste un ponte apposta; «safety stock» dove la funzione si chiama
`propostaScorte` e il punto di riordino è `puntoDiRiordino(consumo, giorni di
consegna, giorni di sicurezza)` — **la formula citata nella metà 1 della ricerca
stessa**; «modello A» dove la pagina scrive già «dichiarazione annuale dei
quantitativi estratti». Il prodotto è scritto **in italiano, col nome del
mestiere**: un censimento fatto col vocabolario inglese della ricerca risponde
«non c'è» con la stessa faccia con cui direbbe la verità.
⚠️ **La difesa non è cercare meglio: è cercare il MECCANISMO invece del nome.**
La domanda «chi calcola quanti pezzi ordinare?» si risponde aprendo le funzioni
che parlano di ricambi; la domanda «c'è `safetyStock`?» non si risponde, si
sbaglia. È la direttiva 5 letta al contrario — là il pericolo era cercare *la
nostra* parola nel mondo, qui è cercare *la sua* in casa nostra, e costa uguale.
⛔ **E c'è una forma peggiore, perché la conclusione non si smonta col `grep`:
una frase LETTERALMENTE VERA con un verdetto falso.** «Non c'è una collezione
distinta dei near-miss» è **esatto** — e il «quindi va aggiunta» manderebbe a
**spaccare in due** una funzione progettata unita. Un `grep` di controllo che
cerchi la parola dell'agente **conferma**. Prima di scrivere «va aggiunto» si
cerca **come si chiamerebbe la cosa se esistesse fatta in un altro modo**.
⚠️ **E il limite dello strumento, misurato il 14/08 invece che creduto**:
`WebSearch` **funziona**; `WebFetch` su un dominio qualunque risponde
**`EGRESS_BLOCKED`** (provato su due domini diversi). Quindi una ricerca sa
**che cosa esiste**, e **non può leggere il testo primario**: ogni articolo,
scadenza, tariffa o formula attribuita a una norma viene da **risultati di
ricerca** e va marcata così. Un numero di legge riportato di seconda mano e
scritto in una schermata è **peggio di un numero assente** — il fondatore lo
mostrerebbe a un cliente.

⛔ **E ALLA QUARTA VOLTA SU QUATTRO IL MANDATO NON BASTA PIÙ: LA METÀ DEL DELTA
VA TOLTA ALLA RICERCA.** Il 14/08 quattro ricerche di fila hanno consegnato una
mancanza **falsa**, e la quarta l'ha fatto **dopo** che il mandato le elencava
per nome le tre precedenti, con gli esempi. Cioè: il vincolo scritto — «per ogni
"non c'è" incolla il comando e la sua uscita» — **non protegge**, perché un
comando incollato che cerca la parola sbagliata è una prova a favore.
Il conto, misurato: le quattro mancanze principali erano `near-miss` (esiste, è
un `tipo` dentro `infortuni`), `safety stock` (esiste, si chiama
`propostaScorte`, e la formula era **citata nella metà 1 della ricerca stessa**),
`modello A` (la pagina scrive «dichiarazione annuale»), `periodicità standard`
(il campo si chiama `periodicitaGiorni`, con valori veri nella dimostrazione).
**Zero su quattro sono entrate in roadmap**, e riverificarle è costato **un
minuto per riga** contro le centinaia di migliaia di token spesi a produrle.
⚠️ **La causa non è la pigrizia dell'agente: è che il delta chiede una cosa che
un agente di ricerca non può avere** — la conoscenza di come **questa** casa
chiama le cose. Il prodotto è scritto in italiano col nome del mestiere; la
ricerca arriva col vocabolario del mondo, e i due non si toccano.
**Quindi la forma nuova, dal 14/08**: la ricerca consegna **solo la metà sul
mondo**, con le fonti e la marcatura di seconda mano; **il delta lo fa chi ha il
codice in mano** — il ciclo o un cantiere di prodotto — e lo fa **partendo dal
meccanismo**: *chi calcola quanti pezzi ordinare? chi decide quando una verifica
è scaduta?*, aprendo le funzioni, non cercando un nome. Quello che la ricerca
può dare al delta è **la domanda**, non la risposta.

⛔ **E «NON C'È» VA PROVATO, NON DICHIARATO — misurato il 01/08 e costoso.**
Le sei ricerche sui concorrenti hanno censito 470 funzioni con le fonti: quella
metà è buona. Il **confronto con la nostra app** no. Delle tre mancanze più
ricorrenti, **due su tre erano false**:
  · Scudo, «cruscotto degli indici, 10 concorrenti su 10, noi zero» → indice di
    frequenza, indice di gravità e LTIFR erano **già calcolati e mostrati**,
    col caso «non calcolabile» già gestito;
  · Conti, «solleciti di pagamento» → **già presenti**, con i livelli di
    escalation, la mora ex D.Lgs 231/2002, il bottone per fattura e la sezione
    «chi sollecitare per primo».
Due cantieri stavano per aprirsi su cose già costruite, e li ha fermati la
regola «niente entra sulla parola dell'agente».
La difesa, da mettere nel mandato: **per ogni «non c'è» l'agente scrive la
prova di aver guardato** — il termine cercato e il file, oppure la riga citata
se l'ha trovato a metà. Un «non c'è» senza la sua ricerca accanto vale zero, e
un elenco di mancanze gonfiato è peggio di nessun elenco: manda a lavorare
dove non serve, che è l'unico modo di sprecare una giornata intera.

⏱️ **E C'È UNA SECONDA FORMA, CHE NON È COLPA DI NESSUNO: IL «NON C'È» SCADUTO.**
Misurata il 01/08, **sei righe** su 105. Non verifiche sbagliate: erano vere
quando sono state scritte, e il cantiere che colmava la mancanza è girato
**dopo**, lo stesso pomeriggio, senza sapere l'uno dell'altro. Due sono scadute
in **trentaquattro e trentacinque minuti**; la voce dichiarata «mancanza più
importante» di Campo è stata costruita **cinquanta minuti** dopo essere stata
scritta. E il costo si è visto la sera: una ricerca lanciata **con il divieto
esplicito** di dichiarare un «non c'è» senza la prova ha proposto l'anagrafe
appaltatori di Scudo, costruita due ore prima — cinque funzioni esportate e
dodici punti nella pagina. Cioè: **rileggere il documento non basta, perché il
documento è la cosa vecchia.**
La causa è il primo moltiplicatore (i cantieri paralleli), quindi la cura non
può essere lavorare in fila. È **meccanica**: ogni documento del delta dichiara
il commit contro cui è stato verificato, e
`node apps/deepwork-id/tests/documenti-invecchiati.mjs` pretende che quel commit
**esista** e che abbia **davvero toccato quel documento** (una data incollata
non è una verifica), poi stampa di quanti commit l'app è andata avanti da
allora. Arretrato al 01/08: **34 commit su sei documenti**, dichiarato per
essere visto scendere.
⚠️ **E la strada ovvia è stata provata e scartata, con i numeri, perché nessuno
la rifaccia alla cieca**: rimettere alla prova i termini che ogni riga dichiara
di aver cercato dà **8 righe segnalate, 2 vere, 6 falsi allarmi, e 2 righe vere
non viste**. Non è il confronto a sbagliare, è la **lettura**: la colonna della
prova è prosa, scritta da sei autori in sei notazioni, e cita i nomi di ciò che
**esiste** come controesempio accanto ai termini cercati a vuoto. Un allarme che
sbaglia tre volte su quattro insegna a non guardarlo.
⛔ La regola di comportamento che ne segue, e vale per ogni cantiere: **chi
chiude un'unità aggiorna la riga del documento che gliel'aveva proposta.** È la
sola cosa che fa scendere quel numero.

⛔ **E LO STRUMENTO VA NOMINATO NEL MANDATO, PERCHÉ UN «NON SI PUÒ» È UN «NON
C'È» CHE NESSUNO PENSA DI VERIFICARE.** Misurato il 13/08. Un agente di ricerca
ha provato la rete con `curl`, ha preso un **403 dal proxy**, e ha consegnato un
documento in cui **tutta la metà sul mondo era `[dedotto]`**, con la ragione
scritta in fondo: «l'accesso esterno è bloccato». Onesta, e **falsa**: la rete si
raggiunge con lo strumento `WebSearch` — che è un tool **differito**, va caricato
con `ToolSearch({query:"select:WebSearch,WebFetch"})` e un agente che non lo sa
non lo trova. Verificato in trenta secondi rilanciando la stessa domanda: otto
risultati veri da `sdmx.org`, `curl` verso lo stesso dominio ancora 403.
⚠️ Il danno non è il documento buttato: è che un documento **tutto dedotto sul
mondo** è esattamente ciò contro cui questa sezione mette in guardia — *«un delta
senza il mondo è una lista della spesa»* — e sarebbe entrato con la faccia di una
ricerca. La difesa è quella di sempre applicata a un caso nuovo: **niente entra
sulla parola dell'agente, e questo vale anche quando l'agente dichiara un
LIMITE.** Un «non si può» va rimisurato con lo strumento giusto, non creduto.
La regola pratica: **il mandato di ricerca nomina lo strumento e vieta l'altro.**

Perché serva davvero e non produca elenchi generici, cinque vincoli:

1. **Legge prima di proporre.** Ogni agente parte da `docs/RICERCA_*_<app>.md`,
   dalla roadmap e dai checkpoint dell'app: deve **dichiarare in cima** che cosa
   esiste già. È la difesa contro il difetto che in due giorni è costato quattro
   volte — il registro costi «da fare» che c'era già in Flotta, il «mai
   misurato» già scritto dodici righe più in là, la legge citata in sei punti e
   annunciata come scoperta.
2. **Non tocca il codice.** Scrive **solo** in `docs/RICERCA_CONTINUA_<app>.md`,
   in coda, mai sovrascrivendo. Così non litiga con i cantieri paralleli e le
   ricerche si accumulano invece di cancellarsi.
3. **Un formato fisso**, altrimenti l'esito va riletto e ridigerito, e il tempo
   risparmiato si perde: una riga per proposta con **schermata · che cosa non
   va · come si vede · quanto costa · come si misura**. Una proposta senza
   «come si misura» non entra.
4. **Niente entra in roadmap sulla parola dell'agente.** Un numero riportato si
   **rimisura** prima di scriverlo da qualunque altra parte: gonfiare i
   risultati è vietato dalla direttiva 5, e un agente veloce sbaglia i dettagli.
   La forma giusta è quella già usata: *«proposto da ricerca, non verificato»*
   finché qualcuno non l'ha aperto.
5. **Si legge alla fine del blocco, non durante.** La ricerca non deve mai
   diventare un'attesa: parte, cammina di fianco, e la si raccoglie quando il
   blocco chiude.

## Regole vincolanti
- ⛔ DATI DI RIFERIMENTO DEL FONDATORE — REGOLA FERREA E IMMUTABILE
  (25/07, non va più ripetuta): i dati che il fondatore ha fornito
  all'inizio erano SOLO ORIENTATIVI, per far capire i video che stava
  mostrando. NON devono comparire da nessuna parte nell'interfaccia,
  nei testi, negli export o nei documenti dell'app: archivio dei 190
  video, le 6/23 volate misurate, maglia 4,5×3,5, Nonel 25 ms, 15-20
  fori, calcare come "dominio di validità", e qualunque altra citazione
  di quella origine. Si possono USARE internamente per i calcoli e le
  calibrazioni, ma MAI mostrare né citare. Nessuna eccezione.
- ⛔ STILE — DIRETTIVA VINCOLANTE (fondatore 27/07, sostituisce quella
  del 25/07; «su questo non transigo»). Due metà da non confondere:
  1. **STRUTTURA: IDENTICA AL CORE, PELO PER PELO.** Le app copiano
     l'impianto estetico e le dinamiche di funzionamento del core
     Deepwork (index.html alla radice) senza cambiare "una virgola":
     stessa struttura di pagina, topbar, navigazione, card, liste,
     form, modali, toast, stati vuoti; stessi raggi, bordi, gradienti,
     ombre, spaziature, tipografia, transizioni, animazioni, alone che
     seguo il mouse; stessi comportamenti di interazione. Niente
     scorciatoie: `alert()`/`confirm()` del browser sono vietati, si usa
     il toast del core.
  2. **COLORE: IDENTITÀ PROPRIA DI OGNI APP.** NON si copiano i colori
     del core: quelli sono di Deepwork. Ogni app ha una **palette
     propria e un proprio carattere**, costruita attorno al suo colore
     principale, che va **fuso in tutto il contesto** (sfondi, aloni
     d'ambiente, bordi, grafici, stati) — non un accento sparso su un
     tema altrui. Ammessi colori di appoggio scelti per armonia, se
     servono a renderla più professionale e piacevole.
  Il punto di partenza è che oggi le app sono «un'accozzaglia di colori
  che non porta da nessuna parte»: l'obiettivo è una palette **armonica,
  accattivante e professionale** per ciascuna, decisa con ricerca
  cromatica vera e verificata per contrasto/leggibilità.
  shared/deepwork-style.css resta il veicolo tecnico della STRUTTURA;
  la palette per app passa dalle variabili di tema dell'app.
- 🎯 **L'ECCELLENZA È LO STANDARD — DETERMINANTE PER OGNI SCELTA FUTURA**
  (fondatore 27/07, da applicare a qualsiasi decisione, per sempre):
  1. **Nulla è lasciato al caso.** Ogni singola virgola e ogni singolo
     dettaglio vanno decisi con cognizione, non per abitudine o fretta.
  2. **Si parte dai migliori prodotti in circolazione**: si cercano, si
     studiano, si emulano — e poi si fa **meglio di loro**. Il metro non è
     "funziona", è "è il migliore che si possa fare".
  3. **Ricerca approfondita prima di ogni scelta**, su tutto: funzioni,
     interazioni, testi, estetica. Le ricerche vivono in `docs/` e vanno
     tradotte in unità concrete, mai gonfiate.
  4. **Metodo del confronto affiancato**: dopo ogni modifica si mette il
     risultato accanto al riferimento (il core, o il miglior prodotto di
     categoria) e si corregge dove il nostro è più povero. **Almeno tre
     iterazioni**: la prima versione non è mai quella buona. Non ci si
     ferma quando funziona, ci si ferma **quando è eccellente**.
  5. Sequenza dichiarata dal fondatore: **questa settimana l'estetica**,
     nei giorni successivi **lo standard di ogni funzione e funzionalità**,
     con lo stesso livello di approfondimento.
- **QUALITÀ VISIVA — cosa la produce davvero** (non basta applicare le
  variabili di colore): luce stratificata (ambiente + riflesso sul bordo
  alto + ombra propria + ombra proiettata), bordi che catturano la luce,
  aloni d'ambiente nella tinta dell'app, alone che segue il mouse,
  micro-profondità su badge/pillole/bottoni/campi, gerarchia tipografica
  vera con cifre allineate, movimento con curve morbide, spaziature su una
  scala coerente. Riferimenti: `docs/SPECIFICA_ESTETICA_CORE.md`,
  `docs/PALETTE_APP.md`.
- ⛔ **E QUANDO SI RACCONTA UN DIFETTO, ANCHE «IL VALORE VERO» PUÒ ESSERE UN
  NUMERO CHE NON SI SA.** Misurato il 14/08 su me stesso, e in un posto che
  conta: il documento che il fondatore apre per decidere. Avevo scritto che la
  scheda degli indici «diceva **IF 50,00** dove il vero è **100,00**». Ma il
  100 è quanto verrebbe **se** l'infortunio senza data fosse di quell'anno —
  ed è esattamente ciò che non si sa. Il prodotto risponde **ancora 50**, e
  deve: il conto non si tocca, si **dichiara** che manca qualcuno.
  ⚠️ Quindi la frase, scritta così, faceva **lo stesso difetto che descriveva**:
  presentava come certo un numero condizionale. E si smentiva da sola due righe
  dopo, dove c'era scritto che il conto non era cambiato.
  La forma che regge: **«quel 50 non si può sapere se è giusto: se
  quell'infortunio è dell'anno, sono 100»** — il condizionale resta
  condizionale. Vale per ogni racconto di un difetto di questa famiglia: il
  numero sbagliato ha quasi sempre accanto un numero **che nessuno può
  calcolare**, e chiamarlo «il vero» è comodo e falso.
- ⛔ **L'ASSENZA DI UN DATO NON È UN DATO FAVOREVOLE.** Trovata il 31/07 in
  **tre app indipendenti**, scritta ogni volta da un punto di vista diverso:
  in Sentinella «senza dati» non è «conforme» (il report per l'ente lo dichiara
  invece di spacciarsi per a posto); in Scudo un requisito senza nessuna riga in
  scadenzario è **mancante**, non «regolare»; in Campo, nell'appello del turno,
  **«non lo so» non è «non c'è»** — chi nessuno ha spuntato non si conta né
  presente né assente, perché se suona l'allarme contarlo assente vuol dire non
  andarlo a cercare. Tre posti, tre autori, la stessa idea: è un **principio del
  prodotto**, e va applicato a ogni funzione nuova che riassume qualcosa. Il
  segno che è stato violato è sempre lo stesso — un numero o un colore
  **tranquillo** dove non è stato misurato niente.
- ⛔ **E IL NUMERO PUÒ ESSERE GIUSTO MENTRE A MENTIRE È IL DISEGNO.** Forma
  nuova del principio qui sopra, censita il 06/08 e costata **sei difetti veri
  in un giorno**. Nel core la barra di luglio dichiarava `height:100%` e
  `data-val="2261.7 mc"` e veniva disegnata **3 px**, identica ai cinque mesi a
  zero: `.chart-bars` era alto 120px ma la colonna dentro, con
  `align-items:flex-end`, restava alta quanto il contenuto, quindi la
  percentuale si risolveva contro un `auto`. CSS valido, percentuale presente,
  zero errori in console: **non c'è niente da leggere**. Poi la stessa famiglia
  in tre app — in Terra una barra da 8,88 px su un anno senza rilievi mentre i
  KPI sopra dicevano «—»; in Conti una fattura vera da **12 €** disegnata a
  **zero px** e 9.750 € e 8.100 € tutt'e due a 7,88; in Sentinella la miniatura
  che contraddiceva il badge sopra di lei su una lettura **pari** alla soglia.
  ⚠️ **E non si vedeva perché non c'era mai stata una barra alta**: senza dati
  d'esempio tutti i valori sono a zero, e stanghette uguali sono esattamente
  quello che ci si aspetta da un grafico vuoto. Quindi il metodo, provato su
  cinque app: si costruisce il caso **iniettando i dati nella risposta HTTP**
  del proprio server (mai sul file), si misurano i **pixel** con
  `getBoundingClientRect()` contro il valore dichiarato, e la prova che conta è
  **il rapporto fra due valori diversi** — un campione solo non distingue
  «funziona» da «sono tutti uguali». Difesa: `lunghezzaBarra` in
  `shared/dw-grafici.js` (uno zero si disegna zero) e quattro banchi in
  `tests/browser/*-disegni.mjs` / `terra-geometrie.mjs`.
  ⚠️ Il limite dichiarato: un **minimo di visibilità** appiattisce comunque i
  valori piccoli fra loro (misurato su Scudo: 2, 3, 5 e 10 scadenze tutte a
  1,85 px). Alzarlo o abbassarlo non risolve — i banchi **stampano le coppie
  appiattite** invece di saltarle in silenzio.
- ⛔ **UNA COPIA NASCE QUASI SEMPRE DA UNA FIRMA TROPPO STRETTA.** Tre volte in
  poche ore il 06/08, in tre posti che non si parlano: il minimo della barra
  scritto a mano in tre punti di `dw-grafici`; `disegnaSpark` che decideva la
  soglia con `>` mentre la sorella `disegnaLinea` legge già `inclusiva`; e
  `jitterGeo` di Genesi col seme **inchiodato a 7**, per cui chi ne serviva tre
  diversi ha ricopiato sei righe. In tutt'e tre i casi la copia è sparita
  **aggiungendo un argomento** (o allargando il contratto), non riscrivendo
  niente. Quindi la domanda da farsi **prima** di ricopiare un corpo:
  *all'originale manca un parametro?* Costa una riga e toglie una divergenza
  futura — che era già lì: la seconda Box–Muller scriveva `6.2831853` dove il
  modulo scrive `2*Math.PI`.
  ⛔ **E IL 09/08 IL CONTO È TORNATO INDIETRO A MORDERE, NELLA VESTE PEGGIORE:
  UN CONTRATTO ALLARGATO A METÀ.** Quel `>` di `disegnaSpark` fu corretto
  allargando `soglia` da numero a «numero **oppure** `{valore, inclusiva}`». Ma
  l'allargamento fu fatto **dove si legge il verdetto**, e non quaranta righe
  più su **dove si costruisce la scala**, rimasta a `Math.min(min, s.soglia)`:
  con la forma nuova quel `Math.min` fa **NaN**, e da lì è NaN il percorso
  (`M2.0 NaN…`), la riga della soglia (`y1="NaN"`), tutto. Effetto: **la
  miniatura del Quadro di Sentinella non disegnava NIENTE** — linea e area
  **0×0 px** — sulla dimostrazione e sulla prima schermata dell'app, con la
  console pulita e nessuna prova rossa, perché un attributo SVG non valido non
  solleva niente.
  ⚠️ E si rompeva **solo dove aveva qualcosa da dire**: un punto **senza**
  soglia si disegnava benissimo. Il difetto stava esattamente sui punti che il
  prodotto esiste per far vedere, ed è per questo che nessuna schermata normale
  lo mostrava.
  La regola: **quando si allarga il contratto di un valore, si cercano TUTTI i
  posti che lo leggono** — non solo quello che si sta correggendo. Il segno da
  riconoscere sono **due sorelle con due contratti** (`disegnaLinea` accettava
  solo l'oggetto, `disegnaSpark` tutt'e due, ognuna normalizzando per conto
  suo): finché la normalizzazione è scritta due volte, allargarne una sola non
  produce un errore, produce un `NaN` silenzioso. Adesso è una
  (`normSoglia` in `shared/dw-grafici.js`) e la usano tutt'e due.
  ⛔ **E LA CONTROPROVA HA BOCCIATO LA DIFESA, che è la parte che vale più del
  difetto.** La prima stesura della prova aveva un aiuto che **rifaceva in tre
  righe il calcolo della scala** e ci appendeva tre asserzioni: col difetto vero
  rimesso restavano **verdi**, perché non guardavano `disegnaSpark` — era una
  **copia debole scritta dentro la difesa contro una copia debole**. È la quarta
  causa di «non distingue» (l'iniezione è vera, la prova guarda un'altra
  funzione), e si riconosce da una domanda sola: *questa asserzione chiama il
  codice di prodotto, o una mia versione di esso?* Quando il codice non si può
  chiamare da `node` (qui voleva un DOM), la difesa va messa **sul sorgente** —
  nessun `min`/`max` ricavato dal valore grezzo — non riscritta in casa.
- ⛔ **UNA REGOLA CHE SERVE A DUE APP VIVE IN `shared/`.** Non nel modulo di una
  delle due (nessuna app importa il modulo dati di un'altra) e **mai riscritta**:
  è il difetto che è costato una giornata intera con la convenzione sui numeri,
  finita scritta quattro volte con tre comportamenti diversi. Il posto per la
  logica che sta **fra** le app è `shared/dw-ponti.js`; il modulo dell'app la
  **ri-esporta** col nome con cui l'ha sempre chiamata, così le pagine non
  cambiano — un alias non è una seconda implementazione.
  E il test pretende l'**identità** (`terra.X === ponti.X`), non il
  comportamento: due copie uguali oggi divergono domani senza che nessuno lo veda.
- **MISURARE PRIMA DI IRRIGIDIRE.** Due volte in un giorno l'ipotesi ragionevole
  era falsa: sui campi interi «basta leggere `checkValidity()`» — no, su «1,5»
  Chromium fa «15» e risponde **true**; e su `parseNum` «si può irrigidire» — no,
  cinque letture sono celle di CSV di una perforatrice, che scrive in notazione
  scientifica. Mezz'ora di misura prima, invece di una correzione che rompe in
  silenzio.
- ⛔ **E LA FORMA PEGGIORE È LA COPIA PIÙ DEBOLE, NON L'INVENZIONE.** Misurata
  la notte fra il 2 e il 3 agosto: nel **solo core**, **tre difetti su tre**
  avevano la stessa causa — una regola che sta in `shared/` da mesi, riscritta
  lì dentro in una versione che guarda la **forma** invece della sostanza.
  · i giorni fra due date: `new Date(d2)-new Date(d1)` invece di `giorniTra`
    → `null` dava «scaduta da 56 anni», `30/02` scorreva al 2 marzo, e un `NaN`
    faceva **sparire** un promemoria da tutti e due gli elenchi;
  · la data stampata: `d.split("-")` rimontato a mano invece di `dataIt`
    → «30/02/2026» stampato come una data qualunque e «boh» stampato
    **«undefined/undefined/boh»**, in **58 punti** della pagina;
  · la media dei fori, scritta **quattro volte** nello stesso file con
    comportamenti diversi — e una delle quattro era già quella giusta.
  Non è distrazione: la copia debole **funziona** sui dati buoni, e nessuna
  prova la guarda. Chi scrive una funzione che tratta date, numeri scritti a
  mano o CSV **cerca prima in `shared/deepwork-id-client/dw-shell.js`**
  (`dataISOEsiste`, `dataIt`, `giorniTra`, `numIt`, `csvCell`, `leggiCsv`) e in
  `shared/dw-ponti.js`. Il segno da riconoscere è sempre lo stesso: un
  controllo che guarda **com'è scritto** un dato invece di **che cosa vale**.
  ⚠️ **E due controlli automatici sono stati provati e SCARTATI con la misura,
  perché nessuno li rifaccia alla cieca**: (1) una regola di stile sulle date
  formattate a mano — restano **un solo** soggetto vero, gli altri sono chiavi
  di mese (`YYYY-MM`) costruite internamente; (2) un censimento dei **nomi**
  che collidono con `shared/` — **zero** collisioni su 15 pagine e 55 nomi
  condivisi, perché le copie deboli hanno sempre un nome diverso (`fmt` contro
  `dataIt`, `daysBetween` contro `giorniTra`). Cioè: questa famiglia **non si
  prende con una regex**, si prende leggendo — ed è per questo che sta scritta
  qui invece che in una suite.
  ⛔ **E IL 03/08 SI È MISURATO DOVE STA, e non è sparsa: sta dove il DOCUMENTO
  SI COMPONE.** Cinque app in una notte, **ventiquattro** difetti veri, e il
  filo è uno solo — la regola giusta esisteva già nel modulo, e chi scriveva il
  file o la frase se n'è tenuta una versione più debole:
  · Conti aveva `statoScadenzaFattura` e nel CSV ne teneva la **terza** copia
    (`scadenza=null` scritta come la parola «null», con `stato=aperta`);
  · Sentinella aveva `conSoglia`, e il commento di quella funzione **elenca**
    chi deve passare di lì — «semaforo, KPI, grafico, allerte, report»:
    l'export non c'era, e il file per l'ARPA scriveva «Conforme» dove lo
    schermo diceva «Superamento»;
  · Flotta aveva `ritmoOreMezzi` che rifiutava il contatore sceso, e
    `consumoPerMezzo` no: 0,68 l/h invece di 2,22;
  · il core aveva `dataIt`, e la barra alta un `nowrap` che il core non ha;
  · Terra aveva `rilievoUsabile`, e due punti della pagina decidevano con
    `r.volumeM3 != null`, che accetta `""` e `"abc"`.
  La domanda che li trova tutti, e va fatta **prima** di leggere il codice
  riga per riga: **dove questa app compone qualcosa che ESCE — un CSV, un PDF,
  una frase di riepilogo — chi decide i suoi numeri?** Se la risposta non è
  «la stessa funzione che li decide a schermo», lì c'è una copia debole. È il
  posto dove nessuna prova guarda, perché le prove chiamano il modulo e i file
  li compone la pagina.
  ⚠️ E il modo di misurarlo non è leggere: è **premere il bottone e aprire il
  file che esce**. Il censimento statico su quelle cinque app era **a zero**.
- ⛔ **LA RISPOSTA È QUASI SEMPRE GIÀ IN CASA — SI CERCA PRIMA DI INVENTARE.**
  Quattro volte in due giorni, e ogni volta è costato lavoro o ha rischiato di
  far scrivere una cosa falsa: il **registro costi** «da fare in Conti» esisteva
  già in **Flotta**; «**mai misurato**» andava inventato in Sentinella e c'era
  già, con l'etichetta e il colore giusti, dodici righe più in là in
  `statoRigaProgramma`; «**senza data**» sembrava un termine nuovo ed era già la
  convenzione di **tre** app; e la **L. 198/2025** sui mancati infortuni è stata
  annunciata come scoperta quando era citata in **sei punti** di Scudo, che sul
  quel obbligo aveva già costruito il prospetto. Due minuti di `grep` prima di
  ogni «non c'è» e di ogni parola nuova. E la forma peggiore di questo errore è
  **annunciarlo**: gonfiare un risultato è vietato dalla direttiva 5, e un
  documento che spaccia per nuovo ciò che c'era rende meno credibile tutto il
  resto che dice.
- MULTI-TENANT: isolamento totale dei dati tra organizzazioni. Ogni
  accesso dati delle app passa dallo SDK deepwork-id-client
  (orgCollection), mai percorsi Firestore costruiti a mano.
  ⚠️ **E il confine fra APP non è una barriera di sicurezza**, misurato il
  04/08: `orgCollection` costruisce `organizations/{org}/apps/{appId}/{nome}`
  con l'`appId` dell'istanza SDK, e le regole aprono `/apps/{appId}/**` a
  **qualunque membro dell'organizzazione**. Chiunque può inizializzare l'SDK con
  un altro `appId` — ed è esattamente quello che i **ponti** fanno di proposito
  (`ponteScudo` in Sentinella). La barriera vera, provata da 68 test, è quella
  fra **organizzazioni**. Le due cose non vanno raccontate come se fossero la
  stessa: se un giorno servirà «chi lavora in cava non tocca i documenti di
  sicurezza», non è un problema di `appId`, è la decisione aperta sui **ruoli**
  dentro l'organizzazione.
- ⛔ **IL MESSAGGIO DI UN COMMIT SI PASSA CON `git commit -F <file>`, MAI CON
  `-m` FRA VIRGOLETTE.** Misurato il 13/08, e la beffa è che è successo
  **scrivendo la regola sui commit incompleti**: il messaggio conteneva un
  esempio di codice fra apici inversi, la shell l'ha preso per una sostituzione
  di comando, e nel commit è finito «un  reggeva sull'invariante» — con il buco
  al posto dell'esempio. Il commit **non fallisce**: passa, mutilato, e la
  storia di git non si può più correggere senza riscriverla.
  Un messaggio di commit di questa casa contiene quasi sempre codice, virgolette
  basse, apostrofi e caratteri che una shell interpreta: `-F` li consegna
  **testuali**. È la stessa famiglia dello script che non fallisce — solo che
  qui a essere mutilato è il racconto, cioè la sola cosa che resta quando il
  codice sarà cambiato.
- GIT: sviluppo sul branch di sessione designato. Niente push diretto
  su main: gli aggiornamenti passano da Pull Request (prassi:
  merge via PR anche per vault/ e docs/). Commit piccoli con messaggi
  chiari.
- SOLDI: nessuna spesa (domini, piani a pagamento) prima della fase di
  commercializzazione — decisione esplicita del fondatore.
- SICUREZZA: docs/MITIGAZIONE_PASSWORD.md è PREPARATA ma NON attivata
  senza conferma esplicita del fondatore in conversazione.

## Test
- ⚠️ **LA SUITE ESISTE E COPRE TUTTE LE APP.** Tre cantieri di fila hanno
  scritto «la mia app non ha una suite in cui mettere i test» e non è vero:
  `apps/deepwork-id/tests/run-kpi.mjs` importa **tutti** i moduli
  `apps/<nome>/<nome>-data.js`, quindi qualunque funzione pura di qualunque
  app si testa lì. Si lancia con `node apps/deepwork-id/tests/run-kpi.mjs`,
  senza emulatori e senza rete. Due avvertenze imparate a spese nostre:
  1. i test vanno inseriti **prima** del blocco di riepilogo finale, che
     chiude con `process.exit`: appesi in coda non vengono mai eseguiti, e il
     totale resta invariato senza che nulla segnali l'errore;
  2. si controlla sempre che il **totale sia salito**, non solo che i falliti
     siano zero: un file di test inerte dice «0 falliti» come uno che passa;
  3. ⛔ e una prova scritta in fondo **non può essere `async`**, che è la stessa
     trappola in una veste che il punto 1 non copre: `await Promise.all(inVolo)`
     sta a metà file, quindi una prova asincrona aggiunta dopo viene messa in
     volo e il totale si stampa **senza aspettarla**. Misurato il 07/08: 1842
     prima e 1842 dopo, e l'unico segno era «**7** prove asincrone aspettate»
     invece di 6 — un numero che nessuno guarda. Non è «dopo il `process.exit`»:
     è **dopo l'`await`**. Se serve leggere un file, l'`import` si fa fuori dal
     test e la prova resta sincrona. L'ha presa il punto 2, che è la ragione per
     cui il punto 2 esiste.
- ⚠️ **`toLocaleString("it-IT")` NON RAGGRUPPA ALLO STESSO MODO** in Node e nel
  browser: sui numeri di **quattro cifre** Chromium scrive «6.375» e Node
  «6375» (strategia `min2`). Da cinque cifre in su sono d'accordo. Le pagine
  non ne soffrono — girano solo nel browser — ma i **moduli dati li leggono
  tutt'e due**, e una loro funzione che non scrive `useGrouping` restituisce
  due stringhe diverse a seconda di dove gira: da lì una prova che passa in
  Node e **fallirebbe nel browser**, cioè che blinda una verità che l'utente
  non vede mai. La regola 16 di `run-stile.mjs` lo pretende scritto (anche
  `false`, dove è la scelta giusta). Misura: `docs/MIGLIAIA_NODE_CONTRO_CHROMIUM.md`.
- ⛔ **UNA CLASSE CHE NESSUNO DIPINGE E NESSUNO CERCA** è l'analogo CSS del nome
  libero, e come quello non produce **niente da leggere**: il `class="ords"` di
  Scudo — con la esse — ha disegnato tre filtri `display:block` con `gap: normal`
  per cinque commit senza un errore, una prova rossa o una riga sbagliata da
  trovare. Adesso c'è `apps/deepwork-id/tests/classi-orfane.mjs`.
  ⚠️ **E la prima domanda era quella sbagliata**, che è la parte che serve
  ricordare: «quale foglio la definisce?» dava **14** risposte su 1.154 classi e
  almeno **sette erano ganci di JavaScript** (`chk-item`, `uf-cava`, `cv-dest`) —
  classi vivissime, cercate con `querySelectorAll`, che nessun foglio dipinge di
  proposito. La **seconda domanda** — *ogni occorrenza di questo nome, in tutto
  il codice vivo, sta dentro un `class="…"`?* — porta 14 → **4**, tutte vere.
  E due dei falsi allarmi venivano dai **commenti**, per la terza volta in un
  giorno: i commenti vanno tolti in **tutt'e tre** le sintassi che una pagina
  contiene (HTML fuori, `senzaCommenti` dentro `<script>`, `/* */` dentro
  `<style>`), e un foglio può essere definito **in una stringa** (`CSS_ESEMPIO =
  ".esempio{…}"`, la finestra di stampa di Campo e Terra).
- **DUE CONTROLLI CONTANO AL POSTO DELLA MEMORIA**, e sono in coda alla suite:
  `copertura-funzioni.mjs` (quante funzioni sono provate: due volte in due
  giorni quel numero è finito sbagliato in un documento perché contato a mente)
  e `nomi-doppi.mjs` (lo stesso nome esportato da due app: o è lo **stesso
  oggetto**, o la differenza va **dichiarata con la ragione**). La regola del
  `shared/` era scritta qui dentro da mesi, e in un giorno solo ne sono uscite
  **cinque** violazioni: una regola scritta è affidata alla memoria di chi legge.
- ⚠️ **UN FONDO CATTURA LE PROVE TOLTE, NON IL CODICE AGGIUNTO SENZA PROVE.** Il
  03/08 `copertura-funzioni.mjs` prometteva nella sua intestazione: «se una app
  scende sotto il fondo vuol dire che sono state aggiunte funzioni senza prove».
  **Falso, e misurato**: aggiungendo a Terra un `export function
  funzioneMaiProvata` la conta va a **40/41, 98%** e il controllo esce **0** —
  perché il fondo sta sul numero di funzioni **coperte**, che aggiungendo codice
  non provato non scende. Il caso che la riga prometteva era esattamente quello
  che non vedeva, e nella direzione che rassicura. Vale per **qualunque** soglia
  scritta su un valore monotòno: si controlli **che cosa fa scendere il numero**,
  non solo che il numero non scenda. Adesso la regola vera è **nessuna funzione
  scoperta** (tutte e sei le app e tutti e tre i moduli condivisi sono al 100%,
  e chi aggiunge una funzione aggiunge la prova o la dichiara in `FUORI` con la
  ragione); il fondo resta come seconda guardia.
  E il censimento adesso guarda anche `shared/dw-ponti.js`,
  `shared/deepwork-id-client/dw-shell.js` e `apps/genesi/pointcloud.js`: si
  chiamava «quante funzioni delle **app**» e lasciava fuori proprio il codice
  che la regola del `shared/` indica come il più pericoloso. Copertura misurata
  lì: **46 su 46**.
- Le altre suite locali (`run-demo.mjs`, `run-helpers.mjs`,
  `run-pointcloud.mjs`, `run-manifest.mjs`, `run-stile.mjs`) girano anch'esse
  con `node`.
- **`run-stile.mjs` rende verificabili le regole vincolanti** che prima
  vivevano solo qui — venti, al 05/08: niente dialoghi del browser, unità mai in
  maiuscolo, nessun campo decimale `type="number"`, nessun campo decimale letto
  col lettore che fa zero, la guardia sui campi interi montata dove servono, il
  ponte con Terra che non dà la colpa a chi compila, la provenienza di un
  rilievo decisa in un posto solo, e la **struttura del core mai riscritta in
  casa** (chi carica `shared/dw-app-ui.js` non ridefinisce toast e modale; chi
  le usa deve averle da qualche parte — togliere le funzioni dimenticando il
  `<script>` non è un errore di sintassi, la pagina si apre e muore al primo
  tocco), e — dal 03/08, **regola 18** — che **una mappa di stati copra tutti
  gli stati che la sua funzione sa dire**: quel giorno `statoScadenzaHSE` ha
  guadagnato una quarta risposta e la mappa dei badge ne aveva tre, cioè
  `B[st][0]` avrebbe ucciso la pagina **al disegno**, senza nessun errore di
  sintassi da vedere. E — dal 05/08, **regola 19** — che **la barra in basso
  abbia tante colonne quante voci**: `.nav` è una griglia a colonne fisse
  (`--nav-cols`), quindi una voce aggiunta senza toccare quel numero non
  stringe la barra, la manda **a capo**, e l'ultima voce finisce sotto le
  altre, invisibile e non toccabile. Successo lo stesso giorno aggiungendo
  «Costi» a Conti: nessun errore, nessuna prova rossa, e leggendo il codice non
  si vede — l'ha trovato solo lo scatto. E — dal 01/08, **regola 20** — che
  **una non-misurabilità dichiarata dal modulo sia letta da qualcuno**: quando
  un modulo si accorge di non poter misurare qualcosa lo dichiara con una
  bandiera accanto al numero (`misurabile`, `leggibile`, `calcolabile`, `noto`,
  `attendibile`, `pochi`), e se quella bandiera non la legge nessuno — né la
  pagina né il modulo stesso — **non protegge niente**: il numero tranquillo si
  disegna lo stesso e il modulo sembra a posto perché la dichiarazione c'è. È la
  guardia scollegata della regola 17, applicata al principio del fondatore.
  Due cose imparate scrivendola, tutt'e due già in questo file e fatte lo
  stesso: cercava `bandiera:` **a testo** e prendeva i commenti per
  dichiarazioni (si usa `mascheraCodice`, non se ne scrive un altro); e
  pretendeva la lettura **nella pagina**, accusando `origineDi` di Terra il cui
  `noto` lo consuma `descriviOrigine` dentro il modulo — cioè il disegno
  **giusto**, quello della regola 7. Il vocabolario è **corto di proposito**:
  `misurato` è fuori perché è un *valore*, `assente` e `mai` perché sono
  *stati*. E la copertura è **dichiarata**: usano quel vocabolario tre app su
  sei, quindi «nessuna violazione» non vuol dire «tutte a posto».
  L'intestazione del file le elenca con
  la ragione di ognuna. Quando nasce un'app va aggiunta all'elenco `SUPERFICI`.
- ⚠️ **UN'ECCEZIONE CHE NON SERVE PIÙ È UN'ECCEZIONE CHE NASCONDE**, e a
  pretenderlo è `sonda-vuoto.mjs`. Non controlla solo che non nascano
  «tranquilli» nuovi: controlla anche che ogni caso scritto in `ACCETTATI` e
  `ALLARMI_ACCETTATI` **si presenti ancora**. Il 01/08 ha fatto cadere la CI
  perché tre non si presentavano più — `scudo.statoAzione`,
  `scudo.statoIspezione`, `campo.pianoRiepilogo` — e non erano guasti: erano
  casi **corretti** dal censimento del principio, con le righe che li scusavano
  rimaste lì a coprire un difetto che non c'era più. La forma da leggere in
  fondo è «7 tranquilli trovati, **7** dichiarati»: quando i due numeri si
  scostano, l'elenco è più vecchio del codice.
  ⚠️ **E questa suite va nel giro di verifica PRIMA del commit**, insieme a
  `numeri-nei-documenti.mjs`: quel giorno non c'erano, e infatti il difetto
  l'ha trovato la CI invece di chi committava.
- ⚠️ **`run-demo.mjs` distingue il dato CORROTTO dal dato ASSENTE**, dal 01/08,
  e la ragione vale per qualunque controllo d'integrità che si scriverà dopo:
  pretendeva che ogni fattura d'esempio avesse emissione e scadenza valide,
  quindi la dimostrazione **non poteva contenere** proprio il caso per cui la
  difesa era appena stata costruita — la fattura senza scadenza, su cui l'app
  diceva le cose più tranquillizzanti che sapesse dire. Un campo assente non è
  un refuso: è **uno stato che il prodotto sa raccontare**, e metterlo nella
  dimostrazione è un modo di mostrarlo. Quello che va impedito è `2026-13-45`.
  ⚠️ E lì dentro c'era **la stessa regola scritta due volte, più debole**: la
  `isDate` di casa accettava **«2026-02-30»**, perché `Date.parse` un giorno che
  non esiste non lo rifiuta — lo fa **scorrere** al 2 marzo. La versione giusta
  (`dataISOEsiste`) era in `shared/` da mesi.
- ⚠️ **IL CONFRONTO DELLE PROVE SCRIVEVA `null` PER QUATTRO VALORI DIVERSI.**
  Seconda faccia della regola qui sotto, e più insidiosa perché lo strumento
  non è una *scansione* ma il **confronto stesso**. Fino al 01/08 `eq` di
  `run-kpi.mjs` e `run-pointcloud.mjs` usava `JSON.stringify`, che appiattisce
  cinque coppie: `Infinity`, `-Infinity`, `NaN` e `null` si scrivono **tutti**
  `"null"`; `-0` come `0`; `{a:undefined}` come `{}`. Non conta il numero delle
  collisioni, conta **dove cadono**: `null` è la convenzione con cui
  l'ecosistema dice «non si può calcolare» — il principio del fondatore — e
  `Infinity` è **esattamente quello che produce il difetto** (una divisione per
  zero). Cioè il buco stava sotto le prove che difendono il principio, sul
  valore che quelle prove esistono per prendere. È saltato fuori perché una
  controprova rispondeva «non distingue» **col difetto rimesso dentro**: non
  era la prova scritta male, era lo strumento sotto — la sesta causa da
  aggiungere alle cinque dell'elenco. Adesso il confronto passa da
  `tests/mostra.mjs`, che sta in un file suo perché lo usano **due** suite.
  Il risultato onesto, che non va gonfiato: **con il confronto stretto la
  suite resta verde**, i 253 `eq(..., null)` erano tutti `null` davvero. Il
  buco c'era e non aveva ancora nascosto niente in ciò che è scritto: ha morso
  una prova **nuova**, mentre la si scriveva.
- ⛔ **UN CONTROLLO TENUTO LARGO «PER NON FARE FALSI ALLARMI» PUÒ ESSERE CIECO
  PROPRIO DOVE SERVE — E IL COSTO DELLA STRETTA SI MISURA, NON SI TEME.**
  Misurato il 07/08, ed è costato **una settimana** di difetto in produzione.
  `nomi-liberi.mjs` esiste per prendere un nome chiamato che non esiste (errore
  **duro**: la pagina si apre e muore al primo tocco). Riconosceva i nomi
  dichiarati con `\b(?:const|let|var)\s+([^;\n]*)` — cioè prendeva **tutta la
  riga** e la spezzava sui non alfanumerici — e nel suo commento c'era scritta
  la ragione, sensata: *«largo di proposito: un falso negativo costa meno di un
  falso allarme»*. Effetto vero: legava **ogni parola sulla stessa riga di un
  `const`**, compreso il nome della funzione chiamata lì dentro. Cioè era cieco
  sulla forma più frequente che il codice abbia, `const x = qualcosa(...)`.
  Sotto ci stava un difetto vero: `chiediDati()` chiamata **sei volte** in
  Flotta e mai definita — il commit `486011d` del 31/07 aveva portato in
  `shared/dw-app-ui.js` **sette** delle otto funzioni della struttura e non la
  ottava, l'unica che usava una app sola. Premendo «è ripartito» su una
  macchina ferma **non succedeva niente**, e nessuna delle 2.190 prove lo
  vedeva.
  ⚠️ **La lezione non è «stringere sempre»: è che l'ampiezza è un numero, e
  quel numero si misura.** Stringendo, il costo del rumore è stato **due** nomi
  da dichiarare in tutto (`import(` che è sintassi, `require(` che è Node) più
  il difetto vero: zero falsi allarmi. Il timore era ragionevole e la misura
  l'ha smentito in cinque minuti. Prima di lasciare largo un controllo,
  **stringilo su una copia e conta gli allarmi nuovi**: se sono pochi e
  dichiarabili per nome, un elenco corto e scritto è meglio di una regola larga
  che nasconde.
  ⛔ **E NEL VERSO OPPOSTO IL CONTO SI FA UGUALE, MA CAMBIA COSA SI CONTA.**
  Misurato l'08/08 allargando `nomiLegati` perché riconoscesse i parametri dei
  metodi abbreviati (un metodo non ha la parola `function`, quindi i suoi
  argomenti restavano liberi: 11 falsi allarmi nel solo SDK). Allargare ciò che
  **lega** un nome non produce rumore: produce **cecità**, e la cecità non si
  vede. Quindi non si contano gli allarmi nuovi, si contano **i nomi che
  entrano**, e si **nomina** quello che costa: sono entrati **24 nomi su
  10.711** già legati, in 4 file — diciannove parametri veri, tre cifre che non
  si possono giudicare comunque, `null` che è già una parola chiave, e **una
  sola cecità vera**, `getFullYear`, arrivata dallo spezzare
  `new Date().getFullYear()`. Un nome contro diciannove falsi allarmi in meno,
  e quel nome sta scritto accanto al codice invece che scomparire nel conto.
  ⚠️ **E allargare un riconoscitore ricopiando il prefisso di quello accanto
  può fermare tutto senza un messaggio**: `\s*(?:static\s+)?(?:async\s+)?\*?\s*`
  sono due `\s*` separati da gruppi opzionali che a loro volta mangiano spazi —
  un numero enorme di modi di spezzare la stessa indentazione, provati **tutti**
  a ogni fallimento della coda. La suite non finiva più, e non c'era niente da
  leggere. Con `[ \t]` gli a capo non entrano nell'ambiguità e il conto torna
  lineare. È la copia-da-firma-troppo-stretta applicata a una **regex**.
  ⛔ **E IL 14/08 LA TERZA VOLTA, NEL POSTO CHE UN CONTROLLO NON PENSA MAI DI
  GUARDARE: SÉ STESSO. Un controllo che esclude i propri test è cieco proprio
  dove il codice cambia più spesso.** `nomi-liberi` esiste per prendere un nome
  chiamato che non esiste, e il suo elenco di soggetti escludeva la cartella
  `tests` **per costruzione** (`v.name !== "tests"`) prendendo solo i `.js`,
  mentre le suite sono `.mjs`. Quel giorno un cantiere ha scritto
  `MODULI.flotta` in `run-kpi.mjs` dove `MODULI` viveva nello scope del blocco
  di **un altro** cantiere: la suite è crollata al primo lancio. Nessun
  controllo l'ha vista — e il «**0 fuori scope**» stampato in fondo era vero
  **sul suo denominatore**, che non conteneva il posto dove il difetto è
  successo. *«Si scopre presto» non è «è guardato»: è la differenza fra un
  controllo e la fortuna.*
  ⚠️ **Il costo della stretta, misurato prima di farla**, come pretende la riga
  qui sopra: allargando **tutte e cinque** le domande, moduli 18 → **60**,
  chiamate 7.330 → **25.040**, e allarmi nuovi **0** sulle due che contano (i
  nomi chiamati e lo scope) e **45** sulle altre tre. I 45 sono di due famiglie
  sole e tutt'e due legittime: i **globali di Node** (`process`) e il **codice
  scritto come stringa** che una suite si costruisce per iniettarlo (`${xQ}`,
  `${CSS_ESEMPIO}` — pezzi di pagina finta, non riferimenti veri). Entrano le
  due che costano zero; le altre tre **dichiarano** di non guardare le suite.
  ⛔ **E c'è un TERZO AMBIENTE che nessuna di queste domande può giudicare**, e
  riconoscerlo vale più del caso: i banchi del browser hanno metà del codice
  dentro `page.evaluate()`, dove i nomi sono quelli del **browser**
  (`KeyboardEvent`, `PointerEvent`, `Uint8ClampedArray`) e perfino i **globali
  della pagina che stanno provando** (`nav`). Otto allarmi, otto di quella
  famiglia, zero difetti. Un elenco di nomi noti per coprirli sarebbe **senza
  fondo**: i globali di una pagina sono quanti ne scrive la pagina. Quindi
  restano fuori — ma il riepilogo stampa **quante suite entrano e quanti banchi
  restano fuori**, perché un'eccezione che non si conta è un'eccezione che
  nessuno riapre.
- ⛔ **UN `grep` SU UNA CARTELLA SENZA `-r` RISPONDE «0» DA SOLO**, ed è la
  quinta forma del righello che produce il «non c'è». Misurata il 14/08 su un
  documento di ricerca: `grep -ciE 'termine' apps/conti/` stampa
  `grep: apps/conti/: Is a directory` **e poi `0`** — e chi copia solo il
  numero ha in mano uno zero che parla del comando, non del codice. Nello
  stesso documento c'erano le altre quattro, tutte già scritte in questo file:
  la **pipe sfuggita** dentro `-E` (`\|` è letterale, quindi lo zero è
  garantito — senza la sfuggita lo stesso comando rispondeva **3**), i
  **refusi** nei termini cercati (`dichiarazu`, `versatu`: due parole su tre
  che non esistono in nessuna lingua), e il **conto che si contraddice** («
  nessuna delle **tre** mancanze» scritto sotto una tabella che ne elencava
  **quattro**).
  ⚠️ **E la quinta l'ho scritta io nella sezione che correggeva le altre
  quattro**: «`aliquot` dà **8** occorrenze» dove sono **90** — avevo riportato
  il numero di un comando più stretto lanciato un minuto prima. A prenderlo è
  stato il **rilancio** del comando prima di committare, non la rilettura, che
  l'aveva lasciato passare due volte. È la ragione per cui in questa casa una
  prova è **un comando con la sua uscita** e non una frase che descrive una
  ricerca: *un comando si rilancia; un numero si può solo credere.*
  ⚠️ E il verdetto di quelle quattro righe **reggeva tutto**: 4 mancanze su 4
  confermate. Cioè le prove false non rendono la riga sbagliata — la rendono
  **non credibile**, e chi la riverifica butta via anche il giudizio giusto.
  ⚠️ E il corollario sugli elenchi: `UI_CONDIVISA` di `run-stile` aveva **sei**
  nomi scritti a mano mentre la struttura condivisa ne espone **dieci**. Un
  elenco a mano non poteva accorgersi di `chiediDati` — **non sapeva nemmeno
  che quel nome esistesse.** Ora è derivato da `window.X =` del file condiviso.
  ⛔ **E LO STESSO GIORNO, LA STESSA FAMIGLIA IN UNA VESTE CHE LA STRETTA NON
  COPRIVA: UN OMONIMO LOCALE RENDE INVISIBILE UN NOME LIBERO.** Il bottone
  «Scarica rilievi» di Terra chiamava `conta(...)`, che nella pagina **non era
  importata**: il file usciva (l'`a.click()` viene prima) e il gestore **moriva
  subito dopo**, quindi nessun messaggio e nessun toast — un errore duro, in
  produzione, su un bottone che un banco premeva 41 volte dicendo «0 KO».
  `nomi-liberi` non lo vedeva perché raccoglie i nomi legati in un insieme
  **unico per file**, e nella stessa pagina c'è un `const conta = …` **locale a
  un'altra funzione**: guardava il FILE, non lo SCOPE. Bastava un omonimo
  qualunque, dichiarato ovunque, per spegnere il controllo su quel nome.
  La cura è la solita e non è «più severità»: una **seconda domanda** accanto
  alla prima — *il nome esiste, ma esiste QUI?* — che giudica per blocchi di
  graffe (l'ancora è la parola `const`, non il dichiaratore, se no
  `const {jsPDF}=window.jspdf` scambia la graffa della **destrutturazione** per
  il blocco che racchiude: 11 falsi allarmi).
  ⚠️ **E i due falsi allarmi di prova venivano dal righello, non dalla
  domanda**: `const N=60, gx=(i)=>…` con una regex perde il secondo
  dichiaratore. Costo misurato prima di irrigidire, come pretende la regola qui
  sopra: **0 allarmi** su 18.656 chiamate e 12 pagine sane, **1 e quello
  giusto** col difetto rimesso.
  ⚠️ Il difetto sotto ha un fratello che vale da solo: `csv-dimostrazione`
  **ascoltava** gli errori di pagina e li leggeva **prima** di premere i
  bottoni. L'ascoltatore c'era, l'elenco si riempiva, e la domanda arrivava due
  secondi dopo il caricamento. **Un conto letto al momento sbagliato è un conto
  che non esiste.**
- ⚠️ **UNO STRUMENTO CONDIVISO DA TUTTI I CONTROLLI NON È CONTROLLATO DA
  NESSUNO.** Il 03/08 la scansione che sta sotto a tutte e sedici le regole
  **perdeva la fase**, per due difetti indipendenti: leggeva la pagina intera
  come JavaScript (e l'apostrofo di «l'ecosistema» nel TESTO apriva una
  stringa — da 7 a 131 apostrofi per superficie, dispari = fase invertita), e
  giudicava lo slash dall'ultimo carattere invece che dalla parola (`return
  /[;"\n]/` preso per una divisione, e la virgoletta dentro la regex apriva una
  stringa lunga 1.500 caratteri). Effetto: **115 delle 195 funzioni dichiarate a
  colonna zero in Genesi** finivano marcate «non codice», cioè la regola 1 era
  cieca su decine di migliaia di caratteri e rispondeva lo stesso «nessuna
  violazione». Il core ne usciva pulito **per caso** — due inversioni che si
  annullavano. Ogni regola aveva la sua controprova e ognuna passava: mancava
  la prova sullo **strumento**. Adesso c'è, ed è l'unica del file che verifica
  la scansione invece di una regola: *7.485 dichiarazioni in 22 file, nessuna
  presa per stringa*, con la controprova che rimette i due difetti (801 e 54
  dichiarazioni perse). E anche quella prova ha sbagliato mira due volte, per la
  solita ragione: contava solo le righe a **colonna zero** — 934 ancore, ma le
  sei pagine delle app ne davano **zero**, perché il loro codice è indentato —
  e pretendeva «è codice» dove basta «non è dentro una stringa» (l'esempio d'uso
  scritto in un commento è un commento). Racconto e misure:
  `docs/LA_SCANSIONE_CHE_PERDEVA_LA_FASE.md`.
  ⛔ **E L'08/08 LA TERZA VOLTA, CON LA LEZIONE CHE CHIUDE LA FAMIGLIA: UN BUCO
  TROVATO PER CASO VUOL DIRE CHE GLI ALTRI ASPETTANO IL PROSSIMO CASO.**
  Dietro a `=>` l'ultimo carattere non bianco è un `>`, che non era fra quelli
  dopo i quali ci sta un'espressione: `c => /carburante/i.test(c)` veniva letto
  come una **divisione** e il corpo della regex restava codice — **158 `=> /`**
  nel repository, **460 tratti, 18.420 caratteri**. Latente, e va detto com'è:
  nessuna di quelle regex contiene una virgoletta, quindi la prova sulla fase
  dava **10.304 dichiarazioni prima e 10.304 dopo**. Bastava un
  `s => /['"]/.test(s)` — una regex ordinaria — perché l'apostrofo aprisse una
  stringa fino in fondo al file.
  L'avevo trovato **inseguendo un falso allarme di un'altra suite**. Quindi la
  cura non è la correzione, è il **metodo**: si interroga lo strumento sui suoi
  **punti di decisione**, uno per uno, con la risposta giusta scritta accanto —
  `run-stile` ne ha adesso **34** (regex contro divisione in sedici posizioni,
  ciò che sta dentro una regex, apostrofi italiani, template annidati,
  commenti, sintassi moderna). Esito onesto: **nessun buco nuovo, 34 su 34**.
  Il valore non è quello che ha trovato — è che nessuno dei 34 si può riaprire
  in silenzio. Le prove sul **codice vero** contengono solo le forme che
  qualcuno ha già scritto: un buco si vede il giorno in cui qualcuno ne scrive
  una nuova.
  ⚠️ Il `+` è stato provato e **scartato con la misura** perché nessuno lo
  rimetta: porta 3 tratti, due dei quali erano artefatti del `>` mancante, e in
  cambio rompe `i++ / 2` mangiandosi il resto della riga.
- **Due tokenizzatori, e vanno scelti**: `mascheraCodice` maschera il
  **contenuto** delle stringhe (giusto per i dialoghi — un `prompt(` dentro una
  stringa non è una chiamata), `senzaCommenti` toglie **solo i commenti** e tiene
  il resto (giusto per le regole sui TESTI, che vivono dentro le stringhe).
  Prendere quello sbagliato dà una regola che non guarda dove crede: la regola 6
  è caduta segnalando il commento che documentava la decisione.
  **Due viste, ma UNA scansione sola** (`classifica`), dal 31/07: erano due
  scansioni gemelle scritte a poca distanza, e portavano lo stesso difetto in
  due posti — la conferma che una regola usata due volte va scritta una volta.
- ⚠️ **I TEMPLATE ANNIDATI, E IL BUCO CHE APRIVANO.** Un tokenizzatore che,
  entrato in un `backtick`, corre fino al backtick **successivo** sbaglia due
  volte: (1) il contenuto di `${...}` è **codice**, non testo — `${prompt('x')}`
  è una chiamata vera; (2) con i template annidati, che le app usano di
  continuo (`${dup ? \`, ${dup} già presenti\` : ""}`), il backtick che **apre**
  quello interno viene preso per quello che **chiude** l'esterno, e da lì la
  scansione va fuori fase: basta un apostrofo — in italiano ce n'è uno ogni due
  parole — per aprire una stringa che corre in avanti masticando codice vivo.
  Misurato: rimettendo un `window.prompt()` dove riprende il codice, **764
  iniezioni su 1030 non venivano viste**. La regola 1 (niente dialoghi del
  browser) era quindi cieca su gran parte di tutte le superfici, core compreso,
  **e la sua controprova diceva ok**: guardava tre superfici a un punto
  ciascuna, e nessuno di quei punti cadeva dove la scansione si perdeva. Adesso
  la controprova è **a tappeto** e stampa quante iniezioni ha provato.
  La lezione non è sui backtick: è che **una controprova va misurata anche nella
  sua copertura**, non solo nel suo esito. Sapere fallire in un punto non
  dimostra niente sugli altri mille.
- ⚠️ **UNA FUNZIONE NUOVA SI PROVA IN SCRATCHPAD PRIMA DI SCRIVERLA NEL
  MODULO**, e non è pignoleria: il 05/08 questo passaggio ha bocciato **tre
  progetti su tre**, ognuno con un difetto che leggendo il piano non si vedeva.
  1. Il ponte col volume di Terra avvisava confrontando le **date** («i rilievi
     coprono dal 28/02, il periodo parte dall'01/01»): sbagliato **di
     mestiere**, perché un rilievo misura il volume tolto *da quello prima*,
     quindi la sua data è la FINE dell'intervallo che copre — e l'avviso
     partiva su un caso sano. La domanda giusta non era sulle date: è **quanti
     costi cadono fuori** dall'intervallo misurato.
  2. La chiusura del mese calcolava il margine **e** continuava a elencare fra
     le mancanti la voce che l'utente aveva appena dichiarato assente: sullo
     schermo «margine 92%» e sotto «manca il personale», cioè la pagina che si
     smentisce da sola *proprio quando qualcuno aveva risposto*.
  3. `avanzamentoLotto` rispondeva **«0%»** per un lotto senza nessun rilievo,
     perché `+null` fa zero e `Number.isFinite(0)` risponde **true**. Uno 0%
     suggerisce «non ancora cominciato» dove la verità è «nessuno ha misurato».
  Il costo è mezz'ora; il costo dell'alternativa è scrivere il difetto nel
  modulo, blindarlo con una prova che lo conferma, e scoprirlo settimane dopo.
  E vale doppio **quando il giro del browser sta girando**: lo scratchpad non è
  tracciato, quindi si progetta mentre il giro cammina invece di aspettarlo.
- **Il browser serve per SCOPRIRE un difetto, non per tenerlo chiuso.** Le prove
  sui buchi dei grafici sono nate con Playwright, ma `tratti`/`percorso` prendono
  numeri e restituiscono una stringa: vivono in `run-kpi.mjs` e girano sempre. Il
  motore le espone di proposito in `dwGrafici.geometria`. Una difesa che resta
  nello scratchpad, alla sessione dopo non esiste.
- **Quello che il browser scopre e basta vive in `apps/deepwork-id/tests/browser/`**
  (vedi il suo LEGGIMI). Ci sta `interi-superfici.mjs`, che digita davvero nei
  29 campi interi di tutte e sette le superfici — 87 asserzioni, e con
  `--senza-guardia` ne devono cadere due su tre per campo. È così che è venuto
  fuori che Terra aveva una **seconda copia** della regola degli interi e
  «1.500» diventava «500».
- ⚠️ **IL CORE NON SI APRE IN LOCALE, e non è colpa del login.** Tutto il suo
  programma sta in un `<script type="module">` che importa Firebase da
  `gstatic.com`: senza rete l'import fallisce, il modulo non parte e restano
  solo i segnaposto che il core installa apposta («Funzione nav non ancora
  pronta»). Chi non lo sa passa un'ora a chiedersi perché `nav('ufficio')` non
  faccia niente: non è il `nav` del core. Si monta
  `tests/browser/finto-firebase.mjs` PRIMA di `goto` e il core parte davvero.
- ⛔ **IL ROSSO DI UNA CONTROPROVA È IL VERDE DEL BANCO, E NEL REGISTRO DEL GIRO
  I DUE SI SCRIVONO UGUALI.** Costato due volte in due ore il 07/08, e la
  seconda **a chi aveva appena scritto la difesa per la prima**.
  1. Ho letto `Risultato messaggio del ripiego: 26 passati, 10 falliti` e ho
     aperto un cantiere su **dieci difetti che non esistevano**: era la
     controprova, e centosessanta righe più su la passata sana diceva `36
     passati, 0 falliti` **con la stessa identica frase**;
  2. il setaccio scritto per non rifarlo ha sbagliato **due volte di seguito**:
     cercava le intestazioni con `^════`, che combacia anche con le **sotto**
     intestazioni a sei uguali (`══════ core ══════`) — dentro una sezione di
     controprova il flag si azzerava e sono passati **60 KO voluti**; e poi
     riconosceva la controprova dalla **parola** «controprova», mentre due
     passate su quattro di `contrasto` si chiamano «non accusa chi pulsa» e «le
     classi mai comparse».
  ⛔ E la cura non è un setaccio più furbo: è che **il registro lo dica**.
  `tutti.mjs` **sa** quale passata è una controprova — è il quarto posto della
  tupla in `BANCHI` — e quel dato finiva solo nel riepilogo, cioè un'ora e mezza
  di scorrimento più in là. Adesso l'intestazione lo scrive: *«⚠️ CONTROPROVA:
  qui sotto il rosso è quello VOLUTO»*. **Un dato che il programma ha in mano
  non si indovina dal testo** — ed è la regola generale, non un dettaglio di
  questo file.
  ⚠️ Finché una passata non lo dichiara da sé, il setaccio che regge è sulla
  **forma** dell'intestazione, non sulle parole (sana = senza ` · `). E vale
  quello che vale per ogni controllo: va chiesto **quanti soggetti ha guardato**
  — le intestazioni si contano in un secondo, e il conto che non torna si vede.
  ⛔ **E L'08/08 LA TERZA VOLTA, PERCHÉ LA DICHIARAZIONE ERA UN'ETICHETTA SU UNA
  RIGA E NON UN INTERVALLO.** Il runner dichiara subito dopo la **propria**
  intestazione; ma molti banchi ne stampano una **loro**, a otto uguali, e da lì
  in giù chi legge apre una sezione nuova che la dichiarazione non copre.
  Misurato: `struttura di Genesi · controprova` dichiarava, poi il banco apriva
  «Genesi: la struttura è quella del core? · controprova» e i suoi **quattordici**
  KO voluti finivano fra quelli veri. Adesso `tutti.mjs` **chiude** la
  dichiarazione (`FINE CONTROPROVA`) e `leggi-giro` eredita il flag **dentro
  l'intervallo** — e solo lì: ereditare per sempre dipingerebbe di «voluto» tutto
  il resto del giro, cioè nasconderebbe i difetti, ed è provato nei due versi.
  La lezione oltre al caso: **una dichiarazione che vale per un TRATTO va scritta
  con un inizio e una fine**, se no il primo che stampa qualcosa in mezzo la
  cancella senza saperlo.
  ⛔ **E LA QUARTA VOLTA, LO STESSO GIORNO, NEL POSTO CHE NESSUNO SOSPETTA: IL
  RIEPILOGO FINALE È UNA RIPETIZIONE, E CONTARLO GONFIA I DIFETTI DI QUATTRO
  VOLTE.** Leggendo un giro vero con `leggi-giro.mjs` — cioè con lo strumento
  scritto apposta per non sbagliare questo — il denominatore diceva «**KO veri:
  47**». Erano **10**: le altre **37** erano le righe di `════ RIEPILOGO ════`,
  un rigo per passata, cioè lo **stesso rosso già stampato più su**. E fra
  quelle 37 c'erano tutte le controprove, il cui rosso è VOLUTO: la loro
  dichiarazione vale nell'**intervallo della passata**, e il riepilogo sta in
  fondo al registro, fuori da ogni intervallo — quindi rientravano dalla
  finestra tutte insieme. Il numero che quel file esiste per rendere leggibile
  era il più sbagliato di tutti, e nella direzione che fa aprire cantieri
  fantasma.
  La cura è **la stessa già imparata due volte e non applicata qui**: un dato
  che il programma ha in mano non si indovina dal testo — `tutti.mjs` sa che
  quel blocco è il conto delle passate, e adesso lo **dichiara**
  (`⚠️ RIPETIZIONE: qui sotto NON ci sono difetti nuovi`). Il ripiego sul nome
  resta, **dichiarato**, perché i registri scritti prima non hanno la
  dichiarazione e sono esattamente quelli che si riaprono per capire com'è
  andata. Le righe non spariscono: si stampano a parte («37 passate cadute,
  ripetute nel riepilogo»), perché un numero tolto in silenzio è un numero che
  qualcuno rimetterà.
  ⚠️ **E la regola generale che le lega tutt'e quattro: quando si scrive uno
  strumento per non farsi ingannare da un registro, si chiede subito CHI ALTRO
  scrive in quel registro.** Le prime tre volte era un banco che stampava una
  propria intestazione; questa è il runner stesso, che ricapitola. Il posto in
  cui il difetto si nasconde è sempre quello che non si guarda perché «quello
  lo scriviamo noi».
- ⛔ **UNA CI ROSSA CRONICA INSEGNA A NON GUARDARE IL ROSSO — ed è un difetto
  peggiore di quello che la tiene rossa.** Misurato il 13/08. Un checkpoint
  scritto **predicendo** l'ora invece di leggerla da `date -u` è entrato in git
  due minuti prima del nome che porta; il file è stato subito riscritto col nome
  giusto, ma `date-checkpoint.mjs` legge **ogni percorso mai aggiunto** alla
  storia — di proposito, se no basterebbe un `git mv` per farlo tacere. Toglierlo
  davvero vuol dire riscrivere la storia del ramo, che è distruttivo e resta
  fermo al fondatore. Nel frattempo la CI è rimasta rossa **per ore, su quella
  riga sola**, mentre sopra ci passavano sei commit sani.
  ⚠️ Il danno non è la riga: è che ogni notifica di CI diventava «sì, lo so» — e
  il giorno in cui cade qualcos'altro nessuno se ne accorge. È la stessa famiglia
  dell'allarme che scatta sempre.
  La via che regge non è spegnere il controllo né aspettare il permesso: è
  **un'eccezione dichiarata per nome, con la ragione, e SORVEGLIATA** — una
  seconda prova che **cade il giorno in cui l'eccezione smette di servire**, cioè
  quando la storia viene riscritta. Così l'eccezione **non può sopravvivere alla
  sua causa**, e il blocco resta scritto invece di essere dimenticato in un
  rosso che nessuno legge.
  ⚠️ E la controprova va nei **due versi**, se no si è costruito un interruttore:
  con l'eccezione attiva un **altro** soggetto mal datato deve cadere lo stesso.
- ⛔ **E UN GIRO LUNGO SU UN COMMIT VECCHIO HA UN VALORE CHE DIVENTA NEGATIVO —
  a un certo punto si spegne, e non è una sconfitta.** Misurato il 13/08: un
  giro del browser vivo da **3h52** aveva fatto **60 passate** su circa 230, e
  attestava un commit da cui il ramo si era mosso di **oltre trenta commit**.
  Aprendo il suo registro, i primi KO erano **ventisette contrasti del tema
  chiaro del core** — tutti **chiusi cinque ore prima**. Cioè non stava
  producendo informazione: stava producendo **accuse che sembrano fresche**, e
  intanto teneva occupata la macchina che serviva a tre cantieri.
  La regola pratica: prima di lasciar correre un giro lungo si guarda **quanto
  è avanti il ramo** (`leggi-giro.mjs` lo stampa nella sezione 0) e **a che
  punto è arrivato**. Se le passate fatte sono una frazione e i commit sulle
  superfici misurate sono decine, il giro va **letto, spento e rilanciato** su
  uno stato fermo — non lasciato finire per non buttare le ore già spese.
  ⚠️ Spegnendolo si guarda **chi resta vivo**: i Chromium con un padre ancora
  vivo e pochi secondi di età sono **di qualcun altro**, non orfani del giro.
  ⛔ **E IL SERVER DEL GIRO NON MUORE CON LUI, nemmeno uccidendo il GRUPPO.**
  Misurato subito dopo, la sera stessa: ucciso `tutti.mjs` con `kill -TERM -PID`,
  il suo `http.server` sulla **8823** era ancora vivo **quattro ore e
  quarantadue** dopo, con padre `1` — si era già **riparentato a init**, quindi
  il gruppo non lo conteneva più. E rispondeva **404 su tutto**, perché la
  worktree che serviva non esiste più: è alla lettera la trappola già scritta
  qui sopra, con la differenza che stavolta **l'aveva prodotta chi il giro
  l'aveva spento**.
  ✅ **E qui va corretta una riga che avevo scritto io un'ora prima**, perché
  diceva che il giro dopo «avrebbe misurato il vuoto»: **non è vero, e la difesa
  c'è già.** `tutti.mjs` monta all'avvio una guardia contro i server orfani col
  criterio esatto — *solo la nostra porta, e solo se la cartella servita non
  esiste più* — e la sua controprova è in `npm test`
  (`browser/server-orfani.mjs`). L'orfano di stanotte cadeva **dentro** quel
  criterio: sarebbe stato tolto da solo. Scrivere il contrario avrebbe mandato
  qualcuno a costruire una difesa che esiste, ed è il difetto che questo file
  chiama «annunciare come nuovo ciò che c'era».
  Resta vero e utile il **come**: spegnere un giro è **due comandi, non uno** —
  si uccide l'albero, e poi si guarda **la porta** (`ss -ltn | grep 8823`), non
  il nome del processo. Non perché il giro dopo sia in pericolo, ma perché una
  porta occupata da un morto è un minuto perso a capire perché.
  ⚠️ E `pgrep -f "http.server 8941"` risponde di sì **a sé stesso**: la stringa
  sta nella riga di comando della shell che lo lancia. È la stessa trappola
  dell'attesa scritta male, in una veste che inganna perché sembra una verifica.
  Si chiede alla **porta**, che non ha questo problema.
- ⛔ **UN GIRO LUNGO NON DICE QUANTO È VECCHIO, E I SUOI KO SI LEGGONO COME SE
  FOSSERO DI ADESSO.** Misurato l'08/08 e a un passo dal costare un cantiere
  intero. Un giro da cinque ore e mezza dichiarava **cinque contrasti sotto
  soglia** fra core e Flotta — tutti **veri**, e tutti **già chiusi** trentotto
  minuti dopo il commit che quel giro attesta, cioè quasi cinque ore prima che
  io leggessi il registro. Stavo aprendo il file del core per correggerli.
  Il dato per accorgersene **c'era già** in cima al registro («gira su una COPIA
  di `c3888fe`»): mancava la **sottrazione**, che costa un `git rev-list`.
  Adesso `leggi-giro.mjs` apre con una **sezione 0** — prima ancora delle righe
  «non ho guardato» — che dice di quanti commit il branch è andato avanti **e
  quanti di quelli toccano le superfici misurate** (il core, le app, `shared/`):
  contare solo i commit non basta, un pomeriggio di documenti farebbe sembrare
  vecchio un giro fresco. Se il commit non è nella storia si dichiara «**non lo
  so**» invece di stampare uno zero tranquillizzante.
  ⚠️ **E la prima asserzione che lo provava era vera in casa e falsa in CI**:
  pretendeva che `HEAD~5` desse **5**, e in CI ha dato **1407**, perché GitHub
  non prova il branch ma il **merge** del branch col ramo di destinazione — da un
  commit di fusione `HEAD~5..HEAD` raccoglie anche tutto il secondo genitore.
  Riprodotto in casa su un merge vero: 126 invece di 5. È la terza veste di
  «verde in casa, rosso in CI» — dopo gli **scrittori** diversi e l'**ordine**
  di due eventi, la **forma della storia di git**.
- ⛔ **UN'INIEZIONE DI CONTROPROVA CHE NON TROVA PIÙ IL SUO PEZZO SPEGNE LA
  CONTROPROVA IN SILENZIO.** Famiglia nuova, misurata l'08/08 col denominatore:
  **174 iniezioni in 20 banchi, TRE scadute**. Un banco prova di saper fallire
  cercando una stringa di codice e sostituendola con la versione rotta; ma quella
  stringa cita il codice **testualmente**, e il codice si muove — e si muove
  quasi sempre perché è **migliorato**. Quando non combacia più non succede
  niente di visibile: la pagina servita resta **sana**, la controprova gira su un
  prodotto sano, e il banco dichiara «non distingue». È la **terza delle cinque
  cause**, quella in cui non si tocca né la prova né il codice.
  Le tre, e la loro origine buona: una decisione spostata in `provenienzaPpv`
  perché il foglio stampabile non ce l'aveva; le unità avvolte in
  `<span class="u">` dal cantiere dei maiuscoli; una riga diventata la funzione
  `_ppvBaseHtml` perché la usano in due.
  Adesso c'è `apps/deepwork-id/tests/iniezioni-fresche.mjs`, che fa la domanda
  **senza browser e senza server** e gira in `npm test`: tre secondi invece di
  sei ore. ⚠️ E il suo primo righello sbagliava col segno di sempre — tre allarmi
  identici nello stesso banco — perché leggeva ogni tabella come
  `[cerca, sostituisci]` mentre `scudo-disegni` usa `[file, cerca, sostituisci]`.
  ⛔ **E L'ECCEZIONE CHE QUEL CONTROLLO DICHIARAVA ERA IL POSTO DOVE IL DIFETTO
  VIVEVA.** Misurato l'08/08: `iniezioni-fresche` teneva fuori **un** banco,
  `scudo-documenti`, con la ragione scritta e sorvegliata («la tabella si
  costruisce da variabili»). In quell'unico buco stavano **sei iniezioni scadute
  su ventisei** — e il banco stampava «✔ CONTROPROVA OK», perché le venti
  rimaste bastavano a farlo cadere: il rosso c'era, il verdetto pure, e la sola
  riga che lo diceva era «20/26 difetti rimessi», che nessuno legge. Cioè **un
  controllo che passa avendo guardato meno di quello che crede**.
  La regola generale, e vale per ogni elenco di eccezioni: **un'eccezione
  dichiarata onestamente resta un posto in cui nessuno guarda**, quindi non
  basta sorvegliarla — si guarda dentro almeno una volta, e se si può si
  **toglie**. Qui si toglieva leggendo le costanti di stringa del banco stesso e
  passandole all'`eval` come preambolo: da **174 iniezioni in 20 banchi con
  un'eccezione** a **212 in 23 con zero**.
  ⛔ **E IL 09/08 QUEL CONTROLLO È CADUTO NELLA FAMIGLIA CHE ESISTE PER
  PRENDERE, IN UNA VESTE CHE NESSUNA DELLE DUE RIGHE QUI SOPRA COPRE: NON
  UN'ECCEZIONE DICHIARATA, MA **UN NOME SCRITTO DENTRO UNA REGEX**.
  `iniezioni-fresche` cercava `const DIFETTI = [` — e basta. Restavano fuori
  `DIFETTO`, `DIFETTI_MODULO`, `DIFETTI_PAGINA`, `DIFETTI_FLOTTA`,
  `DIFETTI_MOTORE`, `DIFETTO_MODULO`, `INIEZIONI`, `COME_LIVE`, più ogni tabella
  scritta come **oggetto** (`DIFETTI = {` per rotta). Conto: **215 dichiarate,
  296 esistenti** — una su quattro non guardata da nessuno, e il file stampava
  «zero scadute» con la faccia della verità. È alla lettera la regola scritta il
  giorno prima — *«un censimento che cerca UN nome risponde "non c'è" con la
  stessa faccia con cui direbbe la verità»* — applicata al controllo nato quel
  giorno stesso per togliere un'eccezione. **Un'eccezione dichiarata l'avrei
  riletta; un nome dentro una regex no**: è più nascosto di un elenco, perché
  non si presenta come una scelta.
  ⚠️ Sotto ci stavano **tre iniezioni scadute**, tutte per la ragione buona
  (il codice si è mosso perché è migliorato), e una era cara: `COME_LIVE` di
  `campo-foglio-turno` ha prodotto **tre KO fantasma** nel giro del 08/08 — la
  passata `--live` serviva la pagina in modo *dimostrazione* e accusava la
  consegna `.txt` di «non dichiarare i dati di esempio», che li dichiarava
  perché di esempio lo era davvero. Quella l'ho riverificata a mano per due
  volte credendola prodotto. La terza aveva perfino cambiato **file** (il CSV
  del personale salito nel modulo dati), e `scudo-verifica-periodica` la
  saltava in **silenzio totale**, senza nemmeno un conto: la sua controprova
  diceva «✔ OK» con 2 difetti su 3 rimessi.
  ⚠️ **E la strada senza nomi è stata provata e SCARTATA con la misura**,
  perché nessuno la rifaccia: giudicare una tabella dalla **forma** («è una
  lista di coppie di stringhe») dà **9 allarmi di cui 7 falsi** — `COMBINAZIONI`
  sono classi CSS, `PAROLE` e `PLURALI` sono parole, `GIRI` e `LISTE` sono
  selettori. Quindi il criterio resta il **nome**, ma il denominatore si
  dichiara: le tabelle di coppie che il vocabolario non prende si contano e si
  stampano (**6**), così una quarta convenzione compare come un numero invece
  che come silenzio. Costo dell'allargamento, misurato prima di farlo: **81
  iniezioni entrate, 3 scadute vere, zero falsi allarmi.**
  ⚠️ E il righello ha rifatto l'errore della riga qui sopra **al contrario**:
  imparata la forma `[file, cerca, sostituisci]`, leggeva così anche
  `scudo-documenti`, che scrive `[cerca, sostituisci, file]` — sei falsi
  allarmi, tutti nello stesso banco. La cura non è imparare la terza forma: è
  **non indovinare la posizione e chiedere ai dati** qual è il percorso di
  prodotto vero, così una quarta convenzione non romperebbe niente.
  ⛔ **E LA STESSA UNITÀ È NATA DA UN «NON C'È» FALSO, PRODOTTO DA UN CENSIMENTO
  CHE CERCAVA UN NOME SOLO.** Cercando i punti d'uscita di Scudo ho grepato
  `__usciti` in `scudo-documenti.mjs`, trovato **zero**, e concluso «Scudo non ha
  nessun banco che apra un CSV»: il gancio lì si chiama `__scaricati` e vive 380
  righe più in giù. Erano già aperti **quattro** dei cinque punti d'uscita, e io
  avevo scritto **trecento righe** di banco nuovo con quella frase falsa
  nell'intestazione, buttate. **Un censimento che cerca UN nome risponde «non
  c'è» con la stessa faccia con cui direbbe la verità** — ed è la regola «la
  risposta è quasi sempre già in casa» nella sua veste più cara, perché il
  duplicato sarebbe entrato con una misura sbagliata scritta sopra.
- ⛔ **UN BANCO CHE PORTA DENTRO UN NUMERO ATTESO INVECCHIA COL CRESCERE DELLA
  DIMOSTRAZIONE — e accusa il prodotto per una cosa che ha fatto il prodotto.**
  Misurato il 07/08 sui due soli KO di un giro pulito. Il banco pretendeva che i
  totali del documento del core facessero `2395.1 / 317 / 34`: erano **esatti
  fino al 06/08**, quando la dimostrazione ha guadagnato un quinto rapportino.
  Da quel giorno accusava il core di sommare i turni mai misurati mentre il
  foglio diceva **la stessa identica cosa** del riquadro sopra il bottone
  (misurato: schermo e PDF, stesso istante, stesso stato, `46 · 419 · 3466`).
  La cura è **derivare invece di scrivere**: il piede si confronta con la somma
  di quello che il foglio **stesso** ha stampato, e col riquadro dello schermo
  letto **per selettore**. Così un dato nuovo non fa più cadere niente.
  ⚠️ E il `2395.1` che il banco «leggeva sullo schermo» non era il KPI: era il
  totale **per operatore** di un'altra riga, pescato come **sottostringa** da
  600 caratteri di `innerText`. Una controprova che cerca una sottostringa
  risponde ok qualunque cosa succeda al numero che deve sorvegliare.
  ⚠️ **E VALE PER LE SOGLIE QUANTO PER I TOTALI, misurato il 09/08 su
  `conti-barre-peso`.** Il banco pretendeva `zeri.length >= 2` — «accanto ai
  12 € ci sono due fasce a zero da confrontare» — e ne restava **una**, perché
  la dimostrazione aveva guadagnato una fattura **senza data di scadenza**
  (commit `069d70e`, «assente non è corrotto»), cioè proprio il caso per cui la
  difesa era stata costruita. Il prodotto disegnava giusto (3 px per 12 €, 0 px
  per uno zero vero) e tutte le altre asserzioni passavano.
  ⛔ E la correzione che veniva in mente — `>= 2` → `>= 1` — è **la correzione
  facile che dà il verde falso**: prima si chiede *a che cosa servivano due*.
  Servivano a distinguere «lo zero si disegna zero» da «quella riga per caso è
  a zero», e quel conto **non stava lì**: stava nella sezione che guarda tutte
  le liste, dove le righe a zero sono otto. Quindi il `>= 2` si **sposta** —
  alzato là da `> 0` — e non si toglie. Netto: nessuna asserzione più
  permissiva, una più severa, e la controprova lo conferma (col difetto
  rimesso la coppia cade lo stesso con una vuota sola).
- ⛔ **E UN BANCO CHE CROLLA DICHIARA MENO PROVE, CHE NON È UN BUCO CHE SI
  VEDE.** Lo stesso giorno, lo stesso banco: un `page.click` scaduto lo ha ucciso
  a metà e il registro ha stampato **19 prove invece di 30**. Undici asserzioni
  sparite, e nessuna riga rossa a dirlo — un totale più basso si legge come «ha
  guardato meno roba», non come «si è rotto». La difesa è la stessa del file di
  test inerte: **si guarda che il totale sia quello di sempre**, e un banco che
  non riesce a raggiungere il suo soggetto lo **dichiara** e tira avanti invece
  di morire.
  ⚠️ La causa sotto merita da sola: i casi venivano iniettati nel letterale di
  `DB` e un `DB.volate = [...DEFAULT_VOLATE]` aggiunto dopo li buttava via un
  istante più tardi. E la riga «i casi hanno agganciato la pagina servita»
  diceva **ok**, perché guardava la sostituzione nel **file** invece dell'arrivo
  nello **stato**. Un'iniezione si verifica dove il programma la legge, non dove
  l'hai scritta.
- ⛔ **E LA STESSA FRASE VALE PER UNA *SCENA*, NON SOLO PER UN'INIEZIONE — E LÌ
  IL DANNO È UN'ACCUSA CHE VA E VIENE.** Misurato il 09/08 sull'ultimo KO di
  Campo. Il banco digita mezz'ora di turno su un turno che ha 55 minuti di
  fermo, e pretende che l'app dica «non calcolabile». Cadeva **una volta su
  cinque**, sullo stesso commit, senza che nulla cambiasse: nel giro storto la
  pagina non aveva ancora caricato le attività della dimostrazione, quindi lo
  stato era «non è registrata nessuna attività per questo turno» — un'altra
  risposta giusta a un'altra domanda. Il prodotto non ha mai sbagliato.
  ⚠️ **Un'accusa intermittente è peggio di una stabile**, perché quando si
  presenta è indistinguibile da un difetto vero e il giro del browser gira una
  volta ogni molte ore: la si incontra da sola, senza le quattro volte in cui
  è passata. Questo KO è costato **due riverifiche** credendolo prodotto.
  ⚠️ E il segno che l'ha tradita è un numero che nessuno guarda: **82 prove
  invece di 83**. Un caso che cade ne dichiara **una** invece di due — la regola
  qui sopra in versione mite, dove non c'è nessun crollo da vedere.
  La difesa: ogni caso che si costruisce una scena dichiara la sua
  **precondizione** — la cosa che deve essere sullo schermo perché la domanda
  abbia senso (qui «N min di fermo», il numero che la contraddizione deve
  superare) — la si aspetta per un tempo dichiarato, e se non arriva il banco
  **non accusa**: scrive `NON MISURATO`, la elenca fra le righe «non ho
  guardato» **prima** dei KO col testo trovato davvero, e **esce diverso da
  zero**. Un soggetto non misurato non è un soggetto a posto: se uscisse verde,
  la difesa sarebbe peggiore del difetto.
- ⚠️ **UNA PROVA CHE NON SA FALLIRE NON DIMOSTRA NIENTE.** Ogni controllo
  nuovo va provato **contro il difetto**: si rimette il difetto e si pretende
  che il controllo fallisca. Costa due minuti e ha già salvato due volte:
  1. `run-stile.mjs` passava su tutte le superfici **e** passava anche con un
     `window.prompt()` rimesso a mano nel core, perché tagliava i commenti con
     `replace(/\/\*[\s\S]*?\*\//g,'')` e il core scendeva da 537.000 a 137.000
     caratteri: `/*` e `*/` compaiono anche dentro stringhe ed espressioni
     regolari, l'accoppiamento non greedy legava i delimitatori sbagliati e
     cancellava 400.000 caratteri di codice **vivo**. Ora la controprova
     inietta il dialogo nei file veri, dentro la suite.
  2. La correzione delle unità nei grafici: le 11 asserzioni girate sulla
     versione precedente del motore ne facevano fallire 8. Senza quel passaggio
     non si sapeva se stessero misurando qualcosa.
- ⛔ **IL RIPRISTINO DOPO UN'INIEZIONE SI FA DA UNA COPIA, NON DA `git checkout`.**
  Il 01/08, finita la controprova sulla data italiana, ho scritto
  `git checkout shared/…/dw-shell.js` per rimettere il file a posto — e ho
  cancellato **la funzione appena scritta**, che era lì da dieci minuti e non era
  ancora committata. Il comando ha fatto esattamente quello che dice: riporta il
  file a **HEAD**, cioè butta via *tutto* il non committato, non solo
  l'iniezione. Sono bastate le prove a dirlo (tre rosse invece di zero), ma solo
  perché c'erano; e il file era piccolo. Prima di iniettare: `cp file
  copia`, e alla fine `cp copia file` + `diff -q`. La regola generale è la
  stessa dello script che non fallisce: **si guarda il risultato**, e qui il
  risultato è `grep -c` sulla funzione che doveva esserci ancora.
- ⚠️ **UNO SCRIPT CHE «NON FALLISCE» NON HA PER FORZA FATTO QUALCOSA.** Il
  01/08 una controprova è stata **dichiarata riuscita in un messaggio di commit
  senza essere mai partita**: l'`assert` sul testo da sostituire cercava
  quattro spazi di indentazione dove il file ne ha due, è saltato **prima**
  della scrittura, e tutt'e due le sonde hanno misurato un file **sano**. Un
  `assert` che scatta, un `sed` che non trova, un `replace` che sostituisce zero
  occorrenze: finiscono tutti in silenzio o con un'uscita che sembra buona.
  Difesa: **stampare quanti soggetti ha toccato davvero** (`2 guardie tolte`,
  `-31 caratteri`) **e** confrontare la copia con l'originale — la conta da sola
  mente quando il difetto è uno scambio di due argomenti, che cambia zero
  caratteri. E il corollario: **il messaggio del commit si scrive DOPO aver
  letto l'esito.**
  ⛔ **E IL 13/08 LA STESSA REGOLA HA MORSO NELLA VESTE PIÙ SEMPLICE: LA
  SCRITTURA NON È AVVENUTA E IL `git commit` È PARTITO LO STESSO.** Uno script
  che aggiungeva una voce di roadmap è saltato su un'asserzione — quindi non ha
  scritto niente — e il `git commit` che stava sulla **riga successiva** ha
  committato il resto senza di lei: il banco è entrato **senza la riga che lo
  spiegava**. Non è un `sed` che non trova: è la sequenza. Un comando che
  fallisce non ferma quello dopo se i due non sono legati, e in un ciclo
  automatico nessuno guarda l'errore in mezzo.
  La difesa è quella già scritta e saltata: **si legge l'esito prima del passo
  successivo**, e non si mette sulla stessa riga la scrittura e il commit. Se
  devono stare insieme, si legano con `&&` — ma allora vale l'altra regola, che
  **una catena `&&` non è una lettura**: il commit parte e il suo messaggio
  racconta una cosa che nessuno ha verificato.
- ⚠️ **«NON DISTINGUE» HA DUE LETTURE OPPOSTE, E VANNO SEPARATE.** Quando la
  controprova dice che il difetto non fa cadere la prova, la causa è una di due,
  e portano a interventi contrari:
  1. **la prova non prova niente** — i suoi dati fanno **coincidere** la
     risposta giusta con quella sbagliata. Successo su «l'ultima lettura oltre
     è la più RECENTE, non la più alta», scritta con letture in cui la più
     recente **era** la più alta: passava per un motivo diverso da quello nel
     suo nome. Si correggono i **dati della prova**;
  2. **il codice è difeso in profondità** — più guardie indipendenti reggono
     la stessa regola, e toglierne una lascia in piedi l'altra. Successo sul
     vincolo T9 (una volata prevista non è mai un referto), protetto sia dal
     motivo spinto sempre sia dal flag. Si toglie **tutto lo strato**, e allora
     si vede il danno vero.
  3. **l'iniezione non ha iniettato niente** — i caratteri cambiati ci sono, ma
     nessuno sta su un percorso che viene eseguito. Successo il 02/08 mettendo
     nella copia solo la *lettura* di una cache e non la *scrittura*: la copia
     si comportava come l'originale. Non si tocca né la prova né il codice: si
     guarda **l'iniezione**.
  4. **l'iniezione è puntata nel posto sbagliato** — il difetto è vero, ma il
     nome della prova che dovrebbe cadere guarda un'altra funzione. Successo il
     02/08 togliendo il filtro delle bozze da `anniConVolumi` col nome di una
     prova che le bozze non le guarda. Si sposta l'iniezione dove il numero si
     forma davvero.
  5. **il caso difeso non c'è nella prova** — variante di (1): i dati della
     prova non arrivano mai al ramo che il difetto rompe. Successo su
     `valorePesata`, dove mancava la pesata a metro cubo **senza densità**:
     l'unico caso in cui il ripiego sul netto avrebbe moltiplicato tonnellate
     per un prezzo al metro cubo.
  Le prime due si distinguono per **dove** si interviene; le altre tre per il
  fatto che il codice non è mai stato messo alla prova.
- ⛔ **UN FILE DI SCAMBIO PORTA IL NOMINALE, NON IL CAMPIONE — E IL CAMPIONE NON
  SI PUÒ TORNARE INDIETRO.** Famiglia nuova, misurata il 07/08 su Genesi, e
  vicina di casa della regola qui sotto senza esserne un caso. Il pannello
  diceva «42 ms», il piano di carico `0/42/84/126`, e
  `genesi-demo.volata.json` — il file con cui una volata si **riapre** —
  scriveva `0 · 42,332516881726825 · 84,36212721741676`. Non era un errore di
  formato: è lo **scatter d'innesco** che `buildSim` somma di proposito
  (`f.tNom = f.tDet; f.tDet = f.tDet + gauss*sd`), cioè un valore *arricchito da
  una simulazione*, col nominale conservato lì accanto nello stesso oggetto.
  Il danno sta nel ritorno: l'importatore ricava il passo dalla **mediana delle
  differenze fra ritardi distinti**, e con lo scatto le differenze sono tutte
  diverse — il ripiego riportava a **25 ms** una volata progettata a **42**.
  La regola generale: ogni volta che un valore viene sporcato apposta (rumore,
  scatter, jitter, arrotondamento di comodo), il file che esce deve portare
  quello **da cui si è partiti**; il campione, se serve, ci va **accanto** e
  dichiarato. Il segno da riconoscere è sempre lo stesso — **un numero con
  quindici decimali dove lo schermo ne mostra zero**: non è precisione, è un
  campione che è scappato dal suo recinto.
  ⚠️ E il modo di prenderlo è **rifare il giro**: salvare, riaprire, e
  pretendere che il valore mostrato sia quello di prima. Nessuna prova che
  guardi solo il file lo vede, perché il file è *coerente con sé stesso*.
- ⚠️ **UNA PROVA DI ANDATA E RITORNO RESTA VERDE SE LE DUE METÀ SBAGLIANO
  INSIEME.** Il giro `csvRegistroVolate` → `parseVolateCsv` pretende l'identità
  su 19 campi ed è la prova più forte che il registro non perda niente. Ma
  scritti i numeri con la **virgola** italiana invece che col punto, il giro
  resta **identico**: il lettore usa `numIt`, che la virgola la legge. Il giro
  dimostra che scrittore e lettore vanno d'accordo **fra loro**, non che il
  formato sia quello giusto per chi apre il file con un altro programma. Per
  quello serve un'asserzione sul **testo** del file (`;3.2;`). Stessa forma per
  qualunque coppia scrivi/leggi, cifra/decifra, serializza/deserializza.
- ⛔ **UNA FUNZIONE NUOVA CHE PRENDE IL POSTO DI UNA VECCHIA SI PORTA DIETRO IL
  MESTIERE, NON LE DIFESE.** Misurato il 01/08 e costoso: la prova di andata e
  ritorno `csvCell → parseCsvLine` **c'era**, scritta quando `parseCsvLine` era
  l'unico lettore di CSV. Poi è arrivato `leggiCsv`, che legge il file intero —
  e serviva, perché le banche scrivono la causale su più righe fra virgolette e
  un bonifico da 12.300 € spariva. Ha ereditato il lavoro e **non la prova**:
  su sette valori scritti da noi e riletti da noi **quattro non tornavano
  identici**, e il caso che morde è il più banale — un numero **negativo** esce
  dal nostro export come `'-12,5` (l'apostrofo anti CSV-injection) e rientra
  `NaN`. Un dato che c'era, perso nel giro di casa nostra.
  La domanda da farsi ogni volta che si scrive un sostituto: **quali prove
  guardavano il vecchio, e quante di quelle guardano il nuovo?** Il vecchio
  resta verde e nessuno se ne accorge.
- ⛔ **IL CONTENITORE PUÒ TORNARE INDIETRO, E LE DUE VIE OVVIE PER RIALLINEARSI
  SONO NEGATE.** Successo **due volte in due giorni** (l'ultima il 10/08 alle
  03:47, con il disco fermo al **07/08 delle 18:49** e il ramo avanti di
  **463 commit**). Il segno non è un errore: è un `git status` **che non
  riconosci** — file modificati che nessun cantiere tuo ha toccato, e `shared/`
  che risulta scritto quando a tutti era vietato. La domanda giusta è quella
  già scritta qui — *sono dove credo di essere?* — e la risposta la dà una riga:
  `git rev-parse HEAD`.
  ⚠️ **Quello che è nuovo, e costa un'ora se non si sa**: `git reset --hard` e
  `git stash` sono **bloccati dal classificatore**, giustamente, perché
  distruggono. E `git merge --ff-only` da solo **rifiuta** finché ci sono
  modifiche locali. La via che funziona e non distrugge niente, in tre passi:
  1. **copia i file** che il disco ha di suo in una cartella dello scratchpad
     (`for f in $(git diff --name-only); do … cp …; done`);
  2. **dimostra che non si perde niente** — non «i file sono diversi dal
     remoto», che è ovvio dopo 463 commit, ma **che i nomi che quel lavoro
     aggiunge esistono già** nel remoto (`git show origin/<ramo>:<file> | grep
     -c "function <nome>"`). Il 10/08 erano `csvPesate`, `numeroDichiarato`,
     `parsePesateCsv`: tutte e tre presenti, cioè quel lavoro era stato
     committato la sera stessa;
  3. **porta i file AVANTI** al contenuto del remoto invece di riportarli
     indietro (`git show origin/<ramo>:$f > $f`), `git add -A`, e allora il
     `merge --ff-only` passa.
  La differenza fra il passo 3 e un `reset --hard` non è tecnica, è di
  **intenzione**: uno scrive il futuro sopra il passato dopo averlo verificato,
  l'altro butta via senza guardare. Ed è la ragione per cui il primo si può fare
  e il secondo no.
  ⚠️ E il lavoro **non committato** dei cantieri vivi in quel momento è perso:
  il 10/08 tre cantieri erano morti sul limite di sessione **prima** di
  consegnare, quindi non si è persa nessuna misura verificata — ma è un caso
  fortunato, non una difesa. La difesa è committare presto ciò che è verificato.
- ⛔ **IL CONTENITORE NUOVO ARRIVA CON UNA COPIA SUPERFICIALE, E DUE CONTROLLI
  DICHIARANO DI NON AVER GUARDATO.** Misurato il 13/08: contenitore fresco,
  `git rev-parse --is-shallow-repository` → **true**, `git log --oneline | wc
  -l` → **1643** commit invece di tutta la storia. Non è un guasto del
  prodotto: `date-checkpoint` e `documenti-invecchiati` chiedono la storia per
  sapere **quando** un file è stato scritto davvero, e senza di quella si
  fermano dicendolo — «la storia di git è leggibile (se no il conto direbbe
  zero senza aver guardato): copia superficiale». È la forma buona del difetto:
  un controllo che **si dichiara cieco** invece di rispondere «tutto a posto».
  La cura è una riga, e va fatta **prima** di lanciare il giro `node`, se no si
  legge un rosso che non parla del codice:
  `git fetch --unshallow origin`.
  ⚠️ E vale la stessa domanda del riallineo: *sono dove credo di essere?* Il
  13/08 il contenitore era **insieme** superficiale e indietro (disco a
  `5a4c5b6`, la PR #321; ramo remoto a `27fa9c5`) — due condizioni diverse che
  si presentano insieme e si curano in due modi diversi, `fetch --unshallow`
  per la prima e `fetch` + `merge --ff-only` per la seconda.
- ⛔ **NIENTE `git stash` CON CANTIERI APERTI.** Il 01/08 serviva confrontare la
  pagina di Genesi con `HEAD`: lo stash ha funzionato e ha ripristinato tutto,
  ma nella finestra c'erano **cinque agenti che scrivevano** — e uno stash che
  si sovrappone a una scrittura non si ripristina pulito. È la stessa famiglia
  del `git checkout` che cancella il lavoro non committato, con in più il fatto
  che tocca **i file di tutti**, non i propri. Per confrontare con `HEAD` si usa
  una `git worktree`, che non tocca l'albero vivo — la stessa che serve già a
  misurare la copia di ciò che si committa.
- ⛔ **E SULLA COPIA CI VUOLE `git add -A`, SE NO I FILE NUOVI NON ESISTONO.**
  `git diff --cached | git apply` **crea il file sul disco** della worktree ma
  non lo mette nel suo indice: lì resta **non tracciato**. Ogni controllo che
  conta i soggetti con `git ls-files` — `suite-collegate` lo fa di proposito,
  e la ragione è scritta nel suo commento — sulla copia **non lo vede**.
  Misurato il 02/08: la copia diceva «55 file, 3 passati, 0 falliti», la CI sul
  commit identico diceva «**56 file, 1 fallito**», perché un banco nuovo non
  era registrato in `tutti.mjs`. Cioè la verifica ha dato **verde su un commit
  rosso**, che è il modo peggiore di sbagliare: la difesa che si crede di avere.
  Dopo `git apply`, sulla worktree: `git -C "$W" add -A`. Costa una riga.
- ⛔ **E LA WORKTREE SI RICREA, NON SI RESETTA.** `git worktree add --detach
  HEAD` **congela il commit di quel momento**; un `git reset --hard HEAD`
  lanciato *dentro* la worktree torna a **quello**, non al ramo, perché lì
  `HEAD` è il commit staccato. Misurato il 03/08 raccogliendo quattro cantieri:
  riusando la stessa copia per tre commit di fila stavo misurando un albero
  vecchio di tre commit, e la copia rispondeva «1 prova fallita» su un test che
  sul disco era verde — cioè il contrario del difetto solito, un **rosso
  falso**, che costa uguale perché fa cercare un guasto che non c'è. La copia
  costa meno di un secondo: `git worktree remove --force "$W" && git worktree
  prune && git worktree add -q --detach "$W" HEAD`, ogni volta.
- ⚠️ **LE PROVE GIRANO ANCHE CON `TZ=Europe/Rome`.** Il contenitore è in **UTC**,
  le cave sono in Italia. Il 01/08 una controprova sul conto dei giorni ha
  risposto «non distingue» in UTC e ha visto il difetto in ora italiana; la
  suite intera, rilanciata con l'orologio del cliente, è caduta in **due punti**
  che in UTC erano verdi. Da lì è uscito un cantiere intero
  (`docs/RICERCA_GIORNO_LOCALE_202607.md`): `toISOString()` su una data
  costruita in ora **locale** perde una o due ore, e quando attraversano la
  mezzanotte cambia il **giorno**. **Un controllo che gira in un ambiente
  diverso da quello del cliente misura l'ambiente, non il prodotto.**
- ⛔ **UNO STRUMENTO CHE SCRIVE SUL SOGGETTO CHE MISURA DEVE LEGGERLO PRIMA DI
  SCRIVERCI.** Misurato il 06/08, ed è la causa — cercata per giorni nel posto
  sbagliato — dello «0 modali aperte su 68» del banco `modali-dentro.mjs`.
  `SCEGLI` metteva il contrassegno `data-dw-sonda` sull'elemento e **poi** ne
  calcolava l'impronta; ma `identita` e `forma` leggono il `dataset`, quindi
  quello che tornava era l'impronta dell'elemento **col contrassegno addosso**
  (`BUTTON|btn-x|dwSonda=1`). `TOCCA` il contrassegno lo toglie, e al giro dopo
  il confronto era fra `BUTTON|btn-x|` e una lista che conteneva
  `…|dwSonda=1`: non combaciavano **mai**. Le due difese contro i doppioni
  erano tutt'e due morte e il banco ripremeva lo stesso pugno di comandi — i
  «6.800 comandi provati» che sembravano la prova di una superficie senza dati.
  Dopo: **0 → 11 modali**, comandi **6.800 → 980**. Il contrassegno serve a
  **ritrovare** l'elemento dopo, non a descriverlo.
  ⚠️ E le due diagnosi precedenti erano tutt'e due plausibili e tutt'e due
  false (il selettore `.sitem`, poi la dimostrazione vuota): quando una misura
  non torna, il sospettato più facile è il soggetto — ed è quasi sempre il
  righello.
  ⚠️ **E la tela è un righello che sbaglia in silenzio tenendo la risposta di
  prima.** `canvas.fillStyle = 'var(--danger)'` **non risolve la variabile e non
  fallisce**: l'assegnazione a un valore non valido viene semplicemente
  ignorata, e il pennello resta del colore dipinto un attimo prima. Il 07/08 la
  prima misura sui gradienti di Terra ha stampato un onestissimo «2,98» che era
  il fondo del badge `danger` misurato nel giro precedente. La forma giusta è
  quella già scritta per il lettore dei colori: si chiede il colore a un
  **elemento vero** con `getComputedStyle`, e alla tela si passa solo il
  risultato. La famiglia è quella dello `sed` che non trova e dell'`assert` che
  salta: **un'operazione che non fallisce non ha per forza fatto qualcosa** — e
  qui non lascia nemmeno un valore vuoto da riconoscere, lascia un numero
  plausibile.
- ⛔ **E PRIMA DI MISURARE L'EFFETTO DI UNA MODIFICA, SI GUARDA DA QUALE REGOLA
  IL SOGGETTO È GIÀ GOVERNATO.** Il verso opposto della regola qui sotto, e il
  07/08 mi è costato una **diagnosi pubblicata e falsa**. La barra di Sentinella
  usciva a 320 px; ho provato a rimpicciolire il carattere e ho misurato che il
  minimo **saliva** da 328 a 333, l'ho scritto in un commit e nel commento di un
  banco come «rimpicciolire lo fa salire, non toccate il carattere».
  Il numero era vero, **la causa no**: a 320 px il foglio condiviso applica già
  `@media(max-width:360px)` con font **8px** e spaziatura **.8px**, quindi la
  mia prova non rimpiccioliva niente — scriveva 8 dov'erano già 8 e portava la
  spaziatura da .8 a **.9**. Sei parole, **51 lettere**, 51 × 0,1 = **5,1 px**:
  esattamente i cinque comparsi. `getComputedStyle` lo dice in **tre secondi**.
  ⚠️ E il danno non è il tempo perso: è che una diagnosi sbagliata **scritta con
  sicurezza** manda il cantiere dopo a non provare la strada giusta. Lì la
  strada giusta era proprio quella, e ha chiuso il difetto (7,5px/.45).
  ⚠️ Nella stessa diagnosi c'era un secondo errore, dedotto e non misurato:
  «le colonne sono `1fr`, quindi il minimo è **sei volte la più larga**». Con
  `1fr` le tracce si equalizzano **solo se ci stanno**; se no ognuna resta alla
  propria min-content, e il minimo è la **somma**. Chiesto alla griglia
  (`repeat(6,min-content)`): 42,36 + 68,88 + 63,42 + 66,81 + 46,19 + 40,14 =
  **327,80**, cioè i 328 misurati.
- ⛔ **QUANDO UNA REGOLA CSS NON MORDE, SI GUARDA CHI VINCE — NON LO SI
  DEDUCE.** Il 06/08, correggendo la barra in alto del core a 320 px, ho dato
  la colpa a **due** cose sbagliate prima di trovare quella giusta:
  1. «vince l'ultimo `@media`» — vero, e c'erano davvero **due blocchi
     `@media(max-width:360px)`** nello stesso foglio a cinquecento righe di
     distanza (prima di aprirne uno, si cerca se c'è già: è la regola 22 di
     `run-stile` in versione «stesso foglio»). Ma spiegava **una dichiarazione
     su tre**;
  2. quella vera: le due metà della barra avevano lo **stile in linea**, che
     batte qualunque regola del foglio senza `!important`. Nessun `@media`, in
     nessun punto del file, avrebbe potuto cambiarle.
  Il segnale che inganna: il browser rispondeva `mq360: true` e teneva nascosto
  l'elemento giusto — cioè **tutti i segnali che la regola fosse attiva** —
  mentre tre dichiarazioni su quattro venivano buttate. `getComputedStyle`
  risponde in tre secondi.
- ⛔ **`overflow:hidden` SUL FIGLIO RENDE CIECO IL CONTROLLO SUL PADRE, E IL
  CONTROLLO RISPONDE «OK».** Terza veste della famiglia «il controllo che non
  guarda dove crede», misurata il 07/08 su Conti e costata giorni di verde
  falso. `barra-etichette` chiedeva *il contenuto della barra ci sta nella
  barra?* — domanda giusta, e che con `.nav button{overflow:hidden}` **non può
  mai** rispondere di no: la min-content del bottone va a zero, le colonne
  della griglia non crescono, la barra non trabocca di un pixel. Sotto,
  nel tema sole, Conti tagliava **otto etichette su dieci a 430 px e dieci a
  320**, e il banco lo assolveva a ogni larghezza. La regola generale:
  **quando un controllo misura un contenitore, si guarda se qualcuno più
  sotto ha il potere di azzerare la misura** — `overflow`, `min-width:0`,
  una griglia a colonne fisse. Se sì, la stessa domanda va rifatta **un piano
  più sotto**, sul figlio.
  ⚠️ E la prima stesura della domanda nuova sbagliava soggetto, col segno di
  sempre: `scrollWidth > clientWidth` sul bottone contava la **pastiglia
  `::before` dell'elemento attivo**, più larga del bottone di proposito —
  Scudo accusato con «40 su 37» mentre la parola ne chiede **30,5**. E sempre
  sulla PRIMA voce, in più app: un difetto identico dappertutto è il modo in
  cui si riconosce di stare guardando il righello. Si misura **la parola**,
  che è un nodo di testo nudo e vuole un `Range`.
- ⛔ **IN UN SISTEMA DI PERMESSI ADDITIVO, UNA RESTRIZIONE NON RESTRINGE — E NON
  DÀ NESSUN SEGNO.** Misurato il 07/08 scrivendo la decisione 10b nelle regole
  Firestore, e la famiglia è più grande del suo caso: vale per qualunque posto
  dove i permessi si **sommano** invece di sovrascriversi.
  1. `match /apps/{appId}/{document=**}` concedeva `allow write` a ogni membro.
     Ho scritto sotto un `match` più stretto che toglieva la cancellazione dei
     documenti emessi: **non toglie niente**. Le regole di Firestore sono
     additive — un match più specifico **non può revocare** ciò che uno più
     largo concede. La restrizione era scritta, si leggeva bene, ed era
     **decorativa**;
  2. e la variante che rifà il danno un livello più sotto: `{resto=**}` combacia
     con **ZERO o più** segmenti. Quindi
     `match /apps/{appId}/{coll}/{docId}/{resto=**}` copre **anche il documento
     stesso**, e il suo `allow write` ri-concede quello che il match sopra aveva
     appena tolto. Servono due segmenti dichiarati
     (`{sotto}/{docSotto=**}`) perché la regola parta davvero più in giù.
  ⛔ **E QUELLO CHE LE HA PRESE TUTT'E DUE È LA PROVA *NEGATIVA*.** Le tre prove
  positive — «l'admin può cancellare», «il membro può ancora emettere» — erano
  **verdi in tutt'e tre le stesure**, compresa quella che non restringeva
  niente. Una prova che verifica un permesso **concesso** non dimostra nulla su
  uno **tolto**: la sola che conta è quella che pretende un **rifiuto**. Chi
  scrive una restrizione e la prova solo «dal lato di chi può» ha scritto un
  commento, non una regola.
- ⛔ **UNA REGOLA CHE VINCE PER SPECIFICITÀ BUTTA VIA IL LAVORO DI CHI HA GIÀ
  STRETTO — E IL SEGNO È CHE PIÙ APP RISCRIVONO LA STESSA SCALA.** Stessa
  giornata, ed è la causa sotto il difetto qui sopra.
  `body.dw.outdoor-mode .nav button{font-size:11px}` sta in `shared/` **fuori
  da ogni `@media`** e vale (0,3,2): batte i gradini `.nav button` (0,1,1) di
  qualunque foglio, compresi quelli che un'app si è misurata addosso. Nel tema
  del **sole** — quello che serve a leggere il telefono in cava — la barra
  restava a 11 px a qualunque larghezza, e `overflow:hidden` faceva sparire in
  silenzio quello che non ci stava.
  Il segno che il disegno condiviso è sbagliato non è il difetto: è che
  **tre app** (Sentinella, Scudo, Conti) hanno dovuto riscriversi la stessa
  scala sotto `outdoor-mode` per riavere il proprio lavoro. Un tema dovrebbe
  **scalare** una misura, non **fissarla** — se la fissa, ogni app con voci
  lunghe deve ridirla, e chi nasce domani nasce rotta.
  ⚠️ **E IL DENOMINATORE, MISURATO LA SERA STESSA, RIDIMENSIONA LA FRASE QUI
  SOPRA — che avevo scritta come se fosse generale.** Il tema del sole fissa
  **undici** corpi (`.name`, `.meta`, `.badge`, `.sec`, `.kpi .l`, `.toast`,
  `.dw-btn`, `.nav button`…), e di quegli undici **uno solo** ha mai morso:
  `.nav button`, ridetto da tre app su sei. Gli altri dieci non li ha ridetti
  **nessuna app**, perché nessuna tara quei corpi per larghezza. Quindi non è
  un difetto sistemico del tema: è **una regola**, e la correzione fatta —
  i due gradini per larghezza in `shared/` — la copre.
  ⛔ La forma strutturale resta scritta perché chi la farà non la reinventi, e
  costa sei file: `.nav button{font-size:calc(var(--nav-eti,8.5px) *
  var(--nav-scala,1))}` con `outdoor-mode` che alza **solo** `--nav-scala`, e
  ogni app che dichiara `--nav-eti` invece del `font-size`. Così un'app che si
  stringe resta stretta anche nel sole, senza ridire niente. **Non fatta**: con
  un solo soggetto che morde, sei file di rischio non se li merita — e questo è
  il conto, non un'impressione.
  ✅ **RIMISURATA IL 07/08 A NOTTE, e la decisione regge alla cifra** — perché
  nel frattempo i miei checkpoint la portavano avanti come «prossimo passo
  atomico», cioè un cantiere da sei file contro una decisione già presa con la
  misura. Il tema del sole in `shared/` fissa un corpo su otto selettori
  distinti (`.badge`, `.dw-btn`, `.kpi .l`, `.meta`, `.name`, `.sec`, `.toast`
  e `.nav button`); le app che ne ridicono almeno uno sono **tre su sei** —
  Conti 4, Scudo 3, Sentinella 5 — e Campo, Flotta e Terra **zero**. E le
  dodici righe di quelle tre app sono **tutte e dodici `.nav button`**: nessun
  altro corpo è stato ridetto da nessuno. Quindi «uno solo morde» non è
  invecchiato, ed è ancora **una regola** e non un difetto del disegno.
  ⚠️ La lezione non è sul tema: è che **una decisione presa con la misura va
  tolta anche dalle liste che la propongono**, se no rinasce da sola.
  ⛔ **E IL 14/08 QUELLA STESSA COSA È SUCCESSA IN UNA VESTE CHE LA RIGA QUI
  SOPRA NON COPRE: A PROPORRE NON ERA UNA LISTA, ERA UN COMMENTO SCRITTO AL
  FUTURO.** `accorciaVoceTendina` di Sentinella porta accanto, dal 09/08,
  «⚠️ **VIVREBBE** in `shared/`: la stessa domanda ce l'ha Scudo… sta qui perché
  il cantiere che l'ha scritta non poteva toccare `shared/`». Onesto, e una
  **previsione**. Dodici minuti dopo, un checkpoint decideva il contrario **con
  la misura**: *«oggi il secondo consumatore NON esiste, e la regola scatta su
  "serve a due app", non su "potrebbe servire"»*. Cinque giorni dopo un cantiere
  ha letto la previsione come un **fatto** e me l'ha consegnata come lavoro da
  fare; io l'ho scritta in roadmap senza rileggere i checkpoint, e un secondo
  cantiere è partito per farla. Si è fermato **prima di spostare qualcosa**,
  perché il mandato gli chiedeva di provare il «serve a due app»: chi la chiama
  sono **3 punti, tutti in Sentinella**, e l'unica occorrenza in Scudo è un
  commento che dice **l'opposto**.
  ⚠️ **Perché questa veste è peggiore di una lista**: un checkpoint lo si
  rilegge quando si cerca una decisione, un commento lo si legge **mentre si
  lavora sul codice** — quindi la previsione **sopravvive** alla decisione che
  la respinge, e la vince per posizione. La regola pratica: **un commento che
  propone un lavoro futuro va scritto con la sua data e va chiuso da chi decide
  di non farlo** — se no, ogni cantiere che passa di lì lo riscopre. E chi
  riceve da un agente un «vivrebbe / andrebbe / bisognerebbe» cerca **prima nei
  checkpoint** se qualcuno l'ha già deciso. Qui a
  proporla erano i checkpoint — cioè il posto in cui il ciclo si dice che cosa
  fare dopo — e nessuno l'aveva confrontata con questa riga.
  ⚠️ E la correzione va dove vince la cascata, non dove il codice è più
  ordinato: messa dentro i due `@media` che stanno **prima**, a parità di
  specificità avrebbe perso lo stesso. È «vince l'ultimo», già pagata sul core.
- ⛔ **UN CONTROLLO SULL'OVERFLOW NON VEDE IL TRABOCCAMENTO ALL'INDIETRO.** Con
  `justify-content:flex-end`, il contenuto che non ci sta esce dalla parte
  **opposta** — verso l'inizio, sopra il vicino — e `scrollWidth > clientWidth`
  risponde «a posto». È così che la pastiglia «NON SALVA» stava **sopra il nome
  dell'utente** nella prima schermata del core a 320 px senza che nessuna misura
  se ne accorgesse. Il segno da cercare: un figlio `position:static`, senza
  trasformazioni, il cui rettangolo cade **fuori dalla scatola del padre**.
- ⛔ **E IL SOGGETTO PUÒ NON ESSERE UN ELEMENTO.** Seconda forma della regola qui
  sopra, misurata il 07/08 sull'ultimo KO rimasto: a 320 px il corpo del core
  andava a **333 px** e **nessun elemento sporgeva**, in nessuna direzione. Il
  colpevole era il messaggio che `build3D` scrive quando il motore 3D non parte
  — `'3D non disponibile: '+e.message`, dove `e.message` contiene **l'indirizzo
  intero del CDN**: una parola sola di 60 caratteri, inspezzabile, che chiede
  **345,6 px in uno spazio di 320** e dentro un flex centrato esce **12,8 px per
  parte**. Un testo nudo dentro un flex è una **scatola anonima**, e
  `querySelectorAll('*')` non la vede: 173 nodi guardati, 0 sporgenti; poi col
  `TreeWalker` sui **nodi di testo**, 1 colpevole al primo colpo. Quando una
  misura sull'overflow dice «esce ma non so chi», il passo dopo è **camminare i
  nodi di testo con un `Range`**, non rileggere il CSS.
  ⚠️ E la correzione ovvia era sbagliata, provata prima di scriverla:
  `overflow-wrap:break-word` — la forma che il core usa già in `.toast` — lascia
  il corpo a **333/320**, perché non riduce la larghezza **minima** del contenuto
  e un elemento di flex ha `min-width:auto`. Solo `anywhere` la riduce.
- ⚠️ **«CI STA» NON È «SI USA», e il primo verde è la trappola.** Stessa
  giornata: reso cedevole il blocco della barra, la pagina non scorreva più — e
  il bottone «Esci» era diventato largo **16 px** su 44 di altezza, dentro lo
  schermo e impossibile da premere. Fermarsi al numero che si stava inseguendo
  avrebbe consegnato un difetto **peggiore** di quello di partenza, perché
  invisibile a chi misura l'overflow. Dopo una correzione di layout si
  rimisurano **i bersagli di tocco** (44×44, e il punto centrale deve
  appartenere all'elemento o a un suo discendente), non solo lo scorrimento.
- ⏱️ **E C'È UNA TERZA FORMA DI INVECCHIAMENTO DEI DOCUMENTI: IL VERDETTO REGGE
  E SCADE LA PROVA.** Oltre al «non c'è» **sbagliato** e a quello **scaduto**,
  il 06/08 su `docs/CONCORRENTI_SCUDO.md` due righe portavano una prova falsa
  con un giudizio giusto: «l'unica stampa è il verbale DPI» (le stampe erano
  due) e «restano i tre export CSV» (erano quattro). Il verdetto non cambiava.
  Ma chi riapre la riga fra un mese verifica la prova, la trova falsa, e
  conclude che sia scaduta **tutta la riga** — e apre un cantiere su una cosa
  che esiste già. **Una prova che invecchia non rende la riga sbagliata: la
  rende non credibile**, che è peggio, perché la fa buttare via insieme a
  quelle giuste.
  ⛔ **E IL 09/08 QUELLA FORMA È STATA MISURATA SU TUTTE E QUARANTASETTE LE
  RIGHE, con un esito che cambia il modo di scrivere una verifica: ZERO
  VERDETTI CAMBIATI, DODICI PROVE CHE NON TORNAVANO PIÙ.** Cioè le verifiche
  del 01-07/08 erano fatte bene, e a marcire è **solo** il modo in cui sono
  scritte — **perché il repository cresce**, non perché qualcuno abbia
  sbagliato. Le quattro cause, tutte da riconoscere prima di dichiarare scaduta
  una riga:
  1. **un termine corto dentro parole comuni**: `miglia` trova `famiglia`,
     `migliaia`, `somiglia` — 23 occorrenze, zero pertinenti;
  2. **una parola polisemica**: `firma` qui è tanto quella di una **persona**
     quanto quella di una **funzione** («una firma troppo stretta», che è una
     regola di questo file);
  3. **il nostro gergo che entra nel conto**: «**questo cantiere**» detto del
     nostro lavoro nei commenti, in un documento che cerca il *cantiere* della
     cava. Peggiora **proprio perché si lavora**;
  4. **un'unità di misura che è un pezzo di un'altra**: `m/s` dà 47 occorrenze
     nell'app che misura in **`mm/s`**.
  Nessuna delle quattro è un difetto del prodotto, e tutte e quattro avrebbero
  fatto **dichiarare scaduta una riga giusta**.
  ⛔ **E LA FORMA CHE SOPRAVVIVE È MISURATA, non un'opinione: Scudo è l'unico
  documento a ZERO prove scadute su sei**, contro terra 3 su 4 e conti 4 su 8.
  La ragione non è il suo codice: è che ogni sua riga porta **il comando con le
  sue alternative e l'uscita attesa** — `grep -ciE 'a|b|c' → 0 e 0` — invece di
  un conteggio di una parola sola. **Un comando si rilancia; un numero si può
  solo credere.** Quindi, scrivendo una verifica:
  · la prova è un **comando eseguibile con la sua uscita**, non una frase che
    descrive una ricerca;
  · i termini si scelgono **lunghi e tecnici** (meglio se inglesi: in un testo
    italiano non collidono con niente);
  · dove il termine è per forza largo, si scrive **che cosa sono** le
    occorrenze, non **quante** — una caratterizzazione resta vera quando il
    numero cambia;
  · e **niente numeri di riga**: misurati il 09/08, **87 su 91** non trovavano
    più il loro nome. Il nome è stabile e si verifica con un `grep`; la riga si
    sposta a ogni commit.
- ⏱️ **E LA QUARTA FORMA È LA PEGGIORE, PERCHÉ NON INVECCHIA: NASCE FUORI DAL
  CONTROLLO.** Misurata l'08/08. `numeri-nei-documenti.mjs` sorveglia i numeri
  che i documenti dichiarano, e funziona: quella notte ha fatto cadere il giro
  perché due prove nuove avevano portato il totale da 2.307 a 2.309. Ma il suo
  elenco `BROWSER` guardava **due documenti su tre**, e nel terzo —
  `DECISIONI_WEEKEND.md`, cioè **quello che il fondatore apre per decidere** —
  stava scritto «**19** banchi che aprono davvero le pagine» dove sono
  **153**: vecchio di un **ordine di grandezza**, e verde da sempre.
  Nello stesso giro è saltato fuori che in `DEVELOPMENT.md` **gli addendi non
  tornavano** — «1890 + 297 + **63** + 32 + 9 + 8» fa 2299, non 2307 — perché
  il controllo guarda il **totale** e non la somma scritta accanto.
  > **Un numero è sorvegliato solo dove il controllo ARRIVA, e l'elenco di
  > dove arriva va guardato quanto il numero.**
  La domanda da farsi davanti a un controllo sui documenti non è «passa?» ma
  **«quali documenti, e quali numeri dentro di essi, sono nel suo elenco?»**.
  La roadmap questo lo dichiara di sé in fondo («qui il controllo non arriva,
  l'aggiornamento è a mano»); i tre documenti no, e per questo il difetto è
  vissuto lì.
  ⛔ **E UN TOTALE NON SI CONTROLLA DA SOLO; UNA SCOMPOSIZIONE SÌ.** Misurato il
  09/08 sullo stesso numero **tre volte in un giorno** — le mancanze confermate
  del delta, dichiarate 42, poi 41, e vere **47**. Ogni volta la causa era la
  stessa: **il righello guardava una forma di scrittura invece del verdetto**
  (la parola cercata nel file prendeva un'intestazione di sezione; il grassetto
  che usano cinque documenti su sei faceva contare **zero** il sesto). E ogni
  volta il conto era stato rifatto **con attenzione**, guardando il totale.
  A trovarlo è stato far **stampare al controllo la scomposizione per app**:
  «scudo **0**» accanto a un documento che nel suo riepilogo scrive «Confermate
  assenti: **6**» è ovvio a chiunque, mentre un totale sbagliato del 13% non lo
  è per nessuno. **Ogni addendo ha un lettore che lo conosce; il totale no.**
  ⚠️ E la beffa che vale più del numero: la riga che quel conto lo commentava
  diceva **già** in prosa, scritta due giorni prima, *«questo conto misura una
  forma di scrittura, non la verità»*. L'ho letta, l'ho citata nel commit — e
  poi ho costruito il controllo sulla forma. **Una regola scritta in un
  documento non protegge lo strumento che si sta scrivendo**: è la stessa
  lezione di `tutti.mjs`, cioè che una regola di questo file va cercata per
  prima cosa nel codice che la deve applicare di più.
  ⚠️ Le righe che **parlano** di un verdetto si travestono in almeno due modi e
  nessuno dei due si prende con la parola: l'intestazione di **sezione**
  («**CONFERMATE ASSENTI** — in ordine di…») e l'intestazione di **colonna**
  (`| quando | confermate | false | …`). Le separano *dove comincia la cella* e
  *la maiuscola*, non il vocabolario.
- ⛔ **UN BANCO CHE GUARDA IL POSTO GIUSTO CON LA *FIXTURE* SBAGLIATA RISPONDE
  «PULITO» SENZA AVER GUARDATO.** Famiglia nuova, misurata il 13/08 su Terra, e
  diversa dalle altre: non il filtro, non la domanda — **i dati con cui la
  domanda viene fatta**. `terra-numeri-tranquilli` costruisce l'anno cieco
  svuotando i rilievi, ma la dimostrazione dichiara `estrattoPregressoM3:
  880000`, quindi la bandiera `misurabile` restava **vera** e la sezione
  incriminata **non veniva nemmeno attraversata**: il banco sorvegliava la
  bandiera **per anno** e non quella **per titolo**. Sotto ci stava il foglio
  che va all'ente, che su una cava senza nessun rilievo scriveva «Cumulato a
  fine 2026 · **0 m³ (0% del concesso)**» e «Residuo · **1.200.000 m³**» — con
  lo schermo che diceva `—` e, otto righe più giù **sullo stesso foglio**, un
  «Totale 2026 · non misurato».
  La domanda da farsi scrivendo una fixture: **il caso che voglio provare
  ARRIVA al ramo che voglio provare?** Si verifica facendo dire al banco quale
  strada ha preso, non deducendolo dai dati che gli si sono passati.
- ⛔ **QUANDO SI AGGIUNGE UNA RAGIONE A UNA FUNZIONE, SI CERCANO I CONTI CHE
  *DEDUCEVANO* L'ALTRA.** Misurata il 13/08 su Conti, ed è la famiglia dei
  difetti che **nascono dalle correzioni**. `valoreDdt` sapeva rispondere «non
  calcolabile» per la quantità; aggiungendogli la ragione «prezzo mancante»,
  una riga lontana — `Math.max(0, senzaDensita − nonValorizzabili)` — ha
  smesso di dire la verità: reggeva sull'invariante *«non valorizzabile è
  sempre anche senza densità»*, vero finché le ragioni erano **una**. Rotto
  l'invariante la sottrazione non diventava negativa: **faceva sparire** dalla
  riga le consegne che un valore ce l'hanno, cioè sbagliava nella direzione
  tranquilla.
  Il segno da cercare è una **sottrazione fra due insiemi**, o un `Math.max(0,
  a − b)`: quello zero di comodo è lì perché qualcuno sapeva che `b ⊆ a`, e
  quell'invariante **non è scritto da nessuna parte**. La cura è la stessa di
  sempre: il numero si **conta**, non si deduce.
- ⚠️ **IL CONTROLLO CHE NON GUARDA DOVE CREDE.** Variante della regola qui
  sopra, e più insidiosa: il controllo **sa** fallire, ma il suo filtro esclude
  proprio i casi che contano, e allora risponde «pulito» senza aver guardato
  niente. Il 31/07 è successo **tre volte in un giorno**:
  1. il censimento dei doppioni cercava la forma `.some(` e non vedeva i
     quattro gestori che usano un `Set` — quelli che facevano la cosa giusta;
     poi lo stesso filtro è finito **dentro la regola** nata da quel censimento,
     che quindi era cieca proprio dove il codice era sano;
  2. la controprova del banco degli id iniettava il difetto sostituendo il
     **primo** `</body>`, che in Terra, Genesi e Campo sta dentro le stringhe
     dei modelli di stampa: su tre superfici su nove il difetto non arrivava mai
     nella pagina e la controprova diceva «pulito»;
  3. la sonda sulle tendine scartava gli elementi con **altezza zero** — cioè
     tutte quelle delle sezioni non aperte — e rispondeva «nessuna tendina
     taglia il testo» mentre uno screenshot mostrava il contrario.
  La difesa: dopo aver scritto un controllo, chiedersi **quanti soggetti ha
  guardato davvero** e stamparlo (`84 tendine misurate`, `20 gestori`,
  `9 superfici`). Un numero che non torna si vede; un «zero violazioni» no.
  ⛔ **E IL 03/08 È SUCCESSA ALTRE TRE VOLTE, con la variante che conta: non
  era il FILTRO a essere sbagliato, era la DOMANDA.** Un filtro storto si
  aggiusta; una domanda sola non si aggiusta, si affianca.
  1. la **regola 20** di `run-stile` guardava sei app su sette. L'elenco delle
     app era scritto a mano e la pagina costruita per convenzione
     (`apps/<app>/index.html`): Genesi ha `genesi.html`, quindi non c'era — e
     nessuno se ne accorgeva, perché il controllo diceva «nessuna violazione».
     Era il **terzo** elenco a mano nello stesso file, mentre gli altri due
     avevano già il confronto col disco;
  2. `fuori-schermo.mjs` chiedeva «esce dallo **schermo**?» e la pillola di
     Campo usciva dal **proprio riquadro** (198 px in un blocco da 131, +9
     anche a 390): nello schermo ci stava, e `.item` ha `overflow:hidden`,
     quindi non scorreva nemmeno la pagina. Il banco rispondeva «2 schermate
     pulite» **prima e dopo** la correzione;
  3. `copertura-funzioni` contava le funzioni **coperte**: aggiungendo codice
     senza prove quel numero non scende, cioè il caso che la sua intestazione
     prometteva di prendere era esattamente quello che non vedeva.
  La forma della difesa è sempre la stessa e non è «più severità»: **una
  seconda domanda**, e i due elenchi che già hanno il confronto col disco
  riusati invece di scriverne un terzo. Chiedersi, dopo ogni controllo nuovo:
  *se il difetto stesse un piano più sotto — dentro il riquadro invece che
  dentro lo schermo, in un'app fuori convenzione, sul valore che sale invece
  che su quello che scende — questo controllo lo direbbe?*
- ⚠️ **IL SINGOLARE CERCATO NEL SORGENTE: 32 FRASI CORRETTE, E LA REGOLA
  AUTOMATICA PROVATA E SCARTATA COI NUMERI.** I tre banchi che sorvegliano il
  singolare guardano quello che la **dimostrazione rende** con n=1; il sorgente
  li ha tutti. Cercando i punti `${…} <plurale>` senza guardia sono uscite 32
  frasi vere in sette file — «Letto: 1 righe» sull'import di un CSV (una riga
  sola è normalissima), «negli ultimi 1 giorni» in nove punti di Flotta perché
  `finestra = Math.max(1, …)`, «ogni 1 mesi» su un campo `type="number"` con
  `min="0"`, «1 letture», «1 fori», «1 ore».
  ⛔ **E la sostituzione NON è meccanica**, che è la ragione per cui un
  `plurale()` messo a tappeto non basterebbe: con «1» cambiano l'**articolo**,
  la **preposizione** e il **verbo**. «i 1 viaggi non entrano» → «il viaggio
  dichiarato non entra»; «Gli altri 1 fori sono» → «L'altro foro è»; «negli
  ultimi 1 giorni» → «**nell'**ultimo giorno» — ma nel moltiplicatore
  «3 mezzi × 1 giorni» resta «giorno». Ogni punto è una frase da riscrivere,
  non una parola da scambiare.
  ⛔ **La regola automatica è stata provata e SCARTATA, e il numero è questo:**
  cercare un confronto qualunque in una finestra di 120 caratteri sbaglia **22
  volte su 38**. Con la *seconda domanda* — non «c'è una guardia vicino» ma
  «c'è una guardia **su questa variabile**», più lo scarto delle costanti in
  maiuscolo — il rumore scende a **5 su 28**, e quei cinque hanno un nome: una
  lista letterale `[6,12,24]`, due termini di legge (12 o 24 mesi) dietro un
  `if`, e «foto», che in italiano è **invariabile**. Restano falsi perché la
  guardia vera sta quasi sempre nella **riga prima** (`if (n >= 2)`), e vederla
  vuol dire leggere la struttura dei blocchi: la stessa analisi, in
  `nomi-liberi`, era costata 11 falsi allarmi prima di trovare l'ancora giusta.
  Quindi: **misura in scratchpad, non regola** — e questo paragrafo esiste
  perché nessuno la rifaccia alla cieca.
- ⛔ **UN REGISTRO CHE SI TRONCA A METÀ SEMBRA COMPLETO — E CHI LO LEGGE NON HA
  NIENTE CHE GLI DICA DI NO.** Misurato l'08/08, e mi ha ingannato **di
  persona**: il giro del browser lanciato alle 03:00Z era ancora vivo alle
  10:37 — **sette ore e trentasette** — e la sera prima avevo letto il suo
  registro **tre volte**, con `leggi-giro.mjs`, che è lo strumento scritto
  apposta per leggerlo bene. Nessuna delle tre volte mi sono chiesto se il file
  stesse ancora **crescendo**. Non cresceva da ore.
  Sotto c'era `p.on('close', …)` senza limite, e un banco appeso da **quattro
  ore e trentotto**. Un giro che si pianta non stampa un errore: si ferma a metà
  di una sezione, e le passate mai eseguite **non compaiono in nessuna riga** —
  spariscono invece di dichiararsi. È la famiglia del banco che crolla e
  dichiara meno prove, in una veste peggiore: qui non crolla nemmeno, **tace**.
  La difesa, in `tutti.mjs`: un limite per passata (`--limite=`, 30 minuti),
  che uccide l'**albero** del processo (`detached:true` + kill del gruppo, se no
  un Chromium orfano tiene porta e memoria), **dichiara** che quella passata non
  è stata misurata, **tira avanti**, e la conta a parte — un soggetto non
  misurato non è un soggetto a posto, quindi il giro non può uscire zero.
  Provata nei due versi da `browser/limite-giro.mjs` (9 prove, due giri finti).
  ⚠️ **E la regola generale per chi legge un registro lungo: la prima domanda
  non è «che cosa dice», è «sta ancora scrivendo?».** Due `stat` a venticinque
  secondi di distanza costano niente.
  ⛔ **E IL 13/08 LA RISPOSTA È STATA «NO», PER UNA RAGIONE CHE NON È NEL
  REGISTRO: IL GIRO MUORE CON LA SESSIONE.** Lanciato alle 15:59 con `nohup`,
  aveva scritto l'ultima riga alle **17:01**; alle 19:00 il file era fermo da
  due ore e il processo **non esisteva più** — ucciso dall'interruzione della
  sessione, non da un banco piantato. Il registro però si legge benissimo:
  quindici passate, nessun KO vero, e chi lo apre senza guardare l'orologio
  crede di avere davanti un giro finito. `leggi-giro.mjs` lo dice
  («nessuna riga di fine: il giro NON è arrivato in fondo»), ed è la ragione
  per cui quella riga esiste.
  ⚠️ Due conseguenze pratiche, tutt'e due misurate lo stesso giorno:
  1. il **server statico orfano resta vivo e tiene la porta**, quindi il giro
     dopo si ferma da sé («il server sulla porta 8823 non è il mio»). È la
     guardia che funziona: prima di rilanciare si **uccide chi tiene la
     porta**, non si cambia porta;
  2. un giro **più lungo della sessione non finisce mai**. Misurato: 15 passate
     in 61 minuti — e sono le più lente del giro, tutto il blocco `contrasto`
     (14 superfici × 3 temi), quindi il conto NON si estrapola alle 188. Quello
     che si può dire con la misura in mano è che il giro completo non sta in
     un'ora, e che va lanciato **presto nel ciclo**, non alla fine.
  ⚠️ E la banalità che è costata un giro intero: se la **redirezione fallisce**
  (una variabile non espansa, una cartella che non c'è), il giro parte lo
  stesso e macina per un'ora **senza un registro che qualcuno possa aprire**.
  Un giro che gira e non si può leggere è un giro che non è stato fatto: dopo
  averlo lanciato si guarda che il file **esista e cresca**, prima di andare
  avanti.
  ⚠️ **Ma venticinque secondi sono il MINIMO, non la risposta — tarato l'08/08.**
  Con un giro vivo da 2h33 il registro è rimasto fermo per **oltre venti
  secondi** fra due scritture, e un controllo a 20s avrebbe detto «FERMO» su un
  giro sanissimo: nei 55 secondi dopo sono arrivati 727 byte. Un banco lento fra
  una schermata e l'altra tace a lungo, e l'allarme falso costa quanto quello
  mancato — perché fa uccidere un giro da tre ore. La domanda che **non** ha
  falsi allarmi non è sul file, è sul processo: `ps -eo pid=,ppid=,time=` per
  vedere se il giro ha un **figlio vivo** e se il suo tempo di CPU sale. Un
  figlio che c'è e macina sta lavorando; nessun figlio, o un figlio a CPU ferma
  da minuti, è il piantone vero.
  ⛔ **E LA CAUSA SOTTO VALEVA PIÙ DEL SINTOMO: 17 SECONDI PER SEZIONE SPESI A
  CLICCARE ELEMENTI CHE NON SI POSSONO CLICCARE.** `vaiA` apriva **ogni**
  accordion chiuso della pagina — non solo quelli della sezione appena aperta —
  e su Flotta e Scudo sono **sette, tutti INVISIBILI**. Playwright aspetta che
  un elemento diventi *azionabile*: un invisibile non lo diventa mai, quindi
  ogni click bruciava i 2.500 ms pieni e il `.catch(() => {})` se li mangiava
  **senza lasciare una riga**. Misurato: Conti 0,55 s per sezione (zero
  accordion), Terra 3,2, Flotta 9-15, **Scudo oltre 15** — e nessuno di quei
  click apriva niente. Con `:visible` nel selettore: tutte a **0,58**, e il
  banco che era appeso 4h38 finisce in **4m18s** con la stessa identica
  copertura (614 testi su Scudo, prima e dopo).
  La lezione non è «ottimizzare»: è che **un'eccezione ingoiata in un ciclo si
  moltiplica**, e il costo non compare da nessuna parte — non c'è un rosso, non
  c'è un avviso, c'è solo un giro che dura ore e che qualcuno finirà per
  spegnere senza leggerlo. Il `.catch(() => {})` va guardato con lo stesso
  sospetto del `catch` vuoto: se sta dentro un `for`, va misurato.
- ⛔ **UNA VERIFICA TUTTO-O-NIENTE NON VIENE FATTA — e la cura costa meno della
  DICHIARAZIONE che va scritta insieme a lei.** Misurato il 14/08: 198 passate
  a 4,1 minuti l'una sono **13,5 ore**, cioè più di una sessione. Due notti di
  fila il giro è stato spento a metà, e i suoi primi KO erano difetti **chiusi
  cinque ore prima**: non produceva informazione, produceva **accuse che
  sembrano fresche**. Il difetto non era la lentezza: era che il runner
  accettava `--limite=`, `--radice-impronta=`, `--banchi-finti` e **nessun
  filtro** — i singoli banchi il `--solo=` ce l'avevano, mancava a chi li
  lancia. *Se l'unica verifica completa che un repository ha non arriva mai in
  fondo, quella verifica non esiste.*
  ⛔ **Ma la metà che conta è l'altra: un giro filtrato stampa le stesse
  identiche frasi di un giro intero** — stesse intestazioni, stesso «N banchi a
  posto», stesso zero KO — e chi lo apre legge un verde che sembra riguardare
  tutto il prodotto. È la quinta volta che questa famiglia si presenta (il
  registro troncato, il rosso voluto, il riepilogo ricontato, la passata
  fermata dal limite), e la cura è sempre la stessa: **un dato che il programma
  ha in mano non si indovina dal testo**. Chi filtra ottiene anche la riga che
  dice quante passate ha lasciato fuori, e quelle **non sono «a posto»: sono
  non misurate**. Un nome sconosciuto ferma il giro **prima di alzare il
  server** invece di uscire zero — è il difetto già chiuso su
  `contrasto-non-testo.mjs`, dove un `--solo=` sbagliato usciva zero
  dichiarando di non aver guardato niente.
  ⚠️ **E il quarto apostrofo di questa casa ha ingannato la prova, non il
  prodotto.** Il lettore che si rilegge i banchi dal sorgente usava
  `'([^']+)'`, e **sei nomi su 198** contengono un apostrofo sfuggito («la
  manina promette un tocco che c\'è»): leggeva **192 su 198** e sarebbe restato
  verde per sempre, perché un `25 passati` non dice quanti soggetti ha
  guardato. L'ha preso **il denominatore** — *quante righe aprono una passata,
  e quante ne ho lette?* — scritto come asserzione invece che come commento. È
  la difesa da mettere in ogni righello che si legge un elenco: non «trovo
  qualcosa», ma **«trovo tutto quello che c'è»**.
- ⛔ **UN CENSIMENTO CHE DICHIARA IL SUO DENOMINATORE VA POI LETTO — E QUANDO
  LO SI LEGGE, IL BUCO È QUASI SEMPRE NEL RIGHELLO.** L'08/08, la riga più
  grossa di tutto il giro del browser diceva: «**234 classi con un fondo
  proprio non sono mai comparse durante il giro: 41 fatte comparire e
  misurate**». Cioè il banco del contrasto, che stampa «4700 testi misurati, 0
  sotto soglia», su quel fronte ne guardava **una su sei**. Aprendolo sono
  usciti **tre difetti del righello**, indipendenti, tutti nella stessa
  famiglia — *un controllo che sembra completo e non lo è*:
  1. **«copre?» era deciso dal TESTO della dichiarazione**, non dal browser: un
     `#hex`, un `rgb()` o una parola erano «pieno», tutto il resto finiva fra
     le «non giudicabili». Ma la forma più comune di questo prodotto è
     `var(--card)`, e `var(--grad)` è un **gradiente dietro un nome**. Misura:
     122 marcate «non coprente», di cui **68 opache davvero**. È la stessa
     lezione della regola 24 — *dare un nome a un valore lo fa sparire da un
     controllo statico* — e la cura è quella che questo file predica altrove:
     **non calcolare una cosa che il browser sa dire** (`getComputedStyle` su
     un campione, e si legge l'alfa vera);
  2. **una COMBINAZIONE di classi risultava «già vista» se le sue parti erano
     comparse separatamente.** `.toast.success` era considerata vista perché
     `.toast` e `.success` erano passate ognuna per conto suo, su elementi che
     non si sono mai incontrati: quindi usciva dal censimento (perché «vista»)
     **e** non veniva misurata (perché quel toast non è mai stato a schermo).
     Spariva da tutt'e due i conti **senza comparire in nessuna riga «non ho
     guardato»**. Si tiene l'insieme intero delle classi di ogni elemento
     misurato, e si chiede se QUALCUNO le portava tutte insieme;
  3. **un campione che nasce nascosto non viene misurato, e il banco lo contava
     lo stesso fra i «fatti comparire».** Il segno era uno scarto di due fra
     due numeri stampati sulla stessa riga (51 e 49) e nessuno lo aveva letto.
     Sotto ci stava il **toast di errore** del core.
  Esito: **41 → 182** classi misurate su 239, e **sei difetti di contrasto veri
  nel core** che nessun banco aveva mai visto — fra cui il toast d'errore
  (3,49:1) e il badge «scaduta» dei documenti del mezzo, a corpo 9 (2,36:1).
  ⚠️ E la lezione sul PRODOTTO, che vale per ogni tinta di stato: **il bianco
  su un pieno di stato non regge** (2,36 sul verde, 3,49 sul rosso). Il core lo
  sapeva già in due punti su otto — `.toast` e `.scad-badge.warn` usavano un
  inchiostro scuro — e sono esattamente i due che passavano. Adesso quel valore
  ha un nome (`--ink-su-pieno`) con i tre conti scritti accanto.
  ⚠️ E un gradiente con le fermate troppo distanti **non ha nessun inchiostro
  che regga tutt'e due**: sul verde del successo il bianco cadeva sulla fermata
  chiara (2,36) e lo scuro sulla scura (3,78). Non si sceglie l'inchiostro: si
  **stringe la forbice** del gradiente.
- ⛔ **UN FILTRO RAGIONEVOLE DIVENTA UNA CECITÀ STRUTTURALE, E ALLORA IL
  CONTROLLO VA RIFATTO NELL'ALTRA SINTASSI.** Misurato l'08/08 sulle unità di
  misura, ed è diverso dal «controllo che non guarda dove crede»: qui il filtro
  è **giusto**, e proprio per questo non si aggiusta.
  `tests/browser/unita-maiuscole.mjs` scarta gli elementi senza area
  (`if (r.width < 1 || r.height < 1) return`) — sensato, un maiuscolo che
  nessuno vede non è un difetto. Effetto: cieco su **tutto ciò che compare
  dopo**. Il riquadro Kuz-Ram del core è `display:none` finché non si calcola,
  e dentro c'era «X50 (cm)» → **«X50 (CM)»**; il banco dichiarava il core
  pulito da sempre. Rifatta la stessa domanda **staticamente** — leggendo dal
  foglio di ogni pagina quali classi mette in maiuscolo, e cercando un'unità
  nuda nel testo proprio degli elementi che le portano — sono usciti **sette**
  difetti veri su 925 elementi, e **uno solo** era quello che il banco vedeva.
  La regola: quando un banco del browser filtra per **visibilità**, la stessa
  domanda va rifatta sul **sorgente**; le due non si sostituiscono (il
  renderizzato prende l'incontro fra classe e contenuto, il sorgente prende
  quello che non è ancora comparso). Costo misurato prima di adottarla: 10
  allarmi, 7 veri e 3 simboli che si scrivono come un'unità (`H` altezza, `DB`
  database, `H/B` rigidità), dichiarati per nome.
  ⚠️ **E il righello ha sbagliato tre volte prima di reggere**, tutte e tre
  nella stessa famiglia già scritta qui: chiudeva l'elemento sul **primo** tag
  omonimo (e `<span class="vita-pct">…<span class="u">m³</span></span>` perdeva
  la protezione: accusa falsa su un caso sano); non sapeva che `<input>` è un
  elemento **vuoto**, quindi l'annidamento non tornava giù e la lettura correva
  oltre `</label>` dentro un commento e dentro codice; e il **commento CSS
  entra nel selettore che lo segue**, quindi `.fl` di Terra non risultava
  nemmeno maiuscola — cioè il controllo era cieco proprio sull'unico caso che
  il banco aveva già trovato. Per la terza volta in una settimana: **i commenti
  vanno tolti in tutte e tre le sintassi che una pagina contiene.**
- ⛔ **UN NUMERO BASSO DI VIOLAZIONI VA DIVISO PER I SOGGETTI CHE IL CONTROLLO HA
  POTUTO VEDERE.** Misurato il 07/08 su Terra, ed è la forma *rassicurante* della
  regola qui sopra: non un controllo che guarda nel posto sbagliato, ma un
  controllo che guarda nel posto giusto **dove non c'è niente**. Terra usciva dal
  banco del contrasto con **2** violazioni contro le 13 di Flotta e le 10 di
  Conti, e le due spiegazioni comode erano tutt'e due false alla misura — non
  aveva «ridetto meno colori» (`--ink-ok`: zero anche in Campo, Conti e Scudo) e
  non li usava di meno: `color:var(--warn|--danger|--success|--info)` dà Terra
  **18**, il massimo delle sei app. La verità è che di quei 18 il banco ne poteva
  vedere **uno**: 2 erano bordi, 7 icone SVG senza testo proprio, 2 solo
  `:hover`, e 6 vivevano dentro `.vita.warn` / `.vita.danger`, che **nella
  dimostrazione non compaiono mai**. Forzando quegli stati: **8 misure, 8 sotto
  soglia**, fino a 1,77:1. Cioè Terra non era messa meglio, era **misurata di
  meno** — e un «2» accanto a un «13» si legge esattamente al contrario.
  La difesa non è un banco più severo: è che accanto a ogni conteggio di
  violazioni stia il **denominatore** (quanti soggetti si sono presentati, e
  quanti erano previsti). Il banco lo dichiarava già a modo suo — «18 classi che
  dipingono un fondo non sono mai comparse: 1 fatta comparire, 17 solo elencate»
  — e nessuno l'aveva letto: è la regola delle righe «non ho guardato», da
  leggere **prima** dei KO.
  ⚠️ **E la variante che non ha bisogno di nessun difetto per fare danno:
  un'ETICHETTA PIÙ LARGA DEL SUO NUMERO.** Il 07/08 ne sono passate quattro in
  un giorno. «**2.251 prove girano senza rete e senza browser**» è la somma di
  **sei** suite, e il giro `node` ne esegue **2.474**: la frase promette *tutto
  quello che gira*, il numero conta un pezzo. «13 regole» per le strisce di
  stato era un censimento **per nome**, e per effetto erano 267. «54 mancanze
  confermate» conta una **forma di scrittura**, e Scudo — che le scrive con
  altre parole — dà **zero**. Nessuno dei tre numeri è sbagliato: è la frase
  intorno a essere più larga. Il rimedio non è cambiare il numero — spesso
  quello giusto è proprio il più stretto: **2.251 va tenuto** perché le altre
  dieci suite contano *file* e crescono da sole quando nasce un file, cioè
  misurano il repository invece del lavoro. Il rimedio è **scrivere accanto che
  cosa conta e che cosa no**.
- ⛔ **DARE UN NOME A UN VALORE LO FA SPARIRE DA UN CONTROLLO STATICO, IN
  SILENZIO.** Misurato il 07/08 sulla regola 24 di `run-stile`, che legge le
  fermate dei gradienti come `#hex`: una fermata scritta `var(--warn-ink)` non
  era **sbagliata**, era **invisibile** — bastava battezzare un colore perché
  smettesse di essere giudicato, senza che niente diventasse rosso. Stessa
  giornata, stessa regola, la variante che *accusa*: la mappa era piatta
  (`grad[nome]`) e il fondo uno solo, quindi una palette dichiarata due volte —
  una per il buio e una per `light-mode` — teneva solo l'ultima dichiarazione e
  la misurava contro la scheda dell'altro tema: **tre accuse false** su una
  palette che il banco del contrasto dà a zero in tutti e tre i temi.
  Le due facce sono la stessa svista e portano a interventi opposti (muovere un
  colore sano, o smettere di guardare quello vero), e quale delle due tocchi
  dipende solo da **come lo scrivi**. La domanda da farsi scrivendo una regola
  statica sui valori CSS: *se questo valore fosse scritto in un altro modo
  ammesso — dietro una variabile, dentro un `color-mix()`, in un secondo blocco
  — il mio controllo lo vedrebbe ancora?* Se la risposta è no, il controllo non
  è severo: è **aggirabile per distrazione**.
- ⛔ **DICHIARARE UN PUNTO CIECO NON LO ILLUMINA.** Misurato il 09/08, ed è il
  seguito della riga qui sotto: là il controllo dichiarava la propria cecità e
  nessuno leggeva; qui la dichiarazione **c'era, era onesta, ed era già la
  correzione di quello stesso difetto** — e non ha impedito la seconda volta.
  In fondo alla roadmap stava scritto *«qui il controllo non arriva, e
  l'aggiornamento è a mano. Chi la legge lo sappia»*, riga nata la prima volta
  che quel file era invecchiato («120 banchi» quando ne erano 147). Al 09/08 lo
  **stesso numero** era scritto lì dentro in **tre valori diversi** (2.366 nella
  riga di stato, 2.370 in fondo, 2.371 in un racconto di mezzo) mentre le suite
  ne eseguivano **2.380**.
  ⚠️ La ragione per cui una dichiarazione così **non può** funzionare è
  geometrica: chi incontra il numero non ha modo di sapere quando è stato
  scritto, e **l'avvertimento sta duecento righe più in basso di lui**. Un
  lettore onesto e attento lo legge comunque sbagliato.
  La regola: quando un numero invecchia due volte nello stesso posto, non si
  scrive un avviso più grosso — **si porta il file dentro l'elenco del
  controllo**. Costa una voce; lasciarlo fuori l'ha appena pagato il documento
  che il fondatore apre per primo.
- ⛔ **UN ALLARME CHE SCATTA SEMPRE INSEGNA A NON GUARDARLO — e se scatta nel
  verso allarmante, fa buttare via lavoro buono.** Misurato il 09/08 su
  `leggi-giro.mjs`, che è lo strumento scritto apposta per leggere bene un
  registro. Pretendeva una riga `USCITA N` per dire che il giro era arrivato in
  fondo, e `tutti.mjs` quella riga **non l'ha mai stampata, in nessuna
  versione**: quindi rispondeva «il registro è tronco, il giro non è arrivato in
  fondo» in coda a un giro da cinque ore e mezza finito benissimo — col conto
  finale («143 banchi a posto, 16 da guardare») stampato **tre righe più su**.
  ⚠️ Le due direzioni sbagliate non costano uguale ma costano tutt'e due: la
  risposta **tranquilla** dove non si sa nasconde i difetti, la risposta
  **allarmante** dove non si sa fa cestinare misure valide. La forma giusta era
  già dieci righe più in là nello stesso file — gli orari sanno dire «vecchio»,
  «fresco» e **«non lo so»**.
  ⚠️ E il modo di accorgersene non è rileggere il controllo: è **aprire il
  soggetto che dovrebbe stampare quella riga**. Trenta secondi di `grep`.
- ⛔ **UN CONTROLLO CHE DICHIARA DI ESSERE CIECO E CHE NESSUNO LEGGE È COME NON
  AVERLO.** Misurato il 03/08, ed è la forma più beffarda di tutte perché non
  richiede nessuna indagine: il banco delle modali stampava in fondo al suo
  riepilogo, da **mesi**, «⚠️ NON RAGGIUNTE: core. Non vuol dire "a posto":
  vuol dire che nessuna loro modale è stata aperta» — e accanto il numero,
  «nel suo programma ce ne sono **68** da aprire, **0** aperte». Nessuno l'ha
  letto. Le cause erano **due, in fila**:
  1. `apriSuperficie` iniettava `state.user` e basta, quindi il core restava
     sulla schermata d'accesso: **258 caratteri di testo e UN bottone** contro i
     658 e otto dell'app vera. Ogni banco che «guardava il core» guardava un
     guscio, e appena il core è diventato visibile sono uscite **cinque
     violazioni di contrasto AA** mai viste;
  2. l'elenco dei candidati da cliccare era scritto sulla forma delle **app**
     (`.item[onclick]`); il core usa `.sitem`. Il banco provava **6.800
     comandi** e apriva **zero** modali, perché i bottoni veri navigano e tutto
     quello che apre una scheda è una riga di lista.
  La regola che ne esce, e vale per ogni riepilogo di banco: **le righe che
  dicono «non ho guardato» vanno lette per prime, prima dei KO.** Un rosso lo
  si vede; un «0 su 68» in fondo a una pagina di verde no — e intanto la
  superficie che il fondatore mostra per prima non era misurata da nessuno.
  ⚠️ E il corollario per chi scrive un banco nuovo: se un elenco di soggetti è
  copiato dalla forma di un'app, **provarlo su una superficie che quella forma
  non ce l'ha** prima di dichiararlo generale.
- ⚠️ **`vaiA(p, nome, sezione)` VUOLE L'ID DEL BOTTONE, NON IL NOME DELLA
  SEZIONE.** La guardia sull'arità ferma la chiamata a due argomenti, ma non
  questa: `vaiA(p, 'sentinella', 'mon')` ha tre argomenti buoni e costruisce il
  selettore `#mon`, che non esiste — il click cade nel `.catch()` e la sonda
  fotografa **la stessa schermata a ogni giro** senza dire niente. Successo il
  01/08: due scatti di sezioni diverse erano tutt'e due il Quadro, e leggendoli
  sembravano prodotto, non banco rotto. Il nome giusto è quello del bottone
  (`nav-mon`, `nav-rep`), e la difesa che costa una riga è **pretendere la prova
  di aver navigato** prima di scattare: quale `.page` ha `display` diverso da
  `none`. Un banco che non naviga risponde «tutto a posto» dopo aver guardato
  una schermata su otto.
- ⚠️ **UN DETTAGLIO CHE FINISCE DOVE IL TESTO È TAGLIATO È TESTO MORTO.** Le
  righe delle liste hanno `-webkit-line-clamp:2`: una frase appesa in fondo
  alla riga di dettaglio **non la legge nessuno**, e nel 01/08 è successo due
  volte lo stesso giorno, in due app diverse (la validità della taratura in
  Sentinella, la ragione di un banco non misurato in Terra) — e in Terra era
  proprio la parte che il principio del fondatore esiste per far leggere. Le
  due uscite giuste: o il dato va in un posto suo (la sezione che lo riguarda,
  o un `form-hint` sotto la riga, che è la forma che Terra usa già nei lotti),
  o non ci va. Si vede solo nello **scatto**.
- Quando si misura qualcosa nel browser, due trappole già pestate:
  `document.elementFromPoint` vive nel **viewport** (un elemento sotto la piega
  risponde `null` e sembra irraggiungibile: va portato in vista), e «questo
  punto è mio» significa l'elemento **o un suo discendente** — accettando anche
  un antenato si misura la riga intera e vengono fuori aree di tocco da 80 px
  che non esistono. E `innerText` su una scheda nascosta ricade su
  `textContent`, quindi il maiuscolo non si vede: va letta la trasformazione
  **effettiva** con `getComputedStyle`.
- Quando un test fallisce dopo un lavoro nuovo, prima di dire che c'è un
  difetto va letto **come il codice si aspetta i dati**: succede spesso che
  sia la prova a indovinare male i nomi dei campi, e una prova sbagliata che
  accusa il codice fa perdere più tempo di nessuna prova. Se invece il test è
  invecchiato perché il prodotto è migliorato, si corregge rendendo
  l'asserzione **più giusta, non più permissiva** (vedi `contiene`).
  ⛔ **E IL 14/08 QUELLA RIGA È STATA PAGATA TRE VOLTE IN UNA NOTTE, SEMPRE
  NELLA STESSA VESTE: UN CSV DI PROVA CON LE COLONNE INDOVINATE.** Non un test
  di suite — una misura fatta a mano per giudicare un lettore, che è il momento
  in cui nessuno si sente in dovere di verificare la propria fixture.
  · `scudo.parseScadenzeCsv`: passate tre colonne dove ne vuole quattro →
    **0 righe su 3**, e stavo per scrivere che il prodotto scartava tutto;
  · `conti.parseFattureCsv`: colonne in ordine diverso → **0 su 4**, con la riga
    valida accusata di non avere l'importo;
  · `sentinella.scartiVolateCsv`: `data;ora;cava` invece di `data;fronte;nFori`
    → il messaggio nominava le righe perse con l'**ora**, e ne ho scritto una
    voce di roadmap **falsa**, poi corretta.
  ⚠️ Il segno è sempre lo stesso e va imparato: **un lettore che scarta TUTTO,
  compresa la riga che hai scritto sana, non è un lettore severo — è un lettore
  a cui hai dato un'altra tabella.** Un difetto vero ne scarta *alcune*.
  La difesa costa dieci secondi ed è una riga sola: **prima di scrivere il CSV
  si apre il lettore e si legge la sua destrutturazione** (`const [a, b, c] =
  parseCsvLine(r)`), che è la sola dichiarazione di quali colonne vuole e in
  quale ordine. Farlo dopo, quando il numero non torna, vuol dire aver già
  scritto un'accusa.
  ⛔ E se l'accusa è già finita in un documento, **si corregge scrivendo la
  correzione, non cancellando la riga**: una riga di roadmap che propone un
  lavoro **manda qualcuno a farlo**, e un difetto immaginario lasciato scritto
  costa un cantiere intero.
  ⛔ **E IL RIGHELLO PIÙ USATO DI TUTTI HA UN MODO DI RISPONDERE «ZERO» SENZA
  AVER CERCATO: LA PIPE SCAPPATA DENTRO `grep -E`.** Trovato il 14/08 da una
  ricerca che riverificava il proprio predecessore. `grep -cE 'a\|b'` **non è**
  «a oppure b»: la barra scappata è un carattere **letterale**, quindi cerca la
  stringa `a|b` e non la trova mai. Provato nei due versi su due righe
  `alfa`/`beta`: pipe vera → **2**, pipe scappata → **0**.
  ⚠️ E il modo in cui inganna è quello che questo file raccoglie da mesi: **non
  fallisce**. Stampa `0` con la stessa faccia con cui direbbe la verità, e in un
  documento di ricerca quello zero diventa un «confermata assente». Era successo:
  la riga diceva «`abbancament|ripristino ambientale` → 0» mentre quel termine
  era **già** nel codice quel giorno.
  La difesa è la stessa di ogni censimento: **si prova il righello su un caso
  che DEVE trovare** prima di credere a uno zero. Un `grep` che non trova niente
  su un termine che sai esserci ti sta dicendo che il comando è rotto, non che
  il codice è pulito.
- ⛔ **REGOLE DI SICUREZZA FIRESTORE — E IL COMANDO SCRITTO QUI NON FUNZIONAVA
  IN QUESTO CONTENITORE.** Misurato l'08/08, e la riga precedente sbagliava due
  volte: dava `emulators:exec … "cd tests && npm test"` (che qui **non parte**)
  e diceva «19 test», che è il conto dell'**SDK**, non delle regole.
  Il comando che gira davvero, e che verifica la **barriera multi-tenant** — il
  requisito fondante, quello fra aziende concorrenti — è:

      cd apps/deepwork-id/tests && npm ci          # una volta per contenitore
      cd apps/deepwork-id && npx --yes firebase-tools@13 emulators:exec \
        --only firestore --project demo-deepwork "cd tests && node run.mjs"

  **75 prove, tutte verdi**, in pochi minuti. E con `--only firestore,auth`
  girano anche `run-sdk.mjs` (**19**) e `run-bootstrap.mjs` (**8**).
  ⛔ **E IL 13/08 QUESTA STESSA RIGA HA SBAGLIATO PER LA TERZA VOLTA, SEMPRE
  NELLA DIREZIONE CHE FA RINUNCIARE.** Diceva `firebase emulators:exec …`, e in
  un contenitore fresco `firebase` **non è installato**: la risposta è `timeout:
  failed to run command 'firebase': No such file or directory`, e chi la legge
  conclude «qui l'emulatore non c'è». È **falso**, e costa due comandi: la CLI
  si prende con `npx --yes firebase-tools@13` (13.35.1, scaricata attraverso il
  proxy senza nessun permesso in più) e `tests/node_modules` va popolata con
  `npm ci`, perché un contenitore nuovo arriva **senza dipendenze installate**
  esattamente come arriva con la **copia superficiale** di git.
  ⚠️ È la stessa famiglia della copia superficiale e — misurata lo stesso
  giorno, a venti minuti di distanza — dell'agente di ricerca che ha dichiarato
  la rete bloccata perché aveva provato con `curl`: **un «non si può» che parla
  dello STRUMENTO e non del mondo**. Tre volte in un giorno, e ogni volta la
  forma è quella di un limite tecnico credibile. La domanda da farsi davanti a
  un comando che non parte è *«manca la cosa, o manca il modo di chiamarla?»* —
  e costa un `which`.
  ⚠️ E il **denominatore** di questa riga, perché non se ne prenda una parte per
  il tutto: rimisurato il 13/08 in un contenitore fresco, regole **75/0**, SDK
  **19/0**, primo avvio **8/0**.
  ⛔ **E LA RIGA CHE STAVA QUI ERA FALSA DA CINQUE GIORNI, NELLA STESSA
  DIREZIONE.** Diceva: *«quello che NON gira qui è l'emulatore delle FUNZIONI, e
  con lui `run-fns.mjs` (21): chiede la rete e la politica del contenitore la
  nega. Quei 21 restano verificabili solo in CI»*. **Non è la rete.** L'emulatore
  delle funzioni parte benissimo; le 21 prove cadevano tutte con
  `functions/not-found` — cioè le funzioni non c'erano, perché
  `apps/deepwork-id/functions/node_modules` era **vuota**. Un `npm ci` lì dentro
  e sono **21 passati, 0 falliti**:

      cd apps/deepwork-id/functions && npm ci     # una volta per contenitore
      cd apps/deepwork-id && npx --yes firebase-tools@13 emulators:exec \
        --only firestore,auth,functions --project demo-deepwork \
        "cd tests && node run-fns.mjs"

  ⚠️ **Quindi il conto vero di ciò che si verifica in casa è 123**, non 102:
  regole **75**, SDK **19**, primo avvio **8**, funzioni **21** — e fra quelle 21
  ci sono le difese che contano di più (un'email non verificata non riscatta
  inviti, un utente anonimo non crea un'organizzazione). Per cinque giorni
  quelle prove sono state considerate «solo CI» **per una cartella vuota**.
  ⛔ La lezione è la quarta della stessa giornata e chiude la famiglia: **un
  errore che nomina una causa plausibile la fa smettere di essere verificata.**
  «La politica del contenitore nega la rete» è credibile, è perfino vero per
  `curl`, ed è **la ragione sbagliata**: nessuno ha riletto quel messaggio
  perché la spiegazione c'era già. Il segno da riconoscere non è il messaggio
  d'errore, è il **verdetto scritto accanto** — «resta verificabile solo in CI»,
  cioè una rinuncia. **Ogni rinuncia scritta in questo file va rimisurata la
  prima volta che si lavora in un contenitore nuovo.**
  ⛔ **E QUELLA RIGA NON È UN DETTAGLIO DI CONTABILITÀ: È IL MOTIVO PER CUI UNA
  PROVA PUÒ ESSERE VERDE IN CASA E ROSSA IN CI.** Misurato l'08/08 e costato un
  commit rosso in cima al branch. Avevo aggiunto a `run-bootstrap.mjs` due prove
  sul primo avvio: verdi qui, cadute in CI. La causa non era la prova né il
  codice — era che **le due esecuzioni non hanno gli stessi scrittori**. Le
  rivendicazioni le scrivono in due, `bootstrap-owner.mjs` e il trigger
  `onMemberWrite` → `rebuildClaims`; quest'ultimo vive nell'emulatore delle
  funzioni, che **qui non parte**. Cioè in casa avevo misurato un mondo con un
  solo scrittore, e avevo scritto un'asserzione sullo **stato finale** che in
  quel mondo era dello script e nell'altro no.
  La regola pratica: **sotto l'emulatore, prima di scrivere un'asserzione su uno
  stato, si chiede chi altro lo scrive in CI** — e se la risposta è «un trigger»,
  quell'asserzione lì non ci va. Il contratto di una funzione pura si prova con
  dei finti e senza emulatore, e allora la risposta è la stessa nei due posti
  (`tests/bootstrap-rivendicazioni.mjs`). È la variante dell'ambiente che misura
  sé stesso invece del prodotto, con l'aggravante che il verde di casa **sembra**
  la stessa suite che gira in CI: stesso nome, stesso file, due prove diverse.
  ⚠️ La lezione oltre al caso: **un comando scritto in un file di istruzioni è
  una promessa, e le promesse invecchiano.** Quel `58` sulle regole di
  sicurezza stava in tre documenti e valeva **68** perché nessuno lo lanciava
  più in casa — sul numero che riguarda la sicurezza, per giunta.
- Verifica visiva pagine: server statico locale + screenshot
  (Playwright/Chromium preinstallato). Gli screenshot vanno **guardati**, non
  solo prodotti: nella giornata del 29/07 un campo scomparso, una miniatura
  illeggibile e un'unità di misura stravolta dal maiuscolo sono stati trovati
  così, e nessuno di quei difetti si vedeva leggendo il codice.
  ⛔ **MA UNO SCATTO PROPONE, UNA MISURA DECIDE — e la regola qui sopra è
  esattamente ciò che rende facile dimenticarlo.** Misurato il 07/08 e costato
  due documenti: un cantiere, guardando lo scatto di Conti a 430 px, ha
  riferito che le etichette della barra in basso erano tagliate — «QUADR»,
  «ATTUR», «BANCA», «ORDIN» — e io l'ho riportato in **due checkpoint senza
  rimisurarlo**, perché veniva da uno scatto e in questa casa gli scatti sono
  lo strumento di cui ci si fida. Rimisurato: **164 voci a 430, 390, 360 e 320
  px su sei app, ZERO parole più larghe della loro colonna**; e il banco che lo
  sorveglia lo spiegava già nella sua intestazione — la colonna è una frazione
  della griglia e **cresce con l'etichetta**, quindi tagliare non è nemmeno
  possibile. Il difetto non c'era.
  La regola «niente entra sulla parola dell'agente» vale **anche quando la
  parola è accompagnata da uno scatto**: un'immagine piccola e antialiasata è
  una fonte di **candidati**, come una ricerca. Il costo di rimisurare era di
  cinque minuti.
  ⚠️ E la prima sonda scritta per rimisurare ha sbagliato soggetto, con lo
  stesso segno di sempre: cercava `.nav button span` e trovava l'**icona** —
  20 px su 19, in tutte e sei le app — cioè un difetto **finto, identico
  dappertutto**, che è il modo in cui si riconosce di stare guardando il
  righello invece del soggetto. La parola di quella barra è un **nodo di testo
  nudo** dentro il bottone: si misura con un `Range`, e `querySelectorAll` non
  la vede (è la scatola anonima, la stessa famiglia del traboccamento a 320 px
  del core).
- ⚠️ **NON SI INIETTANO DIFETTI MENTRE GIRA UN GIRO DEL BROWSER.** Per provare
  che un controllo sappia fallire si rimette il difetto nel file vero e si
  ripristina subito: giusto, ed è la regola qui sopra. Ma se il file è un
  **modulo dati** (`apps/<nome>/<nome>-data.js`) o una **pagina**, quelle stesse
  righe se le carica il browser — e se un banco apre la pagina dentro la
  finestra d'iniezione, il suo risultato è **falso**, in un verso o nell'altro.
  Il 01/08 è successo: un giro a 19 banchi è stato buttato per questo. Le
  iniezioni sui file di **test** (`run-stile.mjs`, `run-kpi.mjs`) restano sicure,
  perché nessuna pagina li importa. Finché gira un giro: si lavora su `docs/`,
  `vault/` e le suite `node`, e le iniezioni sui moduli si aspettano.
  ✅ **E dal 01/08 la regola serve molto meno, perché il giro non serve più la
  cartella viva.** `tutti.mjs` crea una `git worktree` temporanea e serve
  QUELLA: la copia è immobile per costruzione, quindi si può continuare a
  lavorare mentre il giro cammina. La difesa che fermava il lavoro era una
  difesa, non una soluzione — e una regola che chiede di non lavorare per due
  ore viene violata (due volte in due giorni, la seconda da chi il giorno prima
  aveva scritto il paragrafo). ⛔ La trappola che la copia introduce è
  dichiarata, non nascosta: una worktree su `HEAD` contiene il **committato**,
  quindi il giro **scrive su cosa sta girando** — in cima E in fondo — ed
  elenca i file non committati, che altrimenti resterebbero fuori da un verde
  che sembra riguardare quello che hai su disco. Provato da
  `tests/browser/giro-su-copia.mjs` su tutt'e due i versi. Piano:
  `docs/PIANO_GIRO_SU_COPIA.md`.
  ✅ **E dal 04/08 non è più solo scritta qui: è un controllo.** Perché questa
  regola, scritta e col suo racconto, è stata **violata due volte in due
  giorni** — la seconda dal cantiere che il giorno prima aveva scritto il
  paragrafo. `tutti.mjs` prende l'impronta dei file che le pagine caricano
  prima del giro, **dopo ogni banco** e alla fine: se qualcosa cambia il giro
  **dichiara sé stesso NON VALIDO** (uscita `2`) e dice **dopo quale banco**,
  invece di stampare un riepilogo verde. Test e documenti si possono modificare
  senza far scattare niente — se no il controllo verrebbe spento al secondo
  giro. Controprovato su due piani: il rilevatore (`impronta.mjs
  --controprova`, 6 prove) e il **collegamento** al giro (`impronta-giro.mjs`,
  7 prove, su una radice finta) — perché una guardia scollegata non è un errore
  di sintassi, esattamente come il `<script>` dimenticato.
- ⚠️ La cartella scratchpad è **condivisa** fra i cantieri paralleli: ogni
  agente deve creare una propria sottocartella, altrimenti si sovrascrivono i
  file di prova a vicenda (è già successo più volte).

## Contesto di progetto

- ⛔ **QUESTO REPOSITORY NON È IL PUNTO ZERO DEL PROGETTO, e in git non si
  vede.** L'app — il core `index.html` compreso, con i suoi dati d'esempio — è
  stata costruita da Claude in **conversazioni precedenti**, fuori da qui; il
  fondatore l'ha poi portata dentro creando il repository il 18/04/2026. Questa
  sessione (il controllo remoto) è **l'evoluzione di quel lavoro**, non un
  progetto nuovo che eredita codice altrui.
  ⚠️ La trappola concreta, già pestata il 02/08: `git log` attribuisce tutto a
  `gius77gf`, perché **git registra chi committa, non chi scrive**. Chi legge
  la storia e ne deduce «questo pezzo non l'abbiamo fatto noi» sbaglia, e
  rischia di dirlo al fondatore come se fosse una smentita. Prima di attribuire
  qualcosa in base a `git log`, ricordarsi che la firma è di chi ha premuto
  invio, non di chi ha scritto la riga.
- Vault Obsidian di visione/ricerca: repo gius77gf/ecosistema-vault
  (mappa ecosistema, roadmap generale, schede delle 6 app, wiki
  ricerca competitor).
- Genesi vive in apps/genesi (spostata dal vecchio repo genesi-app,
  che resta solo come archivio storico).
- Deepwork ID (apps/deepwork-id/ARCHITETTURA.md) è la Fase 0: tutte le
  app dipendono da lui per login/abbonamenti/isolamento.
