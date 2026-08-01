# Scudo, la convenzione in `shared/`, e il banco che la tiene ferma

**Data:** 01/08/2026 · **Area:** `apps/scudo/index.html`, `shared/dw-app-ui.css`,
`apps/deepwork-id/tests/browser/promesse-tocco.mjs`, `…/tutti.mjs`
**Unità precedente:** `20260801-165000_flotta-e-terra-cinque-righe-che-promettevano.md`
(commit `f8b17da`)

## Che cosa è stato fatto

Tre cose che stanno insieme, e separate non servono:

1. **La convenzione, una sola, in `shared/dw-app-ui.css`**: `.item.tocca`.
   Il verso è «parti ferma e marca le vive», e la ragione **si misura**:
   dimenticare di marcare una riga **viva** si vede subito — non si accende —
   mentre dimenticare di marcarne una **ferma** non si vede. È il difetto che
   oggi si è presentato **cinque volte**.
2. **Scudo** portata su quella convenzione: regola locale girata a
   `cursor:default`, `tocca` sulle **nove** emissioni vive. **91 → 0**.
3. **Un banco**: `promesse-tocco.mjs`, su tutte le superfici, con la
   controprova, dentro `tutti.mjs`.

## Scudo aveva tre modi diversi dentro la stessa app

Le nove righe vive erano marcate così: tre con `onclick="go(…)"`, cinque con
`style="cursor:pointer"` scritto a mano accanto al `data-…`, una con il solo
`data-evt` e nessun cursore. Cioè non è che Scudo avesse *un'altra*
convenzione: **non ne aveva nessuna**, e le 91 righe ferme prendevano la manina
dal `cursor:pointer` generale.

Gli `style="cursor:pointer"` scritti a mano sono stati tolti: adesso lo dice la
classe, in un posto solo.

## Il banco, e le due cose che lo rendono affidabile

**Non guarda le classi.** Le sei app ne usano cinque diverse: un controllo sulle
classi misurerebbe la **convenzione**, non la **promessa**. Qui si mette il
**cursore calcolato** contro l'**aggancio vero**, e va bene qualunque strada
un'app scelga per arrivarci.

**Stampa quante voci ha guardato.** Un banco che non trovasse nessuna `.item` —
un selettore cambiato, una pagina che non si apre — direbbe «zero guai» dopo
aver misurato niente.

E «aggancio» ha **tre** forme, la terza imparata a spese di una conclusione
sbagliata: `onclick`, un `data-…` con una delega, oppure essere una `<label>`
con dentro un controllo — cliccabile per natura. Senza la terza, Conti
risultava con otto righe bugiarde che bugiarde non erano.

## ⛔ E il banco, alla prima passata, ha trovato due cose diverse

Su `id · profilo`, tre righe accusate. Guardando il sorgente, **una sola era un
difetto vero**:

1. **difetto del prodotto** — le due righe di esempio delle organizzazioni, in
   modalità mockup, mostravano la manina e non facevano niente. Una delle due
   dice pure «Tocca per attivare». Stesso difetto delle sei app, sulla pagina
   che nessun banco aveva mai aperto. Corretto in `dw-app-shell.css`, che è il
   foglio di quella pagina: `.item` parte **ferma**, e le righe vive la manina
   ce l'hanno per conto loro (quelle costruite da JavaScript portano
   `cursor:pointer` in riga);
2. **difetto del banco** — la voce «Amministrazione» è un **`<a href>`**, cioè
   cliccabile per natura: una **quarta** forma di «viva» che il banco non
   conosceva. Aggiunta, insieme a `a.item{cursor:pointer}` nel foglio.

Due forme su quattro le ho scoperte sbagliando (la `<label>` e l'`<a>`), e il
segno è sempre stato lo stesso: **una riga accusata che, guardando il sorgente,
è sana**. Vale la pena scriverlo perché è il criterio che ha funzionato tre
volte oggi.

## Verifica

Il banco su tutte le superfici: **436 voci misurate su 14 superfici · 0 promesse
fuori posto**.
Scudo **118 voci · 0 promettono e non mantengono · 0 fanno e non lo dicono**,
alta 2060 px come prima, `.top` 61, `.item` 111, `.kpi` 86.
`run-stile` 274/0, `numeri-nei-documenti` 17/0 dopo aver portato a **41** il
numero dei banchi nei due documenti che lo citano (erano 39: il banco nuovo e
la sua controprova).

## Prossimo passo atomico

Leggere l'esito del giro completo (`tutti.mjs`) — che a metà strada dice **285
prove passate, 0 fallite** — e poi la migrazione che resta, dichiarata in
`docs/LA_MANINA_CHE_PROMETTE.md`: Conti e Sentinella usano ancora `tap` e
`cliccabile` (stesso verso, nome diverso), Campo, Flotta e Terra partono dal
verso opposto. Nessuna delle due cose è urgente adesso, perché il banco protegge
comunque, qualunque convenzione usino: è pulizia, non sicurezza.
