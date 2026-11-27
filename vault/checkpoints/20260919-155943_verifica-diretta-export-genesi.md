# Checkpoint — 2026-09-19T15:59:43Z (rinominato: il nome originale, 16:01:45Z, era 2 minuti AVANTI rispetto a quando è entrato in git — trovato da date-checkpoint.mjs il 19/09, corretto qui invece di lasciare rosso il giro)

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
0736043b — canarino: giro completo troncato e stale, passo a verifiche
dirette sugli export di Genesi

## Cosa è stato completato
Verifica personale (non delegata, non un banco automatico) dei tre
bottoni di export di Genesi non ancora aperti con gli occhi in questa
sessione: **CSV Piano di carico**, **DXF Piano fori**, **XML Piano di
innesco**. Premuti io stesso via Playwright su un server locale fresco
(porta 8971, contrassegno col proprio pid, chiuso a fine verifica), file
veri aperti e letti, non solo "il bottone risponde".

- [x] **Maglia di default (12 fori, 1 fila)**: tutt'e tre gli export
  coerenti fra loro e col toast (`carica_prog_kg=58`, `borraggio=2.2`,
  nessuna cella `null`/`undefined`/`NaN`; DXF con 12 CIRCLE + 12 TEXT sul
  solo livello FORI, nessun livello PROFILO spurio, coerente col toast
  "nessun profilo del fronte disegnato"; XML con `MaxInstantCharge=58.0`
  su una finestra di 8 ms — corretto, perché il ritardo minimo fra due
  fori è 42 ms > 8 ms, quindi un solo foro alla volta è mai «in carica»).
- [x] **Maglia a 3 file (36 fori, righe a y=3/6/9)**: CSV coerente, primo
  foro di ogni fila (`f2-1`, `f3-1`) col `relief_ms_per_m` calcolato
  contro la fila davanti invece che lasciato vuoto (vuoto è riservato solo
  al foro zero assoluto, `f1-1`) — nessuna cella tranquilla trovata.
- [x] **Campo "carica di progetto" svuotato prima dell'export**: NON ha
  prodotto un export con carica illeggibile come mi aspettavo — il
  campo si è **rifiutato di restare vuoto** (`guardiaVuoto`, riga 7982 di
  genesi.html: rimette il valore precedente e avvisa con un toast). È una
  difesa che regge, non un buco: il percorso "carica illeggibile" che
  `_pcMancanti` gestisce nel CSV resta raggiungibile solo da un dato che
  entra in altro modo (es. un'importazione), non dal campo numerico dal
  vivo — verifica corretta, nessun'azione da fare.
- [x] Nessun errore di pagina (`pageerror`) durante nessuno dei tre export,
  in nessuno dei tre scenari. L'unico errore di console (`ERR_TOO_MANY_RETRIES`
  sul font Google) è il limite di rete già noto di questo ambiente
  (proxy senza accesso ai CDN esterni), non un difetto del prodotto.

## Esito
**Zero difetti trovati** nei tre export su tre scenari. È un esito onesto,
non un fallimento della verifica: la maglia di demo è uniforme (stesso
burden/spaziatura/profondità per ogni foro), quindi molte celle sono
identiche per costruzione — il tipo di verifica che scoprirebbe di più è
un caso ASIMMETRICO (fori tolti a mano, decking, un solo foro con
carica diversa), non ancora provato.

## Verifica prima del commit
Solo documenti toccati (nessun codice di prodotto). `numeri-nei-documenti.mjs`
da rilanciare se si aggiunge un numero a un documento tracciato — qui non
si tocca nessuno dei 4 documenti tracciati, solo un checkpoint nuovo.

## Stato roadmap
Tutti e tre gli export di Genesi rimasti da ispezionare (CSV Piano, DXF
Piano fori, XML innesco) sono stati aperti e letti personalmente almeno
una volta. Restano aperti da questa sessione: il Report volata e la guida
di allineamento G56 (già verificati visivamente in unità precedenti).

## Prossimi passi
- **Prossimo passo atomico**: ripetere la stessa verifica diretta su uno
  scenario ASIMMETRICO — es. rimuovere 2-3 fori a mano dal Progetto 2D
  (drag + Canc, o Ctrl+Z parziale) e poi esportare CSV/DXF/XML: cercare se
  gli id_foro restano coerenti (nessun buco che confonda Campo) e se la
  sequenza di ritardo si ricalcola sui fori rimasti.
- In alternativa/parallelo: riprendere il lavoro di costruzione su Genesi
  (seconda iterazione di una funzione già consegnata, secondo il punto 5
  della sezione "Eccellenza" di CLAUDE.md — almeno tre iterazioni, la
  prima versione non è mai quella buona) dato che il mandato del fondatore
  resta "solo Genesi, massimo sforzo".
- Non rilanciare il giro completo del browser per ora (motivazione
  invariata: multi-ora, mai finito oggi, scarsa rilevanza diretta per un
  mandato solo-Genesi).

## Blocchi
Nessuno.
