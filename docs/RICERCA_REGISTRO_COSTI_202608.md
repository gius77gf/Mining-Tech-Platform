# Il registro costi — ricerca prima di scriverlo

*03/08. È la seconda voce del censimento di Conti, descritta come «la porta
d'ingresso obbligata: senza costi, marginalità e pareggio non possono nemmeno
cominciare, e Conti resta capace di dire quanto **incassi**, mai se
**guadagni**». La scheda parte da una domanda che la voce del censimento non si
era posta: **esiste già?***

---

## 1. Sì, esiste — e non è in Conti

Conti non ha nessuna traccia delle **uscite dell'azienda**: sette collezioni
(`clienti`, `fatture`, `gare`, `impostazioni`, `pesate`, `prodotti`, `incassi`)
e nessuna funzione che le tenga. *(Le uniche due che nominano una spesa —
`SPESE_RECUPERO_231` e `interessiMora` — sono somme che si **chiedono al
cliente** in un sollecito, non che l'azienda paga: vanno dalla parte opposta.)*
Ma **Flotta ce l'ha**, ed è fatto bene:

```
costi/{id}: { voce, importo (EUR), nota, data (ISO)|null }
```

con due funzioni pure già collaudate — `ripartizioneCosti` (accorpa per voce e
dà l'incidenza %) e `costiPerMese` — e con le **regole di onestà già scritte
dentro**, testuali dal file:

- «le voci **senza data** non vengono attribuite a nessun mese — restano contate
  a parte, così l'utente sa che esistono. Attribuirle a *oggi* sarebbe
  inventare»;
- «i mesi senza NESSUNA voce registrata **non compaiono**: un mese senza
  registrazioni **non è un mese a zero euro**, è un mese di cui non si sa
  niente. Quanti sono lo dice `mancanti`, per poterlo scrivere».

> **Questo cambia l'unità.** Scrivere «il registro costi di Conti» da zero
> vorrebbe dire un **secondo** registro costi nell'ecosistema — esattamente la
> duplicazione che è costata una giornata intera con la convenzione sui numeri,
> e che la regola vincolante di `CLAUDE.md` vieta: *una regola che serve a due
> app vive in `shared/`, e mai riscritta.*

---

## 2. Ma quello di Flotta non basta, ed è giusto così

Il registro di Flotta è **della flotta**: risponde a «dove va la spesa delle
macchine», non a «la cava guadagna». Tre limiti, tutti strutturali:

1. **la `voce` è testo libero.** Va benissimo per accorpare «gasolio» e
   «ricambi»; non regge una domanda come «quanto pesa il costo **fisso**
   quando la produzione si dimezza», che ha bisogno di una classificazione, non
   di un'etichetta scritta a mano ogni volta;
2. **non c'è posto per i costi che non sono della flotta**: personale, energia
   elettrica dell'impianto, esplosivo, analisi e consulenze, canone di
   escavazione, ammortamenti, accantonamento per il **ripristino**;
3. **non c'è legame con la produzione**: nessun collegamento a un prodotto, a un
   periodo di produzione o a una quantità, quindi nessun **costo per
   tonnellata**.

### Quanto pesa quello che manca

Il riferimento di letteratura più vicino (miniera a cielo aperto, quindi
**indicativo** e non nostro) ripartisce l'OPEX di estrazione così: **trasporto
40,5%**, **caricamento 22,0%**, **abbattimento 19,0%**, **perforazione 15,1%**.
Il primo blocco è flotta; il secondo — perforazione e mina — è **esplosivo,
servizi e manodopera**, cioè fuori da qualunque registro di macchine. E gli
studi sul settore aggregati aggiungono un dato che qui pesa: il costo della
**volata** vale il 10–20% del totale ma **determina** l'efficienza a valle, al
punto che una volata mal fatta può alzare il costo totale del **20–40%**.

Tradotto: un registro che tiene solo la flotta vede meno di due terzi della
spesa, e **non vede proprio** la parte che l'ecosistema è più attrezzato a
spiegare.

---

## 3. Il vantaggio che nessun concorrente ha (e che va sfruttato qui)

I prodotti migliori della categoria vendono esattamente questo: *«margine per
prodotto e costo per tonnellata, per via del collegamento campo → contabilità»*
(«field-to-ledger linkage»). E l'elenco dei costi indiretti che citano —
monitoraggio ambientale, accantonamento per il **ripristino del sito** —
in Deepwork **sono già app**.

| voce di costo | chi in Deepwork ne conosce già i numeri |
|---|---|
| perforazione e mina | **Genesi** (progetto della volata, esplosivo, fori) |
| trasporto e caricamento | **Flotta** (gasolio, ore, officina, fermi) |
| manodopera di turno | **Campo** (presenze, ore, fermi) |
| monitoraggio ambientale | **Sentinella** (campagne, letture) |
| canone di escavazione | **Conti** già lo *calcola* da **Terra** |
| ripristino | **Terra** (voce in roadmap) |

Nessuno dei prodotti guardati ha le sei cose insieme. Il registro costi non è
quindi «una tabella di uscite»: è **il punto in cui i sei cantieri diventano
soldi**. Ed è il motivo per cui vale la pena farlo bene invece che presto.

---

## 4. La trappola numero uno: contare due volte

Non è un rischio teorico — **Flotta l'ha già incontrata al suo interno** e ci ha
messo una difesa. Dal suo schema, testuale:

> `rifornimenti/{id}: { …, costoId|null }` — «`costoId` è la voce di costo
> gemella, così il rifornimento entra **una sola volta** nella spesa».

La stessa forma si ripresenta **fra le app**, e in un caso che è già scritto e
funzionante: il **canone di escavazione** lo *calcola* Conti (`canonePeriodo`)
leggendo i rilievi di Terra. Se qualcuno lo scrive **anche** come voce di costo
— e lo farà, perché è una spesa vera che si vede sull'estratto conto — il
canone entra due volte e il margine scende di un numero che non esiste.

> **Decisione 1 — ogni voce di costo dichiara la sua provenienza.**
> `origine: "manuale" | "flotta" | "calcolata"`, e le calcolate **non si
> digitano**: compaiono da sole, con scritto da dove vengono e con il link a chi
> le ha prodotte. Una voce manuale che duplica una calcolata dev'essere
> **segnalata**, non silenziosamente sommata.

---

## 5. La trappola numero due, ed è quella che vale la scheda

`costiPerMese` di Flotta dice già la cosa giusta: **un mese senza registrazioni
non è un mese a zero euro**. Ma quel principio, che lì produce solo una nota,
diventa una **bomba** appena ci si costruisce sopra un margine.

Un margine si calcola come `ricavi − costi`. I ricavi in Conti sono **completi
per costruzione**: nascono dalle pesate e dalle fatture, che qualcuno ha dovuto
emettere. I costi sono completi **solo se qualcuno li ha inseriti**. Il mese in
cui la busta paga non è stata registrata non produce un errore: produce
**«margine 42%»**, in verde, in cima alla pagina.

È il numero più pericoloso che questa app possa mostrare, ed è esattamente la
forma del principio già trovato in tre app: **l'assenza di un dato non è un dato
favorevole**, e il segno che è stato violato è sempre lo stesso — *un numero o un
colore tranquillo dove non è stato misurato niente*.

> **Decisione 2 — il margine è `null` finché i costi non sono dichiarati
> completi.** Non zero, non «parziale» in piccolo: **assente**, con scritto che
> cosa manca. Serve un modo perché l'utente dica «per questo mese ho finito di
> inserire» — una **chiusura del mese**, che è anche il gesto naturale di chi
> tiene i conti. Prima della chiusura la pagina mostra i costi inseriti e
> **rifiuta** di dividerli per le tonnellate.
>
> E il corollario: **una categoria mai usata non è una categoria a zero.** Se
> non c'è nessuna voce «personale» in nessun mese, il costo del personale non è
> zero — è non registrato, e va detto **prima** di mostrare un costo/t.

---

## 6. La forma proposta

### Dove stanno i dati

**Conti prende una collezione sua** `costi/{…}` per ciò che Flotta non può
tenere, e **legge quella di Flotta** attraverso il ponte in sola lettura che
esiste già e funziona — `db.rilieviTerra()` in `conti-data.js:1470`: seconda
istanza dell'SDK sull'altra `appId`, stessa organizzazione, `orgCollection` per
il percorso, aperta solo quando serve, e che **torna `null` invece di inventare
uno zero** se l'app non c'è o la lettura non è permessa. Si copia quel modello
con `db.costiFlotta()`.

*(Perché non spostare tutto in Conti: perché Flotta usa i suoi costi per il costo
orario del mezzo e per l'affidabilità, che sono domande della manutenzione, non
dell'amministrazione. Spostarli renderebbe Flotta dipendente da Conti per
funzionare — e le app si vendono anche da sole.)*

### Che cosa va in `shared/`

La **classificazione** serve a tutt'e due, quindi non può stare nel modulo di
una delle due:

- `CATEGORIE_COSTO` — con, per ognuna: etichetta, **fisso/variabile**, e la
  ragione scritta. Le voci: perforazione e mina · carburante · manutenzione e
  ricambi · personale · energia · trasporti terzi · canone e oneri ·
  monitoraggio ambientale · consulenze e analisi · assicurazioni · ammortamenti ·
  ripristino (accantonamento) · altro;
- `categoriaDi(voce)` — il ponte con le voci di **testo libero** già scritte in
  Flotta: la classificazione dev'essere *indovinata* per quelle vecchie e
  **dichiarata come indovinata**, non spacciata per scelta dell'utente.

Il modulo di ogni app le **ri-esporta** col nome con cui le chiama, così le
pagine non cambiano — e il test pretende l'**identità** (`conti.X === ponti.X`),
non il comportamento.

### Le funzioni pure che ne escono

1. `CATEGORIE_COSTO`, `categoriaDi` *(in `shared/dw-ponti.js`)*;
2. `costiPeriodo(costi, dal, al)` — con **`completo: false`** e l'elenco di che
   cosa manca, non un totale che sembra pieno;
3. `costiPerCategoria(costi, dal, al)` — fisso vs variabile, incidenza %;
4. `costoPerTonnellata(costi, pesate, dal, al)` — **`null`** se il periodo non è
   dichiarato completo, con il perché;
5. `marginePerProdotto(pesate, costi, dal, al)` — i costi diretti dove sono
   attribuibili, gli indiretti ripartiti **con il criterio dichiarato** (non «a
   tonnellata» di nascosto);
6. `puntoDiPareggio(costiFissi, margineUnitario)` — le tonnellate che coprono i
   fissi, e `null` se il margine unitario non è positivo (non «infinito», e
   nemmeno un numero enorme che sembra un numero);
7. `doppioniCosto(costiManuali, costiCalcolati)` — la difesa della Decisione 1.

**Il primo test da scrivere non è l'aritmetica del margine**: è che
`costoPerTonnellata` risponda **`null`** su un periodo con pesate e **senza**
nessuna voce di personale. È il difetto che questa scheda esiste per impedire.

---

## 7. Che cosa questa scheda NON decide

- **Le percentuali di ripartizione** dei costi indiretti fra prodotti: è una
  scelta contabile del titolare, non del software. L'app offre due criteri
  espliciti (a tonnellata, a valore) e scrive quale ha usato.
- **Gli ammortamenti**: hanno regole fiscali proprie e un piano che il
  commercialista già tiene. Qui entrano come **voce inserita**, non calcolata.
- **L'accantonamento per il ripristino**: dipende dalla voce di Terra che non
  esiste ancora (`ripristino ambientale`, censimento Terra). La categoria si
  crea adesso perché il posto ci sia; il numero arriva quando Terra lo produce.
- **Il collegamento automatico Genesi → costo della volata**: è la voce più
  ricca dell'elenco, e merita una scheda sua. Qui si prepara solo la categoria.

---

## Fonti

- [Drilling & Blasting — P&Q University Handbook (Pit & Quarry)](https://www.pitandquarry.com/drilling-blasting-pq-university-handbook/)
- [Maximizing your cost per ton (Pit & Quarry)](https://www.pitandquarry.com/maximizing-your-cost-per-ton/)
- [Distribution of Operating Costs Along the Value Chain of an Open-Pit Mine (MDPI, Applied Sciences 15/3)](https://www.mdpi.com/2076-3417/15/3/1602)
- [A study in cost analysis of aggregate production as depending on drilling and blasting design (ScienceDirect)](https://www.sciencedirect.com/science/article/abs/pii/S1464343X17303047)
- [Quarry Accounting Systems and Financial Management (Hello Gravel)](https://hellogravel.com/quarry-accounting-systems-and-financial-management-for-2026/)
- [Equipment Management Software for Quarry & Aggregates (Clue)](https://www.getclue.com/industries/aggregate-and-quarry)
- [Essential Systems and Software for the Modern Quarry (CEBA Solutions)](https://www.cebasolutions.com/blog-posts/essential-systems-and-software-for-the-modern-quarry)
