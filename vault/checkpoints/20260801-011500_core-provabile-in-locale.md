# Checkpoint — il core diventa provabile in locale, e i campi interi chiudono a 7/7

- **Tipo**: infrastruttura di prova + chiusura del punto rimasto aperto
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `621f87c`

## Il punto che era rimasto aperto

Nel checkpoint precedente i tre campi interi del core risultavano «non
raggiungibili: serve il login». **Non era il login.** Tutto il programma del
core sta in un `<script type="module">` che importa Firebase da `gstatic.com`;
qui la rete è chiusa, l'import fallisce, il modulo non parte, e restano soltanto
i **segnaposto** che il core installa apposta («Funzione nav non ancora
pronta»). Per questo `nav('ufficio')` sembrava non fare niente: non era il `nav`
del core, era un segnaposto che scrive in console e basta.

L'ipotesi «serve il login» era ragionevole e sbagliata — di nuovo, la misura
prima dell'ipotesi: sono bastati l'elenco delle richieste fallite e la stampa di
`String(window.nav)`.

## Cosa è stato fatto

- **`tests/browser/finto-firebase.mjs`** — quattro moduli finti serviti al posto
  di quelli di Google. Non simulano Firebase: rispondono quanto basta perché il
  programma parta e le schermate si montino (le liste restano vuote, ed è
  giusto: quello che si prova sono le pagine, non i dati). Vale ben oltre questa
  unità — da qui in poi **il core si può aprire e guardare in locale**.
- **`tests/browser/interi-superfici.mjs`** — un banco solo per tutte e sette le
  superfici: **29 campi, 87 asserzioni, 0 fallite**. Naviga come naviga una
  persona: barra delle sezioni, fisarmoniche, la linguetta «Calcolo»
  dell'amministrazione, la tendina degli adempimenti tipici in Scudo, il
  pannello parametri del 3D in Genesi.
- **`tests/browser/LEGGIMI.md`** — come si lancia, cosa prova, cosa **non**
  prova (il login vero e il traffico verso Firestore restano agli emulatori).
- **`CLAUDE.md`**: due voci nuove, perché sono cose che costano un'ora a chi non
  le sa — la cartella `tests/browser/`, e il fatto che il core in locale non
  parte per via dell'import di Firebase.

## Una controprova inerte che si spacciava per prova

Sul core «9 passate, 0 fallite» anche con `--senza-guardia`. Non era un successo:
la riga di montaggio del core è scritta senza spazi
(`montaGuardiaInteri((m)=>toast(m,'err'));`) e la sostituzione non la trovava,
quindi la controprova non toglieva niente. Ora la sostituzione è tollerante agli
spazi **e** grida se non ha cambiato la sorgente. Rimessa la mano, sul core
cadono 6 asserzioni su 9.

## Riepilogo dei campi interi, chiuso

| superficie | campi | esito |
|---|---|---|
| core (radice) | 3/3 | a posto |
| Campo | 2/2 | a posto |
| Flotta | 4/4 | a posto |
| Scudo | 2/2 | a posto |
| Sentinella | 3/3 | a posto |
| Terra | 5/5 | a posto *(dopo la correzione della doppia guardia)* |
| Genesi | 10/10 | a posto |

## Prossimo passo atomico

Il finto Firebase apre una porta che finora era chiusa: **il core non è mai
stato guardato a schermo in questa serie di cicli**, mentre le sei app sì. Primo
passo concreto: aprire le schermate principali del core con `finto-firebase` e
fare il confronto affiancato che la direttiva chiede — dove il core è il
riferimento, e dove invece è lui a essere più povero delle app che l'hanno
copiato (stati vuoti, note, messaggi d'errore che spiegano).

## Bloccanti

- Il login vero e il traffico Firestore restano fuori dalla portata locale: per
  quelli ci sono gli emulatori.
- Resta gated su decisione del fondatore: Genesi punti pesanti #4/#5/#6.
- Resta **senza risposta** la domanda del fondatore «ti ho chiesto una cosa
  prima».
