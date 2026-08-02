# A1, A2, e la mattina passo per passo col fondatore

**Data:** 02/08/2026 · **Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`
**Commit:** `5218350`, `0851c4e`, `4e019ef` · **Kickoff della settimana:** `4130ac1`
**Unità precedente:** `20260801-235400_quattro-cantieri-e-un-numero-piu-alto-di-ogni-suo-addendo.md`

## ⛔ La cosa più seria trovata stamattina

Le regole di sicurezza del Firebase a cui punta il **sito pubblico** erano:

```
match /{document=**} { allow read, write: if true; }
```

Chiunque su internet poteva **leggere, scrivere e cancellare** l'intero
database. È la «modalità test» proposta da Firebase alla creazione, rimasta
attiva per mesi.

E il pezzo che conta per il metodo: **la deduzione veniva prima della
conferma.** Nel core non c'è nessuna autenticazione — cercati `getAuth`,
`signIn`, `onAuthStateChanged`, `firebase/auth` in `index.html` → **zero**.
Senza un'identità, o le regole lasciano passare tutti o il sito non salva
niente: si sapeva **prima** di chiederle al fondatore, e la lettura ha
confermato.

⚠️ Un secondo difetto che nessuno aveva guardato: **tutti i visitatori della
demo scrivono nello stesso database**, quindi si vedono i dati a vicenda.
Chiudere lo **migliora** — ognuno lavora sulla propria copia.

Regole nuove versionate in `firestore.rules.core-vecchio`, con dentro quelle
vecchie per intero e come si torna indietro. Manca solo il «Pubblica».

## Le due unità chiuse

**A1 · Flotta — la metà gasolio.** Tre scarti confermati (Pala P1 **+93,7%**),
e l'identità `euroOra = euroOraOfficina + euroOraCarburante` che **prima non
tornava** e adesso torna al centesimo.
⛔ La parte che conta non è la correzione: le **sedici prove della pagella
erano relative** («la media è la spesa diviso le ore»), quindi restavano verdi
**con qualunque numeratore**, difetto compreso.
⚠️ E l'ipotesi del mandato è stata **smentita**: nessun verdetto cambia. Quello
che cambia è la Pala P1 che esce dalla banda **dal lato buono**.

**A2 · `shared/` — la densità.** Difetto misurato prima: Terra **1,95**, Campo
**1,90**, stessa autorizzazione; a valle 2,56% contro 0% di scostamento.
⛔ Il buco vero era altrove: rimettendo il difetto **su Campo**, tutte e quattro
le suite `node` restavano **verdi** — non aprono le pagine.
⚠️ E la lezione non prevista: la copia «identica» **è divergesa nell'atto di
copiarla**, e con quella versione una densità **0** veniva sostituita di
nascosto dal preset. L'ha presa una prova, non una rilettura.

## Errori miei, in questo blocco

1. ⛔ **Ho letto `git log` e ne ho tratto una conclusione sbagliata**, dicendo
   al fondatore che certi dati «non erano stati introdotti dai cicli
   automatici» perché il commit è firmato `gius77gf`. Git registra **chi
   committa, non chi scrive**: l'app nasce da conversazioni precedenti, ed è
   lavoro nostro. Regola ora in `CLAUDE.md`.
2. **«Dieci delle diciannove decisioni sono la stessa domanda»: sono quattro.**
   Scritto da me, ripetuto due volte. Contate una per una: 13, 14, 16, 17.
3. **`git add -A apps/`** mi ha portato dentro il file di prova di un cantiere
   mentre ci scriveva. L'ha segnalato lui.
4. Una sostituzione ha **duplicato** il testo nella roadmap e la conta diceva
   «1 sostituzione»: la conta non guarda il risultato.

## Verifica

`run-kpi` **1474/0**, copertura **593/593** e 0 funzioni scoperte, `run-stile`
282/0, `suite-collegate` 3/0 su 55 file, `numeri-nei-documenti` 19/0 — misurati
sulla **copia** di ciò che si committa, perché due cantieri stanno scrivendo.

## Prossimo passo atomico

Raccogliere **A3** (Conti, il DDT che eredita il prezzo dell'ordine) e **A4**
(il banco che apre le modali) quando chiudono, verificarli sulla copia e
committare.
E le due cose che aspettano il fondatore: il «Pubblica» sulle regole (decisione
**2**) e la riga sulle quattro gemelle (**13, 14, 16, 17**).
