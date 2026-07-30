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

## Numeri scritti a mano: la virgola decimale

Chi compila Terra è un direttore di cava italiano: scrive **«1,6»** e
**«148,50»**. Fino a ieri i campi decimali erano `<input type="number">`, e
quel tipo di campo **non è neutro rispetto alla virgola**: la specifica HTML
gli impone come valore un numero col PUNTO. Misurato in Chromium (identico in
locale `en-US` e `it-IT`, quindi `lang="it"` non c'entra):

| digitato da tastiera | cosa arrivava al codice |
|---|---|
| `2,4` | `24`, e `checkValidity()` rispondeva **true** |
| `4.200` | `4.2` → con `parseInt` diventava **4 m³** invece di 4.200 |

Su `#val-densita` il primo caso moltiplica per dieci tonnellate e valore del
materiale; su `#new-ril-vol` il secondo cancella quasi quattromiladuecento
metri cubi dal contatore che dice quanta concessione resta — cioè dai due
numeri con cui Terra risponde a «quanto posso ancora cavare».

**Adesso i campi decimali sono `<input type="text" inputmode="decimal">`** (sul
telefono la tastiera resta numerica) e il numero lo legge `numeroDaCampo()` in
`terra-data.js`, che accetta `2,4` · `2.4` · `1.200.000` · `1.250,75`.
`min`/`max`/`step` del browser non valgono più: la validazione è nostra.

| decimali (`type="text" inputmode="decimal"`) | interi (restano `type="number"`) |
|---|---|
| `aut-superficie` (m²), `aut-volume` (m³), `aut-pregresso` (m³), `fro-quota` (m), `val-densita` (t/m³), `val-prezzo` (€/t), `new-ril-vol` (m³), `new-ril-gsd` (cm), volume annuo del piano (modale) | `aut-soglia` (% di guardia), `aut-anni` (anni di ritmo medio), `aut-preavviso` (giorni), `new-scad-pre` (giorni), `new-scad-ric` (mesi) |

Sugli interi la virgola non serve e lo spinner del browser è un aiuto: giorni,
mesi, anni e una soglia percentuale di guardia non hanno decimali.

**Per un valore non capito non si salva zero.** Un rilievo a zero metri cubi
dichiara «non è stato tolto niente», e all'ente è una dichiarazione falsa: il
salvataggio si ferma e il toast del core dice cosa non torna. Lo stesso per il
volume concesso: `null` non è zero, e un concesso a zero spegnerebbe il
contatore vita cava fingendo che l'atto non conceda niente.

### Il punto ambiguo, che non si tira a indovinare
`4.200` in Italia è quattromiladuecento; per il computer è quattro-virgola-due.
Le due letture distano **mille volte**: su un volume è la differenza fra un mese
di scavo e una carriola. Quando entrambe stanno nei limiti del campo, Terra
**non scegli**: dice le due letture e chiede come si scrive. Quando invece una
sola è possibile per quel campo (una densità di 1600 t/m³ non esiste, quindi
`1.600` in «Densità» è 1,6), l'altra è impossibile e non c'è niente da indovinare.

### Dove i decimali non si arrotondano
Il GSD si salva come numero e si scrive `2,5 cm`; la quota del fronte, il volume
di un singolo rilievo, il volume concesso e il già estratto si mostrano coi loro
decimali (`nD`) invece di essere arrotondati all'unità: sono numeri trascritti a
mano da un atto o da un referto, e finiscono nel **verbale di rilievo** e nel
riepilogo che va all'ente. Le somme e le proiezioni restano arrotondate al metro
cubo (`n0`), come prima.

### Quello che NON è cambiato
I numeri **scambiati** restano col punto decimale e senza separatore delle
migliaia: i CSV di import/export sono **dati**, non testo.
