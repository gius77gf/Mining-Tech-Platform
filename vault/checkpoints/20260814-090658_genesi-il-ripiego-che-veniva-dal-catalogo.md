# Checkpoint — 2026-08-14 09:06 UTC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit di questo tratto
- `98c672a5` — il censimento spacca `Math.max(0, …)` in due: da 6 a 38
- `869b9b69` — i due KO veri del giro erano tutt'e due del BANCO
- `2e04126c` — canarino (il ciclo è vivo alle 08:58, dopo il limite di sessione)
- `60bc3530` — Genesi: il ripiego veniva da un CATALOGO che dichiara di non avere
  quel dato

## Che cosa è stato completato

**Genesi — 119 ripieghi classificati uno per uno, e i numeri tornano**: 76 al
momento del calcolo, 17 di disegno, 13 che **non sono ripieghi** (OR booleani), 13
riletture legittime. Dei 76: **12 provati morti** coi cataloghi in mano, **8
vivi**, 9 di un cantiere già aperto.
⛔ **E il filo è NUOVO**: il dato non manca perché l'utente non l'ha scritto —
manca perché il **catalogo dichiara di non averlo** (`innesco-nonel` ha
`densita_gcc: null` e `rws_pct: null`, di proposito). Il modulo l'assenza la
sapeva già raccontare: **non ci arrivava mai**, perché la pagina riempiva il buco
un piano più su.
Le tre correzioni: **58 kg/foro** dove il vero è «non calcolabile» (e da lì
passano MIC, carica totale, consumo specifico, CSV, foglio, PPV); la chiave
`fratturata` **che in nessuna tendina è mai esistita**, per cui la riga stampava
«roccia fessurata» accanto ai numeri di «media»; e `D2.ucs || 100`, dove **100 è
l'UCS del calcare** — `kf` entra al quadrato, quindi la gittata dichiarata era
**1/1,63 del vero su granito e 1/2,30 su basalto**, e lo sgombero è il doppio
della gittata. ⛔ Nessuna soglia toccata.

**I due KO del giro erano tutt'e due del BANCO**, riverificati prima di
correggere: una frase cambiata **per una ragione buona** (l'intestazione non è
una perdita, quindi non si dice) e un'attesa scritta a mano che **cambia sei
volte in 68 giorni** — ora derivata dalla stessa funzione che chiama la pagina.
Le asserzioni sono uscite **più severe**: da 1 singolare a 4.

**Il censimento ha spaccato `Math.max(0, …)` in due**: quasi tutti sono clamp;
la sottrazione fra due insiemi è **38 su 165**. ⛔ E **il righello ha sbagliato
due volte prima di reggere** — il numero è passato da **6** a **38**, cioè la
prima misura era una sottostima di sei volte, e a dirlo è stata la **controprova
scritta dentro lo strumento**, non la rilettura.

## Il giro del browser, tre volte di fila in fondo
`0h47` (21 passate, 0 KO veri) · `0h36` (36 passate, 2 KO, tutti e due del banco)
· `0h50` (19 passate, **0 KO veri**, dopo le correzioni di Terra e `shared/`).
Prima di B10 non arrivava mai in fondo: 198 passate = 13,5 ore.

## Le misure
`run-kpi` **2283**, prove **2.739**, giro `node` **35 comandi a posto, 0
caduti**, **3.110** asserzioni, copertura app 753/753.

## Che cos'è vivo
- **Un cantiere** sulle **38 sottrazioni fra due insiemi** (Conti, Flotta,
  Terra), ripreso dopo il limite di sessione: il suo lavoro è sul disco e le sue
  ultime due prove erano rosse **per una fixture indovinata sua**.
- ⚠️ Alle 08:24 la piattaforma ha dato **«You've hit your session limit · resets
  8:40am»** e ha ucciso due cantieri. È l'unico stop legittimo, e il ciclo è
  ripartito col canarino alle 08:58.

## Prossimo passo atomico
Raccogliere il cantiere delle **sottrazioni** quando consegna — indice da HEAD
più il solo suo blocco, verifica sulla copia — e riaprire i cantieri in
parallelo. Poi **B6** (la finestra di caricamento: «sto caricando» non è «non
c'è»), che vuole il browser: adesso che i giri mirati finiscono in mezz'ora la
finestra per farlo c'è, e va lanciato un giro `--solo=` sulle superfici toccate
subito dopo.

## Blocchi
- **Force-with-lease sul ramo**: fermo al fondatore; CI verde con l'eccezione
  dichiarata e sorvegliata.
- **B0-septies**, le **soglie di sicurezza** e **`dRecFreq` intero all'ingresso**
  (porterebbe la soglia DIN da 5 a 15 mm/s): fermi al fondatore.
