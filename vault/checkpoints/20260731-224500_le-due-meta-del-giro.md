# Checkpoint — le due metà del giro, e una regola che ho deciso di non scrivere

- **Tipo**: tre unità di irrobustimento sulla stessa scoperta
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `2f6ffab` (l'audit riaperto), `703ad3b` (il valore cattivo su tutti
  e sette), + il controllo sul lato export

## Il difetto stava dall'altra parte di dove guardavo

Le prove del «valore cattivo» costruiscono la riga con `csvCell` e poi la
rileggono. Provano che il **lettore** sa disfare quello che `csvCell` ha fatto —
**non** che l'export lo abbia usato. E il difetto di Sentinella stava
esattamente lì: l'esportazione scriveva l'**unità** senza protezione.

È la stessa forma annotata oggi in `CLAUDE.md`: *il controllo che non guarda
dove crede*. Qui il controllo guardava una metà del giro e io credevo guardasse
tutte e due.

Ora ci sono **entrambe le metà**:

- **lato lettore**: i tre valori cattivi — un nome col punto e virgola, uno che
  sembra una formula (`=SOMMA(A1:A9)`), uno con le virgolette — girano su
  **tutti e sette** gli export che promettono di ri-caricarsi, non su due;
- **lato export**: sei controlli leggono la riga **vera nel sorgente** e contano
  le protezioni, perché ogni colonna di testo ne vuole una. Sui ricettori ce
  n'erano **2 dove ne servono 5**. Controprovato rimettendo il difetto vero: il
  controllo cade dicendo proprio «2 protezioni, ne servono almeno 5 (nome, tipo,
  classe, unità, nota)».

**KPI 402 → 426.**

## L'audit riaperto, e perché conta più della correzione

La voce 9 di `AUDIT_SICUREZZA.md` («iniezione CSV») era **CHIUSA** dal 21/07.
L'helper c'era e funzionava; quello che mancava era applicarlo al codice scritto
**dopo** — l'export dei ricettori è nato il 30/07, nove giorni dopo la
chiusura. Non era solo un problema di ricaricamento: un valore che inizia con
`=` usciva **senza apostrofo di guardia**, cioè eseguibile come formula. Cioè
esattamente ciò che quella voce doveva chiudere.

Scritta la lezione nel documento: **una voce «CHIUSA» dice che il difetto di
allora è stato tolto, non che non possa rinascere altrove.**

## La regola che ho deciso di NON scrivere

Sarebbe stato naturale fare una regola di stile: *«ogni campo di un export passa
da `csvCell`»*. L'ho misurata prima: delle **171** interpolazioni dentro le
righe di export, **75** non ci passano — e quasi tutte sono **numeri e date**,
sicure per costruzione. Sarebbero 75 falsi allarmi, e una regola che grida
sempre viene spenta dopo due giorni.

È la seconda volta oggi che una misura mi dice di **non** irrigidire (la prima
era la regola generica sulle righe d'intestazione). La difesa di comportamento —
il valore cattivo che deve tornare identico — non ha falsi positivi e prova la
cosa vera.

## Prossimo passo atomico

Il **RIEPILOGO del giro definitivo** del browser (in corso da mezz'ora, banco 4
su 13). Da leggere e sistemare quello che è rosso: è la verifica che manca a
tutta la giornata.

## Bloccanti

- Nessuno.
