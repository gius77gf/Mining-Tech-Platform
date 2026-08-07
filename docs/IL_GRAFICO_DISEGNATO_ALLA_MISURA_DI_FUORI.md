# Il grafico disegnato alla misura di fuori

*Misurato il 07/08/2026, contro il commit `eb05653`.*

## Che cosa succede

`shared/dw-grafici.js` monta un `<figure class="dwg">` dentro l'elemento che
l'app gli indica (l'**ospite**), e poi decide la larghezza del disegno così:

```
this.el.appendChild(fig);
this._larg = larghezzaUtile(this.el);   // ← l'OSPITE, non il riquadro del disegno
```

Ma `.dwg` ha `padding: 13px 14px 14px` (foglio `shared/dw-grafici.css`, riga
104) più il bordo. Quindi il `viewBox` nasce alla misura di **fuori** e l'SVG
viene poi rimpicciolito dal browser per stare **dentro**: ogni testo del grafico
esce più piccolo di come è stato progettato, e nessuna prova se ne accorge —
il disegno è corretto nelle sue proporzioni, sbagliata è la **scala**.

## La misura, e la correzione di quello che avevamo dichiarato

⚠️ Il 06/08 questa coda era stata registrata come «**ogni** grafico di **ogni**
app dipinge a 368 su 398». **Misurando, è falso**: dipende da com'è fatto
l'ospite. Il rapporto vero fra pixel e unità di `viewBox`, letto dal browser con
`getBoundingClientRect()` contro `svg.viewBox.baseVal`:

| superficie | viewBox | pixel veri | rapporto | ospite → riquadro |
|---|---|---|---|---|
| **Terra** | 398 | 368 | **×0,925** | 398 → 368 |
| Flotta | 304 | 304 | ×1 | 304 → 304 |
| Sentinella *(sparkline)* | 138 | 138 | ×1 | 138 → 138 |

Dove l'ospite **è già** il riquadro del disegno il difetto non c'è; dove l'ospite
è il contenitore esterno, si perdono i 30 px del padding e del bordo. Su tre
grafici misurati nelle schermate d'apertura, **uno** è a 92,5%.

⛔ È la lezione già scritta in CLAUDE.md applicata a noi stessi: **un numero
dichiarato a mente si allarga**. «Uno su tre, e dipende dall'ospite» è una cosa
diversa da «tutti», e manda a lavorare in un posto diverso.

## La correzione, provata prima di scriverla nel modulo

Due sostituzioni, e nessuna riga nuova: si misura il **riquadro del disegno**
(`.dwg-plot`, che il motore tiene già in `this.wrap`) invece dell'ospite.

```
this._larg = larghezzaUtile(this.wrap || this.el);      // in monta()
var w      = larghezzaUtile(self.wrap || self.el);      // nel ResizeObserver
```

Chiedere al browser la larghezza del riquadro è più robusto che sottrarre il
padding a mano: se domani il foglio cambia il padding, la misura si aggiorna da
sé. Ed è la regola già scritta — *calcolare una cosa che il browser sa dire* è
il difetto comune ai quattro strumenti di misura riscritti il 01/08.

Provata su una **copia** di `HEAD` servita a parte (mai sul disco vivo: tre
cantieri stavano misurando a schermo, e CLAUDE.md vieta di toccare i file che le
pagine caricano mentre un giro gira):

| | prima | dopo |
|---|---|---|
| Terra | viewBox 398 → 368 px (**×0,925**) | viewBox 368 → 368 px (**×1**) |
| Flotta | ×1 | ×1 (invariata) |
| Sentinella | ×1 | ×1 (invariata) |
| rapporto medio | **0,975** | **1** |

## Che cosa manca prima di committarla

1. **La misura a tappeto**, non su tre grafici: il motore ne disegna molti altri
   nelle sezioni che non sono la schermata d'apertura. Il banco che fa la misura
   è scritto (`graf-scala.mjs`) e va portato in
   `apps/deepwork-id/tests/browser/`, registrato in `tutti.mjs` e descritto nel
   suo `LEGGIMI.md` — **insieme** alla correzione, mai prima: un banco
   registrato che fallisce perché il difetto c'è ancora rende rosso il giro di
   tutti.
2. **Il giro completo dopo il commit**, perché il motore lo carica ogni pagina:
   è la modifica con il raggio più largo fatta in questo blocco.
3. ⚠️ E il controllo che serve dopo: `.dwg-plot` a larghezza **zero** (una
   scheda non ancora aperta) farebbe scattare il ripiego di `larghezzaUtile`
   (`min(720, innerWidth-32)`), che è un numero **plausibile e sbagliato**. Va
   provato il caso «grafico montato dentro una sezione nascosta», che oggi
   nessuna prova tocca.
