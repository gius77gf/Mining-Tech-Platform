# Checkpoint — 2026-09-13T10:37:22Z

## Tipo
unit-complete

## App
Genesi

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`e9f302b7`

## Completato

Piccolo completamento del disegno di precisione (unità precedente, G34
— aggancio alla griglia): la scheda del foro selezionato nel Progetto
2D mostrava "spalla" (my, distanza dal fronte) e "vicino" (distanza dal
foro più vicino), mai la posizione lungo la fila (mx). Aggiunta la
coordinata x in chiaro — `x N,NN m` in testa alla riga — così chi
allinea i fori a mano con l'aggancio alla griglia può **verificare** il
numero ottenuto invece di dedurlo guardando il disegno.

Nessuna funzione nuova (solo una stringa nel pannello `renderInspector`),
quindi nessun numero di censimento è cambiato: verificato con
`genesi-estraibili.mjs` (148 funzioni, 56 estraibili — invariato) e
`numeri-nei-documenti.mjs` (43 passati, 0 falliti, nessun documento da
aggiornare).

Verificato sulla copia (git worktree) di quello che si sta committando:
`giro-node.mjs` → **40 comandi a posto, 0 caduti**.

## Stato roadmap

Nessuna voce dedicata toccata.

## Blocchi e limiti noti

Blocco di sicurezza su geometria/flyrock/burden invariato (nessuna riga
di calcolo toccata, solo un pannello informativo).

Resta aperta la domanda posta al fondatore su come conciliare "aspetto
più professionale in stile CAD" con la regola "struttura identica al
core, pelo per pelo" — nessuna risposta ancora arrivata.

## Prossimo passo atomico

Con "tutte e tre le alternative" del fondatore ora coperte per la parte
tecnica sicura (DXF export G33, aggancio alla griglia G34, coordinata
in chiaro G34bis), le strade aperte restano:

1. Attendere la risposta del fondatore sulla tensione CAD-vs-struttura-
   del-core prima di disegnare qualunque toolbar/pannello in stile CAD.
2. Nel frattempo, proseguire con altro lavoro utile e sicuro su Genesi:
   quote/misure a schermo fra due punti selezionati (distanza generica,
   non solo dal vicino più prossimo) — un altro pezzo piccolo del
   disegno di precisione, sempre nel perimetro del Progetto 2D.
3. Oppure tornare al giro di ricerca continua (prossima app in
   rotazione) o alla verifica visiva rimasta in sospeso (scheda
   signature-hole).

Continuare senza fermarsi (regola del fondatore): scegliere fra le
opzioni 2 e 3 come prossima unità.
