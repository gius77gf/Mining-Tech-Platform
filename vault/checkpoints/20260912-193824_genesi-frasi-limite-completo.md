# Checkpoint — 2026-09-12T19:38:24Z

## Tipo
correzione di banco di verifica (nessun codice di prodotto toccato)

## App
Genesi (direttiva del fondatore ancora in vigore: solo Genesi)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`74b898b8`

## Completato

Chiuso l'ultimo residuo dichiarato nel checkpoint 134: il fallito
isolato di `genesi-frasi-limite.mjs` («✓ Volata importata: 1 foro»)
era stato diagnosticato come "ordine di intercettazione di
`window.toast`" — **diagnosi sbagliata**. Rimisurando: `window.toast`
viene assegnato prestissimo (script classico `defer` in testa alla
pagina, righe 1052-1053 di `genesi.html`, che precede il modulo lento);
la causa vera è la STESSA di `vaiA` e di `genesi-struttura.mjs`, in una
veste diversa che l'aveva nascosta — `$('fileIn').onchange=...` (riga
~3053) viene assegnato durante lo stesso avvio sincrono lento (13-20s
senza GPU, la costruzione della scena 3D a riga ~1452 blocca tutto
quello che segue nello stesso script) di `disclaimerChk.onchange`
(riga ~4838). Il caso "i file importati con un foro" chiamava
`dai(pg,'fileIn',...)` **subito dopo** `apri()`, che aspettava solo
2,6s fissi: il `change` scattava nel vuoto — nessun gestore lo
ascoltava ancora — e non si ripresenta da solo, quindi `aspettaToast`
esauriva i suoi 25s aspettando un toast che non sarebbe mai arrivato.
Non un'attesa più lunga da dare: un evento sparato a vuoto.

Sostituita l'attesa fissa di 2,6s dentro `apri()` con un'attesa attiva
dello sparire di `#splash` (tetto 25s), lo stesso pattern già usato in
`vaiA` e in `genesi-struttura.mjs`. **Risultato: 35/36 → 36/36.**
Controprova (`--controprova`) confermata: 16 prove cadute con gli 11
difetti rimessi — il banco sa ancora fallire.

**Con questa unità si chiude davvero, senza residui, la famiglia
"splash lento" scoperta in questo blocco**: quattro banchi Genesi
(`genesi-numeri-tranquilli.mjs`, `genesi-frasi-limite.mjs`,
`genesi-foglio-in-cava.mjs`, `genesi-struttura.mjs`), 66 falliti
pre-esistenti chiusi, tutti la stessa causa unica.

⚠️ **Lezione da tenere**: la diagnosi scritta nel checkpoint 134 era
plausibile e sbagliata — un classico "la correzione ovvia è sbagliata,
si misura prima di credere alla prima spiegazione". La differenza fra
le due diagnosi si è vista solo aprendo `genesi.html` e controllando
DOVE (prima o dopo la costruzione della scena 3D) il gestore in
questione viene assegnato, non rileggendo il banco.

Verificato su worktree della copia di ciò che si committa (non sulla
cartella viva): `apps/deepwork-id/tests/giro-node.mjs` → **40 comandi a
posto, 0 caduti**. Nessun file di prodotto toccato.

## Stato roadmap

Nessuna voce nuova: chiusura definitiva del filone di correzioni di
infrastruttura di verifica aperto in questo blocco (unità 132-135).

## Blocchi e limiti noti

Nessuno rimasto sui quattro banchi Genesi coinvolti in questo filone.

## Prossimo passo atomico

Con la famiglia "splash lento" chiusa senza residui, le strade aperte
restano quelle del checkpoint 134:
1. Tornare al lavoro sul prodotto: P2.1 (frammentazione da foto) resta
   bloccato sulla decisione #28 in `docs/DECISIONI_WEEKEND.md`; il
   cantiere B3 (funzioni estraibili da `genesi.html`) è in gran parte
   esaurito dei candidati facili (checkpoint 20260912-175849).
2. Una ricerca di fianco è stata lanciata in background su un angolo
   utile alla decisione #28 (metodi/algoritmi noti di misura della
   frammentazione da foto, software di riferimento, librerie
   open-source utilizzabili in un browser senza backend, limiti noti
   della tecnica) — da raccogliere e appendere a
   `docs/RICERCA_CONTINUA_GENESI.md` quando torna, poi eventualmente da
   tradurre in un delta (solo la metà mondo per ora, nessun confronto
   col codice fatto dall'agente).
3. **Candidato scartato con la misura, per chi lo ritrovasse**: la
   ricerca presplit/detonatori (sezione già in
   `docs/RICERCA_CONTINUA_GENESI.md`) suggerisce che la finestra fissa
   della carica lineare del presplit (0,25-0,9 kg/m, righe ~6259-6268
   di `genesi.html`) è calibrata solo per Ø76-115mm mentre il campo
   diametro va 50-160mm — una "firma troppo stretta" della stessa
   famiglia già nota in questo file. Tentata una scala quadratica
   (carica ∝ diametro²) derivata dai due estremi già scelti: **il
   valore di default della pagina (Ø102mm, 0,4 kg/m) risulterebbe
   marcato "troppo basso" con la nuova formula**, un cambio di
   comportamento sul default che nessuna fonte di prima mano conferma.
   Scartato senza commit per lo stesso principio già scritto in
   CLAUDE.md: "farla a metà è peggio di non farla" — una soglia
   safety-adjacent non si stringe su un'estrapolazione fisica non
   verificata. Se qualcuno la riprende: verificare PRIMA con una fonte
   primaria la densità reale di un esplosivo da presplit disaccoppiato,
   non dedurla dai due estremi esistenti.
