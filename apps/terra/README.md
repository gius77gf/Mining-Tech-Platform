# Terra

App estrattivo & rilievo. Buyer: direttore cava.

## Come Terra conta i volumi

Ogni rilievo elaborato porta una **provenienza**:

- **scavo** — materiale nuovo tolto dal fronte. Consuma il volume concesso
  dall'autorizzazione, entra nel contatore vita cava, nell'avanzamento del
  piano, nei volumi per mese e per fronte, nel valore del materiale.
- **cumulo** — materiale già estratto in passato e ripreso da un mucchio sul
  piazzale. Si conta **a parte**: non consuma il concesso e non entra nei
  totali di estrazione, perché quel metro cubo era già stato scavato (e già
  scalato) a suo tempo.

I rilievi salvati **prima** che il campo esistesse non hanno `provenienza` e
valgono **scavo**: si comportano esattamente come prima, nessun numero
mostrato cambia e non si perde nulla. Vale anche per l'import CSV, dove la
colonna `provenienza` è la sesta e facoltativa (vale `cumulo` solo se scritta
così).

## Riepilogo annuale (scheda Denuncia)

Vista per anno pensata per chi compila la comunicazione periodica dei volumi
all'ente: mese per mese (compresi i mesi a zero, che nei moduli vanno
dichiarati), ripartizione per fronte, cumulato sotto il titolo con pregresso,
confronto col volume concesso e residuo, storico anno per anno.

Si consegna in due modi: **stampa** (pagina bianca con firma, salvabile in
PDF) ed **export CSV**.

Terra non conosce nessuna regola regionale: modello, termini e modalità di
invio cambiano da regione a regione e restano da verificare presso l'ente.

## Verbale di rilievo (scheda Rilievi)

Ogni rilievo elaborato ha il tasto **verbale**: prepara una pagina bianca da
stampare o salvare in PDF con data, fronte, che cosa è stato misurato (scavo o
cumulo), metodo, GSD, classe di accuratezza con la sua tolleranza, volume con
la banda, il titolo autorizzativo di riferimento, il rilievo precedente da cui
parte la misura e le righe di firma (luogo e data, rilevatore, direttore dei
lavori). È il documento che rende il numero difendibile davanti a un ente.

Prima di prepararlo Terra chiede **chi ha eseguito il rilievo**: il nome resta
salvato sul rilievo (campo `rilevatore`, facoltativo). I rilievi salvati prima
non ce l'hanno: nel verbale resta la riga da compilare a penna, niente si
rompe.

## Confronto fra due rilievi (scheda Rilievi)

Risponde a «quanto abbiamo cavato da lì fra marzo e luglio». Si scelgono un
fronte e due rilievi **di scavo elaborati** di quel fronte; Terra mostra i m³
scavati fra le due date, i giorni e il ritmo implicito (al giorno e al mese).

Il conto **somma** i rilievi successivi al primo fino al secondo compreso: in
Terra ogni rilievo porta il materiale tolto da quando c'era quello prima,
quindi sottrarre i due volumi darebbe un numero che non è materiale. La
differenza fra le due misure si mostra lo stesso, ma dichiarata per quello che
è: un confronto di ritmo.

## Oneri di escavazione (scheda Denuncia)

Terra mostra solo la **base**: i m³ di scavo dell'anno (le riprese dai cumuli
restano fuori). Il calcolo in euro **non si duplica**: l'aliquota €/m³ o €/t si
imposta in **Conti**, sezione «Canoni e diritti di escavazione», ed è lì che
viene applicata. Diverse regioni applicano la tariffa al volume al netto del
materiale usato per il recupero ambientale, e per la pietra ornamentale alla
sola quantità commercializzata: la regola è dell'utente, non del codice.
