# Checkpoint — Conti 12/12 aperti col browser

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Task completato
**Tutti e dodici i documenti di Conti sono ora aperti col browser**, premendo il
bottone e leggendo il file che esce. Il banco passa a **68 asserzioni**.

I sette che restavano — situazione fatture, la copia degli incassi, clienti e la
sua copia, la copia delle pesate, listino e gare — sono **puliti**. Sei di loro
delegano a una funzione del modulo, quindi il valore aggiunto dell'apertura è
minore: la decisione la prende il modulo, che le prove `node` già chiamano. Ma è
**misura, non deduzione**, ed è la sola forma in cui questa famiglia si lascia
prendere.

## Quello che il censimento dice, adesso che è chiuso
**I tre difetti di Conti stanno tutti fra i sei documenti che compongono il CSV
DENTRO LA PAGINA.** Nessuno dei sei che delegano al modulo ne aveva. Non è una
coincidenza: è la conferma che il **censimento strutturale** — *chi chiama chi*
— è il primo setaccio da passare, perché divide i dodici in due metà di cui una
sola ha bisogno di essere letta riga per riga.
Vale come regola operativa per la prossima app: **prima si guarda quali export
chiamano una funzione del modulo, poi si legge solo l'altra metà.**

⚠️ **E la profondità NON è uniforme, scritto nell'intestazione del banco perché
nessuno legga il verde più largo di quello che è.** Sui tre dove il difetto
c'era le prove confrontano **numero per numero** il file con quello che la
schermata dice nello stesso istante. Sui nove restanti le domande sono più
larghe — il file esce, non è la sola intestazione, nessuna cella dice
«undefined», «null» o «NaN». Lì «pulito» vuol dire «nessuna di QUESTE domande
ha trovato niente».

## Verifiche
- banco Conti: **68 passati, 0 falliti**, 12 punti d'uscita su 12
- controprova: **3 KO voluti**, coi 4 difetti rimessi davvero (il quarto non
  discrimina, dichiarato nel file con la misura che lo spiega)
- `node giro-node.mjs` → **32 comandi a posto, 0 caduti**, rifatto su una copia
  di ciò che si committa (identità della patch verificata)

## Stato del giro
51 punti d'uscita su 51, **otto difetti veri** tutti corretti.
Profondità: **aperti col browser 21** (Flotta 9, Conti 12) · **letti riga per
riga 30** (core 2, Campo 6, Sentinella 5, Terra 3, Scudo 5, Genesi 9).

## Prossimo passo atomico
1. **Il giro del browser** (pid 21084, ~2h50): quando finisce, `leggi-giro.mjs`
   dalla **sezione 0** — attesta un commit ormai di diciassette indietro,
   quindi i suoi KO sono vecchi di diciassette commit. Poi le righe «**non ho
   guardato**», poi i KO col rosso VOLUTO separato dai marcatori. Domanda:
   **quali controprove non sanno più fallire**.
2. **Il core**, che è l'unica superficie con un difetto trovato e ancora ferma
   al livello «letto»: i suoi due documenti (il CSV dei fori del modello 3D e
   il PNG del fronte) meriterebbero un banco che li apra, visto che proprio lì
   il difetto c'era ed è stato provato solo con una regola statica
   (`run-stile` 31) e con le prove del modulo.
3. La **domanda di prodotto** aperta: una voce di costo senza importo sparisce
   dal riepilogo e dal file in silenzio.

## Blocchi
Nessuno.
