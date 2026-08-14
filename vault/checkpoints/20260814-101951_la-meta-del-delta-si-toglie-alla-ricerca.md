# Checkpoint — 2026-08-14 10:19 UTC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit di questo tratto
- `408cf9bc` — il censimento sovrastimava del 16%, e il numero onesto è 304
- `c22fe107` — `shared`: `tagliaA` spezzava un carattere a metà
- `2233fab5` — ricerca: che cosa chiede un ispettore, e la **quarta** mancanza falsa
- `f3a22bdf` — CLAUDE.md: **la metà del delta si toglie alla ricerca**

## Che cosa è stato completato

**`tagliaA` in `shared/dw-grafici.js` spezzava una coppia surrogata a metà**:
`'Fronte 🚧 Nord'.slice(0,8)` dà `"Fronte \ud83d"`, mezzo carattere che il
browser disegna come il rombo col punto interrogativo. Era **la terza copia** del
taglio, e quella sbagliata stava proprio nel posto **condiviso** — la copia di
Sentinella lo faceva già giusto. **Latente**, e dichiarato tale: 56 testi della
dimostrazione, 27 tagliati, **zero** con mezzo carattere.

**Il censimento ha finito di muoversi: 269 → 370 → 304.** La terza volta nel
verso opposto — la destra combaciava con l'iniziale di `String(`, `Math.`,
`IC.altro` e li contava come costanti: **58 su 362, il 16%**.

## ⛔ La decisione che vale più delle tre unità
**Quattro ricerche di fila hanno consegnato una mancanza FALSA**, e la quarta
l'ha fatto **dopo** che il mandato le elencava per nome le tre precedenti, con
gli esempi. Quindi il vincolo scritto — *«per ogni "non c'è" incolla il comando e
la sua uscita»* — **non protegge**: un comando incollato che cerca la parola
sbagliata è una prova a favore.
`near-miss` (è un `tipo` dentro `infortuni`) · `safety stock` (è
`propostaScorte`, e la formula era **citata nella metà 1 della ricerca stessa**)
· `modello A` (la pagina scrive «dichiarazione annuale») · `periodicità
standard` (il campo è `periodicitaGiorni`, con valori veri nella dimostrazione).
**Zero su quattro entrate in roadmap**; riverificarle è costato **un minuto per
riga** contro centinaia di migliaia di token spesi a produrle.
⚠️ La causa non è la pigrizia: **il delta chiede una cosa che un agente di
ricerca non può avere** — sapere come *questa* casa chiama le cose.
**Dal 14/08 la ricerca consegna solo la metà sul MONDO**; il delta lo fa chi ha
il codice in mano, partendo dal **meccanismo** (*chi calcola quanti pezzi
ordinare? chi decide quando una verifica è scaduta?*), aprendo le funzioni invece
di cercare un nome. La ricerca può dare al delta **la domanda, non la risposta**.

## Le misure
`run-kpi` **2305**, prove **2.761**, giro `node` **35 comandi a posto, 0
caduti**, **3.133** asserzioni, banchi **200**, copertura app **755/755**, CI
verde.

## Che cos'è vivo
- **Quarto giro mirato** dalle 10:05 su `b3071796`: 48 passate (Campo, Scudo,
  Sentinella, Genesi, più la finestra di caricamento).
- **Due cantieri**: i ripieghi con la forma larga su **Campo, Scudo,
  Sentinella** (le tre app mai censite così) e i **57 del core** (classificazione
  + piano per ciò che vuole il browser).

## Prossimo passo atomico
Raccogliere i due cantieri, poi **leggere il quarto giro** con
`browser/leggi-giro.mjs` — è il primo che misura le quattro app dopo le
correzioni di stanotte. Il candidato più forte che resta è **i comandi morti
dentro la finestra di caricamento**: premuto «Aggiungi» non succede niente,
nessun toast, nessun errore. È la famiglia di `chiediDati` e vuole una decisione
su *che cosa* deve dire la pagina.

## Blocchi
- **Force-with-lease sul ramo**, **B0-septies**, le **soglie di sicurezza** e
  **`dRecFreq` intero all'ingresso**: fermi al fondatore.
