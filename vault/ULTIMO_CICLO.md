# Ultimo ciclo di lavoro automatico

- **Quando**: 2026-09-14, 00:47 UTC
- **Commit di partenza**: `b6e131ac`
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`

## Che cosa sta per succedere

Repository raggiungibile, `HEAD` combacia col remoto, working tree pulita
(`git pull` senza cambiamenti).

⚠️ **Direttiva del fondatore in conversazione, più recente e più specifica
del prompt fisso di questa routine — CONFERMATA ANCORA VALIDA in questo
ciclo**: concentrarsi SOLO sull'app Genesi. Il prompt fisso di oggi
(nuovo giorno, "fase dei dettagli di ogni app", ponti fra le app,
lavoro multi-app in parallelo) resta un template generico non
personalizzato a questa direttiva puntuale: non lo seguo alla lettera
finché la direttiva resta in vigore, esattamente come nel blocco
precedente.

📎 **Nota utile dal prompt fisso di oggi, dentro il perimetro di Genesi
(non una violazione della direttiva)**: "Genesi NON esce dal browser
(localStorage, zero orgCollection): finché resta così, nessun ponte di
dati verso Genesi è possibile." Questo tocca SOLO il codice di Genesi
(più eventualmente `shared/dw-ponti.js`), quindi rientra nel perimetro
"solo Genesi" — ma prima di considerarlo un'unità da fare, va
verificato: nella sessione precedente ho letto in `genesi.html` chiamate
a `GDB.volate()`, `GDB.aggiungi('piani', …)`, `GDB.nuvole()`, `GDB.piani()`
— da capire se `GDB` è già il client org-aware condiviso (in tal caso
l'affermazione del prompt fisso sarebbe scaduta) o un wrapper locale che
imita la stessa interfaccia sopra `localStorage` (in tal caso l'affermazione
è vera e il gap è reale). Prima azione di questo ciclo: leggere `GDB` e
deciderlo con la misura, non supporre.

⛔ **SEGNALAZIONE DI SICUREZZA APERTA, INVARIATA — DA LEGGERE PRIMA DI
TOCCARE GEOMETRIA/FLYROCK/BURDEN.** Il gate su
`deviazioneForiDaCsv`/`burdenVeroDaRilievo` (import del rilievo boretrack)
resta bloccato sul fondatore: dettaglio in `docs/DECISIONI_WEEKEND.md`
(sezione 6, con una nota aggiunta il 13/09 che rimanda a una ricerca di
fianco sulla convenzione degli assi — materiale extra, non una
soluzione). Fino a risposta: **nessuna unità MODIFICA la geometria del
fronte 3D, il flyrock o il burden reale per foro** — lettura/analisi resta
permessa. Le soglie di sicurezza USBM/DIN restano un'altra decisione
aperta (sezione 9 di DECISIONI_WEEKEND.md), invariata.

## Cosa è successo nel blocco precedente (13/09, dopo la richiesta diretta del fondatore "rendere Genesi più simile a un CAD")

**Prodotto — "tutte e tre le alternative" (risposta del fondatore via
AskUserQuestion), parti 1 e 2 coperte tecnicamente**:
- Export DXF del piano fori (fori + profilo fronte), verificato con un
  vero lettore DXF (`ezdxf`) che ha trovato e fatto correggere un bug
  reale (`LWPOLYLINE` invalido) prima del commit.
- Disegno di precisione completo: aggancio alla griglia opzionale,
  coordinata x del foro in chiaro, quote a schermo per fori e per
  punti fronte/piede (due collisioni reali con etichette fisse trovate
  SOLO aprendo la pagina con Playwright, mai a occhio sul codice),
  distanza fra due fori qualunque selezionati in sequenza.
- Parte 3 (aspetto "CAD") resta ferma: in tensione con la regola
  "struttura identica al core" (item E7 della roadmap, preesistente
  alla richiesta) — domanda posta al fondatore, nessuna risposta
  ancora arrivata.

**Filone B3 ("Genesi continua a uscire dalla pagina")**: due funzioni
estratte da `genesi.html` a `genesi-data.js` (`misuraGeom2D`,
`_puntiNuvola`), entrambe casi del solito falso positivo del
censimento statico (variabili locali o parole nei commenti scambiate
per variabili del modulo), con test che catturano i difetti storici
che quelle stesse funzioni avevano già causato.

**Ricerca di fianco**: otto round in background, tutti raccolti in
`docs/RICERCA_CONTINUA_GENESI.md` e VERIFICATI a mano prima del commit
(non solo fidandosi del riepilogo dell'agente) — tre avevano difetti di
processo reali (un file mai scritto nonostante il "fatto", un timestamp
fabbricato, una giunzione fra sezioni corrotta da un append), corretti
tutti prima che raggiungessero un commit. Argomenti: import CAD/DXF e
sicurezza degli assi (materiale per la segnalazione sopra), contenuto
di un rapporto di volata, vocabolario tecnico-minerario (confermato
pulito), quattro concorrenti enterprise (BlastLogic, JKSimBlast,
SHOTPlus, RIOBLAST), norme di vibrazione (USBM/DIN 4150-3/UNI 9916,
confermate di seconda mano), dichiarazione annuale/ispezioni in cava
(più vicine a Scudo/Terra, dichiarato), standard IREDES (scoperta:
nessuna fonte conferma uno schema IREDES "BlastPlan" per carica/
ritardi — solo "DrillPlan" per la geometria; il codice di Genesi
dichiara già onestamente "non conformità certificata", nessuna
correzione necessaria).

**Verifica**: ogni unità di codice passata dal giro completo
(`giro-node.mjs`, 40 comandi) su una `git worktree` isolata prima del
commit — sempre 0 caduti alla consegna. Container riavviato durante
l'attesa dell'ottava ricerca: verificato subito dopo la ripresa che
nessun lavoro fosse andato perso (`HEAD` combaciava col remoto).

## Prossimo passo atomico

1. Leggere `GDB` in `genesi.html`/`shared/` per stabilire con la misura
   se Genesi scrive già nell'organizzazione condivisa o solo in
   `localStorage` — prima di decidere se "Genesi non esce dal browser"
   è un gap vero o un'affermazione scaduta del prompt fisso.
2. Se il gap è confermato reale: è un cantiere grande (persistenza dei
   dati), da scomporre in unità piccole e verificabili una per volta,
   non un salto unico — e da valutare se serva prima una domanda al
   fondatore data la sua portata, oppure se rientri comunque nel "resto
   di Genesi... resta aperto" già scritto sopra.
3. In parallelo/alternativa: continuare con altre unità sicure su
   Genesi (rilettura di `vault/ROADMAP_SETTIMANA.md` e del checkpoint
   più recente per `date-checkpoint.mjs` per eventuali voci aperte non
   ancora considerate), o ricerca di fianco su un argomento ancora
   scoperto.

Nessuno stop volontario: si prosegue subito con la prossima unità dopo
il canarino.
