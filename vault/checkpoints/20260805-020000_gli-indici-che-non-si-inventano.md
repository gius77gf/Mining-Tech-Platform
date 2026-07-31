# Checkpoint — gli indici infortunistici, e il denominatore che non si inventa

**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`
**Suite:** 1.391 → **1.396** · copertura **433/433**

`indiciInfortunistici(infortuni, oreLavorate, anno)` in `scudo-data.js`, con le
formule del settore:

| | |
|---|---|
| **IF** | infortuni × 1.000.000 / ore lavorate |
| **IG** | giornate perse × 1.000 / ore lavorate |
| **LTIFR** | infortuni **con assenza** × 1.000.000 / ore lavorate |

Sono i tre numeri con cui un'azienda si confronta col proprio settore, e quelli
che un committente chiede in qualifica.

## ⛔ E tutti e tre dividono per un dato che Scudo non ha

Le **ore lavorate** non sono registrate da nessuna parte. La tentazione è
ricavarle — operatori × 1.700 ore l'anno — e il numero esce.

Sarebbe un **denominatore inventato**. Su un indice che si porta in gara o si
confronta con la media di settore, un denominatore inventato non è
un'approssimazione: è una **dichiarazione falsa con la faccia di un calcolo**.
Un'azienda con molti part-time o interinali starebbe fuori di parecchio, e
guardando il risultato nessuno potrebbe accorgersene.

Quindi senza le ore l'indice **non si calcola**: `calcolabile: false` e la
ragione in chiaro. È il principio del prodotto per la **quinta** volta, e qui il
travestimento sarebbe un indice **basso** — cioè la notizia migliore che
un'azienda possa leggere sulla propria sicurezza.

I **conteggi** invece ci sono comunque (infortuni, di cui con assenza, giornate
perse): non dipendono dalle ore, e negarli sarebbe l'errore opposto.

## Le prove, e le tre controprove

**5 prove.** Fra queste, due che dicono cose diverse e vanno tenute insieme:

- senza ore → nessun numero, con la ragione scritta;
- **un anno senza infortuni dà indici a ZERO, ed è un fatto** — non l'assenza di
  dati. Confondere i due casi è esattamente ciò che questa unità evita.

Controprovate con tre difetti: le ore stimate invece che dichiarate assenti, il
LTIFR che conta tutti gli infortuni invece dei soli con assenza, e i near-miss
contati come infortuni. **Tutte e tre cadono**, l'ultima due volte.

## Che cosa manca

Il campo dove **scrivere** le ore lavorate dell'anno, e il cartellone che mostra
i tre indici. Lo strato dati è pronto e il numero non può mentire; la schermata è
la prossima unità.

## Prossimo passo atomico

1. il campo delle ore lavorate + i tre indici nel cartellone di Scudo;
2. **giro completo a 33 esecuzioni** — quello lanciato prima è andato perso col
   contenitore, e quella verifica non è stata fatta.
