# Checkpoint — 2026-09-12T19:46:37Z

## Tipo
correzione di documento (nessun codice toccato)

## App
Genesi (direttiva del fondatore ancora in vigore: solo Genesi)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`9f9f0283`

## Completato

Prima di aprire un nuovo cantiere, riletto `docs/GENESI_ROADMAP_COMPETITOR.md`
per la regola "legge prima di proporre". Il suo stesso avviso in cima
raccontava di essere stato riscritto il 12/09 (unità 128) dopo aver
scoperto P0.1/P0.2/P1 già fatte e mai tolte dall'elenco — ma
**"P1.1 Import deviazione fori (boretrack)" era ancora elencato come
"grande impatto, ancora aperto"**, mentre l'unità **129** (la STESSA
giornata, poche ore dopo quella riscrittura) aveva già costruito
`deviazioneForiDaCsv` + `burdenVeroDaRilievo`, wired in pagina
(`📡 Importa rilievo deviazione fori`). Nessuno era tornato ad
aggiornare la riga — la stessa regola di CLAUDE.md che il documento
citava per giustificare sé stesso, violata di nuovo un livello più
sotto, dallo stesso blocco di lavoro.

Corretto: P1.1 spostata in "✅ Fatte", con un limite dichiarato
onestamente (non overclaim) — la descrizione originale del gap parlava
di un overlay 3D del profilo as-drilled accanto al simulato; quanto
costruito è un **pannello numerico** per foro (burden progetto→burden
vero), non un overlay visivo 3D. La sostanza del gap (dato reale
invece che solo simulato) è chiusa; l'overlay resta un'estensione a sé.
Sintesi riscritta: l'unico gap vero rimasto è **P2.1** (frammentazione
da foto), bloccato sulla decisione #28 non ancora presa, con la
ricerca di mondo già raccolta in `docs/RICERCA_CONTINUA_GENESI.md`.

## Stato roadmap

Nessuna voce di roadmap settimanale toccata: correzione di un documento
di ricerca/censimento, non di `vault/ROADMAP_SETTIMANA.md`.

## Blocchi e limiti noti

Nessuno nuovo. Resta la decisione #28 come unico blocco per P2.1.

## Prossimo passo atomico

Con B3 in gran parte esaurito e le due ricerche di fianco (Kuz-Ram,
presplit/detonatori, frammentazione da foto) tradotte nei delta
possibili senza inventare soglie non verificate, le strade aperte
restano:
1. Una nuova ricerca di fianco su un angolo Genesi ancora scoperto (le
   sette sezioni finora: rapporto di volata, progettato-vs-perforato,
   piano di tiro, esplosivi/licenze, Kuz-Ram, presplit/detonatori,
   frammentazione da foto).
2. Rivedere se esistono altri "non c'è" scaduti in
   `docs/GENESI_FRAMMENTAZIONE_DA_FOTO.md` o in altri documenti Genesi
   con lo stesso metodo usato qui (leggere prima di proporre, cercare
   il meccanismo non il nome).
3. Se la roadmap settimanale generale (`vault/ROADMAP_SETTIMANA.md`) ha
   task Genesi non ancora spuntati, riprenderli.
