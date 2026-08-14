# Checkpoint — 2026-08-10T04:07:05Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`65bee55` — *test(conti): il punto dove nessun banco premeva, e sotto c'erano
220 euro*
(canarino del ciclo: `671cc77`)

## Che cosa è stato fatto

**La correzione c'era da ieri, mancava chi la tiene chiusa.** Il netto della
pesata con un peso **assente** tornava il lordo intero (`rl.ok ? rl.valore : 0`)
e il riquadro dichiarava **€ 503,75** dove il vero è € 283,65.
⚠️ Una prova pura non poteva tenerla: `nettoPesata` **non è cambiata**, è giusta
com'è. Il difetto stava nella **pagina** — la famiglia «le prove chiamano il
modulo e i file li compone la pagina». Si prende solo premendo i tasti.

Nessun file nuovo: il banco di Conti c'era già e **non guardava lì**. Adesso
prova **quattro stati** del modulo pesata — senza tara, senza lordo, coi due,
intonso — con **otto asserzioni**: da **20 a 28 ok**.
La controprova rimette il difetto in **due pezzi** e riproduce i numeri esatti
del racconto: con la tara vuota il netto torna **«32,50»** (si fattura anche il
camion), col lordo vuoto il campo si riempie da solo di **«0,00»** — la forma
peggiore dello zero inventato, perché sta **dentro** un campo e sembra scritto
da qualcuno.
⛔ **E due delle otto NON cadono col difetto dentro, di proposito**: sono la
metà che dichiara il contratto che *non* doveva cambiare (coi due pesi il netto
resta 18,3; sul modulo intonso il riquadro **tace**). Un banco in cui cadono
tutte non distingue «non calcola» da «non calcola mai» — e un avviso
all'apertura di un modulo vuoto sarebbe rumore, non una difesa.

### E il censimento delle tre superfici che nessuno aveva guardato
Con lo stesso comando delle altre cinque app: **core 54 clamp (8 sospetti),
Campo 30 (21), Scudo 14 (7)** — **98 e 36**. Scritto in roadmap come
**B0-duodecies**, e scritto **con il suo rapporto vero accanto**: sulle altre
cinque app 48 su 52 erano legittime, cioè meno di una su dieci era un difetto.
✅ **Due già lette e assolte, con la ragione**, così nessuno le rifà: la
`giornateAssenza` di Scudo *sembra* la forma del difetto di Conti
(`vuoto ? 0 : …`) ed è il contrario — il vuoto si controlla **prima** di
convertire e i due significati sono separati per tipo (near-miss → 0,
infortunio → `null`), cioè è la **decisione 17** già costruita.

## ⚠️ Un mio errore di procedura, senza danno ma da non ripetere
Ho incatenato `commit` **dopo** la suite senza leggerne l'esito, e la suite
diceva **6 falliti**. Non erano miei: sul disco stanno scrivendo tre cantieri, e
`run-kpi` era mid-edit («4 moduli letti invece di 5»). Il committato,
rimisurato su una **copia di HEAD**, dà **41 passati, 0 falliti**.
Il danno è stato zero **per fortuna**: la regola di `CLAUDE.md` — *il messaggio
del commit si scrive DOPO aver letto l'esito* — vale anche per il comando che lo
precede nella stessa riga di shell. Una catena `&&` non è una lettura.

## Verifica
Giro sulla **copia di ciò che si committa**: **34 comandi a posto, 0 caduti**,
**2828** asserzioni, e il controllo nuovo conferma che i due documenti che
dichiarano quel numero dicono lo stesso.
Banco di Conti: sana **28 ok / 0 KO**; controprova **17 ok / 12 KO**, uscita 0.

## Stato roadmap
Chiuse: B0-quinquies, B0-sexies, B0-octies, B0-nonies, B0-undecies (con il suo
banco), B3-bis, B3-ter.
Aperte: **B0-decies** (il recettore di Genesi), **B0-duodecies** (i 36
candidati di core/Campo/Scudo), **B4-bis** (le tendine del core), **B0-bis**,
e **B0-septies** che resta ferma al fondatore.

## Prossimo passo atomico
Raccogliere i **tre cantieri vivi** — tendine del core, recettore di Genesi,
numero uno in Flotta e Sentinella — uno per volta: rimisurare le loro
affermazioni, mettere nell'indice **solo** i file di quel cantiere, verificare
sulla **copia** (`git worktree add --detach HEAD` + `git diff --cached | git
apply` + `add -A`), commit, checkpoint.
⚠️ E prima di ogni commit leggere **l'esito** del giro, non incatenarlo: se
`giro-node` dice che i documenti dichiarano un altro numero, si corregge il
documento col numero **stampato**, non con quello previsto a mente.

## Blocchi
Nessuno tecnico. Fermi al fondatore: **B0-septies** e le **soglie di sicurezza**
(`ppvLimit`, curve USBM/DIN).
