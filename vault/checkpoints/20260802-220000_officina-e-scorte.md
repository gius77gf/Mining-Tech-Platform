# Checkpoint — l'officina e le scorte di Flotta

**Commit:** `25f6361`
**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`

## Che cosa è stato fatto

18 prove sul blocco **ordini di lavoro / consumo ricambi / punto di
riordino** di Flotta: la parte dove un numero sbagliato costa davvero,
perché sono soldi di officina e pezzi da comprare.

Due idee reggono tutto il blocco, ed erano scritte solo nei commenti.

**Il costo di un ordine non si scrive: si somma.** Manodopera (ore ×
tariffa, persona per persona), ricambi (quantità × prezzo), spese
esterne. Siccome non viene salvato ma ricalcolato, non può mai smentire
le righe che uno ha davanti. E quello che **non ha prezzo si dichiara**
invece di passare per gratis: tre ore senza tariffa non sono tre ore
gratis, sono tre ore di cui non si sa il costo — `senzaTariffa` e
`senzaPrezzo` esistono per poterlo dire. È la regola del giorno, di
nuovo: *l'assenza di un dato non è un dato favorevole.*

**La soglia di riordino non è un numero scritto una volta da qualcuno**:
è consumo al giorno × (giorni di consegna + margine). Quando il consumo
non c'è, la soglia **non si propone** e il pezzo resta dichiarato a parte.
Con un episodio solo la media si dà ma si **dichiara fragile** — «un
pezzo in sei mesi» non è una media, è un fatto capitato una volta, e su
quello non si dimensiona un magazzino senza saperlo.

Bloccate anche le due convenzioni sui numeri che qui valgono soldi e
litri: **«2,5» sono due ore e mezza**, non venticinque; e la quantità di
un ricambio **non è per forza intera**, perché in magazzino ci sono
l'olio e il grasso e «12,5» con un campo `type=number` diventava 125.

## Controprova

Undici difetti in una copia del modulo, **11 su 11** fanno cadere la
prova col loro nome.

Da tenere, sul metodo: la prima stesura del banco è stata **buttata**
perché lo script che lo generava tagliava l'array dei difetti al primo
`];` che trovava — e `m[1];` dentro una stringa ne conteneva uno. Il file
non partiva nemmeno, quindi si è visto subito; ma è la stessa famiglia
dell'ancora che compare due volte: **un taglio fatto su un carattere che
compare anche dentro i dati.**

## Numeri

- Flotta: **45 → 52 funzioni coperte su 71**
- `run-kpi.mjs`: **845 → 863**; totale `node`: **1.128 → 1.146**

## Stato del giro del browser

In corso, terzo banco (contrasto). Log in
`scratchpad/giro-campo/giro21.log`. Niente modifiche a moduli e pagine
finché gira.

## Prossimo passo atomico

Ultimo gruppo scoperto di Flotta (19 export), in due famiglie:

1. **giro macchina e scheda del mezzo** — `checklistPreUso`,
   `riepilogoControllo`, `manutenzioniDaControllo`, `controlliDelMezzo`,
   `fascicoloMezzo`, `ritmoDelMezzo`, `fotografiaDaRegistrare`,
   `validaRifornimento`, `PIANI_TAGLIANDO`, `ORIZZONTE_TAGLIANDI`;
2. **anagrafica e avvisi sui numeri** — `TIPI_MEZZO`, `tipoMezzo`,
   `tipoMezzoDi`, `nomeBreve`, `perCampo`, `messaggioNumero`,
   `AVVISO_DECIMALE`, `AVVISO_MIGLIAIA`.

Si parte dalla famiglia 1: il giro macchina è quello che porta in Flotta
chi guida, ed è da lì che nasce una manutenzione. Stesso metodo di
sempre.

## Nessun blocco

Restano aperte le decisioni del fondatore in `DECISIONI_WEEKEND.md`
(punti 5a/5b, 10, 11, 12, 13).
