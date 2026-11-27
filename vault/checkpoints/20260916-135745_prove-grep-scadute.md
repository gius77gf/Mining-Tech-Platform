# Checkpoint — 2026-09-16T13:57:45Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
0b31d6d6

## Cosa è stato completato
Durante la chiusura di due sezioni di ricerca invecchiate (Conti decimo
giro, Scudo undicesimo giro — unità precedenti di questo blocco), ho
costruito uno strumento di misura per non riscoprirlo a mano ogni volta,
seguendo la regola "gli strumenti di misura vivono nei test, non nello
scratchpad": `apps/deepwork-id/tests/prove-grep-scadute.mjs`.

**Che cosa fa**: scansiona tutti i `docs/RICERCA_CONTINUA_*.md`, trova i
blocchi nella forma `$ grep -c... "pattern" file1 file2` seguiti dai
conteggi dichiarati (`file:N`), RILANCIA lo stesso comando oggi, e confronta.
Se un conteggio è cambiato E non c'è una nota "✅ ... CHIUS…" fra il blocco
e la sezione successiva, il controllo fallisce nominando il blocco e i
numeri, vecchio e nuovo.

**Perché non è un doppione**: diverso da `documenti-invecchiati.mjs` (che
guarda il COMMIT dichiarato e l'età del documento — un segnale diverso: un
documento può essere "fresco" per quel controllo e portare comunque un
`grep` la cui uscita è già cambiata) e diverso dalla strada già provata e
scartata IN quello stesso file ("rimettere alla prova i TERMINI citati in
prosa": 8 righe segnalate, 2 vere, 6 falsi allarmi, perché la prosa cita
anche nomi che ESISTONO come controesempio). Qui non si indovina un
termine dalla prosa: si rilancia il comando ESEGUIBILE che il documento
stesso scrive, carattere per carattere.

**Sicurezza**: l'esecuzione passa da `execFileSync` (mai una shell), e
`comandoSicuro` scarta comunque — per difesa in profondità, non perché
serva con `execFileSync` — qualunque pattern con `$(` o backtick, oltre a
qualunque comando che non abbia la forma esatta `grep -c<flag> "pattern"
file file...`.

**Controprove (4 automatiche + 1 manuale)**:
1. `estraiBlocchi` legge un blocco scritto come nei documenti veri.
2. `comandoSicuro` scarta `;`, `&&`, `$(...)`, backtick, redirezioni — e
   AMMETTE un `|` dentro le virgolette (fa parte del pattern `-E`, non è
   una pipe di shell).
3. Un blocco scaduto SENZA chiusura viene visto (altrimenti il controllo
   mentirebbe sempre zero).
4. Un blocco scaduto MA chiuso non conta come un difetto — è la forma
   stessa di questo file, verificata su un testo finto.
5. Manuale: rimossa temporaneamente la nota di chiusura da
   `RICERCA_CONTINUA_CONTI.md` con `cp`+patch Python, confermato che il
   controllo cade con 2 falliti (i 4 blocchi tornati "aperti"), ripristinato
   con `cp` + `diff` (identico), confermato verde di nuovo.

**Trovato subito, sul primo lancio contro i documenti veri**: 10 blocchi
scaduti su 23 verificabili, tutti e dieci GIÀ chiusi dalle due unità
precedenti di questo blocco — zero da chiudere. Il valore dello strumento
non è in quello che ha trovato oggi (già trovato a mano), è che da oggi
nessuna delle due famiglie di documento invecchiato può riaprirsi senza
che il giro `node` lo veda.

Registrato in `apps/deepwork-id/tests/package.json` (`scripts.test`),
subito dopo `documenti-invecchiati.mjs` — `giro-node.mjs` lo eredita da lì
automaticamente (elenco derivato, non gemello). Doc-cascade: comandi
40→41, asserzioni 4069→4076, confermato con un giro isolato su worktree
pulita (**41/41, 0 caduti, primo tentativo**).

## Stato roadmap
Nessun task esplicito della roadmap interessato: unità auto-diretta di
infrastruttura di verifica, nata da un bisogno reale incontrato in questo
stesso blocco (i due documenti invecchiati chiusi in precedenza).

## Prossimo passo atomico
Tornare alla passata "in profondità" su Campo (candidati 1-2 del
checkpoint `20260916-132643_conti-chiusura-decimo-giro.md`, non ancora
esauriti: `csvStorico`/`csvAttivita`/`csvSquadre` letti e trovati puliti,
`csvAppello` allineato — nessun difetto trovato finora oltre a quello già
corretto su `rapportoGiornata`), oppure iniziare l'ASSENZA P2 (colonna di
vocabolario condiviso su 11 CSV — decisione di design più grande).
In alternativa, applicare lo stesso principio di "documento che deve
autoverificarsi" appena costruito a un'altra famiglia: `docs/
CONCORRENTI_*.md` (le sei schede competitor) potrebbero portare la stessa
malattia (un confronto "noi abbiamo / loro hanno" scaduto in poche ore) —
non censito ancora.

## Blocchi
Nessuno.
