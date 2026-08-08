# Checkpoint — 2026-08-08 17:55 UTC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`23712e6` — fix(giro): la dichiarazione di controprova diventa un INTERVALLO, e
l'asserzione sull'età regge anche in CI

## Due cose, e la prima è stata trovata dallo strumento appena scritto

**1 · La dichiarazione era un'etichetta su UNA riga.** Il runner scrive «⚠️
CONTROPROVA: qui sotto il rosso è quello VOLUTO» subito dopo la **propria**
intestazione. Ma molti banchi stampano una **propria** intestazione a otto
uguali, e da lì in giù la dichiarazione non copre più niente: i KO **voluti**
tornano a leggersi come difetti veri.
Successo sul registro di stamattina: `struttura di Genesi · controprova`
dichiarava, poi il banco apriva «Genesi: la struttura è quella del core? ·
controprova» e i suoi **quattordici** KO voluti finivano fra i veri. È la
**terza** volta che questa famiglia morde (prima la sotto-intestazione a sei
uguali, poi il riconoscimento dalla parola), e la cura del 07/08 valeva solo
per i banchi che non si intestano da sé.
Adesso `tutti.mjs` **chiude** la dichiarazione e il lettore la legge come un
**intervallo**: ogni sezione aperta dentro eredita il flag, e l'ereditarietà
finisce alla chiusura. Il verso opposto è provato di proposito: ereditare per
sempre dipingerebbe di «voluto» tutto il resto del giro, cioè nasconderebbe i
difetti invece di mostrarli — sarebbe **peggio** del difetto di partenza.

**2 · L'asserzione sull'età era vera in casa e falsa in CI**, e la CI aveva
ragione a cadere. Pretendevo che `HEAD~5` desse esattamente **5**: in CI ha
dato **1407**. Causa: GitHub non prova il branch, prova il **merge** del branch
col ramo di destinazione, e da un commit di fusione `HEAD~5..HEAD` raccoglie
anche tutto il secondo genitore.
⚠️ **Riprodotto in casa** su un commit di fusione vero (`5a4c5b6`): **126**
invece di 5. Cioè la causa è **misurata**, non dedotta — che è la differenza
fra una correzione e una supposizione scritta con sicurezza.
Adesso si prova una proprietà vera dappertutto e non tautologica: il conto
**cresce** andando indietro, e non è mai zero per un commit che non è HEAD; e
il caso «storia corta o clone superficiale» si **dichiara** invece di sparire.

## La regola che se ne ricava

«Verde in casa, rosso in CI» ha adesso **tre** vesti raccolte, e la terza è
nuova: gli **scrittori** diversi (un trigger che in casa non gira), l'**ordine**
di due eventi (un rifiuto non gestito contro `process.exit`), e — da oggi — la
**forma della storia di git**. La domanda da farsi è sempre la stessa: *sotto un
ambiente diverso, che forma ha lo stato su cui sto scrivendo un'asserzione?*

## Verifiche

Controprove rimettendo **ognuno** dei due difetti: il controllo cade e dice
quale. Giro `node`: **28 comandi, 0 caduti**.

## E intanto è ripartito il giro del browser, sul commit di adesso

Il vecchio è finito dopo **5h47** — «135 banchi a posto, 18 da guardare» — ma
attesta `c3888fe`, venti commit indietro sulle superfici misurate: i suoi 18
non si toccano finché non sono riverificati. Ne è stato lanciato uno nuovo su
`23712e6` (pid 16814, registro in `scratchpad/resp/giro/registro.txt`), che
gira su una copia del committato e quindi **non impedisce di lavorare**.

⚠️ Nota per chi legge il vecchio registro: fra i 18 ci sono **dieci passate
`· controprova` in KO**, e un KO lì vuol dire che la controprova **non ha
saputo fallire** — cioè una guardia che non protegge. Vanno guardate una per
una, ma **sul giro nuovo**, non su quello.

## Prossimo passo atomico

Quando il giro nuovo finisce (~6 ore), leggerlo con `leggi-giro.mjs`: la
**sezione 0** dirà da sola quanto è vecchio, e la sezione 1 le righe «non ho
guardato». Le dieci controprove in KO del giro vecchio sono la prima cosa da
confrontare: se ricompaiono, sono guardie che non sanno fallire e ognuna è
un'unità.

## Blocchi

Nessuno.
