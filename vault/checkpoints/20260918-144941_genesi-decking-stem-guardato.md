# Checkpoint — 2026-09-18T14:49:41Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
a54f4c4e — fix(genesi): la sezione Decking usava D2.stem grezzo, non il valore guardato

## Cosa è stato completato
Dal deep-pass QA su Genesi (agente ae164109bbdd90b50): `renderScheda2D`
(sezione "Decking") usava `D2.stem` grezzo invece del valore guardato
(`_stemKpi`) che `computeKPI` già applica allo stesso campo. Un borraggio
illeggibile veniva trattato come zero: il diagramma disegnava un piano di
carica senza borraggio di testa, con deck più lunghi del 30%, senza dire
"non calcolabile". Corretto introducendo `_stemDeck` e propagandolo;
nuovo banco browser con controprova, e un'estensione minima del gancio di
debug `window.__genesi` (già esistente, solo-localhost) per esporre
`renderScheda2D` — non c'era modo di richiamarla da un test automatico
senza di quella, dato che il modulo Genesi non espone funzioni pure su
`window`.

## Verifica
Giro completo su worktree isolata (`git add -A` prima del giro): **41/41,
0 caduti**. KPI invariato a 3154. 9-suite sum invariato a **3.650**.
Asserzioni totali del giro: **4155**. Banchi del browser: 353→**355**
esecuzioni, 156→**157** file distinti.

## Stato roadmap
Tutti i difetti verificati dai deep-pass QA di questo blocco sono ora
chiusi: Scudo (calendarioScadenze), Conti (apertoDi ×4, listener
modal-foot, margineMese), Campo (CLASSE_HSE), Sentinella (misureDelGiorno-
PerReclamo), shared/dw-app-ui.js (toast ×2), Terra (renderValore), Flotta
(csvGiriMacchina), Genesi (Decking) — nove unità di prodotto più due
correttivi (test Scudo ripristinato, banco Terra registrato).

## Coda di lavoro
1. **La trappola del focus nella modale** (`shared/dw-app-ui.js`):
   `dwUiAggancia()` gestisce `Escape` ma non `Tab`, nessun `inert`/
   `aria-hidden` sul contenuto dietro, nonostante `aria-modal="true"` su
   tutte le 8 pagine. Ultimo item della coda originale, non ancora
   iniziato — tocca il file più condiviso del repository.
2. Nessun nuovo agente di deep-pass QA è attualmente in corso: la coda si
   è esaurita. Prossimo passo: dispatchare 2-3 nuovi agenti su superfici/
   angoli non ancora battuti in questa sessione (candidati: Scudo con un
   quinto giro, Sentinella con un angolo diverso, i ponti fra app in
   docs/MAPPA_ECOSISTEMA.md per una sovrapposizione NUOVA non censita).

## Prossimo passo atomico
Implementare la trappola del focus nella modale: `dwUiAggancia()` in
`shared/dw-app-ui.js` deve intrappolare `Tab`/`Shift+Tab` dentro
`#modal` quando è aperta (primo/ultimo elemento focusabile che si
richiudono a cerchio), e il contenuto dietro (`#app` o il main content)
deve ricevere `inert` (o `aria-hidden="true"` con `tabindex="-1"` su ogni
focusabile, se `inert` non è supportato) mentre la modale è aperta,
rimosso alla chiusura. Verificare dal vivo con Playwright (Tab ripetuto,
controllo di quale elemento ha il focus) su ALMENO due superfici (il
file è condiviso da tutte le 8) prima di committare, con controprova. In
parallelo, dispatchare 2-3 nuovi agenti di deep-pass QA per mantenere ≥3
cantieri mentre si lavora su questo file condiviso più delicato.
Continuare "mai fermarsi".

## Blocchi
Nessuno.
