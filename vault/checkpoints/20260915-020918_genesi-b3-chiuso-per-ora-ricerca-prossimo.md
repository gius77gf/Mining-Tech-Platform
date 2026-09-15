# Checkpoint — 2026-09-15T02:09:18Z

## Tipo
misura (nessun commit di codice in questa unità)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
89b09e75

## Cosa è stato misurato

Con `computeInnesco2D`, `_sigDetTimes`, `mdlProfSnap`, `crestZ`,
`measureGeom2D` e `interpFronte` tutti chiusi in questo ciclo (6
unità), ho verificato uno per uno i candidati rimasti nel bucket "1-2"
del censimento (`genesi-estraibili.mjs --elenco`, 39 funzioni):

- `riconStorico`, `d2Up`, `sitoStore`: verificati e scartati —
  rispettivamente un alias di I/O (`GDB.riconciliazioni()`), un
  setter di stato locale del mouse (`d2drag=-1; d2dragPt=-1;`), e un
  alias trivale (`return SITO;`). Nessuno dei tre contiene un calcolo
  da spostare in un modulo di dati puri.
- `computeMIC`: **confermato deliberatamente permanente**, sorvegliato
  da un test che pretende compaia esattamente due volte, a difesa di
  un difetto di sicurezza già chiuso (`Math.max(1, null)` su una MIC
  non calcolabile) — vedi `run-kpi.mjs`, "i sette lettori della pagina
  non ridisegnano il numero tranquillo".
- `selRoccia`/`selEsplosivo`/`selInnesco`/`rockFactorA`/`deriveCharge`/
  `ppvSite`: **ragione strutturale trovata, non solo di costo.** A
  differenza di tutti i legami chiusi finora — che componevano
  CALCOLI puri a partire da campi di `D2` — questi compongono una
  SCELTA DA CATALOGO (`scegliDaCatalogo(ROCCE/ESPL/INNESCHI, D2.campo,
  ripiego)`) usata identica in 46 punti sparsi per convenienza di
  battitura. Finire `rockFactorA` spostandolo nel modulo richiederebbe
  passargli anche il risultato di `selRoccia()` come secondo argomento
  (`rockFactorA(D2, selRoccia())`), che è PIÙ verboso della forma
  attuale (`rockFactorA()`) per zero guadagno — non è un trasloco, è
  un peggioramento. Confermato leggendo tutti gli 11 pinned test che
  citano questi tre nomi: pinnano il testo esatto di ALTRI chiamanti
  già blindati altrove (`deriveCharge`, `ppvSite`, i due `flyrock*`),
  quindi ogni sito toccato rischia di rompere un test scritto per
  tutt'altra ragione.

**Conclusione: B3 non ha più candidati economici.** Non è un "in
pausa" come il checkpoint del 14/09 (quello si è rivelato in parte
sbagliato, vedi `20260915-005625`): qui la ragione è strutturale,
verificata leggendo il codice di ognuno dei candidati rimasti, non
dedotta dal loro numero di chiamanti.

Per non fermarsi (regola del fondatore), ho lanciato un agente Explore
in background per determinare il prossimo elemento di roadmap
concretamente azionabile e non bloccato dal fondatore, controllando in
particolare lo stato vero di **B12** (il censimento dei ripieghi
silenziosi nel core — molte parti già chiuse, ne restano forse due
candidati geometrici da verificare) e i ponti dell'ecosistema in
`docs/MAPPA_ECOSISTEMA.md`.

## Prossimo passo atomico

Attendere il risultato dell'agente Explore e procedere con quello.
Se B12 risulta davvero chiuso e nessun ponte è scopribile senza il
fondatore, il fallback è una passata in profondità su una delle sei
app verticali (Scudo, Campo, Flotta, Conti, Sentinella, Terra) — la
meno toccata di recente, da determinare guardando `git log` per
cartella.

Nessuno stop volontario: si prosegue subito appena l'agente risponde.
