# Checkpoint — il buco aperto dal rendere possibile la nota di credito

**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`
**Suite:** 1.383 → **1.384**

## Il fatto

Gli aggregati leggevano lo storno — ma **cinque funzioni no**, e fra queste le
due che producono **documenti che escono verso il cliente**:

| funzione | che cosa faceva |
|---|---|
| **`testoSollecito`** | scriveva la lettera che **chiede i soldi** su una fattura già stornata |
| **`estrattoContoCliente`** | metteva la fattura stornata fra i crediti da esigere |
| `prioritaIncasso` | la metteva in cima a chi inseguire |
| `incassoAtteso`, `incassoPerMese` | la contavano fra i soldi in arrivo |

Non è un numero sbagliato in una schermata: è una **richiesta di pagamento su un
documento annullato**, con il nome del cliente sopra.

Ed è un buco che **ho aperto io stamattina**: finché la nota di credito non
esisteva, nessuna di quelle cinque poteva sbagliare. *Una funzione nuova non si
misura solo su quello che aggiunge — si misura su tutto quello che adesso può
diventare falso.* Il collegamento agli aggregati era stato scritto come «gli
aggregati», e cinque lettori sono rimasti fuori dall'elenco.

Trovato **cercando i chiamanti di `apertoDi` rimasti senza `note`**: sei righe,
`grep`, due minuti.

## La correzione

Il parametro `note` è facoltativo in tutte e cinque, come nelle altre quattro:
chi non lo passa ha i numeri di prima. Le cinque chiamate della pagina lo
passano.

## ⚠️ E la prova non provava niente — corretta guardando il valore vero

La prima stesura cercava «1.000,00» nel testo del sollecito e **passava anche col
difetto rimesso**: il sollecito scrive «**€ 1.000**», senza decimali, quindi il
confronto era vero in tutti e due i casi. È il caso 1 della tassonomia in
`CLAUDE.md` — *i dati della prova fanno coincidere la risposta giusta con quella
sbagliata*.

Misurato, il comportamento vero è **più forte** di quello che avevo assunto: con
la nota `testoSollecito` non restituisce un testo più povero, restituisce
**`null`** — la lettera non esiste proprio. L'asserzione ora è quella: più
giusta, non più permissiva.

Controprova: tre iniezioni (sollecito, estratto conto, incasso atteso), tutte e
tre fanno cadere la prova. Sull'ancora del sollecito — che compare **tre volte**
nel file — la sostituzione è fatta **per posizione dentro la funzione**, invece
di allungare la stringa: allungandola l'escaping fra shell e Python l'aveva
ridotta a **zero occorrenze**, e la controprova diceva «ancora non unica» invece
di sostituire a caso.

## Prossimo passo atomico

1. **rilanciare il giro completo del browser** (29 esecuzioni) — fermato a tre
   minuti dall'inizio proprio per chiudere questo buco, che vale più di un giro;
2. **Terra/Genesi — tracciabilità del volume**, unità 1 e 2;
3. la nota di credito nell'**export per il commercialista** e nel registro IVA.
