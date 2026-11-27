# Checkpoint — Genesi: sul telefono una passata o un pizzico non creano e non spostano più fori

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit
Quello che contiene questo file («fix(genesi): i tocchi sulla pianta…»).
Il precedente, `4d02ca68` (il dito nelle finestre e nella scena 3D), è
confermato dal giro `node` (47 comandi, 4531 asserzioni) e dal giro completo
dei 55 banchi di Genesi su una copia del committato: 55 su 55 a uscita 0.

## Misurato prima di toccare (tocchi veri a più dita, 320 e 430 px)
- Una passata verticale partita dal vuoto della pianta creava un foro.
- Un pizzico sul vuoto ne creava due.
- Un pizzico partito su due fori ne spostava uno di 14 metri.
- `pointercancel` non era ascoltato.

## Che cosa è stato fatto
- `apps/genesi/genesi.html`: sopra `d2Down`/`d2Move`/`d2Up` (invariati) la
  disciplina dei tocchi — `d2PuntGiu`, `d2PuntMuove`, `d2PuntSu`,
  `d2SulVuoto`, `d2AnnullaGesto`: un puntatore conduce; il secondo dito
  annulla il gesto del primo; col dito ciò che crea sul vuoto nasce quando
  il dito si alza senza essersi mosso. Col mouse e la penna resta com'era.
- `apps/genesi/genesi-data.js`: `eUnTocco` (10 px).
- `run-kpi` 3266 → 3267 (una prova nuova; due vecchie asserzioni aggiornate:
  le due prese ora si chiedono da due punti, con lo stesso raggio).
- `genesi-pianta-schermo.mjs`: sezione «i gesti» coi tocchi veri via CDP
  (117 → 129 controlli); nella controprova dei dettagli il settimo difetto,
  da solo, fa cadere il suo controllo (7 su 7).
- `docs/DECISIONI_WEEKEND.md`: **decisione 37** — sul telefono, per spostare
  un foro basta trascinarlo o prima va scelto? Misurato: una passata che
  parte entro 12-16 px da un foro lo trascina di 5,7 m. NON toccato.

## Verifiche (lette dai registri)
- Giro `node` sullo stato in indice: 47 comandi a posto, 0 caduti, 4532.
- Sull'albero vero: `genesi-pianta-schermo` 129/129, le sue due controprove
  riuscite; i 16 banchi che toccano la pianta col mouse tutti a uscita 0
  (foro-per-foro 214/214, colonna-progetto 71/71, maglia-assente 40/40,
  campi-assenti 64/64, snap, guida, annulla, tratti, strati, selezione…).
- ⚠️ NON rigirati su questo stato: gli altri 38 banchi di Genesi (non
  toccano la pianta). Il giro completo sul committato parte dopo il push.

## Numeri dichiarati nei documenti
3.769 prove senza rete (3267 + 330 + 83 + 40 + 9 + 8 + 7 + 3 + 22) · giro
4532 su 47 comandi · condivisi 389 su 389 · `genesi-data.js` 215/215 · pagina
158 funzioni (57 estraibili; tabella 25/48/18/20/47) · 469 esecuzioni nel
browser da 215 file.

## Prossimo passo atomico
**L'ingrandimento della pianta** (voce aperta «la pianta non ha
l'ingrandimento»). In scratchpad sono già provate (18 prove, tutte verdi) le
quattro funzioni pure: `vistaLimitata`, `vistaApplica`, `vistaZoomAttorno`,
`gestoDueDita` — file `scratchpad/vista/vista.mjs` e `prova.mjs` (se lo
scratchpad è sparito: il progetto è descritto qui sotto, si riscrivono).
1. Modulo: le quattro funzioni + `VISTA_ZOOM_MAX = 6`, con le prove in
   `run-kpi` (identità; il punto sotto il dito resta lo stesso metro; limiti;
   andata e ritorno; due dita).
2. Pagina, `drawDesign2D`: `scale/startX/faceY` di base → `vistaApplica` con
   perno al centro dell'area della maglia; ritaglio (clip) del contenuto fra
   le righe in alto e la legenda, con le tre scritte «di cornice» disegnate
   fuori dal ritaglio (quota del foro scelto in alto; freccia, riepilogo e
   isocrone; legenda; punto scelto; suggerimento).
3. Gesti, in `d2PuntMuove` (ramo «due puntatori»): pizzico = ingrandisce
   attorno al punto fra le dita, due dita che si muovono = spostano. Un dito
   sul vuoto, a pianta ingrandita, sposta la vista (oggi quel gesto non fa
   niente). Col mouse: Ctrl+rotella ingrandisce.
4. Tre bottoni sempre visibili sotto la tela — «−», «+», «adatta» — perché
   il pizzico da solo non basta (alternativa a un puntatore solo).
5. La vista NON si salva col progetto e torna «adatta» quando si apre una
   volata.
6. Banco: pizzico via CDP (`Input.dispatchTouchEvent`), il punto fra le dita
   resta sotto le dita; i testi di cornice non si muovono; a pianta
   ingrandita un tocco sceglie ancora il foro giusto.

## Blocchi (del fondatore)
Decisioni 28, 33 (⚠ quale foro usa la gittata), 34 (lettore LAZ), 35 (spalla
al piede), 36 (accenti nei CSV: prima la prova con Excel), **37 (sul
telefono: trascinare un foro subito o dopo averlo scelto)**; 32 rimandata.
