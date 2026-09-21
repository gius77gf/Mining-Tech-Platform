# Checkpoint — 2026-09-18T08:55:50Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
3749e2e7 — fix(flotta): il libretto esportato porta i componenti a vita propria

## Cosa è stato completato
Dal quarto giro di deep-pass su Flotta (agente a9a71df5a05374fef,
report arrivato durante l'unità ponti e rimasto in coda — chiuso ora):

Il libretto macchina STAMPATO mostra la sezione "Componenti a vita
propria" (`#sch-comp` non ha `no-print`, quindi compare nella stampa),
ma il libretto ESPORTATO in CSV — che il bottone dichiara essere "lo
storico completo" (stessa nota già scritta per fermi/giri/rifornimenti
troncati a schermo) — non la portava affatto: `fascicoloMezzo` non
legge mai `m.componenti`. Un pneumatico al 93,5% della vita attesa
(stato "attenzione"), visibile a schermo e in stampa, spariva del
tutto dal file — non un'assenza dichiarata, una categoria che per il
CSV non esiste proprio.

Aggiunta la sezione "componente" a `csvLibretto`, riusando ESATTAMENTE
la stessa chiamata già in uso a schermo (`vitaComponenti(m.componenti
|| [], null, m.ore, f.rifornimenti)`, verificata dall'agente originale
come corretta — `f.rifornimenti` porta le bandiere `contatoreNuovo`
necessarie). Una macchina senza componenti registrati dichiara la
sezione vuota (`VUOTA`), come le altre sei sezioni del libretto — non
un silenzio.

## Verifica
- Aggiornato un test esistente ("sei sezioni vuote" → "sette").
- Nuovo test dedicato: fixture con due componenti (uno al 93,5%, uno al
  12,3% della vita attesa) verifica che entrambi compaiano nel CSV con
  la percentuale corretta; un terzo caso senza `vitaAttesaOre`
  dichiarata verifica "soglia non dichiarata" invece di inventare una
  percentuale. KPI: 3139 → **3140**.
- Esteso `flotta-documenti-che-escono.mjs`: confronto live fra il
  numero di componenti mostrati a schermo (`#sch-comp .item`) e quelli
  nel CSV scaricato — devono coincidere. **Nota di metodo**: la prima
  versione dava un falso KO (schermo 0, CSV 1) perché il mio stesso
  filtro contava anche la riga placeholder "componente;nessuna
  registrata;..." come se fosse un componente vero; corretto escludendo
  quella riga dal conteggio. Verificato con uno script di debug
  ad-hoc che il primo mezzo della dimostrazione (Dumper D3) ha
  legittimamente zero componenti su entrambi i lati. Nuova voce #9 in
  `DIFETTI` (revert della sezione), confermata iniettata ("9 difetti
  rimessi davvero") anche se — per questo mezzo specifico con zero
  componenti — l'assertion schermo-vs-CSV non distingue da sola il
  difetto rimesso (0==0 in entrambi i casi); la copertura di
  regressione vera per questo fix vive nel test dedicato di
  `run-kpi.mjs`, non in questo confronto live.
- Giro completo su worktree isolata: **41 comandi a posto, 0 caduti**.
  Asserzioni: **4135** (documenti corretti da 4134). 9-suite sum:
  **3.634**. Banchi invariati (347, nessun nuovo banco per questa
  unità). `numeri-nei-documenti.mjs`: 43 passati, 0 falliti, confermato
  PRIMA del commit.

## Stato roadmap
Vedi vault/ROADMAP_SETTIMANA.md. Unità Flotta chiusa.

## Lavoro in corso (non ancora committato)
Sto lavorando su un fix di **shared/deepwork-id-client/dw-shell.js**,
dal report del deep-pass su quel file (agente a8b61df04b0af6417, tre
difetti veri trovati):

1. **`parseCsvLine` perdeva lo spazio bianco protetto dalla guardia
   anti-formula** su due dei tre casi che `csvCell` neutralizza apposta
   (`" =cmd"`, `"\t=cmd"` — il terzo, `"\r=cmd"`, sopravviveva per un
   motivo collaterale: `\r` fa scattare le virgolette a monte). Causa:
   il `.trim()` sui campi non quotati arrivava DOPO aver tolto
   l'apostrofo di guardia, quindi lo spazio bianco protetto restava
   scoperto in prima posizione e veniva tagliato. **GIÀ CORRETTO E
   VERIFICATO** (scambiato l'ordine: trim prima, guardia dopo — un
   apostrofo non è spazio bianco quindi il trim non lo tocca). Nuovo
   test dedicato in `run-kpi.mjs` (dopo "Genesi → Sentinella: il giro
   del file resta chiuso anche sui nomi ostili").
   ⚠️ **Lezione di metodo**: il primo tentativo di verifica aggiungeva
   i due casi whitespace-guardati all'array condiviso `CATTIVI` (usato
   per il giro completo su 7 export/import diversi) — ha prodotto
   **16 falsi KO**, perché quasi tutti i lettori applicano un `.trim()`
   **proprio**, indipendente, sul campo "nome" DOPO `parseCsvLine` (una
   scelta ragionevole: un nome non dovrebbe iniziare con un tab). Il
   fix di `parseCsvLine` è comunque corretto rispetto al suo contratto
   dichiarato, ma il caso "nome con spazio-poi-formula" non è
   realistico per NESSUN consumatore attuale (tutti trimmano i nomi).
   Rimosso da `CATTIVI`, sostituito con un test isolato diretto su
   `shell.parseCsvLine`/`shell.csvCell`, senza passare da nessun
   parser applicativo.
   KPI attuale con questo fix: **3141** (verificato, 0 falliti).
2. **`fileDiAltraTabella`/`_combacia`**: il riconoscimento "file di
   un'altra tabella" accetta sottosequenze CON BUCHI dell'header,
   producendo 61 cross-match falsi su 51 tabelle censite — un file
   legittimo con un sottoinsieme di colonne dai nomi comuni
   ("nome;area;stato") viene rifiutato come se fosse il file di
   un'altra app. NON ANCORA IMPLEMENTATO.
3. **`leggiCsv` vs `parseCsvLine`**: stessa regola (togliere l'apostrofo
   di guardia) scritta due volte con comportamenti diversi — `leggiCsv`
   non rispetta la distinzione quotato/non-quotato che `parseCsvLine`
   dichiara esplicitamente, quindi un campo quotato apposta per
   preservare gli spazi di contorno li perde comunque in `leggiCsv`.
   NON ANCORA IMPLEMENTATO.

## Prossimo passo atomico
1. Decidere se implementare i difetti 2 e 3 di dw-shell.js in questa
   sessione (sono reali ma più rischiosi da toccare — funzioni
   centrali usate ovunque — e richiedono più tempo di verifica) o
   chiudere prima solo il fix 1 già pronto, isolandolo in una worktree
   e committandolo, poi valutare 2/3 come cantieri separati.
2. Se si procede con 2/3: leggere `_combacia`/`tabelleCsvDi` per intero,
   capire l'impatto reale sui 22+ import esistenti prima di stringere
   la logica (regola CLAUDE.md: "misurare il costo della stretta prima
   di farla" — contare quanti import legittimi verrebbero rifiutati
   oggi, e quanti file-di-un'altra-app smetterebbero di essere
   riconosciuti se si stringe a "prefisso contiguo").
3. Continuare "mai fermarsi": mantenere ≥3 cantieri paralleli.

## Blocchi
Nessuno.
