# Checkpoint — 2026-08-07 00:09:03 UTC

## Tipo
unit-complete (tre unità: il banco delle unità cieco sulla tonnellata, Scudo,
e i tre cantieri raccolti dopo il riavvio del contenitore)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`912a8b3` — *Flotta, Campo e Sentinella: due banchi nuovi che aprono la pagina
con UN dato solo — e due id inventati dal banco*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|---|---|
| 89 | **`unita-maiuscole` vede la `t`** (`65df01b`) | controprova **1/33 → 35/35** |
| 90 | **Scudo · il testo** (`4c323eb`) | una copia debole di `conta`, **3** nomi che la ombreggiavano |
| 91 | **Flotta, Campo, Sentinella** (`912a8b3`) | **24** frasi in Flotta, banchi **112 → 116** |

## ⛔ Il riavvio del contenitore ha ucciso tre cantieri, e il lavoro era sul disco
Nessun agente ha consegnato il suo riepilogo: c'erano solo cinque file
modificati e due banchi non tracciati. Raccolti a mano, e la sequenza che serve
a chi si trovasse di nuovo qui:
1. **`sintassi-pagine.mjs`** per primo — una scrittura interrotta a metà lascia
   un `<script>` rotto e nessuna suite `node` se ne accorge. 15/15 a posto;
2. giro `node` completo — 21 comandi, verde;
3. i banchi nuovi **lanciati davvero**, che è dove sono usciti i difetti.

## ⛔ La lezione della giornata, alla sesta occorrenza: *sbaglia il controllo, non il prodotto*
Cinque volte oggi, e stavolta tre nello stesso pomeriggio:

| chi accusava | che cosa diceva | la verità |
|---|---|---|
| `unita-maiuscole` | «nessuna unità in maiuscolo» | era **cieco**: la `t` nuda non era in elenco mentre «LORDO (T)» era sul DDT |
| `flotta-frasi-da-uno` | «il bottone di export dei ricambi **è assente**» | l'id vero è `btn-ric-export`, la frase la pagina la scriveva già giusta |
| `flotta-frasi-da-uno` | «misurato su 1 ora di lavoro» mancante | l'elemento è `#rif-list`, non `#rif-mezzi` |
| **il mio `grep`** | «`conta` non è importato in Campo → la pagina muore» | è importato a riga 1115: cercavo `conta,` e lì c'è `conta }` |

Un id inventato **costa quanto un difetto vero**, perché manda a cercare dove
non c'è niente. E il quarto caso è il più istruttivo: ho quasi scritto che
Campo era rotta, sulla parola di una mia riga di `grep`.

## ⛔ E LA CONTROPROVA SI MISURA ANCHE NELLA COPERTURA
`unita-maiuscole` sporcava la pagina con **una** unità sola (`12 m³`) e chiedeva
«hai visto qualcosa?». Saper fallire su una su trentatré non dice niente sulle
altre trentadue — **ed era esattamente il caso**. Adesso inietta una riga per
ogni unità e stampa `35/35`.
Le due misure sono state fatte **prima** di cambiare, su una copia di `HEAD`:
col difetto vero di Conti rimesso, elenco vecchio **0** violazioni ed elenco
nuovo **2**; su 14 superfici sane, **0** falsi allarmi.

## ⚠️ `suite-collegate` era verde su due banchi non registrati
Conta i soggetti con `git ls-files`, e i file **non tracciati** non li vede. È
la trappola già scritta per le worktree, ritrovata sull'albero vivo. Il numero
che l'ha detto è arrivato dopo, da `numeri-nei-documenti` **sulla copia**: 112
banchi dichiarati contro 116 elencati.

## Stato delle prove
Prove `node` **2.190** (run-kpi 1787, stile 291), copertura **660/660**, banchi
del browser **116**. Giro `node` 21 comandi, 0 caduti sulla copia di ciò che si
committa, a ogni commit. Scatti guardati: 8, su Campo, Flotta, Scudo e
Sentinella, nessun errore di pagina.

## Prossimo passo atomico
1. **Le 19 decisioni scadono OGGI, venerdì 07/08.** Se non arriva risposta si
   procede con la colonna «la mia risposta» di `docs/DECISIONI_WEEKEND.md`,
   **dichiarandolo nel commit**; restano ferme le 6 che richiedono il fondatore
   (3 di sicurezza, 3 che vogliono il suo account).
2. **La ricerca sul DDT** (`docs/RICERCA_CONTINUA_CONTI.md`, le parole di un
   documento di trasporto di cava, con le fonti) era lanciata quando il
   contenitore si è riavviato: **va rilanciata**. Niente entra in roadmap sulla
   sua parola.
3. **Un banco che apre Scudo con un dato solo**: è l'unica delle sei app dove il
   filo del testo è stato chiuso leggendo il modulo e non rendendo la pagina.
4. ⚠️ **Dubbio da misurare, non da dichiarare**: `nomi-liberi.mjs` stampa
   «nessun nome chiamato che non esiste **da nessuna parte**». Se la domanda è
   davvero globale, un nome usato in una pagina che non lo importa passerebbe —
   ma esiste anche `import-esistenti.mjs`, e i due insieme potrebbero già
   coprirlo. **Va misurato prima di chiamarlo buco.**

## Code aperte, dichiarate
- In **Scudo** restano 25 ternari del singolare scritti a mano: non sono
  difetti (sono `=== 1` su `.length`) e diversi non sono convertibili
  meccanicamente. Dichiarati invece che nascosti dietro un «convertito tutto».
- Su **Scudo** il banco delle modali apre 2 modali su 34: «pulita» è vero su due.
- La tendina `#ppv-scelta` di Sentinella taglia un'opzione: dichiarata, non corretta.
- Il **7,5%** del motore dei grafici e il **minimo di visibilità** che appiattisce
  i valori piccoli fra loro: misurati, dichiarati, non corretti.
- In **Conti**, `.meta.pesa` taglia 15 px su 1 riga DDT su 5: accettato e misurato.

## Blocchi
Nessuno.
