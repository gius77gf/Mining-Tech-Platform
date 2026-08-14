# Checkpoint — 2026-08-08T06:06:17Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`087ef5b` — *leggi-giro: il lettore che separa il rosso VOLUTO da quello VERO*

## Che cosa è stato completato

Un giro completo produce **cinquemila righe**, e dentro ci sono **due specie di
rosso** che nel registro si scrivono uguali: quello di un banco che ha trovato
un difetto, e quello **voluto** di una controprova — dove un KO è il banco che
funziona.

Il 07/08 questo è costato **due volte in due ore**: una diagnosi aperta su
«dieci difetti che non esistevano», e poi un setaccio che ha sbagliato **due
volte di seguito** (le sotto-intestazioni a **sei** uguali prese per
intestazioni, e la controprova riconosciuta dalla **parola** mentre due passate
su quattro di `contrasto` si chiamano «non accusa chi pulsa» e «le classi mai
comparse»).

La cura era **già metà fatta**: `tutti.mjs` scrive nell'intestazione che una
passata è una controprova, perché quel dato ce l'ha in mano. **Mancava chi lo
leggesse.** Questo file legge la **dichiarazione**, non le parole.

E l'ordine non si negozia — **prima le righe «non ho guardato», poi i KO**: un
rosso lo si vede, un «0 su 68» in fondo a una pagina di verde no.

## Provato sul registro vero, a giro ancora in corso

- **42 passate** lette, di cui **21 controprove**;
- **369 KO voluti** tenuti fuori;
- **4 KO veri** portati in evidenza;
- **49 righe «non ho guardato»** messe in cima.

E dichiara che il registro è **tronco** quando manca la riga d'uscita, invece
di far credere che il giro sia finito bene — cosa che, con un giro ancora in
corso, sarebbe stata la conclusione sbagliata più facile da trarre.

## Controprova

Sulle **due trappole vere**, non inventate: una sotto-intestazione a sei uguali
dentro una sezione non deve aprirne una nuova, e un KO dentro una controprova
non deve finire fra i difetti.

## Prove

- `leggi-giro --controprova`: passa, uscita 0.
- Giro `node` sulla copia di quello che si committava: **23 comandi, 0 caduti**.

## In volo

⏳ Il **giro del browser**, porta **8823**, pid 28054, tre ore e dieci di
cammino. Il registro è a ~3.900 righe e non ha ancora scritto la riga d'uscita.

## Prossimo passo atomico

⛔ **Raccogliere `giro-7.txt` appena finisce**, e adesso si fa con un comando:

    node apps/deepwork-id/tests/browser/leggi-giro.mjs \
      /tmp/.../scratchpad/io-core/giro-7.txt

I **quattro KO provvisori** già visti, da confermare a giro finito:
1. `i documenti che escono dal core` — «lo SCHERMO dice il totale e la sua
   riserva ("12 fori · almeno 56 kg · 1.240,3 mc")»;
2. `il foglio di fine turno di Campo` — il nome del file scaricato porta il
   marchio `DATI-DI-ESEMPIO_` e il banco si aspetta `consegna_turno.txt`;
3. `foglio di turno · coi dati veri tace` — lo stesso, nell'altra passata;
4. `unità in maiuscolo` — terra: «Volume rimesso per il recupero (m³)».
⚠️ Il (2) e il (3) sono **lo stesso** difetto, e con ogni probabilità è il
**banco invecchiato**, non il prodotto: il marchio sui file di dimostrazione è
stato aggiunto di proposito il 07/08 («un banco che porta dentro un numero
atteso invecchia col crescere della dimostrazione»). Va **verificato**, non
dedotto.

Poi, a giro fermo (tocca le pagine):
- ⏱️ **Togliere le 59 righe inerti** (import mai usati) e portare la quinta
  domanda di `nomi-liberi` a regola.

## Blocchi
Nessuno.
