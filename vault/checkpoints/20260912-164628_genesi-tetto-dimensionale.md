# Checkpoint — 2026-09-12T16:46:28Z

## Tipo
unità completata (fix + estensione), app singola

## App
Genesi (unica app toccata, direttiva del fondatore ancora in vigore)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`f12eab68`

## Completato

1. Chiuso il "prossimo passo atomico" del checkpoint dell'unità 126:
   `caricaDaX50Target` non aveva nessuna guardia sul lato ALTO del
   dominio (obiettivo troppo fine → kg enorme senza avviso).
2. Partendo dalla ricerca già raccolta (`docs/RICERCA_CONTINUA_GENESI.md`,
   sezione 2026-09-12): nessuna fonte tecnica dichiara un tetto sul
   consumo specifico, ma la curva di Rosin-Rammler sottostante è
   dichiarata precisa solo fra 1 e 100 cm — il vincolo giusto è
   dimensionale, non un numero di powder factor inventato.
3. **Misurato prima di implementare** (regola di CLAUDE.md): verificato
   che il vincolo è SIMMETRICO e che il lato grossolano (x50>100cm) non
   è sempre coperto dai due clamp esistenti — trovato un caso reale
   (maglia della scheda validatori, x50=120cm) con kg=5,8 e pf=0,055,
   entrambi sopra le soglie che avrebbero dovuto proteggerlo.
4. Aggiunte due bandiere distinte in `caricaDaX50Target`: `troppoFine`
   (xt<1cm) e `troppoGrossolano` (xt>100cm), entrambe dentro
   `fuoriDominio`. La pagina (`genesi.html`) mostra ora il messaggio
   giusto per ciascuna, invece del messaggio unico precedente che
   consigliava "prova un obiettivo più fine" anche a chi aveva già
   chiesto un obiettivo troppo fine — l'errore opposto sarebbe stato
   peggio del silenzio.
5. Test: +1 test dedicato con due casi isolati dai clamp esistenti
   (misurati con `node -e`, non dedotti a mente) e i due confini esatti
   (1cm e 100cm ancora dentro, appena oltre fuori). Il test di
   round-trip sui 50.000 casi generati è stato RIMISURATO (non
   ricopiato): la fascia attesa di `fuoriDominio` è salita da
   8.000-15.000 a 18.000-24.000 (misurato 20.839), perché il
   generatore copre già x50 fino a 155cm — con la vecchia fascia il
   test sarebbe stato un falso allarme permanente.
6. Verificato col browser (Playwright): i tre messaggi (troppo fine,
   troppo grossolano, normale con x50=50cm) tutti corretti,
   screenshot guardato per il caso "troppo fine".
7. Documenti aggiornati e rimisurati (non ricopiati): totale prove
   senza rete/browser 3.406→3.407 (run-kpi 2925→2926), giro completo
   3.864→3.865.

## Stato roadmap

Unità 127 (Genesi — tetto dimensionale) → **completata**, voce
aggiunta in `vault/ROADMAP_SETTIMANA.md` subito dopo quella
dell'unità 126.

## Verifica prima del commit

`git worktree` da HEAD + diff staged + `giro-node.mjs` con cattura
diretta del vero codice di uscita. Due giri: il primo ha trovato il
disallineamento 3.864→3.865 (lo stesso genere di scoperta già fatta
nell'unità 126, stavolta anticipata correttamente); il secondo,
dopo la correzione, **`ESITO_VERO=0`, 40/40 comandi a posto**.

## Blocchi e limiti noti

- Nessun nuovo blocco aperto da questa unità.
- Restano dall'unità 126: le quattro occorrenze duplicate di
  `PENALITA_ACQUA` in `genesi.html` (dichiarate, non toccate).

## Prossimo passo atomico

Passare a una funzionalità nuova, non un fix: `docs/GENESI_ROADMAP_
COMPETITOR.md` (sezione "Roadmap proposta") indica **P0.2 — Signature-
hole (superposizione d'onda)** come il prossimo passo a grande impatto
e realizzabile solo lato client — importa la registrazione di un foro
singolo (CSV tempo-ampiezza), somma le copie ritardate secondo i
ritardi della volata (convoluzione, pura funzione JS) per stimare la
forma d'onda e la PPV attesa, da affiancare alla stima Devine/USBM già
presente (`ppvDaSd`, unità 126). Nessun backend richiesto. In
alternativa o in coda: le quattro occorrenze duplicate di
`PENALITA_ACQUA` (dichiarate al punto precedente), o il cantiere B3
(funzioni ancora estraibili da `genesi.html`, `genesi-estraibili.mjs
--elenco`).
