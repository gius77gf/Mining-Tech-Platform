# Checkpoint — 2026-09-14T03:40:07Z

## Tipo
scomposizione (nessun codice toccato — pianificazione prima di scrivere)

## App
Genesi

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Completato

Scomposta la voce di roadmap **G7** (ottimizzatore di volata) usando la
ricerca di fianco già raccolta oggi in `docs/RICERCA_CONTINUA_GENESI.md`
(sezione 14/09, verificata e corretta due volte prima di questo
checkpoint), applicando la stessa disciplina già usata per B0-septies:
scomporre PRIMA di scrivere codice, perché la roadmap stessa avverte che
"farla a metà è la trappola".

**Trovato**: un ottimizzatore "vero" (multi-obiettivo, con la vibrazione)
non è una fetta piccola, perché la sequenza di sparo — che decide la MIC e
quindi la PPV — vive in `computeSeq2D`, nella PAGINA, non nel modulo dati
(verificato di nuovo con grep: 0 righe in `genesi-data.js`, 15 in
`genesi.html`). Costruirlo comunque vorrebbe dire o estrarre prima quella
logica (un cantiere B3 a sé), o duplicarla dentro l'ottimizzatore — la
**terza copia** della stessa domanda, esattamente il difetto che CLAUDE.md
chiama "una copia nasce da una firma troppo stretta".

**Deciso**: la prima fetta onestamente piccola è una curva
**burden → carica necessaria per la stessa frammentazione target**, che
riusa funzioni già pure e già in `genesi-data.js`
(`caricaDaX50Target`, `consumoSpecifico`, `volumeForo`) senza toccare
vibrazione, sequenza o nessuna soglia di sicurezza. Scritta come nota
datata dentro la voce G7 esistente in `vault/ROADMAP_SETTIMANA.md`, non
come una nuova decisione: è una scomposizione, non un "no" a nessuno.

**Non implementato in questo blocco**: il tempo rimasto in questo ciclo non
bastava a farlo con la verifica come si deve (test con iniezione del
difetto — provare che il vecchio comportamento manchi — e possibilmente
una prima verifica a schermo se si decide di wirarlo a un pulsante).
Rimandarlo dichiarato è meglio di scriverlo di corsa: è la stessa lezione
di "il punto stabile serve a rendere sicura l'interruzione, non a
giustificarla" applicata al contrario — qui l'interruzione non è per
esaurimento crediti, è per non consegnare un pezzo a metà di una feature
che tocca frammentazione e costo.

## Stato roadmap

G7 resta aperta (`[ ]`), con la scomposizione scritta dentro la voce
stessa: il prossimo cantiere su G7 parte da lì, non da zero.

## Blocchi e limiti noti

Nessuno nuovo. Le due segnalazioni aperte restano invariate (boretrack §6,
USBM/DIN §9 in `docs/DECISIONI_WEEKEND.md`).

## Prossimo passo atomico

1. Implementare `curvaBurdenCarica` (o nome simile) in `genesi-data.js`:
   dato un intervallo di burden, un rapporto S/B, diametro, profondità,
   fattore roccia A, RWS e la frammentazione target, per ogni burden nella
   griglia calcola `volumeForo`, poi `caricaDaX50Target` per la carica
   necessaria, poi `consumoSpecifico` per il pf risultante — ritorna un
   array di righe, ognuna che dichiara se è fuori dominio (riusa i flag
   che `caricaDaX50Target` già espone).
2. Test in `run-kpi.mjs`: caso sano, caso con un burden fuori dominio in
   mezzo alla griglia (deve dichiararlo, non saltarlo), iniezione del
   difetto (es. dimenticare il flag `fuoriDominio`) per provare che il
   test sa fallire.
3. Solo dopo, e come unità a sé: decidere se e come mostrarla a schermo
   (un pulsante nel pannello parametri, una tabella nella scheda) — non
   prima di aver visto che i numeri della funzione pura sono giusti.

Nessuno stop volontario: si prosegue subito, o con questa implementazione
se il tempo lo permette, o con un'altra voce dell'indice.
