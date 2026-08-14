# La routine di lavoro automatico — come funziona e come si ripara

> Scritto per il fondatore, in italiano semplice. Serve a capire se il lavoro
> automatico sta girando e a rimetterlo in piedi quando si ferma.

## 1. Cos'è
Una sveglia programmata (una "Routine"). Ogni 3 ore, da lunedì a sabato, manda
un messaggio con tutte le istruzioni a una **sessione di Claude Code già aperta
che ha il progetto scaricato dentro**. Quella sessione riprende dalla roadmap e
dall'ultimo checkpoint e lavora finché ha crediti.

Routine attiva oggi: `trig_01VaUGXswecYtsbrJbvormJC`, orario `43 */3 * * 1-6`
(UTC), agganciata alla sessione `session_01NVNe624qGFRzmj2Jc8FqUt`.
Il minuto (:43) non lo scegliamo noi: il server lo aggancia al minuto in cui la
routine viene creata. È normale, non è un errore.

## 2. Perché si era fermata (e cosa resta incerto)
Il 27-28 luglio la routine era impostata su **"apri una sessione nuova a ogni
scatto"**. Quelle sessioni non hanno prodotto niente: zero commit, zero
checkpoint, 22 ore di buco. La spiegazione più probabile è che la sessione nuova
nasca **senza il progetto collegato** e muoia subito.
Onestà: nessuno ha letto i log di quelle sessioni, quindi non è dimostrato al
100%; una seconda spiegazione possibile è il limite di utilizzo del piano. Ciò
che è **certo** è: le routine agganciate a una sessione viva col progetto hanno
sempre prodotto lavoro, le altre mai.

## 3. Come capire in dieci secondi se sta lavorando
Apri **`vault/ULTIMO_CICLO.md`**: la prima riga ha data e ora dell'ultimo ciclo.
- data di oggi o di ieri → tutto bene;
- più vecchia di un giorno (lun-sab) → **è ferma**, vai al punto 5.
Su GitHub lo stesso segnale sono i commit che iniziano con `canarino:`.
⚠️ In una lista di run, il pallino verde vuol dire solo "la sessione è partita e
non è esplosa", **non** "il lavoro è stato fatto". Fidati solo del canarino.

## 4. L'avviso automatico
`.github/workflows/canarino.yml` gira su GitHub due volte al giorno e guarda la
data del canarino. Se è più vecchia di 6 ore in un giorno lavorativo, apre una
**issue** sul repository e GitHub ti manda una **email**. Regola da ricordare:
**«se ricevo un'email da GitHub che dice che la routine è ferma, la riarmo».**
Questo controllo gira su computer di GitHub: funziona anche se tutte le sessioni
di Claude sono morte. Non ripara: avvisa.

## 5. Come si ripara (procedura esatta)
Apri **una sessione qualsiasi su claude.ai/code con il repository
Mining-Tech-Platform collegato** (è il punto essenziale) e scrivi:

    /weekly-kickoff

⚠️ **Qui c'era scritto `/riarma-routine`, e quel comando NON ESISTE.** Verificato
il 01/08: in `.claude/skills/` c'è **una sola** skill, `weekly-kickoff`, e la sua
descrizione dice testualmente di usarla per «riarmare la Cloud Routine di
sviluppo automatico», con fra i trigger «riarma la routine di sviluppo».
Era la **prima istruzione** che il fondatore avrebbe letto nel momento peggiore —
quando il lavoro automatico è morto — e non faceva niente. Se preferisci non
usare la scorciatoia, va bene anche scrivere a parole *«riarma la routine di
sviluppo automatico»*: la skill si attiva lo stesso.

Se la scorciatoia non fosse disponibile, incolla questo testo:

> Riarma la routine di sviluppo automatico. 1) `list_triggers` e `delete_trigger`
> delle routine di sviluppo che puntano a una sessione morta. 2) `create_trigger`
> con name "Weekly Dev Session", cron `0 */3 * * 1-6`, `persistent_session_id` =
> l'ID di QUESTA sessione, e il prompt del ciclo descritto in
> `.claude/skills/weekly-kickoff/SKILL.md` (canarino come prima azione).
> 3) `fire_trigger` subito e verifica che entro pochi minuti compaia un commit
> `canarino:` e che `vault/ULTIMO_CICLO.md` porti la data di oggi.

## 6. Cose da non fare
- Non creare la routine con "sessione nuova a ogni scatto" finché il test
  descritto in questo documento non dimostra che funziona.
- Non tenere due routine di lavoro attive insieme sullo stesso branch: si
  pestano i piedi. Il "Guardiano" (routine di sorveglianza su una seconda
  sessione) lavora **solo** se la principale è ferma da più di 4 ore, e prima di
  partire scrive un file di lock.
- Non aspettarti notifiche push dalla routine: con la sessione persistente il
  sistema **non le supporta** (il server rifiuta il parametro). L'unico avviso
  automatico è l'email di GitHub del punto 4.
- Non accorciare il prompt della routine: contiene le direttive vincolanti
  (dati riservati, niente spese, niente push diretto su main).

---
*Aggiornato il 28/07/2026 dopo il guasto, la riparazione e le verifiche incrociate.*
