# Checkpoint — 2026-08-08T07:06:48Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
3177317

## Che cosa è stato completato
**Il sollecito di pagamento e l'estratto conto di Conti uscivano negli appunti
senza dichiarare di essere una dimostrazione**, e la dichiarazione della
dimostrazione sui testi che escono è salita in `shared/`.

### Come è saltato fuori: leggendo le righe «non ho guardato»
Il registro del giro del browser ha **49** righe di quel tipo e **4** KO. La
regola dice di leggere le prime PRIME, e qui ha reso: fra quelle c'era
«NON MISURATE: conti — copiano negli appunti ma non hanno una riga in COME.
Non vuol dire «a posto»: vuol dire che nessun bottone è stato premuto.»
Il banco lo diceva in fondo a un riepilogo verde da giorni.
Premuti i bottoni: **due testi nudi**. Sono quelli che una persona incolla in
un'email e manda a un cliente per chiedergli soldi, con la mora ex D.Lgs
231/2002 calcolata. Un file scaricato porta il marchio nel nome, un foglio
stampato in testata: un testo incollato in un'email non ha né l'uno né l'altro.

### Non era una svista isolata: era una firma troppo stretta
`avvisoEsempioTesto` era scritta **due volte con due comportamenti diversi** —
Campo restituiva il PREFISSO e scriveva `*** … ***`, Scudo AVVOLGEVA e scriveva
`[…]` — e la terza app che ne aveva bisogno non ce l'aveva affatto. Adesso
`avvisoTestoDimostrazione(modoRisolto, cosa)` sta in
`shared/deepwork-id-client/dw-shell.js` e le tre app la ri-esportano col nome
di casa. Il `cosa` è l'argomento che toglie la copia: la frase cambia col
documento e **resta di ognuna**.
⛔ Prende il modo **già risolto**, e non è comodità: `modoDimostrazione`
traduce «live» in `null` e qualunque altra cosa — compreso `null` — in una
stringa **vera**. Risolvendolo due volte, un dato REALE tornerebbe a essere una
dimostrazione: la marcatura comparirebbe proprio sul sollecito vero mandato a
un cliente vero, che è **peggio** del difetto che si chiude.

### Il banco: da un bottone per app a una lista
La firma stretta costringeva a scegliere quale delle due uscite di Conti
misurare, cioè a lasciarne una fuori dal riepilogo — proprio la cosa che quel
banco esiste per non fare.
| | prima | dopo |
|---|---|---|
| passata sana | 7 prove | **19** |
| uscite raggiunte | 1 su 1 descritta | **3 su 3** |
| controprova | 2 KO voluti | **8** |
| dato vero (`--live`) | — | 13 prove, testi puliti |
L'iniezione ha cambiato bersaglio: spegne la funzione in `shared/` invece che
la copia di ogni pagina, quindi copre tutte le app **insieme**.

### Due prove esistenti sono cadute, e avevano ragione tutt'e due
1. il conto dei «vestiti» è scritto a mano **di proposito**, come sveglia: chi
   lo alza deve dire quale ha aggiunto. **6 → 7**, ed è la riga in testa ai due
   testi di Conti. Ha funzionato esattamente come progettata;
2. «in `shared/` la decisione, non il vestito» cercava la stringa «DATI DI
   ESEMPIO» e basta. Corretta rendendola **più stretta, non più permissiva**:
   ora pretende che **nessuna delle quattro frasi** delle app sia salita lassù
   (prima ne sorvegliava una sottostringa generica) e che il **marchio** invece
   ci sia.

## Verifica
· copia di quello che si committa (worktree + patch dello staged + `git add
  -A`, confronto patch-a-patch **identico**): **23 comandi, 0 caduti**;
· giro completo **2.596** asserzioni, misurate sommando le righe «Risultato»;
· i tre versi del banco degli appunti girati a mano: sana 19/0, controprova
  11/8 (voluti), dato vero 13/0 con 4 iniezioni e 0 mancate;
· `numeri-nei-documenti` caduto e riallineato: 2.324 → **2.326**
  (run-kpi 1890 → 1892).

## Stato roadmap
Due unità chiuse di fila sulla stessa vena: **un controllo che dichiara di non
aver guardato è materiale di lavoro, non rumore**.

## Prossimo passo atomico
Il giro del browser (PID 28054, ~4h) attesta un commit **precedente**: quando
finisce, rileggerlo con `leggi-giro.mjs` e confrontare la **sezione 1** con
quella già letta — i 4 KO sono tutti noti e chiusi (tre erano difetti di banco,
il quarto l'unità delle unità nude). Poi la riga cieca più grossa rimasta:
**«234 classi con un fondo proprio non sono mai comparse durante il giro: 41
fatte comparire e misurate»** nel tema scuro (e 120 con 13 in ciascuno degli
altri due temi). È lo stesso schema di oggi — un banco che dichiara il proprio
denominatore e nessuno lo legge — ed è il candidato con il rapporto
misurato/dichiarato peggiore di tutto il giro.

## Blocchi
Nessuno.
