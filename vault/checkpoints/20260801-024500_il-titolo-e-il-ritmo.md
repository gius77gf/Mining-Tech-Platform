# Checkpoint — il titolo che vale e il ritmo che stima l'esaurimento

- **Tipo**: unità (6 prove nuove, la più importante su una regola vincolante)
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `e869969`

## Cosa è entrato

`autorizzazioneVigente` (sotto quale titolo si sta cavando) e `ritmoMedioAnnuo`
(il numero da cui esce l'anno di esaurimento della cava). Nessuna delle due era
nominata in nessuna prova.

## La prova che conta più delle altre

> ⛔ **la ripresa di CUMULI non consuma la concessione**

È la regola 7 dello stile, quella che `run-stile.mjs` difende sul codice —
adesso è difesa anche sul **comportamento**. Cumulo = materiale già scavato e
già scalato: se entrasse nel ritmo, l'anno di esaurimento verrebbe fuori prima
del vero.

Rimettendo il difetto (contare tutti i rilievi invece del solo scavo) la prova
fallisce con **«atteso 20000, ottenuto 70000»**: la concessione risulterebbe
consumata tre volte e mezza più in fretta, e su quel numero si decidono
investimenti.

## La seconda volta che il codice aveva ragione e la prova no

Avevo scritto `eq(Math.round(r.annuo), 10000)`. Viene **10.007**, perché qui
l'anno dura **365,25 giorni** — i bisestili — e due anni di calendario sono
1,9986 anni-media.

Pretendere il numero tondo avrebbe fatto passare per difetto la gestione
**corretta** dei bisestili. La prova adesso controlla la cosa che conta (il
ritmo è quello, a meno dello scarto che i bisestili giustificano) e il perché
è scritto accanto.

È la terza volta in due unità che una mia asserzione era più precisa della
realtà o indovinava la forma dei dati. Vale la pena dirlo: **le prove nuove
sbagliano più spesso del codice vecchio**, e trattarle come giudici infallibili
è il modo migliore per «riparare» qualcosa che funzionava.

## Stato

- **466** KPI (433 stamattina), 177 stile, 43 helper, 23 pointcloud, 9
  manifest, 7 demo → **725** prove `node`, tutte verdi
- giro a 19 banchi: al secondo banco

## Prossimo passo atomico

Restano scoperte, in ordine di danno: `reportConformita` di Sentinella (è il
documento che il cliente consegna davvero all'ente — la prova più delicata,
perché va capito bene cosa promette), `consumoPerMezzo` e `coperturaControlli`
di Flotta, `statoRequisito` e `lavoratoriScoperti` di Scudo (dicono chi non può
salire su un mezzo). Stessa regola per ognuna: vista fallire col difetto
rimesso, e se nasce rossa si legge il codice prima di accusarlo.

## Bloccanti

- Nessuno.
