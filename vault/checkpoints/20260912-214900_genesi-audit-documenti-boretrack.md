# Checkpoint — 2026-09-12T21:49:00Z

## Tipo
audit di documenti (nessun codice toccato in questa unità)

## App
Genesi (direttiva del fondatore ancora in vigore: solo Genesi)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`58457d7e`

## Completato

Dopo la scoperta di sicurezza del blocco precedente (checkpoint
`20260912-200615`), ho cercato sistematicamente altre copie della stessa
affermazione scaduta ("Genesi non importa la deviazione fori/boretrack")
in tutti i documenti Genesi (`grep -ln "boretrack\|deviazione.*fori\|burden
reale" docs/GENESI_*.md docs/RICERCA_GENESI_202607.md
docs/PIANO_GENESI_MODULO_DATI.md`). Trovate e corrette due copie in più,
oltre a quella già chiusa in `GENESI_ROADMAP_COMPETITOR.md`:

1. **`docs/GENESI_VS_COMPETITOR_MATRICE.md`**: la riga della tabella
   diceva "Genesi oggi: ❌" e "fattibile browser: ⛔ misura, serve
   strumento in foro" — falso: il browser non ha bisogno dello strumento
   fisico, gli basta il file che produce. Corretta con lo stato vero,
   incluso l'avviso attivo sulla convenzione degli assi.
2. **`docs/RICERCA_GENESI_202607.md`**: scoperta più significativa di
   questa unità — questo documento del **27/07**, due giorni PRIMA che
   `h.burdenVero` fosse spedito (29/07), conteneva già testualmente la
   nota di sicurezza che l'unità 129 ha violato oggi ("un burden
   calcolato male produce un avviso di flyrock sbagliato... non spedirla
   finché non la si prova su un fronte reale"). Aggiunto un aggiornamento
   datato che collega quella nota storica allo stato vero di oggi, con
   rimando a `docs/DECISIONI_WEEKEND.md` §6 come fonte aggiornata unica
   (invece di duplicare i dettagli in un quarto posto).
3. **`docs/PIANO_GENESI_MODULO_DATI.md`**: controllato, nessuna
   correzione necessaria — la menzione di "burden reale" lì è una nota
   storica già correttamente dichiarata "resta com'era scritto il 01/08,
   non aggiornarla a mano".

**Non ho trovato altre copie** nei restanti documenti Genesi
(`GENESI_ESTETICA_3D.md`, `GENESI_FONTI_SCIENTIFICHE.md`,
`GENESI_OPENSOURCE_EMULAZIONE.md`, `GENESI_POINT_CLOUD.md`,
`PERCHE_DEEPWORK_E_GENESI.md`): il grep su quei nomi dà zero risultati.

## Perché questo conta oltre il caso specifico

La stessa affermazione era scaduta in **quattro punti diversi**
(competitor roadmap, matrice competitor, ricerca di luglio, e implicitamente
il gate di sicurezza mai controllato) — è la prova quantitativa della
regola di CLAUDE.md "chi chiude un'unità aggiorna la riga del documento che
gliel'aveva proposta": qui **nessuno** l'aveva fatto per due mesi, dal
29/07 al 12/09, e il costo non è stato solo l'informazione stantia — è
stato che il gate di sicurezza collegato alla stessa funzione è rimasto
invisibile a chi ha costruito l'estensione (boretrack) il 12/09.

## Stato roadmap

Nessuna voce di `vault/ROADMAP_SETTIMANA.md` toccata.

## Blocchi e limiti noti

Resta valido il blocco del checkpoint precedente: **nessuna nuova unità
tocca la geometria del fronte 3D, il flyrock o il burden reale per foro**
finché il fondatore non risponde. Il resto di Genesi resta aperto.

## Prossimo passo atomico

Con l'audit dei documenti chiuso e il blocco di sicurezza dichiarato e
propagato ovunque serviva, le strade aperte (che NON toccano geometria/
flyrock/burden) restano:
1. Una nuova ricerca di fianco su un angolo Genesi non ancora coperto
   (finora: rapporto di volata, progettato-vs-perforato, piano di tiro,
   esplosivi/licenze, Kuz-Ram, presplit/detonatori, frammentazione da
   foto, flyrock quantitativo/backbreak — quest'ultima raccolta ma NON
   tradotta in codice per il blocco di sicurezza).
2. Verifiche di qualità su superfici non toccate dal blocco: `sonda-vuoto.mjs`
   su codice recente, screenshot a 320/390/430px delle due UI più recenti
   che NON riguardano flyrock (l'obiettivo di pezzatura, già verificato
   nel checkpoint 175849).
3. Se il fondatore risponde alla segnalazione: riprendere da
   `docs/DECISIONI_WEEKEND.md` §6.
