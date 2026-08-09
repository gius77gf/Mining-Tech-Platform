# Checkpoint — 2026-08-09T01:45:00Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`2c22fee`

## Task completato

**Il singolare nelle frasi del prodotto** — la riga di roadmap che diceva «non
si traducono in una notte» adesso ha **un numero invece di un'impressione**, e
otto punti sono chiusi (sette in Sentinella, uno in Genesi).

## Le tre cose imparate

1. ⛔ **UN CENSIMENTO CHE CONOSCE UNA SOLA SINTASSI VEDE IL 14% DEI SUOI
   SOGGETTI.** Il mio cercava i template literal (`${n} fori`) e non la
   **concatenazione** (`+n+' fori'`), che è la forma con cui Genesi e
   Sentinella scrivono quasi tutto: **16 candidati contro 115**. È la stessa
   famiglia del censimento che cerca **un nome solo** (`__usciti` invece di
   `__scaricati`, costato trecento righe di banco poche ore prima) e dei
   commenti da togliere in **tutt'e tre** le sintassi di una pagina. La domanda
   da farsi scrivendo un censimento non è «trova?», è **«in quanti modi si
   scrive la cosa che sto cercando?»**.
2. ⚠️ **DUE ERRORI DEL RIGHELLO, TUTT'E DUE COL SEGNO CHE SI RICONOSCE.**
   (a) l'estrattore del nome pretendeva un `+` che il pattern aveva **già
   mangiato**, e rispondeva «nome vuoto» a **tutti** i 109 casi — un difetto
   **identico dappertutto** è il modo in cui si vede di stare guardando il
   righello invece del soggetto; (b) la guardia veniva cercata in **una riga**
   di contesto, mentre un ternario scritto su quattro righe mette `x === 1` in
   cima e il plurale in fondo: il ritmo dei rilievi di Terra, **sano**,
   risultava un difetto. Con tre righe di contesto: 109 → **54**.
3. ⛔ **LA SOSTITUZIONE NON È MECCANICA**, e si vede sull'import delle
   tarature: «1 righe su 3 scartate» è sbagliato **tre volte** (numero,
   sostantivo, participio), e «Tutte le 1 righe del file sono entrate» non si
   aggiusta cambiando una parola — diventa «**L'unica riga del file è
   entrata**». Un `plurale()` messo a tappeto non avrebbe preso né l'articolo
   né il verbo.

## Le correzioni (con la ragione, non a elenco)
- **import tarature**: un file con **una riga sola** è il caso più comune di
  tutti — chi carica il certificato di **uno** strumento;
- **tolleranza di un giorno**: è la più stretta che si possa scrivere;
- **«1 superamenti»**: sta nel testo che legge lo **screen reader**, dove si
  sente;
- **`etichettaFrequenza(1)` → «ogni giorno»**: in italiano il «1» davanti si
  toglie, e quella è la frequenza di chi ha un problema aperto e lo sorveglia;
- **«(1 referto)»**: una legge di sito calibrata su un referto solo è debole —
  cioè è proprio il caso in cui quel numero va **pesato**, e «(1 referti)» lo
  fa sembrare un refuso;
- **Genesi, «1 fori»**: una volata a **foro singolo** è esattamente quella con
  cui si tara la legge di sito.
- ⚠️ **«campioni» resta al plurale, dichiarato**: `_sigData.a` è la forma
  d'onda campionata del sismografo e ne ha migliaia — un'onda da un campione
  non è un'onda.

## Verifiche
- `run-kpi`: **1922 passati, 0 falliti**, con due asserzioni nuove
- ⛔ e **provate a fallire**: rimesso il vecchio testo atteso → **1921/1**, poi
  ripristino **da una copia** (`cp` + `diff -q`), mai `git checkout`
- ⚠️ il totale **non sale** ed è giusto: il contatore conta i blocchi `test()`,
  non le `eq`. Detto qui perché la regola di casa è «si controlla che il totale
  sia salito», e questa è la sua eccezione **con la ragione**
- `sintassi-pagine`: 34/0 (Genesi compresa)
- `giro-node`: **34 comandi a posto, 0 caduti**, rifatto sulla **copia** di ciò
  che si committa

## Stato roadmap
Riga «I ternari del singolare» aggiornata con la misura: **54 da leggere, 69
scartati perché guardati, 9 costanti**, e il racconto del censimento cieco.
Resta aperta — è lavoro da più notti.

## Prossimo passo atomico
**Leggere il giro del browser** (pid 32676,
`scratchpad/resp/giro/registro4.txt`, attesta `7cddb59`): alle 01:35 era vivo
da 2h27, stava scrivendo, 235 intestazioni. Prima domanda **«sta ancora
scrivendo?»**, poi `node apps/deepwork-id/tests/browser/leggi-giro.mjs
<registro>` nell'ordine **sezione 0 (età)** → **righe «non ho guardato»** →
**KO veri**.
⛔ Quel giro attesta un commit **prima** delle unità di stanotte: i suoi KO
vanno riverificati sul commit di adesso prima di aprirci un cantiere — è
esattamente il caso per cui la sezione 0 esiste.
Se invece il giro è ancora lungo: continuare il **setaccio delle righe aperte**
della roadmap (ne restano 14; sei delle sette guardate finora erano scadute).

## Blocchi
Nessuno.
