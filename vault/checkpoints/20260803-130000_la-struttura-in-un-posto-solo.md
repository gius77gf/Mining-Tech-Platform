# Checkpoint — la struttura del core in un posto solo

**Commit:** `c46e282` (la misura), `3f60a50` (il modulo + Scudo), `486011d`
(le altre cinque)
**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`

## Che cosa è stato trovato

La direttiva del fondatore dice che le app copiano l'impianto del core
«pelo per pelo, senza cambiare una virgola». Misurato: quella copia
esisteva **sei volte**.

Ogni app aveva un blocco `<script>` classico (89–141 righe) con dentro la
navigazione, il **toast**, la **modale** che sostituisce `alert()` e
`confirm()`, la conferma, la richiesta di un valore, la chiusura con
Escape o toccando fuori, i riquadri raggiungibili da tastiera e l'**alone
che segue il mouse**. **Il 76% delle righe era identico** — non simile:
identico, carattere per carattere. In tutto **27 copie** di cinque
funzioni.

**E una si era già staccata.** `apriModale` in Scudo aveva un quarto
parametro che le altre cinque non avevano. La ragione, scritta lì
accanto, **era buona**: la segnalazione del near-miss si compila a tocchi,
e far salire la tastiera del telefono davanti ai pulsanti è un dispetto.

Questo è il punto, e vale la pena tenerlo: **non è successo per
sciatteria, è successo perché serviva.** Un'app ha avuto bisogno di una
cosa in più, l'ha aggiunta nella sua copia, e le altre cinque non l'hanno
saputo.

## Che cosa è stato fatto

`shared/dw-app-ui.js`, script classico come `dw-tema.js` e `dw-grafici.js`
già facevano. Dentro c'è il **soprainsieme**: `apriModale` accetta il
quarto parametro, che è facoltativo — chi non lo passa ha il comportamento
di sempre, ma **adesso ce l'hanno tutte** invece di una sola.

Il **selettore dell'alone resta di ogni app**, perché quello *deve* poter
cambiare: `.segnala` esiste solo in Scudo, `.peggio` solo in Sentinella.

**28.865 caratteri** di codice duplicato tolti dalle sei pagine.

## L'errore che ho fatto, e come si è visto

La prima passata sulle cinque app ha infilato la chiamata `dwUiAggancia`
**dentro un import multilinea**, e tutte e cinque hanno smesso di
funzionare con «Unexpected token `(`».

L'ha trovato il banco in mezzo secondo, e **per il motivo giusto**: prova
la modale invece di guardare se la pagina si apre. Il risultato diceva
`funzioni:true, toast:true, modale:true` ma **`chiusa:false`** — cioè
Escape non chiudeva più niente, perché il blocco che lo aggancia non era
mai partito.

Un banco che avesse guardato solo il caricamento avrebbe risposto «tutto a
posto» su cinque pagine rotte. È la stessa lezione di `CLAUDE.md` sui
controlli che non guardano dove credono, colta dal vivo.

## E un'altra, sul metodo

La **prima misura** di questa duplicazione era sbagliata: cercavo il CSS
del toast e della modale in `dw-app-shell.css` e `deepwork-style.css` e
non lo trovavo, e stavo per scrivere che mancava tutto. Il CSS c'è, in
`shared/dw-app-ui.css` — il terzo foglio, che non avevo guardato. **Il
codice non era sbagliato: era il controllo a guardare nel posto
sbagliato.** L'ho scritto nel documento, perché è il tipo di errore che
fa scrivere un allarme falso.

## Verifica

- **13 prove** su Scudo (toast che compare e scrive, modale che si apre
  con i pulsanti, Escape, il fuoco nel campo, e il caso `autofocus:false`
  che era la ragione della divergenza) — tutte passate;
- **5 app** provate allo stesso modo — tutte a posto, zero errori di
  codice;
- **screenshot guardati**: le palette sono al loro posto (Flotta magenta,
  Terra verde, Conti teal, Campo arancio, Sentinella blu, Scudo viola);
- suite `node`: KPI **971**, Stile **212**, Helper 43, Demo 7, nomi doppi
  **0 da sistemare**.

## In corso

Il **giro a 19 banchi** del browser, rilanciato perché tutte e sei le
pagine sono cambiate. Finché gira: si lavora su `docs/`, `vault/` e le
suite `node`, e niente modifiche a moduli e pagine.

## Prossimo passo atomico

Quando il giro finisce: **la seconda metà della struttura**. Nel blocco
classico di ogni app resta la funzione `go(id)` della navigazione, e va
guardata con la stessa domanda — è identica in tutte e sei, o si è già
staccata anche lei?

Poi, sempre in attesa del fondatore: **Il Quadro** (punto 15).

## Nessun blocco

Restano aperte le decisioni del fondatore in `DECISIONI_WEEKEND.md`
(punti 5a/5b, 10, 11, 12, 13, 14, 15).
