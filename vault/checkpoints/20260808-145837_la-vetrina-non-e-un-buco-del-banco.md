# Checkpoint — 2026-08-08 14:58 UTC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`3e7eda6` — test(modali): «non ci sono arrivato» e «non c'è niente da aprire»

## Da dove è nata
Da una riga del giro in corso, letta **prima dei KO** come vuole la regola:
«vetrina: **NON RAGGIUNTA** — zero comandi cliccabili. Il banco non ci è
arrivato: accesso, navigazione o selettore».

## Che cosa era
Misurato aprendo `apps/index.html`: **zero** `<button>`, zero `onclick`,
zero `<summary>`, zero `role=button` e **zero modali**. Quattro `<a href>`
e basta. È una **vetrina statica**: non c'è niente da aprire **per
costruzione**.

Cioè il banco stampava, sulla pagina che il fondatore apre **per prima** davanti
a qualcuno, la stessa diagnosi che sul core è già costata **due giorni** di
caccia al selettore (`301b5b7`).

Il banco distingueva già **due** diagnosi — «non ci è arrivato» e «ci è arrivato
e non c'era niente» — e il commento che le separa spiega bene perché: portano a
due lavori opposti. Mancava la **terza**, che non è nessuna delle due. Il conto
dei candidati non le separa (lì è zero in tutt'e due i casi); il numero che le
separa è **quante modali il programma di quella superficie contiene**, e il
banco ce l'aveva già in mano.

⛔ Perché conta più di quanto sembri: queste righe sono quelle che questo
repository legge **prima dei KO**. Una riga che accusa il banco dove non c'è
niente da accusare **insegna a non leggerle** — ed è il modo più veloce di
perdere il controllo più prezioso che c'è.

E il **denominatore** non è più falsato: la vetrina non finisce fra le «non
raggiunte» (0 su 0, più 1 senza modali per costruzione).

## Verifiche — controprova nei due versi, su un server mio a parte
- `--solo=vetrina` → la riga nuova, e il conto separato;
- `--solo=terra` → **22 modali aperte, 1 superficie su 1**, e la riga nuova
  **non** compare: il ramo non ingoia una superficie vera;
- giro `node` **27/27** sulla copia di ciò che si committava (patch identica).

## ⚠️ Un mio errore, agli atti
Per controllare la sintassi ho usato un `import()` — e quel modulo **al solo
import esegue**: ha fatto partire il banco, e l'ho fermato con un `pkill`
**mentre il giro lungo era in corso**. Verificato che il giro **non è stato
toccato**: due sole intestazioni «dentro le modali» (sana e controprova),
nessuna riga «NON HA FINITO» né «NON È STATA MISURATA».
La lezione: **un modulo che al solo import esegue non si controlla con un
import** — si usa `node --check`.

## Prossimo passo atomico
**Gli elenchi con `runTransaction`** (nove punti rimasti della 5b), partendo da
`letture` di Sentinella: due import sullo stesso punto di monitoraggio ne
perdono uno, e quelle letture finiscono nel report per l'ARPA. Prima va capito
come il livello dati espone una transazione — oggi **non la espone**: è una
**firma da allargare**, non una copia da fare.

⏳ E il **giro del browser** (PID 16670, ~3h25) è ancora vivo e sta scrivendo:
quando finisce, `leggi-giro.mjs`, **sezione 1 prima della 2**.
⚠️ Attesta `c3888fe`. ⚠️ Il rosso di una controprova è il verde del banco.
⚠️ Il giro in corso NON contiene questa correzione: la sua riga sulla vetrina
sarà ancora quella vecchia.

## Blocchi
Nessuno.
