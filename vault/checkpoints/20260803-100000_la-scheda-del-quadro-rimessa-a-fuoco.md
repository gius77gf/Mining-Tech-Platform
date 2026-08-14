# Checkpoint — la scheda del Quadro rimessa a fuoco

**Commit:** `c0f06f5` e `f2f6eb6`
**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`

## Perché questa unità

Il prossimo lavoro grosso è **«Il Quadro»**: l'hub che oggi è solo un
elenco di collegamenti diventa il cruscotto che il titolare guarda alle 7
del mattino. Il progetto sta in `docs/RICERCA_CRUSCOTTO_TITOLARE_202607.md`
ed è fatto bene.

Ma quella scheda è stata scritta **prima** di due settimane di lavoro sulle
app. Prima di costruirci sopra l'ho riletta con in mano il codice di oggi,
chiamando le funzioni una per una invece di fidarmi. **Quattro dei suoi
«oggi non si può» sono invecchiati.**

Una scheda che resta indietro non è un documento vecchio: è un documento
che fa **progettare intorno a limiti che non esistono più**. Il danno
sarebbe un cruscotto più povero di quello che possiamo fare — ed è la
stessa famiglia del numero invecchiato in un documento, che questa
giornata ha già inseguito due volte.

## I quattro limiti che non ci sono più

**1. Il tempo di incasso.** La scheda diceva: niente DSO, Conti non sa
*quando* una fattura è stata incassata. Adesso lo sa — data vera, acconti
multipli compresi — e `tempoMedioPagamento()` dà i **giorni medi fra
emissione e saldo** più i giorni medi **oltre la scadenza**. È meglio del
DSO classico, non peggio: il DSO è una **stima** (credito diviso fatturato
di periodo), questo è una **misura**. Con la regola di onestà già coperta
da prove: le fatture incassate **senza data** restano fuori dalla media e
si contano a parte.

**2. I mezzi (T3).** Diceva «senza andamento: Flotta fotografa lo stato di
adesso e non lo storicizza». Adesso registra una **fotografia al giorno** e
— quello che conta di più — i **fermi** come fatti con inizio, fine e
causale, da cui esce la disponibilità **reale** (giorni-macchina persi su
disponibili). Due cose da tenere per la tessera: «adesso» e «sui 30
giorni» sono **due numeri diversi** e vanno etichettati come tali; e i
giorni **senza registrazione** non valgono «tutto operativo» — c'è
`giorniSenza` apposta per poterli scrivere.

**3. Il costo per tonnellata (T8).** Diceva «i costi di Flotta non hanno
una data». Ce l'hanno: `costiPerMese()` li raggruppa per mese di
competenza, le voci senza data vengono **dichiarate** invece che
attribuite a oggi, e un mese senza registrazioni **non è un mese a zero
euro**. Resta aperta solo l'altra metà: il legame col sito, quando i siti
sono più d'uno.

**4. L'autorizzazione (T6).** Diceva «la scadenza dell'atto non esiste in
Terra». Adesso c'è lo **scadenzario del titolo**, con i tipi tipici da
scegliere invece che da digitare e **nessuna periodicità cablata** (è
materia regionale). Per la tessera vuol dire che *«quanti anni mi restano»*
può dire **due** cose invece di una: gli anni di **materiale** e gli anni
di **titolo**. E la più corta delle due è quella che conta — è
esattamente il genere di cosa che un gestionale generalista non dice mai.

## Cosa NON è cambiato, ed è giusto così

La scheda resta prudente dove deve: **indici infortunistici** (servono le
ore lavorate, che nessuna app registra) e **OEE**. Non li mettiamo e non li
promettiamo. E il numero della sicurezza **non diventa mai rosso**: un
contatore a zero è un lutto, non un allarme da cruscotto.

## Stato del giro del browser

Ultimo banco dei diciannove (`bersagli · controprova`), in corso.

## Prossimo passo atomico

Appena finisce il giro: le **tre correzioni** già pronte e verificate
(`scratchpad/numeri-doppi/tutto.sh` le lancia in fila), le prove di
**identità**, la **regola 16** dello stile, e `nomi-doppi.mjs` in coda alla
CI.

Subito dopo, con la scheda rimessa a fuoco: **Il Quadro**, tessera per
tessera, partendo dalle sei sopra la piega.

## Nessun blocco

Restano aperte le decisioni del fondatore in `DECISIONI_WEEKEND.md`
(punti 5a/5b, 10, 11, 12, 13, 14).
