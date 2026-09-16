# Checkpoint — 2026-09-16T20:18:23Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
fc31ca82

## Cosa è stato completato
Ripetuto il censimento a doppio punto di chiamata su Flotta (dopo Campo,
Terra, Conti). Un agente Explore in background ha proposto un candidato
(import CSV dei mezzi con solo quattro colonne — `nome;area;ore;stato` —
contro le otto del salvataggio manuale, che include anche `tipo`,
`messaInServizio`, `costoPossessoAnnuo`, `possessoDal`).

**Verificato personalmente, e la conclusione è diversa da quella
proposta dall'agente**: a differenza dei tre difetti veri trovati oggi
(dove il dato era disponibile altrove e si perdeva solo nella scrittura),
qui il dato non esiste da nessuna parte da cui prenderlo. `parseMezziCsv`
(`flotta-data.js:1161-1183`) legge strutturalmente solo quattro colonne —
lo dichiara anche il messaggio d'errore della pagina — e **non esiste
nessun `csvMezzi` esportatore** (verificato con `grep`, zero risultati):
l'import di Flotta è un onboarding di un parco nuovo, non il giro
export→import di una copia di sicurezza come per Terra/Conti.

Confermato leggendo il consumatore (`costoOrarioMezzo`, commento 11/09):
`costoPossessoAnnuo` è già un campo dichiarato opzionale con gestione
"senza il campo resta null con la ragione, mai uno zero" — un mezzo da
CSV senza possesso registrato mostra esattamente la stessa cosa di un
mezzo aggiunto a mano con quel campo lasciato vuoto. Non è una
regressione: è un limite di formato per scelta, non un difetto di
cablaggio.

**Scritto nel documento di ricerca invece di forzare un fix**: ampliare
l'import di Flotta a un round-trip completo è una decisione di prodotto
(vale la pena dare a Flotta un `csvMezzi` esportatore?), non presa qui di
proposito — la stessa disciplina che CLAUDE.md chiede per non tradurre
ogni scoperta di ricerca in codice sulla propria parola.

Nessun codice toccato in questa unità (solo `docs/RICERCA_CONTINUA_FLOTTA.md`).

## Stato roadmap
Il censimento a doppio punto di chiamata resta a **tre difetti veri su
quattro tentativi** (Campo, Terra, Conti sì; Flotta no, con la ragione
distinta e scritta). Restano non ancora provate con questo metodo in
questa sessione: Sentinella, Scudo (Scudo ha avuto una passata di
profondità nel ciclo precedente, ma va verificato se con lo stesso
metodo specifico).

## Prossimo passo atomico
1. **Provare il censimento a doppio punto di chiamata su Sentinella**
   (unica app non ancora coperta né con questo metodo né con una passata
   di profondità in questa sessione) — stesso mandato agli agenti Explore
   usato per Terra/Conti/Flotta, poi verifica personale prima di agire.
2. Se anche Sentinella non produce un candidato della stessa famiglia,
   il metodo ha reso quello che poteva rendere in questo ciclo (3/5
   tentativi, tutti e tre sull'unica famiglia di difetto che cerca): si
   torna alla lista "SE LA ROADMAP SEMBRA FINITA" di CLAUDE.md — seconde
   iterazioni sulle app verticali, P3 di ASSENZA (misurata come costosa ma
   non impossibile), revisione qualità/sicurezza, nuova deep-research a
   rotazione, o la decisione di prodotto lasciata aperta su Flotta
   (round-trip CSV completo per i mezzi) se si vuole approfondirla.
La scelta è aperta al prossimo ciclo.

## Blocchi
Nessuno.
