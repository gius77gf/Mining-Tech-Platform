# Checkpoint — l'ordine predefinito ha già una testa

- **Tipo**: misura conclusa con esito negativo (nessuna unità da fare)
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`

## La domanda

Il dettaglio **6** dei «dieci dettagli» (`RICERCA_VALORE_PRODOTTO_202607.md`):
*«Mai ordinare per nome perché è l'ordine naturale. In cima va ciò che chiede
attenzione.»* Le nostre liste lo rispettano?

## Il numero, e le due potature che sono servite

**137 ordinamenti** in sei app (pagine + moduli dati). Il primo conto diceva
«29 alfabetici», ma erano da potare due volte:

1. **I pareggi.** `b.conto - a.conto || a.causale.localeCompare(...)` ordina per
   quantità e usa il nome **solo per rompere la parità**: è la cosa giusta, e il
   mio classificatore l'aveva contato fra gli alfabetici perché nella riga vedeva
   `localeCompare` e non riconosceva `conto` come urgenza. Tenendo solo quelli
   con il nome come **prima** chiave: da 29 a **14**.
2. **Le date confrontate come stringhe.** `a.data.localeCompare(b.data)` su una
   data ISO è un ordinamento **cronologico**, non alfabetico. Altri cinque via.

Restano **nove**, e leggendoli uno per uno sono **tutti giusti**:
- gli elenchi per scegliere un nome (operatori di una squadra, lavoratori da
  spuntare per una mansione): lì si cerca un nome, e l'alfabetico è ciò che
  serve;
- gli **export CSV** di Flotta — e dentro lo stesso export le manutenzioni sono
  ordinate **per data**, cioè chi doveva scegliere ha scelto bene;
- l'**anagrafica** del personale di Scudo, che ha la sua casella di ricerca: le
  scadenze che chiedono attenzione vivono nello scadenzario, che è un'altra
  schermata e ordina per urgenza.

E i **30** ordinamenti per urgenza (scadenza, ritardo, residuo, stato) sono
esattamente nelle liste che chiedono attenzione.

## Perché lo scrivo invece di cambiare qualcosa

Perché il rischio vero, qui, era **fare un danno**: un ciclo successivo che
legga «29 liste ordinate per nome» e le riordini per urgenza romperebbe nove
tendine in cui l'ordine alfabetico è l'unica cosa sensata. La voce si chiude
con un numero e una spiegazione, così nessuno la riapre per sbaglio.

È il secondo «misurato, e va già bene» della giornata (il primo sono i messaggi
d'errore). Vale la pena dirlo: su dieci dettagli della ricerca, due sono
risultati **già fatti**, e trovarlo è costato molto meno che rifarli.

## Prossimo passo atomico

Leggere il riepilogo del giro a 17 banchi (in corso, al primo banco). Poi il
banco della **doppia data** sul testo reso, che è il dettaglio 8 e l'unico dei
tre guardati oggi che risulti davvero da fare.

## Bloccanti

- Nessuno.
