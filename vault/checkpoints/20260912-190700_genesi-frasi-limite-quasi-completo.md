# Checkpoint — 2026-09-12T19:07:00Z

## Tipo
correzione di banco di verifica (nessun codice di prodotto toccato)

## App
Genesi (direttiva del fondatore ancora in vigore: solo Genesi)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`0b1b5ea6`

## Completato

Chiuso (quasi del tutto) il primo blocco del "prossimo passo atomico" del
checkpoint precedente: i 4 falliti rimasti in `genesi-frasi-limite.mjs`
dopo aver corretto la navigazione bloccata dallo splash.

**Non era una causa diversa, come sembrava**: una prima misura (con una
fixture leggermente diversa da quella vera del banco) mostrava i
contatori della Home ancora vuoti dopo 20 secondi, facendo pensare a un
problema separato. Rimisurato con la fixture ESATTA (`UNO()` del banco):
a t=13s il contatore mostra correttamente "1 salvata" (grammatica
giusta) e lo splash sparisce a t=15s. **Stessa causa di sempre — lo
startup lento in questo ambiente senza GPU — solo un tempo diverso**:
`renderHome()` dipende da `GDB` (`await genesiData()`), che prova prima
una modalità "live" (SDK identità) prima di ripiegare sul locale, e
questo allunga ulteriormente il tempo prima che i contatori si
popolino.

Aggiunta una funzione `aspettaTesto(pg, leggi, tetto)` che rilegge un
valore ogni 400ms fino a 25s invece di leggerlo una volta, usata per i
tre contatori della Home (tutti e tre ora verdi). Aggiunta una variante
`aspettaToast` per i toast (aspetta che la coda non sia vuota senza
svuotarla ad ogni giro, per non perdere un toast arrivato tardi).

**Risultato: 8/36 → 35/36.**

## Blocchi e limiti noti

⛔ **Resta UN fallito**: "Volata importata: 1 foro" (il toast dopo
l'import di un file JSON, subito dopo `apri()`, prima di qualunque
navigazione). Causa diversa e più sottile delle altre: il banco
intercetta `window.toast` salvando la funzione precedente
(`const o = window.toast`) 2,6s dopo il caricamento. Se il vero
`window.toast` dell'app non è ancora definito a quel punto, o se
l'app lo ridefinisce DOPO che il banco l'ha intercettato, l'aggancio
si perde silenziosamente — non è un problema di "aspettare di più" sul
LETTORE (ho già provato `aspettaToast`, che aspetta la coda), è un
problema sull'ORDINE in cui banco e app si contendono la stessa
variabile globale. Correggerlo richiederebbe probabilmente spostare
l'intercettazione DENTRO `addInitScript` (eseguito prima che la pagina
carichi qualunque script, quindi sicuramente prima che l'app definisca
`window.toast`) invece che in un `evaluate()` dopo il `goto`. Non
tentato in questa unità: è un cambiamento più delicato di un'attesa più
lunga, e mischiare le due famiglie di causa (timing vs. ordine di
definizione) nella stessa unità avrebbe rischiato una correzione a
metà.

## Verifica

Controprova rilanciata: **16 KO attesi con gli 11 difetti rimessi**,
confermati (il banco sa ancora fallire). `iniezioni-fresche.mjs`:
559/559 invariato. `node --check`: sintassi valida.

## Prossimo passo atomico

Due strade, nell'ordine di probabile valore:
1. **Il singolo fallito residuo di `genesi-frasi-limite.mjs`**: spostare
   l'intercettazione di `window.toast` (e il clic sul link di download)
   dentro `pg.addInitScript(...)`, eseguito PRIMA che qualunque script
   della pagina giri — così l'ordine di definizione non conta più.
   Verificare con attenzione che questo non rompa gli ALTRI controlli
   dello stesso banco che oggi passano (i toast letti più avanti nel
   flusso, dopo una navigazione).
2. **`genesi-struttura.mjs`** (4 falliti pre-esistenti, mai indagati in
   questo blocco: Escape non chiude il modale, il campo "Salva la
   volata" non si trova al momento del controllo).
In alternativa, tornare al lavoro sul prodotto: P2.1 resta bloccato
sulla decisione #28; il cantiere B3 è in gran parte esaurito.
