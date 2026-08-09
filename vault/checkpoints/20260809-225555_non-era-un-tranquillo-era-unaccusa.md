# Checkpoint — 2026-08-09T22:55:55Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`aec46eb`

## Task completato

**La geometria assente non inventa più una spalla di 3 metri — e questo difetto,
unico fra i cinque di oggi, NON rassicurava: accusava.**

| | |
|---|---|
| il riferimento inventato stava sopra i burden veri di | **15 volte** |
| la scheda del foro diceva | «energia molto concentrata (**1.509%** del progetto)» |
| fori accusati di sovraccarica | **12** |
| mappa dell'energia, pixel nella classe più alta | **1963** contro 0 col livello spento |

## Le tre cose imparate

1. ⛔ **UN DATO INVENTATO NON SBAGLIA SEMPRE NELLA DIREZIONE CHE RASSICURA.**
   Tutti i difetti di oggi tranquillizzavano; questo **accusava**, e a voce
   alta. Una spalla di 3 m dove la maglia vera ne ha 0,3 produce un riferimento
   quindici volte troppo alto, e da lì dodici fori dichiarati sovraccarichi.
   ⚠️ Il principio del fondatore va letto per intero: **l'assenza non è un dato**
   — né favorevole né sfavorevole. Cercare solo i «numeri tranquilli» lascia
   fuori metà della famiglia.
2. ⛔ **E IL VERDE ARRIVA DOPO, NON PRIMA.** Togliendo l'invenzione **a metà**,
   `h.pfLoc/null` fa `Infinity` e `pfCls` di ciò che non è finito risponde
   `'ok'`: pallino **verde**, «in linea col progetto». Cioè si passava
   dall'accusa falsa alla **rassicurazione falsa**. Servivano due guardie, non
   una: togliere il ripiego **e** insegnare al lettore.
3. ⛔ **LA CONTROPROVA HA BOCCIATO LA PROVA, non il codice.** La bozza ovvia
   (togliere i ripieghi e basta) **passa tutti e dodici i casi veri**, ma solo
   perché `null*3.5` fa 0; e rimettendola dentro `volumeForo` le 2033 restavano
   **verdi** — l'argomento sull'epsilon dimostrava un principio senza
   interrogare la funzione. Il caso che le divide esiste ed è esatto:
   **due segni meno si annullano**, `(-3)×(-3,5)×10 = 105`, cioè *precisamente*
   il volume della maglia sana. Adesso è una riga rossa.

## Il difetto rifatto dentro la correzione, e preso
⚠️ I sei campi **interi** leggevano `+$('x').value`, e **`+''` fa 0** — finito,
quindi `valoreCampo` l'avrebbe stretto al minimo. Il difetto di ieri, rifatto
mentre lo si correggeva. Ora passano da `gvv`.

## Trovato strada facendo, e corretto
- **`deriveCharge` finiva con `Math.max(2, …)`** — la stessa porta laterale di
  ieri. Misurato: diametro assente → **2 kg/foro** scritti nel campo; **borraggio
  assente → 73 kg/foro, un quarto di esplosivo IN PIÙ del vero (58)**, nel verso
  che non spaventa nessuno.
- «contro un burden di progetto di 3,00 m» stava **nella frase dell'avviso E
  nella soglia** che decide se l'avviso compare.

## Verifiche
- `giro-node` **34 comandi a posto, 0 caduti** sulla copia del committato;
  asserzioni **2800 → 2807**
- `run-kpi` **2033/0**, uguale con `TZ=Europe/Rome` · `run-stile` **318/0** ·
  `sintassi-pagine` 34/0 · `copertura` 0 scoperte (fondo `genesi-data` 57 → 58)
  · `iniezioni-fresche` **309/309** · `genesi-numeri-tranquilli` 35/0
- **nove** controprove, nove distinguono, ripristino **da copia** con `diff -q`
- i cinque lettori verificati **uno per uno nel browser**, col difetto iniettato
  nella **risposta HTTP** e mai nel file su disco

## Aperto, con la domanda posta bene
**B0-septies**: cinque funzioni di disegno tengono ancora `D2.S||3.5`,
`D2.B||3`, `D2.prof||10` — è da lì che la maglia degenera a 0,3 m.
⚠️ **Non è la stessa cosa dei numeri**: un numero si dichiara «non calcolabile»,
una **pianta** no — o disegna, o non disegna. La domanda è di prodotto: *che cosa
vede chi apre il 2D di una volata a cui manca la maglia?*
Restano fuori anche `psCharge`, i due del **recettore** (che inventano
allarmando e toccano `ppvLimit`) e `D2.ritardo`, che **non ha clamp**: prima si
decide quali sono i suoi limiti.

## Prossimo passo atomico
1. **B0-quinquies** (`#sm-cava` del core: chiedere **perché la scatola è 142 px**,
   non accorciare la parola) e **B3-bis** (il quinto bottone d'uscita di Campo).
2. Rilanciare il giro del browser **quando nessun cantiere tiene Chromium**.

## Blocchi
In attesa del fondatore: **quali** delle 47 mancanze confermate diventino
lavoro; se `disponibilitaTurno` debba restare **100%** su un turno chiuso senza
fermi; le righe dell'Allegato VII da aggiungere a `SCADENZE_PRESET`.
