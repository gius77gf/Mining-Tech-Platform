# Checkpoint — 2026-08-08T12:33:38Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
ab0ccff

## Che cosa è stato completato
**Due affermazioni delle regole di sicurezza che nessuna prova sorvegliava**:
le prove sulla barriera multi-tenant passano da **68 a 75**.

Censite confrontando **ogni `allow`** di `firestore.rules` con i titoli delle
68 prove. La dottrina è già in CLAUDE.md — *«chi scrive una restrizione e la
prova solo dal lato di chi PUÒ ha scritto un commento, non una regola»* — e
queste due erano rimaste commenti:
1. `users/{uid}` dichiara `allow delete: if false` con accanto «cancellazione
   account: solo via Cloud Function». Le tre prove su `users/` guardavano
   lettura e scrittura: **la cancellazione**, cioè il verso in cui un errore
   non si recupera, non la pretendeva nessuno;
2. la regola finale `match /{document=**} { allow read, write: if false }` è la
   rete che copre tutto ciò che nessuno ha previsto — e le 68 prove toccavano
   **tre radici sole** (`organizations/`, `invites/`, `users/`). Nessuna aveva
   mai chiesto che cosa succede a una **quarta**. È la domanda che conta,
   perché in un sistema di permessi **additivo** un `match` nuovo può solo
   allargare: il giorno in cui qualcuno ne aggiunge uno con un `allow` largo,
   quella rete smette di coprire e non se ne accorge nessuno.

Sette prove nuove, e una è il **verso opposto**: «la rete non nega ciò che è
concesso». Senza, un `allow read, write: if false` messo per sbaglio in cima al
file passerebbe tutte e quattro le prove negative.

## ⛔ La controprova, e distingue
Rimettendo i due difetti **sulle regole** — il delete concesso a chi possiede il
documento, e un `match /pagamenti/{id}` permissivo prima della rete — cadono
**4 prove su 7**. Le tre che restano verdi sono **giuste**, e lo dimostrano
preciso invece che grossolano:
· «e nemmeno quello di un altro» regge perché l'iniezione permetteva solo il
  **proprio** profilo;
· «a un utente non autenticato è negata uguale» regge perché il match iniettato
  chiedeva `signedIn()`;
· il controllo positivo non si muove.
Regole ripristinate da una **copia** e confrontate con `diff -q`, mai con
`git checkout`.

## ⚠️ E un errore mio, di mestiere
Il primo tentativo di scrivere questo checkpoint usava un heredoc **non
quotato**: in bash i backtick del markdown diventano sostituzione di comando, e
la shell ha provato a eseguire `allow`. Una coppia è stata mangiata e il file
conteneva un buco. Il segno era una riga sola nell'uscita — `line 89: allow:
command not found` — accanto a un push andato a buon fine: **un comando che
sbaglia in mezzo a una catena che riesce**. Da qui in avanti, per i file che
contengono codice: `<<'FINE'`, con l'apice.

## Verifica
· **75 passate, 0 fallite** sotto l'emulatore Firestore
  (`firebase emulators:exec --only firestore --project demo-deepwork`);
· copia di quello che si committa, confronto patch-a-patch identico: **26
  comandi, 0 caduti**;
· documenti riallineati: 116 → **123** prove con emulatore, e il commento del
  lanciatore `giro-sicurezza.mjs` 68 → 75.

## Stato roadmap
Prima unità di questo ciclo dopo il canarino. Il giro del browser lanciato alle
~11:10Z **sta ancora girando** (11 passate su 125 a 45 minuti quando l'ho
guardato: la prima domanda è «sta ancora scrivendo?», e la risposta era sì —
171 byte in 25 secondi).

## Prossimo passo atomico
1. **Raccogliere il giro** quando finisce: `node
   apps/deepwork-id/tests/browser/leggi-giro.mjs <registro>`, **sezione 1 prima
   della 2**, e leggere la riga nuova «le tre passate più lente» per capire se
   il limite di 30 minuti è ancora tarato. ⚠️ Quel giro attesta `c3888fe`: le
   unità dopo (i cinque contrasti dei fondi non coprenti, la lezione in
   CLAUDE.md, queste sette prove) non ci sono dentro.
2. Se restano crediti prima che finisca: continuare il censimento delle
   affermazioni senza prova negativa **sulle altre due suite d'emulatore** —
   `run-sdk.mjs` (19) e `run-bootstrap.mjs` (8) — con lo stesso metodo:
   elencare ogni promessa del codice e cercare chi pretende il rifiuto.
   ⚠️ `run-fns.mjs` (21) resta fuori: vuole l'emulatore delle **funzioni**, che
   in questo contenitore non parte perché chiede la rete.

## Blocchi
Nessuno.
