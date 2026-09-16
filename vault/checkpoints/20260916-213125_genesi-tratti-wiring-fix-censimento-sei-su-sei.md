# Checkpoint — 2026-09-16T21:31:25Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
a6ee8cd9

## Cosa è stato completato
Censimento a doppio punto di chiamata completato sull'ultima app della
sessione: Genesi. **Sesto difetto vero su sei tentativi** (Campo, Terra,
Conti, Sentinella, Scudo, Genesi tutti sì; Flotta no, ma con la ragione
scritta). Delegato a un agente Explore in background (adattando il mandato
alla diversa architettura di Genesi — un'unica pagina, non un modulo dati
separato) e verificato personalmente riga per riga prima di agire.

Trovato: `d2Snap` (annulla/ripristina, `genesi.html:6172-6179`) copia
`D2.tratti` con tutto l'oggetto, con un commento del 14/09 (G47d) che
spiega perché — un tratto importato porta anche `origine:'dxf'`.
`volSnapshot` (il salvataggio vero in Home, `genesi.html:5083-5114`) non
menzionava affatto `tratti` nell'oggetto `design`. Verificato il
consumatore (`drawDesign2D`, riga 6029, disegna `D2.tratti` sulla tela) e
la porta di rientro (`Object.assign(D2, design)` nel gestore «Apri», riga
5219) — senza `design.tratti`, il riapri non lo tocca mai. Il suo stesso
elenco `_avvisi` (fori illeggibili, cataloghi sconosciuti) non diceva
nulla sui tratti persi, perché il dato era già sparito un passo prima.

Corretto: `tratti:D2.tratti||[]` aggiunto all'oggetto `design`.

**Errore preso e corretto durante la verifica, non dopo il commit**: la
prima stesura del test browser (`genesi-tratti.mjs`) disegnava un tratto e
cliccava subito «Apri» sulla stessa pagina — `D2.tratti` restava in
memoria dal disegno appena fatto, quindi la controprova restava verde
(11/11) anche col difetto rimesso: l'iniezione non aveva iniettato niente,
perché lo stato che si voleva dimostrare perso non se n'era mai andato
(la terza delle cinque cause di CLAUDE.md). Corretto ricaricando la pagina
(`pg.reload()`) fra salvataggio e riapertura — solo così la controprova
cade davvero (10/11, KO atteso). Eseguito realmente col browser
(Playwright), non solo letto: con il fix (11/11) e con la controprova
rimessa (10/11).

Toccati:
- `apps/genesi/genesi.html`: una riga (`tratti:D2.tratti||[]`) più un
  commento.
- `apps/deepwork-id/tests/browser/genesi-tratti.mjs`: nuovo caso
  salva→ricarica→riapri, eseguito realmente due volte.
- `docs/RICERCA_CONTINUA_GENESI.md`: nota di chiusura, con la lezione sulla
  prima stesura della prova che non provava niente.

Nessun test `node` aggiunto (Genesi vive fuori dal giro `node`): run-kpi
invariato a 3109, nessun tocco al doc-cascade (i numeri non sono cambiati,
non c'era ragione di toccarli). Giro isolato su worktree pulita: **41/41
comandi, 0 caduti, 4088 asserzioni** — invariato, come previsto.

## Stato roadmap
**Il censimento a doppio punto di chiamata è ora concluso su tutte e sei
le app di questa sessione**: sei tentativi, sei difetti veri corretti
(Campo, Terra, Conti, Sentinella, Scudo, Genesi), due candidati scartati
con la ragione scritta (Flotta/mezzi, Scudo/lavoratoreId). Non c'è
un'altra app su cui ripetere questo identico metodo per la prima volta.

## Prossimo passo atomico
Nessuna delle strade "binario 2" aperte in questa sessione (P2 di ASSENZA,
censimento a doppio punto di chiamata) ha più lavoro pronto senza una
nuova indagine o una decisione del fondatore. Per la prossima unità, in
ordine di preferenza:
1. **Tornare alla lista "SE LA ROADMAP SEMBRA FINITA" di CLAUDE.md**:
   seconde iterazioni sulle app verticali (CRUD mancanti, filtri,
   validazioni, stati vuoti, UX/estetica con screenshot), P3 di ASSENZA
   (la riga di convenzione in testa al CSV, misurata come costosa il
   16/09 ma non impossibile — richiede insegnare a tutti e 21 i lettori
   a riconoscere e scartare la riga prima del controllo sull'intestazione),
   revisione qualità/sicurezza di ciò che è su main, nuova deep-research a
   rotazione partendo da un'app che non ha avuto ricerca oggi.
2. **Decisioni di prodotto lasciate esplicitamente aperte oggi**, se si
   preferisce proporle al fondatore invece di continuare la ricerca: il
   round-trip CSV completo per i mezzi di Flotta, la risoluzione per nome
   del lavoratore nel CSV infortuni di Scudo.
La scelta è aperta al prossimo ciclo.

## Blocchi
Nessuno.
