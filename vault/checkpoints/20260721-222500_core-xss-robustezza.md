# Checkpoint — 2026-07-21T22:25:00Z

## Tipo
unit-complete (sicurezza/robustezza — Deepwork CORE index.html)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — core: XSS escaping + robustezza login/avatar)

## Contesto
Revisione approfondita del core `index.html` (~8300 righe, l'UNICO file NON
coperto dal syntax-check CI, deploy automatico su Netlify a ogni merge su
main). Fatta con un subagent + verifica manuale certosina: ho CONFERMATO ogni
finding sul codice reale e ho trovato ulteriori siti che il subagent aveva
mancato (grep sistematico su nome/cognome/titolo non escapati in innerHTML).

## Corretto (tutti bug REALI)
XSS memorizzato — dati di testo libero (nome cava/operatore/personale, titolo
promemoria) interpolati in `innerHTML` (spesso nel body di `openModal`) SENZA
`escHtml`, mentre gli stessi campi sono escapati a pochi caratteri di distanza:
- 1169 titolo promemoria (nel modale di eliminazione)
- 1474 cava, 1479 personale (anteprima rapportino)
- 1783 operatore, 2056 fochino (dettaglio rapportino/fochino)
- 5254 cava, 5287 nome+cognome (modale riconciliazione)
- 1566 cava+operatore (modale "allega rapportino") — MANCATO dal subagent
- 1412, 1545 nome cava (liste "seleziona volata") — MANCATI dal subagent
- 2848 nome cava (risultati ricerca) — MANCATO dal subagent
Lasciati intatti i casi già sicuri: 1574 (textContent), 1748/1749 (escapati al
render 1768), nomi-file PDF con `.replace(/[^\w]/g,'_')`, r1() jsPDF.

Robustezza:
- 903 e 2608: `x.user.toLowerCase()` → `x.user && x.user.toLowerCase()`: un
  solo documento utente senza campo `user` rompeva login E registrazione per
  tutti.
- 2556, 2577: avatar `u.nome[0]+u.cognome[0]` → `initials(u.nome,u.cognome)`
  (helper già esistente, gestisce nome/cognome mancante): evita crash del
  rendering se un utente non ha nome/cognome.

Verifica: syntax del modulo OK (386k caratteri, node --check); grep di
controllo → restano solo i residui sicuri; Playwright boot del core → login
renderizzato, body OK, ZERO errori JS reali.

## SEGNALAZIONE AL FONDATORE (NON toccato — decisione architetturale)
Il core NON ha isolamento multi-tenant: nessun `orgCollection`, tutti gli
accessi Firestore usano collezioni globali di primo livello (`doc(db,'users',
...)`, `collection(db,'rapportini')`, ...). Questo è coerente col fatto che il
core è l'app STORICA mono-azienda (un progetto Firebase = una cava),
precedente all'ecosistema `apps/` che invece è multi-tenant via SDK. Se il
core resta single-tenant "by design" NON è un bug; se un giorno servirà più
aziende dallo stesso progetto, va introdotto l'isolamento. Da chiarire col
fondatore — NON modificato in questa unità.

## Prossimo passo atomico
Aprire PR (occhio: merge = deploy in produzione del core); dopo merge, RESTART.
Proseguire SENZA FERMARSI.

## Blocchi
Isolamento multi-tenant del core: decisione architetturale del fondatore.
Passo 1 go-live (progetto Firebase) + stile/prodotto: fondatore.
