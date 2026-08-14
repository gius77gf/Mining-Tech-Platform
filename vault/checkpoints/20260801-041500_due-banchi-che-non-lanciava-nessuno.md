# Due banchi che non lanciava nessuno

**Data:** 01/08/2026 · **Area:** CI e orchestrazione delle suite
**Unità precedente:** `20260801-034500_l-orologio-del-vault.md`

## Come è saltato fuori

Finita `date-checkpoint.mjs`, la domanda successiva era ovvia: *e chi la lancia?*
La CI esegue `npm test`, e `npm test` è una **riga scritta a mano** in
`tests/package.json` che elenca le suite **per nome**. La mia non c'era.

È la guardia scollegata della regola 17 — togliere le funzioni dimenticando il
`<script>` — applicata alla CI: una suite verde in locale che **non gira mai**.

Tirando il filo, non era sola.

## ⛔ Il fatto: due banchi del browser che nessuno lanciava

| file | che cosa prova | chi lo lanciava |
|---|---|---|
| `browser/giro-su-copia.mjs` | che il giro gira su una **copia scollegata** dalla cartella viva | **nessuno** |
| `browser/contrasto-core.mjs` | il contrasto sulla home del **core** (dove un sottotitolo stava a 1,12:1) | **nessuno** |

Il primo è quello che pesa: prova il **meccanismo su cui tutto il giro adesso si
appoggia** — la worktree congelata che permette di lavorare mentre i banchi
girano. Scritto ieri, verde, e mai eseguito da nessuna catena.

## La correzione, e la sua forma

- I due banchi sono entrati nella lista di `browser/tutti.mjs`.
- `date-checkpoint.mjs` e `suite-collegate.mjs` sono entrate in `npm test`.
- **`suite-collegate.mjs`** (nuova) impedisce che si riformi: ogni `.mjs`
  tracciato in `tests/` deve stare in **una di tre case** — `npm test`, la lista
  di `tutti.mjs`, oppure dichiararsi con il marcatore `NON VA IN npm test`
  scritto **nelle prime venti righe, con la ragione**.

**Perché il marcatore nel file e non un elenco a parte**: un elenco è una
seconda copia che invecchia, e questo progetto ha già pagato quella lezione
quattro volte. Il marcatore viaggia col file che descrive.

**Perché la lista di `tutti.mjs` è la terza casa e non un'eccezione**: i banchi
del browser *non possono* stare in `npm test` (vogliono Chromium e un server).
Ma la loro lista è scritta a mano esattamente come quella di npm, cioè porta lo
**stesso identico rischio un piano più sotto** — ed è lì che i due orfani si
erano infilati.

Diviso adesso: **18** in `npm test`, **19** banchi in `tutti.mjs`, **5** fra
aiuti e misure dichiarati (`giro.mjs` e `finto-firebase.mjs` sono attrezzi che
i banchi importano, `tutti.mjs` è l'orchestratore, `sonda-permessi.mjs` e
`misura-numeri-doppi.mjs` stampano e basta). Totale 42, tutti giustificati.

## ⚠️ Il controllo poteva passare a vuoto in CI, e ora se ne accorge

`date-checkpoint.mjs` legge il giorno in cui ogni checkpoint è **entrato in
git**. In CI `actions/checkout` clona di default a **profondità 1**: avrebbe
visto un commit solo, contato quasi zero checkpoint e risposto «nessuna
violazione» **senza aver guardato niente** — cioè il difetto che quella suite
esiste per impedire, commesso da lei.

Due rimedi, tutti e due:
1. la suite **riconosce il clone superficiale** (`git rev-parse
   --is-shallow-repository`) e si ferma dicendo come rimediare, invece di
   passare a vuoto;
2. il job della CI che lancia le suite ha adesso **`fetch-depth: 0`**.

## ⚠️ E due volte la mia misura ha guardato dove non credeva

1. Il primo elenco dei banchi in `tutti.mjs` l'ho preso con un `grep -A 30`:
   **trenta righe**, mentre la lista ne occupa il doppio. Ne risultavano
   «mancanti» `quota-base-reale.mjs` e `registro-costi.mjs`, che invece ci
   sono. Se avessi scritto quel risultato sarebbe finito in un commit come un
   fatto.
2. Il primo filtro dei file usava `readdirSync` e trovava anche
   `.sdk-under-test*.mjs` — **copie dell'SDK generate a runtime**, non suite.
   Il criterio giusto non è «non comincia per punto» (una regola sul nome) ma
   «fa parte del progetto», e quello lo dice **l'indice di git**. Una suite vera
   è committata, quindi quel filtro non può nasconderne una.

## Verifica

`suite-collegate` **3/0** (42 file guardati), `date-checkpoint` **3/0**,
`run-stile` 271/0, `run-kpi` 1108/0, `run-demo` 8/0, `run-helpers` 49/0, sonda
del vuoto 7/0, `numeri-nei-documenti` **17/17** — quest'ultima è caduta appena
aggiunti i due banchi (diceva 35, `tutti.mjs` ne elencava 37) e i documenti sono
stati aggiornati **dalla misura**. YAML della CI validato.
Controprova di `suite-collegate` su testi in memoria, senza toccare file: vede
la suite muta, **non** la misura dichiarata, **non** il banco elencato in
`tutti.mjs`, **sì** quello non elencato, e **non accetta un marcatore sepolto**
a riga 41 — se no basterebbe nominarlo in un commento qualunque per sparire dai
radar.

Il giro del browser in corso non è stato disturbato: **304 asserzioni**, nessun
«GIRO NON VALIDO» (i file dei test non sono fra quelli di cui prende
l'impronta).

## Prossimo passo atomico

Leggere il giro fino in fondo. ⚠️ Va detto che i **due banchi appena agganciati
non sono in quel giro**: è partito prima, dalla copia congelata di `04f5ce6`.
Andranno visti al giro successivo — e `giro-su-copia.mjs`, che è la prova del
meccanismo, merita di essere lanciato anche da solo prima di allora.
