# Checkpoint — 33 su 33, e la verifica che mancava

**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`

```
33 banchi a posto, 0 da guardare
```

Nessun «GIRO NON VALIDO»: il guardiano dell'impronta conferma che per tutta la
durata **nessuno ha toccato moduli dati o pagine**.

È la verifica **dovuta**: il giro lanciato prima del riavvio del contenitore era
andato perso a metà, e da allora erano entrate sette unità senza conferma. Ora
ce l'hanno, ognuna con la sua controprova dentro lo stesso giro:

| banco | che cosa conferma |
|---|---|
| struttura di Genesi | l'app è passata al condiviso senza perdere il cancello di consenso né i sette id dell'editor 3D |
| nota di credito | si emette, storna, il badge cambia, la sezione compare, il riepilogo IVA la vede |
| il verbale dice come è nato il numero | la sezione dice la provenienza, o dichiara di non averla |
| la quota di base è nel sistema del rilievo | la quota cade dentro l'intervallo Z, e l'avviso sulla griglia fitta compare e tace dove deve |

E i tre banchi riparati stamattina — `navigazione`, `sconto del cliente`,
`punti della nuvola` — girano davvero e passano, con le loro controprove: sono le
**76 asserzioni** che il giro non stava eseguendo.

## Lo stato, misurato

- prove `node`: **1.396** (kpi 1042, stile 264, helper 48, pointcloud 26,
  manifest 9, demo 7), copertura **433/433**;
- banchi del browser: **33 su 33**;
- le 106 con l'emulatore Firestore non girano in questo ambiente (le fa la CI).

## Prossimo passo atomico

Dalle schede, in ordine di valore:

1. **registro costi esteso** di Conti — il censimento lo indica come la porta
   d'ingresso obbligata alla marginalità: senza costi, «quanto guadagno» non si
   può nemmeno cominciare. ⚠️ E la ricerca del 03/08 ha già corretto il
   censimento su questo: un registro costi **esiste già in Flotta**, quindi il
   lavoro è **estenderlo**, non scriverne un secondo;
2. **analisi causa-radice (5 Perché)** di Scudo, che si aggancia agli infortuni
   appena messi in pagina;
3. **piano di coltivazione a lotti** di Terra, legato al ripristino ambientale.
