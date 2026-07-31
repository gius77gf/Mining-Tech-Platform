# Checkpoint — «chi può fare quel lavoro domani mattina»

- **Tipo**: unità (12 prove sulla matrice delle abilitazioni di Scudo)
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `0cc94af`

## Perché è l'unità con la posta più alta della piattaforma

`abilitazioneLavoratore` risponde a una domanda che una cava si fa ogni
mattina: **questa persona può stare qui a fare questo lavoro?** Tre risposte
sole — *può / attenzione / no* — perché di mattina non c'è tempo di leggere una
tabella.

Nessun comportamento è stato cambiato: si è scritta soltanto la prova che
continui a decidere così.

## Le tre scelte che le prove blindano

1. **Bloccano** la persona non in forza, l'idoneità sanitaria negativa e un
   corso richiesto **mancante o scaduto**.
2. **I DPI non bloccano, ma pesano.** L'app sa se la consegna è **registrata**,
   non se il lavoratore ha l'elmetto **in mano**. Dirlo come certezza sarebbe
   una bugia in **tutte e due** le direzioni: bloccare chi ce l'ha, o assolvere
   chi non ce l'ha. Restano in evidenza, non nascosti — e la frase dice
   «consegna mai registrata», non «non ce l'ha».
3. **«Idoneo con prescrizioni» avvisa, non blocca.** Il medico competente l'ha
   dichiarato idoneo: bloccarlo sarebbe l'app che decide al posto suo.

## Le altre, tutte con la loro ragione

- Una scadenza copre un requisito in **tre modi** — dal campo `preset` al testo
  alla parola chiave — perché pretendere solo il primo lascerebbe fuori tutte le
  righe scritte a mano prima che quel campo esistesse.
- Con **più rinnovi vale l'ULTIMO**: col primo trovato, chi ha rinnovato
  risulterebbe non abilitato.
- **«Non risulta» non è «va bene»**: lo stato è `mancante`, non `regolare`. È la
  stessa differenza fra «senza dati» e «conforme» del report ambientale, trovata
  due unità fa in un'altra app.
- La matrice mette **in cima chi può andare**, non il primo in ordine
  alfabetico: la prima riga che si guarda deve essere una persona che può
  lavorare.

## Metodo

Controprova: **7 difetti rimessi, 7 visti, 0 non visti.** Sono i sette modi in
cui questa funzione potrebbe mandare in cava qualcuno che non ci può stare, o
tenerne fuori qualcuno che ci può stare. Ognuno stampa la conseguenza in
italiano — *«esito puo per un non idoneo»*, *«in cima c'è Anna (no)»* — invece
di un numero.

## Una correzione di record

Il checkpoint precedente diceva che Scudo era passata a **35** funzioni coperte
su 71: era **30**. Ho riletto il conto invece di fidarmi di quello che avevo
scritto. Con questa unità sono **41**.

## Stato

- **682** KPI (433 all'inizio della giornata) → **965** prove `node`, verdi in
  UTC **e** in ora italiana
- **249 prove nuove** in giornata, **6 difetti di prodotto** corretti
- Scudo: da **22/71** a **41/71** funzioni coperte

## Prossimo passo atomico

Restano scoperti in Scudo i gruppi delle **ispezioni**
(`nuovaIspezioneDaModello`, `vociNonConformi`, `statoIspezione`,
`riepilogoIspezioni`) e delle **nomine** (`nominaAttiva`,
`organigrammaSicurezza`, `nomineDaSistemare`). Le nomine sono il posto in cui
l'app dice **chi ha un ruolo di sicurezza in azienda**: un RSPP scaduto o non
nominato è una delle prime cose che un ispettore chiede.

## Bloccanti

- Nessuno.
