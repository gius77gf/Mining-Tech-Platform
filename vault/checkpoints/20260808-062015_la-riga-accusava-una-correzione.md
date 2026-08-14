# Checkpoint — 2026-08-08T06:20:15Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`3a2fc27` — *core-documenti: la riga accusava il prodotto per una CORREZIONE
del prodotto*

## Che cosa è stato completato

Secondo KO del giro, chiuso. L'asserzione portava dentro **due numeri e una
parola** — `/56/` e `/su 12/` — e tutt'e tre sono invecchiati.

Il «su 12» non c'è più perché la frase è cambiata **di proposito**: `f108ef0`
(*«l'elenco delle volate era la quarta copia debole: "0 mc" dove nessuno aveva
misurato»*) l'ha riscritta in «12 fori · almeno 56 kg · 1.240,3 mc», e la forma
nuova sta scritta nel commento del core (`index.html:621`).

> Il banco accusava il prodotto per una **correzione** del prodotto — e per
> giunta una correzione fatta in nome del **principio del fondatore**, che è
> l'ultima cosa che un banco dovrebbe ostacolare.

⚠️ E il `56` era **peggio** del «su 12»: un numero atteso scritto a mano
invecchia col crescere della dimostrazione. **Quattro righe più in basso questo
stesso file fa già la cosa giusta** — *«i due numeri si prendono dai due posti e
si confrontano, invece di scriverne uno»* — e infatti `kgSchermo` lo ricava
dalla frase. La riga sbagliata stava **sopra** quella giusta.

## La correzione

Adesso si prova il **significato**: che la riga dica **quanti fori** sono, e che
quando il totale è parziale lo **dichiari** con «almeno» invece di spacciarlo
per completo. I numeri li confronta il confronto, non questa riga.

## Provato che distingue, su cinque casi

- cade se manca la **riserva** (un parziale spacciato per completo);
- cade se manca il conto dei fori;
- cade se mancano i kg;
- ✅ e **accetta anche la frase vecchia** — cioè non ho pinnato la nuova al
  posto di quella vecchia, che sarebbe stato rifare lo stesso errore al
  contrario.

## Prove

- `core-documenti-che-escono`: **67 passate, 0 cadute** (era 66 e 1).
- Giro `node` sulla copia di quello che si committava: **23 comandi, 0 caduti**.

⚠️ **Il prodotto non è stato toccato**, per la seconda unità di fila.

## Lo stato dei KO del giro

| KO | esito |
|---|---|
| `il foglio di fine turno di Campo` (×2 passate) | **chiuso**: i soggetti del modo erano tre |
| `i documenti che escono dal core` | **chiuso qui** |
| `unità in maiuscolo` — terra, «Volume rimesso per il recupero (m³)» | ⏱️ **aperto**, e tocca la **pagina** di Terra: va fatto a giro fermo |

## In volo

⏳ Il **giro del browser**, porta **8823**, pid 28054, oltre tre ore e mezza.
Il registro non ha ancora scritto la riga d'uscita.

## Prossimo passo atomico

⛔ **Raccogliere `giro-7.txt` appena finisce**, con
`node apps/deepwork-id/tests/browser/leggi-giro.mjs <registro>` — e rileggere
**prima** le 49 righe «non ho guardato», che finora ho solo sfiorato: fra
quelle c'è il denominatore del banco del contrasto (su Genesi **120 classi con
un fondo proprio non sono mai comparse**, 13 fatte comparire) e due app che
«copiano negli appunti ma non hanno una riga in COME».

Poi, a giro fermo (tocca le pagine):
1. ⏱️ **«unità in maiuscolo» in Terra** — l'ultimo KO aperto;
2. ⏱️ **togliere le 59 righe inerti** (import mai usati) e portare la quinta
   domanda di `nomi-liberi` a regola.

## Blocchi
Nessuno.
