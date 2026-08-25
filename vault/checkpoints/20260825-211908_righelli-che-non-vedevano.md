# Checkpoint — 2026-08-25T21:19:08Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6 (PR #342, aperta)

## Ultimo commit
6f6eaf65

## Completato
Tre difetti che i righelli **non potevano** vedere, e le tre domande nuove.

1. **Un collegamento premibile.** `tour-vivo` chiede se l'href risolve;
   `tour-aperto` se l'app si apre. Mancava *si può premere?* — 30 su 30 a
   1440px e a 390px, 0 bersagli stretti. Controprova con un velo trasparente:
   0 su 30, col colpevole nominato.
2. **L'etichetta del centro appoggiava su Sentinella.** Trovata **guardando**
   uno scatto, non misurando. `corona-urti` misurava contro il rettangolo di
   `.centro`, ma `.eti` è `position:absolute` e sta **fuori** da quella
   scatola: il numero diceva zero ed era vero, su un soggetto incompleto.
   Misurata poi: 19px a 360, 13 a 375, 12 a 390, 9 a 430, **zero a 1440**.
3. **Il marchio troppo piccolo per leggersi**, dopo che l'avevo rimpicciolito
   per far stare l'anello. Cercata la misura più grande che ancora sta,
   salendo finché non ha morso: 22vw → 1 urto a 360; **20,5vw → zero** a sei
   larghezze.

## Le regole che ne escono
- ⛔ **Un righello che misura «un elemento» misura la SCATOLA che ha in mano**,
  e un figlio fuori flusso non ci sta dentro. Si prende l'**unione** di tutto
  ciò che l'occhio legge come quel soggetto.
- ⛔ **Un errore di TRASPORTO non è una risposta del sito.** Due volte oggi una
  destinazione su nove è caduta con «connection reset» e ha risposto 200 alle
  prove dopo, con gli stessi byte — prima Genesi, poi Terra: non il soggetto,
  il tragitto. Si riprova **solo** sul trasporto (un 404 è una risposta, e una
  risposta non si richiede sperando che cambi), e **impossibile per
  costruzione** che copra un 404: `curl -sSL` senza `--fail` esce 0.
- ⛔ **Uno scatto propone anche ciò che nessuna misura sta guardando.** Due
  difetti su tre oggi li ha trovati l'occhio. La riga «uno scatto propone, una
  misura decide» resta vera — e non vale come motivo per non guardarli.
- ⚠️ **Quattro volte di fila il difetto era nel righello**: `elementFromPoint`
  fuori dal viewport, `scrollIntoViewIfNeeded` che aspetta l'azionabilità di
  un elemento che ruota, `scroll-behavior:smooth` misurato a mezz'aria, e la
  radice servita che dà il **core** invece della vetrina. Tutte e quattro già
  scritte in CLAUDE.md.

## Stato roadmap
Vetrina online (PR #341 unita, produzione verificata 9 su 9). PR #342 aperta
con questi tre e le tre domande nuove.

## Prossimo passo atomico
Unire la #342 a `main` quando la CI è verde, poi rimisurare la produzione con
`tour-aperto --base https://deepworksic.netlify.app/apps/` per confermare che
l'etichetta e il marchio corretti siano online.
Dopo: il giro del browser non è mai stato lanciato contro `apps/index.html` —
i suoi banchi navigano e premono, e la vetrina non ha sezioni `.page`; o si
dichiarano le sue superfici o restano fuori **dichiarate**, non in silenzio.

## Blocchi
Nessuno.
