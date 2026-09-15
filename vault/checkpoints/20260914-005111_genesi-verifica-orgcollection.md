# Checkpoint — 2026-09-14T00:51:11Z

## Tipo
verifica (nessun codice toccato)

## App
Genesi

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`1326281b` (canarino di questo ciclo)

## Completato

Il prompt fisso della routine di oggi (nuova settimana, "fase dei
dettagli di ogni app") conteneva questa riga: **"⛔ Genesi NON esce dal
browser (localStorage, zero orgCollection): finché resta così, nessun
ponte di dati verso Genesi è possibile. Prima quello."** — presentata
come il primo prerequisito per il lavoro sui ponti fra le app.

**Verificato con la misura, non creduto sulla parola del prompt**
(regola di CLAUDE.md: "niente entra sulla parola dell'agente", qui
applicata al prompt stesso): letto `genesiData()` in
`apps/genesi/genesi-data.js` (righe 2357+) e `docs/MAPPA_ECOSISTEMA.md`
sezione 4. **La riga è scaduta**: il gap è stato chiuso il **02/09**, in
quattro unità documentate in `docs/GENESI_FUORI_DAL_BROWSER.md` §5.

Da quel giorno:
- `genesiData()` usa `orgCollection` su cinque collezioni
  (`volate`, `riconciliazioni`, `nuvole`, `previste`, `piani`) quando
  l'utente è membro di un'organizzazione, con fallback a `localStorage`
  solo senza rete/login/organizzazione — misurato staccando la rete al
  browser e sotto l'emulatore (81 prove).
- Tre ponti di DATI (non solo file) sono già vivi: Terra legge le
  lavorazioni della nuvola di Genesi (`api.nuvoleGenesi`); Genesi scrive
  le volate «per Sentinella» che Sentinella legge con una seconda
  istanza dell'SDK; Genesi legge il consuntivo di carico di Campo e
  scrive il piano di carico che Campo rilegge dall'organizzazione.
- `docs/MAPPA_ECOSISTEMA.md` §4 documenta questo stesso storico e
  marca ESPLICITAMENTE la vecchia affermazione ("Genesi non usa
  orgCollection nemmeno una volta") come "riga del 02/09, superata dal
  blocco ✅ qui sopra" — cioè il documento che il prompt fisso cita
  come punto di partenza si era già corretto da solo, e il testo del
  prompt fisso non ha recepito la correzione.

**Conclusione**: nessuna unità di lavoro necessaria su questo punto. Il
prompt fisso della routine (probabilmente generato o aggiornato prima
del 02/09) va considerato scaduto su questa riga specifica, esattamente
come questo repository ha già imparato a fare con documenti di ricerca
e checkpoint che invecchiano — qui è capitato al testo generato dalla
routine stessa, non a un documento del repo.

## Stato roadmap

Nessuna voce toccata: non c'era un vero gap da colmare.

## Blocchi e limiti noti

Invariati (segnalazione boretrack sezione 6, soglie di sicurezza
sezione 9 — entrambe in `docs/DECISIONI_WEEKEND.md`, entrambe in attesa
del fondatore).

## Prossimo passo atomico

La direttiva "concentrati solo su Genesi" resta in vigore (confermata
nel canarino di questo ciclo, `vault/ULTIMO_CICLO.md`). Con il gap
"Genesi non esce dal browser" chiuso da tempo e non da fare, le strade
aperte restano quelle già scritte nei checkpoint del blocco precedente
(13/09): le estrazioni B3 rimaste sono safety-adjacent o I/O-bound; il
disegno di precisione è completo; l'aspetto "CAD" è bloccato su E7;
otto ricerche di fianco hanno coperto ampiamente la regola 1 di
CLAUDE.md per Genesi. Prossima azione ragionevole: rileggere
`vault/ROADMAP_SETTIMANA.md` per intero alla ricerca di una voce
Genesi ancora aperta e non ancora considerata in questo blocco, prima
di aprire una nuova ricerca di fianco o attendere risposta del
fondatore.
