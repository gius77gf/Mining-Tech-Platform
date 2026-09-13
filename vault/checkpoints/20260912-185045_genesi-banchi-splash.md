# Checkpoint — 2026-09-12T18:50:45Z

## Tipo
correzione di banchi di verifica (nessun codice di prodotto toccato)

## App
Genesi (direttiva del fondatore ancora in vigore: solo Genesi)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`3836c844`

## Completato

Durante una verifica di qualità di routine (non intendevo cambiare
codice), ho lanciato `genesi-numeri-tranquilli.mjs` e ho trovato **30
falliti su 35**, tutti con lo stesso segno: "navigato davvero (→ design)"
restava su "scr-home". Prima di credere a un difetto vero (regola di
CLAUDE.md — "niente entra sulla parola di un banco senza verificare"),
ho misurato:

1. Con `elementFromPoint` sul centro del bottone della barra: al momento
   del click c'è ancora `DIV#splash` sopra, che intercetta l'evento.
2. Lo splash ha il suo timer a 1250ms (+600ms per la rimozione), ma in
   QUESTO ambiente (container senza GPU) la scena 3D iniziale è lenta a
   costruirsi e lo splash resta visibile fino a **15-20 secondi** —
   dieci volte più a lungo del previsto.
3. **Verificato che NON fosse una regressione**: stesso identico
   risultato (30/35) su una worktree del commit precedente a TUTTA
   questa sessione (prima dell'unità 126). I banchi aspettavano troppo
   poco da quando sono stati scritti — un rosso costante che nessuno
   guardava più.

Trovato lo stesso identico difetto (click singolo + attesa fissa) in
altri due banchi Genesi: `genesi-frasi-limite.mjs` (28 falliti) e
`genesi-foglio-in-cava.mjs` (si schiantava con un'eccezione mai
gestita, senza nemmeno arrivare a un riepilogo).

**La cura, identica nei tre file**: sostituito il click-singolo-e-aspetta
con un ciclo che riprova il click ogni 400ms per un tetto di 25
secondi — costa pochi millisecondi quando lo splash è già sparito,
recupera i secondi che servono quando non lo è.

**Risultato, verificato con le rispettive controprove** (che devono
continuare a saper fallire quando i difetti veri vengono rimessi):
- `genesi-numeri-tranquilli.mjs`: 5/35 → **35/35** (controprova: 18 KO attesi, confermati)
- `genesi-foglio-in-cava.mjs`: crash → **38/38** (controprova: 13 KO attesi, confermati)
- `genesi-frasi-limite.mjs`: 8/36 → **32/36** (4 restano, causa diversa — vedi sotto)

Verificato anche `iniezioni-fresche.mjs` (559/559 invariato: nessuna
tabella di controprova disturbata) e `node --check` sui tre file
(sintassi valida).

## Stato roadmap

Nessuna voce nuova: correzione di infrastruttura di verifica, non una
funzionalità di Genesi.

## Blocchi e limiti noti

- ⛔ **`genesi-frasi-limite.mjs` ha ancora 4 falliti, causa DIVERSA e non
  diagnosticata a fondo.** I contatori della Home (`hgVolN`, `hgNuvN`,
  `hgNuvole`) restano testo vuoto quando si inietta uno storico via
  `localStorage.setItem("genesiVolate", ...)`/`"genesiNuvole"`, anche
  dopo 20 secondi di attesa — e in quel caso specifico lo splash
  NEMMENO sparisce entro 20s (diverso dagli altri casi misurati, dove
  spariva). Indagando: `renderHome()` legge da `GDB.volate()`/
  `GDB.nuvole()`, e `GDB = await genesiData()` prova PRIMA una modalità
  "live" con `DeepworkID.init` e un `import` dinamico di
  `firebase-firestore.js` da `gstatic.com` (esterno, bloccato in questo
  ambiente) prima di eventualmente ripiegare su una modalità locale —
  non ho verificato se e quanto questo tentativo rallenti l'intera
  catena quando lo storico è pre-seminato. Non risolto in questa unità:
  serve un'indagine dedicata (non una correzione affrettata — è
  esattamente il tipo di causa che CLAUDE.md avverte di non
  "aggiustare a metà").
- `genesi-struttura.mjs` ha 4 falliti PRE-ESISTENTI e DIVERSI (verificati
  identici sulla stessa worktree di baseline): il modale non si chiude
  con Escape, e il campo della modale "Salva la volata" non esiste al
  momento del controllo (`chiediValore` sembra non aprire il campo
  atteso, o apre un modale diverso). NON indagato in questa unità —
  scoperto ma fuori dal perimetro di questo pezzo di lavoro.

## Prossimo passo atomico

Due strade aperte, entrambe legittime prosecuzioni di questa stessa
famiglia di scoperte:
1. **Indagare i 4 falliti di `genesi-frasi-limite.mjs`**: misurare se
   `genesiData()` in modalità "live" tenta davvero una chiamata di rete
   quando gira senza autenticazione, e se sì, quanto ci mette a fallire
   e ripiegare sulla modalità locale in QUESTO ambiente — potrebbe essere
   la stessa famiglia "aspetta troppo poco", o un problema diverso (dati
   letti dalla chiave sbagliata, o un ramo del codice che non ripiega
   mai). Misurare prima di correggere.
2. **Indagare i 4 falliti di `genesi-struttura.mjs`** (Escape/modale
   "Salva la volata"): diversi, pre-esistenti, mai spiegati.
In alternativa, tornare al lavoro sul prodotto: il gap P2.1
(frammentazione da foto) resta bloccato sulla decisione #28; il cantiere
B3 (funzioni estraibili) è in gran parte esaurito dei candidati facili
(vedi checkpoint dell'unità di verifica qualità precedente).
