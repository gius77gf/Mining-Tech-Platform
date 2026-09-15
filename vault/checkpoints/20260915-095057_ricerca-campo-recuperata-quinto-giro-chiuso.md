# Checkpoint — 2026-09-15T09:50:57Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
0d521571 (pushato)

## Cosa è stato completato

Chiuso il quinto giro di ricerca mirata (Scudo, Campo, Terra). Recuperato
il lavoro perduto dell'agente Campo (nessun commit mai arrivato, causa
probabile la collisione fra tre agenti nella stessa cartella di lavoro —
vedi checkpoint `20260915-094731`): il contenuto era nel riepilogo finale
dell'agente nel mio contesto, riverificato di persona riga per riga sul
codice vero invece di rilanciare un altro agente (più veloce e altrettanto
rigoroso). Tutte e tre le lacune proposte reggono:

1. `btn-fir` ("Chiudi il turno", `index.html:3522`) valida solo che il
   nome di chi consegna non sia vuoto — nessun controllo su appello
   incompleto, attività senza `fine`, fermi senza minuti;
2. il campo "chi riceve" (`fir-ricevuta`) è testo libero senza `required`:
   la consegna si chiude anche senza indicare chi la riceve;
3. **la più seria**, e più precisa del riepilogo originale dell'agente:
   Campo ha DUE meccanismi di consegna scollegati. Il record minimo
   (`consegna`, `ricevuta`, `note`, `ora`) lo scrive davvero `btn-fir` su
   Firestore (`chiusure`); il rapporto ricco a 12 sezioni
   (`testoConsegnaTurno`, dietro `btn-consegna`) si scarica solo come
   `.txt` client-side e non tocca mai il database — non tracciabile, non
   collegato al record persistito.

Unito al file canonico `docs/RICERCA_CONTINUA_CAMPO.md` (maiuscolo — il
path minuscolo indicato nel mandato originale era un mio errore, come già
per Scudo e Terra). Inviato un messaggio di chiusura all'agente Campo per
confermargli che il lavoro è salvo e non serve rifarlo.

**Verifica**: `omonimi-a-maiuscole.mjs` 4/0, `numeri-nei-documenti.mjs`
43/0. Nessun codice toccato in tutto il giro di dedup/recupero (tre unità:
Scudo+Terra in `115528a3`, Campo in `0d521571`) — solo documenti di
ricerca, quindi nessuna cascata di prove da aggiornare e nessun giro
completo isolato necessario.

## Stato roadmap

Quinto giro di ricerca **chiuso**: 3 app coperte (Scudo, Campo, Terra), 7
lacune proposte in totale, 5 confermate (1 Scudo + 3 Campo + 1 delle 3 di
Terra pienamente nuova, le altre 2 di Terra confermate con sfumatura), 2
false (Scudo). Nessuna delle lacune confermate è ancora stata trasformata
in un fix di codice: sono candidati per il prossimo blocco.

## Prossimo passo atomico

Scegliere una delle lacune confermate di questo giro e trasformarla in
un'unità di codice, seguendo lo stesso schema usato per il quarto giro
(fix scoped + test + verifica isolata + checkpoint). Candidati, in ordine
di severità/costo: (a) Campo — collegare o almeno rendere tracciabile il
testo di consegna ricco alla stessa `chiusura` persistita (la lacuna più
seria: oggi un ispettore non trova la consegna vera nel database); (b)
Scudo — campo di sospensione disciplinare temporanea sul lavoratore,
separato da `attivo`; (c) Terra — margine in giorni fra esaurimento e
scadenza del titolo in `vitaCava` (i dati grezzi ci sono già, manca solo
il calcolo e la riga a schermo). In parallelo, per non sprecare tempi
morti: una nuova ricerca mirata su un'area non ancora coperta in questo
giro (Flotta, Sentinella, Conti o Deepwork ID, per un secondo passaggio
più approfondito) — questa volta con `isolation: "worktree"` per ogni
agente, e controllando PRIMA la convenzione di maiuscole/minuscole del
nome file di destinazione. Nessuno stop volontario: si prosegue subito.
