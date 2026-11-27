# Checkpoint — 2026-09-21T04:07:43Z

## Tipo
verifica/documentazione (nessun codice di prodotto toccato)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
47e3099c (docs(genesi): chiudi riga invecchiata su RICERCA_CONTINUA_GENESI, G53 già fatto)

## Cosa è stato completato
Proseguito il "prossimo passo atomico": verificato con lo strumento
giusto (non assunto) se UNI 9916/ISEE hanno un testo integrale
raggiungibile, invece di dichiarare subito "non si può".

- [x] `WebSearch` per UNI 9916: confermato a pagamento, nessun testo
  libero (solo `store.uni.com`).
- [x] `WebSearch` + `WebFetch` per ISEE Field Practice Guidelines /
  Performance Specifications: i link diretti su `isee.org` e uno
  specchio hanno dato **404** (non `EGRESS_BLOCKED` — il dominio
  risponde, solo quel file non c'è più a quell'URL).
- [x] **Uno specchio governativo (`files.dep.state.pa.us`) ha
  funzionato**: WebFetch ha scaricato un vero PDF di 30 pagine, letto
  per intero col tool `Read` (non solo un riassunto) — un paper di
  conferenza (Eltschlager & Mann, 2017) che cita ampi estratti
  letterali di FPGBS/PSBS: orientamento del sensore (±5° di tolleranza
  per installazioni permanenti), accoppiamento al terreno in condizioni
  particolari, protezione del microfono, soglie di calibrazione (2-250
  Hz, ±5%/±0,5 mm/s, cross-talk <5%).
- [x] **Corretta una riga precedente di questo repository**: la nota
  del 13/08 in `docs/RICERCA_CONTINUA_GENESI.md` che diceva "WebFetch su
  un dominio qualunque risponde EGRESS_BLOCKED" era una generalizzazione
  da un campione di due domini. Misurato oggi su un terzo dominio:
  funziona. Documentato nel research doc con l'invito a non
  generalizzare nemmeno questa (va verificato dominio per dominio).
- [x] **Delta per Genesi: zero, per perimetro non per pigrizia.** Il
  contenuto trovato riguarda l'installazione/calibrazione fisica di un
  sismografo (fase di MISURA), che è territorio di Sentinella
  (monitoraggio/conformità), non di Genesi (che PREVEDE la vibrazione
  prima dello sparo e confronta con un valore reale già raccolto
  altrove). Col mandato "solo Genesi" attivo, non costruito nulla su un
  fondamento fuori perimetro. Chiuso in `docs/RICERCA_CONTINUA_GENESI.md`
  con la sezione "Ricerca del 21/09 — ISEE Field Practice Guidelines".

## Verifica prima del commit
Stesso ragionamento dell'unità precedente: `RICERCA_CONTINUA_GENESI.md`
non è fra i documenti tracciati da `numeri-nei-documenti.mjs` /
`documenti-invecchiati.mjs`. Rilanciati comunque entrambi: **43/0** e
**15/0**, verdi. `giro-node.mjs` completo, lanciato in background
dall'unità precedente, ancora in corso (suite `nomi-liberi.mjs`, pesante
per costruzione — normale, non un guasto).

## Stato roadmap
Nessun codice di prodotto toccato. Con questa, il percorso "cambiare
metodo" del checkpoint precedente è stato seguito ed esaurito senza
produrre un delta di prodotto per Genesi: sia il simulatore sintetico
(non copre Genesi) sia il testo integrale ISEE (copre Sentinella, non
Genesi) sono stati misurati e scartati con la ragione scritta, non
assunti.

## Prossimi passi
- **Prossimo passo atomico**: tornare a scorrere
  `docs/RICERCA_CONTINUA_GENESI.md` con lo stesso metodo che ha
  funzionato in questa unità e nella precedente — `git log -S
  "<nome-funzione-o-simbolo-chiave>"` su ogni proposta ancora aperta
  nelle sezioni più vecchie (in particolare quelle del 12-13/09, mai
  rilette con questo metodo), per trovare altre proposte già fatte e
  mai chiuse, prima di aprire una ricerca nuova.
- Mandato del fondatore invariato: solo Genesi, massimo sforzo.

## Blocchi
Nessuno.
