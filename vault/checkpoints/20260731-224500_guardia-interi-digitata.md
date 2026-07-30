# Checkpoint — la guardia sui campi interi, provata digitando

- **Tipo**: chiusura di un punto dichiarato aperto + estrazione in `shared/`
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: (vedi sotto, aggiunto dopo il commit)

## Cosa era rimasto aperto

La guardia sui campi interi (`montaGuardiaInteri`) era verificata **solo per
montaggio**: la regola 5 di `run-stile.mjs` controlla che ogni superficie con
campi interi la monti. Ma «il pezzo c'è» non è «il pezzo funziona su quel
campo». Nessuno aveva mai digitato in quei campi.

## Cosa è stato fatto

1. **Digitati davvero tutti e 10 i campi interi di Genesi**, navigando come
   naviga una persona: `#bottomnav` per le schermate, le **cinque sezioni a
   fisarmonica** del 2D aperte cliccandone l'intestazione, il pannello
   parametri del 3D. Su ognuno: la virgola viene detta, «1.500» diventa 1500,
   «42» si scrive senza intralci. **33 asserzioni, 0 fallite.**
2. **Controprova**: la stessa pagina servita con la riga della guardia
   sostituita da un commento. **20 asserzioni su 33 cadono** — esattamente le
   due per campo che dipendono dalla guardia. La prova sa fallire.
3. **La decisione estratta in `shared/`**: `decisioneIntero(dato, valore)`,
   funzione pura, e `montaGuardiaInteri` la usa. Prima la logica viveva dentro
   l'ascoltatore dell'evento, e l'unico modo di provarla era aprire un browser
   — cioè, in pratica, non provarla mai.
4. **Sette prove nuove in `run-kpi.mjs`** (318 → **325**, totale salito).
   Controprova anche qui: neutralizzando `decisioneIntero` cadono 4 test.

## Due cose misurate, non dedotte

- **Gli spazi delle migliaia li toglie già il browser.** Una mia prova
  pretendeva che li togliesse la guardia: misurato battendo e incollando
  davvero, «1 500 000» in un `type="number"` diventa 1500000 ed è valido.
  L'asserzione è stata **girata** (la guardia NON deve intervenire) con la
  misura scritta accanto, perché la prossima volta non venga «aggiustata».
  È la ventunesima volta che una mia prova accusa il codice a torto.
- **Sulla schermata 3D il container scende a ~4 fotogrammi al secondo**
  (misurato: 4 `requestAnimationFrame` in un secondo, senza GPU). I controlli
  di raggiungibilità di Playwright aspettano un fotogramma per volta, quindi
  con timeout da 1,5 s i due campi del pannello parametri risultavano «non
  cliccabili» pur essendo visibili, non coperti e fermi. Era la prova a essere
  impaziente, non l'app a essere rotta.

## Stato delle suite

| suite | esito |
|---|---|
| `run-kpi.mjs` | 325 passati, 0 falliti |
| `run-stile.mjs` | 84, 0 |
| `run-helpers.mjs` | 43, 0 |
| `run-demo.mjs` | 7, 0 |
| `run-manifest.mjs` | 9, 0 |
| `run-pointcloud.mjs` | 23, 0 |

## Prossimo passo atomico

Le stesse tre domande poste a Genesi vanno poste alle **altre sei superfici**
che montano la guardia (Campo, Flotta, Scudo, Conti, Sentinella, Terra): il
banco `genesi-interi.mjs` è già parametrico nella pagina, va generalizzato a un
elenco di superfici e fatto girare su tutte, con la stessa controprova. Se
qualche campo non è raggiungibile navigando, quello è di per sé un difetto da
guardare.

## Bloccanti

- Nessuno su questa unità.
- Resta gated su decisione del fondatore: Genesi punti pesanti #4/#5/#6.
- Resta **senza risposta** la domanda del fondatore «ti ho chiesto una cosa
  prima»: in questa sessione non risulta una richiesta specifica precedente.
