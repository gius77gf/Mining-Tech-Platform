# Checkpoint — il controllo che trova da solo la regola scritta due volte

**Commit:** `485bfce` (documento per il fondatore) e `2c12c9f` (il controllo)
**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`

## Che cosa è stato fatto

### 1. Un documento per il fondatore

`docs/LA_STESSA_REGOLA_SCRITTA_DUE_VOLTE.md`, aggiunto all'indice.

Spiega — senza parlare di codice — perché una giornata di sole prove ha
prodotto **tre correzioni di struttura**, e soprattutto **come si
distingue** il caso in cui è un difetto da quello in cui non lo è. Il
criterio, in una frase:

> Se togliendo una delle due copie qualcuno perde qualcosa, non sono la
> stessa regola. Se non perde niente, una delle due è di troppo.

### 2. Il controllo

`apps/deepwork-id/tests/nomi-doppi.mjs`.

`CLAUDE.md` dice da mesi che una regola condivisa vive in `shared/` e le
app la ri-esportano. Era una regola **scritta**, cioè affidata alla
memoria di chi legge — e oggi ne sono uscite **cinque violazioni in un
giorno**, tutte trovate per caso mentre si scrivevano altre prove. È il
segno che la memoria non basta.

Adesso: per ogni nome esportato da più di un modulo dati, o le due cose
sono **lo stesso oggetto** (alias, va bene), oppure devono stare in un
elenco di **divergenze dichiarate con la ragione scritta**.

Una trappola evitata di proposito, e scritta nel file: le **costanti di
testo non si controllano per identità**. Due stringhe uguali scritte in
due file sono `===` lo stesso, e il controllo direbbe «alias» su due copie
vere — cioè risponderebbe «pulito» proprio dove il difetto c'è. Per quelle
si guarda il **sorgente**.

## Due difetti NUOVI, trovati dal controllo appena scritto

Il controllo guarda **12 nomi** e ne trova **4 da sistemare**. Due erano
già misurati (`AVVISO_DECIMALE` in quattro moduli, `AVVISO_MIGLIAIA`), due
sono **nuovi**:

- **`dataPiuGiorni` è scritta identica in Scudo e Sentinella** — e si è
  **già staccata**: su un valore non numerico una risponde `null` e
  l'altra `""`. È il caso da manuale, quello che `CLAUDE.md` descrive come
  *«due copie uguali oggi divergono domani senza che nessuno lo veda»*.
  Ed è la stessa funzione in cui stamattina avevo trovato la trappola
  dormiente del `Number(null) === 0`: **la trappola è in tutt'e due le
  copie**, e portarla in `shared/` la chiude in un colpo solo;
- **`giorni`** è lo stesso involucro di due righe su `giorniTra`, in Conti
  e in Sentinella.

## Il controllo FALLISCE, ed è giusto

I quattro difetti ci sono davvero. Per questo `nomi-doppi.mjs` **non è
ancora in coda alla suite di CI**: ci entra col commit che li corregge.
Metterlo dentro adesso vorrebbe dire o lasciare la suite rossa, o
dichiarare «accettabili» quattro difetti veri — che è il modo in cui una
regola diventa decorativa.

## Stato del giro del browser

Quindicesimo banco su diciannove.

## Prossimo passo atomico

Appena finisce il giro, in un colpo solo:

1. `messaggioNumero` e le due frasi degli avvisi → nello shell, con le app
   che **ri-esportano** (script pronto e con le ancore già verificate:
   `scratchpad/numeri-doppi/applica.mjs`);
2. `dataPiuGiorni` → in `shared/`, con il `null` irrigidito lì una volta
   sola;
3. `giorni` → alias di `giorniTra`;
4. le prove di **identità** (`app.X === shared.X`) in `run-kpi.mjs`;
5. `nomi-doppi.mjs` in coda alla suite di CI.

Poi resta: raccogliere il predicato «rilievo elaborato con volume» di
Terra, scritto dieci volte dentro un modulo solo.

## Nessun blocco

Restano aperte le decisioni del fondatore in `DECISIONI_WEEKEND.md`
(punti 5a/5b, 10, 11, 12, 13, 14).
