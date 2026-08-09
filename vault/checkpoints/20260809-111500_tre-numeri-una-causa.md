# Checkpoint — 2026-08-09T11:15:00Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`fa8026d`

## Task completato

**Le mancanze confermate del delta sono 47** — e il controllo che avevo scritto
un'ora prima ne diceva **41**.

| stesura | numero | causa dell'errore |
|---|---|---|
| 07/08 | **42** | cercava la parola nel **file**: prendeva un'intestazione di sezione |
| 09/08, mattina | **41** | cercava la forma **in grassetto**, che usano 5 documenti su 6: Scudo scrive `CONFERMATA` liscio → contava **zero** |
| 09/08, adesso | **47** | il verdetto **comincia** con «CONFERMATA» ed è **maiuscolo** |

## Le tre cose imparate

1. ⛔ **TRE NUMERI IN UN GIORNO, UNA CAUSA SOLA: il righello guardava una FORMA
   DI SCRITTURA invece del verdetto.** E la cosa che rende questo caso
   istruttivo è che **la riga di roadmap lo diceva già in prosa** — *«questo
   conto misura una forma di scrittura, non la verità»* — scritta il 07/08 da
   me. L'ho letta, l'ho citata, e poi ho costruito il controllo sulla forma.
   Una regola scritta in un documento non protegge lo strumento che si sta
   scrivendo: va **cercata nel codice che la deve applicare per primo**.
2. ⛔ **È STATA LA SCOMPOSIZIONE STAMPATA A TROVARE L'ERRORE, non un'altra
   verifica.** Il controllo stampa «campo 11 · conti 8 · flotta 5 · **scudo 0**
   · sentinella 13 · terra 4», e quello zero accanto a un documento che nel suo
   riepilogo scrive «Confermate assenti: **6**» è ovvio — mentre due conti a
   mano non l'avevano visto. **Un totale non si controlla da solo; una
   scomposizione sì**, perché ogni addendo ha un lettore che lo conosce.
3. ⛔ **DUE DISCRIMINAZIONI, e servono tutt'e due.**
   · **«comincia con»** e non «contiene»: `⏱️ **A METÀ** — era CONFERMATA,
     colmata a metà` è una mancanza **chiusa**, e il verdetto la nomina solo
     per raccontarne la storia. Con «contiene», Scudo faceva 9 invece di 6.
   · **maiuscolo**: senza, entrava
     `| quando | confermate | false | ⏱️ scadute | a metà | totale |`, cioè
     l'**intestazione** della tabella di riepilogo di Sentinella — la stessa
     famiglia dell'intestazione di sezione di Scudo, in un'altra veste.
   ⚠️ Cioè: le righe che **parlano** dei verdetti si travestono in almeno due
   modi diversi, e nessuno dei due si prende con la parola.

## Quello che cade con questa misura
Lo **zero di Scudo non c'era mai stato**: quel documento è confrontabile con
gli altri cinque, scrive solo il verdetto senza grassetto. Cade con lui il
«prossimo passo» che avevo scritto un'ora fa — *uniformare la tabella di
Scudo* — e resta vero solo che la **ordina** per sezione invece che per
verdetto, il che non tocca il conto.

## Verifiche
- `numeri-nei-documenti` **27 passati, 0 falliti**, con la scomposizione per app
- `giro-node` **34 comandi a posto, 0 caduti** sulla copia del committato

## Il giro del browser
Ancora vivo dalle 07:55Z su una copia di `494863f`; registro oltre le 1.900
righe e in crescita.

## Prossimo passo atomico
⛔ **Il giro, appena finisce, ha la precedenza**: `leggi-giro.mjs` nell'ordine
**età → righe «non ho guardato» → KO veri**; nessun KO diventa cantiere prima
di essere riprodotto **con la sua passata** e **con l'iniezione viva**.
Se non è ancora finito, l'unità sicura successiva è **le 18 righe «⏱️ SCADUTA»
del delta**: sono mancanze che il prodotto ha già colmato, e ciascuna va
riletta per verificare che la riga dica ancora il vero — è lo stesso mestiere
delle 47, dall'altro lato.
⚠️ Adesso che il conto è sorvegliato, chiudere una mancanza **farà cadere** il
controllo finché la roadmap non segue: è il comportamento voluto.

## Blocchi
Nessuno di tecnico. In attesa del fondatore: le **7 tendine tagliate**
(Scudo 5 + Sentinella 2) e **`#vf-ente`** (termine dell'art. 71 c.11).
