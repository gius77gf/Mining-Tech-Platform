# Checkpoint — 2026-08-09T13:14:05Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`56d09f0`

## Task completato

**Una classe di stato che non dipingeva niente, trovata esattamente dove
`classi-orfane` dichiara di non guardare.** In Conti
`class="avatar${p.senzaDensita ? " warn" : ""}"` produce `avatar warn`, e Conti
`.avatar.warn` non la dipinge: il foglio condiviso conosce solo `.avatar.sup`.

## La cosa imparata

⛔ **UN'ECCEZIONE DICHIARATA ONESTAMENTE RESTA UN POSTO IN CUI NESSUNO GUARDA —
e questa volta il difetto ci viveva dentro.** `classi-orfane` scrive nella sua
intestazione che *«le classi composte a pezzi non entrano»*. È vero, è onesto,
ed è precisamente l'unico posto dove questa poteva stare: una classe scritta per
intero sarebbe stata presa dal censimento.

⛔ **E IL RIGHELLO HA SBAGLIATO TRE VOLTE PRIMA DI TROVARLA**, ognuna in un modo
già scritto in `CLAUDE.md` — che è il vero risultato di questa unità:
1. **contava i commenti come definizioni**, e il commento colpevole era quello
   che dice alla lettera *«`.avatar.warn` NON È DIPINTA DA NESSUNO»*: citandola,
   la faceva risultare **definita**. Il falso negativo più beffardo possibile;
2. **metteva insieme i fogli di tutte le pagine**, e la `.avatar.warn` di
   Sentinella — che Sentinella dipinge davvero — copriva l'uso in un'altra app.
   **Una classe è dipinta PER PAGINA**: le pagine non si prestano gli stili in
   linea;
3. **la sua regex sull'attributo escludeva per costruzione** proprio le classi
   interpolate, cioè l'unico posto dove il difetto poteva essere. Un censimento
   che filtra via la forma in cui il difetto vive risponde «zero» con la faccia
   della verità.

⚠️ **E scrivendo la spiegazione ho rifatto la trappola che il file avverte**: un
commento HTML **dentro** un template literal non è un commento, è **testo**, e i
suoi backtick e il suo `${…}` chiudono la stringa. Pagina rotta,
`sintassi-pagine` **33/1 in tre secondi**, spiegazione spostata **fuori** dalla
stringa. È la ragione per cui quella prova si lancia prima di committare: costa
niente e ha appena pagato.

## Verifiche
- `sintassi-pagine` **34/0** (era 33/1 col mio errore)
- `giro-node` **34 comandi a posto, 0 caduti** sulla copia del committato
- ⚠️ **rimisurato prima di toccare**: la segnalazione da cui sono partito
  diceva «in `ric-list` da prima di me» — il file era giusto, la riga no, e in
  **Sentinella** quella stessa combinazione è dipinta e sana. Niente entra sulla
  parola dell'agente.

## Deciso e NON fatto, con la misura
**`accorciaVoceTendina` non si sposta in `shared/`.** Le due funzioni non sono
duplicati: quella di Sentinella è un **troncamento generico** a un budget di
pixel misurato (ricerca binaria, punti di codice, puntini); quella di Scudo è
una **decisione di dominio** (non ripetere il tipo del documento nella sua
etichetta). Oggi il secondo consumatore **non esiste**, e la regola del
`shared/` scatta su «serve a due app», non su «potrebbe servire».
⚠️ E il candidato naturale — `#vf-esito` — **non lo crea**: è un'etichetta
nostra, e la si scrive corta come è stato fatto per «— nessun verbale —»,
non la si tronca con i puntini.

## Il giro del browser
**Lanciato alle 13:03:34Z** su una copia di `c6694e7`, con la porta verificata
libera e il contrassegno riletto dal server. ⏱️ È il primo giro che **stampa da
sé quando è partito**: la correzione di stamattina, alla sua prima prova vera.

## Prossimo passo atomico
1. `#vf-esito` di Scudo (201,9 px in 196 a 320): **il mio righello ha fallito
   tre volte** nel provare ad aprire quella modale da solo — `apriVerifica` non
   è globale. Non insistere a mano: **lo misura il giro** che sta girando, con
   la macchina di `modali-dentro` che quella finestra la sa aprire.
2. Leggere il giro quando finisce: `leggi-giro.mjs`, ordine **età → righe «non
   ho guardato» → KO veri**.

## Blocchi
In attesa del fondatore: **`#vf-ente`** (art. 71 c.11) — l'ultima delle sette
tendine; **quali** delle 47 mancanze confermate diventino lavoro; e se
`disponibilitaTurno` debba restare **100%** su un turno chiuso in cui nessuno ha
registrato fermi.
