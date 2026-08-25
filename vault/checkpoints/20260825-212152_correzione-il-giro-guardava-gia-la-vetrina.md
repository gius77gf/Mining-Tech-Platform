# Checkpoint — 2026-08-25T21:21:52Z

## Tipo
correzione

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
0c56b623

## Che cosa correggo, e di chi è l'errore
**Mio.** Nei due checkpoint precedenti ho scritto, come «prossimo passo
atomico», questa riga:

> «il giro del browser non è mai stato lanciato contro `apps/index.html` — i
> suoi banchi navigano e premono, e la vetrina non ha sezioni `.page`, quindi
> o si dichiarano le sue superfici o restano fuori dichiarate»

**È falsa.** `['vetrina', '/apps/index.html']` sta in
`browser/giro.mjs` — l'elenco che dichiara la copertura di **tutti** i banchi
del browser — dal commit `fb2001f4` del **30 luglio**, cioè da quasi un mese.
E c'è anche un banco dedicato, `browser/vetrina-collegamenti.mjs` (17 KB, tre
passate nel giro).

Non l'avevo cercato: l'avevo dedotto. È la regola già scritta —
**«la risposta è quasi sempre già in casa, si cerca prima di inventare»** — e
la sua forma più cara, perché **una riga di roadmap che propone un lavoro manda
qualcuno a farlo**. L'ho scritta due volte.

## E c'è di peggio: ho ricostruito due domande che esistevano
`vetrina-collegamenti.mjs` pretende, per ogni riquadro:
1. il collegamento punta a un file che esiste (non 404);
2. la pagina che si apre monta **davvero** qualcosa — non basta il 200;
3. da lì si torna alla vetrina con un comando visibile.

Le prime due sono **le stesse** che ho scritto oggi in `tour-aperto.mjs`. La
terza lì non c'è.

## Perché `tour-aperto` resta lo stesso (dichiarato, non spacciato per nuovo)
Due cose che nel giro non ci possono stare:
- gira in **secondi** dentro `costruisci.sh`, quindi a **ogni build**; il giro
  del browser dura ore e si lancia una volta per blocco;
- sa puntare al **sito vero** (`--base`), l'unico posto dove si vedono le
  riscritture di Netlify — e il giro non ci arriva, perché da questo
  contenitore il browser non esce di rete (misurato: `ERR_CONNECTION_RESET`
  con il proxy passato in tre modi, e il proxy non registra il tentativo).

Davvero nuova è solo la **quarta** domanda: *si può premere col dito?*
L'overlap è ora scritto in cima a `tour-aperto.mjs`, con la regola su chi
comanda quando le due divergeranno (l'originale).

## La lezione, oltre al caso
⛔ **Un «non c'è» sul PROPRIO repository si prova come quello di un agente di
ricerca.** Le istruzioni pretendono la prova per un «non c'è» che viene da
fuori; io l'ho scritto di mio pugno, su casa mia, e non me la sono chiesta.
Il comando che lo smentiva costava dieci secondi:
`grep -n vetrina apps/deepwork-id/tests/browser/giro.mjs`.

## Stato roadmap
Vetrina online (#341 unita). #342 aperta e in attesa di CI.

## Prossimo passo atomico
**Nessun cantiere sulla copertura del giro: c'è già.** Quando la #342 è verde,
unirla e rimisurare la produzione con
`tour-aperto --base https://deepworksic.netlify.app/apps/`.
Poi, se serve un passo vero: lanciare il giro del browser **filtrato** sulla
sola vetrina (`--solo=`) contro la pagina nuova, che è cambiata oggi — la
copertura esiste, ma nessuna passata è girata **da quando la pagina è quella
nuova**. Questa è l'affermazione vera; quella di prima non lo era.

## Blocchi
Nessuno.

## ⛔ E scrivendo questo checkpoint ho rifatto la trappola dei backtick
L'ho scritto con un heredoc **non quotato** (`<<EOF` invece di `<<'EOF'`),
quindi la shell ha eseguito i backtick come sostituzione di comando. Uscita:
`tour-aperto: command not found` — e nel file, al posto del nome, **un buco**:
«## Perché  resta lo stesso».

Il file **non fallisce**: si scrive, mutilato, e il commit passa. È
letteralmente la regola già scritta in CLAUDE.md per i messaggi di commit
(`git commit -F <file>`, mai `-m` fra virgolette), in una veste che quella riga
non copre: **non è il comando `git`, è l'heredoc**. Un testo di questa casa
contiene quasi sempre codice fra backtick, quindi il delimitatore si quota
**sempre**: `<<'EOF'`.

⚠️ E a prenderlo non è stata la rilettura — la riga mutilata si legge quasi
bene — ma **l'errore stampato dalla shell**, che stava sopra l'uscita del push
e che stavo per scorrere. Un comando che «riesce» stampando un errore in mezzo
è la stessa famiglia dello script che non fallisce.
