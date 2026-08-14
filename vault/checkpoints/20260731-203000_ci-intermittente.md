# Checkpoint — 31/07/2026 20:30 UTC

## Task completato
**S28 — il difetto intermittente della CI: la corsa era nella prova, e il trigger
moriva per niente.**

| Commit | Cosa |
|---|---|
| `41ea725` | Due correzioni di natura diversa, tenute separate |

## La diagnosi, non un tentativo
Il checkpoint precedente lasciava due ipotesi: colpa del codice di produzione o
colpa della prova. Leggendo `run-fns.mjs` la risposta è **la prova**, e il
meccanismo è preciso:

1. il file comincia cancellando **tutti** gli utenti Auth e **tutti** i documenti;
2. la cancellazione dei documenti fa scattare `onMemberWrite` sulle membership che
   sta rimuovendo;
3. quel trigger arriva **in ritardo**, dopo che `mk()` ha già ricreato utente, claim
   e membership;
4. ricalcola i ruoli con quello che vede in quel momento e **riscrive i claims**: se
   atterra nell'istante sbagliato azzera l'`owner` di boss;
5. il login successivo prende un token senza ruoli, e la function risponde
   `permission-denied` invece del `failed-precondition` che la prova sta misurando.

È esattamente il messaggio comparso in CI. E la firma della corsa è che **lo stesso
commit** — due file markdown — è tornato verde al rilancio.

## Due correzioni, di natura diversa
**La prova** diventa deterministica: aspetta il claim di boss prima del login. Non è
un rimedio inventato — è lo stesso già usato due volte più sotto **nello stesso
file**, con la ragione già scritta lì. Una corsa non si spera via.

**Il trigger** smette di morire per un caso che non richiede nessuna azione.
`setCustomUserClaims` su un utente inesistente sollevava un'eccezione non gestita e
Firebase **uccideva la funzione**, portandosi dietro le invocazioni legittime in
volo. Un utente che non esiste più non è un guasto: è un fatto, e in esercizio
succede quando qualcuno cancella il profilo e la membership resta.

Si assorbe **solo** `auth/user-not-found`. Qualunque altro errore continua a far
fallire il trigger, perché lì un claim non aggiornato è un problema di sicurezza vero
e va **visto**, non nascosto.

## Onestà sulla verifica
L'emulatore delle Functions **non parte in questo ambiente** (rete chiusa:
`Unable to parse JSON: "denied by …"`). Ho provato prima di scrivere la correzione,
non dopo. Quindi la prova vera è **la CI**, che è l'unico posto dove quella suite
gira: la correzione è spinta e va guardata là. Le sei suite locali restano verdi.

Detto con precisione: di queste due modifiche, **nessuna delle due l'ho vista
passare**. Ho letto il meccanismo, e il rimedio della prova è quello che il file
stesso già applica altrove — ma finché la CI non lo conferma resta una diagnosi
motivata, non un fatto.

## Stato
Suite locali: **318 KPI**, **84 stile**, 7 demo, 43 helper, 23 pointcloud,
9 manifest. Verdi.

## Prossimo passo atomico
**Guardare l'esito della CI su `41ea725` e chiudere il cerchio.** Se è verde, la
diagnosi regge e resta da aggiungere la prova che copre il caso «membership senza
utente Auth» — oggi il ramo nuovo di `rebuildClaims` non è esercitato da nessuno, e
un ramo senza prova è un ramo che domani qualcuno toglie. Se è rossa, il messaggio
dirà quale delle due ipotesi era sbagliata, e va corretta quella e non aggiunta una
terza.

Poi si torna al prodotto, e il candidato è già scelto: **la seconda iterazione del
Quadro di Campo**. La riga del ponte P3 ci è appena entrata, ma il Quadro ha ora
quattro tessere, due cartelloni e una riga d'avviso, e nessuno ha mai guardato
l'insieme a 390 px chiedendosi in che ordine cade l'occhio. Da fare col metodo di
oggi: renderizzare, guardare, e correggere dove l'insieme è più povero della somma.

Restano aperti e già scritti: la larghezza dei comandi di Scudo (36–38 px invece
di 44, compromesso misurato), il badge dell'idoneità (caso che la WCAG 2.5.8
esenta), i dodici campi interi di Genesi verificati solo montando la guardia e non
digitando (vivono tutti in modali), e i tre punti che aspettano il fondatore —
progetto Firebase (10 minuti), permessi per ruolo, blocco del turno chiuso lato
server.
