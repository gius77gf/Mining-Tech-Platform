# Checkpoint — 31/07/2026 16:45 UTC

## Task completato
**S25 — il collegamento fra operatore di Campo e persona di Scudo si può fare
dall'app.** Il ponte P3 smette di funzionare solo sui dati finti.

| Commit | Cosa |
|---|---|
| `c528267` | La tendina, il comando dedicato, tre difetti trovati provando |

## La misura prima della costruzione, e stavolta ha detto sì
Il checkpoint precedente imponeva di verificare **prima** se le regole Firestore
permettono a Campo di leggere il personale di Scudo — perché altrimenti la tendina
sarebbe stata un comando incapace di funzionare, e la prima unità sarebbero state le
regole.

Verificato: `match /apps/{appId}/{document=**}` con `allow read: if memberOf(orgId)`.
La lettura fra app della **stessa organizzazione** è già permessa; nessuna regola
nuova, e il ponte regge anche in esercizio. (Nota per il futuro: chi può leggere
*cosa* dentro l'organizzazione è la questione dei **permessi per ruolo**, che aspetta
il fondatore ed è già in elenco — un capoturno non dovrebbe vedere tutto.)

## Il comando ha un posto suo
Il tocco sulla riga **cambia già la disponibilità**. Dargli un secondo significato
avrebbe reso imprevedibili entrambi, quindi il collegamento è un comando a parte
(＋ se manca, ↻ se c'è) che apre il **modale del core** — mai un dialogo del browser.
C'è una prova che verifica esattamente il rischio: dopo aver collegato, la
disponibilità **non** deve essere cambiata.

## Tre difetti trovati PROVANDO, non guardando
Questa volta lo screenshot non bastava: i difetti sono usciti scrivendo una prova
che **usa** il comando.

1. **Nessuno da collegare.** In dimostrazione tutte le persone di Scudo risultavano
   già prese, perché la copia ne conteneva quattro su sette. Chi apriva «collega»
   trovava un elenco di **sole voci disabilitate**, senza una parola di spiegazione.
   Ora la copia è completa — l'anagrafica del personale è più larga della squadra in
   turno, ed è proprio da lì che si pesca — e «nessuna persona da collegare» è uno
   **stato con la sua spiegazione**, che dice anche cosa fare (aggiungerla in Scudo).
2. **Un «non lo so» colorato di verde.** La riga di chi non è collegato prendeva
   `st-ok`, il valore di ripiego. Il colore diceva «a posto» dove il testo dice «non
   lo sappiamo»: **la stessa bugia che il conto separato dei non-collegati serve a
   evitare, detta col colore invece che con le parole.** Ora è neutro. È il difetto
   di cui vado più contento, perché avevo scritto il principio due unità prima e poi
   l'avevo violato in un posto dove non si legge.
3. **«— non collegato —» stava in fondo** all'elenco. È il valore di partenza di ogni
   nuovo operatore: la voce predefinita si cerca dove si guarda per prima.

E se Scudo non è raggiungibile la tendina non resta vuota e muta: si **disabilita e
dice perché**. Un comando che non fa niente senza spiegare è peggio di un comando
che non c'è.

## Verifica
- **Dieci asserzioni che usano il comando**: apre il modale, elenca, marca chi è già
  preso, sceglie, salva, scollega, e controlla che la nota in cima si aggiorni.
- Lo stato «tutti già collegati» renderizzato per **intercettazione**, con la
  guardia che pretende che la trasformazione abbia davvero cambiato la sorgente.
- Suite: **318 KPI**, 72 stile, 7 demo, 43 helper, 23 pointcloud, 9 manifest. Verdi.

## Stato del ponte P3, per intero
| pezzo | fatto |
|---|---|
| la regola in `shared/dw-ponti.js`, mai riscritta | ✅ |
| Campo vede i documenti di chi è in squadra | ✅ |
| Scudo sa quali scadenze riguardano chi lavora oggi | ✅ |
| il collegamento si imposta dall'app | ✅ |
| permessi per ruolo (chi vede cosa) | ⛔ aspetta il fondatore |

## Prossimo passo atomico
**Terza iterazione sul ponte P3, col metodo del confronto affiancato.** La direttiva
chiede almeno tre passaggi e questo ne ha due (Campo, poi Scudo); la terza è quella
che finora ha sempre trovato qualcosa, e va fatta **renderizzando gli stati che non
ho ancora visto**, non rileggendo il codice.

Gli stati da guardare, in concreto: (1) una persona collegata a una scheda **che non
esiste più** in Scudo (`collegamento-rotto`) — il testo c'è ma non l'ho mai visto a
schermo; (2) **nessun operatore in anagrafica** con Scudo raggiungibile: la nota in
cima non deve comparire su un elenco vuoto; (3) **tutte le squadre ferme** dal lato
di Scudo, dove la frase «nessuna squadra in turno» è scritta ma mai vista; (4) il
filtro per squadra di Campo attivo: la nota conta le persone **filtrate**, ed è da
decidere se è giusto o se deve contare tutte — oggi è implicito, e implicito vuol
dire non deciso.

Restano aperti e già scritti: la larghezza dei comandi di Scudo (36–38 px invece
di 44, compromesso misurato), il badge dell'idoneità (caso che la WCAG 2.5.8
esenta), i dodici campi interi di Genesi verificati solo montando la guardia e non
digitando (vivono tutti in modali), e i tre punti che aspettano il fondatore —
progetto Firebase (10 minuti), permessi per ruolo, blocco del turno chiuso lato
server.
