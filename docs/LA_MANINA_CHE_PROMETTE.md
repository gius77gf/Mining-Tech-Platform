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
| scudo | 118 | 91 → **0** | 0 |

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

## Che cosa è stato fatto

1. ✅ **La convenzione, una sola, in `shared/dw-app-ui.css`**: `.item.tocca`.
   Il verso è «parti ferma e marca le vive», e la ragione è **misurabile**:
   dimenticare di marcare una riga **viva** si vede subito (non si accende),
   dimenticare di marcarne una **ferma** non si vede — ed è il difetto che si è
   presentato cinque volte oggi.
2. ✅ **Scudo** portata su quella convenzione: la regola locale girata a
   `cursor:default`, e `tocca` sulle **nove** emissioni vive (che erano
   marcate in tre modi diversi *dentro la stessa app*: `onclick`, `data-…`,
   e `style="cursor:pointer"` scritto a mano). 91 → 0.
3. ✅ **Un banco che lo tiene fermo**:
   `apps/deepwork-id/tests/browser/promesse-tocco.mjs`, su tutte le superfici,
   con la controprova che rimette il difetto (`.item{cursor:pointer
   !important}`) e pretende che il banco lo veda. Non guarda le classi — le
   misurerebbe invece della promessa — ma il cursore calcolato contro
   l'aggancio vero, e **stampa quante voci ha guardato**.

## Come rifare la misura

```
python3 -m http.server 8931          # dalla radice del repo
node apps/deepwork-id/tests/browser/promesse-tocco.mjs 8931
node apps/deepwork-id/tests/browser/promesse-tocco.mjs 8931 --controprova
```

La prima deve dire **0 promesse fuori posto**; la seconda deve **trovarne**, se
no il banco non sa fallire. Tutt'e due stampano quante voci hanno guardato: è il
numero da leggere per primo, perché uno zero su zero voci non è una buona
notizia, è un banco che non ha misurato niente.

⚠️ E una trappola che è costata un'ora, scritta perché non ricapiti: la sonda
usata per il censimento chiamava `vaiA(p, sezione)` invece di
`vaiA(p, nome, sezione)`. Con due argomenti **non naviga**, quindi misurava otto
volte la stessa schermata — e il risultato non sembrava rotto, sembrava un
prodotto strano (la stessa riga in ogni sezione). Adesso `vaiA` rifiuta la
chiamata a due argomenti invece di far finta.

## Che cosa resta

✅ **Conti** e **Sentinella** sono state rinominate a `tocca` (01/08): erano
`tap` e `cliccabile`, cioè la stessa idea con due nomi. Le convenzioni scendono
da **cinque a tre**.

Restano **Campo**, **Flotta** e **Terra**, che partono dal verso opposto (riga
viva di serie, ferma marcata). Sono a zero e il banco le protegge comunque,
quindi è pulizia, non sicurezza.
