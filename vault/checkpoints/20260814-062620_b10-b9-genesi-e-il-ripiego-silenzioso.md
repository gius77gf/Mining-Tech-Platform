# Checkpoint — 2026-08-14 06:26 UTC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit di questo tratto
- `1d874982` — B10: il giro si può lanciare a pezzi, e un pezzo lo dichiara
- `400ab48f` — B9: `ragioneData` in un posto solo, guardiano da 9 a 19 lettori
- `25dae8c1` — Genesi: la frequenza scritta accanto alla soglia non era quella
  con cui la soglia era stata scelta
- `e0a853d1` — B11: il ripiego silenzioso, censito a tre gradini

## Che cosa è stato completato

**B10 — la verifica tutto-o-niente non veniva fatta.** 198 passate × 4,1 min =
**13,5 ore**: il giro del browser non finisce dentro una sessione, e due notti
di fila è stato spento a metà con i primi KO che erano difetti **chiusi cinque
ore prima**. Adesso `--solo=` e `--da=` sul runner. Misure: `--solo=scudo` →
**12 passate su 198**, con **5 controprove** dello stesso file (un banco scelto
senza la sua controprova girerebbe senza la prova di saper fallire).
⛔ **La metà che è costata di più è la DICHIARAZIONE**, non il filtro: un giro
parziale stampa le stesse frasi di uno intero. Il primo uso vero, alle 06:25, ha
aperto il registro con «⚠️ GIRO PARZIALE: 21 passate su 198 … Le altre 177 NON
sono state misurate».

**B9 — `ragioneData` era scritta due volte** e in `shared/` non c'era. Adesso è
una sola, con la prova sull'**identità**. ⛔ E la **forma dell'alias è una
misura**: `export { X } from` è invisibile a `nomi-doppi`, `export const X = Y`
no — 38/24/11 → **40/26/13**. Guardiano dei lettori CSV: **9 → 19 su 19**,
elenco derivato dal disco e numeratore raccolto.

**Genesi — B0-decies era GIÀ CHIUSA**, e la riga aperta stava mandando a rifare
un lavoro del 10/08 (terza forma d'invecchiamento). Riverificando è uscito il
**residuo**: 9,6 Hz dà soglia 5 mm/s (giusta) raccontata come «**5 @ 10 Hz**», e
a 10 Hz la norma dice 15 — una coppia **che non esiste nella tabella**. Nessuna
soglia toccata.

**B11 — il ripiego silenzioso**, censito a tre gradini: **343 → 144 → 1 vivo**.
Flotta contava **1 pezzo** per ogni intervento vecchio: 6 contro 18 sullo stesso
consumo, nel verso che **rassicura**.

## ⛔ Le tre cose che valgono più delle unità
1. **Un «non c'è» falso l'ha detto il SOGGETTO, non la rilettura.** Il valore
   d'esempio che avevo scritto io nella voce B9 era sbagliato: `01/03/2026`
   entra in `parseTaratureCsv` (legge con `dataIso`). Il cantiere l'ha misurato
   invece di crederci, e la coppia vera era un'altra.
2. **Il quarto apostrofo, e stavolta ha ingannato la PROVA.** Il lettore dei
   banchi usava `'([^']+)'`: sei nomi su 198 hanno un apostrofo sfuggito, ne
   leggeva **192** e sarebbe restato verde per sempre. L'ha preso il
   **denominatore scritto come asserzione**, non la rilettura.
3. **Un conto che esisteva e nessuno leggeva.** `daInterventiVecchi` di Flotta:
   **0** occorrenze nella pagina contro le 10 di `senzaData` nello stesso file.
   Una dichiarazione che nessuno legge non protegge niente.

## Le misure
`run-kpi` 2238 → **2252**, `run-stile` 322/0, copertura app 751 → **753/753**,
condivisi 179 → **180/180**, prove **2.694 → 2.708**, giro `node` **35 comandi a
posto, 0 caduti**, **3.074** asserzioni. Tutto misurato sulla **copia di quello
che si committa**, un'unità per volta, con l'indice costruito da HEAD più il solo
blocco di ciascuna (tre cantieri scrivevano dentro `run-kpi.mjs`).

## Che cos'è vivo
- **Il giro MIRATO** dalle 06:25 su `e0a853d1`: 21 passate (Flotta, Genesi,
  import, CSV, pagine vive), stima ~90 minuti. Registro in
  `…/scratchpad/giro-mirato/registro.txt`. Il giro delle 04:29 è stato **letto,
  spento e la porta liberata**: era a 18 passate su 198 e 19 commit indietro.

## Prossimo passo atomico
Aprire tre cantieri sui perimetri liberi (tutti `node`, il browser è occupato):
**Conti** (`canonePeriodo` risponde `dovuto: 0` con l'aliquota mai impostata —
uno zero tranquillo su soldi dovuti all'ente; oggi l'unico lettore rifà la
guardia per conto suo, quindi è **latente**, ed è la copia debole che aspetta il
secondo lettore); **Scudo + Sentinella** (la seconda metà del censimento B11:
quelle due app non sono state guardate); **B4** (le mancanze confermate del
delta). Poi leggere il giro mirato con `browser/leggi-giro.mjs` e riverificare
ogni KO prima di aprirci un cantiere.

## Blocchi
- **Force-with-lease sul ramo**: fermo al fondatore; CI verde con l'eccezione
  dichiarata e sorvegliata.
- **B0-septies**, le **soglie di sicurezza** e — nuova — **`dRecFreq` intero
  all'ingresso** (porterebbe la soglia da 5 a 15 mm/s: più permissiva su un
  numero che decide se si può sparare): fermi al fondatore.
- **B6** (la finestra di caricamento) vuole il browser: aspetta il giro mirato.
