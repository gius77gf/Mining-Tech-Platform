# Checkpoint — 2026-08-08T00:52:57Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`db04ac5` — *Sentinella: i due trattini del report che dicevano «niente da segnalare»*

## Che cosa è stato completato

Giudicati **uno per uno** gli otto «—» del report ambientale di Sentinella — il
foglio che va a un **ente**. Contarli non serviva a niente: la domanda è sempre
la stessa, *questo trattino dice «non serve» dove la verità è «nessuno l'ha
misurato»?*

| quanti | dove | verdetto |
|---|---|---|
| **6** | colonna «Ora» delle letture | **giusti** — il prodotto dichiara l'ora **facoltativa** fin dall'import (`Ora (facoltativa)`): assenza prevista, non mancanza |
| **1** | cella **SD** delle volate | ⛔ difetto |
| **1** | **superamenti** di un punto senza soglia | ⛔ difetto |

**1. La cella SD smentiva il paragrafo sopra di sé.** Quel paragrafo dice, a
parole: *«le caselle marcate "non dichiarato" non sono zeri: sono valori che
nessuno ha registrato, e senza di essi la distanza scalata (SD) non si
calcola»*. E poi la cella scriveva **«—»**, in mezzo a una colonna di numeri,
dove si legge «niente da segnalare». Tutte le altre celle della riga passano da
`cellaVolata` e marcano «non dichiarato»: era **l'unica rimasta con la copia
debole**, ed è quella che dipende da tutte le altre.

**2. I superamenti senza soglia.** «letture 6 · massimo 42,1 · media 22,0 ·
superamenti **—**». Il commento del codice diceva già che «superamenti: 0»
sarebbe stata una cifra tranquilla ricavata dal nulla — ma il rimedio scelto
allora era **un trattino**, cioè la stessa cifra tranquilla in un altro
vestito. La ragione c'è ed è scritta bene (il riquadro `senza-soglia`), ma sta
**dopo**, e questa riga la si legge per prima.

Adesso: «non calcolabile» e «non calcolabili: nessuna soglia».

## Il banco, col denominatore

`stampe-fs.mjs` ha una riga nuova che **non conta i trattini, li divide**:
*«nessun trattino "—" fuori dalla colonna Ora»* più, stampato accanto, *«6
trattini nella colonna Ora, facoltativa dichiarata all'import»*. Così un terzo
trattino che nascesse **dove serve una ragione** si vedrebbe, e i sei legittimi
non fanno rumore.
**Controprova**: rimessi tutt'e due i trattini (insieme, non uno solo — se no
l'altro reggerebbe e la controprova direbbe «non distingue» per il motivo
sbagliato) → **4 trattini fuori posto**, il banco cade. 6 difetti rimessi, **0
iniezioni mancate**.

⚠️ E il primo conto, «10 trattini», comprendeva **due cifre del riquadro fuori
dal documento**: dentro `#rep-doc` sono otto. Il numero era giusto, la frase
intorno più larga — la famiglia dell'etichetta più larga del suo numero, per la
quinta volta in due giorni.

## Prove

Giro `node`: **23 comandi, 0 caduti**, sulla copia di quello che si committava.
`stampe-fs --solo=sentinella`: 12 su 12. Documento aggiornato con la tabella
dei verdetti (`docs/I_FOGLI_CHE_NESSUN_BANCO_PREME.md`).

## Prossimo passo atomico

⛔ **Raccogliere il giro del browser** (`scratchpad/io-core/giro-5.txt`, pid
7002, porta 8823) **e rilanciarlo sul commit corrente** — quello in corso parte
da un `HEAD` di oltre quaranta commit fa, quindi il suo verde non riguarda
quello che c'è adesso. Ordine: prima le righe **«non ho guardato»**, poi i KO,
distinguendo le controprove (l'intestazione lo dichiara).

Poi:

- ⏱️ **La stessa domanda sui riferimenti in `nomi-liberi`**, non solo sulle
  chiamate: un `const x = pippo` con `pippo` inesistente non lo vede nessuno.
  Dichiarato nell'intestazione dalla prima stesura e **mai misurato**. Prima di
  scriverlo: **contare gli allarmi su una copia**, perché lì il rumore atteso è
  molto più alto che sulle chiamate.
- ⏱️ **Gli altri fogli, con la stessa domanda dei trattini.** Oggi la riga nuova
  di `stampe-fs` guarda **solo** il report di Sentinella. Flotta, Conti, Terra e
  Scudo hanno le loro tabelle e i loro «—», e il giudizio va fatto **foglio per
  foglio**: un trattino legittimo in un'app non lo è in un'altra, e una regola
  unica li appiattirebbe.

## Blocchi
Nessuno.
