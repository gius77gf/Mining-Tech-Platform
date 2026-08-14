# Checkpoint — 2026-08-08 18:30 UTC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`6b9d419` — fix(banchi): tre iniezioni di controprova puntavano a codice che
non esiste più

## Che cosa è stato trovato

Una **famiglia nuova**, e il denominatore è misurato: **174 iniezioni in 20
banchi**, **3** che non trovavano più il loro pezzo → **0**.

Una controprova con l'iniezione scaduta **non fa rumore**: il file servito
resta **sano**, il banco «non distingue», e la riga che lo dice — *«1 non hanno
trovato il loro pezzo: la controprova vale meno di quello che sembra»* — sta in
fondo a un registro di cinquemila righe. È la **terza delle cinque cause** di
«non distingue» censite in `CLAUDE.md`: quella in cui non si tocca né la prova
né il codice, si guarda **l'iniezione**.

⚠️ **E la causa di tutte e tre è la stessa, ed è BUONA**: il prodotto è
migliorato e l'iniezione è rimasta indietro. Non è distrazione, è il costo
naturale di un banco che cita il codice **testualmente**.

| banco | cercava | perché non c'è più | adesso |
|---|---|---|---|
| `genesi-numeri-tranquilli` | `const _prov = (_st.fonte==='sito' && …)` | il 03/08 la decisione è passata a `provenienzaPpv`, perché il **foglio stampabile** non ce l'aveva | 7/7 iniezioni, **18** cadute, uscita 0 |
| `core-documenti-che-escono` | la `m` **nuda** dopo il numero | le unità sono state avvolte in `<span class="u">` dal cantiere delle unità sotto le maiuscole | 15/15, **29** cadute, uscita 0 |
| `genesi-foglio-in-cava` | la riga della base PPV scritta per esteso | è diventata la funzione `_ppvBaseHtml`, perché la usano in due | 6/6, **12** cadute, uscita 0 |

Passate **sane** dopo la correzione: `core-documenti-che-escono` **67/0**,
`genesi-foglio-in-cava` **35/35**, `genesi-numeri-tranquilli` **35/0**.

## I due errori del righello, dichiarati

1. **La prima misura dava 6 scadute e tre erano false**, col segno di sempre —
   un difetto identico in tre righe dello **stesso** banco. Leggevo ogni tabella
   come `[cerca, sostituisci]`, e `scudo-disegni` usa `[file, cerca,
   sostituisci]`: il **nome del file** finiva nel posto della stringa da
   cercare. Imparata la seconda forma: 6 → **3**, tutte vere.
2. **Un secondo censimento è stato provato e SCARTATO**, e vale scriverlo
   perché nessuno lo rifaccia: «quali banchi non guardano il modo controprova
   nella riga di uscita» dava **54 su 66** — ma molti invertono il verdetto
   **prima**, dentro `dice()`, e la riga d'uscita non deve nominarlo. Misurava
   la **forma**, non la sostanza. La lista vera la dà il giro.

## E un crollo che era della mia sonda, non del prodotto

`genesi-foglio-in-cava` è morto con uno stack trace durante la verifica: tre
banchi di fila sulla **stessa porta**, e il server del precedente non l'aveva
ancora liberata. Da solo, sulla sua porta: **35/35, uscita 0**. È la trappola
già scritta in `CLAUDE.md` — *prima di lanciare si guarda chi tiene la porta* —
rifatta da me in una sonda usa-e-getta.

## Prossimo passo atomico

`conti-frasi` passata **sana** dà **21 ok, 1 KO** sul codice di oggi: è un
difetto **vero e non ancora identificato**, ed è il prossimo da aprire. Si
rilancia da solo, su una porta sua e con l'uscita completa catturata:

    node apps/deepwork-id/tests/browser/conti-frasi.mjs 8970 > /tmp/.../cf.txt 2>&1

e si legge **quale** asserzione cade. ⚠️ Da lanciare quando il giro grande è
finito, se no dura cinque volte tanto e rischia la porta occupata.

## Sullo sfondo

Il giro del browser su `23712e6` (pid 16814) sta girando: sarà lui a dire quali
delle controprove **non sanno fallire** sul codice di adesso — la lista del giro
vecchio non si tocca, perché attesta venti commit fa.

## Blocchi

Nessuno.
