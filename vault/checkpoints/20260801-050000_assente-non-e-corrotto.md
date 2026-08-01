# Assente non è corrotto: la dimostrazione può mostrare il caso

**Data:** 01/08/2026 · **App:** Conti (+ la suite della dimostrazione)
**Unità precedente:** `20260801-040000_il-censimento-del-principio-sei-app.md`

## Il problema, nelle parole del cantiere che l'ha trovato

Chiudendo il censimento, il cantiere di Conti ha lasciato scritto questo:

> Nei dati dimostrativi **non** c'è una fattura senza date, quindi il caso nuovo
> non si vede in uno scatto. Ce l'avevo messa, ma `run-demo.mjs` pretende che
> ogni fattura demo abbia emissione e scadenza valide — e quel file è fuori dal
> mio perimetro.

Cioè: era appena stata costruita la difesa sul caso in cui l'app diceva le cose
**più tranquillizzanti che sapesse dire** — badge verde «Regolare» su una
fattura senza scadenza, fascia «non scaduto», ed età media del credito contata
**zero giorni** (misurato: 92 gg → 46 gg con una sola fattura) — e una regola
della suite **vietava alla dimostrazione di contenerla**.

È lo stesso difetto già trovato con la chiusura del mese: *la dimostrazione è
più povera della realtà proprio nel punto in cui il prodotto è più forte.*

## La distinzione che mancava

`run-demo` esiste per impedire dati **corrotti**: un `2026-13-45`, un numero al
posto di una data, un refuso che fa crashare un badge. Un campo **assente** non
è un refuso: è uno **stato che il prodotto sa raccontare**, e metterlo nella
dimostrazione è un modo di mostrarlo.

Adesso la regola dice questo: `null`, `undefined` e stringa vuota passano;
qualunque altra cosa deve essere una data che **esiste**. E il confronto
«emessa non dopo la scadenza» si fa solo quando ci sono tutt'e due — con una
sola non c'è nessun ordine da violare, e pretenderlo rimetterebbe dalla
finestra il divieto appena tolto.

## ⚠️ E la regola era scritta una seconda volta, più debole

`run-demo` aveva la sua `isDate` in casa:
`/^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s + "T00:00:00"))`.

Accettava **«2026-02-30»**. `Date.parse` non rifiuta un giorno che non esiste:
lo fa **scorrere** al 2 marzo. Una data d'esempio impossibile sarebbe passata
per buona diventando un altro giorno in silenzio — cioè esattamente il tipo di
sbaglio che `run-demo` esiste per prendere.

La versione giusta è in `shared/` da mesi (`dataISOEsiste`, che ricostruisce la
data e la confronta con quella scritta) e la usano già le app. Adesso
`run-demo` la **importa**: un alias non è una seconda implementazione.

Trovato dalla controprova, non a lettura.

## ⚠️ Due volte la prova aveva torto, non il codice

1. `dataISOEsiste("2026-07-01T00:00")` **passa**, e la mia prova l'aveva messo
   fra i corrotti. Taglia a dieci caratteri **di proposito**: in archivio ci
   sono istanti interi (`registratoIl`), e un istante valido non è una data
   rotta. Corretta la prova.
2. Prima ancora avevo scritto la lista dei casi con `2026-02-29` fra quelli da
   accettare — l'anno **non** è bisestile. Sostituito con `2024-02-29`.

Sono i casi 1 e 5 dell'elenco di `CLAUDE.md`: una prova sbagliata che accusa il
codice fa perdere più tempo di nessuna prova.

## Che cosa si vede adesso

`f7 · 2026/037 — Cave del Sud, € 4.400,00`, emessa il 18/06/2026 e **senza
scadenza**, come arrivano dagli import. Sulla riga: pastiglia **gialla**
«senza scadenza» (`badge warn`), e la meta scrive «emessa 18/06/2026 · senza
scadenza». Nel Quadro l'età media del credito resta un numero vero, **34 gg**,
perché f7 la data d'emissione ce l'ha.

Misurata anche l'altezza della riga: **198 px**, identica a quella delle due
righe accanto (035 e 036). Nessuna riga a capo, nessun comando spinto sotto.

## Verifica

- `run-demo` **8/0** (era 7: +1, la controprova), `run-kpi` 1107/0,
  `run-stile` 271/0, `run-helpers` 49/0, `run-pointcloud` 26/0,
  `run-manifest` 9/0 — `TZ=Europe/Rome`. **Totale 1.470.**
- **Sonda del vuoto 7/0**, ed è la parte che vale: aveva fatto **cadere la CI**
  su `e452e9a` — e per la ragione giusta. Diceva che **tre eccezioni dichiarate
  non si presentano più**: `scudo.statoAzione`, `scudo.statoIspezione` e
  `campo.pianoRiepilogo`. Non erano guasti: erano casi che il censimento aveva
  **corretto**, e le righe che li scusavano andavano tolte — *un'eccezione che
  non serve più è un'eccezione che nasconde*. Tolte, con la ragione scritta al
  loro posto. Adesso «7 tranquilli trovati, 7 dichiarati»: i due numeri
  coincidono, e prima no.
  ⚠️ Quella suite non era nel mio giro di verifica prima del commit, ed è la
  ragione per cui l'ha trovata la CI invece di me.
- `numeri-nei-documenti` **15/15**, i tre documenti aggiornati dalla misura.
- Conti aperta a 430 px: **nessun `pageerror`**, scatto guardato.

## Prossimo passo atomico

**Rilanciare il giro completo del browser** (`tutti.mjs`) sul codice finale,
da solo e senza altre sessioni di Chromium, e leggerlo fino in fondo.
⚠️ Il giro lanciato all'inizio di questo blocco è stato **fermato di proposito**
a circa un terzo: girava su una copia congelata di `e01cdf1`, ormai vecchia di
quattro commit, e teneva occupata la CPU impedendo ogni scatto ai sei cantieri.
Fermarlo è stata una scelta — va detto, invece di lasciarlo credere finito.
