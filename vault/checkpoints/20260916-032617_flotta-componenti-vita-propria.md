# Checkpoint — 2026-09-16T03:26:17Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
bd307ff2

## Cosa completato
- Implementato il **tema 1 della ricerca continua su Flotta** (componenti a
  vita propria): `TIPI_COMPONENTE`, `componentiDelMezzo`, `vitaComponenti`
  in `apps/flotta/flotta-data.js` — riusa lo schema di
  `azzeramentiDelMezzo`/`spezzaLetture` (un evento porta il punto in cui
  qualcosa ricomincia a contare sulle ore del mezzo), ma su una collezione
  a sé (`componenti`, opzionale, per mezzo) invece che su una bandiera
  dentro le letture, perché più tipi convivono con date indipendenti.
- **Prima fetta**, come `sezionePeggiore` di Terra: calcolo e lettura
  completi e testati; il modulo per registrare un montaggio dal giro
  macchina resta il passo successivo, additivo.
- Wiring nella scheda del mezzo (libretto macchina): nuova sezione
  "Componenti a vita propria", sola lettura di `m.componenti`. Demo
  arricchita su E1 (pneumatico montato a 4.000h, denti benna a 5.500h,
  mezzo a 5.870h) per mostrare un caso vero.
- Test in `run-kpi.mjs` (eventi validi/invalidi — data inesistente, ore
  mancanti —, vita calcolata correttamente, ore attuali non note dichiarate
  separatamente da un montaggio incoerente).
- **Due difetti reali trovati e corretti durante la verifica**, entrambi
  invisibili a qualunque suite `node`:
  1. Il primo collegamento alla pagina passava `m.nome` come filtro a
     `componentiDelMezzo` insieme a `m.componenti` — un elenco GIÀ scoperto
     a un mezzo solo, senza campo `.mezzo` al suo interno. Il filtro
     scartava sempre tutto (`nomeBreve(undefined) !== "Escavatore E1"`), e
     il pannello mostrava sempre lo stato vuoto nonostante due componenti
     veri in demo. Corretto passando `nomeMezzo:null` quando l'elenco è
     già scoperto — trovato SOLO aprendo la pagina vera e leggendo il DOM,
     esattamente il tipo di difetto che questo file documenta da mesi.
  2. Il primo markup usava `.amt`/`.amt-n`/`.amt-s`, copiate da Conti —
     ma quelle classi sono stilate nel `<style>` LOCALE di Conti, non
     condivise: Flotta non le dipinge. `classi-orfane.mjs` l'ha presa
     immediatamente (3 classi morte). Sostituite con lo stesso pattern
     "badge in `.acts`" che Flotta usa già ovunque per un valore in coda a
     una riga.
- Nuovo file browser permanente `tests/browser/flotta-componenti-vita.mjs`,
  con controprova sul difetto (1) — la funzione pura da sola non basta a
  fidarsi del collegamento.
- Registrato in `tests/browser/tutti.mjs` (normale + controprova).
- `run-kpi.mjs`: 3055/0. `run-stile.mjs`: 330/0. `sintassi-pagine.mjs`:
  34/0. `classi-orfane.mjs`: 0/0 (dopo la correzione). `funzioni-mai-usate.
  mjs`: 4/0. `numeri-nei-documenti.mjs`: 43/0. `flotta-contatore.mjs`
  (browser esistente): 72/0, nessuna regressione. Giro isolato (rilanciato
  due volte, la seconda dopo la correzione di copertura): **4018**
  asserzioni, 40/40 comandi a posto, 0 caduti.
- Doc-cascade aggiornato in tutti e quattro i documenti: run-kpi 3054→3055,
  somma nove suite 3.548→3.549, giro completo 4016→4018, copertura sei
  app 1024/1024→1027/1027, banchi browser 295→297 (128 file distinti).
- Commit `bd307ff2`, pushato su `claude/scheduled-tasks-remote-control-bk4ap6`.

## Stato roadmap
Vedi `vault/ROADMAP_SETTIMANA.md`. Con questa unità è chiuso il tema più
pronto della ricerca su Flotta. Restano aperti: manutenzione su condizione
(da verificare in cava prima del codice), trend frequenza fermi (già fatto
in un'unità precedente — verificare se il documento di ricerca lo segna
ancora aperto), curva di costo/vita economica, costo per tonnellata
(richiede prima una decisione su un ponte Flotta↔Terra); rischio chimico,
denuncia INAIL, anagrafica attrezzature, notifiche automatiche (Scudo);
piani di rientro e storico dei solleciti (Conti).

## Prossimo passo atomico
Candidati aperti, in ordine di prontezza:
1. Storico dei solleciti in Conti (`fattura.solleciti: [{livello, data,
   canale}]`, bottone "segna come inviato"): costo piccolo, nessun invio
   automatico, pattern già chiaro dal delta di ricerca.
2. Rotazione ricerca continua: tutte e sei le app hanno avuto un giro nelle
   ultime 24 ore — al prossimo blocco un secondo passaggio più
   approfondito, o i temi ancora aperti nei documenti `RICERCA_CONTINUA_*`.
3. Non fermarsi qui per la regola del fondatore (esaurimento crediti):
   proseguire immediatamente con l'unità successiva.

## Blocchi
Nessuno.
