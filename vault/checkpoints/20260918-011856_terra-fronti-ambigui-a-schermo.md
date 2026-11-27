# Checkpoint — 2026-09-18T01:18:56Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
3408cdf3

## Cosa è stato completato
Chiuso il terzo (e ultimo) difetto del terzo giro di deep-pass su Terra
(agente a82876ad086170520): `frontiAmbigui` — calcolato da
`conformitaProgetto` per dire quali fronti sono condivisi per errore fra
più lotti (rischio: il volume di quel fronte viene sommato per intero in
ognuno) — non arrivava mai a `apps/terra/index.html`. Aggiunto un avviso
dedicato nel cartellone di conformità e corretta l'etichetta del fronte
in elenco ("condiviso fra più lotti" invece di "fuori dai lotti", che
confondeva un fronte conteso con uno davvero dimenticato).

Nuovo banco `terra-fronte-condiviso-avviso.mjs` con controprova nei due
versi (iniettato `lo5.frontiId` con anche `f1`, già di `lo4`), registrato
in `tutti.mjs`. Doc-number bookkeeping aggiornato e riverificato: 339
esecuzioni, 149 file di banco distinti, 4115 asserzioni — tutti letti dal
giro, non a memoria. Giro isolato: 41/41.

Con questo si chiude il terzo giro di deep-pass su **tutte e sei le app**
(Sentinella, Conti, Scudo, Genesi, Flotta, Terra) tranne Campo (in corso).

## Stato roadmap
Terzo giro di deep-pass: tutte le app chiuse tranne Campo (background,
agente adaf5869ccec0571f — completato, 2 difetti veri trovati, in
lavorazione ora). Quarto giro avviato su Sentinella (background, agente
ae91d1f1bb713478c — completato, 1 difetto vero trovato e già corretto,
vedi sotto).

Nello stesso blocco, dal ramo parallelo di verifica: confermato vero
(agente ae6273e3db847b0c5) un quarto difetto della stessa famiglia
"calendario impossibile" — `varianzaLottoAnno` in `apps/terra/terra-data.js`
— **corretto** nella stessa unità di lavoro (vedi sotto, non ancora
committato: verifica in corso).

## Prossimo passo atomico
1. **In corso, non ancora committato**: due fix già scritti e verificati
   a livello di funzione pura/statico (controprova fatta a mano,
   ripristino confermato identico), in attesa del giro isolato completo
   prima del commit:
   - `apps/terra/terra-data.js`: `varianzaLottoAnno` usava `.slice(0,4)`
     grezzo sulla data invece di `rilievoUsabileConData` — un rilievo a
     calendario impossibile ribaltava il verdetto da "indietro del 19%"
     ad "avanti del 1981%". Nuovo test in `run-kpi.mjs` con controprova
     verificata.
   - `apps/sentinella/index.html`: due delle quattro chiamate a
     `misuraFuoriCondizioni` (conferma di scrittura riga ~5821, anteprima
     import CSV riga ~3651) non passavano il terzo argomento (il ponte
     meteo con Campo), mentre le altre due (scheda del punto, report) sì
     — la stessa incoerenza "schermo vs documento" già corretta altrove.
     Rafforzato anche il test di censimento in `run-kpi.mjs` perché
     pretenda il terzo argomento su OGNI chiamata, non solo "almeno 3".
   Prossimo passo: costruire una worktree isolata per ciascuno (o
   insieme, se non confliggono), lanciare `giro-node.mjs`, aggiornare i
   numeri nei documenti se serve, committare (due commit separati, un'app
   per commit), scrivere il checkpoint, pushare.
2. **Campo**: due difetti veri trovati dal terzo giro di deep-pass
   (agente adaf5869ccec0571f), da correggere:
   - `rapportoGiornata` (il rapporto stampato e FIRMATO) non porta i
     near-miss del turno, mentre `testoConsegnaTurno` (il documento
     gemello) sì.
   - Il giudizio di idoneità medica (Scudo) non arriva in NESSUNO dei due
     documenti che escono da Campo, mentre il Quadro schermo lo mostra
     già.
3. Leggere gli esiti delle tre nuove ricerche continue appena arrivate
   (Campo: obiettivo di turno senza riferimento temporale intra-turno;
   Core: da leggere; Norme: D.Lgs 117/2008 sui rifiuti di estrazione,
   assente in tutte le app, verificato con grep — proposta non ancora
   valutata da chi ha il codice in mano).
4. Mantenere ≥3 cantieri paralleli.

## Blocchi
Nessuno.
