# Checkpoint — 2026-09-16T05:37:00Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
417b90df

## Cosa completato
- Implementato il **primo passo del tema "notifiche automatiche" di Scudo**
  (dodicesimo giro di ricerca continua, riverificato indipendentemente):
  `notificheScadenzeNonLette` in `apps/scudo/scudo-data.js` — un contatore
  di scadenze urgenti persistente finché la pagina Scadenze non si
  visita, non un invio esterno (email/SMS restano un passo successivo che
  chiede un servizio terzo, dichiarato "grande" nella ricerca).
- **"Nuova" non è un campo salvato: è dedotta dal TEMPO.** Una scadenza
  non si sposta, quindi la sua urgenza è una funzione pura della data di
  oggi — confrontando `livelloScadenza` alla data dell'ultima visita
  (un solo timestamp, `impostazioni.scadenzeVisteIl`) con quello di oggi
  si sa esattamente quali scadenze sono diventate urgenti nel frattempo,
  senza dover storicizzare ogni singola scadenza. Mai visitata prima →
  tutto ciò che è urgente ORA conta come nuovo (non zero, che
  nasconderebbe un arretrato mai visto).
- Nuova collezione `impostazioni` (live + demo) aggiunta a
  `SCUDO_COLLEZIONI`. Demo: `scadenzeVisteIl: "2026-08-20"`, e la CQC di
  s5 (dataScadenza 2026-09-02) è scaduta dopo quella data — il caso vero
  per cui la funzione esiste (1 notifica non letta in demo).
- Badge sul bottone «Scadenze» della barra in basso, scritto DAVVERO alla
  visita (non solo nello stato transitorio della sessione).
- **Difetto CSS reale trovato durante la verifica**, invisibile a
  qualunque suite `node`: `.badge` (shared/dw-app-ui.css) dichiara
  `display:inline-flex` con la STESSA specificità di `[hidden]{display:
  none}` dell'user agent — a parità vince l'ultima regola caricata, cioè
  `.badge`. L'attributo `hidden` restava scritto ma il badge non
  spariva MAI: la proprietà DOM `.hidden` era vera, il rendering no.
  Trovato SOLO misurando la visibilità vera con Playwright (`isHidden()`)
  contro `page.evaluate` che leggeva la proprietà — la stessa famiglia di
  "un controllo che non guarda dove crede" che CLAUDE.md documenta da
  mesi, in una veste nuova (l'attributo HTML invece di una classe CSS).
  Corretto controllando `style.display` esplicitamente.
- Test in `run-kpi.mjs`: la funzione pura (nuova per tempo non per
  campo, mai visitata, visitata oggi stesso, scadenza senza data,
  elenco/piano assenti).
- Nuovo banco browser permanente `tests/browser/scudo-notifiche-
  scadenze.mjs` con controprova (`aggiorna`→`aggiungi` scambiato lascia
  il record vecchio e il badge sempre acceso — un refuso plausibile, i
  due verbi convivono ovunque nella stessa pagina). 5/5 in normale,
  controprova cade come atteso (4 ok, 2 KO). Registrato in `tutti.mjs`.
- Verifica: `run-kpi` 3060/0, `run-stile` 330/0, `classi-orfane` 0/0,
  `funzioni-mai-usate` 0 da collegare, `nomi-liberi` 0 fuori scope,
  `copertura-funzioni` 0 senza prova (scudo 216→228 fondo). Giro isolato
  rilanciato due volte (la seconda dopo la correzione dei quattro
  documenti): **4026** asserzioni, 40/40 comandi a posto, 0 caduti.
  `numeri-nei-documenti.mjs`: 43/0.
- Doc-cascade aggiornato in tutti e quattro i documenti: run-kpi
  3059→3060, somma nove suite 3.553→3.554, giro completo 4024→4026,
  copertura sei app 1032/1032→1033/1033, banchi browser 301→303 (131
  file distinti).
- Commit `417b90df`, pushato su `claude/scheduled-tasks-remote-control-bk4ap6`.

## Nota per la rotazione ricerca
Con questa unità sono chiusi TRE dei cinque temi della ricerca su Scudo
(barriere ICAM — unità precedente, denuncia INAIL — collegato alla
decisione 22 già esistente invece di duplicarla, notifiche automatiche —
primo passo). Restano aperti: rischio chimico (medio, nessuna decisione
del fondatore richiesta) e anagrafica attrezzature (medio, confine con
Flotta già dichiarato dalla ricerca).
Su Conti sono chiusi ENTRAMBI i temi pronti del decimo giro (storico
solleciti + piano di rientro). Su Flotta restano solo item costosi
(curva costo/vita economica — richiede storicizzare per anno, rischio
di correttezza sui confini di finestra del contatore, valutato e
rimandato di proposito questo blocco) o che richiedono una decisione
architetturale (costo per tonnellata — ponte con Terra) o di mercato
(manutenzione su condizione).

## Stato roadmap
Vedi `vault/ROADMAP_SETTIMANA.md`. Vault research pronta per una
rotazione: Campo, Sentinella e Terra non hanno avuto un giro di ricerca
continua nelle ultime ore di questa sessione.

## Prossimo passo atomico
Candidati aperti, in ordine di prontezza:
1. Rotazione ricerca continua: lanciare un giro mirato su Campo,
   Sentinella o Terra (in background, mentre si lavora su altro) — sono
   le tre app senza un giro recente in questa sessione. Domanda mirata,
   non generica: "prima il mondo, poi la nostra app", con la prova di
   aver guardato il codice per ogni "non c'è".
2. Rischio chimico in Scudo (`RICERCA_CONTINUA_SCUDO.md`, tema 1): preset
   `rischio-chimico` + tipo documento "Scheda dati di sicurezza (SDS)"
   con `sostanza`/`dataRevisioneSds`/`classificazione` — costo medio,
   nessuna decisione del fondatore richiesta.
3. Non fermarsi qui per la regola del fondatore (esaurimento crediti):
   proseguire immediatamente con l'unità successiva.

## Blocchi
Nessuno.
