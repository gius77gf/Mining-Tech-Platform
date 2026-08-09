# Checkpoint — 2026-08-09T16:02:57Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`b086c32`

## Task completato

**Due unità, e sono la stessa domanda applicata a due soggetti diversi: quella
riga fa ancora qualcosa?**

| | |
|---|---|
| `.arr` — «tre app d'accordo» | **due su tre erano righe morte** |
| fondi di copertura | **sei rimessi a distanza di uno** |
| il carattere `›` dentro `class="arr"` | dichiarato «52 in sei app», è **14 in una** |

## Le due cose imparate

1. ⛔ **UN RESIDUO E UNA DECISIONE SI SCRIVONO IDENTICI.** La roadmap leggeva
   otto divergenze CSS come un **segnale** che puntava al foglio condiviso:
   *«quando tre app su sei scavalcano la stessa dichiarazione nella stessa
   direzione, il valore sbagliato è quello condiviso»* — la forma esatta del
   caso `.nav button` del tema del sole, dove quel ragionamento era **giusto**.
   Qui è falso, e a dirlo è una misura sola: gli scavalcamenti di
   `font-size:15px` non sono tre ma **quattro** (c'è anche Sentinella), il che
   sembrava rafforzare il segnale — ma in **tre** di quelle quattro `.arr` non
   contiene testo. Le cinque app sono passate a un'icona SVG, dimensionata da
   `--arr-ico` che **ognuna dichiara per sé** (16, 15, 15, 15, 17, 17), e il
   carattere `›` sopravvive **solo in Scudo, 14 volte** — dove il commento in
   `shared/dw-app-ui.css` ne dichiarava **52 in sei app**.
   Quindi quel `font-size` in Flotta, Sentinella e Terra **non tocca niente**:
   sono residui di quando `.arr` era un carattere. E l'unica app che un
   carattere ce l'ha ancora se lo riscrive a 15px, cioè la riga condivisa oggi
   governa **zero caratteri renderizzati**.
   ⚠️ **Le due righe condivise non valgono la stessa cosa, e adesso il commento
   lo dice**: `color:var(--muted)` è **viva e portante** — `.arr svg` dipinge
   con `stroke:currentColor`, quindi è lei a colorare le icone di quattro app —
   mentre `font-size:18px` non governa più nessuno.
   ⛔ **Decisione con la misura invece che con l'impressione: NON si cambia il
   valore condiviso.** Toccarlo avrebbe modificato sei pagine sulla forza di
   **tre dichiarazioni che non fanno niente**. Stessa uscita del `.nav button`.
2. ⛔ **UNA GUARDIA CON VENTI DI MARGINE NON GUARDA.** `copertura-funzioni`
   stampava «(il fondo era 165: alzalo)» a ogni esecuzione e nessuno lo faceva.
   Il mestiere del fondo è accorgersi che una copertura **scende**: con venti
   unità di margine bisogna perderne venti perché dica qualcosa. Rimessi a
   distanza di uno: conti 122 → **130**, scudo 165 → **185**, sentinella
   131 → **133**, terra 61 → **66**, `dw-ponti` 39 → **47**, `dw-shell`
   43 → **47**.

## L'errore mio, e vale scriverlo perché è il terzo della stessa famiglia
⚠️ Scrivendo il commento che spiega la misura ho messo dentro il comando di
verifica, e il comando conteneva `apps/` con la **stellina** seguita da una
barra — che **chiude un commento CSS**. Il commento si è chiuso a metà, il
blocco `.arr` sotto è stato mangiato, e `run-stile` è passato da **318 a 316**.
CLAUDE.md lo dice da giorni («un esempio di codice dentro un commento va scritto
**senza i suoi delimitatori**»), l'avevo appena citato, e l'ho rifatto.
✅ L'ha preso in **tre secondi** il giro di casa, prima del commit — che è
esattamente la ragione per cui quella prova si lancia prima di committare.

## Verifiche
- `giro-node` **34 comandi a posto, 0 caduti** sulla copia del committato, due
  volte (una per unità)
- controprova sul fondo, **fatta e non dedotta**: `conti` portato a 131 → «✗
  conti 130/130 100% SOTTO IL FONDO DI 131», uscita diversa da zero; ripristino
  **da una copia**, `diff -q` pulito
- `copertura` sulla copia: **11 soggetti a posto, 0 con funzioni senza prova**
- il conto del carattere rimisurato per app: campo 0, conti 0, flotta 0, **scudo
  14**, sentinella 0, terra 0

## Deciso e NON fatto, con la misura
- **il valore condiviso di `.arr` non si tocca** (sopra, con il conto);
- **il fondo di `genesi-data.js` non è stato alzato**: un cantiere sta ancora
  muovendo quel numero, e un fondo si alza **dopo** aver visto il conto salire e
  fermarsi.

## Il giro del browser
Vivo dalle **13:03:34Z**, **2h59** quando scrivo, **145 passate su 161**, e sta
ancora scrivendo (432 KB). ⚠️ Attesta `c6694e7` e **non** contiene `--modali`
né `--forzate`.

## Cantieri paralleli aperti
Tre: **Genesi** (MIC «non calcolabile» — ⚠️ è morto per un errore di rete a metà
lavoro e **l'ho fatto ripartire**: aveva lasciato la bandiera `calcolabile` nel
modulo senza nessun lettore, e `run-stile` lo diceva con la **regola 20**, che è
esattamente il difetto per cui quella regola esiste), **Scudo** (`#vf-esito`) e
**contrasto delle finestre a 390 e 320 px**.

## Prossimo passo atomico
1. Raccogliere i tre cantieri, **rimisurare** e committare io. Per Genesi la
   prova che il lavoro è finito è `run-stile` **di nuovo a 318**: finché la
   bandiera non la legge nessuno, il numero non si disegna «non calcolabile».
2. Leggere il giro quando finisce: `leggi-giro.mjs`, ordine **età → righe «non
   ho guardato» → KO veri**.

## Blocchi
In attesa del fondatore: **`#vf-ente`** (art. 71 c.11); **quali** delle 47
mancanze confermate diventino lavoro; e se `disponibilitaTurno` debba restare
**100%** su un turno chiuso in cui nessuno ha registrato fermi.
