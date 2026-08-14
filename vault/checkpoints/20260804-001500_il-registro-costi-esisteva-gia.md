# Checkpoint — il registro costi esisteva già, e non era in Conti

**Commit:** *(questo)*
**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`
**Documento:** `docs/RICERCA_REGISTRO_COSTI_202608.md`

## La domanda che il censimento non si era posta

La voce diceva «registro costi: la porta d'ingresso obbligata, senza costi
marginalità e pareggio non possono nemmeno cominciare». Giusta, ma dava per
scontato che si partisse da zero. La prima cosa che ho fatto è stata chiedermi
**se esistesse già** — e la risposta è **sì, in Flotta**:

```
costi/{id}: { voce, importo (EUR), nota, data (ISO)|null }
```

con `ripartizioneCosti` e `costiPerMese` già scritte e collaudate, e con le
regole di onestà **già dentro**: le voci senza data non si attribuiscono a
nessun mese, e «un mese senza registrazioni **non è un mese a zero euro**».

Scrivere «il registro costi di Conti» da zero sarebbe stato un **secondo**
registro nell'ecosistema — la duplicazione che la regola vincolante vieta, e
che questa settimana è già costata una giornata.

## Ma non basta, e i limiti sono strutturali

Il registro di Flotta risponde a «dove va la spesa delle macchine», non a «la
cava guadagna»: `voce` a **testo libero** (nessun fisso/variabile), nessun posto
per personale, energia, esplosivo, canone, ripristino, e **nessun legame con la
produzione** — quindi nessun costo per tonnellata.

Ordine di grandezza di ciò che resta fuori (letteratura, miniera a cielo
aperto, quindi **indicativo e non nostro**): trasporto 40,5% e caricamento
22,0% sono flotta; perforazione 15,1% e abbattimento 19,0% **no**. E negli
aggregati il costo della volata vale il 10–20% del totale ma **determina** il
costo a valle, al punto che una volata mal fatta alza il totale del 20–40%.

## La trappola che vale la scheda

I **ricavi** in Conti sono completi per costruzione: nascono dalle pesate e
dalle fatture, che qualcuno ha dovuto emettere. I **costi** sono completi solo
se qualcuno li ha inseriti. Il mese in cui la busta paga non è stata registrata
non produce un errore: produce **«margine 42%»**, in verde, in cima alla pagina.

È il numero più pericoloso che questa app possa mostrare, ed è la solita forma:
**l'assenza di un dato non è un dato favorevole**, riconoscibile dal solito
segno — un numero tranquillo dove non è stato misurato niente.

**Decisione:** il margine è **`null`** finché il mese non è dichiarato
**chiuso** — non zero, non «parziale» scritto in piccolo. E il corollario: una
**categoria mai usata non è una categoria a zero**.

## La seconda trappola: contare due volte

Non è teorica: Flotta l'ha già incontrata **al suo interno** e ci ha messo una
difesa (`rifornimenti.costoId`, «così il rifornimento entra una sola volta nella
spesa»). Fra le app si ripresenta col **canone di escavazione**, che Conti già
*calcola* leggendo i rilievi di Terra: se qualcuno lo scrive **anche** a mano —
e lo farà, perché è una spesa vera — il margine scende di un numero che non
esiste. Quindi ogni voce dichiara la sua `origine`, e le **calcolate non si
digitano**.

## La forma proposta

- Conti prende una collezione sua per ciò che Flotta non può tenere, e
  **legge** quella di Flotta col ponte in sola lettura **che esiste già e
  funziona**: `db.rilieviTerra()` in `conti-data.js:1470` — seconda istanza
  dell'SDK sull'altra `appId`, aperta solo quando serve, e che torna **`null`
  invece di inventare uno zero**.
- La **classificazione** (`CATEGORIE_COSTO`, `categoriaDi`, fisso/variabile) va
  in `shared/dw-ponti.js`: serve a due app, quindi non può stare nel modulo di
  una delle due. Ogni app la ri-esporta col nome con cui la chiama, e il test
  pretende l'**identità**.
- Sette funzioni pure. **Il primo test non è l'aritmetica del margine**: è che
  `costoPerTonnellata` risponda **`null`** su un periodo con pesate e **senza**
  nessuna voce di personale.

## Il vantaggio che va sfruttato qui

I prodotti migliori vendono «margine per prodotto e costo per tonnellata grazie
al collegamento campo → contabilità». I costi indiretti che citano —
monitoraggio ambientale, accantonamento per il ripristino — in Deepwork **sono
già app**: Genesi conosce la mina, Flotta il trasporto, Campo la manodopera,
Sentinella il monitoraggio, Terra il ripristino, Conti il canone. Il registro
costi non è una tabella di uscite: è **il punto in cui i sei cantieri diventano
soldi**.

## In corso

Il **giro a 25 banchi** del browser è ancora vivo. Finché gira: `docs/`,
`vault/` e le suite `node`; nessuna modifica a moduli e pagine.

## Prossimo passo atomico

Quando il giro finisce, in ordine:

1. **Genesi unità A** — il piano è misurato e sei prove dicono se è stato fatto
   (`docs/LA_STRUTTURA_DEL_CORE_SCRITTA_SEI_VOLTE.md`);
2. **Conti — nota di credito**, dalle sette funzioni di
   `docs/RICERCA_NOTE_DI_CREDITO_202608.md`, cominciando dalla prova su
   `tempoMedioPagamento`;
3. **Il registro costi**, da questa scheda, cominciando da `CATEGORIE_COSTO` in
   `shared/dw-ponti.js` e dalla prova sul `null`.

## Nessun blocco

Restano aperte le decisioni del fondatore in `DECISIONI_WEEKEND.md` (punti
5a/5b, 10, 11, 12, 13, 14, 15) più la domanda su **Firebase Storage** per le
foto di Scudo.
