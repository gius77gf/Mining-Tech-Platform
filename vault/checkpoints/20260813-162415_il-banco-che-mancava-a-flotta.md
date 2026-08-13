# Checkpoint — 2026-08-13 16:24 UTC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`d222d37` — *Flotta: il banco «numeri tranquilli» che mancava, e i due difetti
che ha trovato*
(prima: `e3fa4ee` canarino del ciclo)

## Che cosa è stato completato

**B0-terdecies — Flotta non aveva il suo banco «numeri tranquilli».**

L'unità non è nata da un sospetto sul codice ma **dall'elenco dei controlli**.
È la regola della settimana applicata a sé stessa — *un numero è sorvegliato
solo dove il controllo ARRIVA, e l'elenco di dove arriva va guardato quanto il
numero* — e il comando che la mette in chiaro è di una riga:

```sh
ls apps/deepwork-id/tests/browser/ | grep numeri-tranquilli
campo · conti · genesi · scudo · sentinella · terra      (Flotta: niente)
```

⚠️ **La prima cosa misurata è stata che il modulo non ha difetti.** Ventotto
chiamate a `flotta-data.js` con l'assenza al posto del dato (`null`, «», il
campo mai compilato) non hanno prodotto **un solo numero inventato**: ogni zero
tranquillo uscito era una decisione scritta e motivata nel file («la giacenza
che manca vale zero: un ricambio senza quantità è un ricambio che non c'è»).
Due delle chiamate sono crollate, e crollavano per **un mio errore di firma**,
non per un difetto del prodotto — verificato leggendo le due firme.

I due difetti stavano dove le prove `node` non arrivano: nella **pagina**, dove
il documento si compone. E sono **tutti e due la quarta copia di una regola già
scritta nello stesso file**.

1. **«Quanto costa un'ora»: la riga che si spezzava in due «ma».** Il totale si
   incollava davanti al perché con un `, ma ` e l'iniziale abbassata. Funziona
   per quattro dei cinque `perche` che `costoOrarioMezzo` sa dire; il quinto —
   il mezzo che HA le ore e non ha spesa dentro la finestra — è già fatto di due
   parti e la sua «ma» ce l'ha dentro:
   > «€ 300,00 spesi, **ma** le ore lavorate si sanno, **ma** nessuna delle
   > spese che cadono in questo periodo porta il suo importo: …»

   Due «ma» in una frase, e per chi legge una contraddizione: i 300 € ci sono o
   no? (Ci sono: cadono **fuori** dal periodo coperto dal contatore.) La
   **pagella**, ottocento righe più sotto, sullo stesso mezzo e con lo stesso
   `perche`, scriveva già la forma giusta — totale sul secondo rigo, perché sul
   terzo con l'iniziale maiuscola. Il caso entra da un **tocco vero**: due pieni
   sullo stesso mezzo col contatore, il secondo col campo della spesa vuoto.

2. **«€ 0,00» sulla lista dei costi** dove l'importo non è mai stato scritto —
   `eur(null)`. La stessa decisione era già presa **tre volte** in questo file:
   il registro interventi la pastiglia non la disegna, il libretto scrive «costo
   non scritto», il CSV degli interventi lascia la cella vuota (col perché per
   esteso: *chi apre il file in un foglio quello zero lo SOMMA credendolo
   misurato*). Corretti insieme la riga, il CSV dei costi e le due finestre di
   conferma.
   ⚠️ **Onestà su da dove nasce una voce così**: dai form di Flotta non nasce.
   `grep -n "parseCostiCsv" apps/flotta/flotta-data.js` → niente; «Registra
   spesa» pretende un importo maggiore di zero; la voce «Carburante» si crea
   solo `if (v.euro > 0)`. È il record scritto altrove o prima — la stessa
   specie di `m6` senza `tipo` e `n1` senza `stato`, che la dimostrazione porta
   apposta. Non si finge che sia un tocco: si dice che cos'è.

## Che cosa ha detto la misura

| controllo | esito |
|---|---|
| `flotta-numeri-tranquilli.mjs` | **24 passati, 0 falliti** |
| la sua controprova | **20 / 5** (i difetti rimessi la fanno cadere) |
| `run-kpi` | 2054, 0 falliti |
| `sintassi-pagine` | 34, 0 falliti |
| `suite-collegate` | 3, 0 falliti · 128 file guardati |
| `numeri-nei-documenti` | 41, 0 falliti · copertura 726/726 |

Esecuzioni del browser **186 → 188**, file di banco **77 → 78**: i quattro
documenti che dichiarano quei numeri sono stati aggiornati, e a dirlo che erano
scaduti è stata la **sorveglianza**, non la memoria.

⚠️ Verificato sulla **copia di quello che si committa** (worktree da `HEAD` +
`git diff --cached | git apply`), non sull'albero vivo: l'albero porta anche il
lavoro di due cantieri paralleli su Campo e Scudo, e una suite verde lì non
avrebbe parlato del commit.

## Che cos'altro è vivo adesso

- **Il giro completo del browser** — ripartito alle 15:59:58 UTC (registro in
  `scratchpad/giro-notte/registro.txt`). Alle 16:24 aveva chiuso **8 passate su
  188**: al ritmo misurato il giro intero è una cosa da ore, non da minuti.
  ⚠️ **Gira su una copia di `e3fa4ee`**, cioè senza il banco nuovo e senza le
  correzioni di oggi: quello che dirà riguarda lo stato di stamattina. È
  comunque la misura mai presa — 186 esecuzioni che non hanno mai girato
  insieme.
  ⚠️ Il registro della notte del 10/08 **non esiste più**: viveva nello
  scratchpad del contenitore, che nel frattempo è sparito. Non era «da
  leggere»: era da rifare.
- **Cantiere Campo** (B0-duodecies) — ha consegnato: un difetto vero in
  `apps/campo/index.html`, la correzione applicata sull'albero vivo e quattro
  prove pronte in `scratchpad/campo-prove.js`. **Da integrare e committare.**
- **Cantiere Scudo** (B0-duodecies) — ancora al lavoro.

## Prossimo passo atomico

**Integrare il cantiere di Campo**: leggere il diff di `apps/campo/index.html`
riga per riga (una consegna non entra in un commit sulla parola), incollare
`scratchpad/campo-prove.js` in `run-kpi.mjs` fra l'ultima prova e la riga
`console.log(\`\nRisultato KPI app: …` — **estraendo solo il codice, senza la
prosa intorno**, che è l'errore già fatto tre volte — rilanciare `run-kpi` e
leggerne l'esito **prima** di scrivere il messaggio del commit (una catena `&&`
non è una lettura), poi aggiornare la riga **B0-duodecies** della roadmap con la
parte di Campo chiusa e le due cose che il cantiere ha **misurato e non
corretto** (`0` con due letture opposte blindate da prove verdi;
`mediaFermiAlGiorno` che dà `media: 0` dove non è stato misurato niente).

## Blocchi
- **B0-septies** (che cosa vede chi apre il 2D di una volata senza maglia) e le
  **soglie di sicurezza** (`ppvLimit`, curve USBM/DIN): fermi al fondatore,
  nessun cantiere può toccarli.
