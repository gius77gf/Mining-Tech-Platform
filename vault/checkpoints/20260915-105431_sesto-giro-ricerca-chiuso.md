# Checkpoint — 2026-09-15T10:54:31Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
dfee23ff (pushato)

## Cosa è stato completato

Chiuso il sesto giro di ricerca mirata (Flotta, Sentinella, Deepwork ID),
lanciato stavolta con `isolation: "worktree"` per ogni agente — la
lezione pagata nel quinto giro (collisione fra agenti nella stessa
cartella, lavoro perso). Ha funzionato per l'isolamento (nessun commit
perso per collisione), ma ha introdotto due problemi nuovi da imparare:

1. **La worktree isolata parte da un commit vecchio** (fine agosto, non
   da HEAD di questa sessione): i numeri di riga negli output degli
   agenti non corrispondevano al codice vero. Riverificato ogni claim di
   persona sul codice attuale prima di fidarsene — in un caso (Sentinella)
   le righe combaciavano comunque, in un altro (Flotta) no, e in nessun
   caso ci si è fidati del numero senza aprire il file.
2. **Le worktree rimaste montate sotto `.claude/worktrees/` inquinano i
   controlli che scandiscono il filesystem** (non git-aware):
   `run-stile.mjs` vedeva 48 "pagine non guardate da nessuna regola" che
   erano copie delle app dentro le worktree degli agenti. Ripulite tutte
   (comprese due, non tre: un agente Sentinella era andato in crash per
   "autocompact thrashing" — esaurimento di contesto del sub-agente
   stesso, non un difetto del repository — e rilanciato con successo) più
   una worktree residua da un'unità precedente a questa compattazione,
   mai rimossa. `run-stile.mjs` torna pulito (328/0) solo dopo la pulizia.

**Le sei lacune proposte, verificate di persona una per una**:
- **Flotta — 2 confermate**: nessuna manutenzione decisa da un trend di
  consumo/costi/fermi, solo soglie fisse (`urgenzaManutenzione`,
  `prioritaOperative`). Verificato: `grep -in "trend|predict|degrad"
  apps/flotta/flotta-data.js` → zero, confermato sul codice di questa
  sessione (non solo sulla worktree).
- **Sentinella — 2 confermate**: `confrontoMesi` confronta sempre e solo
  mese-in-corso vs mese-prima, mai una serie più lunga; `riepilogoReclami`
  non raggruppa per `ricettoreId`. Entrambe verificate leggendo le
  funzioni per intero sul codice attuale.
- **Deepwork ID — 1 confermata, 1 ridimensionata**: `removeMember` fa
  solo `memRef.delete()` senza decidere che fine fanno i dati del membro
  rimosso — confermato, ed è una **decisione di prodotto**, non un bug:
  aggiunta come **decisione 30** in `docs/DECISIONI_WEEKEND.md` (decisioni
  aperte 16→17), risposta di default dichiarata (soft-delete) se il
  fondatore non risponde entro la settimana. L'altro gap proposto
  dall'agente (`inviteMember` non controlla se l'email esiste già) aveva
  il fatto grezzo vero ma la conclusione sbagliata: letta `acceptInvites`
  riga per riga, gestisce correttamente sia l'utente nuovo sia quello già
  esistente — non è entrato come lacuna.

**Verifica**: `sintassi-pagine.mjs` 34/34, `omonimi-a-maiuscole.mjs` 4/0,
`numeri-nei-documenti.mjs` 43/0, `run-stile.mjs` 328/0 (dopo la pulizia
delle worktree). Nessun codice applicativo toccato in questa unità: solo
documenti di ricerca e la nuova decisione — non serve il giro completo
isolato (nessuna cascata di prove da aggiornare).

## Stato roadmap

Sesto giro di ricerca chiuso: 3 app coperte, 6 lacune proposte, 5
confermate, 1 ridimensionata/scartata dopo verifica. Nessuna delle 5
lacune confermate è ancora un fix di codice: sono candidati per il
prossimo blocco, insieme alle due lacune costose di Terra rimaste aperte
dal quinto giro.

## Prossimo passo atomico

Scegliere una lacuna confermata da trasformare in fix, seguendo lo stesso
schema del quinto giro (fix scoped + test + verifica isolata +
checkpoint). Candidati più economici, in ordine: Sentinella —
aggregazione reclami per `ricettoreId` in `riepilogoReclami` (piccolo,
dati già presenti); Flotta — nessuno dei due è "piccolo" (entrambi
richiedono storicizzare valori oggi calcolati "a periodo"), quindi
rimandabili a un blocco con più tempo. In parallelo o subito dopo, per
non fermarsi: un settimo giro di ricerca mirata su un'area non coperta
finora in questa sessione, o una seconda iterazione di qualità/estetica
su un'app già toccata — **stavolta senza lanciare nuovi agenti
`isolation:"worktree"` per la ricerca**, dato il costo aggiuntivo di
riverifica dei numeri di riga misurato in questo blocco: la condivisione
della cartella va evitata SOLO quando più agenti scrivono nello stesso
momento (come nel quinto giro); per un giro con agenti che scrivono su
file diversi in sequenza/con verifica finale come questo, la cartella
condivisa senza isolamento (con verifica accurata prima di ogni commit,
come fatto per tutte le unità di codice di questa sessione) resta più
semplice e i numeri di riga restano quelli veri. Nessuno stop volontario:
si prosegue subito.
