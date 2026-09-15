# Checkpoint — 2026-09-15T03:09:22Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
b0d0f52d (pushato)

## Cosa è stato completato

L'agente lanciato nel checkpoint precedente (`20260915-024728`) ha
trovato un difetto vero, misurato dal vivo (non dedotto dal codice),
nella sezione **appalti** di Scudo — l'unica delle otto sezioni di
navigazione senza un banco browser dedicato.

**Il difetto**: il gestore di "Aggiungi l'appalto"
(`apps/scudo/index.html`, riga ~4775) ritrovava l'appalto appena
salvato con `APPA.find(x => x.oggetto === oggetto && x.appaltatoreId
=== impresa)` — un confronto per CONTENUTO, non per id. Se un'impresa
ha già un altro appalto con lo stesso oggetto (nomi come "Trasporto
inerti" o "Manutenzione" sono normalissimi in cava), `.find` prende il
PRIMO match, spesso quello vecchio e già a posto. Verificato dal vivo:
creato un secondo appalto di "Autotrasporti Valle srl" con lo stesso
oggetto del suo appalto esistente `pa1` (già a posto), senza sito né
uomini-giorno — il messaggio di conferma ha detto "Appalto
registrato." tranquillo, invece di "Resta da fare: ...". L'ELENCO,
che si ridisegna dallo stato vero, restava corretto: il difetto era
solo nel messaggio, la parte più facile da non verificare.

**Correzione**: `db.aggiungi` restituisce già `{id}` — verificato che
è lo stesso identico contratto già usato correttamente altrove nella
stessa pagina per `permessi` (`permAperto = (ref && ref.id) || null`,
riga ~4853) e `documenti` (`const ref = await db.aggiungi("documenti",
rec)`). L'handler degli appalti era l'unico a non seguire quel
pattern già stabilito — una copia più debole, non un difetto isolato.
Confermato che sia `addDoc` (modo live, Firestore) sia il finto db in
memoria (modo dimostrazione) restituiscono `{id}` con lo stesso
contratto, quindi il fix vale in entrambi i modi.

Verifica standard rispettata (adattata: gestore di pagina, non
funzione pura — verificato con Playwright, non con estrazione):
- Letti i test già esistenti su `duvriDovuto`/`statoAppalto`/
  `impresaPermesso` in `run-kpi.mjs` PRIMA di cercare: la copertura
  pura era già forte (sito assente, sito orfano, costi/uomini-giorno
  non noti — tutti già gestiti onestamente). Il buco era solo nel
  gestore di pagina, non nel modulo.
- Aggiunto un sesto caso a `apps/deepwork-id/tests/browser/
  scudo-numeri-tranquilli.mjs` (50→56 prove), seguendo lo schema
  esistente (fixture via iniezione nella risposta HTTP dove serve,
  qui non serviva: il caso usa dati già presenti nella dimostrazione).
  Difetto iniettato e provato: la controprova del banco (rimette la
  vecchia riga `APPA.find` per contenuto) fa cadere le tre asserzioni
  giuste del caso nuovo, confermato lanciando `--controprova`.
- `run-kpi.mjs`: 2984/0 (invariato, nessuna funzione pura toccata).
- `sintassi-pagine.mjs`: 34/34.
- `numeri-nei-documenti.mjs`: 43/0 (nessun numero sorvegliato tocca
  questo file).
- Giro isolato su worktree dedicata: **40 comandi a posto, 0 caduti**,
  3.930 asserzioni (invariate: la prova nuova vive in un banco browser
  non contato da questo aggregato, per costruzione — vedi
  `giro-node.mjs` che lo dichiara).

## Stato roadmap

Prima passata in profondità di questo ciclo completata su Scudo
(sezione appalti). Le altre sette sezioni erano già coperte da banchi
dedicati e restano verificate come stabili (nessuna regressione
misurata).

## Prossimo passo atomico

Continuare la passata in profondità su Scudo (altre sezioni, se
emergono candidati nuovi) o passare a **Campo**, pari livello di
urgenza per recenza (`git log` per cartella: ultimo commit 09/11 per
entrambe, prima di questo ciclo). Stessa disciplina: leggere prima i
banchi browser già esistenti per l'app per non riscoprire un difetto
già chiuso, poi una passata mirata su una sezione scoperta o poco
coperta, con dati iniettati nella risposta HTTP del modulo — mai nel
file su disco.

Nessuno stop volontario: si prosegue subito.
