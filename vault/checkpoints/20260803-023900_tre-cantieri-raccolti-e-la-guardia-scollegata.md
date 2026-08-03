# Checkpoint — 2026-08-03 02:39:00 UTC

## Tipo
unit-complete (tre unità: Genesi, regola 20, Terra)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`ae26773` — *Terra: il prospetto per l'ente dichiarava zero su un anno che
nessuno ha misurato*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|---|---|
| 9 | Genesi, i cinque difetti dichiarati (`7cb8df7`) | `@SUM(1+1)` usciva **nudo** dal CSV; «+0 kg (+0%)» in `rgb(102,187,106)` su una misura che non esiste |
| 10 | la regola 20 scollegata da Genesi (`2dfd3d8`) | guardava **sei app su sette**, e la copertura dichiarata («tre su sei») era falsa: sono **sette su sette, 18 bandiere** |
| 11 | Terra, i documenti che escono dall'azienda (`ae26773`) | «Totale 2026 · **0**» sul prospetto per l'ente; «fra **0 e 0** m³» sul verbale; «**€ 0**» sui soldi dell'anno |

⛔ **Il filo di queste tre, e vale più delle tre:** una regola che esiste per
prendere le guardie scollegate era **essa stessa scollegata** dall'unica app
con la pagina fuori convenzione (`genesi.html`, non `index.html`). Non è
sfuggita per distrazione: l'elenco delle app era il **terzo** elenco scritto a
mano nello stesso file, e gli altri due (`SUPERFICI`, `MODULI`) avevano già il
loro controllo sul disco. Adesso il terzo è derivato dai primi due, e la prova
nuova pretende che nessun modulo dati sul disco resti fuori.

## Come sono stati raccolti i cantieri
Tre commit, uno per app, ognuno verificato **sulla copia di quello che si
committa** — e la copia ha trovato due cose che il disco non poteva dire:
- `run-kpi.mjs` conteneva i blocchi di **tre** cantieri insieme. L'indice è
  stato costruito da `HEAD` + i soli hunk dell'app che si stava committando
  (filtrati per riga di partenza), mai con `git add`;
- ⚠️ **`git worktree add --detach HEAD` congela il commit di allora**, e un
  `git reset --hard HEAD` dentro la worktree torna a **quello**, non al ramo.
  La copia stava misurando un albero vecchio di tre commit e diceva «1 prova
  fallita» su un test che sul disco era verde. Si ricrea la worktree, non la
  si resetta.

## Stato delle prove
run-kpi **1554**, stile **284**, helpers 63, pointcloud 32, manifest 9, demo 8
→ **1.950** senza rete; **57** banchi del browser; copertura 606/606;
62 file collegati; 15 pagine che compilano; 886 nomi importati verificati;
giro `node` **20 su 20**.
⚠️ I numeri di copertura e banchi **saliranno ancora** quando rientrano i due
cantieri aperti: vanno riletti dalla copia, non da qui.

## Prossimo passo atomico
Raccogliere i **due cantieri ancora aperti**, con la stessa procedura
(indice costruito da `HEAD` per i file contesi, worktree ricreata, non
resettata):
1. **Scudo** — il permesso di lavoro (S8, D.P.R. 177/2011): sul disco ci sono
   già `apps/scudo/scudo-data.js`, `apps/scudo/index.html`, il blocco in
   `run-kpi.mjs` a partire da riga ~17793 e il `FONDO` di
   `copertura-funzioni.mjs` che sale da **130 a 157**;
2. **Campo** — `info` e `chi-riga` che escono dal loro spazio a 320 px (198
   contro 131), su `apps/campo/index.html`.
Poi: rilanciare il giro completo del browser (quello in corso gira su
`868e72e`, ormai tre commit indietro) e aggiornare i tre documenti coi numeri
della copia.

## Code aperte, dichiarate
- ⏳ **Il salvataggio del rapportino del core** scrive `media_prof: 0` e
  `mc: 0` e nulla impedisce di salvarlo senza un solo foro misurato. È una
  **decisione di prodotto** proposta al fondatore (`7050dea`): la mia risposta
  è la seconda (salvare come «non misurato» e sistemare i lettori). Non
  applicata: le decisioni procedono **venerdì 07/08** se non arriva risposta.
- ⏳ **La scorciatoia ES6 dentro un oggetto** (`{ foriReg, misurabile }`) resta
  indistinguibile da una destrutturazione, quindi la regola 20 non la conta
  come dichiarazione. Costo dichiarato e misurato: oggi **nessuna** app è in
  quella forma soltanto.
- ⏳ **Il banco su `#pes-tot`** aspetta ancora di saper aspettare `refresh()`.
- ⏳ Due residui di Terra non corretti perché **non raggiungibili dal form** e
  scritti con la prova: i rilievi scartati in silenzio da `riepilogoAnnuale`
  (resta l'archivio vecchio) e `divarioRecupero` con uno stato sconosciuto.

## Blocchi
Nessuno. Al fondatore restano **19** decisioni.
