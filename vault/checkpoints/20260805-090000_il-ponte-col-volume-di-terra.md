# Il ponte col volume di Terra

**Data:** 05/08/2026 · **App:** Conti (ponte verso Terra, sola lettura)
**Unità precedente:** `20260805-080000_la-barra-che-va-a-capo-e-una-regola.md`

## Cosa è stato fatto

Il costo al metro cubo chiedeva i metri cubi **a mano**. Ma i metri cubi
esistono: li misura Terra, e Conti li legge già col ponte in sola lettura che
serve al confronto cavato/venduto. Chiederli a chi guarda voleva dire, in
pratica, che quel costo non lo calcolava nessuno.

Ora c'è il bottone **Prendi da Terra**, e due funzioni pure dietro:

- **`volumeDaTerra(rilievi, dal, al)`** — somma i rilievi di **scavo** del
  periodo e restituisce l'intervallo che coprono davvero.
- **`costiFuoriDaiRilievi(righe, primo, ultimo)`** — quante voci di costo, e
  per quanti euro, cadono fuori da quell'intervallo.

## Le tre cose che rendono il numero controllabile

**1. Quattro assenze diverse, quattro frasi diverse.** «Nessun volume» detto
allo stesso modo per quattro cause fa fare la cosa sbagliata a tre persone su
quattro. Chi ha solo riprese da **cumulo** deve sapere che il cumulo non è
scavo nuovo (come denominatore conterebbe due volte lo stesso materiale); chi
ha solo rilievi **pianificati** deve sapere che manca l'elaborazione, non la
misura; chi ha rilievi tutti **fuori periodo** deve allargare le date; chi non
ha Terra deve sapere che è un problema di permessi, non di cava. Il test
pretende che le cinque frasi siano **cinque frasi diverse**, non la stessa
cinque volte.

**2. La provenienza viaggia col numero.** Quanti rilievi, che intervallo
coprono, quanti m³ di cumulo sono rimasti fuori, quanti rilievi pianificati non
entrano. E se il volume lo **riscrive una persona**, la provenienza sparisce:
una misura dichiarata sopra un numero inventato sarebbe la bugia peggiore della
schermata, perché la frase è giusta, il numero è giusto, e a mancare è il
legame fra i due. Il valore messo dal bottone non passa dal gestore `input`
(`.value` da programma non lo scatena), quindi arrivarci significa che l'ha
battuto qualcuno.

**3. L'avviso su numeratore e denominatore disallineati.** Se una voce di costo
è datata fuori dall'intervallo misurato, quella spesa sta nel totale e il suo
volume no: il costo al metro cubo esce **più alto** del vero, e viene detto.

## ⚠️ L'avviso sbagliato, bocciato dalla prova prima di nascere

La prima versione confrontava le **date**: «i rilievi coprono dal 28/02, il
periodo parte dall'01/01». La prova in banco l'ha bocciata al primo colpo, ed
era sbagliata per una ragione di mestiere: **un rilievo misura il volume tolto
da quello prima**, quindi la sua data è la FINE dell'intervallo che copre, non
l'inizio — e un periodo che finisce il 31/12 «scoperto» da agosto in poi è
semplicemente il futuro. L'avviso partiva su un caso sano.

La domanda giusta non è sulle date, è se **numeratore e denominatore guardano
lo stesso pezzo di tempo**, e quella si misura coi costi in mano. Mezz'ora di
prototipo in scratchpad invece di un avviso che grida al lupo.

## Le prove

- **Tre `test` nuovi in `run-kpi.mjs`** (1054 → 1057): la somma che tiene fuori
  il cumulo dichiarandolo; le cinque assenze con cinque frasi diverse (e il
  test conta che siano davvero cinque); i costi fuori intervallo, compreso il
  caso in cui **non si può misurare** e lo si dice.
- **`registro-costi.mjs` è passato da 31 a 40 prove**, e la controprova da due
  difetti a **quattro**, con 10 cadute:
  1. `--nav-cols:7` — la barra a capo;
  2. `gruppoDiVoce` che ricade su «generali»;
  3. **il cumulo contato come scavo nuovo** (`m3 + cumuloM3`): 178 diventano
     200 e il costo scende da 16,59 a 14,76 €/m³ — cioè il numero legge
     **meglio** del vero, che è il travestimento di sempre;
  4. **la provenienza che resta attaccata** a un volume riscritto a mano.
- ⚠️ E una prova sbagliata mia, corretta subito: pretendeva «9,56 €/m³», ma il
  banco stesso poche righe più su registra un costo di prova, quindi il totale
  non è più quello dei dati d'esempio. Accusava il prodotto di un difetto che
  era suo. Adesso prende il totale **dallo schermo** e controlla la divisione.

Stato: `run-kpi` **1057**, prove `node` **1.415**, copertura **437/437**,
`run-stile` 268, banchi del browser 35. Documenti aggiornati (di nuovo:
`numeri-nei-documenti.mjs` li fa cadere ogni volta, ed è il suo mestiere).

## ⚠️ Il giro completo del browser NON è stato eseguito in questo blocco

Va detto chiaro perché non si scambi per una verifica fatta. È stato lanciato,
ha girato più di un'ora ed è arrivato al **terzo banco su 35**: l'ho fermato.

**La causa non è il giro, sono io.** Nel frattempo stavo facendo scatti e
controprove con altre sessioni di Chromium: su un contenitore da **4 core**,
due Chromium headless si affamano a vicenda. Misurato dopo: `interi-superfici`
da solo cammina (era a metà delle nove superfici in ~4 minuti), mentre dentro
il giro affollato i primi due banchi hanno preso più di un'ora.

È la stessa regola già scritta per i file — **non si tocca il cantiere mentre
gira il giro** — e vale anche per la CPU: durante il giro non si aprono altri
browser. Le tre unità di oggi hanno comunque ciascuna il **proprio banco** che
gira e la **propria controprova** che cade.

## Prossimo passo atomico

**Lanciare il giro completo da solo**, senza nessun'altra sessione di browser
aperta, e leggerlo fino in fondo: è la verifica che manca alle tre unità di
oggi. Se ci mette più di un'ora anche da solo, allora il problema è il giro e
non l'affollamento, e la mossa giusta diventa la successiva: far servire ai
banchi una **copia** del repository (una `git worktree` temporanea, radice via
variabile d'ambiente) invece della cartella viva — così `impronta.mjs` non
serve più e il cantiere non deve fermarsi mentre il giro cammina.
