# Ultimo ciclo di lavoro automatico

**2026-08-08T12:21Z** · commit di partenza **`ca0a78d`** · branch
`claude/scheduled-tasks-remote-control-bk4ap6`

## Ciclo in corso adesso

Riprendo dal «Prossimo passo atomico» dell'ultimo checkpoint per data VERA di
git: raccogliere il giro del browser lanciato alle ~11:10Z — il primo che
**non può più restare appeso** — e leggerlo con `leggi-giro.mjs`, sezione 1
(«non ho guardato») prima della 2 (i KO). Poi la riga nuova «le tre passate più
lente», che adesso che `vaiA` è ventisei volte più veloce dice se il limite di
trenta minuti è ancora tarato o è diventato una guardia che non scatta mai.
⚠️ Quel giro attesta `c3888fe`: le due unità dopo (i cinque contrasti dei fondi
non coprenti e la lezione in CLAUDE.md) non ci sono dentro.

*(Il paragrafo qui sotto racconta il ciclo precedente.)*

---

**2026-08-08T10:37Z** · commit di partenza **`3b496a8`** · branch
`claude/scheduled-tasks-remote-control-bk4ap6`

## Ciclo in corso adesso

Riprendo dal «Prossimo passo atomico» dell'ultimo checkpoint per data VERA di
git. Il blocco precedente ha chiuso **nove unità** sul filo *«le righe in cui
un banco dichiara quello che NON ha guardato»*: sette unità di misura nude
sotto una classe maiuscola, sei contrasti illeggibili nel core, le tre
pastiglie d'esito che nel tema chiaro diventavano lo stesso viola, il sollecito
di pagamento di Conti che usciva negli appunti senza dichiararsi una
dimostrazione, e trentadue frasi che con «1» dicevano «1 righe».
⚠️ Il giro del browser lanciato alle 03:00Z ha girato **oltre sette ore e
mezza** e attesta un commit **precedente** a tutte e nove: i suoi quattro KO
sono **già chiusi**, e c'è una pagina in `vault/checkpoints/` che lo dice per
impedire che qualcuno riapra un cantiere su difetti che non esistono più.

*(Il paragrafo qui sotto racconta il ciclo precedente.)*

---

**2026-08-08T04:57Z** · commit di partenza **`40640da`** · branch
`claude/scheduled-tasks-remote-control-bk4ap6`

⚠️ **Il contenitore si è riavviato alle ~03:00Z** e ha ucciso il giro del
browser che era in volo. Il lavoro non si è perso — il ciclo riprende sempre
dal checkpoint, non dalla cronologia — ma il riavvio ha lasciato **un server
`python3` vivo sulla porta 8823 per sette ore e cinquantadue minuti**, che
serviva la cartella di un commit vecchio. Il giro nuovo si è **fermato da sé**
(«gli ho chiesto il mio contrassegno e mi ha risposto niente») invece di
misurare la copia di qualcun altro: la difesa scritta in `CLAUDE.md` ha
funzionato alla lettera, e senza di lei avrei letto per due ore i numeri di un
altro programma.

## Che cosa è stato fatto da quel riavvio in poi

Undici unità, tutte con la loro misura e la loro controprova. Il filo è uno
solo e non era quello che cercavo: **gli strumenti che misurano, non il
prodotto misurato.**

1. **Una regex dopo una freccia era letta come una divisione** — nel
   tokenizzatore che sta sotto a **tutte** le regole di stile. 158 casi nel
   repository, 460 tratti, 18.420 caratteri. Latente: nessuna di quelle regex
   contiene una virgoletta, quindi non aveva ancora nascosto niente.
2. **La quarta forma di `nomi-liberi` a zero, e da misura diventa regola** —
   35 → 0, e **nessuno dei sei scalini era il prodotto**.
3. **La stessa domanda anche nei moduli** — 67 allarmi → 0, tutti righello.
4. **La quinta domanda**: un nome importato e mai usato. 990 import, **59
   inerti** — resta misura finché non sono tolti.
5. **I 34 punti di decisione dello strumento**, interrogati uno per uno.
   Nessun buco nuovo: il valore è che da domani non se ne può riaprire uno in
   silenzio.
6. **Le due viste del tokenizzatore devono restare due** — se una finisse per
   comportarsi come l'altra, tutte le regole sui testi diventerebbero cieche
   *continuando a dire «nessuna violazione»*.
7. ⛔ **`sw.js` rotto passava il giro intero.** Misurato: 23 comandi, 0 caduti,
   uscita 0, con un errore di sintassi **duro** nel service worker del core —
   quello che va in produzione a ogni merge. Adesso il giro di casa compila
   anche i **19 moduli a sé stanti**, come fa la CI.
8. ⛔ **Le regole di sicurezza si possono provare QUI, e nessuno lo faceva.**
   Il comando scritto in `CLAUDE.md` non funzionava in questo contenitore e
   dava il numero sbagliato. Sono **68** prove sulla **barriera fra aziende
   concorrenti**, non 58: fermo da tempo perché nessuno le lanciava più in
   casa — sul numero che riguarda la sicurezza.
9. **`giro-sicurezza.mjs`**: un comando solo, 95 casi, che **dichiara sopra il
   riepilogo quello che non ha potuto guardare**.
10. Le lezioni generali portate in `CLAUDE.md`, e **191 `git worktree` morte**
    tolte (3 GB) — una delle quali era proprio quella che il server zombie
    stava servendo.

## In volo adesso

⏳ Il **giro del browser** sulla porta **8823**, uscita in
`scratchpad/io-core/giro-7.txt`, su una **copia di `958018d`** (pid 28054,
contrassegno riletto dal server). È a ~1.300 righe.

## Il prossimo passo

1. raccogliere `giro-7.txt` leggendo **prima** le righe «non ho guardato», poi
   i KO, distinguendo le controprove — lì il rosso è quello **voluto**;
2. togliere le **59 righe inerti** e portare la quinta domanda a regola: è
   lavoro sulle pagine, e va fatto col giro del browser fermo.

## Il filo della settimana

**I numeri che mentono con la faccia tranquilla.** Stanotte il filo si è
spostato di un piano: non i numeri che il prodotto mostra, ma **i numeri che
gli strumenti di misura mostrano di sé**. Un giro che dice «23 comandi, 0
caduti» mentre il service worker non compila; un «58» sulla sicurezza fermo da
settimane; una nota che spiega un totale citando il totale di due settimane
prima. In tutti e tre i casi il numero era tranquillo e non era stato misurato
niente — che è esattamente la stessa cosa che cerchiamo nel prodotto.
