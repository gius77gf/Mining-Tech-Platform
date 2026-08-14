# Checkpoint — 2026-08-08T10:15:40Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
60d55ce

## Che cosa è stato completato
**La correzione della mia diagnosi di un'ora prima**, e una cosa vera trovata
strada facendo.

La guardia `funzioni-mai-usate.mjs` dichiarava **DA COLLEGARE** due funzioni,
«frasi che il prodotto calcola e non mostra a nessuno». Aprendo il codice delle
pagine — cioè facendo la cosa che questo repository chiede **prima** di credere
a un elenco — tutt'e due le etichette erano sbagliate:
· `descriviPotenziale`: la riga del near-miss mostra **già** la gravità
  potenziale come pastiglia in testa al nome, col titolo «Se fosse andata
  male: …» e la possibilità di cambiarla toccandola. È una forma **migliore** di
  una frase in coda, che il `line-clamp:2` taglierebbe;
· `descriviScaglione`: la pagina ha `spiegaScaglioneRiga`, che dice la stessa
  cosa **e in più** separa le due metà dello sconto. E lavora su un oggetto
  **diverso**: la riga salva uno scatto appiattito, non il risultato di
  `scaglionePer`.

⛔ **La lezione, ed è quella che conta:** «mai chiamata» **non vuol dire
«manca»**. Vuol dire che qualcuno l'ha riscritta meglio, o che è stata superata.
La guardia serve a **fare quella domanda**, non a rispondere da sola — ed è
esattamente la regola «niente entra sulla parola dell'agente», con l'agente che
questa volta ero io, un'ora prima.
⚠️ E il mio errore aveva la firma tipica: ho giudicato **dal nome della
funzione** e dal fatto che non fosse chiamata, senza aprire la pagina. Cinque
minuti di lettura l'avrebbero smentito, come i cinque minuti di rimisura del
07/08 sulle etichette «tagliate» di Conti.

## La cosa vera uscita lo stesso
L'intestazione di `descriviScaglione` dichiarava di essere «il posto in cui la
bandiera `calcolabile` viene **LETTA** (regola 20 di run-stile)». **Non lo è**:
la pagina non la chiama mai, e quella bandiera la legge in **otto** punti suoi.
Il verdetto reggeva e la **prova** era scaduta — la quarta forma di
invecchiamento — ed è il caso peggiore, perché chi si fida di quella riga crede
protetto un punto che protegge qualcun altro. Corretta con la misura; la regola
20 resta verde (5 prove), perché il lettore vero c'è: non era quello dichiarato.

## Verifica
· copia di quello che si committa, confronto patch-a-patch identico: **25
  comandi, 0 caduti**;
· `run-stile` 314/0, con le cinque prove della regola 20 verdi;
· la guardia ora dice «6 dichiarate, di cui **0** da collegare».

## Stato roadmap
Quinta unità del blocco. Il filo delle cinque: **un controllo che dichiara
quello che NON ha guardato è materiale di lavoro** — e quando produce un
elenco, quell'elenco va aperto uno per uno prima di crederci.

## Prossimo passo atomico
Restano **57 classi «non giudicabili fuori dal loro posto»** nel banco del
contrasto (fondi davvero semitrasparenti). La strada e la resa sono già
**misurate**: comporle sulle superfici che l'app dichiara (`--bg`, `--card`,
`--card2`), tenere il **caso peggiore** e stampare la **forbice**; su sei app
17 classi diventano misurabili e **1 sola** cade sotto soglia
(`terra .avatar.ico.danger`, 3,88 nel caso peggiore, forbice 1,02).
Il cantiere vale poco e va aperto sapendolo — non aspettandosi un secondo
filone come quello di stamattina.
Alternativa con resa ignota, quindi da **misurare prima**: prendere le altre
sedici famiglie di banchi che filtrano per visibilità (18 su 76 lo fanno) e
chiedersi, una per una, se la stessa domanda ha una forma **statica** che
raggiunge ciò che il filtro esclude — è la domanda che stamattina ha reso sette
difetti sulle unità di misura.

## Blocchi
Nessuno.
