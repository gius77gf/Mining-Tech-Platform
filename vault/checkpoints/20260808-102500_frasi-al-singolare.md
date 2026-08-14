# Checkpoint — 2026-08-08T10:25:00Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
a3086fa

## Che cosa è stato completato
**Sedici frasi che con «1» dicevano «1 righe», «1 letture», «1 fori».**

I tre banchi che sorvegliano il singolare guardano quello che la
**dimostrazione rende** con n=1; il **sorgente** li ha tutti. Cercando i punti
`${…} <plurale>` senza guardia: 38 candidati, **16 veri**.
· **Sentinella (7)** — l'esito dell'import CSV, l'anteprima, le quattro
  etichette parlate dei grafici. Un CSV con **una riga sola** è normalissimo;
· **Campo (6)** — e qui la sostituzione **non è meccanica**: con «1» cambiano
  articolo e verbo. «i 1 viaggi non entrano» → «il viaggio dichiarato non
  entra»; «Gli altri 1 fori sono» → «L'altro foro è»; «le 1 voci» → «l'unica
  voce»;
· **core** («1 ore» nel sottotitolo del mezzo), **Conti** («su 1 righe»),
  **Genesi** («1 fori» nella pastiglia della volata).

## ⚠️ Il risultato negativo, misurato: perché NON è diventata una regola
**Ventidue candidati su trentotto erano falsi**, e non per distrazione:
1. **costanti** che non possono valere 1 (`RIPOSO_MINIMO_ORE`, la lista
   `[6,12,24]` delle periodicità);
2. **sostantivi invariabili** — «foto» in italiano è uguale al singolare;
3. e soprattutto **la guardia sta nella RIGA PRIMA**: un `if (n >= 2)`, o un
   ternario `n === 1 ? … : …` che avvolge l'intero blocco. Quattro «1 fatture»
   di `conti-data`, il «1 giorni» di Terra e il «1 mesi» del controllo IVA
   erano **già protetti così**.
Un controllo statico che non vede la struttura dei blocchi sbaglia **più di una
volta su due**, e un allarme che sbaglia così insegna a non guardarlo. La misura
resta scritta perché nessuno la rifaccia alla cieca — è la stessa forma delle
due strade già provate e scartate coi numeri in CLAUDE.md.

## Verifica
· copia di quello che si committa, confronto patch-a-patch identico: **25
  comandi, 0 caduti**;
· `sintassi-pagine` 34/0 e `import-esistenti` 143/0 dopo aver aggiunto
  `plurale` all'import di Genesi — che è il suo **unico** ponte verso lo strato
  condiviso, quindi il punto in cui un nome sbagliato ucciderebbe la pagina;
· il censimento rimisurato dopo: 38 → **23** candidati, e i 23 restanti sono i
  falsi dichiarati qui sopra.

## Stato roadmap
Sesta unità del blocco. Filo delle sei: **un banco che dichiara quello che non
ha guardato indica dove cercare** — ma l'elenco che ne esce va aperto voce per
voce, perché più di metà delle volte la spiegazione è che qualcuno aveva già
fatto la cosa giusta, in un altro modo.

## Prossimo passo atomico
Rimisurare l'elenco dei 23 falsi con una **seconda domanda**: invece di cercare
la guardia in una finestra di caratteri, chiedersi se il punto sta **dentro un
ramo** il cui `if` nomina la stessa variabile. È l'analisi per blocchi di
graffe già scritta in `nomi-liberi.mjs` per la seconda domanda (lo scope), e
lì era costata 11 falsi allarmi finché l'ancora non è stata presa sulla parola
giusta. Se con quella il rumore scende sotto 1 su 5, la regola si può scrivere;
se no, resta la misura in scratchpad e questo checkpoint.
Altrimenti: le **57 classi «non giudicabili»** del banco del contrasto, resa
misurata **1 difetto** (`terra .avatar.ico.danger`, 3,88 nel caso peggiore).

## Blocchi
Nessuno.
