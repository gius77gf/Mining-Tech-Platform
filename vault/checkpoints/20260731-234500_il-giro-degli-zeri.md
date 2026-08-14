# Checkpoint — il giro degli zeri di comodo, uno per uno

- **Tipo**: quattro unità di prodotto + due documenti
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: le ore motore, la base d'asta, le persone di una squadra, il
  messaggio dell'import gare, e le schede corrispondenti in `ONBOARDING_DATI`

## La domanda, applicata a tutti e sei

Il difetto del listino (un prezzo illeggibile che diventava **zero**, e un
listino intero che entrava sbagliato) non poteva essere l'unico. Cercati tutti
gli **zeri di comodo** dentro i lettori CSV: sono **sei**, e ognuno è stato
deciso su **cosa fa quel numero**, non per abitudine.

| Zero | Cosa fa quel numero | Deciso |
|---|---|---|
| **prezzo** (listino) | finisce in un DDT e in una fattura | **tolto** — la riga senza prezzo non entra |
| **ore motore** (mezzo) | **comanda la manutenzione**: «ore previste − ore del mezzo» | **tolto** — il mezzo entra ma resta «da stimare» |
| **base d'asta** (gara) | viene **sommata** nel valore delle gare aperte | **tolto** — la gara entra, il totale la salta e lo dichiara |
| **persone** (squadra) | si mostra: «0 persone» | **tolto** — si legge «persone non indicate» |
| **giorni d'assenza** | la colonna vuota vuol dire davvero «nessuna assenza» | **lasciato**, ed è giusto: è il near-miss, il caso normale |
| **quota** (fronte) | dato descrittivo, non entra in nessun conto | **lasciato**: cambiarlo sposterebbe solo rumore |

## Quello di cui mi ero sbagliato

Nel commit sulle ore motore avevo scritto che degli altri *«cinque vanno bene»*.
Per la **base d'asta è falso**, e l'ho visto **guardando dove finisce quel
numero** invece di fidarmi del mio giudizio: `gareRiepilogo` la somma, ed è il
numero che il titolare guarda per sapere per quanto sta correndo.

Ha anche un seguito utile: una gara **senza** base è legittima (a volte non è
ancora pubblicata), quindi non basta scartarla come un prodotto senza prezzo —
entra, il totale la salta, e il riepilogo **dice quante sono**. *Un totale che
esclude qualcosa senza dirlo è un totale che inganna.*

## La trappola che ha trovato il test

`Number.isFinite(+g.base)` sembrava la guardia giusta. **`+null` fa 0**, che è
finito: la guardia lasciava passare proprio il caso che doveva escludere, e la
base tornava a valere zero. L'ha trovata un test, non un ragionamento — ed era
in tre punti (la somma, la lista, il quadro).

## Le due metà del giro di andata e ritorno

- Il **valore cattivo** (un nome col punto e virgola, uno che sembra una
  formula, uno con le virgolette) gira ora su **tutti e sette** gli export
  ri-caricabili, non su due.
- Il **lato export** è coperto a parte: sei controlli leggono la riga vera nel
  sorgente e **contano le protezioni** `csvCell`. Sui ricettori ce n'erano
  **2 dove ne servono 5** — ed è così che l'unità «mm/s; dB(A)» finiva dentro
  la nota, e un valore con `=` sarebbe uscito eseguibile come formula.
- `AUDIT_SICUREZZA.md` voce 9 era **CHIUSA** dal 21/07: l'helper c'era, ma il
  codice del 30/07 non lo usava. Scritta la lezione: *una voce chiusa dice che
  il difetto di allora è stato tolto, non che non possa rinascere altrove.*

## Dove siamo

**KPI 431**, **Stile 149**, le altre quattro suite a 82 → **662** prove senza
rete. Il giro definitivo del browser (13 banchi) è al decimo.

## Prossimo passo atomico

Leggere il **RIEPILOGO del giro definitivo** e sistemare quello che è rosso.
Poi, se è verde, il prossimo buco documentato resta la **decisione 12** — i sei
export ri-caricabili che mancano (pesate/DDT, incassi, clienti, azioni
correttive, rilievi, registro volate) — che però spetta al fondatore.

## Bloccanti

- Nessuno.
