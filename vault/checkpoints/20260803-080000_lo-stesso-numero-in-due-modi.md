# Checkpoint — lo stesso numero, scritto in due modi

**Commit:** `94af8c8` (DEVELOPMENT) e `e502d5f` (la misura)
**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`

## Che cosa è stato fatto

### 1. I due controlli nuovi entrano nell'elenco delle prove

`copertura-funzioni.mjs` e `nomi-doppi.mjs` erano scritti ma non citati in
`docs/DEVELOPMENT.md`, cioè dove uno va a cercare **come si lanciano le
prove**. Un controllo che nessuno sa lanciare, alla settimana dopo non
esiste — è lo stesso motivo per cui esiste `tutti.mjs` per i banchi del
browser.

### 2. Una misura: lo stesso numero si scrive in due modi

`toLocaleString("it-IT")` **non raggruppa le migliaia allo stesso modo
dappertutto**. Misurato affiancando i due motori, non dedotto:

| numero | Chromium *(il cliente)* | Node *(le prove)* |
|---|---|---|
| 1286 | `1.286` | `1286` |
| 6375 | `6.375` | `6375` |
| 12345 | `12.345` | `12.345` |

Sui numeri di **quattro cifre**, e solo su quelli. È la strategia `min2`
che Node applica di serie: raggruppa solo da cinque cifre in su.

**Non è un difetto del prodotto.** Dentro una pagina gira tutto nello
stesso motore, e l'utente vede «6.375 ore», che in italiano è giusto.

**È un difetto delle prove.** I moduli dati sono importati da tutt'e due —
dalla pagina nel browser e dalle prove in Node — e una loro funzione che
non fissa il raggruppamento **restituisce due stringhe diverse a seconda
di dove gira**. Ed è già successo qui dentro: la prova sulla frase del
tagliando afferma «CAT 320 ha **6375** ore» perché in Node quella è la
risposta, mentre all'utente quella frase dice **6.375**.

Una prova che passa in Node e fallirebbe nel browser blinda una verità che
nessuno vede mai. È la stessa famiglia del difetto delle date: là la
risposta è stata **rilanciare le prove con l'orologio del cliente**, qui è
**togliere l'ambiguità alla radice**.

Sono 63 chiamate in tutto, ma quelle che contano sono le **sette dentro i
moduli dati**: Campo e Sentinella già a posto (con il commento che spiega
perché), restano quattro punti in Flotta, due in Terra e uno nello shell.
Le 56 dentro le pagine girano solo nel browser e sono coerenti fra loro.

Documento: `docs/MIGLIAIA_NODE_CONTRO_CHROMIUM.md`.

## Le tre correzioni sono PRONTE, tutte con le ancore verificate

Tre script in `scratchpad/numeri-doppi/`, ognuno conta le sostituzioni che
fa e si ferma se un'ancora non compare **esattamente una volta**:

1. `applica.mjs` — una sola `messaggioNumero` nello shell, col meglio delle
   due versioni; `AVVISO_DECIMALE` e `AVVISO_MIGLIAIA` esportati da lì; le
   quattro app che li **ri-esportano**;
2. `applica-date.mjs` — `dataPiuGiorni` in `shared/` (e **irrigidita** lì
   una volta sola: `Number(null)` è 0, e «nessun numero di giorni»
   diventava «scade oggi»), `giorni` che diventa alias di `giorniTra`;
3. `applica-migliaia.mjs` — il raggruppamento esplicito nei sette punti.

**Tutte e diciotto le ancore sono state verificate una per una, senza
scrivere niente**: compaiono esattamente una volta ciascuna.

## Stato del giro del browser

Diciassettesimo banco su diciannove.

## Prossimo passo atomico

Appena finisce il giro, in un colpo solo: i tre script, le prove di
**identità** (`app.X === shared.X`), la correzione della prova del
tagliando (che finalmente afferma quello che l'utente vede: **6.375**),
`nomi-doppi.mjs` in coda alla suite di CI, e una regola nuova in
`run-stile.mjs` sul raggruppamento nei moduli dati.

## Nessun blocco

Restano aperte le decisioni del fondatore in `DECISIONI_WEEKEND.md`
(punti 5a/5b, 10, 11, 12, 13, 14).
