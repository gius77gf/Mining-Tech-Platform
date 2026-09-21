# Checkpoint — 2026-09-21T04:15:00Z circa

## Tipo
documentazione (nessun codice di prodotto toccato)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
e578db12 (docs(genesi): misura accesso testo ISEE, corregge generalizzazione WebFetch, delta zero)

## Cosa è stato completato
Continuato a scorrere `docs/RICERCA_CONTINUA_GENESI.md` con `git log -S`
e riletture mirate per trovare proposte già verificate ma non ancora
chiuse (il metodo delle due unità precedenti).

- [x] **Chiusa la ricerca del 13/09 sull'errore di convenzione assi in
  un import DXF/CAD**: era rimasta "metà sul mondo" (nessun "Il delta").
  Verificato che Genesi ha già una difesa più forte di tutte e quattro
  quelle censite nel mondo — G47d (14/09) importa un DXF **solo** come
  tratti di riferimento visivo, mai come fori/fronte/piede, e non entra
  MAI in nessun calcolo di burden/relief/energia/flyrock; più due
  strumenti di correzione manuale (Ruota/Scala tratti) già esistenti.
  Zero righe di codice, chiuso con la prova nel research doc.
- [x] **Trovate due candidate di sicurezza mai portate in
  `docs/DECISIONI_WEEKEND.md`**: la ricerca del 18/09 sulla dispersione
  dell'innesco aveva già isolato due delta veri e precisi (la finestra
  MIC di 8 ms applicata al tempo NOMINALE invece che allo scatter che
  Genesi stessa calcola per il relief; lo scatter fisso dell'innesco
  "elettrico" incoerente col proprio catalogo), entrambi esplicitamente
  segnati come "decisione di modello, non un trasloco" — ma mai entrati
  in `docs/DECISIONI_WEEKEND.md`, dove per regola ("candidati che
  richiedono una scelta di sicurezza vanno lì, non implementati di
  iniziativa") dovevano stare. Verificato con `grep` che non c'erano
  già (`grep -n "micFinestra\|scatterInnesco" docs/DECISIONI_WEEKEND.md`
  → 0 righe prima di questa unità).
- [x] **Aggiunte come sezioni 29 e 30** di `docs/DECISIONI_WEEKEND.md`,
  nello stesso formato delle sezioni 19-28 (Il fatto / Come stiamo /
  Perché serve una decisione / Che cosa serve da te), con riga
  corrispondente nella tabella della "porta d'ingresso". **Nessun
  codice cambiato**: sono proposte in attesa del fondatore, non
  un'implementazione — esattamente come impone la regola.
- ⚠️ **Nota di igiene, non un difetto da correggere ora**: il documento
  ha due sistemi di numerazione indipendenti che si sovrappongono per
  coincidenza — le sezioni "## N." (ora 1-30) e un elenco più vecchio di
  caselle "`- [ ] **N.**`" numerato 19-43 su un argomento diverso. La
  collisione **esisteva già** prima di questa unità (le sezioni 19-28
  collidevano già con le caselle 19-28): non introdotta qui, e i due
  controlli automatici del repository li contano separatamente, quindi
  nessuna prova si rompe. Segnalato per chi volesse un giorno
  disambiguare, non toccato in questa unità (fuori scope).

## Verifica prima del commit
`numeri-nei-documenti.mjs`: **43 passati, 0 falliti** — "la porta
d'ingresso conta le decisioni aperte che ci sono davvero" ✓ (30 aperte,
30 sezioni, 31 indicizzate — invariato: non ho aggiunto nuove caselle
`- [ ]`, solo due sezioni "## N." con riga di tabella, che è ciò che il
secondo controllo pretende). `documenti-invecchiati.mjs`: **15/0**.

## Stato roadmap
Nessun codice di prodotto toccato. Due candidati di sicurezza per Genesi
ora visibili al fondatore dove devono stare.

## Prossimi passi
- **Prossimo passo atomico**: continuare a scorrere le sezioni ancora
  più vecchie di `docs/RICERCA_CONTINUA_GENESI.md` (righe 683-2262, non
  ancora ripassate con questo metodo in questo ciclo) per trovare altri
  delta verificati ma non chiusi, oppure passare a un'unità di codice
  vera se il rendimento di questo scorrimento cala.
- Mandato del fondatore invariato: solo Genesi, massimo sforzo.

## Blocchi
Nessuno.
