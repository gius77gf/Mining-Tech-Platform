# Checkpoint — 2026-09-14T01:56:29Z

## Tipo
unit-complete (decisione auto-decisa dal ciclo, unità completa)

## App
Genesi

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Completato

**B0-septies risolta** — la decisione roadmap del 04/09 su "che cosa disegna
una pianta senza maglia" (burden/interasse non numerici). La settimana
concessa il 04/09 è passata senza risposta del fondatore, e per questa voce
l'auto-decide NON era stato revocato (a differenza della segnalazione
boretrack in `DECISIONI_WEEKEND.md` §6, che resta bloccata).

**Scoperto scomponendo prima di scrivere codice**: i punti che leggono un
ripiego (`D2.S||3.5`, `D2.B||3`, `D2.prof||10`) sono **11+**, non le cinque
funzioni nominate dalla roadmap (`computeEnergia2D`, `computeSeq2D`,
`computeRelief2D`, `_spazTipico`, `drawInnesco`) — e nessuno di quei punti
sta nel modulo dati, sono tutti nella pagina. Farli convergere uno per uno
era esattamente la trappola che la roadmap stessa dichiarava ("se le cinque
divergono, la pianta e i numeri raccontano due volate diverse").

**Misurato empiricamente (Node, non deduzione) che cosa succede OGGI**, prima
di decidere la correzione: `genMaglia2D` non ha NESSUN ripiego (a differenza
dei cinque consumatori a valle) — usa `D2.B`/`D2.S` grezzi. Con `B` o `S`
`null`, `c*null` e `r*null` sono coercizioni a **zero**, quindi ogni foro
finisce disegnato sullo stesso punto `(0,0)`: un conteggio foro corretto
sopra una geometria completamente falsa. Non "3,5×4" come lasciava intendere
una riga di `docs/DECISIONI_WEEKEND.md` datata 14/08 (corretta anche quella,
sul posto, senza cancellare la riga originale — vedi sotto).

**La cura è alla radice, non sui cinque consumatori**: nuova funzione pura
`magliaAssenteMotivo(B, S)` in `genesi-data.js` (blocco G37) che dichiara
QUALE dei due manca ("burden", "interasse", "burden e interasse", o `null`
se entrambi leggibili). `genMaglia2D()` la chiama per prima cosa: se la
maglia non è posizionabile, non genera nessuna coordinata (niente holes,
niente `(0,0)` sovrapposti) e imposta `D2.magliaAssente`. I cinque
consumatori a valle **non vengono mai chiamati** su una maglia vuota: hanno
già tutti una guardia `if(!H.length) return` scritta per altre ragioni —
quindi la scelta fra "pianta vuota con una frase" e "maglia proposta e
dichiarata" (la domanda che la roadmap poneva) era già decisa dal codice
esistente: con zero fori generati, l'unica strada percorribile è la prima
(Scelta A), coerente col principio "l'assenza di un dato non è un dato
favorevole" già applicato al caso gemello B0-nonies (l'interasse, chiuso il
10/08).

**Superficie toccata, tenuta minima apposta**:
- `apps/genesi/genesi-data.js`: `magliaAssenteMotivo(B,S)` (G37).
- `apps/genesi/genesi.html`: `genMaglia2D()` chiama la guardia e si ferma
  prima di generare coordinate; `drawDesign2D()` disegna la frase dichiarata
  sul canvas vuoto invece di lasciarlo muto; `renderScheda2D()` esce con la
  stessa frase invece di calcolare decine di badge su `B`/`S` `null` (S/B,
  H/B, B/Dm sarebbero usciti NaN o zero di coercizione); l'handler "apri
  volata" azzera `D2.magliaAssente` per non lasciare una dichiarazione stale
  da una volata precedente su una volata sana appena aperta.
- **Non toccato**: i cinque `||` a valle restano scritti come sono — non
  eseguono mai su una maglia vuota, quindi non serviva farli convergere, e
  toccarli comunque avrebbe voluto dire riscrivere codice che con questa
  cura non fa più danno.

**Verificato**:
1. `run-kpi.mjs`: 3 nuove prove su `magliaAssenteMotivo` (leggibile,
   quale-manca, zero/negativo/NaN/stringa) — 2941 → **2944**, 0 falliti.
