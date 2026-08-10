# Checkpoint — 2026-08-10T00:11:05Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`91bda18` — *test: il documento diceva 125 e i suoi quattro addendi ne facevano
123*
(prima: `cb843f9` la scomposizione del codice condiviso, `5022be5` i tre
cantieri, `1805f43` la tabella del cantiere di Genesi)

## Che cosa è stato fatto

Tre unità di fila sulla stessa famiglia, e il filo è **uno solo**:

> ⛔ **Dichiarare un punto cieco non lo illumina.**

Quattro casi in una giornata, e in tutti e quattro la dichiarazione **c'era**,
scritta bene, accanto al numero:

| il documento diceva | la dichiarazione accanto | quanto era stale |
|---|---|---|
| tabella del cantiere di Genesi | *«se un giorno divergono, ha ragione l'uscita e torto il commento»* | **7 numeri su 7**, da otto giorni |
| copertura dei moduli condivisi | *«il controllo sorveglia il totale, non questa scomposizione: rimisurati a mano»* | 5 su 6, il giorno dopo |
| «125 con l'emulatore Firestore» | *(nessuna: i suoi addendi fanno 123, nella stessa frase)* | e l'altro documento diceva 123 |
| «2.757 asserzioni» | *«un conto che si muove da solo va derivato da un comando»* | **58** — e il comando c'era |

⚠️ **E nessuno dei quattro è nato da una distrazione**: erano veri quando sono
stati scritti, e sono diventati falsi **perché il lavoro andava avanti** — tre
fette di Genesi uscite dalla pagina, ventun funzioni nuove in `genesi-data.js`.
Il documento invecchia proprio quando le cose vanno bene.

### La cura, in tre pezzi
1. **Ogni numero è sorvegliato dove NASCE.** La tabella di Genesi e la
   scomposizione dei condivisi in `numeri-nei-documenti.mjs` (che lancia il
   censimento e confronta **scaglione per scaglione**, **modulo per modulo** —
   il totale da solo non basta: il 01/08 la somma era giusta e gli addendi
   vecchi); il totale del giro dentro **`giro-node.mjs`**, che è l'unico ad
   averli lanciati tutti — metterlo altrove vorrebbe dire rilanciare il giro
   dentro il giro.
2. **Gli elenchi sono DERIVATI, non gemelli.** I moduli condivisi si leggono
   dall'uscita del censimento: un modulo nuovo entra da sé. Un elenco a mano non
   può accorgersi di ciò che non sa esistere — è il difetto che il 07/08 è
   costato `chiediDati`, sei chiamate a una funzione mai definita.
3. **Il censimento di dove il controllo arriva.** Uno strumento che chiede
   *«quanti numeri dichiarati cadono su una riga che una regola guarda
   davvero?»*: ha nominato **tre dei quattro difetti** in un'ora. Portato dallo
   scratchpad ai test, com'è scritto in `CLAUDE.md`. È una **misura**, non una
   regola: elenca **candidati**, e dichiara il proprio dubbio in due punti (le
   regole iscritte sono 18, non tutte quelle del file; si contano solo i numeri
   accanto a una parola che una suite sa contare). Su `DEVELOPMENT.md` i numeri
   coperti sono passati da **3 a 8** su 12.

### E una prova che pinnava dodici nomi adesso guarda il denominatore
In `run-kpi`: il censimento dei ripieghi col clamp di Genesi guardava dodici
**nomi**, uno per uno — un tredicesimo campo scritto domani con la forma vecchia
non l'avrebbe visto nessuna, e la suite avrebbe detto «nessuna violazione» con
la faccia della verità. Adesso guarda il **corpo intero** di `applyDesign` e
pretende l'elenco esatto (8 ripieghi, 3 col clamp, con la ragione scritta
accanto alle loro righe e **pretesa** dalla prova).
⚠️ La stesura consegnata dal cantiere conteneva
`eq(Math.max(0.1, Math.min(2, NaN||null)), 0.1)` coi limiti scritti nella sua
tabella: aritmetica su costanti sue, cioè una prova che passerebbe anche se il
codice cambiasse i limiti. Adesso il minimo si legge dalla **riga vera** e il
valore atteso è quello **misurato nel browser**.

## Controprove
- tabella di Genesi: uno scaglione riportato al 01/08 (58 → 64) — **zero
  caratteri di differenza**, quindi l'ancora è un `assert` sulla stringa, non
  una conta; e la frase/totale (65/169 → 110/192);
- condivisi: i quattro valori riportati all'08/08 — il controllo li nomina tutti
  e quattro, uno per uno;
- emulatore: due gradi, il totale scostato dai suoi addendi **e** il caso
  coerente con sé stesso ma falso perché l'addendo non è quello che la suite
  dichiara — la sola cosa che un controllo di coerenza non saprebbe fare;
- clamp: su una **copia in memoria** (il file vero non si tocca: un cantiere lo
  sta scrivendo) — un tredicesimo campo porta i ripieghi da 8 a 9.
⚠️ E un tentativo d'iniezione è fallito **in modo utile**: «110 su 192» compare
adesso anche nel racconto, e l'`assert` sul numero di occorrenze l'ha fermato
invece di lasciarlo passare a vuoto. È la famiglia del `sed` che non trova.

## Verifica
Sempre sulla **copia di ciò che si committa**, e stanotte serviva davvero: sul
disco tre prove cadono perché i cantieri stanno scrivendo in `genesi.html` e
`campo-data.js` e i numeri si muovono sotto la misura. Sulla copia:
**34 comandi a posto, 0 caduti**, **2815** asserzioni.

## Stato roadmap
Chiuse: **B0-quinquies** (`#sm-cava`), **B0-sexies** (erano tre, non quindici),
**B0-octies** (la tabella di Genesi), **B3-bis** (il ponte di Campo).
Aperte e nuove: **B0-nonies** (il 2D di Genesi che muore con l'interasse
assente), **B0-decies** (il recettore assente che fa dire «SUPERA»),
**B3-ter** («Sui 1 fori già caricati»), **B4-bis** (le tendine del core che non
misura nessuno). Restano **B0-septies** (la maglia degenere: decisione di
prodotto, ferma al fondatore) e **B0-bis**.

## Prossimo passo atomico
Aspettare il giro `--tz` sulla copia (verifica l'unità di `giro-node`, che tocca
proprio il ramo dell'ora italiana), committarla, e poi **raccogliere i tre
cantieri vivi uno per volta** — Genesi 2D, tendine del core, clamp nelle altre
cinque app — rimisurando ogni affermazione **prima** di committare e mettendo
nell'indice **solo** i file di quel cantiere.
Poi integrare il banco `genesi-campi-assenti.mjs` (già scritto, in scratchpad) e
registrarlo in `tutti.mjs`: ⚠️ **solo dopo** che B0-nonies è chiuso, se no il
giro parte rosso per una ragione vera.

## Blocchi
Nessuno. Il giro del browser non è stato rilanciato: tre cantieri tengono
Chromium.
