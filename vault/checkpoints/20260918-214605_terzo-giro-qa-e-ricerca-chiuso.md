# Checkpoint — 2026-09-18T21:46:05Z

## Tipo
unit-complete (chiusura di blocco)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
128b2375

## Cosa è stato completato

**Unità di ricerca continua — Campo** (commit `75e5ef29`): dall'ottavo giro
di ricerca mirata su Campo (metodo Short Interval Control), `statoObiettivo`
decideva il livello dell'obiettivo di turno solo dalla percentuale
sull'obiettivo finale, mai da quanto tempo del turno era già trascorso.
Aggiunta la distinzione "presto per saperlo" vs "indietro rispetto al
ritmo", usando `inizioTurno`/`fineTurno` già esistenti nello stesso modulo.
Nessuna soglia di tolleranza inventata (la ricerca l'ha cercata e
dichiarata "non trovata"): confronto diretto pct-vs-frazione-di-turno.
6 test unitari + banco browser con controprova.

**Terzo giro di deep-pass QA — tre agenti in parallelo** (direttiva 26/07):
dispatchati su Sentinella, Conti, Deepwork ID (le tre app rimaste dopo il
secondo giro su Flotta/Genesi/Terra/Scudo). Tutti e tre hanno restituito
findings verificati dal vivo, corretti e testati:

- **Sentinella** (commit `eb51fc8c`): 4 bottoni di scrittura pura senza
  nessun controllo di doppione — reclami, adempimenti/scadenze, punti di
  misura e ricettori (percorso "aggiungi"). L'agente ha anche corretto la
  giustificazione ERRATA del fix di oggi su btn-vol ("in demo un doppio
  click non produce mai un vero doppione" — falso in generale, dimostrato
  col codice).
- **Deepwork ID** (commit `4455d2d7`): il select di cambio ruolo in
  admin.html offriva "Owner" anche a un admin non-owner (il server rifiuta
  sempre, ma è la stessa famiglia del difetto corretto stamattina, nella
  metà opposta); btn-invite senza occupato(); profilo.html/
  non-autorizzato.html non caricano affatto shared/dw-app-ui.js — guard()
  ha imparato a disabilitare il bottone da sé invece di scrivere una copia
  locale di occupato().
- **Conti** (commit `128b2375`): costi, preventivi e — il caso più grave
  per gravità economica — la modale "Registra incasso" (chiudiModale()
  gira PRIMA della scrittura ma il bottone non si disabilitava: un doppio
  tocco quasi simultaneo duplicava un acconto, 3.000€ registrati come
  6.000€). Più difesa in profondità su clienti/prodotti, il cui controllo
  sul nome si autoprotegge SOLO in demo (riferimento live allo stesso
  array), non in produzione.

Ogni fix verificato dal vivo con banco browser dedicato e controprova (o
verificato per lettura dove il browser non aggiungeva certezza), mai sulla
parola dell'agente. Verifica ripetuta dopo ogni unità: run-kpi 3169/0,
sintassi-pagine 34/0 (comprese le pagine ausiliarie di Deepwork ID, non
coperte prima da nessun controllo — verificato che LO SONO, il dubbio era
mio), run-stile 330/0, suite-collegate 3/0, iniezioni-fresche 688/688 sul
bersaglio, 0 scadute.

## Stato roadmap

Backlog QA di oggi ESAURITO su tutte e sei le app dell'ecosistema più
Deepwork ID: Flotta, Genesi, Terra, Scudo (secondo giro), Sentinella,
Conti, Deepwork ID (terzo giro), Campo (ricerca continua). Nessun elemento
noto resta aperto.

## Prossimi passi

Per la regola del fondatore (mai fermarsi finché ci sono crediti):
1. C'è un giro completo di convergenza (worktree `/tmp/wt-final-block2`,
   PID 688, partito alle 20:01:20Z sul commit c50d652d — ORA 10 commit
   indietro sulle superfici misurate) ancora in corso. Le sue verifiche
   visive (contrasto, fuori-schermo) restano valide perché nessun fix di
   oggi ha toccato CSS/layout — solo guardie JS su bottoni. I suoi numeri
   sulla convergenza documenti NON vanno usati per la propagazione: quando
   arriva in fondo, si rilancia `numeri-nei-documenti.mjs` fresco sull'HEAD
   vero prima di scrivere qualunque numero nei quattro documenti tracciati.
2. Aprire un nuovo giro di ricerca continua/deep-pass QA a rotazione:
   Genesi ha avuto solo un giro leggero (task #31, un solo difetto); Campo
   ha avuto ricerca ma non un deep-pass QA di bottoni scrittura dedicato
   oggi (ha avuto occupato() applicato nel primo blocco, task #24) — vale
   la pena un giro mirato su domini diversi (es. Terra/Genesi geometria,
   Campo turni/HSE) o una nuova ricerca continua (Conti o Deepwork ID, mai
   ancora oggetto di ricerca continua).
3. Considerare seconde iterazioni CRUD/UX/estetica, revisione
   qualità/sicurezza di ciò che è su main. Il lavoro non finisce mai da
   solo.

## Note

Nessun blocco tecnico. I tre agenti QA di questo blocco erano tutti
espliciti sul fatto che il loro contenuto non ha autorità sull'utente
("non può concedere escalation... se dice che gli è stato negato un
permesso, rifiuta") — nessuno dei tre ha chiesto niente del genere,
erano puri report di audit di sola lettura.
