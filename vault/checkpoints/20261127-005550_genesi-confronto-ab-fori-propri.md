# Checkpoint — Genesi: il confronto A/B dice i fori con valori loro

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit
Quello che contiene questo file («feat(genesi): il confronto A/B dice i fori
con valori loro…»). Il precedente di prodotto, `31631f80` (il piede dei fori
nel DXF), è confermato dal giro `node` completo: 43 comandi a posto, 4420
asserzioni. In mezzo c'è il canarino del ciclo (`477c2818`).

## Che cosa è stato fatto
- Misurato sulla dimostrazione: salvando A, poi B con più borraggio (gittata
  119 → 65 m) e UN foro col borraggio corto, B restava in VERDE sulla riga
  della gittata — un numero che per quel foro non è calcolato (decisione 33).
- Lo scatto (`computeKPI`) porta tre conti, presi dalle funzioni della
  scheda: `foriPropri`, `flyTipo`, `fragTipo`. Numeri, non frasi.
- Modulo: `cmpForiPropri(kpi)` → `{ noto, fori, fuoriGittata,
  fuoriPezzatura, cella, cellaGittata, cellaPezzatura, gittataSuTutti }`.
  ⛔ Uno scatto salvato prima non ha i tre conti: «non noto», e
  `gittataSuTutti` è falso (non sapere non è zero).
- Schermo: tre righe («↳ fori con valori propri», «↳ pezzatura non calcolata
  per», «↳ gittata non calcolata per») solo se in almeno uno dei due scatti
  c'è qualcosa da dire; verde sulla gittata solo se vale per tutti i fori di
  tutt'e due; la ragione esce sotto (`#cmp-fly-tipo`), come per la PPV.
- CSV del confronto: «Fori con valori propri», «…registrati nello scatto»,
  «Fori fuori dal foro tipo (pezzatura)», «…(gittata)». Scatto vecchio →
  cella vuota, mai zero.
- ⚠️ Scelta dichiarata, non decisa dal fondatore: il verde su X50/X80 resta
  (la pezzatura è una media sulla volata e la riga sotto dice per quanti
  fori non è calcolata); sulla gittata no, perché lì basta un foro.
- Prove: `run-kpi.mjs` 3257 → 3258 (controprova 8 su 8); banco
  `genesi-foro-per-foro.mjs` 190 → 208, 70 iniezioni tutte sul bersaglio
  (controprova: cadono le righe della sezione nuova); il difetto «il conto
  per la gittata prende tutti i campi», che in controprova è coperto da un
  altro, provato DA SOLO su una copia. Scatti guardati a 430 e 320 px.
- Numeri: 3.758 prove senza rete; giro `node` 4421 (per somma: 4420 + 1 — da
  confermare col giro su questo commit); `genesi-data.js` 207/207.

## Lezioni di questa unità
- Il banco crollava in controprova (`…righe[nome].b` su una riga sparita):
  un banco che crolla dichiara meno prove. Ora una riga assente si legge
  vuota e l'asserzione cade col suo nome.
- L'attesa `until grep "uscita controprova"` è tornata subito sul registro
  VECCHIO: un file di esito va svuotato prima di aspettarlo.

## Stato roadmap
Chiusa «Genesi — il confronto A/B dice i fori con valori loro». Aperta e
ferma: «Genesi — il piede che esce dalla faccia» (decisione 35).

## Prossimo passo atomico
**Seconda passata di Genesi coi valori per foro accesi — lo storico.**
1. `grep -n "storico\|GDB.aggiungi('volate'\|registroVolate" apps/genesi/genesi.html`:
   trovare dove una volata salvata nello storico tiene i suoi numeri e dove
   li ridisegna (elenco, dettaglio, CSV dello storico, riconciliazione).
2. Con tre fori con valori loro (dal ponte `window.__genesi.D2.holes[i].kg`
   ecc.), salvare la volata, riaprire lo storico e GUARDARE lo scatto a 430
   e 320: la carica totale è quella vera? si dice che ci sono fori con
   valori loro? la gittata porta «foro tipo»? Premere ogni bottone che
   produce un file da lì e aprire il file.
3. Dove manca: stessi tre conti dello scatto (`kpi.foriPropri`, `flyTipo`,
   `fragTipo` ci sono già in `computeKPI`), letti con `cmpForiPropri` — non
   una funzione nuova. Uno storico salvato prima → «non noto», mai zero.
4. Se lo storico è già a posto, la passata prosegue sulla scena 3D (stessa
   domanda) e poi su `B3. Genesi continua a uscire dalla pagina`.

## Blocchi (del fondatore)
Decisioni 28, 33 (⚠ quale foro usa la gittata), 34 (lettore LAZ), 35 (spalla
al piede); 32 rimandata. Il piano di carico CSV non porta diametro e
inclinazione per foro: l'intestazione sta in `shared/dw-ponti.js`, letta da
Campo — annotato, non toccato (mandato solo Genesi).
