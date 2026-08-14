# Checkpoint — 2026-08-03 01:10:34 UTC

## Tipo
unit-complete (tre unità del ciclo notturno)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`81a8f91` — *Le due righe perse di Conti sono state RITROVATE, non coperte con
un numero*

## Che cosa è stato completato

### 1. La tabella scritta sei volte era già divergente (`a3c567c`)
Rifatta l'unità persa quando il contenitore è tornato indietro. Due difetti,
tutt'e due misurati: gli addendi non facevano il totale (Sentinella `15+4+1+0`
su **22**, Conti `9+5+0+2` su **18**), e le sei copie **erano già divergenti**
— Sentinella riverificato il 02/08, le altre cinque ferme ai numeri vecchi.
Tre controlli in `numeri-nei-documenti.mjs`, controprova su due piani.

### 2. ⛔ Nel core una data illeggibile diventava un OK verde (`b180e53`)
Il censimento guarda i sei moduli dati; **il core no**, ed è l'unica cosa che
il fondatore mostra. Misurato sulla sua riga dei giorni:

| data | l'app diceva |
|---|---|
| `2026-02-30` | contata come giorno vero (−154) |
| `null` | «scaduta da 56 anni» (`new Date(null)` = 1970) |
| `""`, `30/02/2026`, spazzatura | **niente**: `NaN`, e `<0` e `>=0` sono false tutt'e due |

Sei punti corretti: badge **OK verde** su una scadenza illeggibile, «NaNg»
nella scheda, il promemoria che **spariva** da entrambi gli elenchi e dal
pallino rosso, le scadenze mezzi fuori dalle notifiche, e un `sort` che con
`NaN` **non ordinava**. La regola giusta era in `shared/` da mesi: adesso il
core delega invece di tenersene una copia.
Banco nuovo `core-date-illeggibili.mjs` (7 asserzioni, iniezione in memoria).

### 3. Le due righe perse di Conti ritrovate (`81a8f91`)
`8+5+3+2 = 18`. Erano «preventivi e ordini» e «prezzi a scaglioni», marcate
«colmata» in prosa e mai spostate nella colonna delle scadute.
`DA_RIVERIFICARE` torna **vuoto**, e la riga è stata tolta perché il controllo
l'ha preteso. Arretrato: Conti **12 → 0**, totale sui sei documenti 48 → **36**.

## Stato delle prove
run-kpi **1521**, stile 282, helpers 63, pointcloud 32, manifest 9, demo 8 →
**1.915** senza rete; **55** banchi del browser; copertura **602/602**;
61 file di test collegati; 15 pagine che compilano; **863** nomi importati
verificati; giro `node` 20 comandi su 20.

## Prossimo passo atomico
Raccogliere i **tre cantieri in corso** e committare app per app, verificando
**sulla copia di quello che si committa** (`git worktree` + `git diff --cached
| git apply` + **`git -C "$W" add -A`**):
1. **Conti · `valorePesata`** — la premessa di una decisione dichiarata regge
   su una schermata su due (`€ 0,00` nel selettore della fattura differita);
2. **Flotta e Campo** — gli ultimi punti del censimento (`flotta 3 · campo 2`);
3. **Genesi** — le funzioni che escono dalla pagina (erano 174).
⚠️ Due funzioni esportate **senza prova** sono già sul disco e vanno chiuse
prima del commit, se no `copertura-funzioni` cade: `fermiSenzaGiorno`
(`apps/campo/campo-data.js`) e `fermoCollocabile` (`apps/flotta/flotta-data.js`).
Poi: aggiornare i numeri nei tre documenti (si muovono a ogni cantiere) e
spuntare in roadmap.

## Blocchi
Nessuno. Al fondatore restano **19** decisioni, tutte quelle che dipendono da
lui o che procedono venerdì da sole.

## Note
⚠️ Il ciclo precedente si era fermato due volte: il limite della piattaforma e
il **contenitore riportato indietro di due ore**. Da lì la regola applicata
stanotte: committare ogni unità appena è verificata, senza aspettare che il
blocco sia finito.
