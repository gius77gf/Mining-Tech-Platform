# Checkpoint — 2026-09-19T16:48:49Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
aa61fc18 (chore(genesi): checkpoint verifica diretta export CSV/DXF/XML)

## Cosa è stato completato
Continuando la verifica diretta sugli export di Genesi (checkpoint
precedente), ho tolto un foro dalla maglia con drag+Canc (gesto reale) e
riesportato CSV/DXF/XML: un foro col vicino più vicino già sparato ma a
7 m di distanza (oltre `dMax`=5,25 m) mostrava lo stesso messaggio del
vero primo foro della volata — «primo della sua zona: spara sulla faccia
già libera» — quando in realtà un vicino AVEVA già sparato, solo troppo
lontano per dirsi adiacente. Trovato con una verifica diretta (screenshot
+ lettura del testo dell'ispettore), non da un agente.

- [x] **G56c — `reliefSuMaglia` (genesi-data.js)**: distingue ora le due
  cause di `relief=null` con un nuovo campo `h.relFuoriFascia` (vero
  primo della zona vs. vicino fuori dalla distanza di adiacenza, quasi
  sempre un foro mancante nella maglia).
- [x] **`classeRelief`/`reliefCls`**: nuovo quarto parametro `fuoriFascia`,
  nuova classe `noneGap` (colore di attenzione, non quello neutro di
  `none`). `RELCOL` aggiornato (6 classi invece di 5).
- [x] **Tre superfici corrette** (tutte verificate dal vivo con
  Playwright, non solo a unità):
  1. testo dell'ispettore (genesi.html ~6680): messaggio distinto invece
     del «primo della sua zona» falso;
  2. pallino sulla pianta (genesi.html ~6396): colore di attenzione +
     anello di segnalazione (automatico, la condizione esistente
     `rcl!=='ok' && rcl!=='none'` include già `noneGap`);
  3. riepilogo «Relief per foro» nel Validatore (genesi.html ~7191): non
     scartava più in silenzio i fori fuori fascia dal conteggio — poteva
     scrivere «tutti i fori sono dentro la finestra impostata» ignorando
     proprio il foro col relief non verificabile. Ora conta `nGap` a
     parte e cambia sia la classe (`sv-warn`) sia la frase.
- [x] Test nuovi in `run-kpi.mjs`: `classeRelief`/`reliefCls` con
  `fuoriFascia`, e un caso end-to-end con 6 fori su una fila (uno tolto)
  che riproduce esattamente lo scenario trovato dal vivo. Il test byte-
  per-byte contro la vecchia forma inline di `reliefSuMaglia` aggiornato
  per includere la stessa logica (altrimenti sarebbe caduto per un
  motivo sbagliato: un campo in più, non un comportamento diverso).
- [x] **Trovato e corretto en passant, durante la verifica del giro
  completo**: un mio stesso checkpoint (`20260919-160145_...`) era
  datato 2 minuti AVANTI rispetto a quando è entrato in git (ora
  stimata durante il ragionamento invece di `date -u` letta subito prima
  di scrivere) — quinta volta della stessa causa già nota in
  `date-checkpoint.mjs`. Rinominato col nome giusto
  (`20260919-155943_...`) e aggiunta la quinta voce a `SCUSATI` per il
  percorso vecchio rimasto nella storia (la regola è sorvegliata: cade
  da sola se la storia viene riscritta).
- [x] Propagati i numeri nei 4 documenti tracciati: prove `node`
  3.709→**3.711** (3211→3213 sulle funzioni delle app), asserzioni del
  giro completo **4265** (corretto anche un 4263 rimasto scritto da
  dopo G56b, e poi il numero vero è salito di nuovo mentre correggevo
  `date-checkpoint.mjs`/`numeri-nei-documenti.mjs`, perché un comando
  che cade non viene contato finché cade).

## Verifica prima del commit
- `run-kpi.mjs`: 3213/0 (era 3211/0).
- `sintassi-pagine.mjs`: 34/0. `nomi-liberi.mjs`: 32/0.
- `numeri-nei-documenti.mjs`: 43/0 (era 41 passati/2 falliti prima delle
  correzioni sui numeri).
- `date-checkpoint.mjs`: 10/0 (era 9 passati/1 fallito prima del
  rinomino + SCUSATI).
- **`giro-node.mjs` completo, DUE VOLTE di fila sullo stesso stato**:
  41 comandi a posto, 0 caduti, «e i 2 documenti che lo dichiarano dicono
  lo stesso numero» — lanciato per intero prima di questo commit, non
  dopo.
- **`tutti.mjs --solo=genesi` (browser)**: 73 banchi a posto, 22 da
  guardare (per lo più controprove che mostrano rosso VOLUTO — verificato
  leggendo l'intestazione di ognuna). Un solo KO reale non-controprova:
  `genesi-frasi-limite.mjs` (2 falliti, «il CSV che esce dall'azienda ha
  la colonna della base») — **verificato con `git stash` che esiste già
  su HEAD (aa61fc18), prima di qualunque mia modifica**: non è mio,
  resta come prossimo candidato.
- Verifica visiva diretta (Playwright, non solo unità): letto il testo
  reale dell'ispettore su un foro col buco («relief non calcolabile: il
  vicino più vicino già sparato è oltre la distanza di adiacenza…») e la
  riga HTML reale del Validatore («0 sotto / 0 sopra / 1 non verificabile»,
  `sv-warn`) — sia PRIMA del fix (messaggio falso confermato) sia DOPO
  (messaggio corretto confermato).

## Stato roadmap
Verifica diretta sugli export di Genesi: completata con un difetto vero
trovato e corretto (relief=null a due cause). Prossimo: lo stesso metodo
(scenario asimmetrico, non solo la maglia di demo uniforme) su altre
funzioni di Genesi, oppure il KO pre-esistente di `genesi-frasi-limite.mjs`.

## Prossimi passi
- **Prossimo passo atomico**: investigare il KO pre-esistente in
  `genesi-frasi-limite.mjs` («il CSV che esce dall'azienda ha la colonna
  della base» — leggere `_riconRiassuntoCampo`/`csvRiconciliazione` in
  genesi-data.js e la colonna attesa dal banco, capire se il difetto è
  nel prodotto o nel banco invecchiato, PRIMA di correggere).
- In parallelo/alternativa: continuare la verifica diretta (drag+Canc,
  scenari asimmetrici) su altre funzioni foro-per-foro di Genesi
  (`innescoSuMaglia`, `energiaSuMaglia`) che condividono la stessa forma
  «vicino più vicino entro una distanza massima» e potrebbero avere lo
  stesso difetto di `reliefSuMaglia` prima di questa unità.
- Mandato del fondatore invariato: solo Genesi, massimo sforzo, ricerca
  competitor sospesa per il tasso di falsi allarmi già misurato.

## Blocchi
Nessuno.
