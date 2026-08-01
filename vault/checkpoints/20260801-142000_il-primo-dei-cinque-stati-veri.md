# Il primo dei cinque stati veri

**Data:** 01/08/2026 · **Area:** `apps/deepwork-id/tests/browser/stati-non-misurati.mjs`
**Unità precedente:** `20260801-134500_non-si-sa-contro-non-si-salta.md`

## Preso il primo della lista

Dei cinque stati veri usciti dalla lettura a mano, il primo: **Flotta, un
tagliando a ore su un mezzo di cui non si conosce il ritmo**. Il cartellone
scrive «+1 a ore: **non si sa quando**» invece di stimare a caso una data — che
su una manutenzione è la differenza fra un piano e un'invenzione.

## ⚠️ E qui la dimostrazione bastava già — ma l'ho creduto il contrario

Il primo controllo diceva `letture contatore: 0` e mi ero convinto che il caso
non ci fosse. **Era la mia chiamata a essere sbagliata**: passavo l'intero
oggetto `DEMO` a `ritmoOreMezzi`, che vuole le **letture** — e le letture in
Flotta non sono una collezione a sé, sono i **rifornimenti** e i **giri
macchina**, che portano tutt'e due il contatore. Chiamandola come la chiama la
pagina: `daStimare: 1`. Il caso c'era da sempre.

È la stessa forma di ieri sera con `statoScadenza` e `scadenzeDiChiLavora`:
**leggere come il codice si aspetta i dati prima di dire che i dati non ci
sono**. Terza volta in un giorno; ogni volta stavo per aggiungere dati alla
dimostrazione che non servivano.

## Il contenitore giusto

Il testo vive in `<span class="s" id="kpi-tag-s">`, dentro la piastrella
`#kpi-tag` del cartellone. Il banco punta alla **piastrella**, non allo span:
è l'unità che l'utente vede, come `.board` per l'appello di Campo. Aggiunto
`.kpi` all'elenco dei selettori — che, come dice il commento lassù, è anche la
**dichiarazione di dove il banco ha guardato**.

## La controprova

Cambiati i due `daStimare.push` in `voci.push` (−10 caratteri): i tagliandi non
stimabili finiscono fra i normali, cioè l'app smette di dire «non si sa» e li
conta come se la data si sapesse. Il banco cade sul caso giusto. Ripristinato,
`git status` vuoto.

## Verifica

`stati-non-misurati` **38/0** — 18 stati, 6 app. `run-stile` 271/0, `run-kpi`
1119/0, `suite-collegate` 46 file.

## Prossimo passo atomico

Gli **altri quattro** stati veri, nell'ordine in cui conviene:
1. **Flotta**, «Quando cadrà non si sa: …» — stessa app, ma non compare nel
   cartellone: sta nel dettaglio di una manutenzione, quindi va prima trovato a
   schermo (una sezione, forse un tocco su una riga);
2. **Conti**, «senza scadenza: non si sa entro quando» su una fattura;
3. **Conti**, «non si sa, e finché è così resta fuori» (fatture fuori dai
   termini);
4. **Terra**, «questo lotto non dichiara nessun fronte…».
Per ognuno, l'ordine imparato stanotte: **prima** guardare se la
dimostrazione lo produce — chiamando le funzioni **come le chiama la pagina**,
non a intuito — e solo dopo decidere se aggiungere dati o solo la riga del
banco.