2. `copertura-funzioni.mjs`: `genesi-data.js` 144/144 → **145/145**.
3. `genesi-estraibili.mjs`: `genMaglia2D` guadagna una variabile del modulo
   (la dichiarazione) e scivola dal bucket "sei-dieci" (22) al bucket "più di
   dieci" (38→39, 22→21) — dichiarato in `docs/DEVELOPMENT.md` con la data,
   il "57 estraibili" non cambia (deriva da altri due bucket).
4. `sintassi-pagine.mjs`, `run-stile.mjs`: puliti.
5. Verifica su `git worktree` isolata + `giro-node.mjs` completo (40
   comandi): **40 a posto, 0 caduti** — inclusa la correzione a cascata di
   `numeri-nei-documenti.mjs` (vedi sotto), verificata con un **secondo** giro
   completo dopo la correzione (il totale delle asserzioni cambia fra un giro
   che include un comando fallito e uno che lo include passato — noto e
   documentato in CLAUDE.md: si legge il numero del giro che è arrivato in
   fondo pulito, non quello del primo tentativo).
6. **Verifica nel browser vero** (Playwright, Chromium preinstallato, server
   proprio con contrassegno pid, `?go=design` per bypassare il login in
   locale, `window.__genesi.D2` per iniettare `B`/`S` `null` e forzare il
   ridisegno cliccando la voce "2D" della barra in basso — la stessa che
   `setScreen('design')` chiama incondizionatamente): 5 scenari (maglia
   sana → burden assente → interasse assente → entrambi assenti → tornata
   sana), **0 errori di pagina**, il canvas mostra "Pianta non disegnabile:
   manca burden/interasse/burden e interasse" centrato invece di fori
   sovrapposti o di un vuoto muto, la scheda mostra la stessa frase invece di
   badge calcolati su `null`, e la maglia torna a disegnarsi correttamente
   (12 fori) appena `B`/`S` tornano leggibili — nessuna dichiarazione stale.
   Screenshot in `scratchpad/screenshot-b0septies/` (non nel repository).

**Corretto a cascata (scoperto dal giro, non dimenticato)**: quattro numeri
nei documenti erano diventati stale per via di questa unità
(`numeri-nei-documenti.mjs` li sorveglia tutti): il totale delle nove suite
`node` (3.422→**3.425**, poi **3.883** per il giro completo — misurato in
DUE passate, la prima con `numeri-nei-documenti` ancora rosso stampa un
totale diverso da quando è verde, uno dei quirk già documentati in
CLAUDE.md), il conto dei moduli condivisi (308/308→**309/309**), il conto
di `genesi-data.js` (144/144→**145/145**), e la tabella dei bucket di
`genesi-estraibili` (22/38→**21/39**). Tutti e quattro corretti in
`docs/DEVELOPMENT.md`, `docs/STATO_PRODOTTO.md`, `docs/DECISIONI_WEEKEND.md`,
`vault/ROADMAP_SETTIMANA.md` — e l'indice delle voci aperte in
`ROADMAP_SETTIMANA.md` aggiornato togliendo la riga di B0-septies, ora
chiusa.

**Corretta una riga di documentazione stale su un fatto verificabile, senza
cancellarla**: `docs/DECISIONI_WEEKEND.md` (14/08) diceva "il disegno
continua a usare 3,5 e 4" per la maglia senza dati — misurato direttamente
che non è così (collassa a `(0,0)`, non a 3,5×4). La riga resta, con
un'annotazione datata che spiega la discrepanza invece di farla sparire.

## Stato roadmap

B0-septies: `[ ]` → `[x]` con la chiusura scritta per intero, tolta
dall'indice delle voci aperte. Restano invariate: la segnalazione boretrack
(§6 DECISIONI_WEEKEND.md, bloccata sul fondatore, auto-decide revocato) e la
soglia USBM/DIN (§9, non toccata, tocca soglie di sicurezza).

## Blocchi e limiti noti

Nessun nuovo blocco. La direttiva "concentrati solo su Genesi" resta in
vigore.

## Prossimo passo atomico

Rileggere `vault/ROADMAP_SETTIMANA.md` per intero alla ricerca della
prossima voce Genesi ancora aperta (l'indice appena aggiornato aiuta), o
aprire una nuova ricerca di fianco su un argomento della regola 1 di
CLAUDE.md non ancora coperto per Genesi. Nessuno stop volontario: si
prosegue subito.
