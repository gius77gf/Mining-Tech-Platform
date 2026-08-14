# Checkpoint — 2026-08-09T13:19:49Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`3cefc92`

## Task completato

**L'estensione ovvia di `classi-orfane` — guardare anche le classi composte a
pezzi — provata e SCARTATA col numero.** È la reazione naturale al difetto
chiuso un commit fa, ed è sbagliata.

| misura | |
|---|---|
| attributi `class` con interpolazione | **365** |
| coppie base+pezzo esaminate | **396** |
| coppie che nessun foglio della pagina definisce | **43** |
| di quelle, **vere** | **1** |

## La cosa imparata

⛔ **UN ALLARME CHE SBAGLIA 42 VOLTE SU 43 INSEGNA A NON GUARDARLO.** Le altre
42 sono dipinte per vie che una regex sulle **coppie adiacenti** non vede: dalla
classe di stato **da sola** (`.warn{}`, `.danger{}`, `.st-ok{}`) o da un
selettore **discendente** (`.warn .board-ico`, `.danger .n`). Verificato
**aprendo tre** delle segnalate, non dedotto.

⚠️ E la domanda giusta non è statica: è **se l'elemento dipinto differisca
davvero dal suo gemello senza quella classe**, e quella risposta la sa solo il
browser con `getComputedStyle`. Il seguito, se qualcuno lo vorrà, è un banco,
non una regex.

✅ **E la conferma dal verso opposto sul difetto già corretto**: `.warn` **da
sola** non è definita da nessuna parte nel contesto di Conti — né nel foglio
condiviso né nella pagina — quindi quella classe era **davvero** inerte. La
correzione regge anche interrogandola al contrario.

⚠️ **E un errore mio, di mestiere, che vale la regola**: ho scritto il messaggio
del commit come **stringa di shell**, e i backtick attorno a `.warn` sono stati
eseguiti come comandi — la frase è arrivata **senza il suo soggetto**
(«sul difetto già corretto: ␣ da sola non è definita»). Corretto con `--amend
-F file` e `--force-with-lease` sul branch di sessione, quaranta secondi dopo.
⛔ La regola pratica: **un messaggio di commit si scrive attraverso un FILE**,
mai come stringa di shell — questo repository scrive messaggi lunghi, pieni di
nomi di classi e di selettori, cioè esattamente i caratteri che la shell mangia.

## Verifiche
- `classi-orfane` **2/0**, 1184 classi su 14 pagine
- `giro-node` **34 comandi a posto, 0 caduti** sulla copia del committato
- le tre segnalate aperte a mano per capire **come** sono dipinte

## Il giro del browser
Vivo dalle **13:03:34Z** su una copia di `c6694e7` (il primo che stampa da sé
quando è partito). Adesso è su `interi-superfici`.
⚠️ Sono stati fatti tre commit da allora: quando lo leggerò, la **sezione 0**
farà la sottrazione — non la faccio a mente.

## Prossimo passo atomico
1. Leggere il giro quando finisce: `leggi-giro.mjs`, ordine **età → righe «non
   ho guardato» → KO veri**. Là dentro c'è anche la risposta su **`#vf-esito`**
   di Scudo, che il mio righello non è riuscito a misurare da solo
   (`apriVerifica` non è globale, tre tentativi falliti): la macchina di
   `modali-dentro` quella finestra la sa aprire.
2. Nel frattempo: unità che non dipendono dal giro.

## Blocchi
In attesa del fondatore: **`#vf-ente`** (art. 71 c.11) — l'ultima delle sette
tendine; **quali** delle 47 mancanze confermate diventino lavoro; e se
`disponibilitaTurno` debba restare **100%** su un turno chiuso in cui nessuno ha
registrato fermi.
