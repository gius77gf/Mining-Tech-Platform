# Checkpoint — le due prove nuove sbagliavano mira, come tutte le altre

**Commit:** `0e27125` (la prova sulla fase), `a9f6818` (la terza metà della
struttura), `2052c20` (la controprova a tappeto)
**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`

## Il filo di queste tre unità

Tutte e tre dicono la stessa cosa da tre lati: **un controllo appena scritto
non è ancora un controllo**. Bisogna chiedergli quanti soggetti ha guardato
davvero, e la risposta quasi sempre è «meno di quel che sembra».

## 1. La prova sulla fase guardava tutto tranne le sei app

Scritta un'ora prima. Le sue ancore erano le dichiarazioni a **colonna zero**:
934, che sembravano tante. Ma il codice delle sei app è tutto **indentato**
dentro un blocco — quindi le sei pagine, cioè le superfici che contano di più,
davano **zero ancore**, e la prova rispondeva lo stesso «tutte codice».

Contando anche le righe indentate: **7.485 ancore**, nessun file fuori. E
adesso la prova lo **pretende**: se un file non dà nessuna ancora, cade.
Nella controprova i due difetti fanno perdere **801 e 54** dichiarazioni
invece di 99 e 16.

Seconda correzione, piccola: si pretende «non è dentro una stringa», non «è
codice». In `dw-grafici.js` l'intestazione contiene l'esempio d'uso
`const g = dwGrafici.linea(…)` dentro un commento, e un pezzo di codice
mostrato in un commento **è** un commento.

E `shared/dw-app-ui.js` è entrato nell'elenco dei moduli: è nato ieri, lo
caricano tutte e sei le app, e **nessuna regola lo guardava**.

## 2. Le sei app non erano sei

Il conto della duplicazione guardava solo le app verticali. Le superfici che
aprono una modale sono **nove**: mancavano il core (legittimo — è
l'originale), l'amministrazione di Deepwork ID (il caso facile) e **Genesi**.

Genesi è il caso difficile, e per una ragione che vale la pena tenere: il suo
`chiediValore` ha lo **stesso nome**, lo **stesso numero di parametri** e un
**significato diverso** — il terzo è un valore, non l'HTML del campo. Chi le
caricasse il file condiviso «per allinearla» non vedrebbe nessun errore: la
chiamata di riga 3875 comincerebbe a passare il nome proposto per la volata
dove ci va della marcatura, e il campo comparirebbe vuoto. Non due copie che
**divergono** — due copie che **si somigliano abbastanza da scambiarsi di
posto**.

*(I numeri sono stati ricontati prima di scriverli: una prima stesura diceva
«62 chiamate», che era la somma di tutti e cinque i nomi. Sono una, una e
cinquantasette.)*

## 3. La controprova a tappeto provava di meno dove serviva di più

I suoi punti d'iniezione erano quelli in cui si chiude un **template**. Scelta
ragionevole: erano i template a mandare fuori fase la scansione vecchia. Ma
Genesi i template quasi non li usa — scrive per concatenazione — e ne dava
**24** contro i **120** di Terra, che è un terzo della sua misura. La
superficie più grande era la meno provata, **per il modo di scrivere di chi
l'aveva scritta, non per il rischio**.

Adesso valgono tutte e tre le virgolette: **20.566** punti. Provarli tutti
costa una ri-scansione del file per ognuno, quindi se ne provano **120 per
superficie**, presi a **passo regolare**, e il numero saltato **si stampa** —
un taglio taciuto si legge come «copre tutto». Il passo regolare conta più
della quantità: un difetto di fase non è un punto isolato, è un **tratto**
lungo migliaia di caratteri.

Il tetto è scelto **misurando**: 49 secondi contro i 51 di prima. E la
controprova copre **dodici** superfici invece di dieci — la vetrina e la
pagina d'accesso prima restavano fuori in silenzio.

## Numeri

- stile **212 → 231**; totale `node` **1.265 → 1.284**
- iniezioni della controprova a tappeto: 1.029 → **1.211**, su 20.566 punti
- ancore della prova sulla fase: 934 → **7.485**, in 22 file
- i tre documenti che citano il totale aggiornati **dal controllo che li
  legge**, non a memoria

## Il giro del browser

Ancora in corso, alla decima prova su diciannove, tutto verde. Un allarme
letto e chiarito: sette KO su «si torna all'ecosistema» sembravano una
regressione su tutte le app — sono la **controprova** di quel banco, che
toglie apposta il comando di ritorno e pretende che la prova cada. Misurato
anche a mano nel browser: il comando è 47×44, cioè a norma.

## Prossimo passo atomico

Invariato, quando il giro finisce:

1. **`go(id)` nel modulo condiviso** — sei copie, due versioni, e le cinque
   senza guardia hanno una trappola dormiente;
2. **l'amministrazione di Deepwork ID** passa a `dw-app-ui.js` (caso facile);
3. **Genesi**, il caso difficile, con la rinomina degli id e il
   `chiediValore` da riallineare.

## Nessun blocco

Restano aperte le decisioni del fondatore in `DECISIONI_WEEKEND.md`
(punti 5a/5b, 10, 11, 12, 13, 14, 15).
