# Checkpoint — 2026-09-19T20:06:46Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
9e6357bc (feat(genesi): G58, scala tratti dall'origine)

## Cosa è stato completato
Con le tre trasformazioni CAD (mirror/rotate/scale) chiuse e «Blocchi/
simboli riusabili» valutato e **scartato per ora** (il censimento di
`docs/RICERCA_GENESI_CAD.md` lo dichiara esso stesso costo GRANDE/priorità
BASSA-MEDIA, e Genesi non ha ancora un design-workflow in cui l'utente
salverebbe pattern — nessun caso d'uso reale verificato, non si costruisce
"perché un CAD ce l'ha"), il passo successivo è stato cercare nel resto
della ricerca su Genesi una mancanza reale e piccola.

- [x] **G59 — `deviazioneStatistiche(righe)` (genesi-data.js)**: la
  ricerca del 19/09 su Genesi (confronto con JKSimBlast/Blastatistics,
  `docs/RICERCA_CONTINUA_GENESI.md`) segnalava — dopo aver smentito 3 dei
  suoi 6 "non c'è" iniziali con un grep vero — una mancanza reale rimasta:
  nessun riepilogo statistico (media/massimo) sulla deviazione di
  perforazione letta da `deviazioneForiDaCsv`, solo l'elenco foro per
  foro. **Verificato di persona prima di scrivere una riga**: `grep -n
  "deviazioneStatistiche\|scartoMedio\|scarto.*massim" apps/genesi/` →
  zero righe. La mancanza era vera.
- [x] ⛔ **Scelta di dominio, non trovata per caso**: la funzione usa
  DELIBERATAMENTE la distanza radiale `Math.hypot(dx,dy)`, non `dx`/`dy`
  col segno. Il blocco rosso già presente sopra `burdenVeroDaRilievo`
  dichiara che la convenzione di assi del rilievo boretrack rispetto a
  Genesi NON è ancora confermata su un caso reale — usare dx/dy col segno
  avrebbe ereditato quell'incertezza. Una distanza è invariante per
  rotazione/riflessione degli assi: sicura da mostrare comunque, perché
  non inverte niente — dice "di quanto ha sbagliato la perforazione", non
  "in quale direzione".
- [x] UI: nel pannello di import del rilievo (`#d2-rilievo-esito`), una
  riga «Deviazione dal punto di progetto — media X m · massima Y m su N
  fori» sopra l'elenco per foro, con lo stesso stile discreto del resto
  del pannello (nessun elemento nuovo di UI, un riquadro coerente).
- [x] **Verificato dal vivo con Playwright** (progetto salvato con
  8 fori aperto via `localStorage.genesiVolate`, CSV di rilievo iniettato
  con `setInputFiles`): i numeri di media/massima confrontati A MANO
  (hypot(0.3,0.4)=0.5, hypot(0,0)=0, hypot(0.6,0.8)=1.0,
  hypot(0.09,0.12)=0.15 → media 0,4125→0,41, massima 1,00) — combaciano
  alla cifra. Caso con una sola riga verificato separatamente (singolare
  corretto: «su 1 foro»). Screenshot a 390/430 px: nessun overflow, buon
  contrasto, il pannello di burden-vero preesistente resta invariato.
- [x] 2 test nuovi in `run-kpi.mjs`: il calcolo (3-4-5/6-8-10 per hypot
  esatti, il segno di dx/dy che NON deve cambiare il risultato, vuoto/
  null → non misurabile, integrazione vera con `deviazioneForiDaCsv`) e
  il collegamento nella pagina (legge da `csv.righe` già validate, non
  dal testo grezzo del file).
- [x] Chiusa la riga che proponeva questo lavoro in
  `docs/RICERCA_CONTINUA_GENESI.md` (append, non riscritta) — la regola
  "chi chiude un cantiere chiude anche la riga che lo proponeva".

## Verifica prima del commit
- `run-kpi.mjs`: 3229/0 (era 3227/0).
- `sintassi-pagine.mjs`: 34/0.
- `numeri-nei-documenti.mjs`: 43/0 — propagati: prove `node` 3.725→
  **3.727**; funzioni condivise (genesi-data.js 177→**178**, totale
  350→**351**).
- **`giro-node.mjs` completo, DUE lanci consecutivi identici**: 41/41
  comandi a posto, 0 caduti, asserzioni **4281** entrambe le volte (era
  4279 prima di G59: +2, esattamente i due test nuovi — nessuna
  "instabilità" da rincorrere questa volta, perché si è aspettato che
  `numeri-nei-documenti.mjs` tornasse verde PRIMA di fidarsi del numero,
  non propagato a mente sopra il 4279 vecchio).
- ⛔ **Autoverifica del proprio errore, in diretta**: durante la
  propagazione ho scritto un placeholder (`§ASSERZIONI_GIRO_G59§`) in
  `STATO_PRODOTTO.md` per tornarci dopo aver saputo il numero vero —
  `giro-node.mjs` l'ha segnalato subito («la frase col totale non si
  trova... NON è sorvegliato da qui»), la stessa identica trappola già
  presa e corretta durante G58. Corretto immediatamente col numero vero
  appena disponibile, non lasciato per un ciclo successivo.
- `tutti.mjs --solo=genesi` (batch precedente, dopo G58): 74 banchi a
  posto, 21 da guardare — non ancora letto in dettaglio (il comando è
  stato lanciato con `| tail -20`, quindi il registro completo con
  l'elenco dei 21 non è stato salvato: da rifare con l'output intero su
  file, non solo la coda, al prossimo ciclo).

## Stato roadmap
Le quattro trasformazioni/mancanze principali del censimento CAD di
Genesi sono ora: mirror (G50) fatto, rotate (G57) fatto, scale (G58)
fatto, blocchi/simboli valutati e scartati per mancanza di caso d'uso
reale. G59 (statistica di QC sulla deviazione) chiude una mancanza
segnalata dalla ricerca sui competitor, non dal censimento CAD.

## Prossimi passi
- **Prossimo passo atomico**: rilanciare `tutti.mjs --solo=genesi` con
  l'output intero salvato su file (non `| tail -20`), leggere i 21 "da
  guardare" del batch precedente e distinguere KO veri da controprove
  volute PRIMA di aprire un cantiere su di essi.
- Continuare a cercare mancanze reali verificate di persona (grep prima
  di scrivere, come per G59) invece di costruire funzionalità "perché il
  censimento le nomina" senza un caso d'uso confermato.
- Mandato del fondatore invariato: solo Genesi, massimo sforzo.

## Blocchi
Nessuno.
