# Checkpoint — 2026-08-08 16:13 UTC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`6521dfe` — test(browser): il ponteggio che mancava

## Che cosa è stato completato
Il **ponteggio** che serve alla parte che resta della 5b, il **lavoro senza
rete**: la coda offline di Firestore vive nel **browser** e in `node` non si
misura. Ma qui una pagina non può caricare Firebase da **gstatic** — la rete non
c'è, ed è la ragione per cui il core non si apre in locale e per cui esiste
`finto-firebase.mjs`. Il finto però **non ha un database vero**: sulla coda non
può dire niente.

**Misurato invece che dedotto**: i bundle pronti per il browser stanno **già** in
`tests/node_modules/firebase` — sono gli stessi che gstatic serve. Si importano
fra loro con URL assoluti di gstatic, e **quella è l'unica cosa da cambiare**:
riscritti su percorsi locali, la pagina li carica e l'SDK **parte davvero**.
Si rigenerano a ogni giro invece di essere committati (800 KB, e una copia
committata invecchierebbe rispetto al pacchetto).

**Esito: `RIFIUTATO: permission-denied`.** È **l'esito buono**, e sta scritto
nel file perché non si legga al contrario: l'SDK vero è partito nel browser, ha
raggiunto l'emulatore, e le **regole** hanno respinto una scrittura senza
login — che è quello che devono fare.

## ⚠️ Due cose imparate scrivendolo, tutt'e due già note a questa casa
- `playwright` **non è risolvibile dal progetto**: sta in `/opt`, e gli altri
  banchi lo importano **per percorso**. Ho scritto `from "playwright"` e non
  partiva;
- il mio serverino mandava l'intestazione **200 prima di leggere il file**,
  quindi su un file mancante il `catch` provava un 404 su un'intestazione già
  spedita (`ERR_HTTP_HEADERS_SENT`): il banco moriva **per il suo server**
  invece che per il soggetto. Adesso **legge, poi scrive**.

Col **contrassegno del pid riletto dal server**, come pretende la regola di casa
per ogni banco che alza una porta.

## Prossimo passo atomico
Chiudere la 5b: **autenticarsi** (emulatore auth + un token con le
rivendicazioni giuste), **scrivere dentro l'organizzazione**, e **staccare la
rete** con `context.setOffline(true)` — poi riattaccarla e guardare che cosa
arriva, con **due schede**. Il ponte c'è; da qui è mestiere.

## Stato
**Venti unità** oggi, tutte committate e spinte, CI verde.
⏳ Il giro del browser (PID 16670) è ancora vivo e attesta `c3888fe`: nessuna
unità di oggi è dentro.

## Blocchi
Nessuno.
