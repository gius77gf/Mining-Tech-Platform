# Checkpoint — 2026-08-07 01:12:48 UTC

## Tipo
unit-complete (due unità dopo il checkpoint delle 00:37: l'etichetta e l'elenco
derivato, le classi orfane)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`eb05653` — *Due classi che nessun foglio definiva: quattro bottoni grandi il
doppio e due avvisi che non erano rossi*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|---|---|
| 95 | **l'etichetta falsa + l'elenco deribato blindato** (`dc858f6`) | «25 export, 4 app» → ne preme **32** su **5** |
| 96 | **le classi orfane** (`eb05653`) | **20 orfane su 1158**, 2 difetti veri in Flotta |

## ⛔ Il filo nuovo: *una classe che nessun foglio definisce*
È l'analogo CSS di `chiediDati`, e nasce dalla stessa domanda. Censite le classi
scritte in un `class="…"` **letterale** su tutte e 12 le pagine contro quelle che
i fogli davvero definiscono: **20 orfane su 1158** — rumore basso, e dentro
c'erano difetti veri.

| dove | che cosa | effetto |
|---|---|---|
| **Flotta** `.dw-btn.mini` | 4 bottoni | scritta **identica in cinque app**, mancante nella sesta: bottoni a grandezza piena dove il disegno li vuole compatti |
| **Flotta** `b.bad` | 2 avvisi | misurato: prima `rgb(242,228,237)` = **identico al testo normale**, dopo `rgb(240,94,92)` |
| **Scudo** `.fld` | 9 campi | perdono `gap` e soprattutto `min-width:0` — passato al cantiere che ha il file in mano |
| **Scudo** `.acc` | 10 numeri | dovrebbero risaltare, si disegnano come il testo attorno. La classe vera è `.dw-accent` — passato al cantiere |

## ⛔ E LA PRIMA CORREZIONE NON MORDEVA — la trappola era già scritta e l'ho ripresa
Messa `.dw-btn.mini` in `deepwork-style.css`, il browser continuava a rispondere
**13px**. Non era la specificità: era l'**ORDINE**. `.dw-btn.secondary` dichiara
`font-size:13px` in `dw-app-ui.css` con la **stessa** specificità (0,2,0), e le
pagine caricano quel foglio **dopo**. L'ha risolta `getComputedStyle` in tre
secondi, elencando le quattro regole che toccano quel bottone.
⚠️ Ed è anche il motivo per cui le cinque copie locali funzionavano: il `<style>`
di una pagina viene dopo tutt'e due i fogli condivisi.
Dopo lo spostamento, misurate **tutte e sei** le app: font 11px, padding
6px 12px, `min-height` **44px** — identiche, nessuna regressione.

## ⚠️ Un'etichetta che dichiara più copertura di quella che ha
`csv-dimostrazione` era elencato come «(25 export, 4 app)»: ne preme **32** su
**cinque** e legge 29 file. Il conto è stato **tolto** invece che aggiornato —
riscritto aggiornato, fra una settimana è di nuovo falso. È la stessa famiglia
del «0 modali su 68» che nessuno leggeva, nella versione **rassicurante**.

## Stato delle prove
Prove `node` **2.191**, copertura **660/660**, banchi **116**. Giro `node` 21
comandi, 0 caduti sulla copia, a ogni commit.
⚠️ Correzione al checkpoint delle 00:37: il +1 delle prove è di **`run-stile`**
(291 → 292), non di `nomi-liberi` come avevo scritto a mente. L'ha detto
`numeri-nei-documenti` guardando gli **addendi**, non il totale.

## Che cosa sta girando adesso
**Tre cantieri**: **Scudo** (banco con un dato solo + le due classi orfane),
**Genesi** e **Campo** (i file che ESCONO — «chi decide i numeri di ciò che
esce», la domanda che il 03/08 ha trovato 24 difetti su cinque app e che su
queste due non era mai stata fatta).
⚠️ Tutti e tre avvisati che i fogli condivisi sono cambiati con `eb05653`: una
misura visiva fatta prima è invecchiata.

## Prossimo passo atomico
1. **Raccogliere i tre cantieri**, con la procedura di stanotte: indice, verifica
   sulla **copia di ciò che si committa**, banchi lanciati davvero.
2. **Poi**: mettere il censimento delle classi orfane **nei test** (oggi è uno
   strumento in scratchpad, e CLAUDE.md dice che gli strumenti di misura vivono
   nei test). ⛔ Non prima che i cantieri chiudano: l'elenco delle eccezioni
   sarebbe stantio entro un'ora, e ne restano 15 da dichiarare una per una.
3. **I 4 CSV di Scudo senza il marchio della dimostrazione** (fra cui il
   registro infortuni): misurato, non corretto, e il file è del cantiere.
4. **Le 19 decisioni scadono oggi, venerdì 07/08.**
5. Le due proposte del DDT (*porto*, *aspetto esteriore*): buone come **prassi
   commerciale**, mai come obbligo di legge.

## Code aperte, dichiarate
- `.dw-btn.mini` resta duplicata nel `<style>` di **Scudo** e **Campo**: i due
  file hanno cantieri dentro, e la copia locale vince (misurato: 11px lo stesso).
  Va tolta quando i cantieri chiudono.
- I **4 CSV di Scudo** senza marchio della dimostrazione.
- In **Scudo** restano 25 ternari del singolare a mano: non sono difetti.
- La tendina `#ppv-scelta` di Sentinella, il **7,5%** del motore dei grafici, il
  **minimo di visibilità** che appiattisce i valori piccoli, `.meta.pesa` di
  Conti: tutti misurati, dichiarati, non corretti.

## Blocchi
Nessuno.
