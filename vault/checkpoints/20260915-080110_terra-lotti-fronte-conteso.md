# Checkpoint — 2026-09-15T08:01:10Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
f9fa53e7 (pushato)

## Cosa è stato completato

Chiuso il finding del terzo giro di ricerca in background su Terra (insieme
a Flotta e Campo — vedi i checkpoint precedenti per Campo; Flotta resta
volutamente non corretta, vedi sotto). Riverificato a mano prima di agire:
lettura diretta di `conformitaProgetto`/`volumeMisuratoDiLotto` e
riproduzione indipendente in `node -e` (non lo script dell'agente).

**Il difetto**: `conformitaProgetto` (`apps/terra/terra-data.js`) associava
ogni fronte al suo lotto con `.find()` su `frontiId`. L'interfaccia non ha
nessuna guardia che impedisca di assegnare lo stesso fronte a due lotti
diversi (riorganizzare i settori, correggere un confine): quando succede,
il fronte veniva attribuito in silenzio al PRIMO lotto trovato nell'array
(ordine non garantito, `getDocs()` senza `orderBy`) — stessa identica
famiglia del difetto chiuso stamattina nel core (`_findVolata`: chiave
debole, più candidati, scelta arbitraria). Riprodotto: due lotti con lo
stesso fronte, un solo rilievo da 10.000 m³ — `volumeMisuratoDiLotto`
(chiamata separatamente per ogni lotto, senza visibilità sugli altri) somma
10.000 m³ per CIASCUNO, gonfiando il totale a 20.000 contro un solo rilievo
vero.

**La correzione, scoped**: `lottoDi` in `conformitaProgetto` è diventata
`lottiDi` (`.filter()` invece di `.find()`); un fronte con più di un
candidato si dichiara `lottoAmbiguo:true` con `lottiCondivisi` (gli id), e
NON sceglie nessuno dei due (`lo=null`) invece di uno a caso — `lo=null` è
già un contratto esistente e sicuro (`fondoAutorizzato`/`conformitaQuota`
lo trattano come "nessun lotto", ricadendo sul fondo dell'atto). Aggiunto
un riepilogo `frontiAmbigui` nell'oggetto restituito.

**Deliberatamente NON toccato in questa unità**: `volumeMisuratoDiLotto`
(il doppio conteggio nella SOMMA dei lotti) — la funzione non ha visibilità
sugli altri lotti per contratto, e cambiarla per farla ricevere "tutti i
lotti" tocca il foglio ufficiale (`relazioneLotto`) che la usa per un lotto
alla volta: è un cantiere a sé, non una correzione da uno sportello. La sua
esposizione minima (sapere QUALI fronti sono condivisi, tramite
`frontiAmbigui`) è già fatta.

**Verifica**:
- Nuovo test: "⛔ Terra · conformità: un fronte in due lotti si dichiara
  ambiguo, non si sceglie a caso" — verifica `lottoAmbiguo`, `lottiCondivisi`,
  `lottoId: null`, la ricaduta sul fondo dell'atto (`stato: "dentro"`, non
  "non-misurabile": `lo=null` non vuol dire "non calcolabile"), e che un
  fronte in un lotto solo non si dichiari ambiguo per errore.
- `run-kpi.mjs`: 2992/0. `run-stile.mjs`: 328/0. `sintassi-pagine.mjs`:
  34/34. `numeri-nei-documenti.mjs`: 43/0 (cascata 2991→2992,
  3.475→3.476, e la cifra "asserzioni eseguite dal giro" aggiornata a
  3.942 dalla misura fresca del giro isolato).
- Controprova: rimesso il vecchio `.find()`, il nuovo test cade
  esattamente sull'asserzione attesa (`lottoAmbiguo` atteso true, ottenuto
  false); ripristinato e riverificato verde.
- Giro isolato su worktree separata (scoped esattamente ai sei file di
  questa unità): **40 comandi a posto, 0 caduti**.
- `git status --short` verificato prima del commit: esattamente i 6 file
  intesi.

## Stato roadmap

Nessuna voce di roadmap dedicata (difetto da ricerca mirata).

**Flotta, NON corretta — verificata e deliberatamente rimandata**:
`urgenzaManutenzione` (fonte unica dichiarata per lista/scheda/ordini/
Quadro) e `tagliandiInScadenza` (alimenta la tessera KPI del cruscotto)
decidono la "vince ore o data" con criteri diversi quando un tagliando ha
entrambe le soglie vicine: la prima confronta il RANGO del colore
(danger<warn<ok, ore vince a parità), la seconda confronta i "giorni
grezzi" su due scale non equivalenti (0 fisso se già scaduto sul lato ore,
giorni di calendario veri sul lato data). Riprodotto indipendentemente
(`node -e` diretto sul modulo): con un tagliando scaduto sia a ore
(+100h) sia a data (-5gg), la scheda del mezzo dice "SCADUTA (+100h)"
mentre il cruscotto la conta "1 a data" — il totale (`tagliandi30`) resta
corretto, solo la ripartizione ore/data diverge. Non corretta in questa
unità: la scelta del come (far chiamare a `tagliandiInScadenza` la stessa
decisione, o esporre un criterio di confronto condiviso) tocca campi che
solo il ramo "ore" porta (`mancano`), è una decisione di design che merita
un cantiere a sé con verifica visiva del cruscotto, non un fix da sportello
sulla parola di una ricerca.

## Prossimo passo atomico

Nessuna unità in sospeso su Terra/Campo/Deepwork ID/Conti/Scudo. Aperte:
(a) Flotta `urgenzaManutenzione`/`tagliandiInScadenza` (sopra, da riprendere
con calma); (b) il mandato del ciclo (06:45 UTC, corretto oggi nella
routine stessa) indica come binario 1 "una sovrapposizione NUOVA nella
mappa ecosistema, censita e poi collegata" (tutti i sei ponti censiti sono
già ✅) — da esplorare; (c) una quarta tornata di ricerca a tre cantieri su
aree non ancora coperte da un secondo giro in questo blocco (Sentinella
terzo giro, Conti terzo giro, o la passata in profondità su un'app).
Nessuno stop volontario: si prosegue subito.
