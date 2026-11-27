# Checkpoint — 2026-09-19T04:43:29Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
ac10bc60 — fix(sentinella): il modale PPV lanciava un'eccezione riaperto di fila

## Cosa è stato completato
Chiusura del quattordicesimo giro: entrambi i difetti riportati dall'agente
UX su Sentinella (`abcf767091511907a`) sono stati riprodotti
indipendentemente con lo stesso metodo di misura prima di essere corretti.

- [x] **shared, commit `3d605053`**: `.dwg-tab > summary` (il bottone
      "Dati" di ogni grafico, componente CONDIVISO da tutte e sei le
      app) aveva `min-height:30px`, sotto i 44/60px minimi di tocco.
      Corretto con `var(--tap)`, come già `.chg`/`.nav`. Nuovo banco
      `dwg-tab-min-tocco.mjs` con controprova (riproduce esattamente
      51,7×30px).
- [x] **Sentinella, commit `ac10bc60`**: il modale "Collega la PPV
      misurata" lanciava `Cannot read properties of null (reading
      'appendChild')` in produzione se riaperto su un'altra volata
      prima che il `requestAnimationFrame` differito del modale
      precedente scattasse (il vecchio `<select>` restava con
      `parentNode===null` dopo che `apriModale` sovrascriveva
      `#modal-body`, ma il `tagName` non cambiava e la guardia non lo
      vedeva). Corretto aggiungendo `!s.isConnected` alla guardia.
      Nuovo banco `sentinella-ppv-modale-race.mjs`: la riproduzione
      richiede i due click dentro un solo `page.evaluate` (con
      `page.click()` di Playwright il primo fotogramma fa in tempo a
      scattare prima della riapertura, e il banco non proverebbe
      niente — spiegato nell'intestazione del file).

Dispatchati tre nuovi cantieri paralleli (direttiva 26/07), tutti col
vincolo esplicito "niente git, niente modifiche al codice di prodotto —
solo verificare e riportare": QA approfondita su Terra, ricerca continua
su Genesi (validazione pre-sparo / tracciabilità post-sparo /
frammentazione oltre Kuz-Ram), seconda UX/estetica su Campo. Ancora in
corso, in attesa dei report.

Il giro completo del browser (`tutti.mjs` su worktree di `aade8904`,
lanciato alle 03:20) è ancora in esecuzione — oltre un'ora. Da leggere
con `leggi-giro.mjs` quando finisce, guardando prima la sezione 0: il
branch è avanzato di parecchi commit da `aade8904` (compresi tutti i fix
di questo giro), quindi eventuali KO vanno confrontati con quali
superfici toccano prima di aprire un cantiere.

## Verifica prima di ogni commit
`run-kpi.mjs` 3183/3183 · `sintassi-pagine.mjs` 34/34 · `run-stile.mjs`
330/330 · `suite-collegate.mjs` 3/3 (255 file) · `iniezioni-fresche.mjs`
714/714 · `numeri-nei-documenti.mjs` 43/43 (427 banchi, copertura
1053/1053, 16 voci aperte/16 righe d'indice) · `copertura-funzioni.mjs`
11/11 · `sonda-vuoto.mjs` 15/15 · `dwg-tab-min-tocco.mjs` 4/4 normale, 2
KO sotto `--controprova` · `sentinella-ppv-modale-race.mjs` 3/3 normale,
1 KO sotto `--controprova`. Numeri propagati con lo strumento a ogni
passo.

## Stato roadmap
Quattordicesimo giro chiuso: Campo (due difetti QA), Sentinella (due
difetti UX/funzionali). Tutt'e due gli agenti dispatchati insieme
(Campo QA, ricerca Scudo, UX Sentinella) sono stati processati tranne
la ricerca su Scudo, di cui non risulta arrivato nessun report (nessun
agente in coda, nessuna notifica): probabilmente non ha prodotto output
recuperabile in questa finestra, o il suo esito è andato perso a una
compattazione. Non riproposta automaticamente: verrà ridispatchata in un
giro successivo se la rotazione lo richiede.

## Prossimi passi
- **Prossimo passo atomico**: attendere i report dei tre agenti appena
  dispatchati (QA Terra, ricerca Genesi, UX Campo). Per ognuno:
  verificare indipendentemente ogni finding contro il codice attuale
  (niente entra sulla parola dell'agente) prima di implementare,
  correggere con controprova dove ha senso, propagare i numeri,
  committare per unità.
- Leggere l'esito del giro completo del browser quando finisce
  (`leggi-giro.mjs`, log in scratchpad `giro-completo-19-0316.log`),
  sezione 0 prima di tutto.
- Se il giro risultasse troppo vecchio o bloccato da un server orfano,
  rilanciarne uno nuovo su un commit più fresco dopo aver chiuso questa
  unità.
- Mantenere almeno tre cantieri paralleli aperti in ogni blocco
  (direttiva 26/07).

## Blocchi
Nessuno.
