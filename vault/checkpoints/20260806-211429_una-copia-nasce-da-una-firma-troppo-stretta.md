# Checkpoint — 2026-08-06 21:14:29 UTC

## Tipo
unit-complete (otto unità dopo il checkpoint delle 20:09: Campo riverificata,
regola 26, i tre cantieri del disegno, i documenti riallineati, la pastiglia
sovrapposta, le due copie di Genesi)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`66ae5b1` — *Genesi: le due copie dichiarate e non corrette, e la seconda
esisteva perché mancava un argomento*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|---|---|
| 75 | **Campo riverificata** (`beca9db`) | arretrato dei sei documenti **a ZERO** per la prima volta |
| 76 | **regola 26 + il ripiego `\|\| 25`** (`f6bf85c`) | prove **2.160**, e la regola accusa un innocente al primo giro |
| 77 | **tre cantieri sul disegno** (`4916275`) | 6 difetti, prove 2.169, banchi **92 → 98** |
| 78 | **i tre documenti riallineati** (`2015e51`) | arretrato **3 → 0** |
| 79 | **la pastiglia sovrapposta** (`47ab5c8`) | `#h-user` da coperto a **padrone del proprio punto** |
| 80 | **le due copie di Genesi** (`66ae5b1`) | `_gauss` da **due** implementazioni a una |

## ⛔ Il filo del blocco: *una copia nasce quasi sempre da una firma troppo stretta*

Tre volte in poche ore, in tre posti che non si parlano:
1. **`shared/dw-grafici.js`** — `Math.max(2, …)` e `Math.max(spessore*0.6, …)`
   scritti a mano in tre punti. Diventa `lunghezzaBarra(px, minimo)`, che
   aggiunge la cosa che mancava: **uno zero si disegna zero**.
2. **`disegnaSpark`** — decideva la soglia con `>` stretto mentre `disegnaLinea`
   legge già `soglia.inclusiva`. Due sorelle che chiedono la stessa cosa in due
   modi diversi: allargato il contratto (numero **oppure** `{valore, inclusiva}`).
3. **`jitterGeo` di Genesi** — il seme inchiodato a 7, e chi ne serviva tre
   diversi ha ricopiato il corpo a mano. Il seme diventa un argomento con
   valore predefinito, e la copia sparisce.

**La domanda da farsi prima di ricopiare un corpo: all'originale manca un
argomento?** Costa una riga e toglie una divergenza futura — e la divergenza
c'era già, silenziosa: la copia di Box–Muller scriveva `6.2831853` dove il
modulo scrive `2*Math.PI`.

## ⛔ Le tre cose di metodo, e due sono errori miei

1. **LA REGOLA CHE ACCUSA COSTA PIÙ DI QUELLA CHE ASSOLVE, e la regola 26 l'ha
   dimostrato su sé stessa al primo giro.** Avevo messo `\bnonel\b` fra i dati
   vietati: ha segnalato `genesi.html:1247`. Aprendo la riga — non leggendo il
   conteggio — non è una citazione ma un **catalogo**: quattro sistemi
   d'innesco veri, con la serie di ritardi standard `17/25/42/65/100 ms`.
   «Nonel» e «25 ms» sono **anche** termini del mestiere. Da lì ho dovuto
   correggere anche una riga scritta da me due ore prima, che dichiarava il
   ripiego `|| 25` «un dato di riferimento del fondatore»: non è dimostrato, e
   il ripiego va tolto lo stesso — per **una** ragione, non per due.
2. **QUANDO UNA REGOLA CSS NON MORDE, SI GUARDA CHI VINCE, NON LO SI DEDUCE.**
   Sulla pastiglia ho dato la colpa a due cose sbagliate prima di trovare
   quella giusta: «vince l'ultimo `@media`» (vero, ma spiegava una
   dichiarazione su tre) e poi lo **stile in linea**, che batte qualunque
   regola del foglio. Il segnale che mi ha ingannato: il browser rispondeva
   `mq360: true` e nascondeva il testo — tutti i segnali che la regola fosse
   attiva — mentre tre dichiarazioni su quattro venivano buttate.
   `getComputedStyle` risponde in tre secondi; io ci ho messo venti minuti a
   chiederglielo.
3. **UN CONTROLLO SULL'OVERFLOW NON VEDE IL TRABOCCAMENTO ALL'INDIETRO.** Con
   `justify-content:flex-end`, il contenuto che non ci sta esce **dalla parte
   opposta** — a sinistra, sopra il vicino — e `scrollWidth > clientWidth`
   risponde «a posto». È il motivo per cui la pastiglia stava sopra il nome
   sulla prima schermata e nessuna misura se n'era accorta.

## ⚠️ E una cosa che è andata bene, da dire perché non sembri che il controllo trovi sempre qualcosa
Su **Campo** il sospetto era giusto (un commento nominava «ore di riposo» fra i
dati inventati) e la risposta è che il lavoro era già fatto **e già
registrato**: la riga «Fatigue monitoring» era marcata scaduta dal 01/08 con le
funzioni giuste. Su **Sentinella** i tre cantieri non hanno trovato niente da
correggere nell'app — nessuna barra CSS in percentuale, tutto SVG con
`viewBox`. E il banco delle modali su **Terra**: 0 cose da guardare.

## Stato delle prove
Prove `node` **2.169** (run-kpi **1766**, stile **291**), copertura **657/657**,
banchi del browser **98**. Giro `node` 21 comandi, 0 caduti sulla copia di ciò
che si committa, a ogni commit. Arretrato dei documenti del delta: **0**.
A 320 px: **30 sezioni su 30** senza scorrimento orizzontale.

## Che cosa sta girando adesso
**Tre cantieri** sul filo del disegno che mente: **Flotta**, **Scudo**,
**Campo** — le tre app che mancavano. E in fondo, il banco delle modali su
**genesi**, **conti** e **vetrina**, le superfici che il censimento elencava
come «mai guardate».

## Prossimo passo atomico
1. **Raccogliere i tre cantieri**, uno per volta, con l'indice costruito da
   `HEAD` per i file che non sono loro. ⚠️ Toccano tutt'e tre `tutti.mjs` e
   `run-kpi.mjs`: vanno letti riga per riga o due bande si sovrascrivono. E i
   numeri nei documenti vanno rimisurati **sulla copia**, non a memoria.
2. **Leggere l'esito del banco delle modali** su genesi, conti e vetrina: dopo
   la correzione di stamattina quel banco apre davvero le finestre, e sul core
   ha trovato subito due uscite fuori schermo.
3. **Le decisioni**: le 19 scadono **oggi/domani (venerdì 07/08)**. Se non
   arriva risposta si procede con la colonna «la mia risposta», dichiarandolo
   nel commit. Restano ferme le 6 che richiedono il fondatore.
4. Poi: le **cinque superfici** che restano fuori dal banco delle modali, e il
   secondo passaggio sui documenti del delta.

## Code aperte, dichiarate
- Il **7,5%**: il motore misura la larghezza dell'host e poi inserisce un
  `figure.dwg` con 14 px di padding, quindi ogni grafico di ogni app dipinge a
  368 su 398. Non è una bugia di proporzione, ma il testo esce più piccolo di
  come è progettato.
- In **Conti** il segno minimo da 3 px cade dentro l'angolo arrotondato da 8:
  si vede a 8×, si legge come un'ombra. Alzare il minimo **non** è la risposta
  — a 10 px si appiattirebbero sei righe su sette.
- La riga **DUVRI** e la **scadenza della comunicazione annuale** aspettano il
  fondatore col suo RSPP.

## Blocchi
Nessuno.
