# Checkpoint — 2026-08-08 15:58 UTC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`3cea44f` — docs: l'arretrato dei quattro documenti che mordevano

## Da dove è nata
Da una riga che la suite **dichiara** e che nessuno aveva letto:
«arretrato totale **32 commit, di cui 4 che MORDONO**». Un documento che morde è
più vecchio di un commit che ha **aggiunto o tolto** una `export function` o un
`<button>` — le due forme con cui qui nasce e muore una funzione.

## Che cosa era
I commit che mordevano sono **i miei di oggi**, i due rifacimenti dei CSV. E la
riverifica è **misurata**, non dedotta — è la parte che conta, perché *una data
incollata non è una verifica*:
- `<button>` cambiati nei due commit: **zero**;
- funzioni aggiunte: **sei scrittori interni** per export che esistevano **già
  come bottoni**.

Cioè è cambiato **dove** si compone il file, non che cosa l'utente può fare. Un
confronto coi concorrenti si muove quando si muove una **capacità**, e qui non
se n'è mossa nessuna: **nessuna riga** dei quattro documenti cambia, e la
ragione sta scritta dentro ognuno.

## ⚠️ Il controllo mi ha corretto, e aveva ragione
La prima stesura dichiarava **HEAD**, che era un commit di soli documenti. La
suite l'ha **rifiutata**: «esiste ma non ha mai toccato né il documento né
l'app». È esattamente la **data incollata** che quel controllo esiste per
impedire. Adesso ognuno dichiara l'**ultimo commit che ha toccato davvero la
sua app** (`57c78cf` per Campo/Conti/Flotta, `924c442` per Scudo).

## Risultato
Arretrato **32 → 10 commit**, quelli che **mordono 4 → 0**. Giro `node` 27/27.

## Prossimo passo atomico
La 5b ha chiuso la parte **conflitti** (11 punti su 12, il dodicesimo fuori con
la ragione). Resta la **coda offline**, e la prossima unità è **una misura, non
una funzione**: che cosa succede scrivendo con la rete staccata e riattaccandola,
con due schede. ⛔ Va fatta **nel browser** — `enableIndexedDbPersistence` in
`node` non si misura — e vuole una pagina collegata all'**emulatore**, che oggi
non c'è: il primo passo è quel ponteggio, ed è un'unità a sé.

## Stato del giro del browser
⏳ PID 16670, **4h21**, ancora vivo e scrivente (105 passate). Attesta
`c3888fe`: **nessuna** delle diciassette unità di oggi è dentro.

## Blocchi
Nessuno.
