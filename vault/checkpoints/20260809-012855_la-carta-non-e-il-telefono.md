# Checkpoint — 2026-08-09T01:28:55Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`9140414`

## Task completato

**La larghezza dei fogli stampati di Scudo** — l'ultima superficie che stampava
senza che nessuno misurasse se il foglio ci stava nel foglio. I due documenti
(il verbale DPI e la cartella del lavoratore) hanno adesso la loro prova, con
l'iniezione che la fa cadere. Esito: **ci stanno tutt'e due**.

## Le tre cose imparate

1. ⛔ **IL RIGHELLO, NON IL SOGGETTO — e stavolta il righello stava per far
   togliere una colonna a un documento sano.** La prima stesura copiava la
   domanda di `stampe-fs` (`scrollWidth <= window.innerWidth`) e la faceva a
   **430, 390 e 320 px**: il verbale cadeva a tutt'e tre con 626 px. Ma un
   foglio che vive dentro `@media print` **non si stampa sul telefono: si
   stampa sulla carta**, e la carta la pagina la dichiara —
   `@page{size:A4; margin:16mm 14mm}`, cioè 210 − 28 = 182 mm = **688 px CSS**.
   I 626 px della tabella a otto colonne ci stanno con 62 px di margine.
   La correzione «ovvia» sarebbe stata togliere una colonna al verbale che in
   ispezione viene chiesto per primo.
   La cura è quella che questo repository predica altrove: **non calcolare una
   cosa che il browser sa dire** — la larghezza si legge dalla regola `@page`,
   e se la regola non c'è il banco lo **dichiara** e ripiega su A4 invece di
   far finta di saperlo.
2. ⛔ **DUE INIEZIONI SULLO STESSO PEZZO NON LITIGANO: LA SECONDA PASSA IN
   SILENZIO.** Avevo ancorato la controprova su `scriviFoglio`, che l'iniezione
   20 riscrive già. La prima sostituisce, la seconda non trova più il suo testo
   e non succede niente di visibile — è la **terza delle cinque cause**
   (l'iniezione che non inietta), prodotta però non dal codice che si muove ma
   da **un'altra iniezione**. L'ha presa il contatore del banco («26/27 difetti
   rimessi»), che esiste esattamente per questo: un `replace` che non trova
   niente esce con un'aria tranquilla.
3. ⏱️ **Quinta riga in due giorni che proponeva un lavoro già chiuso.** La
   verifica periodica: la prova «vive in scratchpad e va portata in
   `tests/browser/`» era in `tests/browser/` da `f81d127` — commit il cui
   messaggio dice proprio «riscritta perché la prima era rimasta nello
   scratchpad» — e registrata in `tutti.mjs`; e il contrasto «misurato in un
   tema su tre» gira in tre temi con quattro controprove. La direttiva 7 non
   era stata applicata perché il lavoro è arrivato da un cantiere che quella
   riga non l'aveva letta.

## Verifiche
- passata sana `scudo-documenti`: **88 ok · 0 KO**, con la carta letta dalla
  pagina («size: a4; margin: 16mm 14mm» → 688 px)
- controprova: **27/27 difetti rimessi**, le due prove nuove cadono (900 px in
  688) e il banco dichiara **✔ CONTROPROVA OK**
- `iniezioni-fresche`: **214/214 sul bersaglio**, 23 banchi
- `giro-node`: **34 comandi a posto, 0 caduti**, rifatto anche sulla **copia**
  di ciò che si committa (worktree + `diff --cached | apply` + `add -A`)
- `barra-etichette` rilanciato a mano su un server **mio** (porta 8990,
  contrassegno verificato): tema **scuro** 164 etichette su 24 barre, **0 fuori
  posto**; tema **sole** idem, **0**, con 8 superfici dichiarate NON misurate
  perché non hanno quel tema

## Stato roadmap
- ✅ chiusa «Le due code della verifica periodica» (era stale)
- ✅ aggiornata «Chi misura la larghezza dei fogli stampati»: Scudo dentro il
  banco, resta **Genesi** (misurata a mano il 07/08 e sana, ma la misura non è
  ancora dentro `genesi-foglio-in-cava.mjs`)
- ⚠️ dichiarato e **non toccato**: `stampe-fs.mjs` misura ancora contro la
  **finestra**. Per i suoi soggetti — fogli in un popup — la finestra fa da
  foglio e la domanda regge, ma è **un'altra domanda** da questa, e chiamarle
  con lo stesso nome è il modo in cui qualcuno copierà quella sbagliata.

## Prossimo passo atomico
**Chiudere la riga «Il banco della barra guarda un tema su tre»** appena
finisce la passata `--tema=chiaro` (registro in
`scratchpad/sing/barra-chiaro.txt`): scuro e sole danno già **0 fuori posto** e
**0 etichette tagliate dentro il proprio bottone**, cioè anche la domanda che
Conti «non poteva sentirsi fare». I tre difetti che la riga elenca (Flotta 320
sole, Terra 320 sole, Conti che risponde ok senza provare niente) risultano
**tutti chiusi alla misura** — la riga va spuntata con i numeri, non con
l'esistenza dello strumento.
Poi: **leggere il giro del browser** (pid 32676,
`scratchpad/resp/giro/registro4.txt`, attesta `7cddb59`) con
`leggi-giro.mjs`, nell'ordine **sezione 0 (età)** → **righe «non ho guardato»**
→ **KO veri**; alle 01:06 era vivo da 1h57 e stava scrivendo.

## Blocchi
Nessuno.
