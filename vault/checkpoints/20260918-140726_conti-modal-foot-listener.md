# Checkpoint — 2026-09-18T14:07:26Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
7bd103d2 — fix(conti): listener accumulato su #modal-foot nel flusso "Scrivi il verbale"

## Cosa è stato completato
Il quarto item della coda "shared/dw-app-ui.js" (dal deep-pass QA di
inizio blocco, agente a2cd701aa80f1f010): `renderVerbale` ascoltava il
click sul piede della modale con `once:false`, ma qualunque bottone del
piede chiude sempre la modale (una sola risposta serve), quindi ogni
apertura del flusso "Scrivi il verbale" aggiungeva un ascoltatore mai
rimosso. Corretto con `once:true`. Nuovo banco browser con misura
quantitativa (4 ascoltatori attivi prima, 1 dopo).

## Verifica
Giro completo su worktree isolata (`git add -A` fatto PRIMA del giro,
lezione del checkpoint precedente applicata): **41/41, 0 caduti**. KPI
invariato a 3153. 9-suite sum invariato a **3.649**. Asserzioni totali del
giro: **4153**. Banchi del browser: 351→**353** esecuzioni, 155→**156**
file distinti.

## Stato roadmap
La coda "shared/dw-app-ui.js" dal deep-pass QA di inizio blocco è ora
**chiusa tutta**: le tre voci di accessibilità (toast role/aria-live,
CSS di errore Genesi — commit 99b36df0) e questo listener sono tutti
corretti. Resta aperta solo **la trappola del focus nella modale**, che
era stata segnalata nello stesso report ma non ancora affrontata perché
tocca `shared/dw-app-ui.js` — usato da tutte le 8 superfici — e va isolata
con cura.

## Coda di lavoro
1. **La trappola del focus nella modale** (`shared/dw-app-ui.js`):
   `dwUiAggancia()` gestisce `Escape` ma non `Tab`, nessun `inert`/
   `aria-hidden` sul contenuto dietro, nonostante `aria-modal="true"` su
   tutte le 8 pagine. Unità a parte, più rischiosa (file condiviso).
2. **Conti `margineMese`** (agente a0dcbb7a264c32e8d, verificato dal
   vivo): non esclude le fatture scartate dallo SdI dal margine mensile
   per competenza — stessa guardia `statoSdi(f, oggi).nonEmessa` già
   propagata a sei altre funzioni, mai a questa. Correzione: aggiungere
   `oggi = new Date()` alla firma e il filtro `!statoSdi(f, oggi).nonEmessa`
   alla riga 4737 di conti-data.js.
3. **Genesi Decking** (agente ae164109bbdd90b50, verificato dal vivo):
   `renderScheda2D` (genesi.html:7327/7334) usa `D2.stem` grezzo invece
   del valore guardato (`(+D2.stem>0)?+D2.stem:null`) che `computeKPI`
   già applica allo stesso campo — un borraggio illeggibile viene trattato
   come zero, disegnando un piano di carico diverso senza dire "non
   calcolabile".
4. Nuovi agenti di deep-pass QA da lanciare per mantenere ≥3 cantieri
   (gli ultimi tre — Conti, Genesi, e i due precedenti Terra/Flotta — sono
   tutti tornati e stanno per essere chiusi o sono già chiusi).

## Prossimo passo atomico
Implementare Conti/margineMese (worktree propria, git add -A prima del
giro, fix con test dedicato — è una funzione pura, non serve un banco
browser). Poi Genesi/Decking (richiede un banco browser sul modello di
quelli già scritti oggi, dato che Genesi non ha moduli node testabili per
questa parte). Poi la trappola del focus. Continuare "mai fermarsi".

## Blocchi
Nessuno.
