# Checkpoint — il banco della doppia data gira, e alla prima ha avuto torto lui

- **Tipo**: unità (prima esecuzione + correzione + ingresso in suite)
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `fc19246` (canarino del ciclo: `b0d08e2`)

## Cosa è successo

Il banco era stato scritto ieri e lasciato **fuori dall'elenco apposta**,
perché nessuno l'aveva mai visto girare. Oggi è stato lanciato per la prima
volta, e ha segnalato **Flotta**:

> «Fra 8 giorni (~08/08) … facesse 8 h al giorno»

Aveva torto **lui**. Quella riga è esattamente la doppia forma che la ricerca
chiede, in versione compatta perché parla di una proiezione a otto giorni, con
la tilde che dichiara che è una stima. Il mio controllo pretendeva l'anno.

Corretto il **banco**, non il prodotto. E la correzione è nella direzione
giusta — l'asserzione è diventata **più giusta, non più permissiva**: «08/08»
una data lo è davvero, e pretendere «08/08/2026» avrebbe fatto passare per
difetto una riga scritta bene.

## Perché questo episodio vale più del banco

È la dimostrazione pratica della regola che mi ero dato ieri sera: **un banco
non entra nell'elenco prima di aver girato**. Se fosse entrato a scatola
chiusa, stanotte la suite sarebbe stata rossa su una riga corretta, e la
"riparazione" ovvia sarebbe stata cambiare **Flotta** — cioè peggiorare il
prodotto per far tacere un controllo sbagliato.

## Lo stato del banco

- giro normale: **9 superfici, 0 tempi relativi senza data**
- controprova: «scade tra 5 giorni» senza data iniettato in ogni superficie,
  trovato **9 volte su 9**
- entrato in `tutti.mjs`: **17 → 19 esecuzioni**; documentato nel LEGGIMI con
  le due decisioni che lo rendono onesto invece che rumoroso (non guardare solo
  il testo proprio dell'elemento; non pretendere l'anno)

## Decisione presa sul giro completo

Il giro a 17 banchi girava da ore ed era al secondo banco: stava **confermando**
cose già verificate una per una ieri (bersagli, id, contrasto, avvio). L'ho
fermato per usare il browser dove serviva davvero — un banco mai eseguito, cioè
**scoperta** invece di conferma — e l'ho **rilanciato subito dopo** a 19 banchi.
Fermare un giro per usarlo meglio non è fermarsi.

## Prossimo passo atomico

Leggere il riepilogo del giro a **19 banchi** (in corso). Nel frattempo, lavoro
che non tocca le pagine: il dettaglio **7** della ricerca sul valore — *«il
salvataggio è visibile e onesto»*, cioè il «Salvato alle 10:32» sotto il modulo
— che va misurato prima nel modo giusto (nella pagina, non nel sorgente: è la
lezione appena pagata due volte).

## Bloccanti

- Nessuno.
