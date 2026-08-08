# Checkpoint — 2026-08-08T11:01:43Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
744af32

## Che cosa è stato completato
**Un banco che si pianta fermava il giro del browser in silenzio, per sempre.**

Il giro lanciato alle 03:00Z era ancora vivo alle 10:37 — **sette ore e
trentasette** — e il suo registro non cresceva da tre minuti. `ps --ppid` ha
detto perché: `uno-solo.mjs --controprova` era appeso da **quattro ore e
trentotto**, e `tutti.mjs` lo aspettava con `p.on('close', …)`, che non ha
limite.

⛔ **Il danno vero non è il tempo perso: è che il registro si tronca a metà di
una sezione e SEMBRA COMPLETO.** Chi lo apre legge le passate fatte, non vede
nessun errore, e crede di avere davanti il verdetto di tutto il giro. Le
passate mai eseguite **non compaiono in nessuna riga** — spariscono invece di
dichiararsi. È la famiglia del banco che crolla e dichiara meno prove, in una
veste peggiore: qui non crolla nemmeno, **tace**.
⚠️ E la prova che il difetto morde: ieri sera ho letto quel registro **tre
volte** — con `leggi-giro.mjs`, che è lo strumento scritto apposta per
leggerlo bene — senza accorgermi che era **fermo**.

### La difesa
`--limite=<secondi>`, 30 minuti di default (la passata più lunga misurata,
contrasto su 14 superfici, sta sotto i venti). Quando scatta:
· uccide l'**albero** del processo — `detached: true` + kill del gruppo, se no
  un Chromium orfano resta vivo a tenere porta e memoria;
· **dice** che quella passata non è stata misurata, e **tira avanti**;
· nel riepilogo le scadute si contano **a parte** e si stampano **prima dei
  KO**: un soggetto non misurato non è un soggetto a posto, e il giro non può
  dirsi verde (uscita ≠ 0);
· e il giro dichiara le sue **tre passate più lente**, così il limite si ritara
  su un numero invece che a sensazione.

### La controprova, nei due versi
`browser/limite-giro.mjs`, **9 prove**: due giri **finti**, uno con un banco
che non finisce mai e uno senza. Col banco appeso il giro deve dirlo, nominarlo,
contarlo a parte, far girare **lo stesso** gli altri e uscire ≠ 0; senza,
nessuna di quelle righe e uscita 0. Una guardia che scatta **sempre** passerebbe
il primo verso e renderebbe il giro inutilizzabile.

## Verifica
· copia di quello che si committa, confronto patch-a-patch identico: **26
  comandi, 0 caduti** (erano 25);
· totale del giro **2.601 → 2.611**, misurato sommando le righe «Risultato»;
· ripulite **18 worktree residue** da 19 MB l'una (~340 MB) lasciate dai giri
  precedenti.

## Stato roadmap
Prima unità del ciclo nuovo. Il passo atomico che avevo scritto ieri — «lanciare
un giro del browser nuovo» — si è rivelato **bloccato da un difetto degli
strumenti**, e questa unità l'ha tolto di mezzo.

## Prossimo passo atomico
1. ⛔ **Perché `uno-solo.mjs --controprova` si pianta.** Riprodotto **due volte**
   (4h38 dentro il giro, oltre 10 minuti a mano su un server mio). Quello che si
   sa: non è la regex (`1[ \u00A0]+(alternativa)\b` è lineare); il banco è
   **muto per costruzione** fino alla fine, quindi il silenzio non dice dove si
   ferma. Il modo per stringere: lanciarlo con `--solo=<superficie>` una alla
   volta — i nomi veri sono `core, vetrina, campo, conti, flotta, scudo,
   sentinella, terra, genesi, id · non autorizzato, genesi · accesso,
   id · accesso, id · profilo, id · amministrazione` — e vedere quale non
   torna. Sospetto da verificare, non da credere: `apriSuperficie` o `vaiA` su
   una superficie che con la frase iniettata cambia altezza.
2. poi il giro del browser **nuovo** (adesso non può più restare appeso), letto
   con `leggi-giro.mjs`, sezione 1 prima della 2.

## Blocchi
Nessuno.
