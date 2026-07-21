# Checkpoint — 2026-07-21T22:35:00Z

## Tipo
unit-complete (sicurezza — chiusura sweep XSS del core)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — core: ultimo avatar iniziale escapato+guardato)

## Completato
Dopo le correzioni #294, ho fatto uno sweep di COMPLETEZZA sul core per ogni
campo di testo utente (nome/cognome/titolo/modello/note/testo/ruolo/tel/
indirizzo/descrizione/targa) interpolato in `innerHTML` senza `escHtml`.
Risultato: un solo residuo reale —
- riga 3193 `${o.nome[0]}` (iniziale avatar nel "Dettaglio per operatore"):
  carattere singolo (rischio XSS minimo) ma soprattutto crash se `o.nome` è
  assente. → `${escHtml((o.nome||'?')[0])}` (escape + guardia).
Il titolo di `openModal` (`${p.nome} ${p.cognome}` a 2512) è impostato via
`textContent` → già sicuro, non toccato.

Dopo il fix, i due sweep (campi testo non escapati in innerHTML; `nome[0]/
cognome[0]` non guardati) sono ENTRAMBI VUOTI: la superficie XSS/robustezza
del core per questi campi è chiusa.

Verifica: node --check del modulo OK; Playwright boot del core → login
renderizzato, zero errori JS.

## Prossimo passo atomico
Aprire PR (merge = deploy produzione core); dopo merge, RESTART. Proseguire
SENZA FERMARSI.

## Blocchi
Isolamento multi-tenant del core: decisione architetturale del fondatore (già
segnalata). Go-live / stile / soglie: gated.
