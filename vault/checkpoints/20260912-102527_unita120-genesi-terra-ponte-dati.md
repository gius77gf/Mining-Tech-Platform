# Checkpoint — 2026-09-12T10:25:27Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
5c0dbe27

## Cosa è stato completato (unità 120)

Durante la passata in profondità su Conti (vedi sotto) è emerso un difetto
minore ma reale nella rimisurazione di `docs/MAPPA_ECOSISTEMA.md` fatta
nell'unità 119 (commit precedente, `d7dd157f`): la frase «resta di sola
chiave-del-browser Genesi→Terra» era stata ripetuta senza riverificarla nel
codice — esattamente il difetto che quella stessa unità 119 esisteva per
correggere (fidarsi del testo di un documento invece di riaprire il file).

Verificato leggendo il codice:
- `apps/genesi/genesi-data.js:2075` — `nuvole: () => read("nuvole")`, che
  legge/scrive sotto `orgCollection` quando Genesi gira come membro
  dell'organizzazione;
- `apps/terra/terra-data.js:2623-2630` — `api.nuvoleGenesi` legge
  `idGenesi.orgCollection("nuvole")` con una seconda istanza dell'SDK, la
  stessa forma di `rapportiniCampo` (già contato come ponte di dati);
- `apps/terra/index.html:4639-4641` — la pagina legge `db.nuvoleGenesi()`
  PRIMA, e la chiave del browser (`localStorage.getItem("genesiNuvole")`)
  solo come ripiego, con la scelta affidata a `ultimoRitaglioNuvola` (pura,
  provata).

Cioè Genesi→Terra viaggia sui dati dal **02/09**, non solo dal 05/09 come
gli altri tre ponti di file, e non «resta» di sola chiave come diceva la
riga corretta nell'unità 119. Corretto:
- §4 di `MAPPA_ECOSISTEMA.md`: nuovo blocco ⛔ datato che spiega l'errore e
  cita le tre righe di codice;
- §6 (tabella "il conto, per vederlo scendere"): la riga "ponti di FILE"
  ora dice **zero** bridge di sola chiave (non tre su quattro);
- lo stamp di verifica in fondo al documento, con una seconda nota datata.

Verificato con `giro-node.mjs` su worktree pulita (`git worktree add
--detach HEAD` + `git diff --cached --binary | git apply` + `git add -A`):
**40 comandi a posto, 0 caduti, exit 0**, 3.852 asserzioni (invariate:
questa è una correzione di prosa, non di codice o test).

## Passata in profondità su Conti — conclusione

Investigato perché tutte e 7 le fatture d'esempio di Conti non producono un
file FatturaPA pronto (`xmlFatturaPA` → `pronto: false`). Riletto il testo
completo del modale (corretto un selettore DOM sbagliato nella sonda dello
scratchpad, `document.getElementById("modal-body")` invece di
`.modal, .modale, [class*=modal]`, che catturava tutta la pagina):

- f1, f2, f5, f6 (clienti collegati all'anagrafica, con CAP/comune/
  provincia completi): manca **un solo dato**, sempre lo stesso —
  "imponibile, IVA e totale della fattura: è una fattura vecchia a solo
  importo, l'aliquota non si può dedurre". Sono fatture VECCHIE, scritte
  solo con `importo` (nessun `imponibile`/`ivaImporto`/`aliquotaIva`), per
  design (commento in `conti-data.js` riga ~110: "alcune già collegate
  all'anagrafica... con il solo testo libero — e volutamente scritto in
  modi diversi").
- f3, f4, f7 (clienti SENZA `clienteId`, solo testo libero: "Comune di
  Modica", "Calcestruzzi RG", "Cave del Sud"): mancano 6 dati (piva/CF,
  indirizzo, CAP, comune, provincia del cliente + lo stesso problema
  dell'aliquota). Anche questo per design: sono fatture non collegate
  all'anagrafica.

**Non è un difetto**: `apps/deepwork-id/tests/run-kpi.mjs` riga ~3008-3012
ha già un test che pretende esplicitamente questo comportamento — «con i
dati della dimostrazione di oggi il file NON è pronto» — e un test separato
(riga ~2984) dimostra che con dati completi `xmlFatturaPA` produce
`pronto: true`. La funzione funziona; la dimostrazione mostra di proposito
solo casi limite (fatture vecchie / clienti non anagrafati), coerente con
la filosofia "l'assenza di un dato non è un dato favorevole" e con
`docs/QUANDO_UN_CASO_VA_IN_DIMOSTRAZIONE.md`. Nessuna unità aperta su
questo. Riletti anche i 15 CSV esportati da Conti (clienti, costi, gare,
incassi, listini, pesate, preventivi, registro vendite, rimanenze,
situazione fatture): nessun numero tranquillo trovato — gli zeri/vuoti che
sembravano sospetti (DDT 2026/013 senza densità, riga costi senza data)
sono già gestiti correttamente e già documentati nel codice (bandiera
`calcolabile: false`, "no (senza data)" invece di uno zero muto).

## Stato roadmap

Nessun task della roadmap settimanale riguardava direttamente questo
(emerso durante la passata in profondità). Nessuna modifica a
`vault/ROADMAP_SETTIMANA.md` necessaria per questa unità.

## Blocchi
Nessuno.

## Prossimo passo atomico

Il giro del browser lanciato sul commit `a820c6d2` (log:
`$SCRATCHPAD/giri/giro-20260912-093925-a820c6d2.log`, ancora in corso alla
scrittura di questo checkpoint — fase `contrasto`, che è la più lenta) va
riletto con `apps/deepwork-id/tests/browser/leggi-giro.mjs` una volta
finito, e va rilanciato sul nuovo HEAD (`5c0dbe27`) perché questo commit
tocca solo `docs/`: **non serve rilanciarlo per un commit di soli
documenti** (regola già scritta in questo file — le iniezioni/i giri
riguardano codice, non prosa), quindi il giro in corso resta valido finché
non arriva un commit che tocca codice o pagine.
Dopo aver letto quel giro: continuare con la prossima unità piccola,
seguendo l'ordine di priorità della roadmap (seconda iterazione app
verticali, censimento feature, ricerca a rotazione) — mai fermarsi.
