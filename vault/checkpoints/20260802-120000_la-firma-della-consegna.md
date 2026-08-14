# Checkpoint — la firma della consegna, e la terza prova rinforzata

- **Tipo**: unità (10 prove sulla chiusura del turno di Campo)
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `afdf81e`

## L'unità

Campo era l'app **meno coperta** (26 funzioni su 73), e la chiusura del turno è
il suo punto più delicato: il rapporto di fine turno diventa un **documento**
quando porta un nome e un'ora — chi consegna, chi riceve, quando. È quello che,
in caso di contestazione, distingue un appunto da una consegna fatta.

## Due regole che tirano in direzioni opposte

1. **Chiuso vuol dire chiuso.** Una firma vale qualcosa solo se dopo la firma il
   documento non cambia più. Ma serve **l'ora**: una riga senza è un foglio
   compilato a metà, e bloccarci sopra le scritture fermerebbe il lavoro senza
   che nessuno abbia firmato.
2. **I dati vecchi restano modificabili.** Una registrazione senza giorno o
   senza turno — salvata prima che quei campi esistessero — non appartiene a
   nessun turno chiuso. Nessuna azienda si ritrova i propri dati bloccati
   dall'oggi al domani per un aggiornamento del programma.

Più: fra due chiusure dello stesso turno vale **l'ultima** (la correzione
conta); le **riaperture non si cancellano mai**, perché sono quello che rende la
correzione alla luce del sole invece che di nascosto; e il turno suggerito
**attraversa la mezzanotte** — alle tre di mattina si è ancora nel turno di
notte, che è proprio quando lo si registra.

## ⚠️ La terza prova rinforzata in giornata

«I dati vecchi restano modificabili» era scritta con un archivio in cui
**nessuna** chiusura aveva i campi vuoti: la guardia `if (!d || !t) return null`
non aveva niente da fermare, e il filtro sulla data bastava da solo. La
controprova ha risposto «non distingue».

Aggiunta all'archivio una chiusura **vecchia** con giorno e turno vuoti — che è
esattamente il caso che la regola difende — la prova cade come deve. La riga è
commentata dentro il file, così chi la legge sa perché c'è.

È la terza volta oggi che la controprova trova una prova più debole di quanto
sembrava, e le tre volte hanno avuto tre cause diverse: dati che facevano
coincidere le due risposte, difesa in profondità, e ora un archivio che non
conteneva il caso da difendere. Sono tre modi diversi di dire *«questa prova non
guarda dove crede»*.

## Stato

- **731** KPI (433 all'inizio della giornata) → **1014** prove `node`, verdi in
  UTC **e** in ora italiana
- **298 prove nuove** in giornata, **7 difetti di prodotto** trovati e corretti
- Campo: da **26/73** a **34/73** funzioni coperte

## Prossimo passo atomico

Continuare su Campo con il gruppo del **rapportino e della checklist di inizio
turno**: `eDelGiorno`, `diGiorno`, `senzaData`, `operatoriDi`, `squadraBase`, e
le funzioni dell'appello. La checklist di inizio turno è il controllo che si fa
prima di cominciare — e come le ispezioni di Scudo, quello che non è stato
spuntato non deve risultare a posto.

## Bloccanti

- Nessuno.
