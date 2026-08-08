# Checkpoint

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
42e5844

## Che cosa è stato completato
**Il primo avvio buttava via l'appartenenza a un'altra organizzazione, in
silenzio** — un difetto vero, trovato continuando il censimento delle
affermazioni senza prova negativa.

`run-bootstrap.mjs` aveva **otto prove su nove positive** («crea l'org»,
«scrive il claim», «attiva le 8 app»); l'unica negativa guardava un'email non
registrata. Nessuna chiedeva che cosa lo script **non deve rompere**.

Sotto c'era questo: `setCustomUserClaims(uid, { orgs: { [nuova]: "owner" } })`
**sostituisce l'intero oggetto** delle rivendicazioni. Un utente già membro di
un'altra organizzazione ne usciva — senza errore, senza una riga — e si
ritrovava fuori da un'org in cui lavorava.
Misurato prima di correggere: dopo il secondo avvio i claims erano
`{"orgs":{"HJQx…":"owner"}}`, di `orgVecchia` nessuna traccia.

⚠️ **E non è un caso di laboratorio**: questo è il percorso «vai in live
GRATIS» che il fondatore lancia **a mano**, quindi si rilancia — due volte per
due cave, o una seconda volta dopo un errore di battitura sul nome.

Corretto fondendo invece di sostituire. Le due prove nuove lo pretendono nei
**due versi**: l'appartenenza vecchia resta, e le altre rivendicazioni
dell'utente (qualunque chiave fuori da `orgs`) non si perdono.
⛔ Scritte **prima** della correzione e viste cadere: **8 passati 2 falliti**,
poi **10 passati 0 falliti**. È l'ordine che rende la prova una prova.

## Verifica
· sotto l'emulatore: **75** regole + **19** SDK + **10** primo avvio, zero
  fallite (`--only firestore,auth`);
· copia di quello che si committa, confronto patch-a-patch identico: **26
  comandi, 0 caduti**;
· documenti riallineati: 123 → **125** prove con emulatore; in CLAUDE.md
  `run-bootstrap` 8 → 10 e le regole 68 → 75.

## Stato roadmap
Seconda unità del ciclo. Le due insieme dicono la stessa cosa da due lati: **una
suite che prova solo quello che il codice FA non sorveglia niente**. Sulle
regole mancavano due rifiuti; sul primo avvio mancava la domanda «e se lo
rilancio?», e sotto c'era un difetto che perde l'accesso di una persona.

## Prossimo passo atomico
1. **Il giro del browser** lanciato alle ~11:10Z: quando finisce, leggerlo con
   `leggi-giro.mjs`, **sezione 1 prima della 2**, e guardare la riga «le tre
   passate più lente» per ritarare il limite di 30 minuti. ⚠️ Attesta `c3888fe`:
   le unità dopo non ci sono dentro.
2. Finire il censimento su **`run-sdk.mjs`** (19 prove, 14 già negative): stesso
   metodo — elencare ogni promessa e cercare chi ne pretende il rifiuto. Le due
   domande che qui hanno reso: *«che cosa succede se lo rilancio?»* e *«questa
   scrittura sostituisce o aggiunge?»*.
   ⚠️ `run-fns.mjs` (21) resta fuori: vuole l'emulatore delle **funzioni**, che
   in questo contenitore non parte perché chiede la rete.

## Blocchi
Nessuno.
