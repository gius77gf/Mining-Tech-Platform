# Checkpoint — 2026-08-08T01:04:34Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`976e2a0` — *Scudo: «Modello: —» sul verbale firmato, e la chiave doppia che spegneva la controprova*

## Che cosa è stato completato

Portata sui due fogli di Scudo — appena entrati nel banco — la stessa domanda
fatta un'ora prima al report di Sentinella. Il **verbale** aveva **cinque**
trattini, tutti nella colonna **«Modello»**; la **cartella** zero.

Su un foglio che il lavoratore **firma**, «Modello: —» si legge *«questo
dispositivo non ha un modello»*, mentre la verità è che nessuno l'ha
registrato — e l'art. 77 chiede che il DPI consegnato sia **identificabile**.
Adesso scrive **«non registrato»**, la stessa parola delle due colonne accanto,
corrette lo stesso giorno.

⚠️ **La colonna «Taglia» resta col trattino, ed è voluto**: «unica» esiste
davvero come risposta, quindi una taglia vuota su un dispositivo a taglia unica
non è una mancanza. Sono **due domande diverse** e vanno scritte diverse —
l'eccezione sta nel banco **per nome**, non in una regola larga che le confonde.

## ⛔ E la lezione vera: una chiave doppia in un oggetto letterale non fa rumore

Le due iniezioni di Scudo le avevo scritte come **due voci**
`"apps/scudo/index.html"` dentro lo stesso oggetto `DIFETTI`. In un letterale
JavaScript la seconda **cancella** la prima, e non c'è niente da leggere:
nessun errore, nessun avviso.

L'effetto è la cosa da ricordare, perché imita perfettamente una controprova
sana: la riga dei trattini rispondeva **«ok»** mentre le altre cadevano, e il
riepilogo diceva *«2 difetti rimessi, **0 iniezioni mancate**»* — cioè il
contatore che esiste apposta per dire «l'iniezione ha trovato il suo soggetto»
diceva di sì, perché **l'iniezione sopravvissuta l'aveva trovato davvero**.
A smascherarla è stato solo il fatto che **la riga che doveva cadere non
cadeva**. È la sesta causa dell'elenco di CLAUDE.md — non la prova, non il
codice, non l'iniezione: lo **strumento sotto**.

Unite in una chiave sola: **3 difetti rimessi, 5 KO**, e la riga stampa le
colonne colpevoli (`["Modello" ×5]`) invece di un numero nudo.

## Prove

Banco `stampe-fs` **73 → 76** prove (76 su 76 nel giro pieno, 0 KO);
controprova su Scudo 5 KO con 0 iniezioni mancate. Giro `node`: **23 comandi,
0 caduti**, sulla copia di quello che si committava.
Documento aggiornato: `docs/I_FOGLI_CHE_NESSUN_BANCO_PREME.md`.

## Prossimo passo atomico

⛔ **Raccogliere il giro del browser** (`scratchpad/io-core/giro-5.txt`, pid
7002, porta 8823) **e rilanciarlo sul commit corrente** — quello in corso parte
da un `HEAD` di oltre quaranta commit fa. Ordine: prima le righe **«non ho
guardato»**, poi i KO, distinguendo le controprove.

Poi, i due rimandati aperti:

- ⏱️ **I trattini degli altri fogli**: la riga nuova guarda il report di
  Sentinella e i due fogli di Scudo. Restano **Flotta** (libretto macchina),
  **Conti** (preventivo, DDT, fattura) e **Terra** (denuncia). Il giudizio va
  fatto **foglio per foglio**: un trattino legittimo in un'app non lo è in
  un'altra — misurato oggi due volte, con esiti opposti sulla stessa colonna
  («Ora» giusta in Sentinella, «Modello» sbagliata in Scudo).
- ⏱️ **La seconda domanda sui RIFERIMENTI in `nomi-liberi`**, non solo sulle
  chiamate. Dichiarato nell'intestazione dalla prima stesura e mai misurato:
  prima di scriverlo, **contare gli allarmi su una copia**.

## Blocchi
Nessuno.
