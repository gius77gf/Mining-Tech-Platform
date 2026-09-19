# Checkpoint — 2026-09-14T13:09:52Z

## Tipo
unit-complete (correzione di un difetto proprio: commit parziale trovato con `git status`, non dopo)

## App
Genesi (documentazione)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Completato

Il checkpoint precedente (`20260914-125956`) e il suo commit
(`9525eedb`) descrivevano tre note aggiunte a
`docs/RICERCA_CONTINUA_GENESI.md`, ma il commit reale ne conteneva
**solo una**: avevo messo in staging la prima nota, avviato la verifica
su worktree in background, e nel frattempo scritto le altre due note
direttamente sul file di lavoro — senza rifare `git add`. Il
`git commit -F` successivo ha quindi committato solo la copia in
staging (una nota), mentre il messaggio di commit ne descriveva tre.

**Trovato da `git status` prima di procedere oltre**, non da un
controllo automatico: preparando l'unità successiva (aggiornamento di
B3 in `vault/ROADMAP_SETTIMANA.md`) ho fatto `git add` su entrambi i
file e visto `docs/RICERCA_CONTINUA_GENESI.md` comparire come
modificato nonostante fosse già stato committato — segno che HEAD non
conteneva quello che credevo.

**Corretto in un nuovo commit** (`06d320e5`), non riscrivendo la
storia: le due note mancanti (decking/air-decking, criteri di scelta
dell'esplosivo) più l'aggiornamento di B3 (vedi sotto), verificate di
nuovo — stavolta sulla copia REALMENTE staged.

Nello stesso commit, la seconda parte del lavoro di questo blocco:
**`vault/ROADMAP_SETTIMANA.md`, voce B3** ("Genesi continua a uscire
dalla pagina") era ferma al 13/09 con «57 estraibili», mentre il lavoro
G39-G43 di questo stesso blocco (già committato, già in
`docs/DEVELOPMENT.md`) l'aveva portato a **61** senza che la riga che
aveva proposto il cantiere venisse mai chiusa con l'esito — esattamente
la regola del fondatore *"chi chiude un'unità aggiorna la riga del
documento che gliel'aveva proposta"*. Aggiunta una nota ✅ che elenca i
quattro traslochi (G39-G42) e la conferma che G43 non è un falso
positivo, con i numeri rimisurati ora (`genesi-estraibili.mjs`: 147
totali, 53 "una o due", 37 "più di dieci", 61 estraibili) — non
ricopiati da `docs/DEVELOPMENT.md`.

## Perché conta, oltre al caso

È la stessa famiglia già raccolta in CLAUDE.md sotto "il costo della
verifica va a scaglioni" / "si misura la copia di quello che si sta per
committare, non quello che si era misurato": fra la misura e il
`git commit` un albero di lavoro **cambia**, e qui è cambiato per mano
mia — non di un cantiere parallelo. La difesa che ha funzionato è quella
già scritta: **`git status` prima di procedere oltre**, non fidarsi che
un commit "andato a buon fine" contenga quello che il suo messaggio
descrive.

## Verificato

- `numeri-nei-documenti.mjs`: 43 passati, 0 falliti.
- Giro completo su worktree isolata **ricreata da zero** (non riusata
  dalla volta precedente, per la regola "la worktree si ricrea, non si
  resetta"), sul contenuto realmente in staging: **40 comandi a posto,
  0 caduti**, 3909 asserzioni, addendi verificati uno per uno.
- `git status` dopo il commit: pulito.

## Stato roadmap

B3 aggiornata con l'esito G39-G43 (vedi sopra). Resta aperta (`[ ]`):
il cantiere che serve un cambio di firma (53 funzioni "una o due
variabili") non è stato toccato in questo blocco.

## Blocchi e limiti noti

Nessuno nuovo. Restano invariati: gate geometria/flyrock, soglie
USBM/DIN, domanda CAD ancora aperta col fondatore.

## Prossimo passo atomico

Nessuno stop volontario: si prosegue subito. Il backlog di ricerca
continua su Genesi risulta sostanzialmente esaurito (dieci sezioni
rilette fra questo blocco e il precedente). Restano da controllare, se
serve altro lavoro prima della risposta del fondatore sul CAD: IREDES
(13/09, ha già un confronto struttura-Genesi scritto, da verificare se
è aggiornato) e le sezioni di ricerca competitor (Maptek/JKSimBlast,
Orica/Maxam — informative, non hanno "domande per il delta" per
costruzione, quindi probabilmente non producono un'unità). In
alternativa: il cantiere B3 stesso (53 funzioni "una o due variabili",
un cambio di firma non un trasloco) è un lavoro concreto e sostanzioso,
non legato al CAD, che si può aprire subito.
