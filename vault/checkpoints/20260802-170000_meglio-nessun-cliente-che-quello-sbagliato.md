# Checkpoint — meglio nessun cliente che quello sbagliato

- **Tipo**: unità (12 prove su Conti, l'ultima app non toccata oggi)
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `fecd4c1`

## L'unità

Il collegamento fra una fattura e il suo cliente: **il punto in cui i soldi
trovano un nome**. Il problema vero non è tecnico, è di **dati veri**: le
fatture vecchie hanno solo il testo libero, e la stessa azienda è scritta in
cinque modi. Se ogni variante diventa una riga, il credito guarda **cinque
clienti piccoli invece di uno grosso**.

## La regola più delicata è però l'opposta

**Un collegamento rotto non viene sostituito da un nome simile.** Se la fattura
punta a un cliente cancellato, ripiegare sul nome la attaccherebbe a
un'anagrafica che **nessuno ha scelto**.

*Meglio nessun cliente che quello sbagliato*: un sollecito mandato a chi ha già
pagato è peggio di un sollecito non mandato. Ed è interessante che sia il
**contrario** dell'altra regola della stessa unità — le varianti di scrittura si
uniscono, ma un id esplicito che non torna **non** si aggiusta indovinando. La
differenza è chi ha deciso: nel primo caso nessuno, nel secondo qualcuno.

## Le altre

- Il nome mostrato viene **dall'anagrafica** quando c'è: correggere la ragione
  sociale in un posto la corregge ovunque.
- L'elenco da collegare **unisce le varianti e porta gli id**, così si collegano
  tutte in un colpo invece che una per una.
- **Senza la densità un prezzo in €/m³ non diventa €/t**: il listino è a volume,
  la pesa dà tonnellate, e tirare a indovinare vorrebbe dire fatturare un numero
  inventato.

Controprova: **9 difetti rimessi, 9 visti, 0 non visti.**

## ⚠️ La quarta prova rinforzata in giornata

«Gli interessi si contano solo su un ritardo vero» era scritta con **zero
giorni**, dove l'aritmetica dà già zero da sola: la guardia non aveva niente da
fermare, e la controprova ha risposto «non distingue».

Il caso che difende davvero è il ritardo **negativo** — una fattura non ancora
scaduta. Senza guardia gli interessi diventano **−32,88 €**: cioè uno **sconto
per aver pagato in anticipo**, che è l'esatto opposto di quello che significa la
mora. Adesso la prova guarda lì.

Quattro prove rinforzate oggi, quattro cause diverse: dati che facevano
coincidere le due risposte; difesa in profondità; un archivio che non conteneva
il caso da difendere; e ora **un'aritmetica che dà la risposta giusta per conto
suo**. Il filo comune è sempre lo stesso: la prova passava, ma non per il motivo
scritto nel suo nome.

## Stato

- **783** KPI (433 all'inizio della giornata) → **1066** prove `node`, verdi in
  UTC **e** in ora italiana
- **350 prove nuove** in giornata, **8 difetti di prodotto** trovati e corretti,
  **1 prova invecchiata** corretta, **4 prove rinforzate**
- Tutte e sei le app toccate oggi; nessuna sotto la metà delle funzioni coperte

## Prossimo passo atomico

Rilanciare il **giro a 19 banchi del browser**, che è morto col riavvio del
contenitore e da allora non è più girato: nel frattempo sono state toccate sei
superfici (le correzioni sul giorno locale, quella su Scudo e quella su Flotta),
e nessuna di quelle modifiche è stata vista da un banco. È il controllo che
manca alla giornata.

## Bloccanti

- Nessuno.
