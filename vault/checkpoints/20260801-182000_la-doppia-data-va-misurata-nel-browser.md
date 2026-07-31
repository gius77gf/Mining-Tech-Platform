# Checkpoint — la doppia data non si misura leggendo il codice

- **Tipo**: misura preparatoria, **dichiarata insufficiente** (nessuna unità)
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`

## Cosa volevo misurare

Il dettaglio **8** dei «dieci dettagli che fanno sembrare il prodotto curato»
(`docs/RICERCA_VALORE_PRODOTTO_202607.md`): *le date in doppia forma* — «scade
tra 5 giorni (12/08/2026)». Il tempo relativo si capisce al volo, la data
assoluta serve per parlarne al telefono.

## Il numero, e perché lo butto

Prima lettura: **8 tempi relativi in sei app, 8 senza la data accanto**.

Due cose non tornavano, e bastava guardarle:

1. **Campo, Scudo e Terra risultavano a zero.** Un'app con lo scadenzario che
   non mostra mai un tempo relativo non è credibile.
2. Tre degli otto «trovati» erano un **commento**, un `<label>` e un attributo
   `title` — cioè non erano quello che cercavo.

Verificato: Scudo importa `giorniTra` ma lo usa **solo per validare** (niente
date nel futuro), e Campo, Terra e Conti non lo importano affatto. Ognuno si
compone il tempo relativo per conto suo, con nomi diversi (`ritardo`, `gg`).

## Il metodo giusto, per la prossima volta

**Non si legge nel codice: si legge nella pagina.** Il tempo relativo nasce al
momento del disegno, da variabili che ogni app chiama a modo suo — cercarlo nel
sorgente è come cercare il maiuscolo delle unità di misura nel CSS invece che
in `getComputedStyle`: il posto sbagliato, con la risposta sbagliata.

Il banco giusto assomiglia a `unita-maiuscole.mjs`: si visitano tutte le
sezioni, si legge il **testo reso**, si cercano le forme «tra N giorni»,
«scaduta da N», «in ritardo di N» e si pretende che nello **stesso elemento**
compaia anche una data in cifre. E si stampa quanti testi si sono guardati.

Non lo scrivo adesso perché il browser sta girando il giro dei 17 banchi, e
un secondo Chromium in parallelo falserebbe le misure di tempo degli altri.

## Perché scrivo un checkpoint per una misura che non uso

Perché è la terza volta oggi che una sonda testuale mi dà un numero plausibile e
sbagliato, e le prime due volte l'ho scoperto **dopo** averci costruito sopra.
Fermarsi a otto minuti di lavoro costa molto meno che riscrivere le date di sei
app sulla base di un conteggio che guardava tre commenti.

## Prossimo passo atomico

Leggere il riepilogo del giro a 17 banchi. Poi, se verde: il banco della
**doppia data** sul testo reso, sul modello di `unita-maiuscole.mjs`, con la
sua controprova (una data relativa senza assoluta iniettata in ogni superficie,
che deve essere trovata).

## Bloccanti

- Nessuno.
