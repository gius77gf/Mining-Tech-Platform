# Il grafico disegnato alla misura di fuori

*Misurato il 07/08/2026. Il «prima» su una `git worktree` congelata al commit
`6a975bf`; il «dopo» sull'albero di lavoro con la correzione applicata.*
*(prima stesura il 07/08 contro `eb05653`: il difetto era identico — riprodotto
oggi, riga per riga — ma il conto dell'ampiezza no: vedi «La misura rifatta a
tappeto»)*

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

## La misura rifatta a tappeto, e il conto che va corretto

⚠️ Il 06/08 questa coda era stata registrata come «**ogni** grafico di **ogni**
app dipinge a 368 su 398», e il 07/08 era stata **ristretta** a «uno su tre, e
dipende dall'ospite»:

| superficie | viewBox | pixel veri | rapporto |
|---|---|---|---|
| **Terra** | 398 | 368 | **×0,925** |
| Flotta | 304 | 304 | ×1 |
| Sentinella *(sparkline)* | 138 | 138 | ×1 |

⛔ **Anche quella riga era sbagliata, e nel verso opposto.** Erano tre grafici,
tutti nelle schermate d'**apertura** — cioè il campione più piccolo e meno
rappresentativo che ci fosse, perché nelle dashboard i grafici stanno dentro
riquadri diversi da quelli delle sezioni. Rimisurando **tutte le sezioni di
tutte le superfici** (41 schermate per viewport, 38 grafici, due viewport):

| app | grafici | fuori scala |
|---|---|---|
| campo | 2 | **2** |
| conti | 11 | **6** |
| flotta | 8 | **7** |
| scudo | 6 | **4** |
| sentinella | 6 | 0 |
| terra | 5 | **5** |
| **totale** | **38** | **24** |

**24 grafici su 38, in cinque app su sei.** Non «uno su tre»: **due su tre**.
E Flotta, che la riga vecchia dichiarava sana, ne aveva **sette su otto** —
l'unico pulito era proprio quello della dashboard, cioè l'unico che era stato
guardato.

I quattordici già in scala non lo erano per virtù: sono le figure **`nudo`**,
quelle senza padding — le cinque esposizioni di Conti, i due indici di Scudo, i
cinque grafici di Sentinella e la sparkline (che si costruisce il `viewBox` da
sé e non passa da `_larg`). Dove la figura ha il padding, il difetto c'è; dove
non ce l'ha, non c'è. Non dipendeva dall'app: dipendeva dalla figura.

⛔ È la lezione già scritta in CLAUDE.md applicata due volte a noi stessi: la
prima riga si era **allargata** a mente («tutti»), la seconda si era
**ristretta** a un campione di tre. In mezzo la misura vera non l'aveva fatta
nessuno, e il numero scritto mandava a lavorare su una app sola.

### La coordinata che rendeva ambigua la misura

A **430 px** di viewport l'ospite delle app è largo **398**, e il ripiego di
`larghezzaUtile` per un contenitore che non si può misurare è
`min(720, innerWidth − 32)`, cioè **398 anche lui**. I due numeri collidono: un
`viewBox` da 398 non dice se il motore avesse misurato l'ospite o tirato a
indovinare, e per un'ora la misura non ha distinto i due casi.
Si separano a **1200 px**, dove il ripiego varrebbe 720 e l'ospite ne vale 852.
Misurato: `viewBox` **852**, pixel **822**, rapporto **×0,965** — cioè il
motore misurava davvero l'ospite. È il «rapporto fra due valori diversi»
applicato al **righello** invece che al soggetto, ed è per questo che il banco
gira a due viewport.

## La correzione

Non due sostituzioni, ma **una regola in un posto solo**. «Quale scatola è il
righello» era una decisione presa in **due** punti (`monta()` e il
`ResizeObserver`): scritta due volte, diverge alla prima modifica — è la regola
del 06/08 sulle firme troppo strette.

```
Grafico.prototype.largoDisegno = function () {
  return larghezzaUtile(this.wrap || this.el);
};
...
this._larg = this.largoDisegno();     // in monta()
var w      = self.largoDisegno();     // nel ResizeObserver
```

Chiedere al browser la larghezza del riquadro è più robusto che sottrarre il
padding a mano: se domani il foglio cambia il padding, la misura si aggiorna da
sé. Ed è la regola già scritta — *calcolare una cosa che il browser sa dire* è
il difetto comune ai quattro strumenti di misura riscritti il 01/08.

Esito, misurato sulla stessa passata a tappeto: **38 grafici su 38 a ×1,000**,
in tutt'e sei le app — **76 misure** contando le due viewport, 82 schermate
raggiunte navigando, zero fuori scala. A 1200 px l'ospite resta 852 e il
`viewBox` scende a **822**, cioè alla larghezza vera del riquadro.

⚠️ **Che cosa protegge davvero `|| this.el`**, detto con precisione perché non
lo si scambi per quello che non è: protegge il caso in cui il metodo venga
chiamato **prima** che `monta()` abbia costruito il riquadro. **Non** protegge
il caso «riquadro non misurabile» — vedi la coda qui sotto.

## Che cosa resta aperto

1. ✅ **La misura a tappeto**: fatta, ed è quella qui sopra. Il banco che la
   tiene chiusa è `apps/deepwork-id/tests/browser/graf-scala.mjs`, registrato in
   `tutti.mjs` e descritto nel `LEGGIMI.md` della cartella. Le superfici e le
   sezioni sono **derivate dal disco** (le app che caricano `dw-grafici.js`, i
   loro `id="nav-…"`), così un'app nuova entra da sola.
2. **Il giro completo dopo il commit**, perché il motore lo carica ogni pagina:
   è la modifica con il raggio più largo fatta in questo blocco.
3. ⏱️ **`.dwg-plot` a larghezza zero** (grafico montato dentro una sezione non
   ancora aperta): **resta aperta**, e il ripiego sull'ospite che era stato
   progettato **non la chiude**. Provato su quattro scene — visibile, sezione
   `display:none`, ospite nascosto, contenitore largo zero: `wrap` ed `el`
   rispondono **sempre insieme**, e quando rispondono zero scatta comunque
   `min(720, innerWidth − 32)`, che è un numero plausibile e sbagliato. La
   scatola non c'entra: in quel caso **nessuna delle due** sa la misura.
   Quello che è garantito, e che il banco verifica per costruzione (le sezioni
   si raggiungono **navigando**, non ricaricando), è che appena la sezione si
   apre il `ResizeObserver` riporti il grafico in scala.
4. ⚠️ **Il pavimento di 240 unità** resta e non è un difetto: sotto quella
   larghezza `larghezzaUtile` tiene il `viewBox` fermo **apposta**, perché i
   testi alla misura vera sarebbero illeggibili (misurato: ospite 180 →
   riquadro 150 → `viewBox` 240, ×0,625). Nelle sei app non lo tocca nessun
   grafico, a nessuna delle due viewport; il banco lo **stampa e lo conta**
   invece di saltarlo in silenzio.
