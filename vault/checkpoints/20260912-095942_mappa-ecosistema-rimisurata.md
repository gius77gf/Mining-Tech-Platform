# Checkpoint — %Y-%m-%dT%H:%M:%SZ

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
399d324b

## Completato
Unità 119 — `docs/MAPPA_ECOSISTEMA.md` rimisurato. Il documento che la
Cloud Routine ripete ogni ciclo cita questo file come priorità #1 ("i
ponti fra le app"), con la cifra «SEI ponti su 56» e «Genesi NON esce dal
browser (localStorage, zero orgCollection)»: entrambe risalgono al 26/08 e
il documento stesso, in §3a e nel corpo di §4, aveva già le note ✅ che le
correggevano (02/09, 05/09 notte) — solo la tabella di apertura (§1) e la
frase di chiusura di §4 non erano state allineate.

Rimisurato col grep che il documento stesso prescrive, corretto: il
vecchio `grep "appId:"` non vede più `DeepworkID.init({ appId })` scritto
con la scorciatoia di oggetto (senza i due punti), introdotta quando Campo
e Scudo hanno consolidato le loro aperture ripetute verso altre app in una
funzione sola (`apriApp`, `leggiAltra`). Con
`grep -rnoE 'DeepworkID\.init\(\{[^}]*appId[^}]*\}\)'` più la lettura a
mano delle due fabbriche dinamiche, il conto vero è **16 collegamenti su
56** (non 6): nessuna app isolata, Genesi ha una porta live su cinque
`orgCollection` dal 02/09 ed è letta da tre app.

Tabella di §1 riscritta, coda di §4 chiusa con una nota che ritira la sua
conclusione (ormai contraddetta dalla nota ✅ che la precedeva nello stesso
paragrafo). Voce corrispondente in vault/ROADMAP_SETTIMANA.md chiusa e
tolta dall'indice delle voci aperte. Nessun codice toccato: solo la misura
e i due documenti che la riportano. Giro completo pulito su una worktree
di HEAD: 40 comandi a posto, 0 caduti.

Nella stessa sessione, prima di questa unità: canarino del ciclo del
12/09; unità 118 (Conti: TD24 e l'esito dello SdI) rifinita e committata
(era rimasta non committata dal riavvio del contenitore); un difetto
indipendente in `csvFermiMacchina` di Flotta corretto (una prova con
«oggi» fisso invecchiava contro una dimostrazione generata sull'orologio
vero).

## Imparato
- Un documento può avere le correzioni ✅ scritte al posto giusto (in
  mezzo al testo, dove il fatto vecchio stava) e restare comunque
  fuorviante nella sua PRIMA sezione e nella sua frase di CHIUSURA, se
  quelle due non vengono toccate quando il resto viene aggiornato. Chi
  legge un documento lungo spesso legge solo l'inizio e la fine.
- Il grep che un documento prescrive per ricontrollarsi invecchia anche
  lui: quando il codice cambia FORMA (qui, la scorciatoia di oggetto),
  lo stesso comando può smettere di vedere metà dei casi senza che
  nessuno se ne accorga, perché continua a rispondere con un numero
  plausibile invece di un errore.
- La routine automatica di questa sessione ripete un testo fisso che cita
  questo documento: quel testo non si può correggere da qui (non è un
  file del repository), ma il documento che cita sì — ed è quello che
  serve, perché la prossima volta che qualcuno (umano o agente) apre
  MAPPA_ECOSISTEMA.md per decidere che cosa fare, trova la misura giusta.

## Prossimo passo atomico
Leggere il giro del browser lanciato su `a820c6d2` (log in
`$S/giri/ultimo-log.txt`, con `leggi-giro.mjs`) quando `ultimo-exit.txt`
compare: chiudere eventuali KO veri. Poi proseguire con la ricerca a
rotazione (quinto giro su Conti, o terzo giro su Genesi/Deepwork ID su un
tema NON già coperto — evitare diario di perforazione, esplosivi/licenze
e powder factor: già tutti coperti e in gran parte implementati, verificato
in questa sessione) oppure una passata in profondità su un'app (aprire
ogni schermata, premere ogni bottone che produce un file).

## Blocchi
Nessuno.
