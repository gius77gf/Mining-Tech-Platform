# Checkpoint — 2026-07-21 — Core XSS 2a passata (fatto)

## Task completato
Seconda passata XSS sul core (index.html): la prima passata (#84-85)
aveva coperto chat + nome volata + liste personale/utenti/volate/home;
il grep ha rivelato altri render element-context di testo utente
VISIBILE AI COLLEGHI ancora grezzi. Bonificati con escHtml:
- lista cave (nome, indirizzo, avatar) — riga ~1673
- dettaglio cava dashboard (nome, avatar) — ~3180
- ricerca globale: cave, clienti, mezzi, personale (nomi, ragsoc,
  modello, targa, ruolo, piva, avatar) — ~2844-2847
- lista clienti (ragsoc, piva/cf, avatar) — ~2968
- link cliente nell'anteprima cava (ragsoc) — ~1690
- chip operatori assegnati (nome, cognome, ruolo) — ~1695
- titoli promemoria scaduti/prossimi — ~1148/1149

Applicato con script Python a conteggio-guardato (scrive solo se ogni
old-string ha esattamente le occorrenze attese): il guard ha già
intercettato 2 render duplicati che avrei mancato.

Verifiche: escHtml neutralizza `< > " ' &` (test diretto sul payload
`<img onerror>`); i 3 script inline del core passano node --check; il
core si carica in Playwright SENZA errori di pagina.

## Nota di scope (onesta)
NON è la chiusura totale del core. Restano (prossime unità, stessa
cautela): attributi `value="…"` dei form di modifica (contesto-
attributo), `<option>` di alcune select, campi NOTE lunghi nelle
anteprime modali. Rischio residuo minore (aprire il proprio modale),
ma tracciato in AUDIT_SICUREZZA.md punto 8.

## Commit
- ccd4423  Sicurezza core: escHtml su liste, ricerca e anteprime

## Prossimo passo atomico
Push + PR + merge a CI verde. Prossima unità: chiudere il residuo XSS
core (value dei form + option + note). Continuare fino a esaurimento;
SERALE (~21:40 UTC) = revisione COMPLETA. MAI fermarsi volontariamente.
