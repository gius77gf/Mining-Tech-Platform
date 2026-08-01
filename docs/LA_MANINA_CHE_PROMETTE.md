# La manina che promette un tocco che non c'è

*Censimento del 01/08/2026, nato smontando i due fogli condivisi (E0). Misura
una cosa sola, in tutte e sei le app: **una riga che mostra la manina fa
davvero qualcosa se la tocchi?***

## Perché è un difetto di prodotto, non di stile

Il cursore a manina è una **promessa**: dice «questa riga si tocca». Quando non
è vera, chi la tocca non pensa «la riga è ferma» — pensa di aver **sbagliato
mira**, e riprova. In un elenco lungo di scadenze o di documenti, riprovare due
volte su una riga morta è il momento in cui l'app sembra rotta.

È lo stesso principio dell'assenza-che-non-è-un-dato-favorevole, spostato
sull'interazione: **un segnale tranquillo dove non c'è niente**.

## Come si misura

Non guardando le classi — ogni app le chiama a modo suo — ma **il cursore
calcolato** contro **l'aggancio vero della riga**, sezione per sezione, nel
browser. «Aggancio» ha **tre** forme, e la terza me l'ero persa alla prima
passata:

1. un `onclick` sull'elemento;
2. un `data-…` su cui la pagina ha una delega;
3. essere una **`<label>` con dentro un controllo** — cliccabile per natura,
   senza che nessuno le attacchi niente.

⚠️ Senza la terza, Conti risultava avere otto righe che promettono e non
mantengono, e non era vero: erano `<label>`. Una conclusione sbagliata a un
passo dall'essere scritta. Il segno che il controllo non sa riconoscere tutto
quello che cerca è sempre lo stesso: **un numero che non torna col sorgente**.

Un aggancio **dentro** la riga (il bottoncino `›`) non conta: lì il bersaglio è
il bottone, e la sua manina ce l'ha per conto suo.

## Lo stato misurato

| app | voci | promettono e non mantengono | fanno e non lo dicono |
|---|---|---|---|
| campo | 32 | **0** | 0 |
| flotta | 68 | 3 → **0** | 0 |
| terra | 46 | 2 → **0** | 0 |
| conti | 126 | 111 → **0** | 0 |
| sentinella | 39 | 25 → **0** | 0 |
| **scudo** | 118 | **91** | 0 |

Nessuna app ha il difetto opposto (una riga viva che non lo dice).

## Sei app, cinque convenzioni diverse

E qui c'è il problema vero, che le correzioni qui sopra non risolvono:

| app | come dice «questa riga si tocca» |
|---|---|
| campo | `.item{cursor:pointer}` + `style="cursor:default"` sulle ferme |
| flotta | `.item{cursor:pointer}` + classe **`.statico`** sulle ferme |
| terra | `.item{cursor:pointer}` + `style="cursor:default"` sulle ferme |
| conti | `.item{cursor:default}` + classe **`.tap`** sulle vive |
| sentinella | `.item{cursor:default}` + classe **`.cliccabile`** sulle vive |
| scudo | `.item{cursor:pointer}` per **tutte**, e nient'altro |

Due filosofie opposte (parti ferme e marca le vive / parti vive e marca le
ferme), tre nomi diversi, due modi di scriverla. È esattamente la forma che
`CLAUDE.md` chiama per nome: *una regola che serve a due app vive in `shared/`*,
e riscriverla è il difetto che è già costato una giornata con la convenzione sui
numeri.

Il costo si è già visto due volte, in piccolo: in **Flotta** la stessa lista di
scadenze è resa in due punti, e uno dei due si era dimenticato `.statico`; in
**Terra** le righe ferme portano `style="cursor:default"` in quattro punti su
cinque.

## Che cosa farne

1. **Scudo** è il caso grosso e non va corretto copiando a occhio: 27 righe vive
   su 118, riconoscibili da un `data-…` sulla riga. Va deciso **con quale
   convenzione**, e la decisione riguarda tutti.
2. **Una convenzione sola, in `shared/dw-app-ui.css`.** Il verso giusto è
   «parti ferme e marca le vive»: una riga che non fa niente è il caso normale,
   e dimenticare di marcare una riga viva si vede subito (non si accende),
   mentre dimenticare di marcare una riga ferma **non si vede** — è il difetto
   di oggi.
3. **Un controllo che lo tenga fermo**, nella forma già usata dagli altri: il
   censimento qui sopra diventa un banco del browser che pretende **zero**
   promesse mancate su tutte le superfici, e stampa quante voci ha guardato.
