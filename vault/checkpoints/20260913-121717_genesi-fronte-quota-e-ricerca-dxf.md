# Checkpoint — 2026-09-13T12:17:17Z

## Tipo
unit-complete (due unità piccole: ricerca + codice)

## App
Genesi

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`0586de7b`

## Completato

**1. Ricerca di fianco (commit `53e775e2`, già pushato)**: lanciato un
agente in background durante il lavoro sull'export DXF, con la domanda
mirata al meccanismo (regola 1 della sezione "ricerca continua" di
CLAUDE.md): come i software commerciali di blast design/CAD minerario
si difendono dall'errore di convenzione degli assi quando una geometria
esterna alimenta un calcolo di sicurezza — la stessa famiglia di
rischio della segnalazione aperta su boretrack in
`docs/DECISIONI_WEEKEND.md` §6. Trovato e scritto in coda a
`docs/RICERCA_CONTINUA_GENESI.md`, con fonti e affidabilità dichiarata
per ognuna: IREDES dichiara di gestire i sistemi di coordinate ma senza
dettaglio tecnico reperito; LandXML ha problemi noti e frequenti di
coordinate shift; Maptek BlastLogic/Deswik hanno validazione
automatica ma di PLAUSIBILITÀ (punto più vicino, tolleranze), non di
CONVENZIONE; nessun caso pubblico di incidente da errore di convenzione
assi in un import CAD per blast design (assenza dichiarata come tale,
non come prova di rischio basso). Nessun delta scritto dall'agente
(rispettata l'istruzione): quella parte spetta a chi ha il codice in
mano, quando arriverà la risposta del fondatore.

**2. G34quater — coordinate del punto fronte/piede selezionato**:
estende il disegno di precisione (G34ter) al modellamento della cresta.
⚠️ **Trovato un altro caso della stessa famiglia di collisione di
G34ter, in una forma più insidiosa**: i punti di fronte/piede vivono
per definizione vicino alla linea del fronte (la stessa zona affollata
di etichette fisse scoperta ieri), quindi ancorare l'etichetta al punto
(come per il foro) ci finisce sopra quasi SEMPRE, non solo nel caso di
bordo. Prima stesura (etichetta sotto il punto, offset diverso da
quella del foro): ci finiva sopra lo stesso, stavolta sulla quota
nominale S invece che su FRONTE. Corretto smettendo di ancorare al
punto: la coordinata si scrive nella riga libera in alto a destra (y=66,
dove il fori-mode scrive già il riepilogo a y=30 e le isocrone a y=48).
Verificato a schermo su due posizioni (bordo sinistro, dove la
collisione c'era; centro): entrambe leggibili.

Nessuna funzione nuova, nessun numero di censimento cambiato (verificato
`genesi-estraibili.mjs` 147 invariato, `numeri-nei-documenti.mjs` 43/0).
Nessuna soglia di sicurezza toccata.

Verificato sulla **copia** (git worktree): `giro-node.mjs` → **40
comandi a posto, 0 caduti**.

## Stato roadmap

Nessuna voce dedicata toccata.

## Blocchi e limiti noti

Blocco di sicurezza su geometria/flyrock/burden invariato.

⚠️ **Lezione generale da portare avanti**: in questa pagina, qualunque
elemento disegnato VICINO ALLA LINEA DEL FRONTE (in alto nel canvas 2D)
rischia di collidere con le etichette fisse che vivono lì (FRONTE, la
quota nominale B/S). Prima di ancorare un'etichetta nuova a un punto in
quella zona, verificare a schermo — non basta uno spostamento a
distanza fissa, perché la stessa distanza può bastare per un foro (più
lontano dal fronte) e non per un punto di modellamento (che sta proprio
sul fronte).

Resta aperta la domanda posta al fondatore su "aspetto più
professionale in stile CAD" vs. "struttura identica al core" (item E7
della roadmap è la stessa tensione, già presente PRIMA della richiesta
del fondatore — non ancora affrontato).

## Prossimo passo atomico

Le strade sicure su Genesi sembrano in gran parte esaurite per questo
blocco (il filone B3 di estrazione ha solo candidati safety-adjacent o
I/O-bound rimasti; il disegno di precisione ha coperto fori e
fronte/piede; l'aspetto CAD è bloccato in attesa di risposta). Opzioni
per il prossimo ciclo:
1. Attendere la risposta del fondatore (CAD-vs-struttura, o la
   segnalazione di sicurezza boretrack — la ricerca appena fatta è
   materiale extra per quella decisione, non una soluzione).
2. Item E7/E8 della roadmap (allineamento strutturale di Genesi al
   core) — MA è esplicitamente "da decidere", non da eseguire da soli:
   se si riprende, la prima cosa da fare è porre la domanda al
   fondatore, non iniziare a riscrivere la shell dell'app.
3. Una nuova ricerca di fianco, questa volta su un argomento diverso
   (regola 1: "prima il mondo, poi la nostra app" — argomenti non
   ancora coperti per Genesi: il mestiere della cava, i concorrenti,
   le norme citate).
Continuare senza fermarsi (regola del fondatore) scegliendo fra queste.
