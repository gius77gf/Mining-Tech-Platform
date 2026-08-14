# I cantieri che sembravano gli stessi

**Data:** 01/08/2026 · **Area:** Conti / Scudo (modello dei dati) + prova a secco della CI
**Unità precedente:** `20260801-060500_il-fuso-che-non-c-entrava.md`

## Il punto di partenza

Dei cinque documenti prioritari, l'unico buco di **dati** rimasto è il DDT di
Conti: servono `cantieri` e `vettori`, e nel modulo ce ne sono **zero
riferimenti**. Prima di scriverli, la regola di casa: cercarli.

## ⚠️ Esistono già — in un'altra app, e vogliono dire un'altra cosa

**Scudo ha una collezione `cantieri`**: `{ nome, comune, tipo: cava|cantiere,
stato }`, viva e in dimostrazione, con **28 riferimenti** nella sua pagina. La
tentazione di riusarla è forte, ed è pure sostenuta dal valore dichiarato
dell'ecosistema: *un dato inserito una volta, utile in cinque posti*.

**Ma non sono la stessa cosa, e si vede da chi le legge.** In Scudo i cantieri
sono puntati da:

- `documenti` → il **DSS** di quel sito;
- `ispezioni` → i controlli periodici che **lì** vanno fatti.

Cioè sono *i luoghi dove l'azienda lavora e ha obblighi di sicurezza*. Il
cantiere di un DDT è *dove è stato consegnato il materiale*: di solito un posto
dove la nostra azienda non mette piede.

Fonderle vorrebbe dire far comparire gli **indirizzi di consegna** nelle tendine
del DSS e delle ispezioni, e nei conteggi della sicurezza: **siti fantasma con
obblighi che nessuno ha** — un allarme inventato dove non c'è niente da
presidiare, che è la faccia speculare del principio di questa settimana.

## La decisione, e perché l'ho presa io

**Conti si tiene la sua lista; Scudo non si tocca.** È la scelta prudente e
reversibile, e non richiede il fondatore perché non cambia niente di quello che
c'è. Quello che *richiederebbe* il fondatore è l'operazione opposta — una lista
sola con un flag «qui lavoriamo / qui consegniamo» — ed è annotata come
possibile, non fatta.

⚠️ Le anagrafiche **non le ho scritte stanotte**: senza la pagina del DDT
sarebbero dati che nessuno legge, cioè la stessa forma dei banchi che nessuno
lanciava, trovata poche ore fa. Si scrivono insieme alla pagina.

## Prova a secco della CI

Lanciate **tutte** le suite dell'elenco di `npm test` che non vogliono
l'emulatore Firebase, in ordine, con `TZ=Europe/Rome`:

| suite | esito |
|---|---|
| run-helpers | 49 / 0 |
| run-kpi | **1113** / 0 |
| run-pointcloud | 26 / 0 |
| run-manifest | 9 / 0 |
| run-stile | **271** / 0 |
| run-demo | 8 / 0 |
| orologio-cliente | 3 suite in ora italiana, 0 cadute |
| sonda-vuoto | 7 / 0 — *7 tranquilli trovati, 7 dichiarati* |
| numeri-nei-documenti | 17 / 0 — 37 banchi, copertura 458/458 |
| copertura-funzioni | 9 soggetti a posto, 0 funzioni senza prova |
| nomi-doppi | 26 nomi, 0 da sistemare |
| date-checkpoint | 3 / 0 — 662 checkpoint letti |
| suite-collegate | 3 / 0 — 43 file, tutti in una delle tre case |
| impronta (controprova) | 6 / 0 |
| impronta-giro | 7 / 0 |

Nessuna rossa. È la verifica che copre le dieci unità di questo ciclo in un
colpo solo, ed è il modo giusto di guardarle: non «i test che ho toccato», ma
**tutto quello che la CI lancerà**.

## ⚠️ E un inciampo di processo, il secondo in due unità

Il primo tentativo di questo commit è fallito perché la directory di lavoro era
rimasta dentro `apps/deepwork-id/tests/` dalla prova a secco: i percorsi
relativi puntavano nel posto sbagliato, il checkpoint non è stato creato e
`git add` non ha trovato niente. **Il commit non è partito**, ed è la cosa
giusta — ma solo perché git non aveva niente in scena, non perché me ne fossi
accorto.

Sommato al tick di roadmap saltato dell'unità precedente, fa due volte in due
unità che un passo non ha fatto quello che credevo. Rimedio adottato: `cd` alla
radice **esplicito** prima di ogni blocco che tocca file, e leggere l'esito
dello script prima del commit, non dopo.

## Prossimo passo atomico

Il giro del browser è a **20 banchi su 37** e 364 asserzioni, senza nessun KO
fuori dalle sezioni di controprova. Quando finisce, nell'ordine:
1. leggerlo fino in fondo;
2. lo **scatto delle cinque righe di Scudo** (debito dichiarato dal cantiere);
3. la **pagina del riepilogo annuale di Terra** con `descriviOnere`;
4. e solo allora **anagrafiche + DDT** in Conti, insieme alla loro pagina.
