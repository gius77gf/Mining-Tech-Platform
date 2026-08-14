# Due decisioni, misurate invece che descritte

**Data:** 01/08/2026 · **Area:** `docs/DECISIONI_WEEKEND.md` (Sentinella, Scudo)
**Unità precedente:** `20260801-060000_con-un-volume-vuol-dire-con-un-numero.md`

## Cosa è stato fatto

Il censimento del principio ha lasciato **due cose che un cantiere non poteva
decidere**, e le ha dichiarate invece di allargare il lavoro. Adesso sono i
punti **16** e **17** di `DECISIONI_WEEKEND.md`, scritte per il fondatore: che
cosa fa l'app oggi, che cosa succede davvero, quanto è raggiungibile, e le due
strade con il loro costo.

⚠️ **Non le ho riportate dai resoconti: le ho rimisurate**, chiamando le
funzioni. Ed è servito, perché in tutti e due i casi la misura dice qualcosa di
diverso — e di più — da quello che era stato riferito.

## 16 · Il punto senza soglia sbaglia in TUTT'E DUE i versi

Era stato riferito come «un punto senza soglia esce Conforme, verde». Vero, ma
è metà. Misurato su un punto senza soglia, con la soglia di ripiego `1` che il
codice usa per non dividere per zero:

| lettura | risposta dell'app |
|---|---|
| 0,8 mm/s | **«Conforme»**, verde |
| 1,2 mm/s | **«Superamento»**, rosso |

Il verde tranquillizza chi non ha nessun limite da rispettare; il rosso
**inventa un allarme** contro un numero che nessuno ha scelto. È il principio
dell'assenza nelle sue **due facce opposte, nello stesso punto** — e la seconda
faccia (l'allarme inventato) nel resto del progetto è sempre stata trattata come
grave quanto la prima.

Raggiungibilità confermata a mano: il form pretende una soglia > 0 con un
messaggio esplicito, l'import scarta soglia ≤ 0. Il caso vive per dati scritti
prima o da un'altra strada.

⛔ **Non toccato**: è una soglia, e le soglie sono ferme finché il fondatore non
si esprime. La regola vale anche quando il codice sembra ovviamente sbagliato.

## 17 · L'infortunio a prognosi aperta non è «un infortunio che non è costato niente»

Era stato riferito come «entra come 0 giornate perse e abbassa IG e LTIFR».
Misurato su 20.000 ore lavorate:

| | frequenza | gravità | LTIFR |
|---|---|---|---|
| un infortunio, 12 giorni | 50 | 0,6 | 50 |
| **più uno a prognosi aperta** | **100** | **0,6** | **50** |

Non «abbassa»: **non muove**. La frequenza sale (giusto, l'infortunio c'è
stato), la gravità resta identica e l'infortunio non entra fra quelli con
assenza. Cioè l'app dice *«un infortunio in più che non è costato nemmeno una
giornata»* — che è precisamente ciò che ancora non si sa.

La differenza fra «abbassa» e «non muove» conta: la prima frase fa cercare un
errore di calcolo, la seconda mostra che il difetto è nella **classificazione**,
non nella formula. Un resoconto preso per buono avrebbe mandato a cercare nel
posto sbagliato.

⛔ **Non toccato**, e per una ragione diversa dal punto 16: qui la decisione di
oggi è **scritta e datata** nelle prove con la sua ragione (in un near-miss la
colonna vuota vuol dire davvero nessuna assenza, ed è il caso normale). Non è
una svista da correggere: è una scelta che forse va rivista, e rivederla tocca
gli indici che vanno all'ente.

## La cosa da tenere, al di là dei due punti

**Un resoconto di un cantiere è un punto di partenza, non un risultato.** Tutti
e due erano onesti e utili — hanno trovato loro i due casi — e tutti e due
erano **imprecisi nel dettaglio che cambia la diagnosi**. Il costo di
rimisurare è stato dieci minuti; il costo di non farlo sarebbe stato scrivere
al fondatore due frasi sbagliate in un documento su cui deve decidere.

## Verifica

`numeri-nei-documenti` **17/17**. Nessun codice toccato in questa unità: è tutta
in `docs/`, di proposito — le due cose che descrive sono ferme in attesa del
fondatore.

## Prossimo passo atomico

**Leggere il giro del browser fino in fondo** quando finisce (gira da ~25
minuti sul codice di `069d70e`), e poi portare a schermo le cinque righe nuove
di Scudo che il loro cantiere ha dichiarato **non guardate**.
