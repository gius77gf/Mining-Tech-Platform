# La routine di lavoro automatico — come funziona e come si ripara

> Scritto per il fondatore, in italiano semplice. Serve a capire se il
> lavoro automatico sta girando e a rimetterlo in piedi quando si ferma,
> **senza dover ricostruire ogni volta il ragionamento**.

---

## 1. Cos'è la routine

È una sveglia programmata. A un orario fisso — oggi **ogni 3 ore, da lunedì
a sabato** — fa partire da sola una sessione di lavoro che legge la roadmap
della settimana, riprende dall'ultimo checkpoint e lavora fino a esaurire i
crediti disponibili.

Non è magia: è un messaggio programmato che arriva a una sessione di Claude
Code, con dentro tutte le istruzioni (le direttive, i vincoli, il metodo).

## 2. Il guasto del 27–28 luglio — cosa è successo

La routine è stata riarmata scegliendo l'opzione **"apri una sessione nuova
a ogni scatto"**. Sembra la scelta più pulita: ogni ciclo parte fresco.

In questo ambiente però le sessioni create da zero **nascono senza il
repository collegato**. Il ciclo si sveglia, cerca il progetto, non lo trova
e muore subito. Ha fatto esattamente questo il 27 e il 28 luglio alle 18:15.

**La regola da ricordare:** in questo ambiente la routine deve essere
**agganciata a una sessione che ha già il repository**, non creare sessioni
nuove. Tecnicamente si chiama `persistent_session_id`.

## 3. Come capire, in dieci secondi, se sta lavorando

Apri il file **`vault/ULTIMO_CICLO.md`** e guarda la data in cima:

- **oggi o ieri** → tutto a posto;
- **più vecchia di un giorno** (in una settimana lavorativa) → **si è
  fermata**, vai al punto 4.

In alternativa, su GitHub: guarda se sul branch di lavoro compaiono commit
nuovi nelle ore notturne. Se la notte è vuota, la routine non ha lavorato.

## 4. Come si ripara

Chiedi a Claude, in una sessione che **ha il repository aperto** (cioè una
sessione avviata normalmente sul progetto):

> «La routine automatica si è fermata. Riarmala seguendo
> `docs/ROUTINE_AUTOMATICA.md`.»

Questi sono i passi che verranno eseguiti, elencati qui perché restino
scritti anche se cambia chi li esegue:

1. **Elencare le routine esistenti** e trovare quella chiamata
   `Weekly Dev Session`.
2. **Cancellarla**, se c'è (per non ritrovarsi con due routine che
   duplicano il lavoro).
3. **Ricrearla** con:
   - cadenza `0 */3 * * 1-6` (ogni 3 ore, lunedì–sabato);
   - **`persistent_session_id` uguale all'id della sessione corrente** —
     è il punto che fa la differenza fra funzionare e non funzionare;
   - **mai** l'opzione che crea sessioni nuove a ogni scatto;
   - il prompt completo con le direttive (obiettivo, regole estetiche,
     lavoro in parallelo, vincoli invariati).
4. **Provarla subito** invece di aspettare l'orario: si può far scattare a
   mano. La prova non è "la routine dice che va bene", ma **compaiono
   commit nuovi sul branch** entro pochi minuti.

La stessa procedura è già scritta, con i dettagli tecnici, nella skill
`.claude/skills/weekly-kickoff/SKILL.md`, che viene eseguita a ogni
kickoff settimanale.

## 5. Il punto debole che resta, detto chiaramente

La routine vive **agganciata a una sessione**. Se quella sessione termina —
per esempio perché il contenitore viene liberato dopo un lungo periodo di
inattività — la routine perde il suo aggancio e smette di lavorare.

Non è un difetto di configurazione: è come funziona l'ambiente. Le difese
messe in campo sono:

- **Il canarino** (`vault/ULTIMO_CICLO.md`): rende l'assenza di lavoro
  visibile subito, invece di scoprirla dopo giorni.
- **La procedura qui sopra**: riarmarla costa un minuto, non un'indagine.
- **Le notifiche push** attive sulla routine: arrivano sul telefono quando
  un ciclo finisce.

## 6. Cosa NON fare

- **Non creare una seconda routine "di scorta" con lo stesso nome e la
  stessa cadenza**: due routine attive fanno lavorare due sessioni sugli
  stessi file, e i lavori si sovrascrivono a vicenda.
- **Non usare l'opzione delle sessioni nuove** sperando che "stavolta
  funzioni": è già stata provata due volte, con lo stesso esito.
- **Non cambiare il prompt della routine per accorciarlo**: contiene le
  direttive vincolanti (regola dei dati riservati, niente spese, niente
  push diretto su main). Se si perdono, i cicli automatici perdono le
  regole.

---

*Aggiornato il 28/07/2026, dopo il guasto e la riparazione.*
