# I tre cantieri, i due buchi nell'harness, e una CI rossa meritata

**Data:** 01/08/2026 (sera) · **Area:** `apps/scudo`, `apps/sentinella`,
`apps/terra`, `apps/conti`, `apps/flotta`, `apps/campo`, `shared/`,
`apps/deepwork-id/tests`
**Unità precedente:** `20260801-170447_la-taratura-e-lo-strumento-che-confondeva-i-valori.md`
**Commit del blocco:** da `4ce1809` a `e7542ab`

## Che cosa è entrato nel prodotto

| app | unità | perché conta |
|---|---|---|
| Sentinella | **la graffetta sull'adempimento** | un adempimento verso l'ente è fatto di due cose: la scadenza e il **documento consegnato**. La seconda non c'era. |
| Sentinella | **import delle tarature + allerta** | otto strumenti ricopiati a mano otto volte l'anno; e la scadenza si vedeva solo entrando nella sezione |
| Scudo | **la foto come prova** su infortuni e ispezioni | è la prima cosa che si fa col telefono davanti a un near-miss |
| Terra | **la conformità alla quota di progetto** | «stiamo scavando dove il progetto dice?» è la domanda dell'ente, e l'app non sapeva rispondere |
| Conti | **abbinamento dei movimenti bancari** | l'unico punto in cui si ridigitava un dato che esiste già |
| Flotta | **il salvataggio che non riesce** | senza rete le scritture **restano appese**, e il giro macchina spariva in silenzio |
| Campo | **ponte anomalia → azione correttiva** | al fronte la riga moriva lì; la macchina per darle seguito era già in Scudo |

## ⛔ Due buchi negli strumenti di controllo, e sono la cosa più importante

**1. Il confronto delle prove scriveva `null` per quattro valori diversi.**
`eq` usava `JSON.stringify`, che appiattisce `Infinity`, `-Infinity`, `NaN` e
`null` sulla stessa scrittura (più `-0` su `0` e `{a:undefined}` su `{}`). Il
buco stava **sotto le prove che difendono il principio del fondatore**, e sul
valore che il difetto produce: `Infinity` è quello che esce da una divisione per
zero. Trovato perché una controprova rispondeva «non distingue» **col difetto
rimesso dentro**.

**2. Cinque prove non potevano fallire.** `test` era sincrono: chiamava `fn()` e
guardava se lanciava. Una `fn` `async` non lancia mai — restituisce una
promessa. Misurato: un `ok(false)` dentro una prova async, e la suite risponde
**«0 falliti»**. Erano quattro in `run-kpi` e una in `run-stile`, e la ragione
per cui erano sopravvissute è che in `run-stile` era **una sola**: un buco che
riguarda una prova su 274 non si nota mai.

Il risultato onesto, in tutt'e due i casi: **dopo la correzione la suite resta
verde**. Non nascondevano difetti già scritti — mordevano le prove **nuove**,
mentre le si scriveva.

## ⛔ La CI rossa, e la regola che ne è uscita

Ho lanciato quattro suite sul disco, le ho viste verdi, ho committato e ho
scritto «l'albero è coerente». Era vero **un minuto prima**: nel frattempo due
cantieri avevano scritto altre funzioni, e il commit conteneva **nove funzioni
senza prova**.

> La verifica vale per lo stato **che si committa**, non per quello che si era
> misurato.

Con cantieri aperti: o si misura la **copia esatta** di ciò che si sta per
committare (worktree + `git diff --cached | git apply`), oppure si aspetta.
Le due cose che si muovono di più sono il **conto delle prove** e la
**copertura** — che sono anche le due che finiscono nei documenti.

## Le regole di `shared/` chiuse

- **la graffetta**: `controllaAllegato`, `testoAllegatoRifiutato`,
  `pezziDataURL`, `LIMITE_ALLEGATO` — era scritta a mano in Scudo, adesso la
  usano Scudo e Sentinella. E la versione condivisa copre tre casi che quella di
  casa non guardava (file vuoto, senza nome, dimensione illeggibile);
- **la risposta a un fatto**: `statoPonte` + `azioniDiOrigine`. Le due copie
  erano identiche **misurate byte per byte** (806 contro 809 caratteri). La
  prova pretende l'**identità**, e la controprova lo dimostra: una funzione che
  si comporta esattamente uguale ma non *è* la stessa fa cadere la prova.

## Quello che hanno trovato gli scatti, non il codice

1. **il campo che si allunga da solo** — `.flab{flex:1 1 120px}` dentro
   `.form.col` è una base **verticale**: tre etichette alte 120 px invece di 63.
   E il resto è stato **misurato invece che supposto**: Scudo 0, Terra 0, Conti
   non ha `.form.col`, Campo non ha quella base;
2. **la causale tagliata** in una finestra di conferma: 491 px in 352, proprio
   sul testo che serve a decidere;
3. **il toast che copriva il bottone** «Segnala» in Flotta;
4. **«0 KB»** su un allegato valido di 23 byte — la stessa cifra con cui l'app
   dice «vuoto».

## Verifica

Giro intero in **un comando solo** (`giro-node.mjs`, nato stasera perché il giro
fatto a memoria ne lanciava undici su diciannove): **15 suite su 15, 0 caduti**,
anche in ora italiana.
`run-kpi` **1250/0**, `run-stile` 275/0, copertura **515/515**, `sonda-vuoto`
7/0, `nomi-doppi` 0 da sistemare, `numeri-nei-documenti` 17/0.

## Prossimo passo atomico

Chiudere `browser/modali.mjs` — il banco che chiede «quando si apre una finestra
di conferma, quello che c'è dentro ci sta?». È scritto e la sua copertura è già
**misurata**: il gesto generico apre le modali in **quattro app su sei** (Campo
e Conti hanno un markup diverso), e il banco lo **dichiara** invece di far
credere di aver guardato tutto. Resta da: farlo girare fino in fondo, provare la
controprova, registrarlo in `tutti.mjs` e nel `LEGGIMI`.
