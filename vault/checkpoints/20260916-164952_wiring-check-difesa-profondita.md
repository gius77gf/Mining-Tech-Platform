# Checkpoint — 2026-09-16T16:49:52Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
16055334

## Cosa è stato completato
Dopo quattro unità di fila su P2, ho spostato la passata "in profondità"
su Flotta (binario 2 della fase aperta il 26/08): censite le undici
funzioni `csv*`/`pagellaMezzi` esportate da `flotta-data.js` e i loro
punti di chiamata in `apps/flotta/index.html` — tutte e undici hanno UN
SOLO punto di chiamata, quindi nessuna ha il rischio strutturale che
aveva Campo (due documenti "gemelli" alimentati dallo stesso ponte, uno
dei due dimenticato). Nessun difetto trovato in Flotta con questo metodo.

Ho poi censito gli altri wiring-check "la pagina chiama X con i dati
vivi" già esistenti in `run-kpi.mjs`, per lo stesso finding di Campo:
Terra (`verbaleRilievo`, `prospettoDenuncia`), Conti (`fogliaFattura`,
`fogliaDdt`+`fogliaPreventivo`), Scudo (`fogliaVerbaleDpi`+
`fogliaCartella`). Cinque su cinque ancorano l'INTERA chiamata fino alla
parentesi di chiusura — nessuno di loro ha il difetto di Campo, dove il
regex si fermava a metà riga. Solo quello di Campo era aperto.

**Chiuso il cerchio**: irrigidito quel regex di Campo per chiudere
l'intera chiamata come gli altri cinque — non un nuovo finding (il buco
specifico è già coperto dal test dedicato aggiunto nell'unità precedente,
"⛔ Campo · il ponte P6 è wired ANCHE sul rapporto stampato"), ma un
secondo strato di difesa sullo stesso controllo generale: se in futuro
qualcuno aggiunge un settimo campo a `rapportoGiornata` e lo dimentica
nella pagina, ORA anche il controllo generico lo vedrebbe, non solo il
test specifico sul ponte P6.

Controprova sul codice vero: rimosso `volateSentinella: VOL_SENT` dalla
chiamata (la stessa iniezione usata nell'unità precedente), confermato
che sia il regex stretto SIA il test dedicato cadono indipendentemente —
due difese distinte che si presidiano a vicenda — ripristinato.

Nessun nuovo export, nessun cambiamento al conteggio di `run-kpi`
(3101 invariato: ho arricchito un'asserzione esistente, non aggiunto un
nuovo `test()`). Nessun aggiornamento di doc-cascade necessario
(`numeri-nei-documenti.mjs` confermato pulito senza modifiche). Giro
isolato su worktree pulita: **41/41 comandi, 0 caduti, 4080 asserzioni,
invariato come atteso**.

## Stato roadmap
Passata in profondità estesa a Flotta (pulita) e censimento sistematico
dei wiring-check esistenti (cinque già robusti, uno rinforzato). P2 resta
a quattro scrittori su undici, in pausa deliberata come dichiarato nel
checkpoint precedente.

## Prossimo passo atomico
Nessun difetto aperto da questa unità. Candidati per la prossima:
1. Continuare P2 con il quinto scrittore (rileggere §3 di
   `docs/RICERCA_CONTINUA_ASSENZA.md` per la lista esatta dei sette CSV
   rimasti).
2. Passata in profondità su un'altra app non ancora coperta con questo
   metodo in questo blocco: Sentinella, Scudo (oltre l'unità INAIL già
   fatta) o Terra (oltre le unità di ricerca continua già fatte).
3. Una nuova sovrapposizione nella mappa ecosistema (nessuna emersa
   finora in questo blocco — da rileggere §1/§6 di
   `docs/MAPPA_ECOSISTEMA.md` prima di cercarne una).

## Blocchi
Nessuno.
