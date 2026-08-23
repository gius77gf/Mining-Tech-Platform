# Checkpoint — 2026-08-23T13:10:47Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
9ea01047 — «La sezione chiara, e il righello che l'ha accusata due volte a torto»

## Che cosa è stato completato

1. **La sezione chiara**, approvata dal fondatore il 23/08. «Le app si parlano»
   è una fascia chiara a tutta larghezza fra due sezioni scure — nella pagina
   vera e nelle tavole della tela. Il ponte fra due app non è più una freccia
   di testo: è un tratto disegnato dal colore della prima a quello della
   seconda, con una scintilla che lo percorre.
2. **Le immagini di cava**: cercate, guardate e scartate (sotto).

## Le tre lezioni, che valgono più del lavoro

⛔ **UNA FASCIA DIPINTA DA UNO PSEUDO-ELEMENTO È INVISIBILE A CHI CERCA IL
FONDO.** `getComputedStyle(a).backgroundColor` risalendo gli antenati non la
trova mai e finisce sul nero del corpo: **tre accuse di contrasto false**, fino
a 1,08:1 su un titolo che dal vero fa 14:1 — e lo stesso errore lo avrebbe
fatto `tests/browser/contrasto.mjs`. Una fascia a tutta larghezza si fa **coi
margini negativi**, sull'elemento vero.

⛔ **CHROMIUM RESTITUISCE I `color-mix()` COME `color(srgb 0.96 0.93 0.88)`,
COI CANALI DA 0 A 1.** Un lettore che li divide per 255 li rende quasi neri e
accusa un contrasto di **1,00**. La risposta era **già in casa**: il commento
di `contrasto.mjs` la chiama «SETTIMA TRAPPOLA, E LA PIÙ COSTOSA DI TUTTE».

⚠️ **IL PRODOTTO AVEVA RAGIONE E LA TAVOLA TORTO.** I titoli delle schede
uscivano in maiuscolo nella pagina e in tondo sul disegno: a deciderlo è
`.dw h1, .dw h2, .dw h3` in `shared/deepwork-style.css` — trovato **chiedendo
al browser quali regole colpiscono l'elemento**, non col `grep`, che lo aveva
mancato perché il selettore sta su una riga con altri tre. Ho allineato la
tavola, non il prodotto.

## Le immagini: cercate, guardate, scartate

Otto ricerche su Wikimedia Commons — l'unica fonte raggiungibile con licenza
verificabile una per una (Pexels, Pixabay e Openverse rispondono **403**):
**147 file distinti, zero termini non guardati**, 53 dopo aver tolto mappe e
disegni, **24 scaricate e guardate** su un foglio di provini. Nessuna regge.
⚠️ **Commons è un archivio enciclopedico, non una banca di immagini
commerciali** — da ricordare prima di rifare la stessa ricerca.
⚠️ E il righello ha mentito due volte: la prima ricerca ha risposto **«0
candidati»** perché l'API dava `429`, e il servizio delle miniature dà **400**
a questo indirizzo mentre gli **originali** scaricano benissimo
(`.../commons/4/43/Nome.jpg` invece di `.../commons/thumb/4/43/Nome.jpg/800px-…`).

## Misure

- Sezione chiara: **0 testi sotto soglia su 40**, a 1280/430/390/320 px;
  6 fili e 6 scintille; nessuno scorrimento laterale; nessun errore di pagina.
- Contrasti scelti col numero: testo 14,11:1 · attenuato 8,87:1 · ambra
  profonda **5,29:1** (con #a86f00 era 3,72, sotto soglia) · bianco sull'ambra
  6,06:1.
- Giro `node` **sulla copia di ciò che si committa**: **37 comandi a posto,
  0 caduti**. Documenti: 43 passati, 0 falliti.

## Prossimo passo atomico

**Mettere i sorgenti della tela dentro il repository.** Adesso vivono in
`scratchpad/tela/` e se il contenitore si ricicla si perdono: cinque
`.dc.html`, `canvas.json` e i cinque `.woff2`. I `.dc.html` portano dentro
~110 KB di caratteri in base64 ciascuno, quindi NON si committano così: si
committano **senza** i caratteri, insieme ai cinque `.woff2` (109 KB in tutto)
e a uno script che li inietta prima di seminare. Cartella proposta:
`docs/tela-vetrina/`.

## Aperto, in attesa del fondatore

**La fotografia di cava.** Le due strade proposte: (1) foto sue, anche da
telefono — serve il fronte con luce bassa; (2) la roccia come **materia** e non
come soggetto, cioè un dettaglio molto scurito come texture dietro l'apertura,
per cui bastano diverse delle 24 già scaricate.
