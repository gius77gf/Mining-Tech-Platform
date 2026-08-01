# Un nome solo per la riga che si tocca

**Data:** 01/08/2026 · **Area:** `apps/conti/index.html`, `apps/sentinella/index.html`
**Unità precedente:** `20260801-181000_admin-linvito-dice-anche-quando-scade.md`
(commit `a53341f`)

## Che cosa è stato fatto

Conti chiamava `tap` la riga che si tocca, Sentinella la chiamava `cliccabile`:
**la stessa idea con due nomi**, e nessuno dei due era quello dichiarato in
`shared/dw-app-ui.css`. Rinominate a **`tocca`**, e tolte le due regole locali
che adesso arrivano dal foglio condiviso.

| | prima | dopo |
|---|---|---|
| Conti | `.item.tap` in 3 emissioni + 3 regole locali | `tocca`, 0 regole locali sul cursore |
| Sentinella | `.item.cliccabile` in 3 emissioni + 1 regola | `tocca`, 0 regole locali sul cursore |

È la regola di `CLAUDE.md` applicata al piccolo: *una regola che serve a due app
vive in `shared/`, e non si riscrive*. Qui non era riscritta due volte — era
**chiamata** in due modi, che è la forma da cui parte la divergenza.

Le convenzioni per dire «questa riga si tocca» scendono da **cinque a tre**:
`tocca` (conti, sentinella, scudo), la classe `statico` al contrario (flotta),
lo stile in riga al contrario (campo, terra).

## Verifica

Il banco `promesse-tocco` sulle due app: **conti 126 voci · 0 · 0**,
**sentinella 39 voci · 0 · 0** — cioè il rinominare non ha perso nessuna riga
per strada, che è l'unico modo in cui questa unità poteva fare danno.

Geometria identica: Conti 1681 px, `.item` 140, `.kpi` 90; Sentinella 1989 px,
`.item` 125, `.kpi` 86.
`run-stile` 274/0, `run-kpi` 1123/0.

## Prossimo passo atomico

Il **giro completo** su `HEAD` (`tutti.mjs`). Due tentativi sono falliti per
ragioni di ambiente, non di prodotto, e vanno tolte di mezzo prima:
la porta 8823 era ancora occupata dal server del giro precedente, e la copia
girava su un commit che non conteneva le modifiche appena fatte (il giro lo
**dichiara** — «2 file NON committati restano FUORI da quello che il giro sta
provando» — ed è la ragione per cui si committa prima e si lancia dopo).

Poi restano E7 (Genesi, allineamento 2D/HUD al core) e E8 (le sette pagine
affiancate), e la parte di migrazione dichiarata e non fatta: campo, flotta e
terra partono dal verso opposto (riga viva di serie, ferma marcata). Sono a
zero e il banco le protegge, quindi è pulizia, non sicurezza.
