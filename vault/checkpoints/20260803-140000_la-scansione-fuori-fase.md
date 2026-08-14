# Checkpoint — la scansione che reggeva tutte le regole perdeva la fase

**Commit:** `aba7223`
**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`

## Da dove è saltato fuori

Stavo scrivendo la **regola 17** — «la struttura del core non si riscrive
in casa», cioè la guardia che impedisce alle sei app di rifarsi in casa il
toast e la modale che ieri sono finiti in `shared/dw-app-ui.js`. La regola
è passata su tutte e sei le app e ha detto una cosa strana su **Genesi**:
«chiama toast e modale ma non le definisce e non carica il file
condiviso». Non era vero: Genesi le definisce, si vedono a occhio, righe
2782, 2822, 2833.

Non era sbagliata la regola. Era sbagliata la **scansione** che sta sotto
a tutte e diciassette.

## Che cosa c'era, e quanto era grande

`run-stile.mjs` scorre i file carattere per carattere segnando dove si è
dentro una stringa e dove no. Se sbaglia **una volta**, tutto quello che
viene dopo è invertito — il codice vero diventa «testo», e i controlli
smettono di guardare senza dire niente.

Due difetti, indipendenti:

1. leggeva la **pagina intera** come JavaScript. Ma il programma sta nei
   `<script>`; il resto è testo in italiano, e in italiano c'è un
   apostrofo ogni due parole. Da **7 a 131 apostrofi** per superficie: con
   un numero dispari la fase si inverte e resta invertita;
2. decideva se uno `/` è una divisione o un'espressione regolare guardando
   l'**ultimo carattere** prima. In Genesi c'è
   `return /[;"\n]/.test(s)`: l'ultimo carattere è la **n di return**,
   quindi divisione, quindi la virgoletta dentro la regex apriva una
   stringa lunga 1.500 caratteri.

Il metro per misurare non si presta a discussioni: una `function`
dichiarata a **colonna zero** è codice, sempre. Risultato: **115 delle 195
dichiarazioni di Genesi** erano fuori fase. La regola 1 — niente
`alert`/`confirm`/`prompt`, che è direttiva del fondatore — non guardava
decine di migliaia di caratteri **e rispondeva «nessuna violazione»**.

E il pezzo che fa più impressione: **il core ne usciva pulito per caso.**
131 apostrofi e 39 virgolette, due inversioni che si annullavano. Bastava
una frase in più nel markup.

C'era anche un secondo segno, e non l'aveva letto nessuno: la controprova
a tappeto della regola 1 stampa l'elenco delle superfici in cui inietta il
difetto, e **Genesi non c'era**. Non perché fosse esclusa: perché la
scansione fuori fase non trovava più nessun punto da cui iniettare. Il
numero dei soggetti guardati era stampato — la difesa scritta in
`CLAUDE.md` — ma l'elenco lo leggeva solo chi ci faceva caso.

## Che cosa è stato fatto

- in una pagina il JavaScript sta **solo** dentro i `<script>` e dentro
  gli attributi `on*` (**253**, di cui 202 nel solo core: buttarli via per
  semplificare sarebbe stato barattare un buco con un altro), ognuno con
  il **suo** stato;
- prima dello slash si legge la **parola intera**: dopo `return`,
  `typeof`, `case`, `throw`… ci sta un'espressione, dopo un nome qualunque
  una divisione;
- la misura è diventata una **prova permanente**: *934 dichiarazioni a
  colonna zero, tutte codice*. È l'unico controllo del file che verifica
  lo **strumento** invece di una regola.

E la **regola 17**, che è quella da cui era partito tutto: chi carica
`shared/dw-app-ui.js` non deve ridefinire toast e modale, e chi le usa
deve averle da qualche parte — togliere le funzioni scordando il
`<script>` non dà nessun errore di sintassi, la pagina si apre e muore al
primo tocco (è l'errore che ho fatto ieri, in cinque app insieme).
L'elenco `COPIA_PROPRIA` non è un permesso ma **un conto che deve
accorciarsi**: core, Genesi, amministrazione.

## Controprova

I due difetti rimessi nella scansione vera, uno alla volta, con quanti
caratteri ha cambiato l'iniezione:

- (1) la pagina letta come tutta JavaScript — **99 dichiarazioni perse**
- (2) lo slash giudicato dall'ultimo carattere — **16 dichiarazioni perse**

99 + 16 = **115**, esattamente il buco di partenza: i due difetti sono
indipendenti e insieme lo spiegano tutto.

## Numeri

- stile: **212 → 226** prove; totale `node`: **1.265 → 1.279**
- controprova a tappeto della regola 1: **1.029 → 1.096** iniezioni, e
  Genesi finalmente dentro
- i tre documenti che citavano il totale vecchio corretti — li ha trovati
  `numeri-nei-documenti.mjs`, non la memoria

## In corso

Il **giro a 19 banchi** del browser, partito ieri perché tutte e sei le
pagine erano cambiate: è alla terza prova, tutto verde finora. Finché
gira: `docs/`, `vault/` e le suite `node`.

## Prossimo passo atomico

Quando il giro finisce, in quest'ordine:

1. **`go(id)` nel modulo condiviso** (misura già fatta, commit `96b747a`):
   sei copie, due versioni, e le cinque senza guardia hanno una trappola
   dormiente — `go()` con un id che non esiste ferma la navigazione senza
   dire niente. La forma condivisa è il **soprainsieme**: le guardie di
   Flotta per tutti, la mappa come parametro facoltativo;
2. **l'amministrazione di Deepwork ID passa a `dw-app-ui.js`** — è il caso
   facile dell'elenco `COPIA_PROPRIA` (`apriModale` a tre parametri, cioè
   la forma che il condiviso accetta già);
3. **Genesi**, che è il caso difficile e va guardato a parte: id diversi
   (`mdl`, `mdl-foot`, `mdl-campo`) e un `chiediValore` con il **terzo
   parametro incompatibile** — un valore invece dell'HTML del campo.

## Nessun blocco

Restano aperte le decisioni del fondatore in `DECISIONI_WEEKEND.md`
(punti 5a/5b, 10, 11, 12, 13, 14, 15).
