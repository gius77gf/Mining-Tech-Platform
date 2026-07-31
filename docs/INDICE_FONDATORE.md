# Parti da qui — indice dei documenti per il fondatore

Data: 2026-07-23 · **rivisto il 01/08** · Per Giuseppe. Sono stati scritti
diversi documenti in parole semplici. Questo foglio ti dice **quale aprire in
base a cosa ti serve**, così non devi ricordarti i nomi.

⚠️ Perché è stato rivisto: al 01/08 questo indice ne citava **26 su 46**. Fuori
c'erano fra gli altri **tutte e dodici le ricerche** e i due documenti
sull'estetica, cioè proprio quelli che le regole di lavoro danno per vincolanti.
Un indice che ne salta metà non è un indice: è un elenco di preferiti. Adesso ci
sono tutti (e un controllo ha verificato che nessun nome citato punti a un file
che non esiste).

## Se vuoi capire a che punto siamo
- **`docs/STATO_PRODOTTO.md`** — cosa fa OGGI ciascuna app, cos'è pronto da
  mostrare e cosa aspetta una tua decisione. *Il quadro d'insieme.* Le schede
  app per app sono del 23/07 e reggono; in cima c'è un **aggiornamento del
  30/07** con quello che è arrivato dopo (la vetrina, i grafici, i sei ponti,
  l'estetica unificata) — quello va letto per primo.
- **`docs/DIFETTI_TROVATI_202607.md`** — gli **otto difetti** trovati il 31/07,
  raccontati per quello che dicevano all'utente e non per come erano scritti nel
  codice: il grafico che mostrava il mese sbagliato, il ruolo di sicurezza verde
  su una sedia vuota, la misura del sismografo che spariva dal report per l'ente.
  *Se hai dieci minuti e vuoi capire che lavoro è stato fatto oggi, leggi questo.*
- **`docs/LA_STESSA_REGOLA_SCRITTA_DUE_VOLTE.md`** — perché una giornata di sole
  prove (02/08) ha prodotto **tre correzioni di struttura**: tre regole che
  vivevano in due posti invece che in uno. Dentro c'è anche il criterio per
  distinguere il caso in cui è un difetto da quello in cui non lo è — che è la
  domanda che torna ogni volta. *Cinque minuti.*
- **`/apps/` — la vetrina** è la pagina da aprire davanti a qualcuno: nove
  riquadri con la schermata vera di ogni strumento, i ponti fra le app e il
  bottone che entra nel tour in un colpo solo.

## Se vuoi portare il prodotto dal "si mostra" al "primo cliente che paga"
- **`vault/PIANO_GO_LIVE.md`** — il percorso ORDINATO, passo per passo, con il
  collo di bottiglia isolato (creare il progetto Firebase, gratis). *Il piano.*
- **`docs/DECISIONI_WEEKEND.md`** — l'elenco delle decisioni che spettano solo
  a te (e che i cicli automatici non prendono da soli). *Le tue caselle da
  spuntare.*

## Se devi caricare i dati di una cava (onboarding)
- **`docs/ONBOARDING_DATI.md`** — per ogni app, quale file CSV preparare
  (colonne + esempio) per caricare lo storico senza riscriverlo a mano.
  ⚠️ **Le due sezioni che contano davvero non sono i modelli**, e vanno lette
  *prima* di scegliere la cava pilota: **«Cosa NON si carica da CSV»** (quello
  che il cliente dovrà comunque scrivere a mano) e la voce **«Backup»**, che dal
  31/07 dice la verità misurata — **sette** file si ri-caricano davvero, tutti
  gli altri sono prospetti per il commercialista o per l'ente e **non** sono una
  copia di sicurezza. Restano senza backup pesate/DDT, incassi e clienti di
  Conti: è la **decisione 12** in `DECISIONI_WEEKEND.md`.

## Se un cliente (o il suo informatico) chiede "i miei dati sono al sicuro?"
- **`docs/ISOLAMENTO_DATI.md`** — come teniamo separate le aziende concorrenti
  e come lo dimostriamo con i test. *Da usare anche in vendita.*

## Se ti interessa la sicurezza e cosa è ancora da sistemare
*(i documenti sono due e guardano cose diverse: il primo le REGOLE DEL SERVER —
chi può leggere e scrivere cosa — il secondo il CODICE del core.)*
- **`docs/REVISIONE_SICUREZZA_202607.md`** (30/07) — le regole del server,
  misurate con l'emulatore. È quello da aprire per la domanda «i dati di un
  cliente li vede un altro cliente?».
- **`docs/AUDIT_SICUREZZA.md`** (dal 19/07) — il registro vivo del core:
  credenziali nei default, service worker, escape HTML, iniezione CSV.
- **`docs/MITIGAZIONE_PASSWORD.md`** — la protezione password preparata ma
  **non attivata** (serve il tuo via libera).
- **`docs/CENSIMENTO_FEATURE.md`** — cosa nel "core" (index.html) è completo,
  cosa è spento da configurazione, cosa è fuorviante.

## Se vuoi il flusso DRONE → nuvola → volata (la direzione attuale)
- **`docs/DEEPWORK_DRONE_FLUSSO.md`** — il flusso completo (drone economico → ODM →
  Terra/Genesi), come generare la nuvola **gratis** (aggiornato luglio 2026:
  Lightning per la prova, Oracle Free per il seguito) e la **prova pratica del
  weekend** passo-passo. *Parti da qui per il drone.*
- **`vault/PASSO3_FRONTE_METODO.md`** — come, dalla nuvola ritagliata, nascerà la
  simulazione della volata (in parole semplici + metodo tecnico).
- **`docs/GENESI_POINT_CLOUD.md`** e **`docs/GENESI_FRAMMENTAZIONE_DA_FOTO.md`** —
  dettaglio tecnico onesto sul visore point-cloud e sui limiti della
  frammentazione-da-foto.

## Se ti chiedono «ma i dati di un cliente li vede un altro cliente?»
- **`docs/REVISIONE_SICUREZZA_202607.md`** — la risposta è no, ed è **provata**
  con 58 test automatici. Il documento dice anche le due cose che oggi NON sono
  chiuse (l'abbonamento non fa da barriera; dentro l'azienda sono tutti
  amministratori) e le tre domande su cui serve la tua decisione.

## Se qualcuno ti chiede «ma la volata non la fa già Deepwork?»
- **`docs/PERCHE_DEEPWORK_E_GENESI.md`** — la frase da dire in dieci secondi
  (Deepwork è il **diario**, Genesi è il **tavolo da disegno**), le tre
  sovrapposizioni vere fra le due e le tre domande su cui serve la tua risposta.

## Se vuoi capire Genesi (il simulatore di volata) e le sue novità
- **`docs/GENESI_NUOVE_FUNZIONI.md`** — le funzioni recenti (riconciliazione,
  vibrazioni dall'onda vera, export del piano di innesco) spiegate con onestà:
  primi passi utili, **non** parità coi leader, e quanto siamo ancora distanti.
- **`docs/GENESI_ROADMAP_COMPETITOR.md`** e **`docs/GENESI_VS_COMPETITOR_MATRICE.md`**
  — dove siamo rispetto ai concorrenti, la matrice funzione-per-funzione e cosa
  conviene fare dopo, per impatto/fattibilità.
- **`docs/GENESI_OPENSOURCE_EMULAZIONE.md`** — su quali fondamenta open-source si
  può costruire restando indipendenti.

## Se vuoi le idee per le altre app (confronto concorrenza + prossimi passi)
- **`docs/SCUDO_HSE_ROADMAP.md`** (sicurezza/HSE), **`docs/FLOTTA_MANUTENZIONE_ROADMAP.md`**
  (mezzi/manutenzione), **`docs/CONTI_FATTURAZIONE_ROADMAP.md`** (fatturazione),
  **`docs/SENTINELLA_VIBRAZIONI_ROADMAP.md`** (vibrazioni/ambiente),
  **`docs/CAMPO_TURNI_ROADMAP.md`** (turni e rapportini) e
  **`docs/TERRA_RILIEVI_ROADMAP.md`** (rilievi e volumi) — per ciascuna:
  cosa fa oggi, cosa fanno i concorrenti, e i passi fattibili nel browser ordinati
  per impatto (con le scelte che aspettano te).

## Se vuoi leggere le ricerche su cui è costruito il lavoro
Ogni app ha la sua ricerca, fatta prima di scrivere il codice: cosa fanno i
prodotti migliori in circolazione, cosa serve davvero in una cava, e cosa
conviene fare per primo. Sono la fonte da cui nascono le unità di lavoro.
- Una per app: **`docs/RICERCA_SCUDO_202607.md`**, **`docs/RICERCA_CAMPO_202607.md`**,
  **`docs/RICERCA_FLOTTA_202607.md`**, **`docs/RICERCA_CONTI_202607.md`**,
  **`docs/RICERCA_SENTINELLA_202607.md`**, **`docs/RICERCA_TERRA_202607.md`**,
  **`docs/RICERCA_GENESI_202607.md`**.
- Trasversali: **`docs/RICERCA_VALORE_PRODOTTO_202607.md`** (i dettagli che fanno
  sembrare curato un prodotto — è da qui che nascono gli stati vuoti e i messaggi
  d'errore che spiegano), **`docs/RICERCA_VETRINA_202607.md`** (la pagina da
  mostrare a un cliente), **`docs/RICERCA_DEEPWORKID_202607.md`** (ruoli di cava,
  onboarding, GDPR), **`docs/RICERCA_CRUSCOTTO_TITOLARE_202607.md`** (il quadro
  d'insieme per chi comanda) e **`docs/RICERCA_DOCUMENTI_ENTI_202607.md`** (cosa
  chiedono davvero gli enti).

## Se ti interessa l'aspetto — perché è fatto così e non altrimenti
- **`docs/SPECIFICA_ESTETICA_CORE.md`** — che cosa produce davvero la qualità
  visiva (la luce a strati, i bordi che prendono la luce, gli aloni, la
  profondità dei bottoni). È il documento che le app devono rispettare.
- **`docs/PALETTE_APP.md`** — il colore proprio di ogni app, scelto con la
  verifica del contrasto, e la ragione di ogni scelta.
- **`docs/GENESI_ESTETICA_3D.md`** — l'aspetto del 3D di Genesi.
- **`docs/PIANO_GRAFICI.md`** — come sono fatti i grafici e perché sono tutti
  uguali fra le app.

## Se ti chiedono le norme (cave, ambiente, documenti verso gli enti)
- **`docs/SCUDO_NORMATIVA_CAVE.md`** — gli obblighi di sicurezza in cava
  tradotti in cose che l'app deve saper fare.
- **`docs/GENESI_FONTI_SCIENTIFICHE.md`** — le fonti scientifiche dietro le
  formule di Genesi, con le verifiche fatte sui numeri.

## Se vuoi capire come lavorano i cicli automatici
- **`docs/ROUTINE_AUTOMATICA.md`** — come funziona il lavoro automatico, cosa
  fa da solo e cosa si ferma ad aspettare una tua decisione.

## Dettaglio tecnico sull'isolamento (per te o per l'informatico del cliente)
- **`docs/ISOLAMENTO_CORE.md`** — come è stato reso separabile per
  organizzazione il "core", che era nato senza quella distinzione.
- **`docs/AUDIT_ISOLAMENTO_APP.md`** — la verifica, app per app, che ogni
  accesso ai dati passi dal percorso protetto.

## Se vuoi la visione e i piani a lungo termine
- **`vault/ROADMAP_VISIONE.md`** — il potenziale di ogni app e la tesi del
  "ciclo chiuso" dei dati di cava.
- **`vault/ROADMAP_SETTIMANA.md`** — il piano di lavoro corrente e lo storico
  di cosa è stato fatto.

## Storico
- **`docs/REVISIONE_FONDATORE_25-07.md`** — la tua revisione del 25/07 sul
  lavoro 19-24/07. È storica, ma è da lì che nascono alcune regole tuttora
  vincolanti: vale la pena riaprirla quando ci si chiede «perché questa cosa si
  fa così».

## Per chi sviluppa (tecnico)
- **`docs/DEVELOPMENT.md`** e **`CLAUDE.md`** (radice) — regole e procedure.

---
Nota: i documenti nella cartella `vault/` sono la "memoria di lavoro"; quelli
in `docs/` sono le guide stabili. Entrambi si aggiornano tramite Pull Request.
