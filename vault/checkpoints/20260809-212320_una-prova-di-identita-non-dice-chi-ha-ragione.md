# Checkpoint — 2026-08-09T21:23:20Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`bb721be`

## Task completato

**La frammentazione che non si può calcolare adesso lo dice — ed è il terzo e
ultimo dei tre numeri tranquilli di Genesi.**

| | |
|---|---|
| la formula di Kuz-Ram era scritta | **quattro volte**, una già divergente |
| la divisione `kg/vol` | **sette volte** |
| `run-kpi` | 2005 → **2017** |
| difesa spegnibile in due clic, trovata e non chiusa | **1** (B0-quater) |

## Le tre cose imparate

1. ⛔ **UNA PROVA D'IDENTITÀ NON DICE CHI HA RAGIONE.** Il cantiere si aspettava
   che l'iniezione sul `null` facesse cadere anche la prova «`consumoSpecifico`
   è UNA funzione sola». **Non cade**: quella prova pretende l'**identità** fra
   `fragKuzRam(...).pf` e `consumoSpecifico(...)`, e iniettando il difetto nella
   funzione che l'altra **chiama**, le due si muovono **insieme**. Cioè
   dimostra che non possono divergere, **non** che una delle due sia giusta.
   ⚠️ È la seconda lettura di «non distingue» — *la prova non prova niente* —
   in una veste nuova: non i dati che fanno coincidere le due risposte, ma la
   **struttura** che le lega.
2. ⛔ **CERCANDO UN NUMERO TRANQUILLO SI TROVA UNA DIVERGENZA VECCHIA.** La
   formula di Kuz-Ram era scritta **quattro volte** (`buildSim`, `computeKPI`,
   `measureGeom2D`, più il calcolo inverso che la ribalta), e **una era già
   divergita**: l'esponente `0.633` dove le altre scrivono `19/30`. Nessuno
   l'aveva vista, perché su dati buoni le quattro copie danno numeri simili.
   È «la copia debole»: funziona finché i dati sono sani.
3. ⛔ **UN CLAMP NON È UNA GUARDIA, E LE DUE METÀ VANNO PROVATE SEPARATE.**
   `Math.max(0.05, pf)` e `Math.max(1, kg)` **restano identici** — servono per
   dati **veri ed estremi** — ma stanno **dopo** la guardia. Due prove tengono
   le due metà: la carica illeggibile deve dare `null` **nei due versi** (non 0
   e non 97), e sui dati veri ed estremi i clamp devono **mordere ancora**
   (pf = 5·10⁻⁷, kg = 0,4). Togliendoli «già che ci siamo», la seconda cade.
   ⚠️ E uno zero **misurato** resta zero: `kg = 0` dà `pf` 0 e un x50 vero,
   grosso.

## Le bozze bocciate in scratchpad, che sono il pezzo che vale
- **una funzione sola con `n` obbligatorio**: avrebbe risposto «non calcolabile»
  alla scheda validatori per un dato **che non le serve** (usa Swebrec al posto
  di `n`) — la famiglia del ponte che dà la colpa a chi compila;
- **spegnere `pf` insieme a `x50`**: sono due domande, e quanti chili per metro
  cubo resta vero anche se il fattore roccia non si legge;
- **`xc` a `null` propagato nel 3D**: fa `NaN` e i massi **spariscono dalla
  scena** — lì serve un ripiego **visivo dichiarato**, non un numero.

## Verifiche
- `giro-node` **34 comandi a posto, 0 caduti** sulla copia del committato;
  asserzioni del giro **2779 → 2791**
- `run-kpi` **2017/0** · `run-stile` **318/0** · `sintassi-pagine` 34/0 ·
  `copertura` 0 scoperte, `genesi-data` **54/54** (fondo 49 → 54) ·
  `iniezioni-fresche` **309/309**
- sei iniezioni, ognuna col conto dei soggetti toccati e ripristino **da copia**
- caso sano **identico byte per byte**

## ⛔ Aperto, e più grave di quello appena chiuso
**B0-quater**: in `applyDesign`,
`D2.kg = Math.max(5, Math.min(200, gvv('dKg')||D2.kg))` **fabbrica 5 kg/foro**
da un valore assente (`Math.min(200,null)` = 0, poi il clamp inferiore).
La via è di **due clic e non passa dalla carica**: aperta la volata il campo
mostra «0», poi basta toccare **un campo qualunque** perché `applyDesign` fissi
5 — consumo specifico **0,05 kg/m³**, X50 **127 cm**, senza un toast.
⚠️ Cioè le tre difese costruite oggi **si spengono in due clic**: una difesa
così è una difesa che non c'è. **Cantiere aperto adesso.**

## Prossimo passo atomico
1. Raccogliere il cantiere B0-quater, **rimisurare**, committare io.
2. Restano i due tagli veri (`#sm-cava` del core, `#ppv-scelta` di Sentinella):
   da `7717de1` `modali-dentro` è **rossa lì di proposito**.
3. **B3-bis** (il quinto bottone d'uscita di Campo, unico su 39 che nessun banco
   preme) e **B0-bis** (le famiglie A/B/C di iniezioni fuori da
   `iniezioni-fresche`).
4. Il giro del browser è morto col rifacimento del contenitore: va rilanciato
   **quando non ci sono cantieri col browser aperti** — è la misura di B0.

## Blocchi
In attesa del fondatore: **quali** delle 47 mancanze confermate diventino
lavoro; se `disponibilitaTurno` debba restare **100%** su un turno chiuso senza
fermi; le righe dell'Allegato VII da aggiungere a `SCADENZE_PRESET`.
