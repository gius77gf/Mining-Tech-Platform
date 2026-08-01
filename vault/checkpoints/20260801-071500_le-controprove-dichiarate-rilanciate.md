# Le controprove dichiarate, rilanciate una per una

**Data:** 01/08/2026 · **Area:** verifica del lavoro dei sei cantieri
**Unità precedente:** `20260801-064500_due-decisioni-misurate-per-il-fondatore.md`

## Perché questa unità esiste

Nel messaggio di `e452e9a` ho scritto: *«Ogni cantiere con la propria
controprova: 8/8, 5/5, 4/4, 3/3, 5/5, 4/4.»*

Quei dodici numeri li avevo presi **dai resoconti degli agenti**. Non li avevo
visti girare.

`CLAUDE.md` ha una riga che riguarda esattamente questo, ed è nata da un caso
vero: *«una controprova è stata **dichiarata riuscita in un messaggio di commit
senza essere mai partita**»* — l'`assert` cercava quattro spazi dove il file ne
ha due, saltava prima della scrittura, e le due sonde misuravano un file sano.
Il corollario scritto lì è: **il messaggio del commit si scrive DOPO aver letto
l'esito**. Io l'ho scritto dopo aver letto *il racconto* di un esito.

## Cosa ho fatto

Rilanciate tutte e sei, una per una, dai loro script in `scratchpad/`:

| cantiere | dichiarato | rilanciato | esito |
|---|---|---|---|
| Terra | 8/8 | **8 su 8 iniezioni fanno cadere la prova** | ✅ |
| Scudo | 5/5 | **5 difetti rimessi, 0 prove che NON distinguono** | ✅ |
| Campo | 5/5 | **5 prove cadute come dovevano, 0 guai** | ✅ |
| Conti | 4/4 | **4 su 4 iniezioni fanno cadere la prova** | ✅ |
| Sentinella | 4/4 | 4 iniezioni, ogni prova col suo nome cade | ✅ |
| Flotta | 3/3 | **3 controprove: 3 cadute, 0 non distinguono** | ✅ |

**Tutti e dodici i numeri reggono.** Il messaggio di commit era accurato — ma
lo era per fortuna, non per verifica, e la differenza è il punto dell'unità.

Due cose notate rilanciandole, che dai resoconti non si vedevano:

- **Terra ne ha una che di proposito NON deve cadere** («verifica che la prova
  sappia anche dire di sì»). È il verso opposto di cui parla `CLAUDE.md`: un
  controllo che non sa riabilitarsi segnala per sempre. Il cantiere l'aveva
  fatto senza dirlo nel resoconto.
- **Sentinella è l'unica che inietta nel FILE VERO** e lo ripristina; le altre
  cinque lavorano su copie. Verificato dopo: `git status` **pulito**, `run-kpi`
  **1108/0**. Era sicuro solo perché il giro del browser gira su una **copia
  congelata** — la stessa cosa che, prima di `ec5355e`, avrebbe invalidato un
  giro da un'ora.

## Quello che resta vero e va detto

Queste sei controprove vivono in `scratchpad/`, che è **effimero**: alla
sessione dopo non esistono. È una scelta giusta — la difesa permanente sono le
**prove** in `run-kpi.mjs`, e la controprova è un atto di validazione che si fa
una volta. Ma vuol dire che *questa* verifica è stata possibile solo perché la
sessione è ancora viva, e non sarà ripetibile domani.

Dove costa poco, il progetto già fa meglio: la controprova della regola 19 e
quella della regola 20 stanno **dentro** `run-stile.mjs` e non toccano nessun
file, perché la funzione controllata prende il **testo** invece del percorso.
È la forma da preferire quando si può.

## Verifica

`git status` pulito dopo tutte e sei; `run-kpi` **1108/0** dopo l'unica che
tocca un file vero.

Nessun file di prodotto modificato in questa unità: il deliverable è il
**resoconto verificato**.

## Prossimo passo atomico

Il giro del browser è a **106 asserzioni** e sta girando i banchi dei campi
interi (i più lenti: digitano davvero in 29 campi su 7 superfici, due volte).
Controllato che i `KO` che compaiono stiano **tutti dentro la sezione
`campi interi · controprova`**, dove cadere è il requisito — non sono difetti.
Si continua a leggerlo fino in fondo.
