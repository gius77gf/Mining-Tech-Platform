# Checkpoint — 2026-09-17T17:32:02Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
877b5918

## Cosa è stato completato
Lanciati in parallelo tre cantieri (Agent in background, isolati per app,
nessun tocco al codice da parte loro) per la "passata in profondità" di
CLAUDE.md: aprire ogni schermata, premere ogni bottone che produce un file,
cercare i numeri tranquilli dove non è stato misurato niente. Ogni finding
riverificato leggendo io stesso il sorgente e riproducendo dal vivo con
Playwright PRIMA di correggere (mai sulla parola dell'agente).

**Terra** — 5 difetti veri, 1 unità (commit `40e665ad`): sette campi
numerici del Titolo e del Lotto (altezza/pendenza massima del banco,
soglia di variante, volume di recupero, quota di garanzia) leggevano con
lo stesso lettore robusto dei campi vicini ma restavano fuori dal ciclo di
validazione — un'unità incollata al numero ("15 m", "18.000 euro") si
salvava in silenzio come "non dichiarato", senza errore né bordo rosso.
Aggiunta la validazione mancante, verificata dal vivo su tutti e sette i
campi (blocca l'illeggibile, accetta il vuoto, nessuna regressione sul
salvataggio valido).

**Campo** — 2 difetti veri + 1 voce di decisione, 2 unità (`40e665ad`
per il primo, mescolato per un errore di staging con Terra; `877b5918`
per il secondo):
1. `renderChiusura()` passava ad `avvisiChiusuraTurno` le attività
   dell'intera GIORNATA invece che del solo turno che si sta chiudendo,
   mentre l'appello accanto era già filtrato per turno — l'avviso di
   chiusura del turno di Notte leggeva i fermi/le attività aperte di
   Mattina. Aggiunto il filtro per turno, stesso idioma già usato da
   `disponibilitaTurno`.
2. `testoConsegnaTurno` triplicava lo stesso near-miss senza turno
   assegnato nella sezione SEGNALAZIONI DEL TURNO (una riga per turno,
   tutte col near-miss "ignoto" ripetuto perché il prefisso "- turno X:"
   impediva la deduplicazione). Aggiunto un parametro a
   `testoSegnalazioniTurno` per scrivere quella coda una volta sola.
3. **Voce 32 di `docs/DECISIONI_WEEKEND.md`**: la consegna che si archivia
   non ha mai presenze/riposo (D.Lgs 66/2003); il rapporto che si firma
   non ha mai i near-miss. Due asimmetrie reali fra due documenti di
   sicurezza — routing a decisione del fondatore, non implementate,
   perché è una scelta sul contenuto di un documento, non un bug.

**Flotta** — nessun difetto nuovo. Verifica onesta e approfondita
(banchi automatici rilanciati, giro manuale su tutte le schermate,
CSV scaricati e letti, verifica incrociata dell'aritmetica fra
schermate): ogni punto dove l'assenza di un dato potrebbe travestirsi
da zero misurato è già gestito esplicitamente dai cicli precedenti.

## Stato roadmap
Deep-pass di Terra/Flotta/Campo chiusa. I 42 KO del giro browser e i sei
documenti concorrenti erano già chiusi nel blocco precedente.

## Prossimo passo atomico
1. Continuare la lista "SE LA ROADMAP SEMBRA FINITA": la passata in
   profondità sulle app restanti (Conti, Scudo, Sentinella, Genesi, il
   core) non è stata ancora fatta in questo blocco — stesso metodo
   (Agent in background, tre alla volta, riverifica diretta di ogni
   finding prima di agire).
2. Oppure: una sovrapposizione nuova nella mappa ecosistema (§1/§6 di
   `docs/MAPPA_ECOSISTEMA.md`) — l'ultimo censimento (16/09) non ne ha
   trovate, quindi conviene prima la passata in profondità sulle app
   restanti.
3. Nota di igiene per il prossimo ciclo: uno `git add` non azzerato fra
   un'unità e la successiva ha mescolato il fix di Campo (renderChiusura)
   dentro il commit di Terra (`40e665ad`) — nessun danno (entrambi
   verificati e corretti), ma va isolato lo staging con `git status`
   prima di ogni `git add` quando si passa da un'app all'altra nella
   stessa sessione di commit.

## Blocchi
Nessuno.
