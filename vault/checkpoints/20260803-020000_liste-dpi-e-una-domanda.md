# Checkpoint — le liste di Scudo, i DPI, e una domanda per il fondatore

**Commit:** `9f924bc`
**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`

## Che cosa è stato fatto

13 prove su Scudo. Le sue liste non sono decorazione: un near miss «o lo
segnali in pochi secondi o non lo segnala nessuno», e si segnala
**toccando** una categoria e un luogo. La regola bloccata è una sola e
vale per categorie, luoghi, esiti di ispezione, tipi di DPI e ruoli di
nomina:

> una chiave sconosciuta **non diventa mai la prima voce dell'elenco**.

Su un registro di sicurezza vorrebbe dire attribuire un evento a un
rischio che non è quello, o dare a un dispositivo scritto a mano i
requisiti di un altro.

Bloccati anche: **«non applicabile» non è «conforme»** (segnarlo verde
farebbe risultare *controllata* una cosa che in quella cava non esiste); il
**DSS** fra i tipi di documento (senza, Scudo non sarebbe un'app per cave);
il confronto morbido dei testi che riconosce «Idoneità» e «idoneita» come
la stessa cosa; e `dataPiuGiorni` che conta in **giorni di calendario
locali** — la regola del 31/07, quella che a mezzanotte e mezza non deve
scivolare al giorno prima.

## Due cose scritte come sono, non come dovrebbero essere

**1. `dataPiuGiorni(null)` risponde OGGI.** `Number(null)` è `0`: è la
famiglia di `+null === 0` già costata due volte qui dentro. Ma misurato,
**non è raggiungibile**: i due punti che la chiamano passano un `30`
scritto a mano oppure guardano prima `i.periodicitaGiorni`. È una trappola
dormiente, non un difetto vivo — e la prova la **nomina** invece di far
finta che risponda `null`. Irrigidirla è nella lista delle cose da fare
dopo il giro del browser.

**2. Un DPI consegnato senza data di sostituzione risulta regolare per
sempre** — anche una maschera di III categoria, che il suo tipo dice di
sostituire dopo dodici mesi. Il form la propone da sé, ma si può svuotare.
Le due letture (*l'ha svuotata apposta* / *nessuno ha detto entro quando*)
portano a due prodotti diversi: è il **punto 14 di
`DECISIONI_WEEKEND.md`**, ed è del fondatore, non mia. La prova blinda il
comportamento di oggi e lo nomina, così se cambia si sa che è stato
**scelto** e non successo.

## Controprova

Undici difetti in una copia del modulo: **11 su 11** fanno cadere la prova
col loro nome.

## Numeri

- Scudo: **55 → 70 funzioni coperte su 71**. Resta fuori solo
  `scudoData`, il caricatore dati, che vuole la rete.
- `run-kpi.mjs`: **914 → 927**; totale `node`: **1.197 → 1.210**

## Censimento

| app | coperte |
|---|---|
| Sentinella | 89/107 |
| Scudo | 70/71 |
| Conti | 54/58 |
| Campo | 65/73 |
| Flotta | 65/71 |
| Terra | 31/39 |

## Stato del giro del browser

In corso, decimo banco su diciannove (doppia data), tutto verde finora.

## Prossimo passo atomico

**Terra** (31/39), che è l'ultima sotto il novanta per cento in
proporzione: restano `PROVENIENZE`, `rilieviScavoFronte`,
`rilievoPrecedente`, `anniConVolumi`, `serieAnnuale`,
`TIPI_SCADENZA_TERRA`, `etichettaTipoScadenza`. Sono le funzioni del
riepilogo annuale dei volumi e delle scadenze della concessione.

## Da fare appena finisce il giro del browser

1. **una sola `messaggioNumero`** (`docs/NUMERI_MESSAGGIO_DOPPIO_202608.md`)
   con la prova di **identità**;
2. irrigidire `dataPiuGiorni` sul `null` (trappola dormiente qui sopra).

## Nessun blocco

Restano aperte le decisioni del fondatore in `DECISIONI_WEEKEND.md`
(punti 5a/5b, 10, 11, 12, 13 e ora **14**).
