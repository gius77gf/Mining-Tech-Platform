# Ricerca continua — Campo (candidati di miglioramento)

Documento di ricerca approssimativa: candidati da approfondire, non diagnosi finali.

---

## Che cosa esiste già

Campo ha già tutte e venti le proposte della ricerca del 27/07, costruite da 28/07 a 29/07:

1. Data e turno su ogni registrazione (C1)
2. Piano di carico salvato (F2)
3. Produzione in numeri + unità (F3)
4. Assegnazione attività a squadra/operatore (C1)
5. Obiettivo di turno e scostamento (C2)
6. Storico settimana, checklist inizio turno, presenze, firma di chiusura (C3)
7. Turno chiuso non modificabile (C4)
8. Foto sull'anomalia (C5)
9. Meteo e condizioni del sito (C6)
10. Disponibilità di turno
11. Causali di fermo standardizzate (9 voci)
12. Pareto dei fermi con minuti
13. Appello del turno (tre stati: presente, assente, da spuntare)
14. Filtri attività, esportazione CSV, rapporto stampabile
15. Ponte P2 Campo → Terra (produzione per fronte)

---

## Candidati di miglioramento

| Schermata | Che cosa non va | Come si vede | Quanto costa | Come si misura |
|-----------|-----------------|--------------|--------------|----------------|
| Attività — anomalia | Fermo senza causale: il Pareto e la disponibilità aggiungono "Altro", ma l'anomalia originale resta vuota in interfaccia | Toccare un'attività, metterla in anomalia e scrivere solo i minuti (senza scegliere la causale dal menu): la riga mostra il fermo grigio senza testo accanto | Piccolo | Creare un'attività, toccarla, portarla in anomalia, compilare solo `fermoMin` senza toccare il campo causale: il Pareto deve mostrare la voce come "Altro" e il fermo deve avere etichetta vuota visibile |
| Squadre | Squadra con numero zero o vuoto: il carico resta invisibile, l'app funziona comunque | Nel quadro della giornata leggere "Squadre attive": il numero dipende dalle squadre operativa, non dal numero di persone — ma una riga con persone vuote non lo dichiara | Piccolo | Creare una squadra senza compilare il campo persone, metterla operativa, aprire il quadro: deve apparire etichetta o nota che dica "squadra senza anagrafica" o simile |
| Attività — disponibilità | Disponibilità al 100% quando nessun fermo è stato registrato: il numero è tranquillo ma la misura non c'è, confonde con "zero fermi veri" | Nel rapporto di fine turno il cartellone mostra "Disponibilità 100%" senza dichiarare se è misurato o assunto | Piccolo | Creare un turno senza registrare nessun fermo, aprire l'attività e cercare il Pareto: la riga sotto deve dichiarare "nessun fermo registrato" oppure il colore del numero deve essere grigio/neutro, non il colore di successo |
| Attività — forma | Campi data e turno della nuova attività non marcati obbligatori: sono necessari per lo storico, ma l'interfaccia non lo dichiara (niente asterisco, niente colore diverso) | Nel form "Nuova attività" i due campi hanno label e tipo ma si confondono coi facoltativi al di sopra | Piccolo | Compilare titolo e squadra, saltare data/turno, toccare "Pianifica": o la creazione fallisce con messaggio, o l'attività appare nel giorno ma con etichetta "senza data" evidente |
| Piano di carico | File importato vuoto (solo intestazione, zero righe di dati): l'app lo salva, il grafico restituisce niente, nessun feedback | Nel rapporto di fine turno cercare il grafico del piano di carico: se il file era vuoto, il grafico non appare ma nessuna nota lo spiega | Piccolo | Creare un CSV con solo l'intestazione (foro;x;fila;prof;prog;borr;rit), importarlo: un messaggio di feedback deve dire "nessun foro caricato" oppure il grafico deve mostrare una nota "dati non disponibili" |
| Rapportini | Rapportino in bozza senza produzione: si salva regolare, nello storico appare come gli altri | Nel form rapportino lasciare produzione vuota, salvare in bozza: nella lista dei rapportini la riga non dichiara che è incompleta (niente asterisco, niente colore grigio) | Piccolo | Aprire una bozza rapportino, non scrivere niente in produzione, salvare, cercarla nella lista e poi cliccarla: deve dire "produzione non compilata" oppure il badge deve dichiararlo |
| Rapporto stampabile | Meteo non registrato ma il rapporto ha una sezione per esso: cosa appare nella stampa se nessuno ha mai registrato il meteo? | Nel rapporto stampabile cercare la sezione "Meteo e condizioni del sito": se il turno non ha meteo registrato (nil dal database), appare riga vuota grigia? O testo "non registrato"? | Piccolo | Creare un rapportino, chiudere il turno SENZA mai compilare il meteo, aprire l'anteprima di stampa e cercarne la sezione: deve dire "non registrato" o simile, non restare in bianco |
| Piano di carico | Carica reale senza "da" e "squadra": il file importato vecchio non registra chi ha scritto e quando, i campi restano vuoti | Nel piano di carico aprire una riga e cercare chi ha inserito quel numero: il campo `da` è vuoto ma non lo dichiara — sembra assente per caso, non registrato intenzionalmente | Piccolo | Importare un vecchio CSV di piano, aprire una riga caricata e leggere il campo `da` (chi ha scritto): deve mostrare etichetta "non registrato" se vuoto, non restare in bianco |
| Attività | Attività "senza squadra" appare nel filtro ma non in "cosa tocca a me": la persona che apre l'app non vede il lavoro che nessuno ha preso | Nel blocco "Cosa tocca a me" in cima non appare nessuna attività, ma ce ne sono altre nella lista con squadra compilata e operatore vuoto | Medio | Creare un'attività, compilare squadra e operatore, salvare. Poi ricrearne un'altra: compilare squadra ma lasciare operatore vuoto. Nel blocco "Cosa tocca a me" di chi ha scelto quella squadra, la seconda deve apparire solo se non ha scelto il nome, altrimenti deve restare nascosta — la regola è scritta in `eMia` ma l'interfaccia deve dichiararla |
| Rapporto — riaperture | Motivo della riapertura lungo: su telefono stretto (320 px) il testo va a capo ma il bordo sinistro dashed rimane solo sulla prima riga | Nel rapporto di fine turno cercare la riga "Riaperto da Mario Bianchi il 29/07 alle 15:10 — dimenticati i minuti di fermo della volata di ieri nel turno di pomeriggio": su 320 px il testo spezza su due righe ma il bordo è solo nella prima | Piccolo | Aprire un turno riaperto con motivo lungo (>60 caratteri), ridimensionare il browser a 320 px: il bordo sinistro dashed deve seguire tutte le righe, non fermarsi alla prima |

---

*Documento di ricerca — ricerca approssimativa, candidati da approfondire, non diagnosi.*
