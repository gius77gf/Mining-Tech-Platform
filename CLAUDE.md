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
   sono datati avanti**, fino a cinque giorni. Effetto: chi ordinava per nome
   apriva un file **più vecchio** di quello vero credendolo il più fresco, e non
   se ne accorgeva — perché una risposta la regola la dà sempre.
   Il comando che risponde giusto, e che stampa anche i due candidati a
   confronto: `node apps/deepwork-id/tests/date-checkpoint.mjs`.
   La stessa suite impedisce che il difetto si riformi: un checkpoint **nuovo**
   non può essere datato dopo il giorno in cui entra in git. Il lascito è
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
  (`ponteScudo` in Sentinella). La barriera vera, provata da 58 test, è quella
  fra **organizzazioni**. Le due cose non vanno raccontate come se fossero la
  stessa: se un giorno servirà «chi lavora in cava non tocca i documenti di
  sicurezza», non è un problema di `appId`, è la decisione aperta sui **ruoli**
  dentro l'organizzazione.
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
  ⚠️ E il corollario sugli elenchi: `UI_CONDIVISA` di `run-stile` aveva **sei**
  nomi scritti a mano mentre la struttura condivisa ne espone **dieci**. Un
  elenco a mano non poteva accorgersi di `chiediDati` — **non sapeva nemmeno
  che quel nome esistesse.** Ora è derivato da `window.X =` del file condiviso.
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
  tolta anche dalle liste che la propongono**, se no rinasce da sola. Qui a
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
- Regole di sicurezza Firestore: `cd apps/deepwork-id && firebase
  emulators:exec --project demo-deepwork "cd tests && npm test"`
  (richiede firebase-tools + Java; 19 test, devono passare tutti).
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
